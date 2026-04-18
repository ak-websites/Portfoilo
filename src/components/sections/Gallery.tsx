import { motion } from 'framer-motion';

export default function Gallery({ data }: { data: any[] }) {
  const images = data.length > 0 ? data : [
    { url: "https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&q=80", title: "Site Visit" },
    { url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80", title: "Construction Management" },
    { url: "https://images.unsplash.com/photo-1531834684970-d9904294f923?auto=format&fit=crop&q=80", title: "Blueprint Review" },
    { url: "https://images.unsplash.com/photo-1590644365607-1c5a519a7a37?auto=format&fit=crop&q=80", title: "Safety Inspection" },
  ];

  return (
    <section id="gallery" className="space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">Visual Portfolio</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">Snapshots from the field and the design studio.</p>
      </div>

      <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
        {images.map((img, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="relative group overflow-hidden rounded-2xl break-inside-avoid shadow-lg"
          >
            <img 
              src={img.url} 
              alt={img.title} 
              className="w-full h-auto object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
              <span className="text-white font-bold text-center">{img.title}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
