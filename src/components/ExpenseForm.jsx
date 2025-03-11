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
      <CardHeader className="pb-3">
        <CardTitle>Add New Expense</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label
              htmlFor="expense-name"
              className="block text-sm font-medium mb-1"
            >
              Expense Name
            </label>
            <Input
              id="expense-name"
              placeholder="Coffee, Groceries, etc."
              value={expenseName}
              onChange={(e) => setExpenseName(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium mb-1"
            >
              Category
            </label>
            <Select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="food">Food</option>
              <option value="transport">Transport</option>
              <option value="entertainment">Entertainment</option>
              <option value="utilities">Utilities</option>
            </Select>
          </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium mb-1">
              Amount
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <Input
                id="amount"
                type="text"
                placeholder="0.00"
                className="pl-7"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>

          <Button type="submit" className="w-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2"
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
