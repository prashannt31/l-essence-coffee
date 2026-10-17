'use client'

export default function RecipeCard({ product }: { product: any }) {
  return (
    <div className="bg-[#141414] border border-white/[0.05] p-5 rounded-xl mb-4 hover:border-white/[0.1] transition-all">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-serif text-lg text-white">{product.name}</h4>
        <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[9px] uppercase tracking-wider rounded">
          Active
        </span>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-[10px] uppercase text-zinc-500 mb-2">
          <span>Ingredient</span>
          <span>Qty / Serving</span>
        </div>
        {product.ingredients.map((item: any) => (
          <div key={item.ingredientId} className="flex justify-between text-[11px] text-zinc-400 border-b border-white/[0.05] pb-1">
            <span>{item.ingredient.name}</span>
            <span>{item.quantity}</span>
          </div>
        ))}
      </div>
    </div>
  );
}