import { motion } from 'framer-motion';

export default function Hero({ data }: { data: any }) {
  if (!data) return (
    <div className="h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-6xl font-bold tracking-tighter mb-4 animate-pulse">NAYAN KUIKEL</h1>
        <p className="text-xl text-muted-foreground">Civil Engineer | UI/UX Architect</p>
      </div>
    </div>
  );

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Animated Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[128px] animate-pulse" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
      </div>

      <div className="container mx-auto px-4 z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium mb-6">
            {data.badge || "Site Engineer at Vawan Bivag"}
          </span>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter mb-6 leading-none">
            {data.title || "NAYAN KUIKEL"}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            {data.subtitle || "Building resilient infrastructure and digital experiences with precision and architectural elegance."}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#projects" className="px-8 py-4 bg-primary text-primary-foreground rounded-full font-bold hover:scale-105 transition-transform">
              View Projects
            </a>
            <a href="#contact" className="px-8 py-4 bg-background border border-border rounded-full font-bold hover:bg-accent transition-colors">
              Get in Touch
            </a>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center p-1"
      >
        <div className="w-1 h-2 bg-primary rounded-full" />
      </motion.div>
    </section>
  );
}
