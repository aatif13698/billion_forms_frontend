// import React, { useEffect, useState } from "react";
// import { NavLink, useLocation } from "react-router-dom";
// import { MdDarkMode } from "react-icons/md";
// import { CiLight } from "react-icons/ci";
// import { AiOutlineDashboard } from "react-icons/ai";
// import { FaRegBuilding, FaUserCheck, FaUserPlus, FaUser } from "react-icons/fa";
// import { PiPaperPlaneTiltFill } from "react-icons/pi";
// import { FaArrowUpFromBracket } from "react-icons/fa6";
// import { MdOutlineSubscriptions } from "react-icons/md";
// import { FaUserTie } from "react-icons/fa";




// import { FaUsersViewfinder } from "react-icons/fa6";
// import Icons from "./Icons";
// import useWidth from "../../Hooks/useWidth";
// import useDarkmode from "../../Hooks/useDarkMode";
// import logo from "../../assets/logo/logo2.png";
// import { useSelector } from "react-redux";

// const NavMenu = ({ isCollapsed }) => {
//     const { width, breakpoints } = useWidth();
//     const [isDark, setDarkMode] = useDarkmode();
//     const { clientUser } = useSelector((state) => state.authCustomerSlice);
//     const capability = useSelector((state) => state?.capabilitySlice);

//     const [menuItems, setMenuItems] = useState([]);
//     const location = useLocation(); // to track current URL path

//     useEffect(() => {
//         if (clientUser?.role?.id === 1) {
//             setMenuItems([
//                 { title: "Dashboard", icon: AiOutlineDashboard, link: "/dashboard" },
//                 { title: "Organization", icon: FaRegBuilding, link: "/list/organization" },
//                 { title: "User", icon: FaUser, link: "/list/users" },
//                 { title: "Staff", icon: FaUserTie, link: "/list/staffs" },
//                 { title: "Requests", icon: FaUserPlus, link: "/requests" },
//                 { title: "Clients", icon: FaUserCheck, link: "/list/clients" },
//                 { title: "Companies", icon: FaUsersViewfinder, link: "/list/company" },
//                 { title: "Subscription", icon: PiPaperPlaneTiltFill, link: "/list/subscription" },
//                 { title: "Topup", icon: FaArrowUpFromBracket, link: "/list/topup" },
//                 { title: "subscribed", icon: MdOutlineSubscriptions, link: "/list/subscribed" },
//             ]);
//         } else if (clientUser?.role?.id === 2) {
//             setMenuItems([
//                 { title: "Dashboard", icon: AiOutlineDashboard, link: "/dashboard" },
//                 { title: "Organisation", icon: FaRegBuilding, link: "/list/organization" },
//                 { title: "User", icon: FaUser, link: "/list/users" },
//             ]);
//         } else if (clientUser?.role?.id === 3) {
//             setMenuItems([
//                 { title: "Dashboard", icon: AiOutlineDashboard, link: "/dashboard" },
//                 { title: "Organisation", icon: FaRegBuilding, link: "/list/organization" },
//                 // { title: "User", icon: FaUser, link: "/list/users" },
//             ]);
//         }
//     }, [clientUser]);

//     const getNavItemClass = (isActive) => {
//         return `nav-item my-2 w-[100%] rounded-md transition duration-500 
//             ${isActive ? "bg-custom-gradient-sidebar" : ""}
//             ${width < breakpoints.lg || isCollapsed ? "" : "px-2"}
//             ${isDark ? "hover:bg-custom-gradient-sidebar" : "hover:bg-custom-gradient-sidebar hover:bg-opacity-50"}
//         `;
//     };

//     return (
//         <>
//             <ul className="pb-2  pt-2">
//                 {menuItems.map((item, i) => (
//                     <li key={i}>
//                         <NavLink
//                             to={item.link}
//                             className={({ isActive }) => {
//                                 const currentPath = location.pathname;
//                                 // Add additional active route logic here
//                                 const additionalActiveRoutes = {
//                                     "/list/clients": ["/list/clients", "/create/clients"],
//                                     "/list/users": ["/list/users", "/edit/user", "/view/user", "/create/user"],
//                                     "/list/staffs": ["/list/staffs", "/create/staffs"],
//                                     "/list/organization": ["/list/organization", "/create/organization", "/view/organization", "/list/fields", "/assign/user", "/list/adjustOrder", "/list/forms", "/editformbyadmin"],
//                                     "/list/company": ["/list/company", "/create/company"],
//                                     "/list/subscription": ["/list/subscription", "/create/subscription"],
//                                     "/list/topup": ["/list/topup", "/create/topup"],
//                                     "/list/subscribed": ["/list/subscribed", "/create/subscribed", "/view/subscribed"],
//                                     // Add more mappings as needed
//                                 };
//                                 const activeRoutes = additionalActiveRoutes[item.link] || [item.link];
//                                 const isItemActive = activeRoutes.some(route =>
//                                     currentPath.startsWith(route)
//                                 );
//                                 return (
//                                     getNavItemClass(isItemActive) +
//                                     ` menu-link flex items-center  py-2 ${width < breakpoints.lg || isCollapsed ? "flex-col justify-center gap-1" : "gap-2"}`
//                                 );
//                             }}
//                         >

//                             <span className="menu-icon flex-grow-0">
//                                 <Icons
//                                     icon={item.icon}
//                                     color="#ffffff"
//                                     size={18}
//                                     className="my-icon"
//                                 />
//                             </span>
//                             <span className={`text-white whitespace-nowrap ${width < breakpoints.lg || isCollapsed ? "text-[.6rem]" : ""}`}>
//                                 {item.title}
//                             </span>
//                         </NavLink>
//                     </li>
//                 ))}



//                 {/* Dark Mode Toggle */}
//                 {/* <li
//                     onClick={() => setDarkMode(!isDark)}
//                     className={`nav-item flex my-2  cursor-pointer ${width < breakpoints.lg || isCollapsed ? "justify-center" : "px-2"}  rounded-md hover:bg-slate-200 transition duration-500`}
//                 >
//                     <div className={`menu-link flex items-center gap-3 py-2 ${width < breakpoints.lg || isCollapsed ? "flex-col justify-center" : ""}`}>
//                         <span className="menu-icon flex-grow-0">
//                             {isDark ? <CiLight /> : <MdDarkMode />}
//                         </span>
//                         <div className={`text-white ${width < breakpoints.lg || isCollapsed ? "text-[.6rem]" : ""}`}>
//                             {isDark ? "Light" : "Dark"}
//                         </div>
//                     </div>
//                 </li> */}
//             </ul>

//             {/* Logo */}
//             <hr className="border-t border-gray-700" />
//             <div className="flex my-4 justify-center">
//                 <img
//                     src={logo}
//                     className="h-[6rem] bg-white rounded-md w-auto object-contain"
//                     alt="Logo"
//                 />
//             </div>
//         </>
//     );
// };

// export default NavMenu;



// new code

import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { MdDarkMode } from "react-icons/md";
import { CiLight } from "react-icons/ci";
import { AiOutlineDashboard } from "react-icons/ai";
import { FaRegBuilding, FaUserCheck, FaUserPlus, FaUser } from "react-icons/fa";
import { PiPaperPlaneTiltFill } from "react-icons/pi";
import { FaArrowUpFromBracket } from "react-icons/fa6";
import { MdOutlineSubscriptions } from "react-icons/md";
import { FaUserTie } from "react-icons/fa";
import { FaUsersViewfinder } from "react-icons/fa6";
import Icons from "./Icons";
import useWidth from "../../Hooks/useWidth";
import useDarkmode from "../../Hooks/useDarkMode";
import logo from "../../assets/logo/logo2.png";
import { useSelector } from "react-redux";

// Mapping of menu names to icons
const menuIconMap = {
    Dashboard: AiOutlineDashboard,
    Organization: FaRegBuilding,
    User: FaUser,
    Staff: FaUserTie,
    Requests: FaUserPlus,
    Clients: FaUserCheck,
    Companies: FaUsersViewfinder,
    Subscription: PiPaperPlaneTiltFill,
    Topup: FaArrowUpFromBracket,
    Subscribed: MdOutlineSubscriptions,
    "Roles & Permissions": FaUser,
};

const NavMenu = ({ isCollapsed }) => {
    const { width, breakpoints } = useWidth();
    const [isDark, setDarkMode] = useDarkmode();
    const { capability } = useSelector((state) => state.capabilitySlice);
    const [menuItems, setMenuItems] = useState([]);
    const location = useLocation();

    useEffect(() => {
        const generateMenuItems = () => {
            const items = [
                { title: "Dashboard", icon: AiOutlineDashboard, link: "/dashboard" }, // Dashboard is always included
            ];

            if (capability && capability.length > 0) {
                const adminCapability = capability.find((cap) => cap.name === "Administration");
                if (adminCapability && adminCapability.access) {
                    adminCapability.menu.forEach((menu) => {
                        if (menu.access) {
                            const name = menu.name;
                            let menuName;;

                            if (name == "Roles & Permissions") {
                                menuName = "Permissions"
                            } else {
                                menuName = name;

                            }

                            let link;
                            if (menuName == "Roles & Permissions") {
                                link = `/list/rolesPermissions`;
                            } else {
                                link = menuName === "Dashboard" ? "/dashboard" : `/list/${menuName.toLowerCase()}`;
                            }
                            items.push({
                                title: menuName,
                                icon: menuIconMap[menuName] || FaUser, // Fallback to FaUser if no icon is defined
                                link,
                            });
                        }
                    });
                }
            }

            setMenuItems(items);
        };

        generateMenuItems();
    }, [capability]);

    const getNavItemClass = (isActive) => {
        return `nav-item my-2 w-[100%] rounded-md transition duration-500 
      ${isActive ? "bg-custom-gradient-sidebar" : ""}
      ${width < breakpoints.lg || isCollapsed ? "" : "px-2"}
      ${isDark ? "hover:bg-custom-gradient-sidebar" : "hover:bg-custom-gradient-sidebar hover:bg-opacity-50"}
    `;
    };

    return (
        <>
            <ul className="pb-2 pt-2">
                {menuItems.map((item, i) => (
                    <li key={i}>
                        <NavLink
                            to={item.link}
                            className={({ isActive }) => {
                                const currentPath = location.pathname;
                                const additionalActiveRoutes = {
                                    "/list/clients": ["/list/clients", "/create/clients"],
                                    "/list/user": ["/list/user", "/edit/user", "/view/user", "/create/user"],
                                    "/list/staffs": ["/list/staffs", "/create/staffs"],
                                    "/list/organization": [
                                        "/list/organization",
                                        "/create/organization",
                                        "/view/organization",
                                        "/list/fields",
                                        "/assign/user",
                                        "/list/adjustOrder",
                                        "/list/forms",
                                        "/editformbyadmin",
                                    ],
                                    "/list/companies": ["/list/companies", "/create/companies"],
                                    "/list/subscription": ["/list/subscription", "/create/subscription"],
                                    "/list/topup": ["/list/topup", "/create/topup"],
                                    "/list/subscribed": ["/list/subscribed", "/create/subscribed", "/view/subscribed"],
                                    "/list/rolesPermissions": ["/list/rolesPermissions", "/assign/permissions"],
                                };
                                const activeRoutes = additionalActiveRoutes[item.link] || [item.link];
                                const isItemActive = activeRoutes.some((route) => currentPath.startsWith(route));
                                return (
                                    getNavItemClass(isItemActive) +
                                    ` menu-link flex items-center py-2 ${width < breakpoints.lg || isCollapsed ? "flex-col justify-center gap-1" : "gap-2"
                                    }`
                                );
                            }}
                        >
                            <span className="menu-icon flex-grow-0">
                                <Icons icon={item.icon} color="#ffffff" size={18} className="my-icon" />
                            </span>
                            <span
                                className={`text-white whitespace-nowrap ${width < breakpoints.lg || isCollapsed ? "text-[.5rem]" : "text-[.80rem]"
                                    }`}
                            >
                                {item.title}
                            </span>
                        </NavLink>
                    </li>
                ))}
            </ul>

            <hr className="border-t border-gray-700" />
            <div className="flex my-4 justify-center">
                <img
                    src={logo}
                    className="h-[6rem] bg-white rounded-md w-auto object-contain"
                    alt="Logo"
                />
            </div>
        </>
    );
};

export default NavMenu;
