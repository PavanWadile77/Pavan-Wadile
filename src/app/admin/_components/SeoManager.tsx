"use client";

import { useState, useEffect } from "react";
import { FirebaseService } from "@/lib/services/firebase.service";
import { SeoSetting } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import Image from "next/image";

const seoService = new FirebaseService<SeoSetting>("seo_settings");

export default function SeoManager() {
  const [settings, setSettings] = useState<Partial<SeoSetting>>({
    titleTemplate: "%s | Pavan Wadile",
    defaultTitle: "Pavan Wadile - Full Stack Developer",
    defaultDescription: "Portfolio of Pavan Wadile, a passionate Full Stack Developer.",
    defaultKeywords: ["Pavan Wadile", "Developer", "Portfolio"],
    ogImage: "",
    twitterHandle: "@pavanwadile"
  });
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await seoService.getAll();
      if (data.length > 0) {
        setSettings(data[0]);
      }
    } catch {
      toast.error("Error fetching SEO settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchSettings();
  }, []);

  const handleSave = async () => {
    let finalImageUrl = settings.ogImage || "";
    
    try {
      toast.loading("Saving SEO settings...", { id: "save-seo" });
      
      if (imageFile) {
        const storageRef = ref(storage, `seo/${Date.now()}_${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        finalImageUrl = await getDownloadURL(storageRef);
      }

      const data = { 
        titleTemplate: settings.titleTemplate || "",
        defaultTitle: settings.defaultTitle || "",
        defaultDescription: settings.defaultDescription || "",
        defaultKeywords: settings.defaultKeywords || [],
        ogImage: finalImageUrl,
        twitterHandle: settings.twitterHandle || "",
      };

      if (settings.id) {
        await seoService.update(settings.id, data);
      } else {
        await seoService.create(data);
      }

      toast.success("SEO settings saved successfully!", { id: "save-seo" });
      setImageFile(null);
      fetchSettings();
    } catch (error) {
      console.error("Error saving:", error);
      toast.error("Error saving SEO settings", { id: "save-seo" });
    }
  };

  if (loading && !settings.id) return <div className="p-8 text-center text-foreground/50">Loading settings...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">SEO & Site Settings</h2>
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Default Page Title</label>
              <Input 
                value={settings.defaultTitle} 
                onChange={(e) => setSettings({ ...settings, defaultTitle: e.target.value })} 
                placeholder="Pavan Wadile - Developer"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Title Template</label>
              <Input 
                value={settings.titleTemplate} 
                onChange={(e) => setSettings({ ...settings, titleTemplate: e.target.value })} 
                placeholder="%s | Pavan Wadile"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Default Meta Description</label>
            <Textarea 
              value={settings.defaultDescription} 
              onChange={(e) => setSettings({ ...settings, defaultDescription: e.target.value })} 
              placeholder="A brief description of your site for search engines..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Meta Keywords (comma separated)</label>
              <Input 
                value={settings.defaultKeywords?.join(", ")} 
                onChange={(e) => setSettings({ ...settings, defaultKeywords: e.target.value.split(",").map(k => k.trim()) })} 
                placeholder="developer, react, nextjs"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Twitter Handle</label>
              <Input 
                value={settings.twitterHandle} 
                onChange={(e) => setSettings({ ...settings, twitterHandle: e.target.value })} 
                placeholder="@username"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Default OpenGraph Image (Used for social sharing)</label>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <Input type="file" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
              {(settings.ogImage || imageFile) && (
                <div className="relative w-48 h-24 border rounded overflow-hidden flex-shrink-0">
                  {settings.ogImage && !imageFile && (
                    <Image src={settings.ogImage} alt="OG Preview" fill className="object-cover" />
                  )}
                  {imageFile && (
                    <Image src={URL.createObjectURL(imageFile)} alt="OG Preview" fill className="object-cover" />
                  )}
                </div>
              )}
            </div>
          </div>

          <Button onClick={handleSave} className="w-full mt-4">Save SEO Settings</Button>
        </CardContent>
      </Card>
    </div>
  );
}
