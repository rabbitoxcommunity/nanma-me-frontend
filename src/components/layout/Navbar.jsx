import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiPhone } from "react-icons/fi";
import Logo from "../ui/Logo";

const links = [
  { to: "/", label: "Home" },
  { to: "/projects", label: "Projects" },
  { to: "/about", label: "About Us" },
  { to: "/gallery", label: "Gallery" },
  { to: "/contact", label: "Contact Us" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    fn();
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    setOpen(false);
    window.scrollTo({ top: 0 });
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  const dark = isHome && !scrolled;

  return (
    <>
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 inset-x-0 z-40 transition-all duration-500 ${
          scrolled
            ? "bg-bone/85 backdrop-blur-xl border-b border-line"
            : "bg-transparent"
        }`}
      >
        <div className="container-x">
          <div className="flex items-center justify-between h-20">
            <Link
              to="/"
              data-cursor="hover"
              aria-label="Nanma by Meeran — Home"
              className={`transition-colors ${dark ? "text-bone" : "text-graphite"}`}
            >
              <Logo showTagline />
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  data-cursor="hover"
                  className={({ isActive }) =>
                    `relative px-4 py-2 text-sm transition-colors duration-300 ${
                      isActive
                        ? dark ? "text-bone" : "text-graphite"
                        : dark ? "text-bone/70 hover:text-bone" : "text-smoke hover:text-graphite"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {link.label}
                      {isActive && (
                        <motion.span
                          layoutId="nav-indicator"
                          className="absolute -bottom-0.5 left-3 right-3 h-px bg-terracotta"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <a href="tel:+919999999999" data-cursor="hover" className={`hidden md:inline-flex items-center gap-2 text-sm transition-colors ${dark ? "text-bone/80 hover:text-bone" : "text-smoke hover:text-graphite"}`}>
                <FiPhone className="w-4 h-4" />
                <span className="hidden xl:inline">+91 99999 99999</span>
              </a>

              <Link
                to="/contact"
                data-cursor="hover"
                className={`hidden md:inline-flex items-center gap-2 px-5 py-2.5 text-xs rounded-full transition-all duration-500 ease-out-expo hover:gap-3 ${
                  dark ? "bg-bone text-graphite hover:bg-terracotta hover:text-bone" : "bg-ink text-bone hover:bg-terracotta"
                }`}
              >
                Enquire <span aria-hidden>→</span>
              </Link>

              <button
                onClick={() => setOpen(!open)}
                data-cursor="hover"
                className="lg:hidden w-11 h-11 flex flex-col items-center justify-center gap-[5px]"
                aria-label="Toggle menu"
              >
                <motion.span animate={open ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }} className={`block w-5 h-px origin-center ${dark ? "bg-bone" : "bg-ink"}`} />
                <motion.span animate={open ? { opacity: 0 } : { opacity: 1 }} className={`block w-5 h-px ${dark ? "bg-bone" : "bg-ink"}`} />
                <motion.span animate={open ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }} className={`block w-5 h-px origin-center ${dark ? "bg-bone" : "bg-ink"}`} />
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-30 bg-bone flex flex-col"
          >
            <div className="flex-1 container-x flex flex-col justify-center gap-2 pt-20">
              {links.map((link, i) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.06, duration: 0.5 }}
                  className="overflow-hidden"
                >
                  <Link to={link.to} className="font-display text-5xl xs:text-6xl font-light text-graphite hover:text-terracotta transition-colors duration-300 flex items-baseline gap-3 py-2">
                    <span className="number-tag text-base">0{i + 1}</span>
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="container-x py-8 flex justify-between items-end border-t border-line text-xs text-smoke uppercase tracking-widest"
            >
              <span>Mumbai · Bangalore · Delhi</span>
              <a href="tel:+919999999999">+91 99999 99999</a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
