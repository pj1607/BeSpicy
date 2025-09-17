import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Home, Mail } from "lucide-react";

const menuItems = [
  { name: "Home", href: "/", Icon: Home },
  { name: "Contact", href: "/contact", Icon: Mail },
];

const Logo = () => (
  <Link to="/" aria-label="BeSpicy home" className="flex items-center gap-3">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 text-white/90"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path d="M10 3a1 1 0 011 1v1a1 1 0 11-2 0V4a1 1 0 011-1zM4.22 5.47a1 1 0 011.415 0l.707.707a1 1 0 11-1.414 1.414l-.708-.707a1 1 0 010-1.414zM3 10a1 1 0 011-1h1a1 1 0 110 2H4a1 1 0 01-1-1zM5.636 14.95a1 1 0 000 1.414l.707.707a1 1 0 101.414-1.414l-.707-.707a1 1 0 00-1.414 0zM10 15a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM14.364 14.95a1 1 0 011.414 0l.707.707a1 1 0 11-1.414 1.414l-.707-.707a1 1 0 010-1.414zM16 10a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zM14.364 5.05a1 1 0 010 1.414l-.707.707A1 1 0 0112.243 6.34l.707-.707a1 1 0 011.414 0z" />
    </svg>

    <div className="leading-4">
      <div className="font-extrabold text-white text-lg tracking-wide">
        BeSpicy
      </div>
      <div className="text-xs text-white/70 -mt-0.5">Cook. Eat. Enjoy.</div>
    </div>
  </Link>
);

const NavBar = () => {
  const [isBottomMenuOpen, setBottomMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isBottomMenuOpen ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [isBottomMenuOpen]);

  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-8 left-1/2 transform -translate-x-1/2 w-[95%] max-w-6xl z-50">
        {/* SVG Background Dots */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <pattern
            id="diagonalDots"
            patternUnits="userSpaceOnUse"
            width="7"
            height="7"
            patternTransform="rotate(45)"
          >
            <circle cx="0" cy="0" r="2" fill="#f97316" opacity="0.15" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#diagonalDots)" />
        </svg>

        {/* Navbar Content */}
        <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-[#1e1e1e] border border-white/10 shadow-md">
          {/* Logo */}
          <Logo />

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-3">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/6 transition-all text-white/95 font-medium"
              >
                <item.Icon size={16} />
                <span className="text-sm">{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Menu Button & Bottom Sheet */}
      <div className="md:hidden">
        <button
          onClick={() => setBottomMenuOpen((prev) => !prev)}
          aria-label={isBottomMenuOpen ? "close menu" : "open menu"}
          className="fixed right-6 bottom-6 z-[60] bg-[#1e1e1e]  p-3 rounded-2xl shadow-2xl text-white flex items-center justify-center"
        >
          {isBottomMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

      {/* Mobile Bottom Sheet */}
<AnimatePresence>
  {isBottomMenuOpen && (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 bg-black/40"
        onClick={() => setBottomMenuOpen(false)}
        aria-hidden
      />

      {/* Bottom Sheet */}
      <motion.div
        initial={{ y: "100vh" }}
        animate={{ y: 0 }}
        exit={{ y: "100vh" }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        className="fixed left-4 right-4 bottom-0 z-50 p-5 bg-white/95 md rounded-t-3xl shadow-2xl"
      >
        <div className="grid grid-cols-1 gap-4">
          {menuItems.map((it) => (
            <Link
              key={it.name}
              to={it.href}
              onClick={() => setBottomMenuOpen(false)}
              className="flex items-center gap-4 p-4 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all shadow-sm"
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-black/80 text-white">
                <it.Icon size={20} />
              </div>
              <div>
                <div className="text-base font-semibold text-gray-900">
                  {it.name}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </motion.div>
    </>
  )}
</AnimatePresence>

      </div>
    </>
  );
};

export default NavBar;
