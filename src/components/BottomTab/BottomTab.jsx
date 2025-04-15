import React, { useState, Fragment, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Icons from "../SideBar/Icons";
import useDarkmode from "../../Hooks/useDarkMode";
import { AiOutlineDashboard } from "react-icons/ai";
import { FaRegBuilding } from "react-icons/fa";
import { FaUsersViewfinder } from "react-icons/fa6";
import { FaUserPlus } from "react-icons/fa";
import { FaUserCheck } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { useSelector } from "react-redux";
import { PiPaperPlaneTiltFill } from "react-icons/pi";
import { FaArrowUpFromBracket } from "react-icons/fa6";
import { MdOutlineSubscriptions } from "react-icons/md";


const BottomTab = ({ show, noFade }) => {
  const location = useLocation(); // Get current route

  const { clientUser } = useSelector((state) => state.authCustomerSlice);
  const [menuItems, setMenuItems] = useState([]);

  const [isDark] = useDarkmode();
  const navigate = useNavigate();
  const [activeLink, setActiveLink] = useState(1);

  function handleNavigateToMenu(item) {
    setActiveLink(item.id);
    navigate(`${item.link}`);
  }

  useEffect(() => {
    if (location.pathname == "/cart") {
      setActiveLink(3);
    } else if (location.pathname == "/categories") {
      setActiveLink(2);
    } else if (location.pathname == "/account") {
      setActiveLink(4);
    } else {
      setActiveLink(1);
    }
  }, [location]);

  useEffect(() => {
    if (clientUser?.role?.id === 1) {
      setMenuItems([
        { title: "Dashboard", icon: AiOutlineDashboard, link: "/dashboard" },
        { title: "Organisation", icon: FaRegBuilding, link: "/organisation" },
        { title: "User", icon: FaUser, link: "/user" },
        { title: "Requests", icon: FaUserPlus, link: "/requests" },
        { title: "Clients", icon: FaUserCheck, link: "/list/clients" },
        // { title: "Companies", icon: FaUsersViewfinder, link: "/list/company" },
        // { title: "Subscription", icon: PiPaperPlaneTiltFill, link: "/list/subscription" },
        // { title: "Topup", icon: FaArrowUpFromBracket, link: "/list/topup" },
        // { title: "subscribed", icon: MdOutlineSubscriptions, link: "/list/subscribed" },
      ]);
    } else if (clientUser?.role?.id === 2) {
      setMenuItems([
        { title: "Dashboard", icon: AiOutlineDashboard, link: "/dashboard" },
        { title: "Organisation", icon: FaRegBuilding, link: "/organisation" },
        { title: "User", icon: FaUser, link: "/user" },
      ]);
    }
  }, [clientUser]);

  return (
    <div
      className={`w-full h-16 fixed bottom-0 left-0 border-t-2 transition-transform duration-300  z-50 ${isDark ? " border-blue-gray-800" : " border-slate-400"
        } ${show ? "translate-y-0" : "translate-y-full"}
         bg-custom-gradient-bottom-light
      `}
    >
      <ul className="flex  h-[100%] justify-around items-center">
        {menuItems.map((item) => (
          <li
            key={item.id}
            className="nav-item px-3 flex justify-center rounded-md hover:bg-slate-200 transition duration-500"
          >
            <button
              onClick={() => handleNavigateToMenu(item)}
              className="flex items-center justify-center gap-3"
            >
              <span className="menu-icon flex flex-col justify-center items-center gap-1">
                <Icons
                  icon={item?.icon}
                  color="#ffffff"
                  size={14}
                  className="my-icon"
                />
                <span
                  className={`${activeLink === item.id
                    ? "text-blue-600 font-semibold"
                    : "text-white"
                    } mb-2 text-[.45rem]`}
                >
                  {item.title}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BottomTab;



// import React, { useState, useEffect, useMemo } from "react";
// import PropTypes from "prop-types";
// import { useLocation, useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { AiOutlineDashboard } from "react-icons/ai";
// import { FaRegBuilding, FaUser, FaUserPlus, FaUserCheck } from "react-icons/fa";
// import { PiPaperPlaneTiltFill } from "react-icons/pi";
// import { MdOutlineSubscriptions } from "react-icons/md";
// import { FaArrowUpFromBracket } from "react-icons/fa6";
// import { FaUsersViewfinder } from "react-icons/fa6";

// import useDarkmode from "../../Hooks/useDarkMode";
// import Icons from "../SideBar/Icons";

// const BottomTab = ({ show }) => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { clientUser } = useSelector((state) => state.authCustomerSlice);
//   const [isDark] = useDarkmode();

//   const [menuItems, setMenuItems] = useState([]);
//   const [activeLink, setActiveLink] = useState(() => {
//     // Initialize from localStorage or default to 1
//     return parseInt(localStorage.getItem("activeLink")) || 1;
//   });

//   // Define menu items based on role
//   const getMenuItems = useMemo(() => {
//     if (!clientUser?.role?.id) return [];

//     const baseItems = [
//       { id: 1, title: "Dashboard", icon: AiOutlineDashboard, link: "/dashboard" },
//       { id: 2, title: "Organisation", icon: FaRegBuilding, link: "/organisation" },
//       { id: 3, title: "User", icon: FaUser, link: "/user" },
//     ];

//     if (clientUser.role.id === 1) {
//       return [
//         ...baseItems,
//         { id: 4, title: "Requests", icon: FaUserPlus, link: "/requests" },
//         { id: 5, title: "Clients", icon: FaUserCheck, link: "/list/clients" },
//         { id: 6, title: "Companies", icon: FaUsersViewfinder, link: "/list/company" },
//         { id: 7, title: "Subscription", icon: PiPaperPlaneTiltFill, link: "/list/subscription" },
//         { id: 8, title: "Topup", icon: FaArrowUpFromBracket, link: "/list/topup" },
//         { id: 9, title: "Subscribed", icon: MdOutlineSubscriptions, link: "/list/subscribed" },
//       ];
//     }
//     return baseItems;
//   }, [clientUser]);

//   // Update menu items when clientUser changes
//   useEffect(() => {
//     setMenuItems(getMenuItems);
//   }, [getMenuItems]);

//   // Sync active link with location and persist to localStorage
//   useEffect(() => {
//     const pathToIdMap = {
//       "/dashboard": 1,
//       "/organisation": 2,
//       "/user": 3,
//       "/requests": 4,
//       "/list/clients": 5,
//       "/list/company": 6,
//       "/list/subscription": 7,
//       "/list/topup": 8,
//       "/list/subscribed": 9,
//     };

//     const newActiveId = pathToIdMap[location.pathname] || 1;
//     setActiveLink(newActiveId);
//     localStorage.setItem("activeLink", newActiveId);
//   }, [location.pathname]);

//   const handleNavigateToMenu = (item) => {
//     setActiveLink(item.id);
//     localStorage.setItem("activeLink", item.id);
//     navigate(item.link);
//   };

//   return (
//     <div
//       className={`fixed bottom-0 left-0 w-full h-16 border-t-2 transition-transform duration-300 z-50 bg-gradient-to-r from-blue-500 to-indigo-600 ${
//         isDark ? "border-blue-gray-800" : "border-slate-400"
//       } ${show ? "translate-y-0" : "translate-y-full"}`}
//     >
//       <ul className="flex h-full justify-around items-center">
//         {menuItems.length > 0 ? (
//           menuItems.map((item) => (
//             <li
//               key={item.id}
//               className="flex justify-center px-3 rounded-md hover:bg-slate-200/30 transition duration-300"
//             >
//               <button
//                 onClick={() => handleNavigateToMenu(item)}
//                 className="flex flex-col items-center justify-center gap-1"
//                 aria-label={`Navigate to ${item.title}`}
//               >
//                 <Icons
//                   icon={item.icon}
//                   color="#ffffff"
//                   size={14}
//                   className="my-icon"
//                 />
//                 <span
//                   className={`text-[0.55rem] ${
//                     activeLink === item.id ? "text-blue-200 font-semibold" : "text-white"
//                   }`}
//                 >
//                   {item.title}
//                 </span>
//               </button>
//             </li>
//           ))
//         ) : (
//           <li className="text-white text-sm">No menu items available</li>
//         )}
//       </ul>
//     </div>
//   );
// };

// BottomTab.propTypes = {
//   show: PropTypes.bool.isRequired,
// };

// export default BottomTab;
