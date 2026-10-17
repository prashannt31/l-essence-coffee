import type { Ingredient } from "../sections/AdminDashboard";

type Props = {
  ingredients: Ingredient[];
};

export default function LowStockAlerts({ ingredients }: Props) {
  const lowStockItems = ingredients.filter(
    (item) => item.quantity <= (item.lowStockThreshold ?? 1)
  );

  return (
    <div className="bg-[#111111] border border-zinc-800 rounded-2xl p-6">
      <h2 className="text-xl font-semibold mb-6">Low Stock Alerts</h2>

      {lowStockItems.length === 0 ? (
        <p className="text-zinc-500 text-sm">
          All ingredients are sufficiently stocked.
        </p>
      ) : (
        <div className="space-y-4">
          {lowStockItems.map((item) => (
            <div key={item.id} className="flex justify-between">
              <div>
                <span>{item.name}</span>
                <p className="text-xs text-zinc-500">
                  Threshold: {item.lowStockThreshold ?? 1} {item.unit}
                </p>
              </div>

              <span className="text-red-400">
                {item.quantity} {item.unit} left
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}