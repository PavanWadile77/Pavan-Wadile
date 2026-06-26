import { adminDb } from "@/lib/firebase-admin";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const dynamic = 'force-dynamic';
export const revalidate = 60; // ISR cache revalidation

async function getBlogBySlug(slug: string) {
  try {
    const snapshot = await adminDb.collection("blogs").where("slug", "==", slug).limit(1).get();
    if (snapshot.empty) return null;
    
    const doc = snapshot.docs[0];
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt ? new Date(data.createdAt._seconds * 1000).toLocaleDateString() : "Unknown Date"
    } as { id: string; title: string; excerpt: string; createdAt: string; category: string; content: string; };
  } catch (error) {
    console.error("Error fetching blog by slug:", error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);
  
  if (!post) {
    return { title: 'Post Not Found' };
  }

  return {
    title: `${post.title} | Pavan Kishor Wadile`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    }
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);

  if (!post) {
    notFound();
  }

  // Generate Article Schema JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "author": [{
      "@type": "Person",
      "name": "Pavan Kishor Wadile",
      "email": "pavanwadile777@gmail.com",
      "image": "https://pavanwadile.com/images/profile.jpg",
      "url": "https://pavanwadile.com"
    }],
    "datePublished": new Date(post.createdAt).toISOString(),
  };

  return (
    <article className="container mx-auto py-24 px-6 mt-16 max-w-4xl min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <Link href="/blog" className="inline-flex items-center text-sm font-medium text-foreground/60 hover:text-primary transition-colors mb-8">
        <ArrowLeft size={16} className="mr-2" /> Back to Blog
      </Link>

      <div className="mb-12">
        <div className="flex items-center gap-4 text-sm text-foreground/60 mb-6">
          <span className="flex items-center gap-1">
            <Calendar size={16} /> {post.createdAt}
          </span>
          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
            {post.category || "General"}
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">{post.title}</h1>
        <p className="text-xl text-foreground/60 leading-relaxed border-l-4 border-primary pl-4">
          {post.excerpt}
        </p>
      </div>

      <div 
        className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-primary hover:prose-a:text-primary/80 prose-img:rounded-xl"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  );
}
