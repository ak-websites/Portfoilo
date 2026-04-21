import { motion } from 'framer-motion';
import { useContent } from '../store/useContent';
import Hero from '../components/sections/Hero';
import About from '../components/sections/About';
import Education from '../components/sections/Education';
import Experience from '../components/sections/Experience';
import Projects from '../components/sections/Projects';
import Contact from '../components/sections/Contact';
import Gallery from '../components/sections/Gallery';

export default function Home() {
  const { hero, about, education, experience, projects, gallery, contact } = useContent();
  const sections = [
    { id: 'about', node: <About data={about} /> },
    { id: 'education', node: <Education data={education} /> },
    { id: 'experience', node: <Experience data={experience} /> },
    { id: 'projects', node: <Projects data={projects} /> },
    { id: 'gallery', node: <Gallery data={gallery} /> },
    { id: 'contact', node: <Contact data={contact} /> },
  ];

  return (
    <div className="space-y-0 overflow-x-hidden relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[30%] left-[-120px] w-[320px] h-[320px] bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[15%] right-[-120px] w-[360px] h-[360px] bg-accent/10 rounded-full blur-3xl" />
      </div>
      <Hero data={hero} />
      <div className="container mx-auto px-4 md:px-8 py-24 relative z-10">
        {sections.map((section, index) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.65, ease: 'easeOut', delay: index * 0.04 }}
            className={index === 0 ? '' : 'section-shell'}
          >
            {index > 0 && <div className="section-divider" />}
            {section.node}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
