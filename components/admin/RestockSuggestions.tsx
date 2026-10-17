import type { Ingredient } from "../sections/AdminDashboard";

type Props = {
  ingredients: Ingredient[];
};

export default function RestockSuggestions({ ingredients }: Props) {
  const suggestions = ingredients.filter(
    (item) => item.quantity <= (item.lowStockThreshold ?? 1)
  );

  return (
    <div className="bg-[#111111] border border-zinc-800 rounded-2xl p-6">
      <h2 className="text-xl font-semibold mb-6">Restock Suggestions</h2>

      {suggestions.length === 0 ? (
        <p className="text-zinc-500 text-sm">
          No restock needed right now.
        </p>
      ) : (
        <div className="space-y-4">
          {suggestions.map((item) => {
            const threshold = item.lowStockThreshold ?? 1;
            const suggestedAmount = Math.max(
              threshold * 2 - item.quantity,
              threshold
            );

            return (
              <div
                key={item.id}
                className="border border-zinc-800 rounded-xl p-4 bg-zinc-900/40"
              >
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-zinc-500 mt-1">
                      Current: {item.quantity} {item.unit}
                    </p>
                    <p className="text-xs text-zinc-500">
                      Threshold: {threshold} {item.unit}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-[#D4AF37] font-semibold">
                      +{Number(suggestedAmount.toFixed(3))} {item.unit}
                    </p>
                    <p className="text-xs text-zinc-500">Suggested</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}