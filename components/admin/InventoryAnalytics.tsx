import type { Ingredient } from "../sections/AdminDashboard";

type Props = {
  ingredients: Ingredient[];
};

export default function InventoryAnalytics({
  ingredients,
}: Props) {
  const healthy = ingredients.filter(
    (i) => i.quantity > (i.lowStockThreshold ?? 1)
  ).length;

  const low = ingredients.filter(
    (i) =>
      i.quantity <= (i.lowStockThreshold ?? 1) &&
      i.quantity > (i.lowStockThreshold ?? 1) * 0.5
  ).length;

  const critical = ingredients.filter(
    (i) =>
      i.quantity <= (i.lowStockThreshold ?? 1) * 0.5
  ).length;

  return (
    <div className="bg-[#111111] border border-zinc-800 rounded-2xl p-6">
      <h2 className="text-xl font-semibold mb-6">
        Inventory Analytics
      </h2>

      <div className="space-y-4">
        <div className="flex justify-between">
          <span>Healthy</span>
          <span className="text-green-400">
            {healthy}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Low</span>
          <span className="text-yellow-400">
            {low}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Critical</span>
          <span className="text-red-400">
            {critical}
          </span>
        </div>

        <div className="pt-4 border-t border-zinc-800">
          <div className="flex justify-between">
            <span>Total Ingredients</span>
            <span>{ingredients.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}