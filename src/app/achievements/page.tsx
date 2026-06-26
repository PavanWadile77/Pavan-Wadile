import { Trophy } from "lucide-react";

export default function AchievementsPage() {
  const achievements = [
    {
      title: "First Prize in State Level Hackathon",
      event: "TechNova 2024",
      description: "Developed an innovative AI-driven solution for agriculture.",
      date: "March 2024"
    },
    {
      title: "Best Poster Presentation",
      event: "National Science Day",
      description: "Presented research on Banana Fiber Adult Diaper innovation.",
      date: "Feb 2024"
    }
  ];

  return (
    <div className="container mx-auto py-20 px-6 mt-16 min-h-screen">
      <h1 className="text-4xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">Achievements & Hackathons</h1>
      <p className="text-center text-foreground/60 mb-12 max-w-2xl mx-auto">
        A timeline of hackathons won, technical events participated in, and awards received.
      </p>

      <div className="max-w-4xl mx-auto border-l-2 border-primary/20 pl-8 space-y-12 relative">
        {achievements.map((item, i) => (
          <div key={i} className="relative group">
            <div className="absolute w-5 h-5 bg-primary rounded-full -left-[43px] top-1.5 shadow-[0_0_10px_rgba(59,130,246,0.5)] group-hover:scale-125 transition-transform flex items-center justify-center">
              <Trophy size={10} className="text-primary-foreground" />
            </div>
            <div className="bg-secondary/30 p-6 rounded-2xl border border-foreground/5 group-hover:border-primary/50 transition-colors shadow-sm">
              <span className="text-xs font-semibold text-primary uppercase tracking-wider mb-2 block">{item.date}</span>
              <h2 className="text-2xl font-bold mb-2">{item.title}</h2>
              <h3 className="text-lg text-foreground/80 font-medium mb-3">{item.event}</h3>
              <p className="text-foreground/70">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
