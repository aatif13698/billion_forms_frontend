// import React, { useState, Fragment, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import Icons from "../SideBar/Icons";
// import useDarkmode from "../../Hooks/useDarkMode";
// import { AiOutlineDashboard } from "react-icons/ai";
// import { FaRegBuilding } from "react-icons/fa";
// import { FaUsersViewfinder } from "react-icons/fa6";
// import { FaUserPlus } from "react-icons/fa";
// import { FaUserCheck } from "react-icons/fa";
// import { FaUser } from "react-icons/fa";
// import { useSelector } from "react-redux";
// import { PiPaperPlaneTiltFill } from "react-icons/pi";
// import { FaArrowUpFromBracket } from "react-icons/fa6";
// import { MdOutlineSubscriptions } from "react-icons/md";


// const BottomTab = ({ show, noFade }) => {
//   const location = useLocation(); // Get current route

//   const { clientUser } = useSelector((state) => state.authCustomerSlice);
//   const [menuItems, setMenuItems] = useState([]);

//   const [isDark] = useDarkmode();
//   const navigate = useNavigate();
//   const [activeLink, setActiveLink] = useState(1);

//   function handleNavigateToMenu(item) {
//     setActiveLink(item.id);
//     navigate(`${item.link}`);
//   }

//   useEffect(() => {
//     if (location.pathname == "/cart") {
//       setActiveLink(3);
//     } else if (location.pathname == "/categories") {
//       setActiveLink(2);
//     } else if (location.pathname == "/account") {
//       setActiveLink(4);
//     } else {
//       setActiveLink(1);
//     }
//   }, [location]);

//   useEffect(() => {
//     if (clientUser?.role?.id === 1) {
//       setMenuItems([
//         { title: "Dashboard", icon: AiOutlineDashboard, link: "/dashboard" },
//         { title: "Organisation", icon: FaRegBuilding, link: "/list/organization" },
//         { title: "User", icon: FaUser, link: "/user" },
//         { title: "Requests", icon: FaUserPlus, link: "/requests" },
//         { title: "Clients", icon: FaUserCheck, link: "/list/clients" },
//         // { title: "Companies", icon: FaUsersViewfinder, link: "/list/company" },
//         // { title: "Subscription", icon: PiPaperPlaneTiltFill, link: "/list/subscription" },
//         // { title: "Topup", icon: FaArrowUpFromBracket, link: "/list/topup" },
//         // { title: "subscribed", icon: MdOutlineSubscriptions, link: "/list/subscribed" },
//       ]);
//     } else if (clientUser?.role?.id === 2) {
//       setMenuItems([
//         { title: "Dashboard", icon: AiOutlineDashboard, link: "/dashboard" },
//         { title: "Organisation", icon: FaRegBuilding, link: "/list/organization" },
//         { title: "User", icon: FaUser, link: "/user" },
//       ]);
//     }
//   }, [clientUser]);

//   return (
//     <div
//       className={`w-full h-16 fixed bottom-0 left-0 border-t-2 transition-transform duration-300  z-50 ${isDark ? " border-blue-gray-800" : " border-slate-400"
//         } ${show ? "translate-y-0" : "translate-y-full"}
//          bg-custom-gradient-bottom-light
//       `}
//     >
//       <ul className="flex  h-[100%] justify-around items-center">
//         {menuItems.map((item) => (
//           <li
//             key={item.id}
//             className="nav-item px-3 flex justify-center rounded-md hover:bg-slate-200 transition duration-500"
//           >
//             <button
//               onClick={() => handleNavigateToMenu(item)}
//               className="flex items-center justify-center gap-3"
//             >
//               <span className="menu-icon flex flex-col justify-center items-center gap-1">
//                 <Icons
//                   icon={item?.icon}
//                   color="#ffffff"
//                   size={14}
//                   className="my-icon"
//                 />
//                 <span
//                   className={`${activeLink === item.id
//                     ? "text-blue-600 font-semibold"
//                     : "text-white"
//                     } mb-2 text-[.45rem]`}
//                 >
//                   {item.title}
//                 </span>
//               </span>
//             </button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default BottomTab;



// new bottomTab

import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { BiDotsHorizontalRounded } from 'react-icons/bi';
import Icons from '../SideBar/Icons';
import useDarkmode from '../../Hooks/useDarkMode';
import { generateMenuItems, additionalActiveRoutes } from '../GenerateMenuItem/GenerateMenuItem';

const BottomTab = ({ show, toggleMobileSidebar }) => {
  console.log("show", show);

  const { clientUser } = useSelector((state) => state.authCustomerSlice);
  const { capability } = useSelector((state) => state.capabilitySlice);
  const [isDark] = useDarkmode();
  const navigate = useNavigate();
  const location = useLocation();

  // Generate menu items with memoization
  const menuItems = useMemo(
    () => generateMenuItems(capability, clientUser?.role?.id),
    [capability, clientUser?.role?.id]
  );

  console.log("menuItems", menuItems);


  // Limit to 4 dynamic items + "More"
  const displayedItems = menuItems.slice(0, 4).concat({
    id: 'more',
    title: 'More',
    icon: BiDotsHorizontalRounded,
    link: '/more',

  });

  console.log("displayedItems", displayedItems);


  const handleNavigateToMenu = (item) => {
    navigate(item.link);
  };

  return (
    <div
      className={`fixed bottom-0 left-0 w-[100%] h-16 border-t-2 transition-transform duration-300 z-50 border-slate-400 bg-custom-gradient-bottom-light ${show ? 'translate-y-0' : 'translate-y-full'}`}
      role="navigation"
      aria-label="Bottom navigation"
    >

      <ul className="flex  justify-around items-center">
        {displayedItems.map((item) => {
          const isActive = additionalActiveRoutes[item.link]?.some((route) =>
            location.pathname.startsWith(route)
          ) || location.pathname === item.link;

          return (
            <li
              key={item.id}
              className={`flex justify-center px-2 py-2 rounded-md transition duration-300 `}
            >
              <button
                onClick={() => {
                  if (item?.title == "More") {
                    toggleMobileSidebar()
                  } else {
                    handleNavigateToMenu(item)
                  }
                }}
                className="flex flex-col items-center justify-center gap-1"
                aria-label={`Navigate to ${item.title}`}
              >

                <span className="menu-icon ">
                  <Icons
                    icon={item.icon}
                    color={isActive ? '#3b82f6' : '#ffffff'} // Blue for active, white for inactive
                    size={20}
                    className="my-icon"
                  />
                </span>
                <span
                  className={`text-[0.65rem] ${isActive ? 'text-blue-600 ' : 'text-white'}`}
                >
                  {item.title}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default BottomTab;