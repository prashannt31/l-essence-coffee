import type { OrderHistoryItem } from "../sections/AdminDashboard";

type Props = {
  orderHistory: OrderHistoryItem[];
};

export default function RevenueDashboard({ orderHistory }: Props) {
  const today = new Date();

  const isSameDay = (date: Date) =>
    date.toDateString() === today.toDateString();

  const isSameWeek = (date: Date) => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(today.getDate() - 7);
    return date >= oneWeekAgo && date <= today;
  };

  const isSameMonth = (date: Date) =>
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();

  const todayOrders = orderHistory.filter((order) =>
    isSameDay(new Date(order.time))
  );

  const weekOrders = orderHistory.filter((order) =>
    isSameWeek(new Date(order.time))
  );

  const monthOrders = orderHistory.filter((order) =>
    isSameMonth(new Date(order.time))
  );

  const totalRevenue = orderHistory.reduce(
    (sum, order) => sum + Number(order.total || 0),
    0
  );

  const todayRevenue = todayOrders.reduce(
    (sum, order) => sum + Number(order.total || 0),
    0
  );

  const weekRevenue = weekOrders.reduce(
    (sum, order) => sum + Number(order.total || 0),
    0
  );

  const monthRevenue = monthOrders.reduce(
    (sum, order) => sum + Number(order.total || 0),
    0
  );

  const averageOrderValue =
    orderHistory.length === 0 ? 0 : totalRevenue / orderHistory.length;

  const productCount: Record<string, number> = {};

  orderHistory.forEach((order) => {
    productCount[order.recipeName] =
      (productCount[order.recipeName] || 0) + 1;
  });

  const topSellingItem =
    Object.entries(productCount).sort((a, b) => b[1] - a[1])[0]?.[0] ||
    "No orders yet";

  const cards = [
    {
      title: "Today's Revenue",
      value: `₹${todayRevenue.toFixed(2)}`,
    },
    {
      title: "Weekly Revenue",
      value: `₹${weekRevenue.toFixed(2)}`,
    },
    {
      title: "Monthly Revenue",
      value: `₹${monthRevenue.toFixed(2)}`,
    },
    {
      title: "Average Order Value",
      value: `₹${averageOrderValue.toFixed(2)}`,
    },
  ];

  return (
    <div className="bg-[#111111] border border-zinc-800 rounded-2xl p-6">
      <h2 className="text-xl font-semibold mb-6">
        Revenue Dashboard
      </h2>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {cards.map((card) => (
          <div
            key={card.title}
            className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4"
          >
            <p className="text-xs text-zinc-500">
              {card.title}
            </p>

            <p className="text-2xl font-semibold text-[#D4AF37] mt-2">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
        <p className="text-xs text-zinc-500">
          Top Selling Item
        </p>

        <p className="text-lg font-semibold mt-2">
          {topSellingItem}
        </p>
      </div>
    </div>
  );
}