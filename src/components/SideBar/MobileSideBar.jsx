import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MobileSideBar = ({ isOpen, onClose }) => {
  const sidebarRef = useRef(null);

  // Handle clicks outside sidebar to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  // Sidebar animation variants
  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    closed: {
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={sidebarRef}
          className="fixed top-0 left-0 h-[100%] w-[80%] max-w-[300px] bg-white dark:bg-cardBgDark shadow-2xl z-[9999] md:hidden"
          initial="closed"
          animate="open"
          exit="closed"
          variants={sidebarVariants}
        >
          <div className="flex flex-col h-[100%]">
            {/* Sidebar Header */}
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold text-textLight dark:text-textDark ">Menu</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full text-textLight dark:text-textDark hover:bg-textLight/25 "
                aria-label="Close sidebar"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Sidebar Content */}
            <nav className="flex-1 p-4 tex-">
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="block p-3 rounded-lg text-textLight dark:text-textDark hover:bg-textLight/25 transition-colors"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block p-3 rounded-lg text-textLight dark:text-textDark hover:bg-textLight/25 transition-colors"
                  >
                    Profile
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block p-3 rounded-lg text-textLight dark:text-textDark hover:bg-textLight/25 transition-colors"
                  >
                    Settings
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block p-3 rounded-lg text-textLight dark:text-textDark hover:bg-textLight/25 transition-colors"
                  >
                    Logout
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileSideBar;