import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate sending
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setIsSubmitted(false), 4000);
    }, 1200);
  };

  return (
    <div className="pt-24 pb-8 min-h-[calc(100vh-220px)] flex items-center justify-center bg-[#FAF9F6] px-5 md:px-[60px]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[1000px] grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center"
      >
        {/* Left Side: Info */}
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#1A1A1A] tracking-tight mb-4">
              Get in Touch
            </h1>
            <p className="text-[#666666] font-medium text-lg max-w-[400px]">
              Whether you have a question about our exclusive suites, bespoke spa treatments, or anything else, our team is ready to answer all your questions.
            </p>
          </div>

          <div className="space-y-6 mt-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white border border-[#EBEBEB] flex items-center justify-center text-[#8B6B10] shadow-sm">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-[#1A1A1A] font-bold text-sm uppercase tracking-widest">Location</h4>
                <p className="text-[#666666] font-medium">123 Luxury Ave, Beverly Hills, CA</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white border border-[#EBEBEB] flex items-center justify-center text-[#8B6B10] shadow-sm">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-[#1A1A1A] font-bold text-sm uppercase tracking-widest">Phone</h4>
                <p className="text-[#666666] font-medium">+1 (800) 123-4567</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white border border-[#EBEBEB] flex items-center justify-center text-[#8B6B10] shadow-sm">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-[#1A1A1A] font-bold text-sm uppercase tracking-widest">Email</h4>
                <p className="text-[#666666] font-medium">reservations@luxereserve.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form or Success */}
        <div className="bg-white p-8 rounded-3xl shadow-[0_12px_40px_-6px_rgba(0,0,0,0.04)] border border-[#F0F0F0] h-[480px] flex items-center relative overflow-hidden">
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.form 
                key="contact-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSubmit} 
                className="flex flex-col gap-5 w-full"
              >
                <div>
                  <label className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-widest block mb-2">Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-[#FAF9F6] border border-[#EBEBEB] focus:border-[#8B6B10] rounded-2xl outline-none text-[#1A1A1A] font-medium transition-colors"
                    placeholder="John Doe"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-widest block mb-2">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-[#FAF9F6] border border-[#EBEBEB] focus:border-[#8B6B10] rounded-2xl outline-none text-[#1A1A1A] font-medium transition-colors"
                    placeholder="john@example.com"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-widest block mb-2">Message</label>
                  <textarea 
                    required
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 bg-[#FAF9F6] border border-[#EBEBEB] focus:border-[#8B6B10] rounded-2xl outline-none text-[#1A1A1A] font-medium transition-colors resize-none"
                    placeholder="How can we help you?"
                    disabled={isSubmitting}
                  ></textarea>
                </div>
                
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#1A1A1A] text-white font-bold py-4 rounded-2xl hover:bg-[#8B6B10] transition-colors flex items-center justify-center gap-2 shadow-md mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      Send Message
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </motion.form>
            ) : (
              <motion.div
                key="success-message"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: 'spring', bounce: 0.5 }}
                className="w-full flex flex-col items-center justify-center text-center py-10 absolute inset-0"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 10 }}
                  className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600"
                >
                  <CheckCircle className="w-10 h-10" />
                </motion.div>
                <h3 className="text-2xl font-bold text-[#1A1A1A] mb-2">Message Sent!</h3>
                <p className="text-[#666666] font-medium px-6">
                  Thank you for reaching out. We will get back to you shortly.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
