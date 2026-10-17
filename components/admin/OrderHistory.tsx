"use client";

import { useState } from "react";
import type { OrderHistoryItem } from "../sections/AdminDashboard";

type Props = {
  orderHistory: OrderHistoryItem[];
};

export default function OrderHistory({ orderHistory }: Props) {
  const [showAllHistory, setShowAllHistory] = useState(false);

  const visibleOrders = showAllHistory
    ? orderHistory
    : orderHistory.slice(0, 37);

  return (
    <div className="bg-[#111111] border border-zinc-800 rounded-2xl p-6 h-[620px] flex flex-col">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-semibold">
          Recent Orders ({orderHistory.length})
        </h2>

        {orderHistory.length > 37 && (
          <button
            onClick={() => setShowAllHistory(!showAllHistory)}
            className="text-sm text-[#D4AF37] hover:text-[#E5C158] hover:underline transition"
          >
            {showAllHistory ? "Show Less" : "See All"}
          </button>
        )}
      </div>

      {visibleOrders.length === 0 ? (
        <p className="text-zinc-500 text-sm">
          No recent orders yet.
        </p>
      ) : (
<div className="admin-scrollbar overflow-y-auto h-[620px]">
            {visibleOrders.map((order, index) => (
            <div
              key={`${order.id}-${index}`}
              className="flex justify-between gap-4 border-b border-zinc-800 pb-3 last:border-b-0"
            >
              <div>
                <p className="font-medium text-sm">
                  {order.recipeName}
                </p>

                {order.total !== undefined && (
                  <p className="text-xs text-[#D4AF37] mt-1">
                    ₹{order.total}
                  </p>
                )}
              </div>

              <p className="text-xs text-zinc-500 whitespace-nowrap">
                {order.time}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}