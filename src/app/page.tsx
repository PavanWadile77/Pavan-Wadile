import Link from "next/link";
import { ArrowRight, Download, Mail } from "lucide-react";
import { FaGithub, FaLinkedin, FaYoutube, FaFacebook, FaGlobe } from "react-icons/fa";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col min-h-[100vh]">
      {/* Hero Section */}
      <section className="relative flex-1 flex items-center justify-center pt-32 pb-20 px-6 overflow-hidden">
        
        {/* Animated Background Gradients */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -z-10 mix-blend-screen animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -z-10 mix-blend-screen animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl -z-10 mix-blend-screen animate-blob animation-delay-4000"></div>

        <div className="max-w-5xl w-full mx-auto flex flex-col items-center text-center z-10">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full relative mb-8 group">
            {/* Glassmorphism ring effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500/20 to-purple-500/20 blur-md group-hover:blur-xl transition-all duration-500"></div>
            {/* Image container */}
            <div className="absolute inset-0 rounded-full overflow-hidden border-4 border-foreground/10 shadow-2xl transition-transform duration-500 group-hover:scale-105 group-hover:border-primary/50 group-hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] bg-secondary">
              <Image 
                src="/images/profile.jpg" 
                alt="Pavan Kishor Wadile" 
                fill 
                className="object-cover"
                sizes="(max-width: 768px) 128px, 160px"
                priority
              />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            Pavan Kishor Wadile
          </h1>
          
          <div className="text-xl md:text-2xl text-foreground/70 mb-10 h-10 font-medium">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
              Information Technology Student & Founder
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
            <Link href="/resume" className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/25 hover:-translate-y-1">
              <Download size={18} />
              Download Resume
            </Link>
            <Link href="/projects" className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-secondary text-secondary-foreground font-medium hover:bg-secondary/80 transition-all shadow-lg hover:-translate-y-1">
              View Projects
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="flex items-center gap-6">
            <a href="https://github.com/PavanWadile77" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-secondary/50 hover:bg-primary hover:text-primary-foreground transition-all">
              <FaGithub size={24} />
            </a>
            <a href="https://www.linkedin.com/in/pavan-wadile-7a7043282/" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-secondary/50 hover:bg-primary hover:text-primary-foreground transition-all">
              <FaLinkedin size={24} />
            </a>
            <a href="https://www.youtube.com/channel/UCOGrSA0TRoyZWdkLk2u30uA" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-secondary/50 hover:bg-red-500 hover:text-white transition-all">
              <FaYoutube size={24} />
            </a>
            <a href="https://www.facebook.com/pavan.wadile.98" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-secondary/50 hover:bg-blue-600 hover:text-white transition-all">
              <FaFacebook size={24} />
            </a>
            <a href="https://pavanwadile77.wixsite.com/wadile" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-secondary/50 hover:bg-green-600 hover:text-white transition-all">
              <FaGlobe size={24} />
            </a>
            <Link href="/contact" className="p-3 rounded-full bg-secondary/50 hover:bg-primary hover:text-primary-foreground transition-all">
              <Mail size={24} />
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce flex flex-col items-center text-foreground/50">
          <span className="text-xs uppercase tracking-widest mb-2 font-medium">Scroll</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-foreground/50 to-transparent"></div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-20 px-6 bg-secondary/20 backdrop-blur-xl border-y border-foreground/5">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: "Projects Completed", value: "10+" },
            { label: "Hackathons", value: "5+" },
            { label: "Certificates", value: "20+" },
            { label: "Visitors", value: "1K+" }
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center justify-center text-center space-y-2 p-6 rounded-3xl bg-background/50 border border-foreground/5 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
              <h3 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">{stat.value}</h3>
              <p className="text-sm font-medium text-foreground/70 uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
