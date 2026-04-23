import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  Layers, BarChart3, Hammer, Terminal
} from 'lucide-react';

const ICON_MAP: Record<string, React.ReactNode> = {
  'Structural Design': <Layers size={22} />,
  'Project Management': <BarChart3 size={22} />,
  'Site & Field': <Hammer size={22} />,
  'Software & Tools': <Terminal size={22} />,
};

const FALLBACK_ICONS = [<Layers size={22} />, <BarChart3 size={22} />, <Hammer size={22} />, <Terminal size={22} />];

export default function Skills({ data }: { data: any }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  const skillCategories = data?.skillCategories?.length > 0
    ? data.skillCategories.map((cat: any) => ({
        ...cat,
        icon: ICON_MAP[cat.label] || FALLBACK_ICONS[Math.abs(cat.label?.length || 0) % FALLBACK_ICONS.length],
      }))
    : [];

  const chips: string[] = data?.skills?.length > 0 ? data.skills : [];

  const derivedCategories = !skillCategories.length && chips.length
    ? [{
        label: 'Capabilities',
        icon: <Layers size={22} />,
        skills: chips.slice(0, 8).map((skill: string, index: number) => ({
          name: skill,
          level: Math.max(60, 92 - index * 4),
        })),
      }]
    : [];

  const displayCategories = skillCategories.length ? skillCategories : derivedCategories;

  return (
    <section id="skills" className="py-20 md:py-24" ref={ref}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-6 md:gap-8">
        <div>
          <h2 className="text-4xl sm:text-5xl md:text-8xl font-black tracking-tighter leading-[0.92] md:leading-none uppercase">
            Core <br /> <span className="text-primary">Skills</span>
          </h2>
        </div>
        <p className="text-muted-foreground font-bold uppercase tracking-[0.24em] md:tracking-[0.3em] text-[10px] md:text-xs">
          Technical Expertise
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 mb-10 md:mb-14">
        {displayCategories.map((cat: any, catIdx: number) => (
          <motion.div
            key={cat.label}
            initial={{ opacity: 0, y: 38, scale: 0.96, rotate: catIdx % 2 === 0 ? -1.2 : 1.2 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1, rotate: 0 } : {}}
            transition={{ duration: 0.6, delay: catIdx * 0.1, ease: 'easeOut' }}
            className="glass p-6 md:p-8 rounded-[2rem] border border-transparent hover:border-primary/20 transition-all duration-500 group"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                {cat.icon}
              </div>
              <h3 className="font-black text-sm uppercase tracking-widest leading-tight">{cat.label}</h3>
            </div>
            <div className="space-y-5">
              {cat.skills.map((skill: any, skillIdx: number) => (
                <SkillBar
                  key={skill.name}
                  name={skill.name}
                  level={skill.level}
                  isInView={isInView}
                  delay={catIdx * 0.1 + skillIdx * 0.08}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {!displayCategories.length && (
        <div className="glass p-8 md:p-10 rounded-[2rem] text-center text-muted-foreground mb-10 md:mb-14">
          No skills found in the database yet. Add skills from the admin panel to populate this section.
        </div>
      )}

      {chips.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="glass p-6 md:p-10 rounded-[2rem]"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50 mb-6">
            Additional Competencies
          </p>
          <div className="grid grid-cols-1 sm:flex sm:flex-wrap gap-2.5 md:gap-3">
            {chips.map((skill: string, i: number) => (
              <motion.span
                key={skill}
                initial={{ opacity: 0, x: -14, scale: 0.92 }}
                animate={isInView ? { opacity: 1, x: 0, scale: 1 } : {}}
                transition={{ delay: 0.5 + i * 0.04, duration: 0.3 }}
                className="px-4 md:px-5 py-2 bg-primary/8 border border-primary/15 text-primary rounded-full text-[10px] md:text-xs font-black uppercase tracking-[0.18em] md:tracking-widest hover:bg-primary hover:text-primary-foreground transition-all cursor-default text-center sm:text-left"
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </motion.div>
      )}
    </section>
  );
}

function SkillBar({ name, level, isInView, delay }: { name: string; level: number; isInView: boolean; delay: number }) {
  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="text-xs font-bold tracking-wide">{name}</span>
        <span className="text-[10px] font-black text-primary opacity-70">{level}%</span>
      </div>
      <div className="h-1.5 bg-primary/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-primary rounded-full origin-left"
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: level / 100 } : { scaleX: 0 }}
          transition={{ duration: 1, delay: delay + 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
      </div>
    </div>
  );
}
