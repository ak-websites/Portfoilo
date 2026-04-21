import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Send, CheckCircle, AlertCircle, Mail, Phone, Link } from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function Contact({ data }: { data: any }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (formData: ContactFormValues) => {
    setStatus('loading');
    try {
      await addDoc(collection(db, 'messages'), {
        ...formData,
        createdAt: serverTimestamp(),
      });
      setStatus('success');
      reset();
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error('Error sending message:', error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2" />
      
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            {/* Info Column */}
            <div className="space-y-12">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-none">
                  LET'S <br /> <span className="text-primary">CONNECT</span>
                </h2>
                <p className="text-xl text-muted-foreground font-medium max-w-md leading-relaxed">
                  {data?.headline || 'Update contact headline from admin.'}
                </p>
              </motion.div>

              <div className="space-y-6">
                <ContactInfoItem 
                  icon={<Mail className="text-primary" size={24} />} 
                  label="Email" 
                  value={data?.email || 'Add email from admin'}
                  href={data?.email ? `mailto:${data.email}` : '#'}
                />
                <ContactInfoItem 
                  icon={<Phone className="text-primary" size={24} />} 
                  label="Phone" 
                  value={data?.phone || 'Add phone from admin'}
                  href={data?.phone ? `tel:${data.phone}` : '#'}
                />
                <ContactInfoItem 
                  icon={<Link className="text-primary" size={24} />} 
                  label="LinkedIn" 
                  value={data?.linkedinLabel || 'Add LinkedIn from admin'}
                  href={data?.linkedin || '#'}
                />
              </div>
            </div>

            {/* Form Column */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="glass p-10 md:p-16 rounded-[3rem] shadow-2xl relative"
            >
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-3 opacity-50">Full Name</label>
                    <input
                      {...register('name')}
                      placeholder="Enter your name"
                      className="w-full bg-background/50 border-2 border-border rounded-2xl px-6 py-4 font-bold focus:border-primary outline-none transition-all placeholder:text-muted-foreground/30"
                    />
                    {errors.name && <p className="text-destructive text-xs mt-2 font-bold uppercase tracking-widest">{errors.name.message}</p>}
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-3 opacity-50">Email Address</label>
                    <input
                      {...register('email')}
                      placeholder="Enter your email"
                      className="w-full bg-background/50 border-2 border-border rounded-2xl px-6 py-4 font-bold focus:border-primary outline-none transition-all placeholder:text-muted-foreground/30"
                    />
                    {errors.email && <p className="text-destructive text-xs mt-2 font-bold uppercase tracking-widest">{errors.email.message}</p>}
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-3 opacity-50">Message</label>
                    <textarea
                      {...register('message')}
                      placeholder="Tell me about your project"
                      className="w-full bg-background/50 border-2 border-border rounded-2xl px-6 py-4 font-bold min-h-[160px] focus:border-primary outline-none transition-all placeholder:text-muted-foreground/30"
                    />
                    {errors.message && <p className="text-destructive text-xs mt-2 font-bold uppercase tracking-widest">{errors.message.message}</p>}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full group bg-primary text-primary-foreground py-6 rounded-2xl font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/20 disabled:opacity-70 disabled:scale-100 flex items-center justify-center gap-3"
                >
                  {status === 'loading' ? (
                    <div className="w-6 h-6 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  ) : status === 'success' ? (
                    <>
                      <CheckCircle size={24} />
                      Message Sent!
                    </>
                  ) : status === 'error' ? (
                    <>
                      <AlertCircle size={24} />
                      Something went wrong
                    </>
                  ) : (
                    <>
                      <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactInfoItem({ icon, label, value, href }: any) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-6 group">
      <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center border border-primary/10 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-1">{label}</p>
        <p className="text-xl font-bold tracking-tight">{value}</p>
      </div>
    </a>
  );
}
