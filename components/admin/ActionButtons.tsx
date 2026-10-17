'use client'

export function ActionButtons() {
  const handleAddRecipe = () => {
    // You can later connect this to a Modal or a router.push('/admin/add-recipe')
    alert("Triggering Add Recipe Form...");
  };

  const handleAddIngredient = () => {
    alert("Triggering Add Ingredient Form...");
  };

  return (
    <div className="space-y-4">
      <button 
        onClick={handleAddRecipe}
        className="w-full py-3 border border-dashed border-white/[0.1] text-[10px] uppercase text-zinc-500 hover:border-white/[0.3] transition-colors"
      >
        + Add New Recipe
      </button>
      
      <button 
        onClick={handleAddIngredient}
        className="w-full py-3 border border-dashed border-white/[0.1] text-[10px] uppercase text-zinc-500 hover:border-white/[0.3] transition-colors"
      >
        + Add New Ingredient
      </button>
    </div>
  );
}