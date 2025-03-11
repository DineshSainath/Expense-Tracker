import React, { useState, useEffect } from "react";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseAnalysis from "./components/ExpenseAnalysis";
import RecentExpenses from "./components/RecentExpenses";

// Sample initial expenses
const initialExpenses = [
  {
    id: 1,
    name: "Electricity Bill",
    category: "utilities",
    amount: 94.2,
    date: "2023-03-10T12:00:00Z",
  },
  {
    id: 2,
    name: "Groceries",
    category: "food",
    amount: 85.45,
    date: "2023-03-09T14:30:00Z",
  },
  {
    id: 3,
    name: "Movie Tickets",
    category: "entertainment",
    amount: 24.99,
    date: "2023-03-08T19:00:00Z",
  },
  {
    id: 4,
    name: "Bus Fare",
    category: "transport",
    amount: 18.5,
    date: "2023-03-10T08:15:00Z",
  },
  {
    id: 5,
    name: "New Shoes",
    category: "shopping",
    amount: 59.99,
    date: "2023-03-11T15:20:00Z",
  },
];

function App() {
  const [expenses, setExpenses] = useState(() => {
    const savedExpenses = localStorage.getItem("expenses");
    return savedExpenses ? JSON.parse(savedExpenses) : initialExpenses;
  });

  // Save expenses to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  // Calculate total expenses
  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  // Calculate today's expenses
  const today = new Date().toISOString().split("T")[0];
  const todayExpenses = expenses
    .filter((expense) => expense.date.split("T")[0] === today)
    .reduce((sum, expense) => sum + expense.amount, 0);

  const handleAddExpense = (newExpense) => {
    // Create a new array with the new expense to trigger re-render
    const updatedExpenses = [...expenses, newExpense];

    // Log for debugging
    console.log("Added new expense:", newExpense);
    console.log("Category type:", typeof newExpense.category);
    console.log("Updated expenses array length:", updatedExpenses.length);

    // Force a state update by creating a completely new array
    setExpenses([...expenses, newExpense]);
  };

  // Handle updating an expense
  const handleUpdateExpense = (updatedExpense) => {
    const updatedExpenses = expenses.map((expense) =>
      expense.id === updatedExpense.id ? updatedExpense : expense
    );
    setExpenses(updatedExpenses);
  };

  // Handle deleting an expense
  const handleDeleteExpense = (id) => {
    const updatedExpenses = expenses.filter((expense) => expense.id !== id);
    setExpenses(updatedExpenses);
  };

  return (
    <div className="min-h-screen bg-background p-3 sm:p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-3 sm:mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
              Expense Tracker
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Track and visualize your spending
            </p>
          </div>

          <div className="mt-3 sm:mt-0 flex flex-row sm:flex-row gap-2 sm:gap-3">
            <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-2 sm:p-3 flex items-center flex-1 sm:flex-auto">
              <span className="text-xl sm:text-2xl mr-2">₹</span>
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Total:
                </p>
                <p className="text-lg sm:text-xl font-bold">
                  ₹{totalExpenses.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-2 sm:p-3 flex items-center flex-1 sm:flex-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 text-red-500 sm:w-6 sm:h-6"
              >
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                <polyline points="17 6 23 6 23 12"></polyline>
              </svg>
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Today:
                </p>
                <p className="text-lg sm:text-xl font-bold">
                  ₹{todayExpenses.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
          <div className="lg:col-span-1">
            <div className="flex-shrink-0">
              <ExpenseForm onAddExpense={handleAddExpense} />
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              <ExpenseAnalysis expenses={expenses} />
              <RecentExpenses
                expenses={expenses}
                onUpdateExpense={handleUpdateExpense}
                onDeleteExpense={handleDeleteExpense}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
