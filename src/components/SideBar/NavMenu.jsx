import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { MdDarkMode } from "react-icons/md";
import { CiLight } from "react-icons/ci";
import { AiOutlineDashboard } from "react-icons/ai";
import { FaRegBuilding } from "react-icons/fa";
import { FaUsersViewfinder } from "react-icons/fa6";
import { FaUserPlus } from "react-icons/fa";
import { FaUserCheck } from "react-icons/fa";
import { FaUser } from "react-icons/fa";


import Icons from "./Icons";
import useWidth from "../../Hooks/useWidth";
import useDarkmode from "../../Hooks/useDarkMode";
import logo from "../../assets/logo/logo2.png";
import { useSelector } from "react-redux";


// const menuItems = [
//     {
//         title: "Dashboard",
//         // icon: <AiOutlineDashboard className="w-6 h-6" />,
//         icon: AiOutlineDashboard,
//         link: "/home",
//     },
//     {
//         title: "Organisation",
//         // icon: <FaRegBuilding className="w-6 h-6" />,
//         icon: FaRegBuilding,
//         link: "/home",
//     },
//     {
//         title: "User",
//         // icon: <FaRegUser className="w-6 h-6" />,
//         icon: FaRegUser,
//         link: "/home",
//     },
//     {
//         title: "Companies",
//         // icon: <FaUsersViewfinder className="w-6 h-6" />,
//         icon: FaUsersViewfinder,
//         link: "/home",
//     },
// ];

const NavMenu = ({ isCollapsed }) => {
    const { width, breakpoints } = useWidth();

    const [isDark, setDarkMode] = useDarkmode();

    const { clientUser, isAuth } = useSelector((state) => state.authCustomerSlice);

    const [menuItems, setMenuItems] = useState([])


    console.log("state", clientUser);


    useEffect(() => {
        if (clientUser) {

            if (clientUser?.role?.id == 1) {
                setMenuItems(
                    [
                        {
                            title: "Dashboard",
                            icon: AiOutlineDashboard,
                            link: "/home",
                        },
                        {
                            title: "Organisation",
                            icon: FaRegBuilding,
                            link: "/home",
                        },
                        {
                            title: "Requests",
                            icon : FaUserPlus,
                            link: "/home"
                        },
                        {
                            title: "Clients",
                            icon: FaUserCheck,
                            link: "/list/clients",
                        },
                        {
                            title: "User",
                            icon: FaUser,
                            link: "/home",
                        },
                        {
                            title: "Companies",
                            icon: FaUsersViewfinder,
                            link: "/list/company",
                        },
                    ]
                )
            }
        }
    }, [clientUser])


    const [activeSubmenu, setActiveSubmenu] = useState(0);
    const toggleSubmenu = (i) => {
        if (activeSubmenu === i) {
            setActiveSubmenu(null);
        } else {
            setActiveSubmenu(i);
        }
    };

    return (
        <>
            <ul className="pb-2 w-[100%] h-[100%] pt-2  ">
                {menuItems.map((item, i) => (
                    <li
                        key={i}
                        className={`nav-item  my-2 w-full rounded-md transition duration-500  ${activeSubmenu == i ? "bg-custom-gradient-sidebar " : ""}
                ${width < breakpoints.lg || width <= breakpoints.sm || isCollapsed ? "" : "px-2"} 
                ${isDark ? "hover:bg-custom-gradient-sidebar" : "hover:bg-custom-gradient-sidebar hover:bg-opacity-50"}`}

                    >
                        <NavLink
                            onClick={() => toggleSubmenu(i)}
                            className={`menu-link flex  items-center gap-3 py-2 ${width < breakpoints.lg || width <= breakpoints.sm || isCollapsed ? "flex-col justify-center" : ""}`}
                            to={item.link}
                        >
                            <span className="menu-icon flex-grow-0">
                                <Icons
                                    icon={item?.icon}
                                    color="#ffffff"
                                    size={18}
                                    className="my-icon"
                                />
                            </span>
                            {width < breakpoints.lg || width <= breakpoints.sm || isCollapsed ? (
                                <span className="text-white text-[.6rem]">{item.title}</span>
                            ) : (
                                <span className="text-white ">{item.title}</span>
                            )}
                        </NavLink>
                    </li>
                ))}
                <li
                    onClick={() => setDarkMode(!isDark)}
                    className={`nav-item flex  my-2 ${width < breakpoints.lg || width <= breakpoints.sm || isCollapsed ? " justify-center" : "px-2"
                        }  w-[100%] rounded-md hover:bg-slate-200 transition duration-500`}
                >
                    <NavLink className={`menu-link flex items-center gap-3 py-2 ${width < breakpoints.lg || width <= breakpoints.sm || isCollapsed ? " flex-col justify-center" : ""}`}>
                        <span className="menu-icon flex-grow-0">
                            {isDark ? <CiLight /> : <MdDarkMode />}
                        </span>
                        {width < breakpoints.lg || width <= breakpoints.sm || isCollapsed ? (
                            <div className="text-white text-[.6rem]">{isDark ? "Light" : "Dark"}</div>) : (
                            <div className="text-white">{isDark ? "Light" : "Dark"}</div>
                        )}
                    </NavLink>
                </li>
            </ul>
            <hr className="border-t  border-gray-700" />

            <div className="flex my-4 justify-center ">
                <img
                    src={logo}
                    className=" h-[6rem] bg-white rounded-md w-auto object-contain"
                />
            </div>
        </>
    );
};

export default NavMenu;
