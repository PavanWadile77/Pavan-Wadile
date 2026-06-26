import { FaGithub, FaLinkedin, FaYoutube, FaFacebook, FaGlobe } from "react-icons/fa";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="container mx-auto py-20 px-6 mt-16 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">About Me</h1>
      
      <section className="max-w-4xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row gap-12 items-start">
          <div className="w-48 h-48 md:w-64 md:h-64 rounded-full relative shrink-0 group mx-auto md:mx-0">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500/20 to-purple-500/20 blur-md group-hover:blur-xl transition-all duration-500"></div>
            <div className="absolute inset-0 rounded-full overflow-hidden border-4 border-foreground/10 shadow-2xl transition-transform duration-500 group-hover:scale-105 group-hover:border-primary/50 group-hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] bg-secondary">
              <Image 
                src="/images/profile.jpg" 
                alt="Pavan Kishor Wadile" 
                fill 
                className="object-cover"
                sizes="(max-width: 768px) 192px, 256px"
                priority
              />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-foreground/90">Biography</h2>
            <p className="text-lg text-foreground/70 leading-relaxed text-justify">
              I am Pavan Kishor Wadile, an Information Technology student and the founder of UG eLibrary and Mr.Certi. 
              Passionate about Artificial Intelligence, Web Development, and Cybersecurity, I strive to build innovative 
              software solutions that solve real-world problems. My goal is to continuously learn, adapt to new 
              technologies, and contribute meaningfully to the tech community.
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4 text-foreground/90">Career Objective</h2>
          <p className="text-lg text-foreground/70 leading-relaxed text-justify">
            To secure a challenging position in a reputable organization where I can expand my learnings, 
            knowledge, and skills while contributing to the company&apos;s growth. I am driven by the desire to innovate 
            and create impactful digital experiences.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-6 text-foreground/90">Education Timeline</h2>
          <div className="border-l-2 border-primary/20 pl-6 space-y-8 relative">
            
            <div className="relative">
              <div className="absolute w-4 h-4 bg-primary rounded-full -left-[34px] top-1.5 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
              <h3 className="text-xl font-medium text-primary">Bachelor of Technology in Information Technology</h3>
              <p className="text-foreground/80 font-medium">SVKM&apos;s College of Engineering Shirpur</p>
              <p className="text-foreground/60 text-sm mt-1">Current Year: First Year</p>
            </div>
            
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4 text-foreground/90">Interests</h2>
          <div className="flex flex-wrap gap-4">
            {['Artificial Intelligence', 'Web Development', 'Cyber Security', 'Software Engineering', 'Innovation'].map((interest, i) => (
              <span key={i} className="px-4 py-2 bg-secondary/50 border border-secondary/50 rounded-full text-sm font-medium hover:bg-primary/20 hover:border-primary/50 transition-colors cursor-default">
                {interest}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-6 text-foreground/90">Connect With Me</h2>
          <div className="flex flex-wrap gap-4">
            <a href="https://github.com/PavanWadile77" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 bg-secondary/50 hover:bg-primary hover:text-primary-foreground rounded-full transition-all font-medium">
              <FaGithub size={20} /> GitHub
            </a>
            <a href="https://www.linkedin.com/in/pavan-wadile-7a7043282/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 bg-secondary/50 hover:bg-primary hover:text-primary-foreground rounded-full transition-all font-medium">
              <FaLinkedin size={20} /> LinkedIn
            </a>
            <a href="https://www.youtube.com/channel/UCOGrSA0TRoyZWdkLk2u30uA" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 bg-secondary/50 hover:bg-red-500 hover:text-white rounded-full transition-all font-medium">
              <FaYoutube size={20} /> YouTube
            </a>
            <a href="https://www.facebook.com/pavan.wadile.98" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 bg-secondary/50 hover:bg-blue-600 hover:text-white rounded-full transition-all font-medium">
              <FaFacebook size={20} /> Facebook
            </a>
            <a href="https://pavanwadile77.wixsite.com/wadile" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 bg-secondary/50 hover:bg-green-600 hover:text-white rounded-full transition-all font-medium">
              <FaGlobe size={20} /> CV Website
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
