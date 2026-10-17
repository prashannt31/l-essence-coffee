'use client'
import { calculateRestockNeeds } from '@/lib/inventory-utils';

export default function RestockList({ ingredients }: { ingredients: any[] }) {
  const needs = calculateRestockNeeds(ingredients);

  if (needs.length === 0) return null;

  return (
    <div className="bg-[#141414] border border-amber-900/30 p-6 rounded-xl mt-6">
      <h2 className="text-[10px] uppercase tracking-widest text-amber-500 mb-4">Auto-Restock Required</h2>
      {needs.map((item: any, idx: number) => (
        <div key={idx} className="flex justify-between text-[11px] py-2 border-b border-white/[0.05]">
          <span className="text-white">{item.name}</span>
          <span className="text-amber-500">Order {item.needed} {item.unit}</span>
        </div>
      ))}
      <button className="w-full mt-4 bg-amber-600 text-black py-2 text-[10px] uppercase tracking-widest font-bold hover:bg-amber-500 transition-all">
        Generate Purchase Order
      </button>
    </div>
  );
}