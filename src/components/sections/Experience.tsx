import { motion } from 'framer-motion';

export default function Experience({ data }: { data: any[] }) {
  const experiences = data || [];

  return (
    <section id="experience" className="py-20 md:py-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-6 md:gap-8">
        <div>
          <h2 className="text-4xl sm:text-5xl md:text-8xl font-black tracking-tighter leading-[0.92] md:leading-none uppercase">
            Job <br /> <span className="text-primary">Experience</span>
          </h2>
        </div>
        <p className="text-muted-foreground font-bold uppercase tracking-[0.22em] md:tracking-[0.3em] text-[10px] md:text-xs">
          Professional Track Record
        </p>
      </div>

      <div className="space-y-4">
        {experiences.length === 0 && (
          <div className="glass p-10 rounded-[2rem] text-center text-muted-foreground">
            No experience entries yet. Add experience from the admin panel.
          </div>
        )}
        {experiences.map((exp, index) => (
          <motion.div
            key={exp.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group relative"
          >
            <div className="glass p-6 md:p-14 rounded-[2rem] md:rounded-[3rem] border-2 border-transparent hover:border-primary/20 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 mb-6 md:mb-8">
                <div>
                  <h3 className="text-2xl md:text-3xl font-black tracking-tight group-hover:text-primary transition-colors uppercase">
                    {exp.role}
                  </h3>
                  <p className="text-base md:text-xl font-bold opacity-60 uppercase tracking-widest">{exp.company}</p>
                </div>
                <div className="px-4 md:px-6 py-2 rounded-full border-2 border-primary/20 bg-primary/5 text-primary font-black uppercase tracking-[0.18em] md:tracking-widest text-[10px] md:text-sm whitespace-nowrap self-start md:self-center">
                  {exp.period}
                </div>
              </div>
              <p className="text-base md:text-xl text-muted-foreground leading-relaxed max-w-4xl font-medium">
                {exp.description}
              </p>
            </div>
            {/* Number background decoration */}
            <div className="absolute top-4 right-5 md:top-8 md:right-12 text-6xl md:text-9xl font-black text-foreground/[0.02] pointer-events-none select-none italic">
              0{index + 1}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
