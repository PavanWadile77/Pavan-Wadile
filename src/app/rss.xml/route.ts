import { Feed } from "feed";
import { adminDb } from "@/lib/firebase-admin";

export const dynamic = 'force-dynamic';

export async function GET() {
  const feed = new Feed({
    title: "Pavan Kishor Wadile - Blog",
    description: "Insights and tutorials on modern web development",
    id: "https://pavanwadile.com/",
    link: "https://pavanwadile.com/blog",
    language: "en",
    image: "https://pavanwadile.com/og-image.jpg",
    favicon: "https://pavanwadile.com/favicon.ico",
    copyright: `All rights reserved ${new Date().getFullYear()}, Pavan Kishor Wadile`,
    author: {
      name: "Pavan Kishor Wadile",
      email: "pavanwadile777@gmail.com",
      link: "https://pavanwadile.com/about",
    },
  });

  try {
    const snapshot = await adminDb.collection("blogs").orderBy("createdAt", "desc").limit(20).get();
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    snapshot.docs.forEach((doc: any) => {
      const post = doc.data();
      feed.addItem({
        title: post.title,
        id: `https://pavanwadile.com/blog/${post.slug}`,
        link: `https://pavanwadile.com/blog/${post.slug}`,
        description: post.excerpt,
        content: post.content,
        author: [{ name: "Pavan Kishor Wadile", email: "pavanwadile777@gmail.com", link: "https://pavanwadile.com/about" }],
        date: new Date(post.createdAt ? post.createdAt._seconds * 1000 : Date.now()),
      });
    });
  } catch (error) {
    console.error("RSS generation failed", error);
  }

  return new Response(feed.rss2(), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
