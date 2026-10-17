import type { OrderHistoryItem } from "../sections/AdminDashboard";

type Props = {
  orderHistory: OrderHistoryItem[];
};

export default function TopProducts({ orderHistory }: Props) {
  const productCount: Record<string, number> = {};

  orderHistory.forEach((order) => {
    const rawName = order.recipeName || "";

    const items = rawName.split(",");

    items.forEach((item) => {
      const cleaned = item.trim();

      if (!cleaned) return;

      const match = cleaned.match(/^(.+?)\s*[x×]\s*(\d+)$/i);

      if (match) {
        const name = match[1].trim();
        const quantity = Number(match[2]);

        productCount[name] = (productCount[name] || 0) + quantity;
      } else {
        productCount[cleaned] = (productCount[cleaned] || 0) + 1;
      }
    });
  });

  const products = Object.entries(productCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="bg-[#111111] border border-zinc-800 rounded-2xl p-6">
      <h2 className="text-xl font-semibold mb-6">Top Products</h2>

      {products.length === 0 ? (
        <p className="text-zinc-500 text-sm">No sales data yet.</p>
      ) : (
        <div className="space-y-4">
          {products.map(([name, count], index) => (
            <div
              key={name}
              className="flex justify-between items-center border-b border-zinc-800 pb-3 last:border-b-0"
            >
              <div>
                <p className="font-medium">
                  #{index + 1} {name}
                </p>

                <p className="text-xs text-zinc-500">Product ranking</p>
              </div>

              <span className="text-[#D4AF37] font-semibold">
                {count} sold
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}