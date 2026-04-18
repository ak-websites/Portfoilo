import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, ArrowRight } from 'lucide-react';

export default function Projects({ data }: { data: any[] }) {
  const [filter, setFilter] = useState('All');
  
  const projects = data && data.length > 0 ? data : [
    {
      id: '1',
      title: 'Structural Integrity Analysis',
      category: 'Engineering',
      description: 'Comprehensive assessment of concrete structures using advanced ETABS modeling and field inspection.',
      image: 'https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&q=80',
      link: '#'
    },
    {
      id: '2',
      title: 'Modern Residential Complex',
      category: 'Design',
      description: 'Site supervision for a 5-story residential building with complex architectural details.',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80',
      link: '#'
    },
    {
      id: '3',
      title: 'Vawan Bivag Site Ops',
      category: 'Management',
      description: 'Coordinating large scale governmental project logistics and technical site inspections.',
      image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80',
      link: '#'
    }
  ];

  const categories = ['All', ...new Set(projects.map(p => p.category))];
  const filteredProjects = filter === 'All' ? projects : projects.filter(p => p.category === filter);

  return (
    <section id="projects" className="py-24">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
        <div>
          <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-none uppercase">
            Selected <br /> <span className="text-primary">Projects</span>
          </h2>
        </div>
        
        <div className="flex flex-wrap gap-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2 rounded-full font-black uppercase tracking-widest text-[10px] transition-all ${filter === cat ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-110' : 'bg-accent/50 hover:bg-accent text-muted-foreground hover:text-foreground'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative glass rounded-[2.5rem] overflow-hidden border-2 border-transparent hover:border-primary/20 transition-all duration-500"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              
              <div className="p-10 space-y-4">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">{project.category}</span>
                <h3 className="text-2xl font-black tracking-tight leading-tight">{project.title}</h3>
                <p className="text-muted-foreground font-medium line-clamp-3">{project.description}</p>
                
                <div className="pt-6 flex items-center justify-between">
                  <a 
                    href={project.link} 
                    className="flex items-center gap-2 font-black uppercase tracking-widest text-[10px] group/btn"
                  >
                    View Project <ArrowRight size={14} className="group-hover/btn:translate-x-2 transition-transform" />
                  </a>
                  <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                    <ExternalLink size={16} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}
