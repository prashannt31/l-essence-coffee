import type { OrderHistoryItem } from "../sections/AdminDashboard";

type Props = {
  orders: number;
  orderHistory: OrderHistoryItem[];
};

export default function SalesAnalytics({ orders, orderHistory }: Props) {
  const completedOrders = orderHistory.length;

  const revenue = orderHistory.reduce(
    (sum, order) => sum + Number(order.total || 0),
    0
  );

  const averageOrderValue =
    completedOrders === 0 ? 0 : revenue / completedOrders;

  const productCount: Record<string, number> = {};

  orderHistory.forEach((order) => {
    productCount[order.recipeName] =
      (productCount[order.recipeName] || 0) + 1;
  });

  const topSeller =
    Object.entries(productCount).sort((a, b) => b[1] - a[1])[0]?.[0] ||
    "No Orders Yet";

  return (
    <div className="bg-[#111111] border border-zinc-800 rounded-2xl p-6">
      <h2 className="text-xl font-semibold mb-6">Revenue Analytics</h2>

      <div className="space-y-5">
        <div className="flex justify-between">
          <span className="text-zinc-400">Total Revenue</span>
          <span className="text-[#D4AF37] font-semibold">
            ₹{revenue.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-zinc-400">Completed Orders</span>
          <span className="text-green-400 font-semibold">{completedOrders}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-zinc-400">Avg. Order Value</span>
          <span className="text-blue-400 font-semibold">
            ₹{averageOrderValue.toFixed(2)}
          </span>
        </div>

        <div className="pt-4 border-t border-zinc-800">
          <p className="text-zinc-500 text-sm">Best Selling Product</p>
          <p className="text-lg font-semibold mt-2 text-[#D4AF37]">
            {topSeller}
          </p>
        </div>
      </div>
    </div>
  );
}