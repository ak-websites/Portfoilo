import { motion } from 'framer-motion';
import { sanitizeImageUrl } from '../../utils/security';

export default function Gallery({ data }: { data: any[] }) {
  const items = data && data.length > 0 ? data : [
    { id: '1', url: 'https://images.unsplash.com/photo-1590644365607-1c5a519a7a37?auto=format&fit=crop&q=80', span: 'col-span-2 row-span-2' },
    { id: '2', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80', span: 'col-span-1 row-span-1' },
    { id: '3', url: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80', span: 'col-span-1 row-span-1' },
    { id: '4', url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80', span: 'col-span-1 row-span-2' },
    { id: '5', url: 'https://images.unsplash.com/photo-1517089535819-f4856086497a?auto=format&fit=crop&q=80', span: 'col-span-1 row-span-1' },
  ];

  return (
    <section id="gallery" className="py-24">
       <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
        <div>
          <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-none uppercase">
            Visual <br /> <span className="text-primary">Portfolio</span>
          </h2>
        </div>
        <p className="text-muted-foreground font-bold uppercase tracking-[0.3em] text-xs">
          Captured Excellence
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-2 gap-4 h-[600px] md:h-[800px]">
        {items.slice(0, 5).map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className={`${item.span || 'col-span-1 row-span-1'} relative overflow-hidden rounded-[2rem] group`}
          >
            <img 
              src={sanitizeImageUrl(item.url)} 
              alt="Work gallery" 
              className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white font-black uppercase tracking-widest text-xs border-2 border-white px-6 py-2 rounded-full scale-90 group-hover:scale-100 transition-transform">
                View Full
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
