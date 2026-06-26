"use client";

import { useState, useEffect } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { FirebaseService } from "@/lib/services/firebase.service";
import { Blog } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Edit, Trash, X } from "lucide-react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import LinkExtension from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "next/image";
import { toast } from "sonner";

const blogService = new FirebaseService<Blog>("blogs");

export default function BlogManager() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  const [currentBlog, setCurrentBlog] = useState<Partial<Blog>>({
    title: "", slug: "", category: "", content: "", excerpt: "", coverImage: "", published: true, tags: []
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      LinkExtension.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: "Write your amazing blog post here..." })
    ],
    content: currentBlog.content,
    onUpdate: ({ editor }) => {
      setCurrentBlog(prev => ({ ...prev, content: editor.getHTML() }));
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px] border rounded-md p-4 bg-background",
      },
    },
  });

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const data = await blogService.getAll();
      setBlogs(data);
    } catch {
      toast.error("Error fetching blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchBlogs();
  }, []);

  useEffect(() => {
    if (editor && currentBlog.content !== editor.getHTML()) {
      editor.commands.setContent(currentBlog.content || "");
    }
  }, [currentBlog.id, currentBlog.content, editor]);

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    if (!currentBlog.id) {
      setCurrentBlog({ ...currentBlog, title, slug: generateSlug(title) });
    } else {
      setCurrentBlog({ ...currentBlog, title });
    }
  };

  const handleSave = async () => {
    if (!currentBlog.title || !currentBlog.slug) return toast.error("Title and Slug are required");

    let finalImageUrl = currentBlog.coverImage || "";
    
    try {
      toast.loading("Saving blog post...", { id: "save-blog" });
      
      if (imageFile) {
        const storageRef = ref(storage, `blog/${Date.now()}_${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        finalImageUrl = await getDownloadURL(storageRef);
      }

      const blogData = { 
        title: currentBlog.title,
        slug: currentBlog.slug,
        category: currentBlog.category || "",
        excerpt: currentBlog.excerpt || "",
        content: currentBlog.content || "",
        coverImage: finalImageUrl,
        published: currentBlog.published !== false,
        tags: currentBlog.tags || []
      };

      if (currentBlog.id) {
        await blogService.update(currentBlog.id, blogData);
      } else {
        await blogService.create(blogData);
      }

      toast.success("Blog post saved successfully!", { id: "save-blog" });
      setIsEditing(false);
      setCurrentBlog({ title: "", slug: "", category: "", content: "", excerpt: "", coverImage: "", published: true, tags: [] });
      setImageFile(null);
      editor?.commands.setContent("");
      fetchBlogs();
    } catch (error) {
      console.error("Error saving blog: ", error);
      toast.error("Error saving blog post", { id: "save-blog" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      toast.loading("Deleting post...", { id: "delete-blog" });
      await blogService.delete(id);
      toast.success("Blog post deleted", { id: "delete-blog" });
      fetchBlogs();
    } catch (error) {
      console.error("Error deleting blog: ", error);
      toast.error("Error deleting blog post", { id: "delete-blog" });
    }
  };

  if (loading && blogs.length === 0) return <div className="p-8 text-center text-foreground/50">Loading blogs...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Manage Blogs</h2>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)} className="gap-2 rounded-full">
            <Plus size={16} /> Write Post
          </Button>
        )}
      </div>

      {isEditing ? (
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{currentBlog.id ? "Edit Post" : "New Post"}</h3>
              <Button variant="ghost" size="icon" onClick={() => setIsEditing(false)}>
                <X size={16} />
              </Button>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Post Title</label>
              <Input 
                value={currentBlog.title} 
                onChange={handleTitleChange} 
                placeholder="The Future of Web Development"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Slug (URL)</label>
                <Input 
                  value={currentBlog.slug} 
                  onChange={(e) => setCurrentBlog({ ...currentBlog, slug: e.target.value })} 
                  placeholder="future-of-web-dev"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Input 
                  value={currentBlog.category} 
                  onChange={(e) => setCurrentBlog({ ...currentBlog, category: e.target.value })} 
                  placeholder="Technology"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Excerpt (Short Summary)</label>
              <Input 
                value={currentBlog.excerpt} 
                onChange={(e) => setCurrentBlog({ ...currentBlog, excerpt: e.target.value })} 
                placeholder="A brief summary of the post..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Cover Image</label>
              <div className="flex items-center gap-4">
                <Input type="file" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
                {currentBlog.coverImage && <Image src={currentBlog.coverImage} alt="Preview" width={40} height={40} className="h-10 w-10 object-cover rounded" />}
              </div>
            </div>

            <div className="space-y-2 mt-4">
              <label className="text-sm font-medium mb-2 block">Content (Tiptap Editor)</label>
              <div className="border rounded-md p-1 flex gap-1 mb-2 bg-secondary/50">
                <Button variant="ghost" size="sm" onClick={() => editor?.chain().focus().toggleBold().run()} className={editor?.isActive('bold') ? 'bg-secondary' : ''}>Bold</Button>
                <Button variant="ghost" size="sm" onClick={() => editor?.chain().focus().toggleItalic().run()} className={editor?.isActive('italic') ? 'bg-secondary' : ''}>Italic</Button>
                <Button variant="ghost" size="sm" onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} className={editor?.isActive('heading', { level: 2 }) ? 'bg-secondary' : ''}>H2</Button>
                <Button variant="ghost" size="sm" onClick={() => editor?.chain().focus().toggleBulletList().run()} className={editor?.isActive('bulletList') ? 'bg-secondary' : ''}>Bullet List</Button>
              </div>
              <EditorContent editor={editor} />
            </div>

            <Button onClick={handleSave} className="w-full mt-4">Publish Post</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blogs.map((blog) => (
            <Card key={blog.id} className="bg-secondary/20">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold">{blog.title}</h3>
                    <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">{blog.category || "Uncategorized"}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => { setCurrentBlog(blog); setIsEditing(true); }}>
                      <Edit size={16} className="text-blue-500" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(blog.id as string)}>
                      <Trash size={16} className="text-red-500" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-foreground/70 line-clamp-2">{blog.excerpt}</p>
              </CardContent>
            </Card>
          ))}
          {blogs.length === 0 && !loading && (
            <div className="col-span-full p-12 text-center text-foreground/50 border border-dashed border-foreground/20 rounded-3xl">
              No blog posts found. Write your first post.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
