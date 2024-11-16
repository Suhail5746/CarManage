import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("token");

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-blue-600 text-white py-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center px-4">
          <h1 className="text-2xl font-bold">
            <Link to="/">Car Manager</Link>
          </h1>
          <div className="space-x-4">
            <Link to="/" className="hover:underline font-medium">
              Home
            </Link>
            <Link to="/products" className="hover:underline font-medium">
              Cars
            </Link>
            {isLoggedIn ? (
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  navigate("/login");
                }}
                className="bg-red-500 px-4 py-2 rounded-lg shadow-md text-white font-medium hover:bg-red-600 transition"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="bg-blue-500 px-4 py-2 rounded-lg shadow-md text-white font-medium hover:bg-blue-700 transition"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="bg-green-500 px-4 py-2 rounded-lg shadow-md text-white font-medium hover:bg-green-700 transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow bg-gray-50 flex items-center justify-center">
        <div className="text-center px-6 py-8 bg-white shadow-lg rounded-lg max-w-lg w-full">
          <h2 className="text-4xl font-extrabold text-gray-800 mb-4">
            Welcome to Car Manager
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Effortlessly manage your car collection with a powerful and intuitive interface.
          </p>
          <div className="space-x-4">
            <Link
              to="/products"
              className="bg-blue-600 px-6 py-3 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition"
            >
              Explore Cars
            </Link>
            {isLoggedIn && (
              <Link
                to="/products/create"
                className="bg-orange-600 px-6 py-3 text-white font-medium rounded-lg shadow-md hover:bg-orange-700 transition"
              >
                Add Car Details
              </Link>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-6">
        <div className="container mx-auto px-4 text-center">
          <p>© 2024 Car Manager. All rights reserved.</p>
          <p>
            Designed with ❤️ by <span className="font-bold">Your Team</span>.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
