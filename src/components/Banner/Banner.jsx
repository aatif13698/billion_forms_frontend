// import React from "react";
// import { motion } from "framer-motion";
// import { SlideLeft } from "../../helper/animation";
// // import iconeOne from "../../assets/iconeOne.SVG"
// // import iconeTwo from "../../assets/iconTwo.SVG"
// // import iconeThree from "../../assets/iconThree.SVG"
// // import iconeFour from "../../assets/iconThree.SVG"
// // import "./Banner.css"

// const WhyChooseData = [
//     {
//         id: 1,
//         title: "Convenience",
//         desc: "On-site car care services, right within the apartment premises.",
//         // icon: <img src={iconeOne} />,
//         bgColor: "#0063ff",
//         delay: 0.3,
//     },
//     {
//         id: 2,
//         title: "Sustainability",
//         desc: "Our dry wash methods use 0% water, helping conserve water resource",
//         link: "/",
//         // icon: <img src={iconeTwo} />,
//         delay: 0.6,
//     },
//     {
//         id: 3,
//         title: "Eco-friendly",
//         desc: "We use environmentally safe cleaning agents that leave no harmful residue.",
//         link: "/",
//         // icon: <img src={iconeThree} />,
//         delay: 0.9,
//     },
//     {
//         id: 4,
//         title: "Professional Quality",
//         desc: "High-quality car cleaning that enhances vehicle maintenance.",
//         link: "/",
//         // icon: <img src={iconeFour} />,
//         delay: 0.9,
//     },
// ];
// const Banner = () => {
//     return (

//         <div className=" flex justify-center bg-white  ">
//             <div className="px-10 md:max-w-[90vw] py-10">
//                 <div className="  mt-5 rounded-3xl shadow-md" style={{ backgroundColor: "#FBF6FF" }}>
//                     <div className=" py-5">
//                         {/* header section */}
//                         <div className="space-y-4 p-6 text-start max-w-[500px] text-[22px] md:text-[42px] mb-5"
//                             style={{ color: "#100146", fontFamily: "GreycliffCF-Regular" }}>
//                             <p className=" leading-normal">
//                                 We Have Plan,
//                                 to give you the best
//                             </p>
//                         </div>
//                         {/* cards section */}
//                         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//                             {WhyChooseData.map((item) => {
//                                 return (
//                                     <motion.div
//                                         variants={SlideLeft(item.delay)}
//                                         initial="hidden"
//                                         whileInView="visible"
//                                         className="group space-y-2  p-6 hover:cursor-pointer	 rounded-xl hover:bg-indigo-950 hover:shadow-[0_0_22px_rgba(0,0,0,0.15)] hover:shadow-neutral-600 hover:text-white shadow-[0_0_22px_rgba(0,0,0,0.15)]"

//                                     >

//                                         <div className="w-10 h-10 rounded-lg flex justify-center items-center text-white">
//                                             {/* <div className="text-2xl">{item.icon}</div> */}
//                                         </div>
//                                         <p className="font-semibold  md:text-[1.125rem] lg;text-[1.25rem] group-hover:text-white text-indigo-950" style={{ fontFamily: "DMSerifDisplay-Regular" }} >{item.title}</p>
//                                         <p style={{ lineHeight: "24px", fontFamily: "GreycliffCF-Regular" }} className="text-base md:text-[1.120rem] text-gray-500 group-hover:text-white" >{item.desc}</p>
//                                     </motion.div>

//                                 );
//                             })}
//                         </div>
//                     </div>
//                 </div>

//             </div>



//         </div>


//     );
// };

// export default Banner;


import React from 'react';
import { motion } from 'framer-motion';
import { FaCar, FaWater, FaLeaf, FaTools } from 'react-icons/fa';
import background from "../../assets/images/graphicBg1.jpg"

// Parent container animation for staggered effect
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
            delayChildren: 0.3,
        },
    },
};

// Card animation with fade-in, slight rotation, and slide
const cardVariants = {
    hidden: { opacity: 0, x: -50, rotate: -5 },
    visible: {
        opacity: 1,
        x: 0,
        rotate: 0,
        transition: {
            duration: 0.7,
            ease: [0.4, 0, 0.2, 1], // Smooth cubic-bezier easing
            type: 'spring',
            stiffness: 100,
            damping: 15,
        },
    },
};

const WhyChooseData = [
    {
        id: 1,
        title: 'Convenience',
        desc: 'On-site car care services, right within the apartment premises.',
        icon: <FaCar className="text-2xl" />,
        bgColor: 'bg-blue-500',
        hoverBgColor: 'bg-blue-700',
    },
    {
        id: 2,
        title: 'Sustainability',
        desc: 'Our dry wash methods use 0% water, helping conserve water resource',
        icon: <FaWater className="text-2xl" />,
        bgColor: 'bg-green-500',
        hoverBgColor: 'bg-green-700',
    },
    {
        id: 3,
        title: 'Eco-friendly',
        desc: 'We use environmentally safe cleaning agents that leave no harmful residue.',
        icon: <FaLeaf className="text-2xl" />,
        bgColor: 'bg-teal-500',
        hoverBgColor: 'bg-teal-700',
    },
    {
        id: 4,
        title: 'Professional Quality',
        desc: 'High-quality car cleaning that enhances vehicle maintenance.',
        icon: <FaTools className="text-2xl" />,
        bgColor: 'bg-purple-500',
        hoverBgColor: 'bg-purple-700',
    },
];

const Banner = () => {
    return (
        <>
            <style>
                {`
                    .card-container {
                        transition: transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1),
                                    background-color 0.3s ease-in-out,
                                    box-shadow 0.3s ease-in-out,
                                    filter 0.3s ease-in-out;
                        transform-origin: center;
                    }
                    .card-container:hover {
                        transform: translateY(-8px) scale(1.03);
                        box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
                        filter: brightness(1.1);
                    }
                    .text-transition {
                        transition: color 0.3s ease-in-out;
                    }
                    .icon-container {
                        transition: transform 0.3s ease-in-out;
                    }
                    .card-container:hover .icon-container {
                        transform: rotate(10deg) scale(1.2);
                    }
                        .mainCard{
                         background-image: url(${background});
                                                background-size: cover;
                                                background-position: center;
                                                background-repeat: no-repeat;
                        }
                `}
            </style>
            <div className="flex justify-center  py-8 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-7xl">
                    <div className="rounded-3xl shadow-lg p-6 sm:p-8 mainCard">
                        {/* Header Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                            className="mb-8 text-left"
                        >
                            <h2
                                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight"
                                style={{ fontFamily: 'GreycliffCF, sans-serif' }}
                            >
                                We Have Plan, to give you the best
                            </h2>
                        </motion.div>
                        {/* Cards Section */}
                        <motion.div
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                        >
                            {WhyChooseData.map((item) => (
                                <motion.div
                                    key={item.id}
                                    variants={cardVariants}
                                    className={`card-container group p-6 rounded-xl shadow-md ${item.bgColor} hover:${item.hoverBgColor} text-white cursor-pointer`}
                                >
                                    <div className="icon-container w-12 h-12 rounded-lg flex justify-center items-center bg-white bg-opacity-20 mb-4">
                                        {item.icon}
                                    </div>
                                    <h3
                                        className="text-lg sm:text-xl font-semibold text-transition group-hover:text-gray-100"
                                        style={{ fontFamily: 'DMSerifDisplay, serif' }}
                                    >
                                        {item.title}
                                    </h3>
                                    <p
                                        className="text-sm sm:text-base text-transition group-hover:text-gray-200 mt-2"
                                        style={{ fontFamily: 'GreycliffCF, sans-serif', lineHeight: '1.5rem' }}
                                    >
                                        {item.desc}
                                    </p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Banner;