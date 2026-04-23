import { motion } from 'framer-motion';
import { useTheme } from '../../store/useTheme';
import { getThemeHeroMotion } from '../../lib/themePresentation';

interface HeroProps {
  data: {
    badge?: string;
    title?: string;
    subtitle?: string;
    image?: string;
  } | null;
}

export default function Hero({ data }: HeroProps) {
  const { themeSet } = useTheme();
  const heroMotion = getThemeHeroMotion(themeSet);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 pt-24 pb-16 md:px-0 md:pt-20">
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
          animate={heroMotion.primaryAnimate}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className={`absolute bg-primary/10 blur-[90px] md:blur-[120px] ${heroMotion.primaryClassName}`}
        />
        <motion.div 
          animate={heroMotion.secondaryAnimate}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className={`absolute bg-accent/10 blur-[80px] md:blur-[100px] ${heroMotion.secondaryClassName}`}
        />
      </div>

      <div className="container mx-auto px-2 md:px-6 z-10">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-[0.22em] mb-6 md:mb-8">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              {data?.badge || "Add badge from admin"}
            </span>
            
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-[10rem] font-black tracking-tighter mb-6 md:mb-8 leading-[0.9] md:leading-[0.85] text-balance">
              {data?.title || "Add name from admin"}
            </h1>
            
            <p className="text-base sm:text-lg md:text-3xl text-muted-foreground max-w-3xl mx-auto mb-8 md:mb-12 leading-snug md:leading-tight font-medium px-2 sm:px-0">
              {data?.subtitle || "Add subtitle from admin"}
            </p>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 md:gap-4">
              <motion.button
                onClick={() => scrollTo('projects')}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="group relative inline-flex w-full sm:w-auto items-center justify-center gap-3 px-7 md:px-10 py-4 md:py-5 bg-primary text-primary-foreground rounded-2xl font-black uppercase tracking-[0.22em] overflow-hidden shadow-xl shadow-primary/20 cursor-pointer text-xs md:text-sm"
              >
                <span className="relative z-10 text-sm">View Projects</span>
                <motion.span 
                  className="relative z-10 text-lg"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >→</motion.span>
                <span className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </motion.button>

              <motion.button
                onClick={() => scrollTo('contact')}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="group inline-flex w-full sm:w-auto items-center justify-center gap-3 px-7 md:px-10 py-4 md:py-5 bg-background/80 backdrop-blur-sm border-2 border-border rounded-2xl font-black uppercase tracking-[0.22em] text-xs md:text-sm hover:border-primary/40 hover:bg-primary/5 transition-all duration-300 cursor-pointer"
              >
                <span>Get in Touch</span>
                <motion.span 
                  className="text-lg text-primary"
                  animate={{ rotate: [0, 15, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >↗</motion.span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent z-10" />
      
      {/* Scroll indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-6 md:bottom-12 left-1/2 -translate-x-1/2 w-8 h-14 border-2 border-primary/20 rounded-full hidden sm:flex justify-center p-2 z-20 cursor-pointer"
        onClick={() => scrollTo('about')}
      >
        <motion.div 
          animate={{ height: ["20%", "60%", "20%"] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-1 bg-primary rounded-full" 
        />
      </motion.div>
      
      {/* Decorative vertical lines */}
      <div className="absolute left-12 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-border to-transparent hidden xl:block" />
      <div className="absolute right-12 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-border to-transparent hidden xl:block" />
    </section>
  );
}
