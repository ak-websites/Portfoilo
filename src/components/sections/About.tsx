import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { GraduationCap, Briefcase, Award, MapPin, Calendar, Users, ChevronDown, ChevronUp } from 'lucide-react';

const BIO_LIMIT = 220;

export default function About({ data }: { data: any }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const [bioExpanded, setBioExpanded] = useState(false);

  const bio: string = data?.bio || '';
  const isBioLong = bio.length > BIO_LIMIT;
  const displayBio = bioExpanded || !isBioLong ? bio : bio.slice(0, BIO_LIMIT) + '…';

  const currentYear = new Date().getFullYear();
  const firstJobYear = data?.firstJobYear ? parseInt(data.firstJobYear) : null;
  const yearsExperience = firstJobYear
    ? currentYear - firstJobYear
    : data?.yearsExperience ?? null;

  const projectCount = data?.projectCount ?? null;
  const teamsLed = data?.teamsLed ?? null;
  const location = data?.location || null;

  const statCards = [
    (firstJobYear !== null || yearsExperience !== null)
      ? { icon: <Calendar size={20} />, value: `${yearsExperience}+`, label: 'Years Experience' }
      : null,
    projectCount !== null
      ? { icon: <Briefcase size={20} />, value: `${projectCount}+`, label: 'Projects Delivered' }
      : null,
    teamsLed !== null
      ? { icon: <Users size={20} />, value: `${teamsLed}+`, label: 'Teams Led' }
      : null,
    location
      ? { icon: <MapPin size={20} />, value: location, label: 'Based In' }
      : null,
  ].filter(Boolean);

  return (
    <section id="about" className="py-24" ref={ref}>
      <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="relative group"
        >
          <div className="aspect-[4/5] rounded-[3rem] overflow-hidden border-8 border-background shadow-2xl relative z-10">
            {data?.image ? (
              <img
                src={data.image}
                alt="Nayan Kuikel"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
              />
            ) : (
              <div className="w-full h-full bg-accent/20 flex items-center justify-center text-sm uppercase tracking-widest text-muted-foreground">
                Add profile image from admin
              </div>
            )}
          </div>
          <div className="absolute -inset-4 bg-primary/20 rounded-[3.5rem] -z-10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
        </motion.div>

        {/* Bio + Key Metrics */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="space-y-8"
        >
          <div>
            <h2 className="text-5xl font-black tracking-tighter mb-4 leading-none uppercase">
              Engineering <br /> <span className="text-primary">with Purpose</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed font-medium">
              {bio ? displayBio : 'Add your bio from the admin panel.'}
            </p>
            {isBioLong && bio && (
              <button
                onClick={() => setBioExpanded(!bioExpanded)}
                className="mt-3 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-primary hover:opacity-70 transition-opacity"
              >
                {bioExpanded ? (
                  <><ChevronUp size={12} /> Read Less</>
                ) : (
                  <><ChevronDown size={12} /> Read More</>
                )}
              </button>
            )}
          </div>

          <div className="grid gap-4">
            {data?.education && (
              <Metric icon={<GraduationCap className="text-primary" />} label="Education" value={data.education} />
            )}
            {data?.currentRole && (
              <Metric icon={<Briefcase className="text-primary" />} label="Current Role" value={data.currentRole} />
            )}
            {data?.skills?.length > 0 && (
              <Metric icon={<Award className="text-primary" />} label="Expertise" value={data.skills.slice(0, 3).join(', ')} />
            )}
          </div>
        </motion.div>
      </div>

      {/* Stat Cards */}
      {statCards.length > 0 && (
        <div
          className={`grid gap-4 ${
            statCards.length === 4
              ? 'grid-cols-2 md:grid-cols-4'
              : statCards.length === 3
              ? 'grid-cols-1 sm:grid-cols-3'
              : 'grid-cols-2'
          }`}
        >
          {statCards.map((stat: any, i: number) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.08 }}
              className="glass p-8 rounded-[1.5rem] text-center group hover:border-primary/20 border-2 border-transparent transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                {stat.icon}
              </div>
              <p className="text-3xl font-black tracking-tighter">{stat.value}</p>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-50 mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}

function Metric({ icon, label, value }: any) {
  return (
    <div className="glass p-5 rounded-2xl flex items-center gap-5 border-l-4 border-l-primary hover:translate-x-1 transition-transform">
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">{icon}</div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-0.5">{label}</p>
        <p className="font-bold text-base tracking-tight">{value}</p>
      </div>
    </div>
  );
}
