import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import {
  Layers, BarChart3, Hammer, Terminal
} from 'lucide-react';

// Fallback static data
const DEFAULT_SKILL_CATEGORIES = [
  {
    label: 'Structural Design',
    icon: <Layers size={22} />,
    skills: [
      { name: 'AutoCAD', level: 92 },
      { name: 'ETABS / SAP2000', level: 85 },
      { name: 'Revit BIM', level: 78 },
    ],
  },
  {
    label: 'Project Management',
    icon: <BarChart3 size={22} />,
    skills: [
      { name: 'MS Project', level: 88 },
      { name: 'Primavera P6', level: 74 },
      { name: 'Cost Estimation', level: 90 },
    ],
  },
  {
    label: 'Site & Field',
    icon: <Hammer size={22} />,
    skills: [
      { name: 'Site Supervision', level: 95 },
      { name: 'Quality Control', level: 87 },
      { name: 'Surveying', level: 80 },
    ],
  },
  {
    label: 'Software & Tools',
    icon: <Terminal size={22} />,
    skills: [
      { name: 'GIS Mapping', level: 70 },
      { name: 'STAAD.Pro', level: 75 },
      { name: 'Navisworks', level: 65 },
    ],
  },
];

const DEFAULT_QUICK_SKILLS = [
  'Structural Analysis', 'BIM Modeling', 'Contract Management',
  'Concrete Design', 'Hydraulic Engineering', 'Road Design',
  'Environmental Impact', 'Steel Detailing', 'Foundation Engineering',
  'Drainage Systems', 'Seismic Design', 'Construction Law',
];

const ICON_MAP: Record<string, React.ReactNode> = {
  'Structural Design': <Layers size={22} />,
  'Project Management': <BarChart3 size={22} />,
  'Site & Field': <Hammer size={22} />,
  'Software & Tools': <Terminal size={22} />,
};

export default function Skills({ data }: { data: any }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  // Use admin-provided skill categories if available, else defaults
  const skillCategories = data?.skillCategories?.length > 0
    ? data.skillCategories.map((cat: any) => ({
        ...cat,
        icon: ICON_MAP[cat.label] || <Layers size={22} />,
      }))
    : DEFAULT_SKILL_CATEGORIES;

  const chips: string[] = data?.skills?.length > 0 ? data.skills : DEFAULT_QUICK_SKILLS;

  return (
    <section id="skills" className="py-24" ref={ref}>
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
        <div>
          <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-none uppercase">
            Core <br /> <span className="text-primary">Skills</span>
          </h2>
        </div>
        <p className="text-muted-foreground font-bold uppercase tracking-[0.3em] text-xs">
          Technical Expertise
        </p>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-14">
        {skillCategories.map((cat: any, catIdx: number) => (
          <motion.div
            key={cat.label}
            initial={{ opacity: 0, y: 32 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: catIdx * 0.1, ease: 'easeOut' }}
            className="glass p-8 rounded-[2rem] border border-transparent hover:border-primary/20 transition-all duration-500 group"
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

      {chips.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="glass p-10 rounded-[2rem]"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50 mb-6">
            Additional Competencies
          </p>
          <div className="flex flex-wrap gap-3">
            {chips.map((skill: string, i: number) => (
              <motion.span
                key={skill}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.5 + i * 0.04, duration: 0.3 }}
                className="px-5 py-2 bg-primary/8 border border-primary/15 text-primary rounded-full text-xs font-black uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-all cursor-default"
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
