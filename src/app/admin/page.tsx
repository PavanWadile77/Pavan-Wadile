"use client";

import { useAuth } from "@/components/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard, FileText, Briefcase, Code, Award, Image as ImageIcon, MessageSquare, Settings, FileBadge, Link as LinkIcon, File } from "lucide-react";
import ProjectsManager from "./_components/ProjectsManager";
import BlogManager from "./_components/BlogManager";
import AchievementsManager from "./_components/AchievementsManager";
import CertificatesManager from "./_components/CertificatesManager";
import SkillsManager from "./_components/SkillsManager";
import GalleryManager from "./_components/GalleryManager";
import TestimonialsManager from "./_components/TestimonialsManager";
import MessagesManager from "./_components/MessagesManager";
import SeoManager from "./_components/SeoManager";
import VisitorStatsViewer from "./_components/VisitorStatsViewer";
import Image from "next/image";

export default function AdminDashboard() {
  const { user, signOut } = useAuth();

  return (
    <div className="container mx-auto py-24 px-6 min-h-screen">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4 bg-secondary/30 p-6 rounded-3xl border border-foreground/5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-primary/20">
            {user?.photoURL ? (
              <Image src={user.photoURL} alt="Admin" width={48} height={48} className="w-full h-full object-cover" />
            ) : (
              <Image src="/images/profile.jpg" alt="Admin" width={48} height={48} className="w-full h-full object-cover" />
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-foreground/60 text-sm">{user?.email}</p>
          </div>
        </div>
        <Button variant="destructive" onClick={signOut} className="gap-2 rounded-full">
          <LogOut size={16} /> Sign Out
        </Button>
      </div>

      <Tabs defaultValue="projects" className="space-y-8">
        <TabsList className="flex flex-wrap h-auto gap-2 justify-start bg-transparent border-b border-border pb-4 w-full">
          <TabsTrigger value="dashboard" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-6 gap-2">
            <LayoutDashboard size={16} /> Analytics
          </TabsTrigger>
          <TabsTrigger value="projects" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-6 gap-2">
            <Briefcase size={16} /> Projects
          </TabsTrigger>
          <TabsTrigger value="blogs" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-6 gap-2">
            <FileText size={16} /> Blog CMS
          </TabsTrigger>
          <TabsTrigger value="skills" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-6 gap-2">
            <Code size={16} /> Skills
          </TabsTrigger>
          <TabsTrigger value="achievements" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-6 gap-2">
            <Award size={16} /> Achievements
          </TabsTrigger>
          <TabsTrigger value="certificates" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-6 gap-2">
            <FileBadge size={16} /> Certificates
          </TabsTrigger>
          <TabsTrigger value="gallery" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-6 gap-2">
            <ImageIcon size={16} /> Gallery
          </TabsTrigger>
          <TabsTrigger value="testimonials" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-6 gap-2">
            <MessageSquare size={16} /> Testimonials
          </TabsTrigger>
          <TabsTrigger value="messages" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-6 gap-2">
            <MessageSquare size={16} /> Messages
          </TabsTrigger>
          <TabsTrigger value="resume" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-6 gap-2">
            <File size={16} /> Resume
          </TabsTrigger>
          <TabsTrigger value="links" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-6 gap-2">
            <LinkIcon size={16} /> Links
          </TabsTrigger>
          <TabsTrigger value="seo" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-6 gap-2">
            <Settings size={16} /> SEO & Site
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <VisitorStatsViewer />
        </TabsContent>

        <TabsContent value="projects">
          <ProjectsManager />
        </TabsContent>

        <TabsContent value="blogs">
          <BlogManager />
        </TabsContent>
        
        <TabsContent value="skills">
          <SkillsManager />
        </TabsContent>

        <TabsContent value="achievements">
          <AchievementsManager />
        </TabsContent>

        <TabsContent value="certificates">
          <CertificatesManager />
        </TabsContent>

        <TabsContent value="gallery">
          <GalleryManager />
        </TabsContent>

        <TabsContent value="testimonials">
          <TestimonialsManager />
        </TabsContent>

        <TabsContent value="messages">
          <MessagesManager />
        </TabsContent>

        <TabsContent value="resume">
          <div className="p-12 text-center text-foreground/50 border border-dashed border-foreground/20 rounded-3xl">
            Resume Manager Module (To be implemented)
          </div>
        </TabsContent>

        <TabsContent value="links">
          <div className="p-12 text-center text-foreground/50 border border-dashed border-foreground/20 rounded-3xl">
            Social Links Module (To be implemented)
          </div>
        </TabsContent>

        <TabsContent value="seo">
          <SeoManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}
