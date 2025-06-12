import React from "react";
// import HeroImg from "../../assets/hero.png";
import card from "../../assets/images/card.png";
import { motion } from "framer-motion";
import { SlideRight } from "../../helper/animation";
import { MdArrowOutward } from "react-icons/md";
import bg from "../../assets/images/bg.png";
import "./Hero.css"



const Hero = () => {


    const scrollToContact = () => {
        document.getElementById("contactUs").scrollIntoView({ behavior: "smooth" });
      };

    const glassStyle = {
        background: "rgb(183 173 173 / 10%)", // Semi-transparent white
        borderRadius: "18px", // Rounded corners
        padding: "15px", // Padding inside the card
        backdropFilter: "blur(13px)", // Glass effect
        WebkitBackdropFilter: "blur(10px)", // Safari support
        boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 6px", // Soft shadow for depth
        border: "1px solid rgba(255, 255, 255, 0.2)", // Subtle border
        color: "#fff" // Text color
    };
    return (
        <>
            <div className=" grid grid-cols-1 md:grid-cols-2 min-h-[650px] relative mb-14 md:mb-0">
                {/* brand info */}
                <div className="flex justify-start ps-8 md:ps-0 md:justify-center py-14  md:py-0">
                    <div className="flex justify-center md:ps-8 lg:mr-36 items-center">
                        <div className="text-left md:text-left pr-25">
                            <motion.h1
                                variants={SlideRight(0.6)}
                                initial="hidden"
                                animate="visible"
                                className="text-4xl  md:text-4xl lg:text-5xl !leading-tight"
                                style={{ color: "#100146", fontFamily: "GreycliffCF-Bold" }}
                            >
                                We Care about <br /> <span className="text-4xl  md:text-4xl lg:text-5xl" style={{ fontFamily: "DMSerifDisplay-Italic" }}>Your Work</span>
                            </motion.h1>
                            <motion.p
                                variants={SlideRight(0.8)}
                                initial="hidden"
                                animate="visible"
                                className="text-sm xl:text-xl"
                                style={{color:"rgb(10 0 53 / 60%)",fontFamily: "GreycliffCF-Regular"}}
                            >
                                Billion Forms is a tech-based <span className="" style={{ color: "#487118",fontFamily: "DMSerifDisplay-Italic" }}>Custom Form Provider,</span> <br />solution that minimize your efforts
                            </motion.p>
                            {/* button section */}
                            <motion.div
                                variants={SlideRight(1.0)}
                                initial="hidden"
                                animate="visible"
                                className="flex gap-8 justify-start md:justify-start !mt-8 items-center"
                            >
                                <button  onClick={scrollToContact} className="flex items-center text-base md:text-lg text-white bg-slate-900 rounded-md px-6 py-2"
                                style={{background:"#100146",fontFamily: "GreycliffCF-Regular"}}>
                                    Book a free Demo
                                    <span className="ml-2">
                                        <MdArrowOutward />
                                    </span>
                                </button>
                            </motion.div>

                        </div>
                    </div>

                </div>
                {/* Hero image */}
                <div className="flex justify-end items-center  relative">
                    <motion.img
                        initial={{ opacity: 0, x: 200 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
                        src={card}
                        alt=""
                        className="w-[555px] md:w-[600px] xl:w-[32rem] absolute z-20  "
                    />
                    <motion.img
                        initial={{ opacity: 0, x: 200 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
                        src={bg}
                        alt=""
                        className="w-[200px] md:w-[300px] z-10  xl:w-[300px] lg:w-[300px] absolute top-[-140px] right-2 md:top-16 md:right-[20rem] lg:top-16 lg:right-[20rem] xl:top-[12rem] xl:right-[15rem] "
                    />

                    <motion.div
                        initial={{ opacity: 0, x: 200 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
                        style={glassStyle}
                        className=" z-30 border-x-2 flex justify-start flex-row  items-center shadow-2xl rounded-md w-[318px] h-[100px] xl:h-[150px] lg:h-[140px] md:w-[425px] lg:w-[550px] xl:w-[550px] absolute top-[-0px] right-[-70px] md:top-48 md:right-9 lg:top-40 lg:right-42 xl:top-[4rem] xl:right-[25rem] "
                    >
                        <motion.div
                            className="flex  flex-row gap-3 items-end  "

                        >

                            <motion.p
                                initial="hidden"
                                animate="visible"
                                className="text-[3.5rem] md:text-[5rem] font-light lg:text-[6.75rem] !leading-tight"
                                style={{ color: "#100146", fontFamily:"GreycliffCF-Regular", }}
                            >
                                6,46,322
                            </motion.p>
                            <p
                                className="text-xs md:text-base lg:text-md"
                                style={{ color: "#100146",  fontWeight: "600", fontFamily:"GreycliffCF-Medium" }}
                            >
                                 number of forms submitted so far
                            </p>

                        </motion.div>


                    </motion.div>

                </div>
            </div>
        </>
    );
};

export default Hero;
