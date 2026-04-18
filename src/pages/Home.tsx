import { useContent } from '../store/useContent';
import Hero from '../components/sections/Hero';
import About from '../components/sections/About';
import Experience from '../components/sections/Experience';
import Projects from '../components/sections/Projects';
import Contact from '../components/sections/Contact';
import Gallery from '../components/sections/Gallery';

export default function Home() {
  const { hero, about, experience, projects, gallery, contact } = useContent();

  return (
    <div className="space-y-0 overflow-x-hidden">
      <Hero data={hero} />
      <div className="container mx-auto px-4 md:px-8 space-y-24 py-24">
        <About data={about} />
        <Experience data={experience} />
        <Projects data={projects} />
        <Gallery data={gallery} />
        <Contact data={contact} />
      </div>
    </div>
  );
}
