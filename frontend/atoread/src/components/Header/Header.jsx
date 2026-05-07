import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import AvatarDropdown from "../User/AvatarDropDown";
import ThemeToggle from "../Buttons/ThemeToggle";
import { Bell } from "lucide-react";
import { NotificationDropdown } from "../index";
const Header = () => {
  const { user, logout } = useAuth();
  
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const navLinks = [
    {label: "Dashboard", path:"/dashboard", isLoggedIn: true},
    { label: "Home", path: "/" ,isLoggedIn: false},
    { label: "About", path: "/about", isLoggedIn: false },
    { label: "Blogs", path: "/blogs", isLoggedIn: false },
  ];


  const isActive = (path) => location.pathname === path;

  return (
    <header className="fixed top-0 z-50 w-full dark:bg-[#0a0a0a]/40 bg-white/40 backdrop-blur-lg">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between relative">

        {/* LEFT — Logo */}
        <Link to="/" className="flex items-center gap-2.5 no-underline flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gray-900 text-white flex items-center justify-center text-sm font-bold font-serif">
            N
          </div>
          <span className="text-lg font-bold dark:text-white text-gray-900 tracking-tight">
            Nexus
          </span>
        </Link>

        {/* CENTER — Nav Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-3 absolute left-1/2 -translate-x-1/2">
          {navLinks.filter(link => !user ? !link.isLoggedIn : true).map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${isActive(link.path)
                  ? "text-white bg-black"
                  : "text-[#0a0a0a] dark:text-white/50 hover:text-white hover:bg-black"
                }`}
                >
              {isActive(link.path) && (
                <span className="w-1 h-1 rounded-full bg-amber-400 mt-1" />
              )}
              {link.label}
            </Link>
          ))}
        </nav>

        {/* RIGHT — Auth Buttons (Desktop) */}
        <div className="hidden md:flex items-center gap-2.5 flex-shrink-0">
          {user ? (
            <div className="flex items-center gap-x-5">
              <AvatarDropdown handleLogout={handleLogout} user={user} />
              <NotificationDropdown />
            </div>
            
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-gray-800 bg-white border border-gray-200 rounded-lg hover:bg-transparent hover:text-white transition-all duration-200 no-underline"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-700 transition-all duration-200 no-underline"
              >
                Sign Up
              </Link>
            </>
          )}
          <ThemeToggle />
        </div>

        {/* Mobile — Hamburger Button */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-1.5 bg-transparent border-none cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className={`block w-5 h-0.5 bg-gray-900 rounded transition-all duration-200
              ${menuOpen ? "translate-y-2 rotate-45" : ""}`}
          />
          <span
            className={`block w-5 h-0.5 bg-gray-900 rounded transition-all duration-200
              ${menuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block w-5 h-0.5 bg-gray-900 rounded transition-all duration-200
              ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`}
          />
        </button>

      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden flex flex-col px-6 pb-5 pt-2 border-t border-gray-100 bg-white gap-1">
          {navLinks.filter(link => !user ? !link.isLoggedIn : true).map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              className={`px-3 py-2.5 rounded-lg text-sm font-medium no-underline transition-all duration-200
                ${isActive(link.path)
                  ? "text-gray-900 bg-gray-100"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                }`}
            >
              {link.label}
            </Link>
          ))}

          <div className="h-px bg-gray-100 my-2" />

          {user ? (
            <>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 no-underline transition-all duration-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 no-underline transition-all duration-200"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                onClick={() => setMenuOpen(false)}
                className="px-3 py-2.5 rounded-lg text-sm font-medium text-white bg-gray-900 hover:bg-gray-700 no-underline text-center transition-all duration-200 mt-1"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;