import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';

export default function Education({ data }: { data: any[] }) {
  const education = data || [];

  return (
    <section id="education" className="py-24">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
        <div>
          <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-none uppercase">
            Academic <br /> <span className="text-primary">Journey</span>
          </h2>
        </div>
        <p className="text-muted-foreground font-bold uppercase tracking-[0.3em] text-xs">
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
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="glass p-10 rounded-[2.5rem] border-2 border-transparent hover:border-primary/20 transition-all duration-500"
          >
            <div className="flex items-start gap-5">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <GraduationCap />
              </div>
              <div className="w-full">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
                  <h3 className="text-3xl font-black tracking-tight uppercase">{item.degree || 'Degree'}</h3>
                  <span className="px-5 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-black uppercase tracking-widest whitespace-nowrap">
                    {item.period || 'Period'}
                  </span>
                </div>
                <p className="text-lg font-bold opacity-70 uppercase tracking-wider mb-2">{item.institution || 'Institution'}</p>
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
