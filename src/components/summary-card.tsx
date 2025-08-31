"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowDownRight,
  ArrowUpRight,
  Package,
  ShoppingCart,
  Users,
} from "lucide-react";

// Mock data fallback for demo purposes
const mockSummary = {
  revenue: 45230,
  orders: 1240,
  customers: 532,
  lowStock: 8,
  revenueChangePct: 12.5,
  ordersChangePct: -3.8,
};

type Summary = {
  revenue: number;
  orders: number;
  customers: number;
  lowStock: number;
  revenueChangePct: number;
  ordersChangePct: number;
};

async function fetchSummary(): Promise<Summary> {
  const res = await fetch("/api/dashboard/summary");
  if (!res.ok) throw new Error("Failed to load summary");
  return res.json();
}

function Trend({ pct }: { pct: number }) {
  const positive = pct >= 0;
  return (
    <div
      className={`flex items-center gap-1 text-sm font-medium ${
        positive ? "text-green-600" : "text-red-600"
      }`}
    >
      {positive ? (
        <ArrowUpRight className="h-4 w-4" />
      ) : (
        <ArrowDownRight className="h-4 w-4" />
      )}
      <span>{Math.abs(pct).toFixed(1)}%</span>
    </div>
  );
}

export function SummaryCards() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard", "summary"],
    queryFn: fetchSummary,
    initialData: mockSummary,
  });

  const summary = data || mockSummary;

  const cards = [
    {
      title: "Revenue",
      value: `$${summary.revenue.toLocaleString()}`,
      icon: <ShoppingCart className="h-5 w-5 text-indigo-600" />,
      trend: <Trend pct={summary.revenueChangePct} />,
    },
    {
      title: "Orders",
      value: summary.orders.toLocaleString(),
      icon: <Package className="h-5 w-5 text-blue-600" />,
      trend: <Trend pct={summary.ordersChangePct} />,
    },
    {
      title: "Customers",
      value: summary.customers.toLocaleString(),
      icon: <Users className="h-5 w-5 text-emerald-600" />,
      subtext: "Active customers",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <Card
          key={index}
          className="rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">
              {card.title}
            </CardTitle>
            {card.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {isLoading ? "..." : card.value}
            </div>
            {card.trend && !isLoading && (
              <div className="mt-1">{card.trend}</div>
            )}
            {card.subtext && (
              <div className="text-xs text-gray-500 mt-1">{card.subtext}</div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
