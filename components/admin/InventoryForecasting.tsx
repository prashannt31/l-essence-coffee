import type {
  Ingredient,
  OrderHistoryItem,
  Recipe,
  MenuItem,
} from "../sections/AdminDashboard";

type Props = {
  ingredients: Ingredient[];
  recipes: Recipe[];
  menuItems: MenuItem[];
  orderHistory: OrderHistoryItem[];
};

function convertToBase(quantity: number, unit: string) {
  const normalized = unit.toLowerCase();

  if (normalized === "kg") return quantity * 1000;
  if (normalized === "g") return quantity;

  if (normalized === "l") return quantity * 1000;
  if (normalized === "ml") return quantity;

  return quantity;
}

function getBaseUnit(unit: string) {
  const normalized = unit.toLowerCase();

  if (normalized === "kg" || normalized === "g") return "g";
  if (normalized === "l" || normalized === "ml") return "ml";

  return unit;
}

export default function InventoryForecasting({
  ingredients,
  recipes,
  menuItems,
  orderHistory,
}: Props) {
  const usageMap: Record<string, number> = {};

  orderHistory.forEach((order) => {
    menuItems.forEach((menuItem) => {
      if (
        order.recipeName
          .toLowerCase()
          .includes(menuItem.name.toLowerCase())
      ) {
        const recipe = recipes.find(
          (item) => Number(item.id) === Number(menuItem.recipeId)
        );

        if (!recipe) return;

        recipe.ingredients.forEach((recipeIngredient) => {
          const key = recipeIngredient.ingredientName.toLowerCase();

          usageMap[key] =
            (usageMap[key] || 0) +
            convertToBase(
              recipeIngredient.quantity,
              recipeIngredient.unit
            );
        });
      }
    });
  });

  const forecastItems = ingredients.map((ingredient) => {
    const key = ingredient.name.toLowerCase();

    const stockInBase = convertToBase(
      ingredient.quantity,
      ingredient.unit
    );

    const totalUsed = usageMap[key] || 0;

    const estimatedDailyUsage =
      totalUsed === 0 ? 0 : totalUsed / 7;

    const daysLeft =
      estimatedDailyUsage === 0
        ? Infinity
        : stockInBase / estimatedDailyUsage;

    return {
      ...ingredient,
      stockInBase,
      totalUsed,
      estimatedDailyUsage,
      daysLeft,
      baseUnit: getBaseUnit(ingredient.unit),
    };
  });

  return (
    <div className="bg-[#111111] border border-zinc-800 rounded-2xl p-6">
      <h2 className="text-xl font-semibold mb-6">
        Inventory Forecasting
      </h2>

      {forecastItems.length === 0 ? (
        <p className="text-zinc-500 text-sm">
          No ingredients available.
        </p>
      ) : (
        <div className="space-y-4">
          {forecastItems.map((item) => (
            <div
              key={item.id}
              className="border border-zinc-800 rounded-xl p-4 bg-zinc-900/40"
            >
              <div className="flex justify-between gap-4">
                <div>
                  <p className="font-medium">{item.name}</p>

                  <p className="text-xs text-zinc-500 mt-1">
                    Current: {item.quantity} {item.unit}
                  </p>

                  <p className="text-xs text-zinc-500">
                    Used Recently: {Number(item.totalUsed.toFixed(2))}{" "}
                    {item.baseUnit}
                  </p>

                  <p className="text-xs text-zinc-500">
                    Daily Avg:{" "}
                    {Number(item.estimatedDailyUsage.toFixed(2))}{" "}
                    {item.baseUnit}/day
                  </p>
                </div>

                <div className="text-right">
                  <p
                    className={`font-semibold ${
                      item.daysLeft === Infinity
                        ? "text-zinc-500"
                        : item.daysLeft <= 3
                        ? "text-red-400"
                        : item.daysLeft <= 7
                        ? "text-yellow-400"
                        : "text-green-400"
                    }`}
                  >
                    {item.daysLeft === Infinity
                      ? "No Data"
                      : `${Number(item.daysLeft.toFixed(1))} days`}
                  </p>

                  <p className="text-xs text-zinc-500">
                    Stock Duration
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}