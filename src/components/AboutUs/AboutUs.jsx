// import React from "react";
// import { motion } from "framer-motion";
// import { SlideUp } from "../../helper/animation";

// const AboutUs = ({ image, title, subtitle, link, tag, reverse }) => {
//     return (
//         <div className=" flex justify-center bg-transparent  ">
//             <div className="px-10 md:max-w-[90vw] py-10">
//                 <div className="grid grid-cols-1 gap-6 md:grid-cols-2 space-y-6 md:space-y-0  pt-0 ">
//                     {/* banner Image section */}
//                     <div
//                        className="flex flex-col justify-center text-left md:text-left space-y-4  "
//                     >
//                         <motion.img
//                             initial={{ opacity: 0, scale: 0.5 }}
//                             whileInView={{ opacity: 1, scale: 1 }}
//                             transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
//                             src={image}
//                             alt=""
//                             className="w-[20rem] lg:w-[30rem] md:w-[30rem] rounded-md	 h-[100%] object-contain"
//                         />
//                     </div>

//                     {/* Banner text section */}
//                     <div 
//                     className={`flex flex-col  items-start justify-center`}
                    
//                     >

//                         <motion.h1
//                             variants={SlideUp(0.2)}
//                             initial="hidden"
//                             whileInView={"visible"}
//                             className="text-xl text-left text-white  md:text-3xl lg:text-[2.625rem] font-semibold  capitalize"
//                             style={{  fontFamily: "DMSerifDisplay-Regular" }}
//                         >
//                             {title}
//                         </motion.h1>
//                         <motion.p
//                             variants={SlideUp(0.2)}
//                             initial="hidden"
//                             whileInView={"visible"}
//                             className="text-base text-white/50 md:text-xl lg:text-2xl  capitalize"
//                             style={{  fontFamily: "GreycliffCF-Medium" }}
//                         >
//                             {tag}
//                         </motion.p>
//                         <motion.p
//                             variants={SlideUp(0.2)}
//                             initial="hidden"
//                             whileInView={"visible"}
//                             transition={{ duration: 0.2 }}
//                             className="text-sm md:text-base text-white/80 lg:text-lg md:text-left leading-normal"
//                             style={{  fontFamily: "GreycliffCF-Regular" }}
//                         >
//                             {subtitle}
//                         </motion.p>
//                     </div>


//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AboutUs;


import React from 'react';
import { motion } from 'framer-motion';

// Slide-up animation with smooth easing
const slideUp = (delay) => ({
    hidden: { opacity: 0, y: 50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1], delay },
    },
});

const AboutUs = ({ image, title, subtitle, link, tag, reverse }) => {
    return (
        <>
            <style>
                {`
                    .about-us-container {
                        background: transparent;
                        width: 100%;
                    }
                    .about-us-image {
                        object-fit: contain;
                        height: auto;
                    }
                    
                `}
            </style>
            <div className="about-us-container flex justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-7xl">
                    <div
                        className={`grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center ${
                            reverse ? 'md:grid-flow-dense' : ''
                        }`}
                    >
                        {/* Image Section */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ type: 'spring', stiffness: 100, damping: 15, delay: 0.2 }}
                            viewport={{ once: true }}
                            className={`flex justify-center md:justify-start ${
                                reverse ? 'md:order-last' : ''
                            }`}
                        >
                            <img
                                src={image}
                                alt={title}
                                className="about-us-image rounded-md shadow-lg w-[100%] "
                            />
                        </motion.div>

                        {/* Text Section */}
                        <div
                            className={`flex flex-col items-start justify-center space-y-2 sm:space-y-3 px-4 sm:px-0 ${
                                reverse ? 'md:order-first' : ''
                            }`}
                        >
                            <motion.h1
                                variants={slideUp(0.2)}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-white capitalize"
                                style={{ fontFamily: 'DMSerifDisplay, serif' }}
                            >
                                {title}
                            </motion.h1>
                            <motion.p
                                variants={slideUp(0.4)}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                className="text-sm sm:text-base md:text-lg lg:text-xl text-white/50 capitalize"
                                style={{ fontFamily: 'GreycliffCF, sans-serif' }}
                            >
                                {tag}
                            </motion.p>
                            <motion.p
                                variants={slideUp(0.6)}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                className="text-sm sm:text-base md:text-lg lg:text-xl text-white/80 leading-relaxed"
                                style={{ fontFamily: 'GreycliffCF, sans-serif' }}
                            >
                                {subtitle}
                            </motion.p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AboutUs;
