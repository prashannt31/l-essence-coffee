'use client';

import { useState, useEffect, useTransition } from 'react';
import OrderSimulationButton from "@/components/admin/OrderSimulation";

interface CoffeeProduct {
  id: string;
  name: string;
  price: number;
  roastLevel: string;
  stockCount: number;
}

export default function AdminPage() {
  const [products, setProducts] = useState<CoffeeProduct[]>([]);
  const [roastLevel, setRoastLevel] = useState<'low' | 'medium' | 'hard'>('low');
  const [isPending, startTransition] = useTransition();

  const tiers = [
    { value: 'low', label: 'Low Hardness', profile: 'The Radiant' },
    { value: 'medium', label: 'Medium Hardness', profile: 'The Serene' },
    { value: 'hard', label: 'Hard Intensity', profile: 'The Nocturnal' },
  ];

  // 1. Pull current inventory allocations from local storage on load to prevent blank void tables
  useEffect(() => {
    const saved = localStorage.getItem('l_essence_inventory');
    if (saved) {
      setProducts(JSON.parse(saved));
    } else {
      const defaults = [
        { id: 'c1', name: "Midnight Reserve", price: 5.20, roastLevel: "hard", stockCount: 12 },
        { id: 'c2', name: "Cold Coffee Essence", price: 6.50, roastLevel: "medium", stockCount: 2 },
        { id: 'c3', name: "Luminous Geisha", price: 8.00, roastLevel: "low", stockCount: 24 }
      ];
      setProducts(defaults);
      localStorage.setItem('l_essence_inventory', JSON.stringify(defaults));
    }
  }, []);

  // 2. Add item allocation controller execution engine
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const name = formData.get('name') as string;
    const price = Number(formData.get('price') || 0);
    const stockCount = Number(formData.get('stockCount') || 0);

    if (!name) return;

    const newProduct: CoffeeProduct = {
      id: `c_${Date.now()}`,
      name,
      price,
      roastLevel,
      stockCount
    };

    startTransition(() => {
      const updatedProducts = [newProduct, ...products];
      setProducts(updatedProducts);
      localStorage.setItem('l_essence_inventory', JSON.stringify(updatedProducts));
      e.target ? (e.target as HTMLFormElement).reset() : null;
    });
  };

  // 3. Remove calculation handler target
  const handleRemove = (id: string) => {
    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    localStorage.setItem('l_essence_inventory', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-24 px-6 md:px-12 relative overflow-hidden font-sans antialiased selection:bg-zinc-800">
      
      {/* Royal Background Lighting Accents */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#6D8575]/[0.02] blur-[160px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#CACBA7]/[0.01] blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-[1400px] mx-auto relative z-10">
        
        {/* Editorial Heading Section */}
        <div className="mb-20 flex flex-col items-start select-none">
          <span className="text-[9px] tracking-[0.4em] uppercase text-[#6D8575] font-light mb-3 block">
            Internal Operations Portal
          </span>
          <h1 
            className="text-4xl md:text-5xl tracking-[0.15em] uppercase font-light text-[#CACBA7]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Studio Inventory
          </h1>
          <div className="w-16 h-[1px] bg-[#CACBA7]/20 my-4" />
          <p className="text-zinc-500 tracking-[0.25em] uppercase text-[10px] font-light">
            L-Essence Command Center
          </p>
        </div>

        {/* Dynamic Multi-Column Management Desk Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
          
          {/* LEFT SIDE: Interactive Asset Input Form Panel */}
          <div 
            className="border border-white/[0.04] p-8 md:p-10 rounded-sm select-none"
            style={{
              background: 'linear-gradient(145deg, rgba(15,18,18,0.4) 0%, rgba(3,3,3,0.98) 100%)'
            }}
          >
            <div className="flex flex-col gap-1 mb-8">
              <span className="text-[9px] tracking-[0.3em] uppercase text-[#6D8575] font-light">
                Vault Registry
              </span>
              <h3 
                className="text-2xl font-light text-zinc-200 tracking-wide"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Log Allocation
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="flex flex-col gap-2">
                <label className="text-[9px] tracking-[0.25em] uppercase text-zinc-500 font-light">
                  Roast Identity Title
                </label>
                <input 
                  type="text" 
                  name="name"
                  required
                  placeholder="e.g. Midnight Reserve"
                  className="bg-transparent border-b border-white/[0.06] focus:border-[#CACBA7] text-zinc-200 py-2.5 text-sm outline-none transition-colors duration-500 placeholder-zinc-800 font-light tracking-wide"
                />
              </div>

              {/* Three Tier Segregation Selection Control Grid buttons */}
              <div className="flex flex-col gap-3">
                <label className="text-[9px] tracking-[0.25em] uppercase text-zinc-500 font-light">
                  Hardness Tier Level
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {tiers.map((tier) => {
                    const isSelected = roastLevel === tier.value;
                    return (
                      <button
                        key={tier.value}
                        type="button"
                        onClick={() => setRoastLevel(tier.value as any)}
                        className={`flex flex-col items-center justify-center py-4 px-1 border rounded-xs transition-all duration-500 relative overflow-hidden group cursor-pointer ${
                          isSelected 
                            ? 'border-[#CACBA7] bg-[#CACBA7]/[0.02]' 
                            : 'border-white/[0.03] bg-transparent hover:border-white/10'
                        }`}
                      >
                        <span className={`text-[10px] tracking-widest uppercase font-medium transition-colors duration-500 ${
                          isSelected ? 'text-[#CACBA7]' : 'text-zinc-500 group-hover:text-zinc-300'
                        }`}>
                          {tier.label.split(' ')[0]}
                        </span>
                        <span className="text-[8px] tracking-[0.15em] uppercase text-zinc-600 font-light mt-1 scale-90">
                          {tier.profile.split(' ')[1] || tier.profile}
                        </span>
                        {isSelected && (
                          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-[#CACBA7] shadow-[0_-1px_6px_rgba(202,203,167,0.4)]" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] tracking-[0.25em] uppercase text-zinc-500 font-light">Value Tag ($)</label>
                  <input type="number" name="price" step="0.01" required placeholder="0.00" className="bg-transparent border-b border-white/[0.06] focus:border-[#CACBA7] text-zinc-200 py-2.5 text-sm outline-none transition-colors duration-500 placeholder-zinc-800 font-light" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] tracking-[0.25em] uppercase text-zinc-500 font-light">Initial Volume</label>
                  <input type="number" name="stockCount" required placeholder="0" className="bg-transparent border-b border-white/[0.06] focus:border-[#CACBA7] text-zinc-200 py-2.5 text-sm outline-none transition-colors duration-500 placeholder-zinc-800 font-light" />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isPending}
                className="w-full relative py-3.5 mt-4 overflow-hidden bg-transparent border border-[#CACBA7]/30 text-zinc-300 hover:text-black text-[10px] font-light tracking-[0.3em] uppercase transition-all duration-500 rounded-xs group/btn cursor-pointer"
              >
                <div className="absolute inset-0 w-0 bg-[#CACBA7] group-hover/btn:w-full transition-all duration-500 ease-out z-0" />
                <span className="relative z-10 font-medium">
                  {isPending ? "Transmitting..." : "Commit To Vault"}
                </span>
              </button>
            </form>
          </div>

          {/* RIGHT SIDE: Premium Asset Ledger Matrix Table View */}
          <div className="lg:col-span-2 overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/[0.06] text-[9px] tracking-[0.3em] text-zinc-500 uppercase font-light">
                  <th className="pb-5 font-normal">Active Collection Item</th>
                  <th className="pb-5 font-normal">Hardness Profile</th>
                  <th className="pb-5 font-normal">Valuation</th>
                  <th className="pb-5 font-normal text-center">Available Stock</th>
                  <th className="pb-5 font-normal text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.02]">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-16 text-center text-[10px] tracking-[0.2em] text-zinc-600 uppercase font-light">
                      No active allocations currently recorded inside system parameters.
                    </td>
                  </tr>
                ) : (
                  products.map((item) => (
                    <tr key={item.id} className="group hover:bg-white/[0.01] transition-colors duration-500">
                      <td className="py-6 text-xl font-light text-zinc-200 tracking-wide font-serif relative" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                        <span className="pl-0 group-hover:pl-3 transition-all duration-500 ease-out inline-block">{item.name}</span>
                      </td>
                      <td className="py-6 text-[10px] text-zinc-400 font-light uppercase tracking-[0.15em]">
                        <span className="bg-white/[0.02] border border-white/[0.04] px-3 py-1 rounded-xs uppercase">
                          {item.roastLevel === 'low' ? 'Low Hardness' : item.roastLevel === 'medium' ? 'Medium Hardness' : 'Hard Intensity'}
                        </span>
                      </td>
                      <td className="py-6 text-sm text-[#CACBA7] font-light tracking-wide">${item.price.toFixed(2)}</td>
                      <td className="py-6 text-xl text-center font-serif font-light text-zinc-300">{item.stockCount}</td>
                      <td className="py-6 text-right">
                        <button 
                          type="button" 
                          onClick={() => handleRemove(item.id)} 
                          className="text-[9px] tracking-[0.25em] uppercase text-zinc-600 hover:text-red-400 transition-colors duration-300 cursor-pointer"
                        >
                          Release Allocation
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}