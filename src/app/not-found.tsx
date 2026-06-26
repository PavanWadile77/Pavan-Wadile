import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
      <h1 className="text-9xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-primary to-primary/20 mb-4">404</h1>
      <h2 className="text-3xl font-semibold mb-6">Page Not Found</h2>
      <p className="text-foreground/60 max-w-md mb-10">
        The page you are looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
      </p>
      <Link href="/">
        <Button className="rounded-full gap-2">
          <ArrowLeft size={16} /> Back to Home
        </Button>
      </Link>
    </div>
  );
}
