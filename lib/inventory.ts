// lib/inventory.ts

export type Ingredient = {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  lowStockThreshold?: number;
};

export type RecipeIngredient = {
  id: number;
  ingredientName: string;
  quantity: number;
  unit: string;
};

export type Recipe = {
  id: number;
  name: string;
  ingredients: RecipeIngredient[];
};

export type MenuItem = {
  id: number;
  name: string;
  price: number;
  recipeId: number;
  active: boolean;
};

export type OrderHistoryItem = {
  id: number;
  recipeName: string;
  time: string;
};

export type AdminInventoryData = {
  ingredients: Ingredient[];
  recipes: Recipe[];
  menuItems: MenuItem[];
  orders: number;
  orderHistory: OrderHistoryItem[];
};

export const STORAGE_KEY = "l-essence-admin-data";

export function getAdminInventoryData(): AdminInventoryData {
  if (typeof window === "undefined") {
    return {
      ingredients: [],
      recipes: [],
      menuItems: [],
      orders: 0,
      orderHistory: [],
    };
  }

  const savedData = localStorage.getItem(STORAGE_KEY);

  if (!savedData) {
    return {
      ingredients: [],
      recipes: [],
      menuItems: [],
      orders: 0,
      orderHistory: [],
    };
  }

  try {
    const parsedData = JSON.parse(savedData);

    return {
      ingredients: parsedData.ingredients || [],
      recipes: parsedData.recipes || [],
      menuItems: parsedData.menuItems || [],
      orders: parsedData.orders || 0,
      orderHistory: parsedData.orderHistory || [],
    };
  } catch {
    return {
      ingredients: [],
      recipes: [],
      menuItems: [],
      orders: 0,
      orderHistory: [],
    };
  }
}

function normalizeUnit(unit: string) {
  return unit.toLowerCase().trim();
}

export function convertToBaseUnit(quantity: number, unit: string) {
  const normalized = normalizeUnit(unit);

  if (normalized === "kg") return quantity * 1000;
  if (normalized === "g" || normalized === "gram" || normalized === "grams") return quantity;

  if (
    normalized === "l" ||
    normalized === "liter" ||
    normalized === "litre"
  ) {
    return quantity * 1000;
  }

  if (normalized === "ml") return quantity;

  if (
    normalized === "pcs" ||
    normalized === "piece" ||
    normalized === "pieces"
  ) {
    return quantity;
  }

  return quantity;
}

export function getRecipeForMenuItem(menuItem: MenuItem, recipes: Recipe[]) {
  return recipes.find((recipe) => Number(recipe.id) === Number(menuItem.recipeId));
}

export function getAvailableQuantity(
  menuItem: MenuItem,
  recipes: Recipe[],
  ingredients: Ingredient[]
) {
  if (!menuItem.active) return 0;

  const recipe = getRecipeForMenuItem(menuItem, recipes);

  if (!recipe || recipe.ingredients.length === 0) return 0;

  let maxPossibleOrders = Infinity;

  for (const recipeIngredient of recipe.ingredients) {
    const inventoryItem = ingredients.find(
      (ingredient) =>
        ingredient.name.trim().toLowerCase() ===
        recipeIngredient.ingredientName.trim().toLowerCase()
    );

    if (!inventoryItem) return 0;

    const availableStockBase = convertToBaseUnit(
      Number(inventoryItem.quantity),
      inventoryItem.unit
    );

    const requiredStockBase = convertToBaseUnit(
      Number(recipeIngredient.quantity),
      recipeIngredient.unit
    );

    if (requiredStockBase <= 0) return 0;

    const possibleOrders = Math.floor(availableStockBase / requiredStockBase);

    maxPossibleOrders = Math.min(maxPossibleOrders, possibleOrders);
  }

  if (maxPossibleOrders === Infinity) return 0;

  return maxPossibleOrders;
}

export function canAddToCart(
  menuItem: MenuItem,
  recipes: Recipe[],
  ingredients: Ingredient[],
  cartQuantity: number = 1
) {
  const availableQuantity = getAvailableQuantity(menuItem, recipes, ingredients);

  if (availableQuantity <= 0) {
    return {
      canAdd: false,
      availableQuantity,
      message: "Out of stock",
    };
  }

  if (cartQuantity > availableQuantity) {
    return {
      canAdd: false,
      availableQuantity,
      message: `Only ${availableQuantity} available`,
    };
  }

  return {
    canAdd: true,
    availableQuantity,
    message:
      availableQuantity <= 5
        ? `Only ${availableQuantity} left`
        : "Available",
  };
}