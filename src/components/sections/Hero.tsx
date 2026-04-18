import { motion } from 'framer-motion';

interface HeroProps {
  data: {
    badge?: string;
    title?: string;
    subtitle?: string;
    image?: string;
  } | null;
}

export default function Hero({ data }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 premium-gradient opacity-30" />
        <div className="absolute inset-0 noise-bg" />
        
        {/* Animated Grid */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(var(--color-primary) 1px, transparent 1px), linear-gradient(90deg, var(--color-primary) 1px, transparent 1px)`,
            backgroundSize: '100px 100px'
          }}
        />
        
        {/* Floating Shapes */}
        <motion.div 
          animate={{ 
            x: [0, 50, 0], 
            y: [0, 30, 0],
            rotate: [0, 10, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]"
        />
        <motion.div 
          animate={{ 
            x: [0, -50, 0], 
            y: [0, -30, 0],
            rotate: [0, -10, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px]"
        />
      </div>

      <div className="container mx-auto px-6 z-10">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest mb-8">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              {data?.badge || "Civil Engineer"}
            </span>
            
            <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-black tracking-tighter mb-8 leading-[0.85] text-balance">
              {data?.title || "NAYAN KUIKEL"}
            </h1>
            
            <p className="text-xl md:text-3xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-tight font-medium">
              {data?.subtitle || "Building resilient infrastructure and digital experiences with precision and architectural elegance."}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <a 
                href="#projects" 
                className="group relative px-10 py-5 bg-primary text-primary-foreground rounded-2xl font-black uppercase tracking-widest overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-primary/20"
              >
                <span className="relative z-10">View Projects</span>
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </a>
              <a 
                href="#contact" 
                className="px-10 py-5 bg-background border-2 border-border rounded-2xl font-black uppercase tracking-widest hover:bg-accent transition-all active:scale-95"
              >
                Get in Touch
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Engineering Elements */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent z-10" />
      
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 w-8 h-14 border-2 border-primary/20 rounded-full flex justify-center p-2 z-20"
      >
        <motion.div 
          animate={{ height: ["20%", "60%", "20%"] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-1 bg-primary rounded-full" 
        />
      </motion.div>
      
      {/* Decorative vertical line */}
      <div className="absolute left-12 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-border to-transparent hidden xl:block" />
      <div className="absolute right-12 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-border to-transparent hidden xl:block" />
    </section>
  );
}
