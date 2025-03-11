import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Select } from "./ui/select";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";

const RecentExpenses = ({ expenses, onUpdateExpense, onDeleteExpense }) => {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    category: "",
    customCategory: "",
    amount: "",
  });
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  // Handle edit button click
  const handleEditClick = (expense) => {
    setEditingId(expense.id);
    setEditForm({
      name: expense.name,
      category: Object.keys(predefinedCategories).includes(expense.category)
        ? expense.category
        : "other",
      customCategory: Object.keys(predefinedCategories).includes(
        expense.category
      )
        ? ""
        : expense.category,
      amount: expense.amount.toString(),
    });
    setShowCustomCategory(
      !Object.keys(predefinedCategories).includes(expense.category)
    );
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingId(null);
    setShowCustomCategory(false);
  };

  // Handle category change in edit form
  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setEditForm({
      ...editForm,
      category: selectedCategory,
    });
    setShowCustomCategory(selectedCategory === "other");
  };

  // Handle save edit
  const handleSaveEdit = (id) => {
    if (
      !editForm.name ||
      !editForm.amount ||
      isNaN(parseFloat(editForm.amount))
    ) {
      return;
    }

    // Use custom category if "other" is selected
    const finalCategory =
      editForm.category === "other"
        ? editForm.customCategory.toLowerCase().trim()
        : editForm.category;

    // Validate that custom category is provided when "other" is selected
    if (editForm.category === "other" && !editForm.customCategory.trim()) {
      return;
    }

    const updatedExpense = {
      id,
      name: editForm.name,
      category: finalCategory,
      amount: parseFloat(editForm.amount),
      date: expenses.find((exp) => exp.id === id).date, // Keep the original date
    };

    onUpdateExpense(updatedExpense);
    setEditingId(null);
    setShowCustomCategory(false);
  };

  // Handle delete expense
  const handleDeleteExpense = (id) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      onDeleteExpense(id);
    }
  };

  // Predefined categories
  const predefinedCategories = {
    food: "Food",
    transport: "Transport",
    entertainment: "Entertainment",
    utilities: "Utilities",
    shopping: "Shopping",
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Filter and sort expenses
  const filteredExpenses = expenses
    .filter(
      (expense) =>
        expense.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "date") {
        return sortOrder === "desc"
          ? new Date(b.date) - new Date(a.date)
          : new Date(a.date) - new Date(b.date);
      } else if (sortBy === "amount") {
        return sortOrder === "desc" ? b.amount - a.amount : a.amount - b.amount;
      } else if (sortBy === "name") {
        return sortOrder === "desc"
          ? b.name.localeCompare(a.name)
          : a.name.localeCompare(b.name);
      }
      return 0;
    });

  return (
    <Card className="h-full">
      <CardHeader className="pb-2 sm:pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-lg sm:text-xl">Recent Expenses</CardTitle>
        <div className="flex items-center space-x-2">
          <div className="relative w-32 sm:w-40">
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-xs sm:text-sm h-7 sm:h-8 sm:h-9 pl-7"
            />
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
              className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <div className="flex items-center">
            <div className="relative">
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs sm:text-sm h-7 sm:h-9 w-24 sm:w-28 px-2 appearance-none"
                style={{ paddingRight: "24px" }}
              >
                <option value="date">Date</option>
                <option value="amount">Amount</option>
                <option value="name">Name</option>
              </Select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                <svg
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </div>
            </div>
            <button
              onClick={() =>
                setSortOrder(sortOrder === "desc" ? "asc" : "desc")
              }
              className="ml-1 p-1 rounded hover:bg-gray-100"
            >
              {sortOrder === "desc" ? (
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
                >
                  <path d="m3 8 4-4 4 4"></path>
                  <path d="M7 4v16"></path>
                  <path d="M11 12h4"></path>
                  <path d="M11 16h7"></path>
                  <path d="M11 20h10"></path>
                </svg>
              ) : (
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
                >
                  <path d="m3 16 4 4 4-4"></path>
                  <path d="M7 20V4"></path>
                  <path d="M11 4h10"></path>
                  <path d="M11 8h7"></path>
                  <path d="M11 12h4"></path>
                </svg>
              )}
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-y-auto max-h-[400px] pr-1">
          {filteredExpenses.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No expenses found
            </div>
          ) : (
            <ul className="space-y-2">
              {filteredExpenses.map((expense) => (
                <li
                  key={expense.id}
                  className="bg-white border border-gray-100 rounded-lg shadow-sm p-3 transition-all hover:shadow-md"
                >
                  {editingId === expense.id ? (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Input
                          value={editForm.name}
                          onChange={(e) =>
                            setEditForm({ ...editForm, name: e.target.value })
                          }
                          placeholder="Expense name"
                          className="text-sm h-8"
                        />
                        <div className="relative w-24 sm:w-28">
                          <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                            <span className="text-gray-500 text-xs sm:text-sm">
                              ₹
                            </span>
                          </div>
                          <Input
                            value={editForm.amount}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                amount: e.target.value,
                              })
                            }
                            placeholder="0.00"
                            className="pl-5 text-sm h-8"
                          />
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="relative flex-grow">
                          <Select
                            value={editForm.category}
                            onChange={handleCategoryChange}
                            className="text-sm h-10 w-full px-2 appearance-none"
                            style={{ paddingRight: "24px" }}
                          >
                            {Object.entries(predefinedCategories).map(
                              ([value, label]) => (
                                <option key={value} value={value}>
                                  {label}
                                </option>
                              )
                            )}
                            <option value="other">Other...</option>
                          </Select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                            <svg
                              className="h-4 w-4 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 9l-7 7-7-7"
                              ></path>
                            </svg>
                          </div>
                        </div>
                        {showCustomCategory && (
                          <Input
                            value={editForm.customCategory}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                customCategory: e.target.value,
                              })
                            }
                            placeholder="Custom category"
                            className="text-sm h-9 flex-grow"
                          />
                        )}
                      </div>
                      <div className="flex justify-end space-x-2 mt-2">
                        <Button
                          onClick={handleCancelEdit}
                          className="h-7 text-xs px-3"
                          variant="outline"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={() => handleSaveEdit(expense.id)}
                          className="h-7 text-xs px-3"
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-sm sm:text-base">
                            {expense.name}
                          </h4>
                          <div className="flex items-center mt-1">
                            <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-black text-white capitalize">
                              {expense.category}
                            </span>
                            <span className="text-xs text-gray-500 ml-2">
                              {formatDate(expense.date)}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="font-bold text-sm sm:text-base">
                            ₹{expense.amount.toFixed(2)}
                          </span>
                          <div className="flex mt-1">
                            <button
                              onClick={() => handleEditClick(expense)}
                              className="p-1 text-gray-500 hover:text-gray-700"
                              aria-label="Edit expense"
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
                              >
                                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
                                <path d="m15 5 4 4"></path>
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteExpense(expense.id)}
                              className="p-1 text-gray-500 hover:text-red-500 ml-1"
                              aria-label="Delete expense"
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
                              >
                                <path d="M3 6h18"></path>
                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentExpenses;
