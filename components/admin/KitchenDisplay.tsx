"use client";

import { useEffect, useState } from "react";
import type { LiveOrder } from "./LiveOrders";
import { addActivityLog } from "./ActivityLogs";
import { addNotification } from "./Notifications";

type Props = {
  liveOrders: LiveOrder[];
  setLiveOrders: React.Dispatch<React.SetStateAction<LiveOrder[]>>;
  setActiveSection?: (section: string) => void;
};

export default function KitchenDisplay({
  liveOrders,
  setLiveOrders,
  setActiveSection,
}: Props) {
  const [, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((prev) => prev + 1);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const columns: LiveOrder["status"][] = [
    "Pending",
    "Accepted",
    "Preparing",
    "Ready",
    "Completed",
  ];

  const getOrders = (status: LiveOrder["status"]) =>
    liveOrders.filter((order) => order.status === status);

  const getMinutesAgo = (time: string) => {
    const orderTime = new Date(time).getTime();

    if (Number.isNaN(orderTime)) return 0;

    const now = Date.now();
    return Math.max(0, Math.floor((now - orderTime) / 60000));
  };

  const getTimerLabel = (time: string) => {
    const mins = getMinutesAgo(time);

    if (mins < 1) return "Just now";
    if (mins === 1) return "1 min ago";

    return `${mins} min ago`;
  };

  const getTimerClass = (time: string) => {
    const mins = getMinutesAgo(time);

    if (mins >= 15) {
      return "text-red-400 border-red-500/40 bg-red-500/10";
    }

    if (mins >= 10) {
      return "text-orange-400 border-orange-500/40 bg-orange-500/10";
    }

    if (mins >= 5) {
      return "text-yellow-400 border-yellow-500/40 bg-yellow-500/10";
    }

    return "text-zinc-500 border-zinc-800 bg-zinc-900/50";
  };

  const updateOrderStatus = (
    order: LiveOrder,
    status: LiveOrder["status"]
  ) => {
    setLiveOrders((prev) =>
      prev.map((item) =>
        item.id === order.id
          ? {
              ...item,
              status,
            }
          : item
      )
    );

    addActivityLog(
      `Order Marked ${status}`,
      `Order #${order.id}`
    );

    addNotification(
      `Order ${status}`,
      `Order #${order.id}`
    );
  };

  const getAction = (order: LiveOrder) => {
    if (order.status === "Pending") {
      return {
        label: "Accept",
        nextStatus: "Accepted" as LiveOrder["status"],
      };
    }

    if (order.status === "Accepted") {
      return {
        label: "Start Preparing",
        nextStatus: "Preparing" as LiveOrder["status"],
      };
    }

    if (order.status === "Preparing") {
      return {
        label: "Mark Ready",
        nextStatus: "Ready" as LiveOrder["status"],
      };
    }

    if (order.status === "Ready") {
      return {
        label: "Complete",
        nextStatus: "Completed" as LiveOrder["status"],
      };
    }

    return null;
  };

  const getHeaderClass = (status: LiveOrder["status"]) => {
    if (status === "Pending") return "text-yellow-400";
    if (status === "Accepted") return "text-blue-400";
    if (status === "Preparing") return "text-orange-400";
    if (status === "Ready") return "text-green-400";
    if (status === "Completed") return "text-zinc-400";

    return "text-[#D4AF37]";
  };

  const getButtonClass = (status: LiveOrder["status"]) => {
    if (status === "Accepted") return "bg-blue-500 text-black";
    if (status === "Preparing") return "bg-orange-500 text-black";
    if (status === "Ready") return "bg-green-500 text-black";
    if (status === "Completed") return "bg-zinc-500 text-black";

    return "bg-[#D4AF37] text-black";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-serif">Kitchen Display</h2>

          <p className="text-zinc-500 text-sm mt-1">
            Live order queue for cafe staff.
          </p>
        </div>

        <button
          onClick={() => setActiveSection?.("orders")}
          className="bg-[#D4AF37] text-black px-5 py-3 rounded-xl font-semibold"
        >
          Manage Orders
        </button>
      </div>

      <div className="grid grid-cols-5 gap-4">
        {columns.map((status) => {
          const orders = getOrders(status);

          return (
            <div
              key={status}
              className="bg-[#111111] border border-zinc-800 rounded-2xl p-4 min-h-[650px]"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className={`font-semibold ${getHeaderClass(status)}`}>
                  {status}
                </h3>

                <span className="h-7 min-w-7 px-2 rounded-full bg-zinc-900 border border-zinc-800 text-xs flex items-center justify-center text-[#D4AF37]">
                  {orders.length}
                </span>
              </div>

              {orders.length === 0 ? (
                <p className="text-zinc-600 text-sm">
                  No {status.toLowerCase()} orders.
                </p>
              ) : (
                <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1 admin-scrollbar">
                  {orders.map((order) => {
                    const action = getAction(order);

                    return (
                      <div
                        key={order.id}
                        className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4"
                      >
                        <div className="flex justify-between gap-3">
                          <div>
                            <p className="font-semibold text-[#D4AF37]">
                              #{order.id}
                            </p>

                            <p className="text-sm text-zinc-500 mt-1">
                              {order.customerName}
                            </p>
                          </div>

                          <p className="text-sm font-semibold">
                            ₹{order.total}
                          </p>
                        </div>

                        <p className="text-sm mt-4">
                          {order.itemName}
                        </p>

                        <div
                          className={`inline-flex mt-3 px-3 py-1 rounded-full border text-xs ${getTimerClass(
                            order.time
                          )}`}
                        >
                          {getTimerLabel(order.time)}
                        </div>

                        {action && (
                          <button
                            onClick={() =>
                              updateOrderStatus(order, action.nextStatus)
                            }
                            className={`w-full mt-4 py-2 rounded-lg text-xs font-semibold ${getButtonClass(
                              action.nextStatus
                            )}`}
                          >
                            {action.label}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}