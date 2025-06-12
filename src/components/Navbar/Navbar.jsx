import React, { useEffect, useState } from "react";
import { MdMenu } from "react-icons/md";
import { motion } from "framer-motion";
import logo from "../../assets/logo/logo.png"

export const NavbarMenu = [
  {
    id: 1,
    title: "Home",
    link: "#home",
  },
  {
    id: 2,
    title: "About Us",
    link: "#aboutUs",
  },
  {
    id: 3,
    title: "Services",
    link: "#services",
  },
  {
    id: 4,
    title: "Our Mission",
    link: "#ourMission",
  },
  {
    id: 5,
    title: "Contact us",
    link: "#contactUs",
  },
];




const Navbar = ({ isOpen, setIsOpen }) => {
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

  const scrollToSection = (id) => {
    document.getElementById(id).scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <motion.div
        id="home"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="px-8 md:px-0 lg:px-12 xl:px-20 sticky top-0 w-screen z-40 bg-white shadow-xl flex justify-between items-center py-3">
          {/* Logo section */}
          <div className=" text-2xl flex items-center gap-2 font-bold">
            <img src={logo} className="w-20 h-10 object-contain " alt="Logo" />
          </div>

          {/* Menu section */}
          <div className="hidden md:block">
            <ul className="flex items-center gap-3">
              {NavbarMenu.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.link}
                    onClick={(e) => {
                      e.preventDefault(); // Prevent default anchor behavior
                      scrollToSection(item.link.substring(1)); // Remove "#" from link and scroll to section
                    }}
                    className={`inline-block text-base md:text-sm lg:text-base py-1 px-2 xl:px-3 hover:text-slate-950 transition-all duration-300 `}
                    style={{
                      fontWeight: activeSection === item.link.substring(1) ? "800" : "normal",
                      color: activeSection === item.link.substring(1) ? "#100146" : "rgb(16 1 70 / 60%)",
                      fontFamily: "GreycliffCF-Regular",
                    }}
                  >
                    {item.title}
                  </a>
                </li>
              ))}
              <li>
                <div className="space-x-6">
                  <button
                    onClick={() => scrollToSection("contactUs")}
                    className="text-white text-base md:text-lg rounded-md px-6 py-2"
                    style={{
                      background: "#100146",
                      fontFamily: "GreycliffCF-Regular",
                    }}
                  >
                    Book a free Demo
                  </button>
                </div>
              </li>
            </ul>
          </div>

          {/* Mobile Hamburger Menu */}
          <div className={`${isOpen == true ? "hidden": "md:hidden"} `} onClick={() => setIsOpen(!isOpen)}>
            <MdMenu className="text-4xl" />
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Navbar;
