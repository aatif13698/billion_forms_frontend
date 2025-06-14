import React from "react";
import { motion } from "framer-motion";
import { SlideUp } from "../../helper/animation";
import background from "../../assets/images/graphicWithoutBg1.png"

const OurVison = ({ image, title, subtitle, link, tag, reverse }) => {
  return (

    <>

      <style>
        {/* {`
                  .mainCard1{
                                           background-image: url(${background});
                                                                  background-size: cover;
                                                                  background-position: center;
                                                                  background-repeat: no-repeat;
                                          }
                    
                `} */}
                
      </style>
       <div
                className="contact-us-container flex justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8 "
            >
                <div className="w-full max-w-7xl">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 space-y-6 md:space-y-0  pt-0 ">
            <div className="flex mainCard1 flex-col justify-center text-left md:text-left space-y-4 ">
              <motion.h1
                variants={SlideUp(0.4)}
                initial="hidden"
                whileInView={"visible"}
                className="text-xl text-white md:text-3xl lg:text-[2.625rem] font-semibold capitalize "
                style={{ fontFamily: "DMSerifDisplay-Regular" }}
              >
                {title}
              </motion.h1>
              <motion.p
                variants={SlideUp(0.3)}
                initial="hidden"
                whileInView={"visible"}
                className="text-base text-white md:text-xl lg:text-2xl  capitalize"
                style={{ fontFamily: "GreycliffCF-Medium" }}
              >
                {tag}
              </motion.p>
              <motion.p
                variants={SlideUp(0.5)}
                initial="hidden"
                whileInView={"visible"}
                transition={{ duration: 0.2 }}
                className="text-sm text-white/80 md:text-lg lg:text-xl leading-7 md:leading-8"
                style={{ fontFamily: "GreycliffCF-Regular" }}
              >
                {subtitle}
              </motion.p>
            </div>
            <div
              className={`flex justify-center md:justify-end   items-center ${reverse && "md:order-last md:justify-end"
                }`}
            >
              <motion.img
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
                src={image}
                alt=""
                className="w-[100%]  rounded-md	 h-aut object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </>


  );
};

export default OurVison;
