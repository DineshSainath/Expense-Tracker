import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Tabs, TabsTrigger } from "./ui/tabs";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#000000", "#333333", "#666666", "#999999"];

const ExpenseAnalysis = ({ expenses }) => {
  const [activeChart, setActiveChart] = useState("pie");

  // Group expenses by category and calculate totals
  const categoryTotals = expenses.reduce((acc, expense) => {
    const category = expense.category;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += expense.amount;
    return acc;
  }, {});

  // Format data for charts
  const chartData = Object.entries(categoryTotals).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value: parseFloat(value.toFixed(2)),
  }));

  // Calculate percentages for display
  const total = chartData.reduce((sum, item) => sum + item.value, 0);
  const dataWithPercentage = chartData.map((item) => ({
    ...item,
    percentage: total > 0 ? ((item.value / total) * 100).toFixed(1) : 0,
  }));

  return (
    <Card className="h-full">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle>Expense Analysis</CardTitle>
        <Tabs className="justify-end">
          <TabsTrigger
            active={activeChart === "pie"}
            onClick={() => setActiveChart("pie")}
          >
            Pie Chart
          </TabsTrigger>
          <TabsTrigger
            active={activeChart === "bar"}
            onClick={() => setActiveChart("bar")}
          >
            Bar Chart
          </TabsTrigger>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            {activeChart === "pie" ? (
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  innerRadius={40}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
              </PieChart>
            ) : (
              <BarChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                <Bar dataKey="value" fill="#000000" />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4 sm:grid-cols-4">
          {dataWithPercentage.map((item, index) => (
            <div key={index} className="text-center p-2 rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></div>
                <span className="font-medium">{item.name}</span>
              </div>
              <div className="text-xl font-bold">${item.value}</div>
              <div className="text-sm text-muted-foreground">
                ({item.percentage}%)
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpenseAnalysis;
