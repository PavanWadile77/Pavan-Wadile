export default function SkillsPage() {
  const skillCategories = [
    {
      title: "Frontend Development",
      skills: ["React", "Next.js", "JavaScript", "TypeScript", "HTML", "CSS", "Tailwind CSS", "Figma", "UI Design"]
    },
    {
      title: "Backend Development",
      skills: ["Node.js", "Express", "REST API"]
    },
    {
      title: "Database & Cloud",
      skills: ["MongoDB", "Firebase", "Firestore"]
    },
    {
      title: "Mobile & Tools",
      skills: ["Flutter", "Git", "GitHub"]
    },
    {
      title: "Artificial Intelligence",
      skills: ["Prompt Engineering", "AI Tools"]
    }
  ];

  return (
    <div className="container mx-auto py-20 px-6 mt-16 min-h-screen">
      <h1 className="text-4xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">Skills & Expertise</h1>
      <p className="text-center text-foreground/60 mb-12 max-w-2xl mx-auto">
        A comprehensive list of the technologies, tools, and methodologies I use to bring ideas to life.
      </p>

      <div className="max-w-5xl mx-auto space-y-12">
        {skillCategories.map((category, index) => (
          <div key={index} className="space-y-6">
            <h2 className="text-2xl font-semibold border-b border-foreground/10 pb-2">{category.title}</h2>
            <div className="flex flex-wrap gap-4">
              {category.skills.map((skill, i) => (
                <div key={i} className="group flex items-center gap-3 px-6 py-3 bg-secondary/30 rounded-2xl border border-foreground/5 hover:border-primary/30 hover:bg-secondary/60 hover:-translate-y-1 transition-all cursor-default">
                  <div className="w-2 h-2 rounded-full bg-primary group-hover:shadow-[0_0_8px_rgba(59,130,246,0.8)] transition-shadow"></div>
                  <span className="font-medium">{skill}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
