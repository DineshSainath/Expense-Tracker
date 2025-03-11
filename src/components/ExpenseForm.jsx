import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Select } from "./ui/select";
import { Button } from "./ui/button";

const ExpenseForm = ({ onAddExpense }) => {
  const [expenseName, setExpenseName] = useState("");
  const [category, setCategory] = useState("food");
  const [amount, setAmount] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!expenseName || !amount || isNaN(parseFloat(amount))) {
      return;
    }

    const newExpense = {
      id: Date.now(),
      name: expenseName,
      category,
      amount: parseFloat(amount),
      date: new Date().toISOString(),
    };

    onAddExpense(newExpense);

    // Reset form
    setExpenseName("");
    setCategory("food");
    setAmount("");
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2 sm:pb-3">
        <CardTitle className="text-lg sm:text-xl">Add New Expense</CardTitle>
      </CardHeader>
      <CardContent>
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
              onChange={(e) => setExpenseName(e.target.value)}
              className="text-sm h-8 sm:h-10"
            />
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
              onChange={(e) => setCategory(e.target.value)}
              className="text-sm h-8 sm:h-10"
            >
              <option value="food">Food</option>
              <option value="transport">Transport</option>
              <option value="entertainment">Entertainment</option>
              <option value="utilities">Utilities</option>
            </Select>
          </div>

          <div>
            <label
              htmlFor="amount"
              className="block text-xs sm:text-sm font-medium mb-1"
            >
              Amount
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 text-xs sm:text-sm">$</span>
              </div>
              <Input
                id="amount"
                type="text"
                placeholder="0.00"
                className="pl-7 text-sm h-8 sm:h-10"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
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
