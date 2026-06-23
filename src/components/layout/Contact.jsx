import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, MapPin, Briefcase, Code, MessageSquare, Phone, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [contactLinks, setContactLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'contact')
          .single();

        if (data && data.value) {
          const vals = data.value;
          setContactLinks([
            { icon: Mail, label: 'Email', value: vals.email || 'ido24si@mahasiswa.pcr.ac.id', link: vals.email ? `mailto:${vals.email}` : 'mailto:ido24si@mahasiswa.pcr.ac.id' },
            { icon: Phone, label: 'Phone', value: vals.phone || '+62 813-6355-4262', link: vals.phone ? `tel:${vals.phone.replace(/[^0-9+]/g, '')}` : 'tel:+6281363554262' },
            { icon: MapPin, label: 'Location', value: vals.location || 'Pekanbaru, Indonesia', link: '#' },
            { icon: Briefcase, label: 'LinkedIn', value: vals.linkedin ? 'linkedin.com/in/...' : 'Not provided', link: vals.linkedin || '#' },
            { icon: Code, label: 'GitHub', value: vals.github ? 'github.com/...' : 'Not provided', link: vals.github || '#' }
          ]);
        } else {
          setContactLinks([
            { icon: Mail, label: 'Email', value: 'ido24si@mahasiswa.pcr.ac.id', link: 'mailto:ido24si@mahasiswa.pcr.ac.id' },
            { icon: Phone, label: 'Phone', value: '+62 813-6355-4262', link: 'tel:+6281363554262' },
            { icon: MapPin, label: 'Location', value: 'Pekanbaru, Indonesia', link: '#' }
          ]);
        }
      } catch (err) {
        console.error('Error fetching contact data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchContactData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('messages')
        .insert([
          { name: formData.name, email: formData.email, message: formData.message }
        ]);
        
      if (error) throw error;

      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return null;

  return (
    <section id="contact" className="py-32 bg-black relative border-t border-white/[0.05] overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-white/[0.03] rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-white"
          >
            Get In Touch
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-white/50 text-lg max-w-2xl mx-auto"
          >
            Have a project in mind or just want to say hi? I'd love to hear from you.
          </motion.p>
        </div>

        <div className="flex flex-col gap-12 max-w-4xl mx-auto">
          
          {/* Contact Information */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="apple-glass-heavy p-8 md:p-10 rounded-[2.5rem] w-full"
          >
            <h3 className="text-2xl font-bold text-white mb-8 text-center">Contact Information</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {contactLinks.map((item, idx) => (
                <a 
                  key={idx}
                  href={item.link}
                  target={item.link !== '#' ? "_blank" : "_self"}
                  rel="noreferrer"
                  className="flex flex-col items-center text-center gap-4 group p-6 bg-dark-950/40 border border-white/5 rounded-2xl hover:bg-white/[0.05] transition-all"
                >
                  <div className="w-14 h-14 shrink-0 rounded-full bg-white/5 flex items-center justify-center text-white/50 group-hover:text-white group-hover:bg-white/10 transition-all">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div className="overflow-hidden w-full">
                    <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-1.5">{item.label}</p>
                    <p className="text-sm font-medium text-white group-hover:text-white/80 transition-colors truncate">{item.value}</p>
                  </div>
                </a>
              ))}
            </div>

            <div className="pt-8 mt-8 border-t border-white/10 flex justify-center gap-4">
               <a href="#" className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:bg-white hover:text-black transition-colors">
                  <MessageSquare className="w-5 h-5" />
               </a>
               <a href="#" className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:bg-white hover:text-black transition-colors">
                  <Briefcase className="w-5 h-5" />
               </a>
               <a href="#" className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:bg-white hover:text-black transition-colors">
                  <Code className="w-5 h-5" />
               </a>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="apple-glass-heavy p-8 md:p-10 rounded-[2.5rem] w-full"
          >
            {submitted ? (
               <div className="h-full flex flex-col items-center justify-center min-h-[300px] text-center">
                  <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-6 text-white">
                     <Send className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                  <p className="text-white/50">Thanks for reaching out. I'll get back to you as soon as possible.</p>
               </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/50 uppercase tracking-wider">Your Name</label>
                    <input 
                      required 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-dark-950/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/40 focus:bg-dark-950 transition-colors" 
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/50 uppercase tracking-wider">Email Address</label>
                    <input 
                      required 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-dark-950/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/40 focus:bg-dark-950 transition-colors" 
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/50 uppercase tracking-wider">Message</label>
                  <textarea 
                    required 
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full bg-dark-950/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/40 focus:bg-dark-950 transition-colors resize-none" 
                    placeholder="Tell me about your project..."
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-white text-black font-bold text-sm py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-white/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                  ) : (
                    <><Send className="w-4 h-4" /> Send Message</>
                  )}
                </button>
              </form>
            )}
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Contact;
