'use client';
import { useState, useMemo } from 'react';

export default function InventoryManager() {
  // 1. Initial State
  const [ingredients, setIngredients] = useState([
    { id: 1, name: 'Coffee Beans', stock: 140, usagePerCup: 20 },
    { id: 2, name: 'Milk', stock: 55, usagePerCup: 50 },
    { id: 3, name: 'Sugar', stock: 100, usagePerCup: 10 }
  ]);
  const [newItem, setNewItem] = useState({ name: '', stock: 0, usagePerCup: 5 });

  // 2. Real-time Calculation Engine
  const inventoryStats = useMemo(() => {
    return ingredients.map(item => ({
      ...item,
      status: item.stock < 30 ? 'LOW' : 'STABLE'
    }));
  }, [ingredients]);

  // 3. Logic to add/remove ingredients
  const addIngredient = () => {
    if (!newItem.name) return;
    setIngredients([...ingredients, { id: Date.now(), ...newItem }]);
  };

  const deleteIngredient = (id: number) => {
    setIngredients(ingredients.filter(i => i.id !== id));
  };

  // 4. The "Sell" Engine (Real-time deduction)
  const processSale = () => {
    setIngredients(prev => prev.map(item => ({
      ...item,
      stock: Math.max(0, item.stock - item.usagePerCup)
    })));
  };

  return (
    <div className="p-12 bg-[#050505] text-[#CACBA7] min-h-screen">
      <h1 className="text-2xl font-serif mb-12 border-b border-zinc-900 pb-4">VAULT MANAGEMENT SYSTEM</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
        {/* Ledger Control */}
        <div className="space-y-8">
          <div className="space-y-4">
            <input placeholder="Item Name" className="w-full bg-transparent border-b border-zinc-800 py-2" onChange={(e) => setNewItem({...newItem, name: e.target.value})} />
            <input type="number" placeholder="Initial Stock" className="w-full bg-transparent border-b border-zinc-800 py-2" onChange={(e) => setNewItem({...newItem, stock: Number(e.target.value)})} />
            <button onClick={addIngredient} className="w-full border border-[#CACBA7]/20 py-3 hover:bg-[#CACBA7] hover:text-black transition-all">ADD TO LEDGER</button>
          </div>
        </div>

        {/* Live Ledger */}
        <div className="space-y-6">
          {inventoryStats.map(item => (
            <div key={item.id} className="flex justify-between items-center border-b border-zinc-900 pb-4">
              <div>
                <p className="uppercase tracking-widest text-sm">{item.name}</p>
                <p className={`text-[9px] ${item.status === 'LOW' ? 'text-red-500' : 'text-zinc-600'}`}>{item.status}</p>
              </div>
              <div className="flex items-center gap-6">
                <p className="text-xl">{item.stock}</p>
                <button onClick={() => deleteIngredient(item.id)} className="text-[10px] text-red-900 uppercase">Delete</button>
              </div>
            </div>
          ))}
          <button onClick={processSale} className="w-full mt-8 bg-[#CACBA7] text-black py-4 uppercase tracking-widest text-xs font-bold">Process Sale (Deduct Fixed Qty)</button>
        </div>
      </div>
    </div>
  );
}