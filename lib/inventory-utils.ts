// lib/recipe-utils.ts

type IngredientStock = {
  id?: string | number;
  name: string;
  stock: number;
  unit: string;
  costPerUnit?: number;
  minLevel?: number;
  maxLevel?: number;
};

type RecipeRequirement = {
  quantity: number;
  unit: string;
  ingredient: IngredientStock;
};

type ProductWithIngredients = {
  id?: string | number;
  name: string;
  ingredients: RecipeRequirement[];
};

function normalizeUnit(unit: string) {
  return unit.toLowerCase().trim();
}

export function convertToBaseUnit(quantity: number, unit: string) {
  const normalizedUnit = normalizeUnit(unit);

  if (normalizedUnit === "kg") return quantity * 1000;
  if (normalizedUnit === "g" || normalizedUnit === "gram" || normalizedUnit === "grams") {
    return quantity;
  }

  if (normalizedUnit === "l" || normalizedUnit === "liter" || normalizedUnit === "litre") {
    return quantity * 1000;
  }

  if (normalizedUnit === "ml") return quantity;

  if (
    normalizedUnit === "pcs" ||
    normalizedUnit === "piece" ||
    normalizedUnit === "pieces"
  ) {
    return quantity;
  }

  return quantity;
}

export function convertFromBaseUnit(quantity: number, unit: string) {
  const normalizedUnit = normalizeUnit(unit);

  if (normalizedUnit === "kg") return quantity / 1000;
  if (normalizedUnit === "g" || normalizedUnit === "gram" || normalizedUnit === "grams") {
    return quantity;
  }

  if (normalizedUnit === "l" || normalizedUnit === "liter" || normalizedUnit === "litre") {
    return quantity / 1000;
  }

  if (normalizedUnit === "ml") return quantity;

  if (
    normalizedUnit === "pcs" ||
    normalizedUnit === "piece" ||
    normalizedUnit === "pieces"
  ) {
    return quantity;
  }

  return quantity;
}

export function calculateRecipeCost(product: ProductWithIngredients) {
  if (!product?.ingredients?.length) return 0;

  return product.ingredients.reduce((total: number, req: RecipeRequirement) => {
    const costPerUnit = req.ingredient.costPerUnit || 0;
    return total + req.quantity * costPerUnit;
  }, 0);
}

export function getAvailableQuantity(product: ProductWithIngredients) {
  if (!product?.ingredients?.length) return 0;

  let maxPossibleOrders = Infinity;

  for (const req of product.ingredients) {
    const ingredient = req.ingredient;

    if (!ingredient) return 0;

    const availableStock = convertToBaseUnit(
      ingredient.stock,
      ingredient.unit
    );

    const requiredStock = convertToBaseUnit(
      req.quantity,
      req.unit
    );

    if (requiredStock <= 0) return 0;

    const possibleOrders = Math.floor(availableStock / requiredStock);

    maxPossibleOrders = Math.min(maxPossibleOrders, possibleOrders);
  }

  if (maxPossibleOrders === Infinity) return 0;

  return maxPossibleOrders;
}

export function canAddToCart(
  product: ProductWithIngredients,
  cartQuantity: number = 1
) {
  const availableQuantity = getAvailableQuantity(product);

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

export function getInventoryImpact(
  product: ProductWithIngredients,
  cartQuantity: number = 1
) {
  if (!product?.ingredients?.length) return [];

  return product.ingredients.map((req) => {
    const ingredient = req.ingredient;

    const availableStockBase = convertToBaseUnit(
      ingredient.stock,
      ingredient.unit
    );

    const requiredStockBase =
      convertToBaseUnit(req.quantity, req.unit) * cartQuantity;

    const remainingStockBase = availableStockBase - requiredStockBase;

    const remainingStock = convertFromBaseUnit(
      remainingStockBase,
      ingredient.unit
    );

    return {
      ingredientName: ingredient.name,
      currentStock: ingredient.stock,
      currentUnit: ingredient.unit,
      requiredQuantity: req.quantity * cartQuantity,
      requiredUnit: req.unit,
      remainingStock: Number(remainingStock.toFixed(3)),
      enoughStock: remainingStockBase >= 0,
    };
  });
}

export function calculateRestockNeeds(ingredients: IngredientStock[]) {
  return ingredients
    .filter((ingredient) => ingredient.stock <= (ingredient.minLevel || 0))
    .map((ingredient) => ({
      name: ingredient.name,
      needed: (ingredient.maxLevel || 100) - ingredient.stock,
      unit: ingredient.unit,
    }));
}