import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

export default function Projects({ data }: { data: any[] }) {
  const projects = data.length > 0 ? data : [
    {
      title: "Structural Seismic Analysis",
      category: "Civil Engineering",
      image: "https://images.unsplash.com/photo-1503387762-592dee582a7b?auto=format&fit=crop&q=80",
      description: "Advanced ETABS modeling for multi-story residential complexes in seismic zones.",
      link: "#",
      github: "#"
    },
    {
      title: "Smart Infrastructure Hub",
      category: "Infrastructure",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80",
      description: "Conceptual design for integrated urban management systems using IoT and BIM.",
      link: "#",
      github: "#"
    }
  ];

  return (
    <section id="projects" className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">Selected Works</h2>
          <p className="text-muted-foreground max-w-xl">A showcase of structural precision and innovative engineering solutions.</p>
        </div>
        <div className="flex gap-2">
          {["All", "Civil", "Infrastructure", "UI/UX"].map(cat => (
            <button key={cat} className="px-4 py-2 text-sm rounded-full border border-border hover:bg-accent transition-colors">
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="group relative bg-card rounded-3xl overflow-hidden border border-border/50 shadow-sm"
          >
            <div className="aspect-[16/10] overflow-hidden">
              <img 
                src={project.image} 
                alt={project.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
              />
            </div>
            <div className="p-6 space-y-4">
              <span className="text-xs font-bold text-primary uppercase tracking-widest">{project.category}</span>
              <h3 className="text-xl font-bold">{project.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
              <div className="flex gap-4 pt-2">
                <a href={project.link} className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
                  <ExternalLink size={16} /> Live Demo
                </a>
                <a href={project.github} className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
                  Source
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
