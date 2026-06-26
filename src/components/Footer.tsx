import Link from "next/link";
import { Mail } from "lucide-react";
import { FaGithub, FaLinkedin, FaYoutube, FaFacebook, FaGlobe } from "react-icons/fa";
import Image from "next/image";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background/50 backdrop-blur-sm mt-20">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-3 group mb-4 w-fit">
              <div className="w-12 h-12 rounded-full relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500/20 to-purple-500/20 blur-sm group-hover:blur-md transition-all"></div>
                <div className="absolute inset-0 rounded-full overflow-hidden border-2 border-foreground/10 group-hover:border-primary/50 transition-colors">
                  <Image src="/images/profile.jpg" alt="Pavan Kishor Wadile" fill className="object-cover" sizes="48px" />
                </div>
              </div>
              <span className="text-2xl font-bold tracking-tighter">
                Pavan<span className="text-primary">.</span>
              </span>
            </Link>
            <p className="text-foreground/60 max-w-sm mb-6">
              Building innovative software solutions with a focus on beautiful design, 
              performance, and accessibility.
            </p>
            <div className="flex gap-4">
              <a href="https://github.com/PavanWadile77" target="_blank" rel="noopener noreferrer" className="text-foreground/50 hover:text-primary transition-colors">
                <FaGithub size={20} />
              </a>
              <a href="https://www.linkedin.com/in/pavan-wadile-7a7043282/" target="_blank" rel="noopener noreferrer" className="text-foreground/50 hover:text-primary transition-colors">
                <FaLinkedin size={20} />
              </a>
              <a href="https://www.youtube.com/channel/UCOGrSA0TRoyZWdkLk2u30uA" target="_blank" rel="noopener noreferrer" className="text-foreground/50 hover:text-red-500 transition-colors">
                <FaYoutube size={20} />
              </a>
              <a href="https://www.facebook.com/pavan.wadile.98" target="_blank" rel="noopener noreferrer" className="text-foreground/50 hover:text-blue-500 transition-colors">
                <FaFacebook size={20} />
              </a>
              <a href="https://pavanwadile77.wixsite.com/wadile" target="_blank" rel="noopener noreferrer" className="text-foreground/50 hover:text-green-500 transition-colors">
                <FaGlobe size={20} />
              </a>
              <Link href="/contact" className="text-foreground/50 hover:text-primary transition-colors">
                <Mail size={20} />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Navigation</h3>
            <ul className="space-y-3 text-sm text-foreground/60">
              <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">About</Link></li>
              <li><Link href="/projects" className="hover:text-primary transition-colors">Projects</Link></li>
              <li><Link href="/skills" className="hover:text-primary transition-colors">Skills</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-3 text-sm text-foreground/60">
              <li><Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-foreground/50">
          <p>© {currentYear} Pavan Kishor Wadile. All rights reserved.</p>
          <p className="mt-4 md:mt-0 flex items-center gap-1">
            Made with <span className="text-red-500 animate-pulse">❤</span> in India
          </p>
        </div>
      </div>
    </footer>
  );
}
