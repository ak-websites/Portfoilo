import { motion } from 'framer-motion';

export default function About({ data }: { data: any }) {
  const defaultSkills = ["AutoCAD", "ETABS", "SAP2000", "Project Management", "Site Engineering", "Sustainable Design"];

  return (
    <section id="about" className="relative">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl"
        >
          <img 
            src={data?.image || "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80"} 
            alt="Nayan Kuikel" 
            className="object-cover w-full h-full grayscale hover:grayscale-0 transition-all duration-700"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">Architecture & Engineering</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {data?.bio || "A dedicated Civil Engineer currently pursuing Masters at Kathmandu University (KU). Serving as a Site Engineer at Vawan Bivag, I bridge the gap between structural integrity and modern aesthetic design. My expertise lies in Etabs, structural analysis, and complex project execution."}
          </p>
          
          <div className="pt-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="w-8 h-px bg-primary" />
              Core Competencies
            </h3>
            <div className="flex flex-wrap gap-2">
              {(data?.skills || defaultSkills).map((skill: string) => (
                <span key={skill} className="px-4 py-2 bg-accent rounded-lg text-sm font-medium border border-border/50">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-6">
            <div className="p-4 border border-border rounded-2xl">
              <span className="block text-3xl font-bold">KU</span>
              <span className="text-sm text-muted-foreground">Masters in Civil Engineering</span>
            </div>
            <div className="p-4 border border-border rounded-2xl">
              <span className="block text-3xl font-bold">Vawan Bivag</span>
              <span className="text-sm text-muted-foreground">Site Engineer</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
