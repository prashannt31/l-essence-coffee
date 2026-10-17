import type {
  Ingredient,
  OrderHistoryItem,
} from "../sections/AdminDashboard";

import type { LiveOrder } from "./LiveOrders";
type Props = {
  ingredients: Ingredient[];
  orderHistory: OrderHistoryItem[];
  liveOrders: LiveOrder[];
};

export default function RecentActivity({
  ingredients,
  orderHistory,
  liveOrders,
}: Props) {
  const activities = [
    ...liveOrders.slice(0, 3).map((order) => ({
      title: `New order received`,
      description: `${order.itemName} • ₹${order.total}`,
      time: order.time,
      type: "order",
    })),

    ...orderHistory.slice(0, 3).map((order) => ({
      title: `Order completed`,
      description: order.recipeName,
      time: order.time,
      type: "completed",
    })),

    ...ingredients
      .filter((item) => item.quantity <= (item.lowStockThreshold ?? 1))
      .slice(0, 3)
      .map((item) => ({
        title: `Low stock alert`,
        description: `${item.name} — ${item.quantity} ${item.unit} left`,
        time: "Inventory",
        type: "stock",
      })),
  ].slice(0, 8);

  return (
    <div className="bg-[#111111] border border-zinc-800 rounded-2xl p-6">
      <h2 className="text-xl font-semibold mb-6">Recent Activity</h2>

      {activities.length === 0 ? (
        <p className="text-zinc-500 text-sm">No recent activity yet.</p>
      ) : (
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div
              key={index}
              className="flex gap-4 border-b border-zinc-800 pb-4 last:border-b-0"
            >
              <div
                className={`mt-1 h-3 w-3 rounded-full ${
                  activity.type === "order"
                    ? "bg-blue-400"
                    : activity.type === "completed"
                    ? "bg-green-400"
                    : "bg-red-400"
                }`}
              />

              <div>
                <p className="font-medium">{activity.title}</p>
                <p className="text-sm text-zinc-500 mt-1">
                  {activity.description}
                </p>
                <p className="text-xs text-zinc-600 mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}