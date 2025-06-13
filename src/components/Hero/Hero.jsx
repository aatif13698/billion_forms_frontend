// import React from "react";
// // import HeroImg from "../../assets/hero.png";
// import card from "../../assets/images/card.png";
// import { motion } from "framer-motion";
// import { SlideRight } from "../../helper/animation";
// import { MdArrowOutward } from "react-icons/md";
// import bg from "../../assets/images/bg.png";
// import background from "../../assets/images/background1.jpg"
// import "./Hero.css"



// const Hero = () => {


//     const scrollToContact = () => {
//         document.getElementById("contactUs").scrollIntoView({ behavior: "smooth" });
//       };

//     const glassStyle = {
//         background: "rgb(183 173 173 / 10%)", // Semi-transparent white
//         borderRadius: "18px", // Rounded corners
//         padding: "15px", // Padding inside the card
//         backdropFilter: "blur(13px)", // Glass effect
//         WebkitBackdropFilter: "blur(10px)", // Safari support
//         boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 6px", // Soft shadow for depth
//         border: "1px solid rgba(255, 255, 255, 0.2)", // Subtle border
//         color: "#fff" // Text color
//     };
//     return (
//         <>
//             <div className=" grid grid-cols-1 md:grid-cols-2 min-h-[650px] relative mb-14 md:mb-0">
//                 {/* brand info */}
//                 <div className="flex justify-start ps-8 md:ps-0 md:justify-center py-14  md:py-0">
//                     <div className="flex justify-center md:ps-8 lg:mr-36 items-center">
//                         <div className="text-left md:text-left pr-25">
//                             <motion.h1
//                                 variants={SlideRight(0.6)}
//                                 initial="hidden"
//                                 animate="visible"
//                                 className="text-4xl  md:text-4xl lg:text-5xl !leading-tight"
//                                 style={{ color: "#100146", fontFamily: "GreycliffCF-Bold" }}
//                             >
//                                 We Care about <br /> <span className="text-4xl  md:text-4xl lg:text-5xl" style={{ fontFamily: "DMSerifDisplay-Italic" }}>Your Work</span>
//                             </motion.h1>
//                             <motion.p
//                                 variants={SlideRight(0.8)}
//                                 initial="hidden"
//                                 animate="visible"
//                                 className="text-sm xl:text-xl"
//                                 style={{color:"rgb(10 0 53 / 60%)",fontFamily: "GreycliffCF-Regular"}}
//                             >
//                                 Billion Forms is a tech-based <span className="" style={{ color: "#487118",fontFamily: "DMSerifDisplay-Italic" }}>Custom Form Provider,</span> <br />solution that minimize your efforts
//                             </motion.p>
//                             {/* button section */}
//                             <motion.div
//                                 variants={SlideRight(1.0)}
//                                 initial="hidden"
//                                 animate="visible"
//                                 className="flex gap-8 justify-start md:justify-start !mt-8 items-center"
//                             >
//                                 <button  onClick={scrollToContact} className="flex items-center text-base md:text-lg text-white bg-slate-900 rounded-md px-6 py-2"
//                                 style={{background:"#100146",fontFamily: "GreycliffCF-Regular"}}>
//                                     Book a free Demo
//                                     <span className="ml-2">
//                                         <MdArrowOutward />
//                                     </span>
//                                 </button>
//                             </motion.div>

//                         </div>
//                     </div>

//                 </div>
//                 {/* Hero image */}
//                 <div className="flex justify-end items-center  relative">
//                     <motion.img
//                         initial={{ opacity: 0, x: 200 }}
//                         animate={{ opacity: 1, x: 0 }}
//                         transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
//                         src={card}
//                         alt=""
//                         className="w-[555px] md:w-[600px] xl:w-[32rem] absolute z-20  "
//                     />
//                     <motion.img
//                         initial={{ opacity: 0, x: 200 }}
//                         animate={{ opacity: 1, x: 0 }}
//                         transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
//                         src={bg}
//                         alt=""
//                         className="w-[200px] md:w-[300px] z-10  xl:w-[300px] lg:w-[300px] absolute top-[-140px] right-2 md:top-16 md:right-[20rem] lg:top-16 lg:right-[20rem] xl:top-[12rem] xl:right-[15rem] "
//                     />

//                     <motion.div
//                         initial={{ opacity: 0, x: 200 }}
//                         animate={{ opacity: 1, x: 0 }}
//                         transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
//                         style={glassStyle}
//                         className=" z-30 border-x-2 flex justify-start flex-row  items-center shadow-2xl rounded-md w-[318px] h-[100px] xl:h-[150px] lg:h-[140px] md:w-[425px] lg:w-[550px] xl:w-[550px] absolute top-[-0px] right-[-70px] md:top-48 md:right-9 lg:top-40 lg:right-42 xl:top-[4rem] xl:right-[25rem] "
//                     >
//                         <motion.div
//                             className="flex  flex-row gap-3 items-end  "

//                         >

//                             <motion.p
//                                 initial="hidden"
//                                 animate="visible"
//                                 className="text-[3.5rem] md:text-[5rem] font-light lg:text-[6.75rem] !leading-tight"
//                                 style={{ color: "#100146", fontFamily:"GreycliffCF-Regular", }}
//                             >
//                                 6,46,322
//                             </motion.p>
//                             <p
//                                 className="text-xs md:text-base lg:text-md"
//                                 style={{ color: "#100146",  fontWeight: "600", fontFamily:"GreycliffCF-Medium" }}
//                             >
//                                  number of forms submitted so far
//                             </p>

//                         </motion.div>


//                     </motion.div>

//                 </div>
//             </div>
//         </>
//     );
// };

// export default Hero;



import React from 'react';
import { motion } from 'framer-motion';
import { MdArrowOutward } from 'react-icons/md';
import card from '../../assets/images/card.png';
import bg from '../../assets/images/bg.png';
import background from '../../assets/images/background1.jpg';
import Navbar from '../Navbar/Navbar';

const Hero = ({ isOpen, setIsOpen }) => {
    const scrollToContact = () => {
        document.getElementById('contactUs').scrollIntoView({ behavior: 'smooth' });
    };

    const glassStyle = {
        background: 'rgba(183, 173, 173, 0.1)',
        borderRadius: '18px',
        padding: '15px',
        backdropFilter: 'blur(13px)',
        WebkitBackdropFilter: 'blur(10px)',
        boxShadow: '0 1px 6px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        color: '#fff',
    };

    // Animation for slide-right effect
    const slideRight = (delay) => ({
        hidden: { opacity: 0, x: 100 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1], delay },
        },
    });

    return (
        <>
            <style>
                {`
                    .hero-section {
                        background-image: url(${background});
                        background-size: cover;
                        background-position: center;
                        background-repeat: no-repeat;
                        position: relative;
                        min-height: 650px;
                        width: 100%;
                        display: flex;
                        align-items: center;
                        overflow: hidden;
                    }
                    .hero-section::before {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: rgba(0, 0, 0, 0.3); /* Subtle overlay for better text readability */
                        z-index: 1;
                    }
                    .hero-content {
                        position: relative;
                        z-index: 2;
                    }
                    @media (max-width: 768px) {
                        .hero-section {
                            min-height: 500px;
                        }
                    }
                    @media (max-width: 640px) {
                        .hero-section {
                            min-height: 400px;
                            background-position: 60% center;
                        }
                    }
                `}
            </style>
            <div className="hero-section h-[100vh]">


                <div className="hero-content grid grid-cols-1 md:grid-cols-2 w-full max-w-7xl mx-auto mb-14 md:mb-0">
                    {/* Brand Info */}
                    <div className="flex justify-start items-center py-8 sm:py-12 md:py-0 px-4 sm:px-6 lg:px-8">
                        <div className="text-left max-w-md">
                            <motion.h1
                                variants={slideRight(0.6)}
                                initial="hidden"
                                animate="visible"
                                className="text-3xl sm:text-4xl lg:text-5xl font-bold !leading-tight text-white"
                                style={{ fontFamily: 'GreycliffCF, sans-serif' }}
                            >
                                We Care about <br />
                                <span className="text-3xl sm:text-4xl lg:text-5xl" style={{ fontFamily: 'DMSerifDisplay, serif' }}>
                                    Your Work
                                </span>
                            </motion.h1>
                            <motion.p
                                variants={slideRight(0.8)}
                                initial="hidden"
                                animate="visible"
                                className="text-sm sm:text-base lg:text-lg mt-4 text-white"
                                style={{ fontFamily: 'GreycliffCF, sans-serif' }}
                            >
                                Billion Forms is a tech-based{' '}
                                <span className="text-red-100" style={{ fontFamily: 'DMSerifDisplay, serif' }}>
                                    Custom Form Provider,
                                </span>{' '}
                                <br />
                                solution that minimizes your efforts
                            </motion.p>
                            <motion.div
                                variants={slideRight(1.0)}
                                initial="hidden"
                                animate="visible"
                                className="flex gap-4 sm:gap-6 mt-6"
                            >
                                <button
                                    onClick={scrollToContact}
                                    className="flex items-center text-sm sm:text-base lg:text-lg text-white bg-[#100146] rounded-md px-4 sm:px-6 py-2 hover:bg-[#1a0266] transition-colors duration-300"
                                    style={{ fontFamily: 'GreycliffCF, sans-serif' }}
                                >
                                    Book a free Demo
                                    <span className="ml-2">
                                        <MdArrowOutward />
                                    </span>
                                </button>
                            </motion.div>
                        </div>
                    </div>
                    {/* Hero Image */}
                    <div className="flex justify-end items-center relative px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, x: 200 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ type: 'spring', stiffness: 100, delay: 0.2 }}
                            style={glassStyle}
                            className="z-30 flex flex-row items-center justify-start rounded-md w-[250px] sm:w-[300px] md:w-[350px] lg:w-[400px] xl:w-[450px] h-[80px] sm:h-[100px] md:h-[120px] lg:h-[140px] absolute top-0 sm:top-8 md:top-12 lg:top-16 xl:top-20 right-[2rem] sm:right-12 md:right-8 lg:right-12 xl:right-16"
                        >
                            <div className="flex flex-row gap-2 sm:gap-3 items-end">
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-white"
                                    style={{ fontFamily: 'GreycliffCF, sans-serif' }}
                                >
                                    6,46,322
                                </motion.p>
                                <p
                                    className="text-xs sm:text-sm md:text-base text-white font-semibold"
                                    style={{ fontFamily: 'GreycliffCF, sans-serif' }}
                                >
                                    number of forms submitted so far
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Hero;
