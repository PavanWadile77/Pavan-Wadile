"use client";

import { useState, useEffect } from "react";
import { FirebaseService } from "@/lib/services/firebase.service";
import { GalleryItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash, X } from "lucide-react";
import { toast } from "sonner";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import Image from "next/image";

const galleryService = new FirebaseService<GalleryItem>("gallery");

export default function GalleryManager() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  
  const [currentItem, setCurrentItem] = useState<Partial<GalleryItem>>({
    title: "", description: "", category: "Events", imageUrl: ""
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = await galleryService.getAll();
      setItems(data);
    } catch {
      toast.error("Error fetching gallery items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchItems();
  }, []);

  const handleUpload = async () => {
    if (!imageFile) return toast.error("Please select an image");
    if (!currentItem.category) return toast.error("Category is required");

    try {
      setIsUploading(true);
      toast.loading("Uploading image...", { id: "upload-gallery" });
      
      const storageRef = ref(storage, `gallery/${Date.now()}_${imageFile.name}`);
      await uploadBytes(storageRef, imageFile);
      const imageUrl = await getDownloadURL(storageRef);

      const data = { 
        title: currentItem.title || "",
        description: currentItem.description || "",
        category: currentItem.category,
        imageUrl,
      };

      await galleryService.create(data);

      toast.success("Uploaded successfully!", { id: "upload-gallery" });
      setIsUploading(false);
      setCurrentItem({ title: "", description: "", category: "Events", imageUrl: "" });
      setImageFile(null);
      fetchItems();
    } catch (error) {
      console.error("Error uploading:", error);
      toast.error("Error uploading image", { id: "upload-gallery" });
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      toast.loading("Deleting...", { id: "del-gallery" });
      await galleryService.delete(id);
      toast.success("Deleted successfully", { id: "del-gallery" });
      fetchItems();
    } catch (error) {
      console.error("Error deleting:", error);
      toast.error("Error deleting", { id: "del-gallery" });
    }
  };

  if (loading && items.length === 0) return <div className="p-8 text-center text-foreground/50">Loading gallery...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Manage Gallery</h2>
        {!isUploading && (
          <Button onClick={() => setIsUploading(true)} className="gap-2 rounded-full">
            <Plus size={16} /> Upload Image
          </Button>
        )}
      </div>

      {isUploading ? (
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Upload New Image</h3>
              <Button variant="ghost" size="icon" onClick={() => setIsUploading(false)}>
                <X size={16} />
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title (Optional)</label>
                <Input 
                  value={currentItem.title} 
                  onChange={(e) => setCurrentItem({ ...currentItem, title: e.target.value })} 
                  placeholder="Hackathon Team Photo"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Input 
                  value={currentItem.category} 
                  onChange={(e) => setCurrentItem({ ...currentItem, category: e.target.value })} 
                  placeholder="Events, Hackathons, Personal"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description (Optional)</label>
              <Textarea 
                value={currentItem.description} 
                onChange={(e) => setCurrentItem({ ...currentItem, description: e.target.value })} 
                placeholder="A brief description of this photo..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Image File</label>
              <Input type="file" onChange={(e) => setImageFile(e.target.files?.[0] || null)} accept="image/*" />
            </div>

            <Button onClick={handleUpload} className="w-full mt-4" disabled={!imageFile}>Upload to Gallery</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map((item) => (
            <Card key={item.id} className="bg-secondary/20 overflow-hidden group relative">
              <div className="aspect-square relative">
                <Image src={item.imageUrl} alt={item.title || "Gallery image"} fill className="object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4">
                  <div className="text-white flex justify-between items-start">
                    <div>
                      <span className="text-xs bg-primary/80 px-2 py-1 rounded-full">{item.category}</span>
                      {item.title && <p className="font-semibold text-sm mt-2">{item.title}</p>}
                    </div>
                    <Button variant="destructive" size="icon" className="h-8 w-8 rounded-full" onClick={() => handleDelete(item.id as string)}>
                      <Trash size={14} />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
          {items.length === 0 && !loading && (
            <div className="col-span-full p-12 text-center text-foreground/50 border border-dashed border-foreground/20 rounded-3xl">
              No photos found. Upload one to get started.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
