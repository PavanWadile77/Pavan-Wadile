import { Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ResumePage() {
  return (
    <div className="container mx-auto py-20 px-6 mt-16 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">Resume</h1>
          <div className="flex gap-4">
            <Button variant="outline" className="rounded-full gap-2">
              <Printer size={16} /> Print
            </Button>
            <Button className="rounded-full gap-2 shadow-lg">
              <Download size={16} /> Download PDF
            </Button>
          </div>
        </div>

        <div className="w-full bg-secondary/20 border border-foreground/10 rounded-3xl p-8 md:p-12 shadow-sm min-h-[800px] flex items-center justify-center">
          <div className="text-center text-foreground/50">
            <p className="text-xl font-medium mb-4">Resume Preview</p>
            <p className="text-sm">A PDF version of the resume will be displayed here.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
