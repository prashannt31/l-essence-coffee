"use client";

import { useState } from "react";
import { addActivityLog } from "./ActivityLogs";
import type {
  Ingredient,
  Recipe,
  RecipeIngredient,
} from "../sections/AdminDashboard";

type Props = {
  ingredients: Ingredient[];
  recipes: Recipe[];
  setRecipes: React.Dispatch<React.SetStateAction<Recipe[]>>;
};

export default function RecipeBuilder({
  ingredients,
  recipes,
  setRecipes,
}: Props) {
  const [recipeName, setRecipeName] = useState("");
  const [selectedIngredient, setSelectedIngredient] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("g");
  const [recipeIngredients, setRecipeIngredients] = useState<RecipeIngredient[]>([]);
  const [editingRecipeId, setEditingRecipeId] = useState<number | null>(null);

  const addIngredientToRecipe = () => {
    if (!selectedIngredient || !quantity) return;

    setRecipeIngredients([
      ...recipeIngredients,
      {
        id: Date.now(),
        ingredientName: selectedIngredient,
        quantity: Number(quantity),
        unit,
      },
    ]);

    setSelectedIngredient("");
    setQuantity("");
    setUnit("g");
  };

  const saveRecipe = () => {
    if (!recipeName || recipeIngredients.length === 0) {
      alert("Add recipe name and at least one ingredient.");
      return;
    }

    if (editingRecipeId) {
      setRecipes(
        recipes.map((recipe) =>
          recipe.id === editingRecipeId
            ? {
                ...recipe,
                name: recipeName,
                ingredients: recipeIngredients,
              }
            : recipe
        )
      );

      alert("Recipe updated successfully.");
    } else {
      setRecipes([
        ...recipes,
        {
          id: Date.now(),
          name: recipeName,
          ingredients: recipeIngredients,
        },
      ]);
      addActivityLog("Created Recipe", recipeName);

      alert("Recipe saved successfully.");
    }

    resetForm();
  };

  const resetForm = () => {
    setRecipeName("");
    setRecipeIngredients([]);
    setSelectedIngredient("");
    setQuantity("");
    setUnit("g");
    setEditingRecipeId(null);
  };

  const editRecipe = (recipe: Recipe) => {
    setEditingRecipeId(recipe.id);
    setRecipeName(recipe.name);
    setRecipeIngredients(recipe.ingredients);
  };

  const deleteRecipe = (id: number) => {
    const confirmDelete = confirm("Delete this recipe?");
    if (!confirmDelete) return;

    setRecipes(recipes.filter((recipe) => recipe.id !== id));

    if (editingRecipeId === id) {
      resetForm();
    }
  };

  const deleteRecipeIngredient = (id: number) => {
    setRecipeIngredients(recipeIngredients.filter((item) => item.id !== id));
  };

  return (
    <div className="bg-[#111111] rounded-2xl border border-zinc-800 p-6">
      <h2 className="text-xl font-semibold mb-6">
        {editingRecipeId ? "Edit Recipe" : "Recipe Builder"}
      </h2>

      <input
        value={recipeName}
        onChange={(e) => setRecipeName(e.target.value)}
        placeholder="Recipe Name"
        className="w-full bg-zinc-900 border border-zinc-700 p-3 rounded-xl mb-4 outline-none"
      />

      <div className="grid grid-cols-3 gap-3">
        <select
          value={selectedIngredient}
          onChange={(e) => setSelectedIngredient(e.target.value)}
          className="bg-zinc-900 border border-zinc-700 p-3 rounded-xl outline-none"
        >
          <option value="">Ingredient</option>
          {ingredients.map((item) => (
            <option key={item.id} value={item.name}>
              {item.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="Qty"
          className="bg-zinc-900 border border-zinc-700 p-3 rounded-xl outline-none"
        />

        <select
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          className="bg-zinc-900 border border-zinc-700 p-3 rounded-xl outline-none"
        >
          <option>g</option>
          <option>kg</option>
          <option>ml</option>
          <option>L</option>
          <option>pcs</option>
        </select>
      </div>

      <button
        onClick={addIngredientToRecipe}
        className="mt-4 border border-[#D4AF37] text-[#D4AF37] px-4 py-2 rounded-xl hover:bg-[#D4AF37] hover:text-black transition"
      >
        + Add Ingredient
      </button>

      {recipeIngredients.length > 0 && (
        <div className="mt-5 space-y-3">
          {recipeIngredients.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center bg-zinc-900 border border-zinc-800 rounded-xl p-3"
            >
              <span>
                {item.ingredientName} - {item.quantity} {item.unit}
              </span>

              <button
                onClick={() => deleteRecipeIngredient(item.id)}
                className="text-red-400 text-sm"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={saveRecipe}
        className="w-full mt-6 bg-[#D4AF37] text-black py-3 rounded-xl font-semibold"
      >
        {editingRecipeId ? "Update Recipe" : "Save Recipe"}
      </button>

      {editingRecipeId && (
        <button
          onClick={resetForm}
          className="w-full mt-3 border border-zinc-700 py-3 rounded-xl"
        >
          Cancel Edit
        </button>
      )}

      {recipes.length > 0 && (
        <div className="mt-6 border-t border-zinc-800 pt-4">
          <h3 className="font-semibold mb-3">Saved Recipes</h3>

          <div className="space-y-3">
            {recipes.map((recipe) => (
              <div key={recipe.id} className="bg-zinc-900 rounded-xl p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{recipe.name}</p>
                    <p className="text-xs text-zinc-500">
                      {recipe.ingredients.length} ingredients
                    </p>
                  </div>

                  <div className="flex gap-3 text-sm">
                    <button
                      onClick={() => editRecipe(recipe)}
                      className="text-[#D4AF37]"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteRecipe(recipe.id)}
                      className="text-red-400"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="mt-3 space-y-1">
                  {recipe.ingredients.map((item) => (
                    <p key={item.id} className="text-sm text-zinc-400">
                      {item.ingredientName} — {item.quantity} {item.unit}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}