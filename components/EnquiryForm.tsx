'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function EnquiryForm() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' }); // Clear form
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <section className="w-full min-h-screen bg-luxury-black flex items-center justify-center px-6 py-24">
      <div className="w-full max-w-xl space-y-10">
        
        {/* Header Text */}
        <div className="space-y-3 text-center md:text-left">
          <span className="font-sans text-[10px] tracking-[0.4em] uppercase text-luxury-sage block">
            Connect
          </span>
          <h2 className="font-serif text-3xl md:text-5xl text-luxury-beige font-normal">
            Begin the Dialogue.
          </h2>
        </div>

        {/* The Form */}
        {status === 'success' ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 border border-luxury-sage/20 bg-luxury-black text-center space-y-4"
          >
            <p className="font-serif text-xl text-luxury-beige">Thank You</p>
            <p className="font-sans text-sm text-luxury-sage/80 max-w-sm mx-auto leading-relaxed">
              Your enquiry has safely reached our roasting studio. A formal confirmation has been sent to your inbox.
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8 font-sans">
            
            {/* Name Input */}
            <div className="relative group border-b border-luxury-sage/20 focus-within:border-luxury-beige transition-colors duration-300">
              <input
                type="text"
                required
                placeholder="YOUR NAME"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-transparent py-4 text-sm text-luxury-beige placeholder-luxury-sage/40 focus:outline-none tracking-widest"
              />
            </div>

            {/* Email Input */}
            <div className="relative group border-b border-luxury-sage/20 focus-within:border-luxury-beige transition-colors duration-300">
              <input
                type="email"
                required
                placeholder="EMAIL ADDRESS"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-transparent py-4 text-sm text-luxury-beige placeholder-luxury-sage/40 focus:outline-none tracking-widest"
              />
            </div>

            {/* Message Input */}
            <div className="relative group border-b border-luxury-sage/20 focus-within:border-luxury-beige transition-colors duration-300">
              <textarea
                required
                rows={4}
                placeholder="HOW CAN WE ELEVATE YOUR EXPERIENCE?"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-transparent py-4 text-sm text-luxury-beige placeholder-luxury-sage/40 focus:outline-none tracking-widest resize-none leading-relaxed"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full md:w-auto px-8 py-4 border border-luxury-beige text-luxury-beige text-xs tracking-[0.3em] uppercase hover:bg-luxury-beige hover:text-luxury-black transition-all duration-500 disabled:opacity-40"
            >
              {status === 'loading' ? 'SENDING...' : 'SEND ENQUIRY'}
            </button>

            {status === 'error' && (
              <p className="text-red-400 text-xs tracking-wider text-center md:text-left">
                Something went wrong. Please try again or email us directly.
              </p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}