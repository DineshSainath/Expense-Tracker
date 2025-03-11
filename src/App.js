import React, { useState, useEffect } from "react";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseAnalysis from "./components/ExpenseAnalysis";

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
    setExpenses([...expenses, newExpense]);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold">Expense Tracker</h1>
            <p className="text-muted-foreground mt-1">
              Track and visualize your spending
            </p>
          </div>

          <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-3">
            <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-3 flex items-center">
              <span className="text-2xl mr-2">$</span>
              <div>
                <p className="text-sm text-muted-foreground">Total:</p>
                <p className="text-xl font-bold">${totalExpenses.toFixed(2)}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-3 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 text-red-500"
              >
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                <polyline points="17 6 23 6 23 12"></polyline>
              </svg>
              <div>
                <p className="text-sm text-muted-foreground">Today:</p>
                <p className="text-xl font-bold">${todayExpenses.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <ExpenseForm onAddExpense={handleAddExpense} />
          </div>
          <div className="md:col-span-2">
            <ExpenseAnalysis expenses={expenses} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
