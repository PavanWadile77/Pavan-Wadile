import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { adminDb } from "@/lib/firebase-admin";

export const metadata = {
  title: "Blog | Pavan Kishor Wadile",
  description: "Read my latest articles on web development, programming, and tech insights.",
};

export const dynamic = 'force-dynamic';

async function getBlogs() {
  try {
    const snapshot = await adminDb.collection("blogs").orderBy("createdAt", "desc").get();
    if (snapshot.empty) return [];
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return snapshot.docs.map((doc: any) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt ? new Date(data.createdAt._seconds * 1000).toLocaleDateString() : "Unknown Date"
      };
    }) as { id: string; title: string; excerpt: string; createdAt: string; category: string; slug: string; }[];
  } catch (error) {
    console.error("Failed to fetch blogs:", error);
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getBlogs();

  return (
    <div className="container mx-auto py-24 px-6 mt-16 min-h-screen">
      <div className="max-w-4xl mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Blog & Insights</h1>
        <p className="text-xl text-foreground/70">
          Thoughts, learnings, and technical deep-dives into modern web development.
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center p-12 text-foreground/50 border border-dashed rounded-3xl">
          No blog posts published yet. Check back soon!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`}>
              <article className="group h-full bg-secondary/30 rounded-3xl p-6 border border-foreground/5 hover:border-primary/30 transition-all duration-300 flex flex-col cursor-pointer">
                <div className="mb-4 flex items-center justify-between text-xs text-foreground/60">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} /> {post.createdAt}
                  </span>
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                    {post.category || "General"}
                  </span>
                </div>
                <h2 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h2>
                <p className="text-foreground/70 mb-6 text-sm line-clamp-3 flex-1">
                  {post.excerpt}
                </p>
                <div className="flex items-center text-primary font-medium text-sm mt-auto pt-4 border-t border-foreground/5">
                  Read Article <ArrowRight size={16} className="ml-2 transform group-hover:translate-x-2 transition-transform" />
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
