import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const { signup, login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password, name);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* App Title/Logo in top left corner */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 animate-fadeIn">
        <h1 className="text-2xl sm:text-3xl font-bold font-outfit">
          Expense Tracker
        </h1>
      </div>

      {/* Login/Signup Card */}
      <div className="flex-grow flex items-center justify-center">
        <Card className="max-w-md w-full space-y-8 animate-slideUpFade shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-3xl font-bold animate-fadeIn">
              {isLogin ? "Login" : "Sign Up"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div className="animate-slideUpFade">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Name
                  </label>
                  <Input
                    id="name"
                    type="text"
                    required={!isLogin}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1"
                  />
                </div>
              )}
              <div className="animate-slideUpFade animation-delay-100">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="animate-slideUpFade animation-delay-200">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1"
                />
              </div>
              {error && (
                <div className="text-red-500 text-sm mt-2 animate-pulse">
                  {error}
                </div>
              )}
              <Button
                type="submit"
                className="w-full animate-fadeIn animation-delay-300 hover:scale-105 transition-transform duration-200"
              >
                {isLogin ? "Login" : "Sign Up"}
              </Button>
            </form>
            <div className="mt-4 text-center animate-fadeIn animation-delay-400">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-blue-600 hover:text-blue-800 hover:scale-105 transition-all duration-200"
              >
                {isLogin
                  ? "Don't have an account? Sign up"
                  : "Already have an account? Login"}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
