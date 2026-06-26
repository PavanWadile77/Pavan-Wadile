"use client";

import { useState, useEffect } from "react";
import { FirebaseService } from "@/lib/services/firebase.service";
import { Certificate } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Edit, Trash, X } from "lucide-react";
import { toast } from "sonner";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import Image from "next/image";

const certificatesService = new FirebaseService<Certificate>("certificates");

export default function CertificatesManager() {
  const [items, setItems] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  const [currentItem, setCurrentItem] = useState<Partial<Certificate>>({
    title: "", issuer: "", issueDate: "", credentialId: "", credentialUrl: "", imageUrl: ""
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = await certificatesService.getAll();
      setItems(data);
    } catch {
      toast.error("Error fetching certificates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchItems();
  }, []);

  const handleSave = async () => {
    if (!currentItem.title || !currentItem.issuer || !currentItem.issueDate) {
      return toast.error("Title, Issuer, and Issue Date are required");
    }

    let finalImageUrl = currentItem.imageUrl || "";
    
    try {
      toast.loading("Saving...", { id: "save-cert" });
      
      if (imageFile) {
        const storageRef = ref(storage, `certificates/${Date.now()}_${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        finalImageUrl = await getDownloadURL(storageRef);
      }

      const data = { 
        title: currentItem.title,
        issuer: currentItem.issuer,
        issueDate: currentItem.issueDate,
        credentialId: currentItem.credentialId || "",
        credentialUrl: currentItem.credentialUrl || "",
        imageUrl: finalImageUrl,
      };

      if (currentItem.id) {
        await certificatesService.update(currentItem.id, data);
      } else {
        await certificatesService.create(data);
      }

      toast.success("Saved successfully!", { id: "save-cert" });
      setIsEditing(false);
      setCurrentItem({ title: "", issuer: "", issueDate: "", credentialId: "", credentialUrl: "", imageUrl: "" });
      setImageFile(null);
      fetchItems();
    } catch (error) {
      console.error("Error saving:", error);
      toast.error("Error saving", { id: "save-cert" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      toast.loading("Deleting...", { id: "del-cert" });
      await certificatesService.delete(id);
      toast.success("Deleted successfully", { id: "del-cert" });
      fetchItems();
    } catch (error) {
      console.error("Error deleting:", error);
      toast.error("Error deleting", { id: "del-cert" });
    }
  };

  if (loading && items.length === 0) return <div className="p-8 text-center text-foreground/50">Loading certificates...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Manage Certificates</h2>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)} className="gap-2 rounded-full">
            <Plus size={16} /> Add Certificate
          </Button>
        )}
      </div>

      {isEditing ? (
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{currentItem.id ? "Edit Certificate" : "New Certificate"}</h3>
              <Button variant="ghost" size="icon" onClick={() => setIsEditing(false)}>
                <X size={16} />
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Certificate Name</label>
                <Input 
                  value={currentItem.title} 
                  onChange={(e) => setCurrentItem({ ...currentItem, title: e.target.value })} 
                  placeholder="AWS Solutions Architect"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Issuer</label>
                <Input 
                  value={currentItem.issuer} 
                  onChange={(e) => setCurrentItem({ ...currentItem, issuer: e.target.value })} 
                  placeholder="Amazon Web Services"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Issue Date</label>
                <Input 
                  type="date"
                  value={currentItem.issueDate} 
                  onChange={(e) => setCurrentItem({ ...currentItem, issueDate: e.target.value })} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Credential ID (Optional)</label>
                <Input 
                  value={currentItem.credentialId} 
                  onChange={(e) => setCurrentItem({ ...currentItem, credentialId: e.target.value })} 
                  placeholder="123456789"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Credential URL (Optional)</label>
              <Input 
                value={currentItem.credentialUrl} 
                onChange={(e) => setCurrentItem({ ...currentItem, credentialUrl: e.target.value })} 
                placeholder="https://..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Certificate Image</label>
              <div className="flex items-center gap-4">
                <Input type="file" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
                {currentItem.imageUrl && <Image src={currentItem.imageUrl} alt="Preview" width={40} height={40} className="h-10 w-10 object-cover rounded" />}
              </div>
            </div>

            <Button onClick={handleSave} className="w-full mt-4">Save Certificate</Button>
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
                    <p className="text-sm text-foreground/70">{item.issuer} • {item.issueDate}</p>
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
                {item.credentialId && (
                  <div className="text-xs text-foreground/50 mt-2">ID: {item.credentialId}</div>
                )}
              </CardContent>
            </Card>
          ))}
          {items.length === 0 && !loading && (
            <div className="col-span-full p-12 text-center text-foreground/50 border border-dashed border-foreground/20 rounded-3xl">
              No certificates found. Add one to get started.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
