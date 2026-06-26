"use client";

import { useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import { Mail, MapPin, Phone } from "lucide-react";
import { FaGithub, FaLinkedin, FaYoutube, FaFacebook, FaGlobe } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const form = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (form.current) {
      emailjs
        .sendForm(
          process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "",
          process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "",
          form.current,
          process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || ""
        )
        .then(
          (result) => {
            console.log(result.text);
            setSuccess(true);
            setLoading(false);
            if (form.current) form.current.reset();
          },
          (error) => {
            console.error(error.text);
            setLoading(false);
            alert("Failed to send message. Please try again.");
          }
        );
    }
  };
  return (
    <div className="container mx-auto py-20 px-6 mt-16 min-h-screen">
      <h1 className="text-4xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">Contact Me</h1>
      <p className="text-center text-foreground/60 mb-16 max-w-2xl mx-auto">
        Feel free to reach out for collaborations, job opportunities, or just to say hi!
      </p>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div className="space-y-8">
          <div className="flex items-start gap-4">
            <div className="p-4 bg-primary/10 text-primary rounded-full mt-1">
              <Mail size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-1">Email</h3>
              <div className="space-y-1">
                <a href="mailto:pavanwadile777@gmail.com" className="block text-foreground/70 hover:text-primary transition-colors">
                  pavanwadile777@gmail.com (Primary)
                </a>
                <a href="mailto:pavanwadile77@gmail.com" className="block text-foreground/70 hover:text-primary transition-colors">
                  pavanwadile77@gmail.com (Secondary)
                </a>
              </div>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="p-4 bg-primary/10 text-primary rounded-full mt-1">
              <Phone size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-1">Phone</h3>
              <div className="space-y-1">
                <a href="tel:+918390254014" className="block text-foreground/70 hover:text-primary transition-colors">
                  +91 8390254014 (Primary)
                </a>
                <a href="tel:+919371083999" className="block text-foreground/70 hover:text-primary transition-colors">
                  +91 9371083999 (Secondary)
                </a>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-4 bg-primary/10 text-primary rounded-full mt-1">
              <MapPin size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-1">Location</h3>
              <div className="space-y-4">
                <div>
                  <p className="font-medium text-sm text-foreground/80">Permanent Address:</p>
                  <a href="https://maps.google.com/?q=Shri+Nathji+Nagar,+Parola,+Jalgaon+District,+Maharashtra,+India" target="_blank" rel="noopener noreferrer" className="block text-foreground/70 hover:text-primary transition-colors text-sm">
                    Shri Nathji Nagar, Parola, Jalgaon District, Maharashtra, India
                  </a>
                </div>
                <div>
                  <p className="font-medium text-sm text-foreground/80">Temporary Address:</p>
                  <a href="https://maps.google.com/?q=Shirpur,+Dhule+District,+Maharashtra+425405,+India" target="_blank" rel="noopener noreferrer" className="block text-foreground/70 hover:text-primary transition-colors text-sm">
                    Shirpur, Dhule District, Maharashtra 425405, India
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-foreground/10">
            <h3 className="text-lg font-semibold mb-4">Connect with me</h3>
            <div className="flex gap-4">
              <a href="https://github.com/PavanWadile77" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-secondary/50 hover:bg-primary hover:text-primary-foreground transition-all">
                <FaGithub size={20} />
              </a>
              <a href="https://www.linkedin.com/in/pavan-wadile-7a7043282/" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-secondary/50 hover:bg-primary hover:text-primary-foreground transition-all">
                <FaLinkedin size={20} />
              </a>
              <a href="https://www.youtube.com/channel/UCOGrSA0TRoyZWdkLk2u30uA" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-secondary/50 hover:bg-red-500 hover:text-white transition-all">
                <FaYoutube size={20} />
              </a>
              <a href="https://www.facebook.com/pavan.wadile.98" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-secondary/50 hover:bg-blue-600 hover:text-white transition-all">
                <FaFacebook size={20} />
              </a>
              <a href="https://pavanwadile77.wixsite.com/wadile" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-secondary/50 hover:bg-green-600 hover:text-white transition-all">
                <FaGlobe size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-secondary/30 p-8 rounded-3xl border border-foreground/5 shadow-sm">
          <form ref={form} onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="user_name" required placeholder="John Doe" className="bg-background/50" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="user_email" type="email" required placeholder="john@domain.com" className="bg-background/50" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" name="message" required placeholder="How can I help you?" className="min-h-[150px] bg-background/50" />
            </div>
            
            <Button type="submit" disabled={loading} className="w-full rounded-full">
              {loading ? "Sending..." : "Send Message"}
            </Button>

            {success && (
              <p className="text-green-500 text-sm text-center font-medium mt-4">
                Message sent successfully!
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
