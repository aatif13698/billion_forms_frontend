// import { FaTwitter, FaInstagram, FaFacebook } from 'react-icons/fa';
// import { ImLinkedin2 } from "react-icons/im";

// const Footer = ({ openModal, closeModal, isModalOpen, setIsModalOpen, name, setName }) => {

//     return (
//         <footer className=" flex justify-center   text-white  bg-black" >
//             <div className=" flex flex-row gap-5 items-center justify-center bg-red-300 md:max-w-[90vw] py-10">

//                 <div className=" bg-green-300 mx-auto flex flex-col md:flex-row justify-between items-center">

//                     {/* Company Name in Large Italic Font */}
//                     {/* <img src={logoTwo} className="text-3xl italic mb-4 md:mb-0" /> */}

//                     {/* Social Media Links */}
//                     <div className="flex space-x-6">
//                         <a href="#" target="_blank" rel="noopener noreferrer">
//                             <FaTwitter className="text-2xl hover:text-gray-500" />
//                         </a>
//                         <a href="#" target="_blank" rel="noopener noreferrer">
//                             <ImLinkedin2 className="text-2xl hover:text-gray-500" />
//                         </a>
//                         <a href="#" target="_blank" rel="noopener noreferrer">
//                             <FaInstagram className="text-2xl hover:text-gray-500" />
//                         </a>
//                         <a href="#" target="_blank" rel="noopener noreferrer">
//                             <FaFacebook className="text-2xl hover:text-gray-500" />
//                         </a>
//                     </div>
//                 </div>

//                 {/* Privacy Policy and Copyright Section */}
//                 <div className=" gap-2 bg-yellow-50 flex flex-col md:flex-row justify-center items-center md:items-start mx-auto mt-6 text-center md:text-left text-sm text-gray-400">
//                     <p className="">
//                         <a href="#" onClick={() => openModal("privacy")} className="hover:text-gray-300">Privacy Policy</a> |
//                         <a href="#" onClick={() => openModal("terms")} className="ml-2 hover:text-gray-300">Terms and Conditions</a> |
//                     </p>
//                     <p>©️ 2025 Aestree Webnet Pvt Ltd.</p>
//                 </div>

//             </div>


//         </footer>
//     );
// }

// export default Footer;



import React from 'react';
import { motion } from 'framer-motion';
import { FaTwitter, FaInstagram, FaFacebook } from 'react-icons/fa';
import { ImLinkedin2 } from 'react-icons/im';
import logo from '../../assets/logo/aestree-logo-dark.png'; // Assuming the logo is the same as used in Navbar

const Footer = ({ openModal, closeModal, isModalOpen, setIsModalOpen, name, setName }) => {
    // Animation for fade-in and slide-up
    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1], delay: 0.2 },
        },
    };

    return (
        <>
            <style>
                {`
                    .footer-container {
                        background-color: #100146;
                        color: #ffffff;
                        width: 100%;
                    }
                    .social-icon {
                        transition: color 0.3s ease-in-out, transform 0.3s ease-in-out;
                    }
                    .social-icon:hover {
                        color: #9ca3af;
                        transform: scale(1.2);
                    }
                    .policy-link {
                        transition: color 0.3s ease-in-out;
                    }
                    .policy-link:hover {
                        color: #d1d5db;
                    }
                `}
            </style>
            <motion.footer
                className="footer-container flex justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
            >
                <div className="w-full max-w-7xl flex flex-col md:flex-row gap-8 md:gap-12 items-center justify-between">
                    {/* Company Logo/Name Section */}
                    <div className="flex flex-col items-center md:items-start">
                        <img
                            src={logo}
                            alt="Aestree Webnet Pvt Ltd"
                            className="w-24 sm:w-28 h-auto object-contain mb-4"
                        />
                        <p
                            className="text-sm sm:text-base text-white/80 italic"
                            style={{ fontFamily: 'DMSerifDisplay, serif' }}
                        >
                            Aestree Webnet Pvt Ltd
                        </p>
                    </div>

                    {/* Social Media Links */}
                    <div className="flex items-center gap-4 sm:gap-6">
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                            <FaTwitter className="social-icon text-xl sm:text-2xl" />
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                            <ImLinkedin2 className="social-icon text-xl sm:text-2xl" />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                            <FaInstagram className="social-icon text-xl sm:text-2xl" />
                        </a>
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                            <FaFacebook className="social-icon text-xl sm:text-2xl" />
                        </a>
                    </div>

                    {/* Privacy Policy and Copyright Section */}
                    <div className="flex flex-col items-center md:items-end text-center md:text-right">
                        <div className="flex gap-2 sm:gap-4 text-sm sm:text-base text-gray-400">
                            <a
                                href="#"
                                onClick={() => openModal('privacy')}
                                className="policy-link hover:text-gray-300"
                                style={{ fontFamily: 'GreycliffCF, sans-serif' }}
                            >
                                Privacy Policy
                            </a>
                            <span>|</span>
                            <a
                                href="#"
                                onClick={() => openModal('terms')}
                                className="policy-link hover:text-gray-300"
                                style={{ fontFamily: 'GreycliffCF, sans-serif' }}
                            >
                                Terms and Conditions
                            </a>
                        </div>
                        <p
                            className="mt-2 text-sm sm:text-base text-gray-400"
                            style={{ fontFamily: 'GreycliffCF, sans-serif' }}
                        >
                            © 2025 Aestree Webnet Pvt Ltd.
                        </p>
                    </div>
                </div>
            </motion.footer>
        </>
    );
};

export default Footer;
