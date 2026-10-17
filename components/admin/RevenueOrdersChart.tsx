"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

import type { OrderHistoryItem } from "../sections/AdminDashboard";

type Props = {
  orderHistory: OrderHistoryItem[];
};

export default function RevenueOrdersChart({ orderHistory }: Props) {
  const groupedData: Record<
    string,
    {
      date: string;
      orders: number;
      revenue: number;
    }
  > = {};

  orderHistory.forEach((order) => {
    const date = new Date(order.time).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    });

    if (!groupedData[date]) {
      groupedData[date] = {
        date,
        orders: 0,
        revenue: 0,
      };
    }

    groupedData[date].orders += 1;
    groupedData[date].revenue += Number(order.total || 0);
  });

const chartData = Object.values(groupedData);

const hasEnoughData = chartData.length > 1;
  return (
    <div className="bg-[#111111] border border-zinc-800 rounded-2xl p-6">
      <h2 className="text-xl font-semibold mb-6">
        Revenue & Orders Trend
      </h2>

      {chartData.length === 0 ? (
        <p className="text-zinc-500 text-sm">
          Complete some orders to see chart data.
        </p>
      ) : (
        <div className="space-y-8">
<div className="h-64">
  {hasEnoughData ? (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
        <XAxis dataKey="date" stroke="#71717a" />
        <YAxis stroke="#71717a" />
        <Tooltip
          contentStyle={{
            backgroundColor: "#111111",
            border: "1px solid #3f3f46",
            color: "#F5E6C8",
          }}
        />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke="#D4AF37"
          strokeWidth={3}
          dot
        />
      </LineChart>
    </ResponsiveContainer>
  ) : (
    <div className="h-full flex items-center justify-center border border-zinc-800 rounded-xl text-zinc-500 text-sm">
      Need orders from more than one day to show revenue trend.
    </div>
  )}
</div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="date" stroke="#71717a" />
                <YAxis stroke="#71717a" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#111111",
                    border: "1px solid #3f3f46",
                    color: "#F5E6C8",
                  }}
                />
                <Bar dataKey="orders" fill="#D4AF37" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}