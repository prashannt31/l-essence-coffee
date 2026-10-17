'use client';

export default function ReserveModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4">
      <div className="bg-black border border-[#CACBA7]/30 p-8 max-w-md w-full text-[#CACBA7]">
        <h2 className="text-xl font-serif mb-6 uppercase tracking-widest">Reserve Your Experience</h2>
        
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert("Reservation Request Sent."); onClose(); }}>
          <select className="w-full bg-black border border-white/[0.1] p-3 text-sm uppercase tracking-widest outline-none focus:border-[#CACBA7]">
            <option>JAIPUR</option>
            <option>CHENNAI</option>
            <option>MUMBAI</option>
          </select>
          
          <input 
            type="date" 
            className="w-full bg-black border border-white/[0.1] p-3 text-sm uppercase tracking-widest outline-none focus:border-[#CACBA7]" 
            required 
          />
          
          <button 
            type="submit" 
            className="w-full py-3 border border-[#CACBA7]/30 hover:bg-[#CACBA7] hover:text-black uppercase tracking-widest text-xs transition-all"
          >
            Confirm Reservation
          </button>
        </form>
        
        <button 
          onClick={onClose} 
          className="mt-6 text-[10px] text-zinc-600 underline uppercase tracking-widest hover:text-[#CACBA7]"
        >
          Close
        </button>
      </div>
    </div>
  );
}