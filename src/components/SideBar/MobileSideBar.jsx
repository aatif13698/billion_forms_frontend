// import React, { useEffect, useRef } from "react";
// import { motion, AnimatePresence } from "framer-motion";

// const MobileSideBar = ({ isOpen, onClose }) => {
//   const sidebarRef = useRef(null);

//   // Handle clicks outside sidebar to close
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
//         onClose();
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [onClose]);

//   // Sidebar animation variants
//   const sidebarVariants = {
//     open: {
//       x: 0,
//       transition: {
//         type: "spring",
//         stiffness: 300,
//         damping: 30,
//       },
//     },
//     closed: {
//       x: "-100%",
//       transition: {
//         type: "spring",
//         stiffness: 300,
//         damping: 30,
//       },
//     },
//   };

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <motion.div
//           ref={sidebarRef}
//           className="fixed top-0 left-0 h-[100%] w-[80%] max-w-[300px] bg-white dark:bg-cardBgDark shadow-2xl z-[9999] md:hidden"
//           initial="closed"
//           animate="open"
//           exit="closed"
//           variants={sidebarVariants}
//         >
//           <div className="flex flex-col h-[100%]">
//             {/* Sidebar Header */}
//             <div className="p-4 border-b flex justify-between items-center">
//               <h2 className="text-lg font-semibold text-textLight dark:text-textDark ">Menu</h2>
//               <button
//                 onClick={onClose}
//                 className="p-2 rounded-full text-textLight dark:text-textDark hover:bg-textLight/25 "
//                 aria-label="Close sidebar"
//               >
//                 <svg
//                   className="w-6 h-6"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M6 18L18 6M6 6l12 12"
//                   />
//                 </svg>
//               </button>
//             </div>

//             {/* Sidebar Content */}
//             <nav className="flex-1 p-4 tex-">
//               <ul className="space-y-2">
//                 <li>
//                   <a
//                     href="#"
//                     className="block p-3 rounded-lg text-textLight dark:text-textDark hover:bg-textLight/25 transition-colors"
//                   >
//                     Home
//                   </a>
//                 </li>
//                 <li>
//                   <a
//                     href="#"
//                     className="block p-3 rounded-lg text-textLight dark:text-textDark hover:bg-textLight/25 transition-colors"
//                   >
//                     Profile
//                   </a>
//                 </li>
//                 <li>
//                   <a
//                     href="#"
//                     className="block p-3 rounded-lg text-textLight dark:text-textDark hover:bg-textLight/25 transition-colors"
//                   >
//                     Settings
//                   </a>
//                 </li>
//                 <li>
//                   <a
//                     href="#"
//                     className="block p-3 rounded-lg text-textLight dark:text-textDark hover:bg-textLight/25 transition-colors"
//                   >
//                     Logout
//                   </a>
//                 </li>
//               </ul>
//             </nav>
//           </div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// };

// export default MobileSideBar;


// new mobile sidebar

import React, { useEffect, useRef, useMemo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MdDarkMode } from "react-icons/md";
import { CiLight } from "react-icons/ci";
import { useSelector } from 'react-redux';
import useDarkmode from '../../Hooks/useDarkMode';
import Icons from './Icons';
import logo from '../../assets/logo/logo2.png';
import { generateMenuItems, additionalActiveRoutes } from '../GenerateMenuItem/GenerateMenuItem';

// Sidebar animation variants
const sidebarVariants = {
  open: {
    x: 0,
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  },
  closed: {
    x: '-100%',
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  },
};

// Backdrop animation variants
const backdropVariants = {
  open: { opacity: 0.5, transition: { duration: 0.3 } },
  closed: { opacity: 0, transition: { duration: 0.3 } },
};

const MobileSideBar = ({ isOpen, onClose }) => {
  const sidebarRef = useRef(null);
  const { clientUser } = useSelector((state) => state.authCustomerSlice);
  const { capability } = useSelector((state) => state.capabilitySlice);
  const [isDark, setDarkMode] = useDarkmode();
  const location = useLocation();

  // Generate menu items with memoization
  const menuItems = useMemo(
    () => generateMenuItems(capability, clientUser?.role?.id),
    [capability, clientUser?.role?.id]
  );

  // Handle clicks and touches outside sidebar to close
  useEffect(() => {
    const handleOutsideInteraction = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleOutsideInteraction);
    document.addEventListener('touchstart', handleOutsideInteraction);
    return () => {
      document.removeEventListener('mousedown', handleOutsideInteraction);
      document.removeEventListener('touchstart', handleOutsideInteraction);
    };
  }, [onClose]);

  const getNavItemClass = (isActive) =>
    `block p-3 rounded-lg transition-colors ${
      isActive ? 'bg-custom-gradient-sidebar text-white' : 'text-textLight dark:text-textDark'
    } hover:bg-custom-gradient-sidebar hover:text-white`;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black z-[9998] md:hidden"
            initial="closed"
            animate="open"
            exit="closed"
            variants={backdropVariants}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Sidebar */}
          <motion.div
            ref={sidebarRef}
            className="fixed top-0 left-0 h-full w-[80%] max-w-[300px] bg-white dark:bg-gray-900 shadow-2xl z-[9999] md:hidden "
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
            role="dialog"
            aria-label="Mobile navigation menu"
          >
            <div className="flex flex-col h-full">
              {/* Sidebar Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-textLight dark:text-textDark">Menu</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full text-textLight dark:text-textDark hover:bg-textLight/25"
                  aria-label="Close sidebar"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <nav className="flex-1 p-4 overflow-y-auto overflow-x-hidden">
                <ul className="space-y-2">
                  {menuItems.map((item) => {
                    const isActive =
                      additionalActiveRoutes[item.link]?.some((route) =>
                        location.pathname.startsWith(route)
                      ) || location.pathname === item.link;

                    return (
                      <li key={item.id}>
                        <NavLink
                          to={item.link}
                          className={getNavItemClass(isActive)}
                          onClick={onClose}
                          aria-label={`Navigate to ${item.title}`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="menu-icon">
                              <Icons
                                icon={item.icon}
                                color={isActive  ? '#ffffff'  : '#00768a'}
                                size={20}
                                className="my-icon"
                              />
                            </span>
                            <span className="text-sm">{item.title}</span>
                          </div>
                        </NavLink>
                      </li>
                    );
                  })}
                  {/* Dark Mode Toggle */}
                  <li>
                    <button
                      onClick={() => setDarkMode(!isDark)}
                      className="block p-3 rounded-lg text-textLight dark:text-textDark hover:bg-custom-gradient-sidebar hover:text-white transition-colors w-[100%] text-left"
                      aria-label={`Toggle ${isDark ? 'light' : 'dark'} mode`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="menu-icon">
                          {isDark ? <CiLight size={20} /> : <MdDarkMode size={20} />}
                        </span>
                        <span className="text-sm">{isDark ? 'Light' : 'Dark'} Mode</span>
                      </div>
                    </button>
                  </li>
                </ul>
              </nav>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileSideBar;