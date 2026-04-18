import { motion } from 'framer-motion';

export default function Experience({ data }: { data: any[] }) {
  const experiences = data.length > 0 ? data : [
    {
      company: "Vawan Bivag",
      role: "Site Engineer",
      period: "2023 - Present",
      description: "Managing site operations, structural monitoring, and architectural compliance for large-scale government buildings."
    },
    {
      company: "Kathmandu University",
      role: "Masters Student",
      period: "2024 - Present",
      description: "Specializing in advanced structural engineering and earthquake-resistant design."
    }
  ];

  return (
    <section id="experience" className="space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">Timeline of Impact</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">Track record of professional growth and engineering excellence.</p>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {experiences.map((exp, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative pl-8 border-l-2 border-primary/20 pb-8 last:pb-0"
          >
            <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-primary" />
            <div className="glass p-6 rounded-2xl border border-border/50 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-wrap justify-between items-start gap-2 mb-4">
                <div>
                  <h3 className="text-xl font-bold">{exp.role}</h3>
                  <p className="text-primary font-medium">{exp.company}</p>
                </div>
                <span className="text-sm px-3 py-1 bg-primary/10 text-primary rounded-full">{exp.period}</span>
              </div>
              <p className="text-muted-foreground">{exp.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
