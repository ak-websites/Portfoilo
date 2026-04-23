import { motion, useScroll, useSpring, useTransform, useInView, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useContent } from '../store/useContent';
import { useTheme, type ThemeSet } from '../store/useTheme';
import Hero from '../components/sections/Hero';
import About from '../components/sections/About';
import Education from '../components/sections/Education';
import Experience from '../components/sections/Experience';
import Projects from '../components/sections/Projects';
import Contact from '../components/sections/Contact';
import Gallery from '../components/sections/Gallery';
import Skills from '../components/sections/Skills';
import FloatingSocialSidebar from '../components/social/FloatingSocialSidebar';
import { getThemeRevealVariants } from '../lib/themePresentation';
import { buildFallbackSocialLinks } from '../lib/socialPlatforms';

export default function Home() {
  const { hero, about, education, experience, projects, gallery, contact } = useContent();
  const { themeSet } = useTheme();
  const prefersReducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);
  const { scrollYProgress } = useScroll();
  const progressScaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 25,
    mass: 0.2,
  });
  const blobYOne = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const blobYTwo = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const socialLinks = buildFallbackSocialLinks(contact);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)');
    const updateMobileState = () => setIsMobile(mediaQuery.matches);
    updateMobileState();
    mediaQuery.addEventListener('change', updateMobileState);
    return () => mediaQuery.removeEventListener('change', updateMobileState);
  }, []);

  const shouldReduceEffects = prefersReducedMotion || isMobile;

  const sections = [
    { id: 'about', node: <About data={about} /> },
    { id: 'skills', node: <Skills data={about} /> },
    { id: 'education', node: <Education data={education} /> },
    { id: 'experience', node: <Experience data={experience} /> },
    { id: 'projects', node: <Projects data={projects} /> },
    { id: 'gallery', node: <Gallery data={gallery} /> },
    { id: 'contact', node: <Contact data={contact} /> },
  ];

  return (
    <div className="space-y-0 overflow-x-hidden relative">
      <motion.div
        style={{ scaleX: shouldReduceEffects ? 0 : progressScaleX }}
        className="fixed top-0 left-0 right-0 h-1 bg-primary origin-left z-[70] shadow-[0_0_18px_hsl(var(--primary)/0.5)]"
      />
      <div className={`absolute inset-0 pointer-events-none ${shouldReduceEffects ? 'hidden md:block' : ''}`}>
        <motion.div
          style={{ y: shouldReduceEffects ? 0 : blobYOne }}
          className="absolute top-[30%] left-[-120px] w-[320px] h-[320px] bg-primary/10 rounded-full blur-3xl"
        />
        <motion.div
          style={{ y: shouldReduceEffects ? 0 : blobYTwo }}
          className="absolute bottom-[15%] right-[-120px] w-[360px] h-[360px] bg-accent/10 rounded-full blur-3xl"
        />
      </div>
      <FloatingSocialSidebar links={socialLinks} />
      <Hero data={hero} />
      <div className="container mx-auto px-4 md:px-8 py-16 md:py-24 relative z-10 themed-sections">
        {sections.map((section, index) => (
          <FadeInSection key={section.id} index={index} themeSet={themeSet}>
            {index > 0 && <div className="section-divider" />}
            {section.node}
          </FadeInSection>
        ))}
      </div>
    </div>
  );
}

function FadeInSection({
  children,
  index,
  themeSet,
}: {
  children: React.ReactNode;
  index: number;
  themeSet: ThemeSet;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const variants = getThemeRevealVariants(themeSet);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.05 }}
      className={index === 0 ? '' : 'section-shell'}
    >
      {children}
    </motion.div>
  );
}
