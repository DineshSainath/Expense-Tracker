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

  const handleSubmit = (e) => {
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

    // Validate custom category when "other" is selected
    if (category === "other" && !customCategory.trim()) {
      newErrors.customCategory = "Please specify a category";
      hasError = true;
    }

    // Update error state
    setErrors(newErrors);

    // Don't proceed if there are errors
    if (hasError) {
      return;
    }

    // Use custom category if "other" is selected
    const finalCategory =
      category === "other" ? customCategory.toLowerCase().trim() : category;

    const newExpense = {
      id: Date.now(),
      name: expenseName.trim(),
      category: finalCategory,
      amount: parseFloat(amount),
      date: new Date().toISOString(),
    };

    // Log for debugging
    console.log("Adding expense with category:", finalCategory);
    console.log("Is custom category:", category === "other");

    onAddExpense(newExpense);

    // Reset form
    setExpenseName("");
    setCategory("food");
    setCustomCategory("");
    setShowCustomCategory(false);
    setAmount("");
    setErrors({
      name: false,
      amount: false,
      customCategory: false,
    });
  };

  return (
    <Card className="overflow-hidden" style={{ height: "auto" }}>
      <CardHeader className="pb-2 sm:pb-3">
        <CardTitle className="text-lg sm:text-xl">Add New Expense</CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-3">
          <div>
            <label
              htmlFor="expense-name"
              className="block text-xs sm:text-sm font-medium mb-1"
            >
              Expense Name
            </label>
            <Input
              id="expense-name"
              placeholder="Coffee, Groceries, etc."
              value={expenseName}
              onChange={(e) => {
                setExpenseName(e.target.value);
                if (e.target.value.trim()) {
                  setErrors((prev) => ({ ...prev, name: false }));
                }
              }}
              className={`text-sm h-8 sm:h-10 ${
                errors.name ? "border-red-500" : ""
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="category"
              className="block text-xs sm:text-sm font-medium mb-1"
            >
              Category
            </label>
            <Select
              id="category"
              value={category}
              onChange={handleCategoryChange}
              className="text-sm h-8 sm:h-10"
            >
              <option value="food">Food</option>
              <option value="transport">Transport</option>
              <option value="entertainment">Entertainment</option>
              <option value="utilities">Utilities</option>
              <option value="shopping">Shopping</option>
              <option value="other">Other...</option>
            </Select>
          </div>

          {showCustomCategory && (
            <div>
              <label
                htmlFor="custom-category"
                className="block text-xs sm:text-sm font-medium mb-1"
              >
                Custom Category
              </label>
              <Input
                id="custom-category"
                placeholder="Enter category name"
                value={customCategory}
                onChange={(e) => {
                  setCustomCategory(e.target.value);
                  if (e.target.value.trim()) {
                    setErrors((prev) => ({ ...prev, customCategory: false }));
                  }
                }}
                className={`text-sm h-8 sm:h-10 ${
                  errors.customCategory ? "border-red-500" : ""
                }`}
              />
              {errors.customCategory && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.customCategory}
                </p>
              )}
            </div>
          )}

          <div>
            <label
              htmlFor="amount"
              className="block text-xs sm:text-sm font-medium mb-1"
            >
              Amount
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 text-xs sm:text-sm">₹</span>
              </div>
              <Input
                id="amount"
                type="text"
                placeholder="0.00"
                className={`pl-7 text-sm h-8 sm:h-10 ${
                  errors.amount ? "border-red-500" : ""
                }`}
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  if (
                    e.target.value &&
                    !isNaN(parseFloat(e.target.value)) &&
                    parseFloat(e.target.value) > 0
                  ) {
                    setErrors((prev) => ({ ...prev, amount: false }));
                  }
                }}
              />
            </div>
            {errors.amount && (
              <p className="text-red-500 text-xs mt-1">{errors.amount}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full h-8 sm:h-10 text-xs sm:text-sm mt-1 sm:mt-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-1 sm:mr-2 sm:w-4 sm:h-4"
            >
              <path d="M12 5v14"></path>
              <path d="M5 12h14"></path>
            </svg>
            Add Expense
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ExpenseForm;
