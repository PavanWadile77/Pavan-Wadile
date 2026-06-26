import { ExternalLink } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { adminDb } from "@/lib/firebase-admin";
import Image from "next/image";

export const metadata = {
  title: "Projects | Pavan Kishor Wadile",
  description: "Explore my latest full-stack projects, mobile apps, and open-source contributions.",
};

export const dynamic = 'force-dynamic';

async function getProjects() {
  try {
    const snapshot = await adminDb.collection("projects").get();
    if (snapshot.empty) return [];
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data()
    })) as { id: string; title: string; description: string; features: string[]; technologies: string[]; github: string; demo: string; image: string; }[];
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return [];
  }
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="container mx-auto py-24 px-6 mt-16">
      <div className="max-w-4xl mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Selected Works</h1>
        <p className="text-xl text-foreground/70">
          A showcase of my recent projects, demonstrating my expertise in full-stack development, 
          mobile applications, and modern web technologies.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {projects.length === 0 ? (
          <div className="col-span-2 text-center p-12 text-foreground/50 border border-dashed rounded-3xl">
            No projects published yet. Check back soon!
          </div>
        ) : (
          projects.map((project) => (
            <div 
              key={project.id} 
              className="group relative bg-secondary/30 rounded-3xl border border-foreground/5 overflow-hidden hover:border-primary/30 transition-all duration-500 flex flex-col h-full"
            >
              {project.image && (
                <div className="w-full h-64 overflow-hidden bg-foreground/5 relative">
                  <Image 
                    src={project.image} 
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              )}
              
              <div className="p-8 flex flex-col flex-1">
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies?.map((tech: string, i: number) => (
                    <span key={i} className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                      {tech}
                    </span>
                  ))}
                </div>
                
                <h3 className="text-2xl font-bold mb-3">{project.title}</h3>
                <p className="text-foreground/70 mb-6 leading-relaxed line-clamp-3">
                  {project.description}
                </p>

                {project.features && project.features.length > 0 && (
                  <ul className="mb-8 space-y-2">
                    {project.features.map((feature: string, i: number) => (
                      <li key={i} className="text-sm text-foreground/80 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                )}
                
                <div className="flex items-center gap-4 mt-auto pt-4 border-t border-foreground/10">
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
                      <FaGithub size={18} /> Code
                    </a>
                  )}
                  {project.demo && (
                    <a href={project.demo} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors ml-4">
                      <ExternalLink size={18} /> Live Demo
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
