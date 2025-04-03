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






const menuItems = [
  {
    title: "Dashboard",
    // icon: <AiOutlineDashboard className="w-6 h-6" />,
    icon: AiOutlineDashboard,
    link: "/home",
  },
  {
    title: "Organisation",
    // icon: <FaRegBuilding className="w-6 h-6" />,
    icon: FaRegBuilding,
    link: "/home",
  },
  {
    title: "Requests",
    icon: FaUserPlus,
    link: "/home"
  },
  {
    title: "Clients",
    // icon: <FaRegBuilding className="w-6 h-6" />,
    icon: FaUserCheck,
    link: "/clients",
  },
  {
    title: "User",
    // icon: <FaRegUser className="w-6 h-6" />,
    icon: FaUser,
    link: "/home",
  },
  {
    title: "Companies",
    // icon: <FaUsersViewfinder className="w-6 h-6" />,
    icon: FaUsersViewfinder,
    link: "/company",
  },
];

const BottomTab = ({ show, noFade }) => {
  const location = useLocation(); // Get current route

  const [isDark] = useDarkmode();
  const navigate = useNavigate();
  const [activeLink, setActiveLink] = useState(1);

  function handleNavigateToMenu(item) {
    setActiveLink(item.id);
    console.log("coming here");

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
