"use client";

import { useState, useEffect } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { FirebaseService } from "@/lib/services/firebase.service";
import { Project } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Edit, Trash, X } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

const projectsService = new FirebaseService<Project>("projects");

export default function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  const [currentProject, setCurrentProject] = useState<Partial<Project>>({
    title: "", description: "", content: "", slug: "", technologies: [], githubUrl: "", liveUrl: "", imageUrl: "", featured: false
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await projectsService.getAll();
      setProjects(data);
    } catch {
      toast.error("Error fetching projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProjects();
  }, []);

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    if (!currentProject.id) {
      setCurrentProject({ ...currentProject, title, slug: generateSlug(title) });
    } else {
      setCurrentProject({ ...currentProject, title });
    }
  };

  const handleSave = async () => {
    if (!currentProject.title || !currentProject.slug) return toast.error("Title and Slug are required");

    let finalImageUrl = currentProject.imageUrl || "";
    
    try {
      toast.loading("Saving project...", { id: "save-project" });
      if (imageFile) {
        const storageRef = ref(storage, `projects/${Date.now()}_${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        finalImageUrl = await getDownloadURL(storageRef);
      }

      const projectData = { 
        title: currentProject.title,
        slug: currentProject.slug,
        description: currentProject.description || "",
        content: currentProject.content || "",
        technologies: currentProject.technologies || [], 
        githubUrl: currentProject.githubUrl || "", 
        liveUrl: currentProject.liveUrl || "", 
        imageUrl: finalImageUrl,
        featured: currentProject.featured || false
      };

      if (currentProject.id) {
        await projectsService.update(currentProject.id, projectData);
      } else {
        await projectsService.create(projectData);
      }

      toast.success("Project saved successfully!", { id: "save-project" });
      setIsEditing(false);
      setCurrentProject({ title: "", description: "", content: "", slug: "", technologies: [], githubUrl: "", liveUrl: "", imageUrl: "", featured: false });
      setImageFile(null);
      fetchProjects();
    } catch (error) {
      console.error("Error saving project: ", error);
      toast.error("Error saving project", { id: "save-project" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      toast.loading("Deleting project...", { id: "delete-project" });
      await projectsService.delete(id);
      toast.success("Project deleted", { id: "delete-project" });
      fetchProjects();
    } catch (error) {
      console.error("Error deleting project: ", error);
      toast.error("Error deleting project", { id: "delete-project" });
    }
  };

  if (loading && projects.length === 0) return <div className="p-8 text-center text-foreground/50">Loading projects...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Manage Projects</h2>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)} className="gap-2 rounded-full">
            <Plus size={16} /> Add Project
          </Button>
        )}
      </div>

      {isEditing ? (
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{currentProject.id ? "Edit Project" : "New Project"}</h3>
              <Button variant="ghost" size="icon" onClick={() => setIsEditing(false)}>
                <X size={16} />
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input 
                  value={currentProject.title} 
                  onChange={handleTitleChange} 
                  placeholder="Project Title"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Slug</label>
                <Input 
                  value={currentProject.slug} 
                  onChange={(e) => setCurrentProject({ ...currentProject, slug: e.target.value })} 
                  placeholder="project-slug"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea 
                value={currentProject.description} 
                onChange={(e) => setCurrentProject({ ...currentProject, description: e.target.value })} 
                placeholder="Project Description"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Technologies (comma separated)</label>
              <Input 
                value={currentProject.technologies?.join(", ")} 
                onChange={(e) => setCurrentProject({ ...currentProject, technologies: e.target.value.split(",").map(s => s.trim()) })} 
                placeholder="React, Next.js, Firebase"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">GitHub URL</label>
                <Input 
                  value={currentProject.githubUrl} 
                  onChange={(e) => setCurrentProject({ ...currentProject, githubUrl: e.target.value })} 
                  placeholder="https://github.com/..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Live Demo URL</label>
                <Input 
                  value={currentProject.liveUrl} 
                  onChange={(e) => setCurrentProject({ ...currentProject, liveUrl: e.target.value })} 
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Project Image</label>
              <div className="flex items-center gap-4">
                <Input type="file" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
                {currentProject.imageUrl && <Image src={currentProject.imageUrl} alt="Preview" width={40} height={40} className="h-10 w-10 object-cover rounded" />}
              </div>
            </div>

            <Button onClick={handleSave} className="w-full mt-4">Save Project</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="bg-secondary/20">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold">{project.title}</h3>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => { setCurrentProject(project); setIsEditing(true); }}>
                      <Edit size={16} className="text-blue-500" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(project.id as string)}>
                      <Trash size={16} className="text-red-500" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-foreground/70 mb-4 line-clamp-2">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies?.slice(0, 3).map((tech, i) => (
                    <span key={i} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">{tech}</span>
                  ))}
                  {(project.technologies?.length || 0) > 3 && <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">+{(project.technologies?.length || 0) - 3}</span>}
                </div>
              </CardContent>
            </Card>
          ))}
          {projects.length === 0 && !loading && (
            <div className="col-span-full p-12 text-center text-foreground/50 border border-dashed border-foreground/20 rounded-3xl">
              No projects found. Add one to get started.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
