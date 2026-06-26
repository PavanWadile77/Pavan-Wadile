"use client";

import { useState, useEffect } from "react";
import { FirebaseService } from "@/lib/services/firebase.service";
import { Skill } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Edit, Trash, X } from "lucide-react";
import { toast } from "sonner";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import Image from "next/image";

const skillsService = new FirebaseService<Skill>("skills");

export default function SkillsManager() {
  const [items, setItems] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  const [currentItem, setCurrentItem] = useState<Partial<Skill>>({
    name: "", category: "Frontend", iconUrl: "", proficiency: 80, order: 0
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = await skillsService.getAll();
      setItems(data.sort((a, b) => (a.order || 0) - (b.order || 0)));
    } catch {
      toast.error("Error fetching skills");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchItems();
  }, []);

  const handleSave = async () => {
    if (!currentItem.name || !currentItem.category) {
      return toast.error("Name and Category are required");
    }

    let finalImageUrl = currentItem.iconUrl || "";
    
    try {
      toast.loading("Saving...", { id: "save-skill" });
      
      if (imageFile) {
        const storageRef = ref(storage, `gallery/${Date.now()}_${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        finalImageUrl = await getDownloadURL(storageRef);
      }

      const data = { 
        name: currentItem.name,
        category: currentItem.category,
        iconUrl: finalImageUrl,
        proficiency: Number(currentItem.proficiency) || 0,
        order: Number(currentItem.order) || 0,
      };

      if (currentItem.id) {
        await skillsService.update(currentItem.id, data);
      } else {
        await skillsService.create(data);
      }

      toast.success("Saved successfully!", { id: "save-skill" });
      setIsEditing(false);
      setCurrentItem({ name: "", category: "Frontend", iconUrl: "", proficiency: 80, order: 0 });
      setImageFile(null);
      fetchItems();
    } catch (error) {
      console.error("Error saving:", error);
      toast.error("Error saving", { id: "save-skill" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      toast.loading("Deleting...", { id: "del-skill" });
      await skillsService.delete(id);
      toast.success("Deleted successfully", { id: "del-skill" });
      fetchItems();
    } catch (error) {
      console.error("Error deleting:", error);
      toast.error("Error deleting", { id: "del-skill" });
    }
  };

  if (loading && items.length === 0) return <div className="p-8 text-center text-foreground/50">Loading skills...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Manage Skills</h2>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)} className="gap-2 rounded-full">
            <Plus size={16} /> Add Skill
          </Button>
        )}
      </div>

      {isEditing ? (
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{currentItem.id ? "Edit Skill" : "New Skill"}</h3>
              <Button variant="ghost" size="icon" onClick={() => setIsEditing(false)}>
                <X size={16} />
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Skill Name</label>
                <Input 
                  value={currentItem.name} 
                  onChange={(e) => setCurrentItem({ ...currentItem, name: e.target.value })} 
                  placeholder="React"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Input 
                  value={currentItem.category} 
                  onChange={(e) => setCurrentItem({ ...currentItem, category: e.target.value })} 
                  placeholder="Frontend, Backend, Tools"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Proficiency (%)</label>
                <Input 
                  type="number"
                  min="0"
                  max="100"
                  value={currentItem.proficiency} 
                  onChange={(e) => setCurrentItem({ ...currentItem, proficiency: Number(e.target.value) })} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Display Order</label>
                <Input 
                  type="number"
                  value={currentItem.order} 
                  onChange={(e) => setCurrentItem({ ...currentItem, order: Number(e.target.value) })} 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Icon Image (Optional)</label>
              <div className="flex items-center gap-4">
                <Input type="file" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
                {currentItem.iconUrl && <Image src={currentItem.iconUrl} alt="Preview" width={40} height={40} className="h-10 w-10 object-cover rounded" />}
              </div>
            </div>

            <Button onClick={handleSave} className="w-full mt-4">Save Skill</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item) => (
            <Card key={item.id} className="bg-secondary/20">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    {item.iconUrl && <Image src={item.iconUrl} alt={item.name} width={32} height={32} className="w-8 h-8 object-contain" />}
                    <div>
                      <h3 className="text-lg font-bold">{item.name}</h3>
                      <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">{item.category}</span>
                    </div>
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
                <div className="mt-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Proficiency</span>
                    <span>{item.proficiency}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: `${item.proficiency}%` }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {items.length === 0 && !loading && (
            <div className="col-span-full p-12 text-center text-foreground/50 border border-dashed border-foreground/20 rounded-3xl">
              No skills found. Add one to get started.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
