import React, { useEffect, useRef, useState } from "react";
// import { Logo } from "./Logo";
import Logo from "./Logo"
import SimpleBar from "simplebar-react";
import NavMenu from "./NavMenu";
import useWidth from "../../Hooks/useWidth";
import useDarkmode from "../../Hooks/useDarkMode";
import customLogo from "../../assets/logo/logo2.png";
import logo from "../../assets/logo/logo.png"

export const Sidebar = ({ isCollapsed }) => {
  const { width, breakpoints } = useWidth();
  const scrollableNodeRef = useRef();
  const [scroll, setScroll] = useState(false);
  const [isDark] = useDarkmode();

  console.log("width window", width);

  // Add smooth transition to the sidebar width
  const sidebarWidth = width < breakpoints.lg || isCollapsed ? "w-[100px]" : "w-[238px]";

  // Handle scroll to show/hide the shadow effect
  useEffect(() => {
    const handleScroll = () => {
      if (scrollableNodeRef.current.scrollTop > 0) {
        setScroll(true);
      } else {
        setScroll(false);
      }
    };
    scrollableNodeRef.current?.addEventListener("scroll", handleScroll);
  }, [scrollableNodeRef]);

  const collapsed = window.localStorage.getItem("sidebarCollapsed");

  console.log("collapsed", collapsed);



  return (
    <>
      {width >= breakpoints.sm && (
        <div
          className={`${sidebarWidth} ${isDark ? "" : ""
            } h-full border-r-[0.5px] ${isDark ? "border-blue-gray-800" : "border-slate-400"
            }

          bg-custom-gradient-sidebar

            transition-all duration-300 ease-in-out`}
        >
          {/* Logo */}
          <Logo logoSrc={logo} to="/home" />

          <hr className="border-t my-3 border-gray-700" />

          {/* Navigation items */}
          <SimpleBar className="px-4 w-[100%] h-[100%]  ">
            <NavMenu isCollapsed={isCollapsed} />
          </SimpleBar>
        </div>
      )}
    </>
  );
};
