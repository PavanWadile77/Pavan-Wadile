"use client";

import { useState, useEffect } from "react";
import { FirebaseService } from "@/lib/services/firebase.service";
import { Testimonial } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Edit, Trash, X } from "lucide-react";
import { toast } from "sonner";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import Image from "next/image";

const testimonialsService = new FirebaseService<Testimonial>("testimonials");

export default function TestimonialsManager() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  const [currentItem, setCurrentItem] = useState<Partial<Testimonial>>({
    name: "", role: "", company: "", content: "", avatarUrl: ""
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = await testimonialsService.getAll();
      setItems(data);
    } catch {
      toast.error("Error fetching testimonials");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchItems();
  }, []);

  const handleSave = async () => {
    if (!currentItem.name || !currentItem.role || !currentItem.content) {
      return toast.error("Name, Role, and Content are required");
    }

    let finalImageUrl = currentItem.avatarUrl || "";
    
    try {
      toast.loading("Saving...", { id: "save-test" });
      
      if (imageFile) {
        const storageRef = ref(storage, `gallery/${Date.now()}_${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        finalImageUrl = await getDownloadURL(storageRef);
      }

      const data = { 
        name: currentItem.name,
        role: currentItem.role,
        company: currentItem.company || "",
        content: currentItem.content,
        avatarUrl: finalImageUrl,
      };

      if (currentItem.id) {
        await testimonialsService.update(currentItem.id, data);
      } else {
        await testimonialsService.create(data);
      }

      toast.success("Saved successfully!", { id: "save-test" });
      setIsEditing(false);
      setCurrentItem({ name: "", role: "", company: "", content: "", avatarUrl: "" });
      setImageFile(null);
      fetchItems();
    } catch (error) {
      console.error("Error saving:", error);
      toast.error("Error saving", { id: "save-test" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      toast.loading("Deleting...", { id: "del-test" });
      await testimonialsService.delete(id);
      toast.success("Deleted successfully", { id: "del-test" });
      fetchItems();
    } catch (error) {
      console.error("Error deleting:", error);
      toast.error("Error deleting", { id: "del-test" });
    }
  };

  if (loading && items.length === 0) return <div className="p-8 text-center text-foreground/50">Loading testimonials...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Manage Testimonials</h2>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)} className="gap-2 rounded-full">
            <Plus size={16} /> Add Testimonial
          </Button>
        )}
      </div>

      {isEditing ? (
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{currentItem.id ? "Edit Testimonial" : "New Testimonial"}</h3>
              <Button variant="ghost" size="icon" onClick={() => setIsEditing(false)}>
                <X size={16} />
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Author Name</label>
                <Input 
                  value={currentItem.name} 
                  onChange={(e) => setCurrentItem({ ...currentItem, name: e.target.value })} 
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Role</label>
                <Input 
                  value={currentItem.role} 
                  onChange={(e) => setCurrentItem({ ...currentItem, role: e.target.value })} 
                  placeholder="CEO, Engineer, Client"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Company (Optional)</label>
              <Input 
                value={currentItem.company} 
                onChange={(e) => setCurrentItem({ ...currentItem, company: e.target.value })} 
                placeholder="Tech Corp"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Content / Review</label>
              <Textarea 
                value={currentItem.content} 
                onChange={(e) => setCurrentItem({ ...currentItem, content: e.target.value })} 
                placeholder="Write the testimonial here..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Avatar Image (Optional)</label>
              <div className="flex items-center gap-4">
                <Input type="file" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
                {currentItem.avatarUrl && <Image src={currentItem.avatarUrl} alt="Preview" width={40} height={40} className="h-10 w-10 object-cover rounded-full" />}
              </div>
            </div>

            <Button onClick={handleSave} className="w-full mt-4">Save Testimonial</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item) => (
            <Card key={item.id} className="bg-secondary/20">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    {item.avatarUrl ? (
                      <Image src={item.avatarUrl} alt={item.name} width={40} height={40} className="w-10 h-10 object-cover rounded-full" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                        {item.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h3 className="text-md font-bold leading-tight">{item.name}</h3>
                      <p className="text-xs text-foreground/60">{item.role} {item.company && `at ${item.company}`}</p>
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
                <div className="text-sm text-foreground/80 italic border-l-2 border-primary/50 pl-3">
                  &quot;{item.content}&quot;
                </div>
              </CardContent>
            </Card>
          ))}
          {items.length === 0 && !loading && (
            <div className="col-span-full p-12 text-center text-foreground/50 border border-dashed border-foreground/20 rounded-3xl">
              No testimonials found. Add one to get started.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
