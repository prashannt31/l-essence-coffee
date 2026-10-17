'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ReservePage() {
  const [formData, setFormData] = useState({ 
    location: 'JAIPUR', 
    ambience: 'ROASTERY',
    party: '',
    date: '',
    name: '',     // Added
    email: '',    // Added
    phone: '',    // Added
    requests: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Full Booking Details:", formData);
    setIsSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-[#030303] text-[#CACBA7] flex items-center justify-center p-8 md:p-24 selection:bg-[#CACBA7] selection:text-black">
      <AnimatePresence mode="wait">
        {!isSubmitted ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl w-full">
            <div className="mb-24">
              <p className="text-[10px] uppercase tracking-[0.5em] text-[#6D8575] mb-6">Concierge Services</p>
              <h1 className="text-5xl md:text-7xl font-serif text-[#E5E5E5] tracking-tight mb-12">The Reserve</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-20">
              <div className="grid md:grid-cols-2 gap-20">
                {/* Column 1: Selections */}
                <div className="space-y-16">
                  <div>
                    <label className="block text-[9px] uppercase tracking-[0.3em] text-zinc-600 mb-8">Location</label>
                    <div className="flex flex-col gap-4">
                      {['JAIPUR', 'CHENNAI', 'MUMBAI'].map(loc => (
                        <button key={loc} type="button" onClick={() => setFormData({...formData, location: loc})}
                          className={`text-left text-2xl font-serif transition-all ${formData.location === loc ? 'text-[#CACBA7]' : 'text-zinc-800 hover:text-zinc-600'}`}>
                          {loc}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase tracking-[0.3em] text-zinc-600 mb-8">Ambience</label>
                    <div className="flex flex-col gap-4">
                      {['ROASTERY', 'PATIO', 'LOUNGE'].map(vibe => (
                        <button key={vibe} type="button" onClick={() => setFormData({...formData, ambience: vibe})}
                          className={`text-left text-2xl font-serif transition-all ${formData.ambience === vibe ? 'text-[#CACBA7]' : 'text-zinc-800 hover:text-zinc-600'}`}>
                          {vibe}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Column 2: Details & Contact */}
                <div className="space-y-8">
                  <input type="text" placeholder="NAME" onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-transparent border-b border-zinc-800 py-4 text-sm tracking-widest outline-none focus:border-[#CACBA7]" required />
                  <input type="email" placeholder="EMAIL" onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-transparent border-b border-zinc-800 py-4 text-sm tracking-widest outline-none focus:border-[#CACBA7]" required />
                  <input type="tel" placeholder="PHONE" onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full bg-transparent border-b border-zinc-800 py-4 text-sm tracking-widest outline-none focus:border-[#CACBA7]" required />
                  
                  <div className="grid grid-cols-2 gap-8 pt-8">
                    <input type="date" onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full bg-transparent border-b border-zinc-800 py-4 text-sm tracking-widest outline-none focus:border-[#CACBA7] [color-scheme:dark]" required />
                    <input type="number" placeholder="GUESTS" onChange={(e) => setFormData({...formData, party: e.target.value})} className="w-full bg-transparent border-b border-zinc-800 py-4 text-sm tracking-widest outline-none focus:border-[#CACBA7]" required />
                  </div>
                  
                  <textarea placeholder="SPECIAL REQUESTS" onChange={(e) => setFormData({...formData, requests: e.target.value})} className="w-full bg-transparent border-b border-zinc-800 py-4 text-sm tracking-widest outline-none focus:border-[#CACBA7] h-24" />
                </div>
              </div>

              <button type="submit" className="w-full py-8 border border-[#CACBA7]/10 hover:bg-[#CACBA7] hover:text-black uppercase tracking-[0.4em] text-[12px] transition-all">
                Confirm Reservation Request
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <h2 className="text-4xl font-serif mb-6">Request Received</h2>
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#6D8575]">A concierge will contact you shortly via email or phone.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}