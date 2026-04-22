import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { sanitizeImageUrl, sanitizeUrl } from '../../utils/security';

const DESCRIPTION_LIMIT = 120;

function ProjectCard({ project, index }: { project: any; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const desc: string = project.description || '';
  const isLong = desc.length > DESCRIPTION_LIMIT;
  const displayDesc = expanded || !isLong ? desc : desc.slice(0, DESCRIPTION_LIMIT) + '…';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group relative glass rounded-[2.5rem] overflow-hidden border-2 border-transparent hover:border-primary/20 transition-all duration-500 flex flex-col"
    >
      {/* Image */}
      <div className="aspect-[16/9] overflow-hidden relative">
        {project.image ? (
          <img 
            src={sanitizeImageUrl(project.image)} 
            alt={project.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
            <span className="text-4xl font-black text-primary/20 uppercase tracking-widest">
              {project.title?.charAt(0) || 'P'}
            </span>
          </div>
        )}
        {/* Category badge on image */}
        <div className="absolute top-4 left-4">
          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-primary bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-full border border-primary/20">
            {project.category}
          </span>
        </div>
      </div>
      
      <div className="p-8 space-y-3 flex flex-col flex-grow">
        <h3 className="text-xl font-black tracking-tight leading-tight group-hover:text-primary transition-colors duration-300">
          {project.title}
        </h3>
        
        <div className="flex-grow">
          <p className="text-muted-foreground font-medium text-sm leading-relaxed">
            {displayDesc}
          </p>
          {isLong && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-2 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-primary hover:opacity-70 transition-opacity"
            >
              {expanded ? (
                <><ChevronUp size={12} /> Read Less</>
              ) : (
                <><ChevronDown size={12} /> Read More</>
              )}
            </button>
          )}
        </div>
        
        <div className="pt-4 flex items-center justify-between border-t border-border/50">
          <a 
            href={sanitizeUrl(project.link)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 font-black uppercase tracking-widest text-[10px] group/btn hover:text-primary transition-colors"
          >
            View Project 
            <ArrowRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
          </a>
          <a
            href={sanitizeUrl(project.link)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
          >
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export default function Projects({ data }: { data: any[] }) {
  const [filter, setFilter] = useState('All');
  const projects = data || [];
  const categories = ['All', ...Array.from(new Set(projects.map((p: any) => p.category)))];
  const filteredProjects = filter === 'All' ? projects : projects.filter((p: any) => p.category === filter);

  return (
    <section id="projects" className="py-24">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
        <div>
          <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-none uppercase">
            Selected <br /> <span className="text-primary">Projects</span>
          </h2>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat as string)}
              className={`px-5 py-2 rounded-full font-black uppercase tracking-widest text-[10px] transition-all ${
                filter === cat 
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105' 
                  : 'bg-accent/50 hover:bg-accent text-muted-foreground hover:text-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.length === 0 && (
          <div className="md:col-span-2 xl:col-span-3 glass rounded-[2rem] p-10 text-center text-muted-foreground">
            No projects yet. Add projects from the admin panel.
          </div>
        )}
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project: any, index: number) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}
