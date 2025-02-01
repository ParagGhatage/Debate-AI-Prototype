// Navbar.tsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  onClick?: () => void;
}

const NavLink: React.FC<NavLinkProps> = ({ to, children, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="text-white dark:text-gray-900 text-lg font-medium hover:text-neutral-400 dark:hover:text-red-600 transition duration-300"
  >
    {children}
  </Link>
);

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "shadow-lg" : ""
        }`}
      >
        <div className="bg-gray-900 dark:bg-white border-b border-gray-800 dark:border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              {/* Logo */}
              <div className="flex-shrink-0 flex items-center">
                <Link 
                  to="/" 
                  className="text-2xl font-bold text-white dark:text-gray-900"
                >
                  Debate AI
                </Link>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-8">
                <NavLink to="/">Home</NavLink>
                
                <Button 
                  className="bg-neutral-600 dark:bg-blue-600 hover:bg-neutral-700 dark:hover:bg-blue-700 text-white"
                >
                  Login
                </Button>
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden flex items-center">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="text-white dark:text-gray-900 hover:text-gray-300 dark:hover:text-gray-600 p-2"
                >
                  <span className="sr-only">Open menu</span>
                  {isOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden fixed inset-0 z-50 bg-gray-900 dark:bg-white transform transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="pt-16 pb-6 px-4 space-y-6">
            <NavLink to="/" onClick={() => setIsOpen(false)}>
              Home
            </NavLink>
            <NavLink to="/feature" onClick={() => setIsOpen(false)}>
              Feature
            </NavLink>
            <NavLink to="/about" onClick={() => setIsOpen(false)}>
              About
            </NavLink>
            <Button 
              className="w-full bg-neutral-600 dark:bg-blue-600 hover:bg-neutral-700 dark:hover:bg-blue-700 text-white"
              onClick={() => setIsOpen(false)}
            >
              Login
            </Button>
          </div>
        </div>
      </nav>
      
      {/* Overlay for mobile menu */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;