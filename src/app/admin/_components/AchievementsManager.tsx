"use client";

import { useState, useEffect } from "react";
import { FirebaseService } from "@/lib/services/firebase.service";
import { Achievement } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Edit, Trash, X } from "lucide-react";
import { toast } from "sonner";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import Image from "next/image";

const achievementsService = new FirebaseService<Achievement>("achievements");

export default function AchievementsManager() {
  const [items, setItems] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  const [currentItem, setCurrentItem] = useState<Partial<Achievement>>({
    title: "", description: "", date: "", link: "", imageUrl: ""
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = await achievementsService.getAll();
      setItems(data);
    } catch {
      toast.error("Error fetching achievements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchItems();
  }, []);

  const handleSave = async () => {
    if (!currentItem.title || !currentItem.date) return toast.error("Title and Date are required");

    let finalImageUrl = currentItem.imageUrl || "";
    
    try {
      toast.loading("Saving...", { id: "save-ach" });
      
      if (imageFile) {
        const storageRef = ref(storage, `gallery/${Date.now()}_${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        finalImageUrl = await getDownloadURL(storageRef);
      }

      const data = { 
        title: currentItem.title,
        description: currentItem.description || "",
        date: currentItem.date,
        link: currentItem.link || "",
        imageUrl: finalImageUrl,
      };

      if (currentItem.id) {
        await achievementsService.update(currentItem.id, data);
      } else {
        await achievementsService.create(data);
      }

      toast.success("Saved successfully!", { id: "save-ach" });
      setIsEditing(false);
      setCurrentItem({ title: "", description: "", date: "", link: "", imageUrl: "" });
      setImageFile(null);
      fetchItems();
    } catch (error) {
      console.error("Error saving:", error);
      toast.error("Error saving", { id: "save-ach" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      toast.loading("Deleting...", { id: "del-ach" });
      await achievementsService.delete(id);
      toast.success("Deleted successfully", { id: "del-ach" });
      fetchItems();
    } catch (error) {
      console.error("Error deleting:", error);
      toast.error("Error deleting", { id: "del-ach" });
    }
  };

  if (loading && items.length === 0) return <div className="p-8 text-center text-foreground/50">Loading achievements...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Manage Achievements</h2>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)} className="gap-2 rounded-full">
            <Plus size={16} /> Add Achievement
          </Button>
        )}
      </div>

      {isEditing ? (
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{currentItem.id ? "Edit Achievement" : "New Achievement"}</h3>
              <Button variant="ghost" size="icon" onClick={() => setIsEditing(false)}>
                <X size={16} />
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input 
                  value={currentItem.title} 
                  onChange={(e) => setCurrentItem({ ...currentItem, title: e.target.value })} 
                  placeholder="E.g., 1st Place Hackathon"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <Input 
                  type="date"
                  value={currentItem.date} 
                  onChange={(e) => setCurrentItem({ ...currentItem, date: e.target.value })} 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea 
                value={currentItem.description} 
                onChange={(e) => setCurrentItem({ ...currentItem, description: e.target.value })} 
                placeholder="Description of the achievement..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Link (Optional)</label>
              <Input 
                value={currentItem.link} 
                onChange={(e) => setCurrentItem({ ...currentItem, link: e.target.value })} 
                placeholder="https://..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Image (Optional)</label>
              <div className="flex items-center gap-4">
                <Input type="file" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
                {currentItem.imageUrl && <Image src={currentItem.imageUrl} alt="Preview" width={40} height={40} className="h-10 w-10 object-cover rounded" />}
              </div>
            </div>

            <Button onClick={handleSave} className="w-full mt-4">Save Achievement</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item) => (
            <Card key={item.id} className="bg-secondary/20">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold">{item.title}</h3>
                    <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">{item.date}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => { setCurrentItem(item); setIsEditing(true); }}>
                      <Edit size={16} className="text-blue-500" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id as string)}>
                      <Trash size={16} className="text-red-500" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-foreground/70 line-clamp-2">{item.description}</p>
              </CardContent>
            </Card>
          ))}
          {items.length === 0 && !loading && (
            <div className="col-span-full p-12 text-center text-foreground/50 border border-dashed border-foreground/20 rounded-3xl">
              No achievements found. Add one to get started.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
