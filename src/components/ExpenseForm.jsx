import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Select } from "./ui/select";
import { Button } from "./ui/button";

const ExpenseForm = ({ onAddExpense }) => {
  const [expenseName, setExpenseName] = useState("");
  const [category, setCategory] = useState("food");
  const [customCategory, setCustomCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [errors, setErrors] = useState({
    name: false,
    amount: false,
    customCategory: false,
  });

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setCategory(selectedCategory);
    setShowCustomCategory(selectedCategory === "other");

    // Clear custom category error when switching away from "other"
    if (selectedCategory !== "other") {
      setErrors((prev) => ({ ...prev, customCategory: false }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset all errors
    const newErrors = {
      name: false,
      amount: false,
      customCategory: false,
    };

    // Validate inputs
    let hasError = false;

    if (!expenseName.trim()) {
      newErrors.name = "Expense name is required";
      hasError = true;
    }

    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      newErrors.amount = "Please enter a valid amount";
      hasError = true;
    }

    if (category === "other" && !customCategory.trim()) {
      newErrors.customCategory = "Custom category is required";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    try {
      // Create new expense object
      const newExpense = {
        id: Date.now().toString(), // Use timestamp as temporary ID (as string)
        name: expenseName,
        category:
          category === "other" ? customCategory.toLowerCase() : category,
        amount: parseFloat(amount),
        date: new Date().toISOString(),
      };

      // Call the parent component's function to add the expense
      await onAddExpense(newExpense);

      // Reset form
      setExpenseName("");
      setCategory("food");
      setCustomCategory("");
      setAmount("");
      setShowCustomCategory(false);
      setErrors({
        name: false,
        amount: false,
        customCategory: false,
      });

      console.log("New expense added successfully");
    } catch (error) {
      console.error("Error adding expense:", error);
      alert("Failed to add expense. Please try again.");
    }
  };

  // Predefined categories with icons
  const predefinedCategories = {
    food: "🍔 Food",
    transport: "🚗 Transport",
    entertainment: "🎬 Entertainment",
    utilities: "💡 Utilities",
    shopping: "🛍️ Shopping",
    other: "➕ Other",
  };

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader className="animate-fadeIn">
        <CardTitle className="text-xl sm:text-2xl font-bold">
          Add New Expense
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="animate-slideUpFade">
            <label
              htmlFor="expense-name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Expense Name
            </label>
            <Input
              id="expense-name"
              type="text"
              value={expenseName}
              onChange={(e) => setExpenseName(e.target.value)}
              className={`w-full ${
                errors.name ? "border-red-500 focus:ring-red-500" : ""
              }`}
              placeholder="e.g., Groceries"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500 animate-pulse">
                {errors.name}
              </p>
            )}
          </div>

          <div className="animate-slideUpFade animation-delay-100">
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Category
            </label>
            <Select
              id="category"
              value={category}
              onChange={handleCategoryChange}
              className={`w-full ${
                errors.category ? "border-red-500 focus:ring-red-500" : ""
              }`}
            >
              {Object.entries(predefinedCategories).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </div>

          {showCustomCategory && (
            <div className="animate-slideUpFade">
              <label
                htmlFor="custom-category"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Custom Category
              </label>
              <Input
                id="custom-category"
                type="text"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                className={`w-full ${
                  errors.customCategory
                    ? "border-red-500 focus:ring-red-500"
                    : ""
                }`}
                placeholder="e.g., Healthcare"
              />
              {errors.customCategory && (
                <p className="mt-1 text-sm text-red-500 animate-pulse">
                  {errors.customCategory}
                </p>
              )}
            </div>
          )}

          <div className="animate-slideUpFade animation-delay-200">
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Amount (₹)
            </label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={`w-full ${
                errors.amount ? "border-red-500 focus:ring-red-500" : ""
              }`}
              placeholder="0.00"
              step="0.01"
              min="0"
            />
            {errors.amount && (
              <p className="mt-1 text-sm text-red-500 animate-pulse">
                {errors.amount}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full animate-fadeIn animation-delay-300 hover:scale-105 transition-transform duration-200"
          >
            Add Expense
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ExpenseForm;
