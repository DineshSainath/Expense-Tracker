import React, { useState, useEffect } from "react";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseAnalysis from "./components/ExpenseAnalysis";
import RecentExpenses from "./components/RecentExpenses";
import Login from "./components/Login";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { FaUserCircle, FaChevronDown } from "react-icons/fa";

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

function AppContent() {
  const { currentUser, logout } = useAuth();
  const [expenses, setExpenses] = useState(() => {
    const savedExpenses = localStorage.getItem("expenses");
    return savedExpenses ? JSON.parse(savedExpenses) : initialExpenses;
  });
  const [showDropdown, setShowDropdown] = useState(false);

  // Save expenses to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  // Fetch user's expenses from Firestore
  useEffect(() => {
    async function fetchExpenses() {
      if (currentUser) {
        const q = query(
          collection(db, "expenses"),
          where("userId", "==", currentUser.uid)
        );
        const querySnapshot = await getDocs(q);
        const expenseData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setExpenses(expenseData);
      }
    }
    fetchExpenses();
  }, [currentUser]);

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

  const handleAddExpense = async (newExpense) => {
    try {
      // Add userId to the expense
      const expenseWithUser = {
        ...newExpense,
        userId: currentUser.uid,
      };

      // Add to Firestore
      const docRef = await addDoc(collection(db, "expenses"), expenseWithUser);

      // Update local state
      setExpenses([...expenses, { ...expenseWithUser, id: docRef.id }]);
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  const handleUpdateExpense = async (updatedExpense) => {
    try {
      // Update in Firestore
      await updateDoc(doc(db, "expenses", updatedExpense.id), updatedExpense);

      // Update local state
      setExpenses(
        expenses.map((expense) =>
          expense.id === updatedExpense.id ? updatedExpense : expense
        )
      );
    } catch (error) {
      console.error("Error updating expense:", error);
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      // Delete from Firestore
      await deleteDoc(doc(db, "expenses", id));

      // Update local state
      setExpenses(expenses.filter((expense) => expense.id !== id));
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (!currentUser) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4">
      <div className="max-w-7xl mx-auto">
        <header className="bg-white rounded-lg border border-gray-100 shadow-sm p-3 sm:p-4 mb-3 sm:mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl sm:text-3xl font-bold font-outfit">
              Expense Tracker
            </h1>

            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center px-4 py-2 text-base sm:text-lg font-medium bg-black text-white rounded-full shadow-sm border border-gray-800 hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 font-outfit tracking-wide"
              >
                <FaUserCircle className="mr-2 text-lg sm:text-xl" />
                {currentUser.displayName}
                <FaChevronDown className="ml-2 text-sm" />
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-100">
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-outfit"
                  >
                    Logout
                  </button>
                </div>
              )}
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

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
