import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
  const [isMenuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [isMenuOpen]);

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

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="fixed right-6 bottom-6 z-60 bg-[#1e1e1e] p-3 rounded-2xl shadow-2xl text-white flex items-center justify-center transition-all hover:scale-105"
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* Backdrop */}
        <div
          className={`fixed inset-0 bg-black/40 z-50 transition-opacity ${
            isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setMenuOpen(false)}
        ></div>

        {/* Bottom Sheet */}
        <div
          className={`fixed left-4 right-4 bottom-4 z-50 p-4 bg-[#1e1e1e] rounded-t-3xl shadow-xl max-h-[70vh] overflow-y-auto transform transition-transform duration-300 ${
            isMenuOpen ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <div className="flex flex-col gap-3">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl border border-white/20 hover:border-white/50 transition-all"
              >
                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/10 text-white">
                  <item.Icon size={20} />
                </div>
                <div>
                  <div className="text-base font-medium text-white/90">{item.name}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default NavBar;
