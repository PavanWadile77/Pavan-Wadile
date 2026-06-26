export default function GalleryPage() {
  const images = Array.from({ length: 6 }).map((_, i) => ({
    src: `/images/gallery-${i + 1}.png`,
    alt: `Gallery Image ${i + 1}`,
    caption: `Event Snapshot ${i + 1}`,
  }));

  return (
    <div className="container mx-auto py-20 px-6 mt-16 min-h-screen">
      <h1 className="text-4xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">Gallery</h1>
      <p className="text-center text-foreground/60 mb-16 max-w-2xl mx-auto">
        A visual journey through hackathons, events, and memorable moments.
      </p>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {images.map((img, i) => (
          <div key={i} className="group relative rounded-3xl overflow-hidden bg-secondary/30 border border-foreground/5 aspect-square">
            <div className="absolute inset-0 bg-secondary flex items-center justify-center text-foreground/30 font-medium">
              Image Placeholder
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
              <p className="text-lg font-semibold text-foreground translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                {img.caption}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
