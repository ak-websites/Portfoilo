import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';

export default function Education({ data }: { data: any[] }) {
  const education = data || [];

  return (
    <section id="education" className="py-20 md:py-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-6 md:gap-8">
        <div>
          <h2 className="text-4xl sm:text-5xl md:text-8xl font-black tracking-tighter leading-[0.92] md:leading-none uppercase">
            Academic <br /> <span className="text-primary">Journey</span>
          </h2>
        </div>
        <p className="text-muted-foreground font-bold uppercase tracking-[0.22em] md:tracking-[0.3em] text-[10px] md:text-xs">
          Credentials & Learning
        </p>
      </div>

      <div className="space-y-4">
        {education.length === 0 && (
          <div className="glass p-10 rounded-[2rem] text-center text-muted-foreground">
            No education entries yet. Add education from the admin panel.
          </div>
        )}
        {education.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -26, y: 20 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="glass p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border-2 border-transparent hover:border-primary/20 transition-all duration-500"
          >
            <div className="flex items-start gap-4 md:gap-5">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <GraduationCap />
              </div>
              <div className="w-full">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
                  <h3 className="text-2xl md:text-3xl font-black tracking-tight uppercase">{item.degree || 'Degree'}</h3>
                  <span className="px-4 md:px-5 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] md:text-xs font-black uppercase tracking-[0.18em] md:tracking-widest whitespace-nowrap">
                    {item.period || 'Period'}
                  </span>
                </div>
                <p className="text-base md:text-lg font-bold opacity-70 uppercase tracking-wider mb-2">{item.institution || 'Institution'}</p>
                {item.description && (
                  <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
