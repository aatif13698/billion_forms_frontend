
import React, { useRef, useEffect,useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logoOne from "../../assets/logo/logo.png";
import { ImCross } from "react-icons/im";


const ResponsiveMenu = ({ isOpen, setIsOpen }) => {
  const menuRef = useRef(null);
  const [activeSection, setActiveSection] = useState("");
  

  useEffect(() => {
    // Set up an IntersectionObserver to observe each section
    const sections = document.querySelectorAll("section");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 } // Trigger when 70% of the section is in view
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);


  

  // Close the menu when clicking outside of it
  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsOpen(false); // Close menu
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const scrollToSection = (id) => {
    document.getElementById(id).scrollIntoView({ behavior: "smooth" });
    setIsOpen(false); // Close the menu after scrolling to a section
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
        
        <motion.div
          ref={menuRef} // Attach ref to the menu div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 w-[80%] shadow-2xl h-screen z-50 lg:hidden bg-white"
        >
        
          <div className=" mt-5 text-2xl justify-between flex items-center bg-white gap-2 font-bold">
            <img src={logoOne} className="w-[80%] object-contain h-10 text-secondary" alt="Logo" />
            <ImCross className="text-indigo-900 mr-7" onClick={()=>setIsOpen(!isOpen)} />
          </div>
         
          <div className="text-base font-semibold h-screen uppercase bg-white text-gray-500">
            <ul className="flex flex-col text-lg px-5 pt-6 items-start gap-5 ">
              <a className="" href="#home" onClick={() => scrollToSection("home")}  style={{
                      fontWeight: activeSection === "home" ? "bold" : "normal",
                      color: activeSection === "home" ? "#100146" : "rgb(16 1 70 / 60%)",
                      fontFamily: "GreycliffCF-Regular",
                    }}>Home</a>
              <a href="#aboutUs" onClick={() => scrollToSection("aboutUs")}  style={{
                      fontWeight: activeSection === "aboutUs" ? "bold" : "normal",
                      color: activeSection === "aboutUs" ? "#100146" : "rgb(16 1 70 / 60%)",
                      fontFamily: "GreycliffCF-Regular",
                    }}>About Us</a>
              <a href="#service" onClick={() => scrollToSection("service")} style={{fontWeight:"normal", color:" rgb(16 1 70 / 60%)",fontFamily:"GreycliffCF-Regular"}}>Service</a>

              <a href="#ourMission" onClick={() => scrollToSection("ourMission")} style={{
                      fontWeight: activeSection === "ourMission" ? "bold" : "normal",
                      color: activeSection === "ourMission" ? "#100146" : "rgb(16 1 70 / 60%)",
                      fontFamily: "GreycliffCF-Regular",
                    }}>Our Mission</a>
              <a href="#contactUs" onClick={() => scrollToSection("contactUs")} style={{
                      fontWeight: activeSection === "contactUs" ? "bold" : "normal",
                      color: activeSection === "contactUs" ? "#100146" : "rgb(16 1 70 / 60%)",
                      fontFamily: "GreycliffCF-Regular",
                    }}>Contact Us</a>
              <li>
                <button
                  onClick={() => scrollToSection("contactUs")}
                  className="text-white text-base md:text-lg font-semibold rounded-md px-6 py-2"
                  style={{
                    background: "#100146",
                    fontFamily: "GreycliffCF-Regular",
                  }}
                >
                  Book a free Demo
                </button>
              </li>
            </ul>
          </div>
        </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ResponsiveMenu;


