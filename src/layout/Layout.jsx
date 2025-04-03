import React, { useEffect, Suspense, Fragment, useRef, useState } from "react";
import useWidth from "../Hooks/useWidth";
import useSidebar from "../Hooks/useSidebar";
import useMenuHidden from "../Hooks/useMenuHidden";
import { Sidebar } from "../components/SideBar/Sidebar";
import BottomTab from "../components/BottomTab/BottomTab";
import Header from "../components/Header/Header";
import MainContent from "../components/MainContent/MainContent";

const Layout = () => {
  const { width, breakpoints } = useWidth();
  const containerRef = useRef(null);
  const [showBottomTab, setShowBottomTab] = useState(true);
  const lastScrollY = useRef(0);

  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem("sidebarCollapsed") === true;
  });

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", isCollapsed);
  }, [isCollapsed]);

  const toggleSidebar = () => {
    setIsCollapsed(prev => !prev);
  };

  const handleScroll = () => {
    const currentScrollY = containerRef.current.scrollTop;
    if (currentScrollY < lastScrollY.current) {
      // Scrolling up
      setShowBottomTab(true);
    } else {
      // Scrolling down
      setShowBottomTab(false);
    }
    lastScrollY.current = currentScrollY;
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return (
    <>
      <div style={{ width: "100vw", height: "100vh" }} className="flex">
        {/* sidebar */}
        <Sidebar isCollapsed={isCollapsed} />

        {/* middlebar */}
        <div className={`w-[100%]  flex-col overflow-y-auto   h-[100%]  relative `}>
            {/* header */}

          <Header isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} toggleSidebar={toggleSidebar} />

          <div className={`h-[100%] w-[100%]  mb-14 `}>

            {/* main content */}
            <MainContent isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} toggleSidebar={toggleSidebar} />
          </div>

          {/* mottom tab */}
          {width < breakpoints.sm ? <BottomTab show={showBottomTab} /> : ""}
        </div>
      </div>




    </>
  );
};

export default Layout;
