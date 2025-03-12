import React, { useState, useEffect } from "react";
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

// Base colors for predefined categories - using more distinct colors
const BASE_COLORS = {
  food: "#000000", // Black
  transport: "#0066CC", // Blue
  entertainment: "#CC3300", // Red
  utilities: "#339933", // Green
  shopping: "#9933CC", // Purple
};

// Additional colors for dynamic categories
const EXTRA_COLORS = ["#FF9900", "#FF6600", "#6699CC", "#669966", "#CC6699"];

const ExpenseAnalysis = ({ expenses }) => {
  const [activeChart, setActiveChart] = useState("pie");
  const [chartData, setChartData] = useState([]);
  const [dataWithPercentage, setDataWithPercentage] = useState([]);
  const [total, setTotal] = useState(0);

  // Process expense data whenever expenses change
  useEffect(() => {
    console.log(
      "ExpenseAnalysis: Processing updated expenses data",
      expenses.length
    );

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
    const formattedData = Object.entries(categoryTotals).map(
      ([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value: parseFloat(value.toFixed(2)),
        originalName: name, // Keep original name for color mapping
      })
    );

    // Calculate total
    const totalAmount = formattedData.reduce(
      (sum, item) => sum + item.value,
      0
    );

    // Calculate percentages for display
    const dataWithPercentages = formattedData.map((item) => ({
      ...item,
      percentage:
        totalAmount > 0 ? ((item.value / totalAmount) * 100).toFixed(1) : 0,
    }));

    setChartData(formattedData);
    setDataWithPercentage(dataWithPercentages);
    setTotal(totalAmount);
  }, [expenses]);

  // Generate color map for all categories (including custom ones)
  const getCategoryColor = (category, index) => {
    if (BASE_COLORS[category]) {
      return BASE_COLORS[category];
    }
    // For custom categories, use extra colors in rotation
    return EXTRA_COLORS[index % EXTRA_COLORS.length];
  };

  // Custom tooltip formatter to display rupee symbol
  const formatTooltipValue = (value) => `₹${value.toFixed(2)}`;

  return (
    <Card className="h-full shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader className="pb-2 sm:pb-3 flex flex-row items-center justify-between animate-fadeIn">
        <CardTitle className="text-xl sm:text-2xl font-bold">
          Expense Analysis
        </CardTitle>
        <Tabs className="justify-end">
          <TabsTrigger
            active={activeChart === "pie"}
            onClick={() => setActiveChart("pie")}
            className="text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-1.5"
          >
            Pie Chart
          </TabsTrigger>
          <TabsTrigger
            active={activeChart === "bar"}
            onClick={() => setActiveChart("bar")}
            className="text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-1.5"
          >
            Bar Chart
          </TabsTrigger>
        </Tabs>
      </CardHeader>
      <CardContent className="animate-fadeIn animation-delay-100">
        <div className="h-48 sm:h-56 md:h-64">
          <ResponsiveContainer
            width="100%"
            height="100%"
            key={`chart-container-${expenses.length}-${total}`}
          >
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
                      key={`cell-${index}-${entry.value}`}
                      fill={getCategoryColor(entry.originalName, index)}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={formatTooltipValue} />
                <text
                  x="50%"
                  y="48%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{ fontSize: "14px", fontWeight: "bold", fill: "#000" }}
                >
                  ₹{total.toFixed(2)}
                </text>
                <text
                  x="50%"
                  y="58%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{ fontSize: "12px", fill: "#666" }}
                >
                  Total
                </text>
              </PieChart>
            ) : (
              <BarChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 20,
                  left: 10,
                  bottom: 5,
                }}
                maxBarSize={40}
              >
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={formatTooltipValue} />
                <Bar dataKey="value">
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}-${entry.value}`}
                      fill={getCategoryColor(entry.originalName, index)}
                    />
                  ))}
                </Bar>
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4 sm:grid-cols-3 animate-fadeIn animation-delay-200">
          {dataWithPercentage.map((item, index) => (
            <div
              key={`category-${item.originalName}-${item.value}`}
              className="flex flex-col items-center p-2 rounded-lg border border-gray-100"
            >
              <div className="flex items-center mb-1">
                <div
                  className="w-4 h-4 rounded-full mr-2"
                  style={{
                    backgroundColor: getCategoryColor(item.originalName, index),
                  }}
                ></div>
                <span className="text-sm font-medium capitalize">
                  {item.name}
                </span>
              </div>
              <div className="text-lg font-bold">₹{item.value}</div>
              <div className="text-xs text-gray-500">({item.percentage}%)</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpenseAnalysis;
