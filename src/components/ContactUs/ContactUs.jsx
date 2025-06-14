import React from 'react';
import { motion } from 'framer-motion';
import Form from '../Form/Form';
import img1 from '../../assets/images/contactUs.jpg';

// Slide-up animation with smooth easing
const slideUp = (delay) => ({
    hidden: { opacity: 0, y: 50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1], delay },
    },
});

const ContactUs = ({ reverse }) => {
    return (
        <>
            <style>
                {`
                    .contact-us-container {
                        width: 100%;
                    }
                `}
            </style>
            <div
                id="contactUs"
                className="contact-us-container flex justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8 "
            >
                <div className="w-full max-w-7xl">
                    <div
                        className={`grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center ${
                            reverse ? 'md:grid-flow-dense' : ''
                        }`}
                    >
                        {/* Text and Image Section */}
                        <div
                            className={`flex flex-col  md:items-start md:justify-start justify-center space-y-4 sm:space-y-6 ${
                                reverse ? 'md:order-last' : ''
                            }`}
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ type: 'spring', stiffness: 100, damping: 15, delay: 0.2 }}
                                viewport={{ once: true }}
                                className="flex justify-center md:justify-start"
                            >
                                <img
                                    src={img1}
                                    alt="Contact Us"
                                    className="object-contain rounded-md shadow-lg h-auto w-[100%] "
                                />
                            </motion.div>
                            <motion.h1
                                variants={slideUp(0.2)}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-semibold text-white capitalize"
                                style={{ fontFamily: 'DMSerifDisplay, serif' }}
                            >
                                Contact our friendly team
                            </motion.h1>
                            <motion.p
                                variants={slideUp(0.3)}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                className="text-sm sm:text-base md:text-lg lg:text-xl text-white/60"
                                style={{ fontFamily: 'GreycliffCF, sans-serif' }}
                            >
                                Call us for a free estimate
                                <span
                                    className="block text-lg sm:text-xl md:text-2xl text-white font-semibold"
                                    style={{ fontFamily: 'GreycliffCF, sans-serif' }}
                                >
                                    +91 980085 3045
                                </span>
                            </motion.p>
                            <motion.p
                                variants={slideUp(0.4)}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                className="text-sm sm:text-base md:text-lg lg:text-xl text-white/60"
                                style={{ fontFamily: 'GreycliffCF, sans-serif' }}
                            >
                                E-mail id
                                <span
                                    className="block text-lg sm:text-xl md:text-2xl text-white font-semibold"
                                    style={{ fontFamily: 'GreycliffCF, sans-serif' }}
                                >
                                    contact@aestree.in
                                </span>
                            </motion.p>
                        </div>

                        {/* Form Section */}
                        <div className={` flex md:justify-end justify-center  `}>
                            <Form />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ContactUs;