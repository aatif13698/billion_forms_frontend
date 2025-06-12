import React from "react";
import { motion } from "framer-motion";
import { SlideUp } from "../../helper/animation";

const OurVison = ({ image, title, subtitle, link, tag, reverse }) => {
  return (
    <div  className=" flex justify-center  bg-[#0DD6FA]/30">
      <div  className="px-10 md:max-w-[90vw] py-10">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 space-y-6 md:space-y-0  pt-0 ">
          <div className="flex flex-col justify-center text-left md:text-left space-y-4 ">
            <motion.h1
              variants={SlideUp(0.4)}
              initial="hidden"
              whileInView={"visible"}
              className="text-xl md:text-3xl lg:text-[2.625rem] font-semibold capitalize "
              style={{ color: "#100146" ,fontFamily:"DMSerifDisplay-Regular"}}
            >
              {title}
            </motion.h1>
            <motion.p
              variants={SlideUp(0.3)}
              initial="hidden"
              whileInView={"visible"}
              className="text-base md:text-xl lg:text-2xl  capitalize"
              style={{ color: "#100146", fontFamily:"GreycliffCF-Medium" }}
            >
              {tag}
            </motion.p>
            <motion.p
              variants={SlideUp(0.5)}
              initial="hidden"
              whileInView={"visible"}
              transition={{ duration: 0.2 }}
              className="text-sm md:text-lg lg:text-xl leading-7 md:leading-8"
              style={{color:"rgb(16 1 70 / 50%)",fontFamily:"GreycliffCF-Regular"}}
            >
              {subtitle}
            </motion.p>
          </div>
          <div
            className={`flex justify-center md:justify-end items-center ${reverse && "md:order-last md:justify-end"
              }`}
          >
            <motion.img
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
              src={image}
              alt=""
              className="w-[20rem] lg:w-[30rem] md:w-[30rem] rounded-md	 h-[100%] object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurVison;
