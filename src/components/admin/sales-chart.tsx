"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data for different filters
const mockData = {
  "15d": [
    { date: "Aug 15", revenue: 3200, orders: 90 },
    { date: "Aug 16", revenue: 2800, orders: 72 },
    { date: "Aug 17", revenue: 3500, orders: 95 },
    { date: "Aug 18", revenue: 4000, orders: 110 },
    { date: "Aug 19", revenue: 3000, orders: 85 },
    { date: "Aug 20", revenue: 4500, orders: 120 },
    { date: "Aug 21", revenue: 3800, orders: 105 },
  ],
  "30d": [
    { date: "Aug 01", revenue: 1200, orders: 45 },
    { date: "Aug 05", revenue: 2500, orders: 70 },
    { date: "Aug 10", revenue: 1800, orders: 55 },
    { date: "Aug 15", revenue: 3200, orders: 90 },
    { date: "Aug 20", revenue: 2800, orders: 72 },
    { date: "Aug 25", revenue: 3500, orders: 95 },
    { date: "Aug 30", revenue: 4000, orders: 110 },
  ],
  "1y": [
    { date: "Jan", revenue: 15000, orders: 350 },
    { date: "Feb", revenue: 18000, orders: 420 },
    { date: "Mar", revenue: 22000, orders: 500 },
    { date: "Apr", revenue: 26000, orders: 550 },
    { date: "May", revenue: 30000, orders: 620 },
    { date: "Jun", revenue: 34000, orders: 700 },
    { date: "Jul", revenue: 38000, orders: 780 },
    { date: "Aug", revenue: 40000, orders: 820 },
  ],
};

export function SalesChart() {
  const [filter, setFilter] = useState<"15d" | "30d" | "1y">("30d");

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Chart Title */}
        <CardTitle className="text-sm font-medium">
          Sales{" "}
          {filter === "15d"
            ? "(Last 15 Days)"
            : filter === "30d"
              ? "(Last 30 Days)"
              : "(Last 1 Year)"}
        </CardTitle>

        {/* ShadCN Dropdown Filter */}
        <Select
          value={filter}
          onValueChange={(value: "15d" | "30d" | "1y") => setFilter(value)}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="15d">Last 15 Days</SelectItem>
            <SelectItem value="30d">Last 30 Days</SelectItem>
            <SelectItem value="1y">Last 1 Year</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      {/* Chart */}
      <CardContent className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={mockData[filter]}
            margin={{ top: 8, right: 8, left: 0, bottom: 8 }}
          >
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
            {/* Revenue Line */}
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#4F46E5"
              strokeWidth={3}
              dot={{ r: 5, fill: "#4F46E5" }}
            />
            {/* Orders Line */}
            <Line
              type="monotone"
              dataKey="orders"
              stroke="#F43F5E"
              strokeWidth={3}
              dot={{ r: 5, fill: "#F43F5E" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
