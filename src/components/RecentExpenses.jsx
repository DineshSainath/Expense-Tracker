import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Select } from "./ui/select";
import { Button } from "./ui/button";

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
  const [deleteInProgress, setDeleteInProgress] = useState(false);
  const [updateInProgress, setUpdateInProgress] = useState(false);

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
  const handleSaveEdit = async (id) => {
    try {
      if (updateInProgress) return;

      // Validate form data
      if (
        !editForm.name ||
        !editForm.amount ||
        isNaN(parseFloat(editForm.amount))
      ) {
        return;
      }

      // Validate custom category if "other" is selected
      if (editForm.category === "other" && !editForm.customCategory.trim()) {
        return;
      }

      setUpdateInProgress(true);

      // Find the original expense to get its properties
      const originalExpense = expenses.find((exp) => exp.id === id);
      if (!originalExpense) {
        throw new Error("Expense not found");
      }

      // Use custom category if "other" is selected
      const finalCategory =
        editForm.category === "other"
          ? editForm.customCategory.toLowerCase().trim()
          : editForm.category;

      console.log(
        "Attempting to update expense with ID:",
        id,
        "Type:",
        typeof id
      );

      // Create the updated expense object
      const updatedExpense = {
        id: id, // Keep the original ID
        name: editForm.name.trim(),
        category: finalCategory,
        amount: parseFloat(editForm.amount),
        date: originalExpense.date, // Keep the original date
        userId: originalExpense.userId || "", // Keep the userId
      };

      // Call the parent component's update function
      const success = await onUpdateExpense(updatedExpense);

      // Reset state after successful update
      if (success) {
        console.log("Update operation was successful");
        setEditingId(null);
        setShowCustomCategory(false);
      } else {
        console.error("Update operation returned false");
      }

      setUpdateInProgress(false);
    } catch (error) {
      console.error("Error updating expense:", error);
      setUpdateInProgress(false);
      alert("Failed to update expense. Please try again.");
    }
  };

  // Handle delete expense
  const handleDeleteExpense = async (id) => {
    try {
      if (deleteInProgress) return;

      if (window.confirm("Are you sure you want to delete this expense?")) {
        setDeleteInProgress(true);
        setEditingId(id); // Set the editing ID to track which expense is being deleted

        console.log(
          "Attempting to delete expense with ID:",
          id,
          "Type:",
          typeof id
        );

        // Call the parent component's delete function
        const success = await onDeleteExpense(id);

        // Reset state after successful deletion
        if (success) {
          console.log("Delete operation was successful");
          setEditingId(null);
        } else {
          console.error("Delete operation returned false");
        }

        setDeleteInProgress(false);
      }
    } catch (error) {
      console.error("Error deleting expense:", error);
      setDeleteInProgress(false);
      setEditingId(null);
      alert("Failed to delete expense. Please try again.");
    }
  };

  // Predefined categories with icons
  const predefinedCategories = {
    food: "🍔",
    transport: "🚗",
    entertainment: "🎬",
    utilities: "💡",
    shopping: "🛍️",
  };

  // Get category icon
  const getCategoryIcon = (category) => {
    return predefinedCategories[category] || "📝";
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
    .filter((expense) => {
      if (!searchTerm) return true;
      return (
        expense.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        return sortOrder === "asc"
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date);
      } else if (sortBy === "amount") {
        return sortOrder === "asc" ? a.amount - b.amount : b.amount - a.amount;
      } else if (sortBy === "name") {
        return sortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
      return 0;
    });

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader className="animate-fadeIn">
        <CardTitle className="text-xl sm:text-2xl font-bold">
          Recent Expenses
        </CardTitle>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-2">
          <div className="relative flex-grow animate-slideInLeft animation-delay-100">
            <Input
              type="text"
              placeholder="Search expenses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex gap-2 animate-slideInRight animation-delay-200">
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-24 sm:w-28"
            >
              <option value="date">Date</option>
              <option value="amount">Amount</option>
              <option value="name">Name</option>
            </Select>
            <Button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="px-2 hover:scale-105 transition-transform duration-200"
            >
              {sortOrder === "asc" ? "↑" : "↓"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {filteredExpenses.length === 0 ? (
            <div className="text-center py-6 text-gray-500 animate-fadeIn">
              No expenses found.
            </div>
          ) : (
            filteredExpenses.map((expense, index) => (
              <div
                key={expense.id}
                className={`bg-white border rounded-lg p-3 ${
                  editingId === expense.id
                    ? "border-blue-300 shadow-md"
                    : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                } transition-all duration-200 animate-slideInLeft`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {editingId === expense.id ? (
                  <div className="space-y-3 animate-fadeIn">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                      </label>
                      <Input
                        type="text"
                        value={editForm.name}
                        onChange={(e) =>
                          setEditForm({ ...editForm, name: e.target.value })
                        }
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                      </label>
                      <Select
                        value={editForm.category}
                        onChange={handleCategoryChange}
                        className="w-full"
                      >
                        {Object.entries(predefinedCategories).map(
                          ([key, icon]) => (
                            <option key={key} value={key}>
                              {icon}{" "}
                              {key.charAt(0).toUpperCase() + key.slice(1)}
                            </option>
                          )
                        )}
                        <option value="other">➕ Other</option>
                      </Select>
                    </div>
                    {showCustomCategory && (
                      <div className="animate-slideUpFade">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Custom Category
                        </label>
                        <Input
                          type="text"
                          value={editForm.customCategory}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              customCategory: e.target.value,
                            })
                          }
                          className="w-full"
                          placeholder="e.g., Healthcare"
                        />
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Amount (₹)
                      </label>
                      <Input
                        type="number"
                        value={editForm.amount}
                        onChange={(e) =>
                          setEditForm({ ...editForm, amount: e.target.value })
                        }
                        className="w-full"
                        step="0.01"
                        min="0"
                      />
                    </div>
                    <div className="flex justify-end space-x-2 pt-2">
                      <Button
                        onClick={handleCancelEdit}
                        className="bg-gray-200 text-gray-800 hover:bg-gray-300 hover:scale-105 transition-all duration-200"
                        disabled={updateInProgress}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => handleSaveEdit(expense.id)}
                        className="hover:scale-105 transition-transform duration-200"
                        disabled={updateInProgress}
                      >
                        {updateInProgress ? "Updating..." : "Save"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="text-2xl mt-1">
                        {getCategoryIcon(expense.category)}
                      </div>
                      <div>
                        <h3 className="font-medium">{expense.name}</h3>
                        <div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-500 gap-1 sm:gap-2">
                          <span className="capitalize">{expense.category}</span>
                          <span className="hidden sm:inline">•</span>
                          <span>{formatDate(expense.date)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="font-semibold">
                        ₹{expense.amount.toFixed(2)}
                      </div>
                      <div className="flex space-x-1 mt-1">
                        <button
                          onClick={() => handleEditClick(expense)}
                          className="text-blue-600 hover:text-blue-800 text-sm hover:scale-110 transition-transform duration-200"
                          disabled={deleteInProgress || updateInProgress}
                        >
                          Edit
                        </button>
                        <span className="text-gray-300">|</span>
                        <button
                          onClick={() => handleDeleteExpense(expense.id)}
                          className="text-red-600 hover:text-red-800 text-sm hover:scale-110 transition-transform duration-200"
                          disabled={deleteInProgress || updateInProgress}
                        >
                          {deleteInProgress && expense.id === editingId
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentExpenses;
