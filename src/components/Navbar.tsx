"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Menu } from "lucide-react";
import { useTheme } from "next-themes";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import Image from "next/image";

const routes = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Projects", path: "/projects" },
  { name: "Skills", path: "/skills" },
  { name: "Blog", path: "/blog" },
  { name: "Contact", path: "/contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const { setTheme, theme } = useTheme();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300 border-b border-transparent",
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-border shadow-sm py-3"
          : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500/20 to-purple-500/20 blur-sm group-hover:blur-md transition-all"></div>
            <div className="absolute inset-0 rounded-full overflow-hidden border-2 border-foreground/10 group-hover:border-primary/50 transition-colors">
              <Image src="/images/profile.jpg" alt="Pavan Kishor Wadile" fill className="object-cover" sizes="40px" />
            </div>
          </div>
          <span className="text-xl font-bold tracking-tighter">
            Pavan<span className="text-primary">.</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {routes.map((route) => (
            <Link
              key={route.path}
              href={route.path}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-colors hover:bg-secondary/80",
                pathname === route.path
                  ? "bg-secondary text-secondary-foreground"
                  : "text-foreground/70 hover:text-foreground"
              )}
            >
              {route.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 mr-2">
            <a href="https://github.com/PavanWadile77" target="_blank" rel="noopener noreferrer" className="p-2 text-foreground/70 hover:text-primary transition-colors">
              <FaGithub size={20} />
            </a>
            <a href="https://www.linkedin.com/in/pavan-wadile-7a7043282/" target="_blank" rel="noopener noreferrer" className="p-2 text-foreground/70 hover:text-primary transition-colors">
              <FaLinkedin size={20} />
            </a>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="rounded-full"
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Mobile Nav */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger className="md:hidden p-2 hover:bg-secondary/80 rounded-full transition-colors flex items-center justify-center h-10 w-10">
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4 mt-8">
                {routes.map((route) => (
                  <Link
                    key={route.path}
                    href={route.path}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "text-lg font-medium p-4 rounded-xl transition-colors",
                      pathname === route.path
                        ? "bg-secondary text-secondary-foreground"
                        : "hover:bg-secondary/50 text-foreground/70"
                    )}
                  >
                    {route.name}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
