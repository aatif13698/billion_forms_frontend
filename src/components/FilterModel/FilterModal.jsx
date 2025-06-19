import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import common from '../../helper/common';
import { Fragment } from 'react';
import { Dialog, Transition } from "@headlessui/react";
import { RxCross2 } from 'react-icons/rx';
import useWidth from '../../Hooks/useWidth';


// Modal animation variants
const modalVariants = {
    open: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    closed: { opacity: 0, y: '-100%', transition: { duration: 0.3 } },
};

const backdropVariants = {
    open: { opacity: 0.5 },
    closed: { opacity: 0 },
};

const FilterModal = ({
    noFade,
    isOpen,
    onClose,
    onApply,
    onReset,
    filterOptions,
    selectedFilters,
    setSelectedFilters,
}) => {

    const { width, breakpoints } = useWidth();

    const handleFilterChange = (field, value) => {
        setSelectedFilters((prev) => ({
            ...prev,
            [field]: value || undefined, // Remove filter if value is empty
        }));
    };

    return (
        <>
            {/* <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            className="absolute flex flex-col justify-center items-center   bg-black z-[9998] w-[100%] h-[100%]"
                            initial="closed"
                            animate="open"
                            exit="closed"
                            variants={backdropVariants}
                            onClick={onClose}
                            aria-hidden="true"
                        />
                        <motion.div
                            className="  max-w-[40rem] mx-auto bg-red-300 dark:bg-gray-900 shadow-2xl z-[9999] rounded-b-lg p-4"
                            initial="closed"
                            animate="open"
                            exit="closed"
                            variants={modalVariants}
                            role="dialog"
                            aria-label="Advanced filter modal"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-textLight dark:text-textDark">
                                    Advanced Filters
                                </h3>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-full text-textLight dark:text-textDark hover:bg-textLight/25"
                                    aria-label="Close filter modal"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>
                            <div className="max-h-[60vh] overflow-y-auto">
                                {filterOptions.map(({ field, label, options }) => (
                                    <div key={field} className="mb-4">
                                        <label
                                            htmlFor={`filter-${field}`}
                                            className="block text-sm font-medium text-textLight dark:text-textDark mb-1"
                                        >
                                            {label}
                                        </label>
                                        <select
                                            id={`filter-${field}`}
                                            value={selectedFilters[field] || ''}
                                            onChange={(e) => handleFilterChange(field, e.target.value)}
                                            className="w-[100%] px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-textLight dark:text-textDark focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                            aria-label={`Filter by ${label}`}
                                        >
                                            <option value="">All</option>
                                            {options.map((option) => (
                                                <option key={option} value={option} className="text-black dark:text-white">
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-end gap-2 mt-4">
                                <button
                                    onClick={onReset}
                                    className="px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700"
                                    aria-label="Reset filters"
                                >
                                    Reset
                                </button>
                                <button
                                    onClick={onApply}
                                    className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                                    aria-label="Apply filters"
                                >
                                    Apply
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence> */}

            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-[99999]" onClose={onClose}>
                    <Transition.Child
                        as={Fragment}
                        enter={noFade ? "" : "duration-300 ease-out"}
                        enterFrom={noFade ? "" : "opacity-0"}
                        enterTo={noFade ? "" : "opacity-100"}
                        leave={noFade ? "" : "duration-200 ease-in"}
                        leaveFrom={noFade ? "" : "opacity-100"}
                        leaveTo={noFade ? "" : "opacity-0"}
                    >
                        <div className="fixed inset-0 bg-slate-900 backdrop-filter backdrop-blur-0" />
                    </Transition.Child>

                    <div className="fixed shadow-lg  w-[100%] inset-0 overflow-y-auto flex justify-center  items-start my-2">
                        <Transition.Child
                            as={Fragment}
                            enter={noFade ? "" : "duration-300 ease-out"}
                            enterFrom={noFade ? "" : "opacity-0 scale-95"}
                            enterTo={noFade ? "" : "opacity-100 scale-100"}
                            leave={noFade ? "" : "duration-200 ease-in"}
                            leaveFrom={noFade ? "" : "opacity-100 scale-100"}
                            leaveTo={noFade ? "" : "opacity-0 scale-95"}
                        >
                            <Dialog.Panel>
                                <div className={`flex flex-col ${width > breakpoints.sm ? "w-[40rem]" : "w-full"}   mx-3  bg-white dark:bg-dark px-3 rounded-md `}>
                                    <div className="flex justify-end mt-5">
                                        <button onClick={() => onClose()}>
                                            <RxCross2 size={20} className="text-red-700" />
                                        </button>
                                    </div>
                                    <div className="flex flex-col items-center my-4 md:px-1 px-1">
                                        <style>
                                            {`
                                                         input[type="date"]::-webkit-calendar-picker-indicator {
                                                         filter: invert(0%); /* Black (#000000) */
                                                         cursor: pointer;
                                                            }
                                                              .dark input[type="date"]::-webkit-calendar-picker-indicator {
                                                               filter: invert(100%); /* White (#FFFFFF) */
                                                               cursor: pointer;
                                                             }`
                                            }
                                        </style>
                                        <div className="w-[100%]  border-subscriptionCardBgLightFrom border-2 dark:border-white bg-cardBgLight dark:bg-cardBgDark shadow-lg rounded-lg p-6">
                                            <div className="flex justify-between items-center mb-4">
                                                <h3 className="text-lg font-semibold text-textLight dark:text-textDark">
                                                    Advanced Filters
                                                </h3>
                                                {/* <button
                                                    onClick={onClose}
                                                    className="p-2 rounded-full text-textLight dark:text-textDark hover:bg-textLight/25"
                                                    aria-label="Close filter modal"
                                                >
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M6 18L18 6M6 6l12 12"
                                                        />
                                                    </svg>
                                                </button> */}
                                            </div>
                                            <div className="max-h-[60vh] overflow-y-auto">
                                                {filterOptions.map(({ field, label, options }) => (
                                                    <div key={field} className="mb-4">
                                                        <label
                                                            htmlFor={`filter-${field}`}
                                                            className="block text-sm font-medium text-textLight dark:text-textDark mb-1"
                                                        >
                                                            {label}
                                                        </label>
                                                        <select
                                                            id={`filter-${field}`}
                                                            value={selectedFilters[field] || ''}
                                                            onChange={(e) => handleFilterChange(field, e.target.value)}
                                                            className="w-[100%] px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-textLight dark:text-textDark focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                                            aria-label={`Filter by ${label}`}
                                                        >
                                                            <option value="">All</option>
                                                            {options.map((option) => (
                                                                <option key={option} value={option} className="text-black dark:text-white dark:bg-black">
                                                                    {option}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="flex justify-end gap-2 mt-4">
                                                <button
                                                    onClick={onReset}
                                                    className="px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700"
                                                    aria-label="Reset filters"
                                                >
                                                    Reset
                                                </button>
                                                <button
                                                    onClick={onApply}
                                                    className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                                                    aria-label="Apply filters"
                                                >
                                                    Apply
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>
        </>


    );
};

FilterModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onApply: PropTypes.func.isRequired,
    onReset: PropTypes.func.isRequired,
    filterOptions: PropTypes.arrayOf(
        PropTypes.shape({
            field: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
            options: PropTypes.arrayOf(PropTypes.string).isRequired,
        })
    ).isRequired,
    selectedFilters: PropTypes.object.isRequired,
    setSelectedFilters: PropTypes.func.isRequired,
};

export default FilterModal;