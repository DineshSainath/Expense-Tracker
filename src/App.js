import React, { useState, useEffect, useRef } from "react";
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

// Predefined categories with icons
const predefinedCategories = {
  food: "🍔",
  transport: "🚗",
  entertainment: "🎬",
  utilities: "💡",
  shopping: "🛍️",
};

function AppContent() {
  const { currentUser, logout } = useAuth();
  const [expenses, setExpenses] = useState(() => {
    const savedExpenses = localStorage.getItem("expenses");
    return savedExpenses ? JSON.parse(savedExpenses) : initialExpenses;
  });
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Save expenses to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  // Handle clicks outside the dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }

    // Add event listener when dropdown is shown
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Clean up the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

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
      throw error; // Re-throw to allow handling in the child component
    }
  };

  const handleUpdateExpense = async (updatedExpense) => {
    try {
      // Ensure we have the userId
      const expenseToUpdate = {
        ...updatedExpense,
        userId: updatedExpense.userId || currentUser.uid,
      };

      // Get the document ID
      const { id } = expenseToUpdate;

      // For initial sample expenses with numeric IDs, just update the local state
      if (typeof id === "number" || !isNaN(Number(id))) {
        // Update local state only for sample data
        setExpenses(
          expenses.map((expense) =>
            expense.id === id ? expenseToUpdate : expense
          )
        );
        console.log("Sample expense updated successfully:", updatedExpense);
        return true; // Return success
      }

      // For Firestore expenses with string IDs
      if (typeof id === "string") {
        // Create a clean data object for Firestore update
        // Remove id from the data to be updated
        const { id: _, ...expenseData } = expenseToUpdate;

        // Create a document reference
        const expenseDocRef = doc(db, "expenses", id);

        // Update in Firestore
        await updateDoc(expenseDocRef, expenseData);

        // Update local state
        setExpenses(
          expenses.map((expense) =>
            expense.id === id ? expenseToUpdate : expense
          )
        );

        console.log("Expense updated successfully:", updatedExpense);
        return true; // Return success
      }

      throw new Error("Invalid ID format");
    } catch (error) {
      console.error("Error updating expense:", error);
      throw error; // Re-throw to allow handling in the child component
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      // Check if the expense exists
      const expenseExists = expenses.some((expense) => expense.id === id);
      if (!expenseExists) {
        throw new Error("Expense not found");
      }

      // For initial sample expenses with numeric IDs, just update the local state
      if (typeof id === "number" || !isNaN(Number(id))) {
        // Update local state only for sample data
        setExpenses(expenses.filter((expense) => expense.id !== id));
        console.log("Sample expense deleted successfully:", id);
        return true; // Return success
      }

      // For Firestore expenses with string IDs
      if (typeof id === "string") {
        // Create a document reference
        const expenseDocRef = doc(db, "expenses", id);

        // Delete from Firestore
        await deleteDoc(expenseDocRef);

        // Update local state
        setExpenses(expenses.filter((expense) => expense.id !== id));

        console.log("Expense deleted successfully:", id);
        return true; // Return success
      }

      throw new Error("Invalid ID format");
    } catch (error) {
      console.error("Error deleting expense:", error);
      throw error; // Re-throw to allow handling in the child component
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
        <header className="bg-white rounded-lg border border-gray-100 shadow-sm p-3 sm:p-4 mb-3 sm:mb-4 animate-slideInLeft">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl sm:text-3xl font-bold font-outfit animate-fadeIn">
              Expense Tracker
            </h1>

            <div className="relative animate-fadeIn animation-delay-200">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center px-4 py-2 text-base sm:text-lg font-medium bg-black text-white rounded-full shadow-sm border border-gray-800 hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 font-outfit tracking-wide hover:scale-105 transition-transform"
              >
                <FaUserCircle className="mr-2 text-lg sm:text-xl" />
                {currentUser.displayName}
                <FaChevronDown className="ml-2 text-sm" />
              </button>
              {showDropdown && (
                <div
                  ref={dropdownRef}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-100 animate-scaleIn"
                >
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-outfit"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

            <div className="mt-3 sm:mt-0 flex flex-row sm:flex-row gap-2 sm:gap-3 animate-fadeIn animation-delay-300">
              <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-2 sm:p-3 flex items-center flex-1 sm:flex-auto hover:shadow-md transition-shadow duration-300">
                <span className="text-xl sm:text-2xl mr-2">₹</span>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Total:
                  </p>
                  <p className="text-base sm:text-lg font-semibold">
                    {expenses
                      .reduce((sum, expense) => sum + expense.amount, 0)
                      .toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-2 sm:p-3 flex items-center flex-1 sm:flex-auto hover:shadow-md transition-shadow duration-300">
                <span className="text-xl sm:text-2xl mr-2">📊</span>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Expenses:
                  </p>
                  <p className="text-base sm:text-lg font-semibold">
                    {expenses.length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
          <div className="lg:col-span-1 animate-slideInLeft animation-delay-100">
            <ExpenseForm onAddExpense={handleAddExpense} />
          </div>
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              <div className="animate-slideInRight animation-delay-300">
                <ExpenseAnalysis expenses={expenses} />
              </div>
              <div className="animate-slideInLeft animation-delay-200">
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
