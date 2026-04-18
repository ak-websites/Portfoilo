import { motion } from 'framer-motion';
import { GraduationCap, Briefcase, Award } from 'lucide-react';

export default function About({ data }: { data: any }) {
  const bio = data?.bio || "Highly dedicated Civil Engineer with a passion for building sustainable and resilient infrastructure. Currently pursuing Masters in Engineering from Kathmandu University (KU). Experienced in site management, structural analysis, and team coordination. Bridging the gap between engineering precision and modern architectural aesthetics.";

  return (
    <section id="about" className="py-24">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative group"
        >
          <div className="aspect-[4/5] rounded-[3rem] overflow-hidden border-8 border-background shadow-2xl relative z-10">
            <img 
              src={data?.image || "https://images.unsplash.com/photo-1503387762-592dea58ef23?auto=format&fit=crop&q=80"} 
              alt="Nayan Kuikel" 
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
            />
          </div>
          <div className="absolute -inset-4 bg-primary/20 rounded-[3.5rem] -z-10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-accent/20 rounded-full blur-3xl" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div>
            <h2 className="text-5xl font-black tracking-tighter mb-6 leading-none uppercase">
              Engineering <br /> <span className="text-primary">with Purpose</span>
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed font-medium">
              {bio}
            </p>
          </div>

          <div className="grid gap-6">
            <AboutMetric 
              icon={<GraduationCap className="text-primary" />} 
              label="Education" 
              value={data?.education || "Masters in KU (Pursuing)"} 
            />
            <AboutMetric 
              icon={<Briefcase className="text-primary" />} 
              label="Current Role" 
              value={data?.currentRole || "Professional Site Engineer"} 
            />
            <AboutMetric 
              icon={<Award className="text-primary" />} 
              label="Expertise" 
              value={data?.skills?.length > 0 ? data.skills.join(', ') : "Structural Design, ETABS, Site Supervision"} 
            />
          </div>

          {data?.skills?.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-4">
              {data.skills.map((skill: string) => (
                <span key={skill} className="px-4 py-2 bg-primary/10 text-primary rounded-full text-xs font-black uppercase tracking-widest border border-primary/20">
                  {skill}
                </span>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

function AboutMetric({ icon, label, value }: any) {
  return (
    <div className="glass p-6 rounded-2xl flex items-center gap-6 border-l-4 border-l-primary hover:translate-x-2 transition-transform">
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-1">{label}</p>
        <p className="font-bold text-lg tracking-tight">{value}</p>
      </div>
    </div>
  );
}
