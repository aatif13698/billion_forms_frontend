import React, { useEffect, useState, Fragment } from 'react'
import CustomTable from '../../components/CustomTable/CustomTable'
import useDarkmode from '../../Hooks/useDarkMode';
import clientService from '../../services/clientService';
import Hamberger from '../../components/Hamberger/Hamberger';
import { FaRedoAlt, FaRegEdit, FaRegEye, FaSpinner } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { Dialog, Transition } from "@headlessui/react";
import LoadingSpinner from '../../components/Loading/LoadingSpinner';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // Optional: default CSS styling
import useWidth from '../../Hooks/useWidth';
import { RxCross2 } from 'react-icons/rx';
import { Swal } from 'sweetalert2/dist/sweetalert2';




function ListPermission({ noFade }) {

    const { width, breakpoints } = useWidth();


    const [showLoadingModal, setShowLoadingModal] = useState(false);
    const handleCloseLoadingModal = () => {
        setShowLoadingModal(false);
    };
    const [isDark] = useDarkmode();
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [text, setText] = useState("");
    const [updatedData, setUpdatedData] = useState([]);



    const [formData2, setFormData2] = useState({
        name: "",
    });
    // const [roleId, setRoleId] = useState(null)

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [roleId, setRoleId] = useState(null);
    const [refreshCount, setRefreshCount] = useState(0)

    console.log("isSubmitting", isSubmitting);




    const [showSessionModal, setShowSessionModal] = useState(false);
    const handleCloseSessionModal = () => {
        setShowSessionModal(false);
        setFormData2({
            name: "",
        });
        setRoleId(null)
        setErrors({})
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData2({ ...formData2, [name]: value });
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const columns = [
        {
            key: 'id', header: 'ID', with: "auto",
            render: (value) => {
                return (
                    <span className={`whitespace-nowrap  text-black dark:text-white  rounded-md`} >
                        {value}
                    </span>
                )
            }
        },
        {
            header: 'Name', width: '200px',
            render: (value, row) => {
                return (
                    <span className={`whitespace-nowrap  text-black dark:text-white  rounded-md`} >
                        {row?.name}
                    </span>
                )
            }
        },
        {
            key: 'isActive',
            header: 'Status',
            render: (value, row) => {
                console.log("row active", row?.isActive);
                return (
                    <Tippy
                        content={value ? "Click to deactivate" : "Click to activate"}
                        placement="top"
                        theme="custom"

                    >
                        <button
                            onClick={() =>
                                handleActiveInactive(currentPage, rowsPerPage, text, row?.isActive, row?._id)
                            }
                            className={`${value ? "bg-green-500/60" : "bg-red-500/50"
                                } text-[.80rem] font-bold text-black dark:text-white px-2 py-1 rounded-md`}
                        >
                            {value ? "Active" : "InActive"}
                        </button>
                    </Tippy>
                )
            },
        },
        {
            header: 'Action',
            render: (value, row) => (
                <div className='flex gap-3'>
                    <Tippy
                        content={"Edit"}
                        placement="top"
                        theme="custom"
                    >
                        <button
                            className='bg-hambergerLight dark:bg-hambergerDark p-2 rounded-md'
                            onClick={() => handleView(row)}
                        >
                            <FaRegEdit />
                        </button>
                    </Tippy>
                    {
                        row?.deletedAt ?
                            <Tippy
                                content={"Restore"}
                                placement="top"
                                theme="custom"
                            >
                                <button
                                    onClick={() => handleRestore(currentPage, rowsPerPage, text, row?._id)}
                                    className='bg-green-100 dark:bg-green-900/60 p-2 rounded-md'
                                >
                                    <FaRedoAlt />
                                </button>
                            </Tippy>
                            :
                            <Tippy
                                content={"Delete"}
                                placement="top"
                                theme="custom"
                            >
                                <button
                                    onClick={() => handleDelete(currentPage, rowsPerPage, text, row?._id)}
                                    className='bg-red-100 dark:bg-red-900 p-2 rounded-md'
                                >
                                    <FaTrashAlt />
                                </button>
                            </Tippy>
                    }
                </div>
            ),
        }
    ];

    async function getRoles(currentPage, rowsPerPage, text) {
        try {
            const response = await clientService.getRolesList(currentPage, rowsPerPage, text);
            return response
        } catch (error) {
            throw error
        }
    }

    async function handleView(row) {
        try {
            setFormData2((prev) => {
                return {
                    ...prev, name: row?.name
                }
            });
            setRoleId(row?._id)
            setShowSessionModal(true);
        } catch (error) {
            setShowLoadingModal(false)
            console.log("error while getting the role", error);
        }
    }


    async function handleDelete(currentPage, rowsPerPage, text, id) {
        try {
            const dataObject = {
                roleId: id,
                keyword: text,
                page: currentPage,
                perPage: rowsPerPage
            }
            setShowLoadingModal(true)
            const response = await clientService.softDeleteRole(dataObject);
            setUpdatedData(response.data?.data?.data)
            setShowLoadingModal(false);
        } catch (error) {
            setShowLoadingModal(false)
            console.log("error while getting role data", error);
        }
    }


    async function handleRestore(currentPage, rowsPerPage, text, id) {
        try {
            const dataObject = {
                roleId: id,
                keyword: text,
                page: currentPage,
                perPage: rowsPerPage
            }
            setShowLoadingModal(true)
            const response = await clientService.restoreRole(dataObject);
            setUpdatedData(response.data?.data?.data)
            setShowLoadingModal(false);
        } catch (error) {
            setShowLoadingModal(false)
            console.log("error while getting role data", error);
        }
    }


    async function handleActiveInactive(currentPage, rowsPerPage, text, status, id) {
        try {
            const dataObject = {
                status: status ? "0" : "1",
                roleId: id,
                keyword: text,
                page: currentPage,
                perPage: rowsPerPage
            }
            setShowLoadingModal(true)
            const response = await clientService.activeInactiveRole(dataObject);
            setUpdatedData(response.data?.data?.data)
            setShowLoadingModal(false)
        } catch (error) {
            setShowLoadingModal(false)
            console.log("error while active inactive status", error);
        }
    }

    function buttonAction() {
        // navigate("/create/clients")
        setShowSessionModal(true)
    }



    const validateForm = () => {
        const newErrors = {};
        if (!formData2.name.trim()) {
            newErrors.name = "Name is required";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleSubmit = async (e) => {
        console.log("yes");

        e.preventDefault();
        if (!validateForm()) return;
        setIsSubmitting(true);
        try {
            const dataObject = {
                name: formData2?.name
            }
            let response;
            if (roleId) {
                response = await clientService.updateRole({ ...dataObject, roleId: roleId });
            } else {
                response = await clientService.createRole(dataObject);
            }
            setFormData2({ name: "" });
            setErrors({});
            setIsSubmitting(false);
            handleCloseSessionModal();
            setRefreshCount((prev) => prev + 1);

            setTimeout(() => {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: response?.data?.message,
                    showConfirmButton: false,
                    timer: 2000,
                    toast: true,
                    customClass: {
                        popup: 'my-toast-size'
                    }
                });
            }, 600);
        } catch (error) {
            setIsSubmitting(false);
            console.error("Error submitting role:", error);
            const errorMessage = error || "An error occurred. Please try again." 
            setErrors({ general: errorMessage });

        }
    };


    useEffect(() => {
        async function getRoles(currentPage, rowsPerPage, text) {
            try {
                const response = await clientService.getRolesList(currentPage, rowsPerPage, text);
                setUpdatedData(response.data?.data?.data)
            } catch (error) {
                console.log("error while getting the role list");
            }
        }
        getRoles(currentPage, rowsPerPage, text)
    }, [refreshCount])


    return (
        <div className="flex flex-col md:mx-4  mx-2     mt-3 min-h-screen bg-light dark:bg-dark">
            <Hamberger text={"Client / Permissions"} />
            <div
                className="bg-cardBgLight dark:bg-cardBgDark rounded-lg shadow-lg md:p-6 p-2 mb-6"
            >
                <CustomTable
                    columns={columns}
                    fetchData={getRoles}
                    headerBackground={isDark ? "#00868d" : "#3f8e90"}
                    headerTextColor="#fff"
                    rowBackground={isDark ? "rgb(7 38 44)" : "#fff"}
                    rowTextColor={isDark ? "#fff" : "#3f8e90"}
                    alternateRowBackground={isDark ? "#16414ca3" : "#80abb124"}
                    defaultRowsPerPage={10}
                    buttonName={"Create Role"}
                    buttonAction={buttonAction}
                    updatedData={updatedData}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    rowsPerPage={rowsPerPage}
                    setRowsPerPage={setRowsPerPage}
                    text={text}
                    setText={setText}

                />
            </div>

            <Transition appear show={showLoadingModal} as={Fragment}>
                <Dialog as="div" className="relative z-[99999]" onClose={handleCloseLoadingModal}>
                    <Transition.Child
                        as={Fragment}
                        enter={noFade ? "" : "duration-300 ease-out"}
                        enterFrom={noFade ? "" : "opacity-0"}
                        enterTo={noFade ? "" : "opacity-100"}
                        leave={noFade ? "" : "duration-200 ease-in"}
                        leaveFrom={noFade ? "" : "opacity-100"}
                        leaveTo={noFade ? "" : "opacity-0"}
                    >
                        <div className="fixed inset-0 bg-slate-900/50 backdrop-filter backdrop-blur-sm" />
                    </Transition.Child>

                    <div className="fixed  inset-0 overflow-y-auto flex justify-center items-center">
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



                                <div className='flex  justify-center items-center'>
                                    <LoadingSpinner />

                                </div>


                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>


            <Transition appear show={showSessionModal} as={Fragment}>
                <Dialog as="div" className="relative z-[99999]" onClose={handleCloseSessionModal}>
                    <Transition.Child
                        as={Fragment}
                        enter={noFade ? "" : "duration-300 ease-out"}
                        enterFrom={noFade ? "" : "opacity-0"}
                        enterTo={noFade ? "" : "opacity-100"}
                        leave={noFade ? "" : "duration-200 ease-in"}
                        leaveFrom={noFade ? "" : "opacity-100"}
                        leaveTo={noFade ? "" : "opacity-0"}
                    >
                        <div className="fixed inset-0 bg-slate-900/50 backdrop-filter backdrop-blur-sm" />
                    </Transition.Child>

                    <div className="fixed shadow-lg  w-[100%] inset-0 overflow-y-auto flex justify-center  items-center my-2">
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
                                <div className={`flex flex-col ${width > breakpoints.sm ? "w-full/2" : "w-full"}   mx-3  bg-white dark:bg-dark px-3 rounded-md `}>
                                    <div className="flex justify-end mt-5">
                                        <button onClick={() => handleCloseSessionModal()}>
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
                                            <h2 className="md:text-2xl text-1xl font-semibold text-formHeadingLight dark:text-formHeadingDark md:mb-2 mb-2 text-start">Add New Role</h2>
                                            <div className="h-[1.8px] bg-black dark:bg-white mb-4"></div>
                                            <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label
                                                        htmlFor="name"
                                                        className="block text-sm font-medium text-formLabelLight dark:text-formLabelDark mb-1"
                                                    >
                                                        Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="name"
                                                        name="name"
                                                        value={formData2.name}
                                                        onChange={handleChange}
                                                        className="w-[100%] bg-transparent border border-gray-300 rounded-lg p-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        placeholder="e.g., Staff"
                                                        aria-describedby={errors.name ? "for-error" : undefined}
                                                    />
                                                    {errors.name && (
                                                        <p id="for-error" className="text-red-500 text-sm mt-1">
                                                            {errors.name}
                                                        </p>
                                                    )}
                                                </div>



                                            </form>
                                            {errors.general && (
                                                <p className="text-red-500 text-sm mt-4 text-center">
                                                    {errors.general}
                                                </p>
                                            )}
                                            <div className="flex justify-end mt-6">
                                                <button
                                                    onClick={handleSubmit}
                                                    disabled={isSubmitting}
                                                    className="w-auto p-2 text-sm text-white rounded-lg transition-all duration-300 ease-in-out 
                            bg-custom-gradient-button-dark dark:bg-custom-gradient-button-light 
                             hover:bg-custom-gradient-button-light dark:hover:bg-custom-gradient-button-dark 
                             flex items-center justify-center shadow-lg"
                                                // className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-700 dark:from-blue-600 dark:to-blue-800 rounded-lg shadow-md hover:from-blue-600 hover:to-blue-800 dark:hover:from-blue-700 dark:hover:to-blue-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {isSubmitting ? (
                                                        <>
                                                            <FaSpinner className="animate-spin" />
                                                            Submitting...
                                                        </>
                                                    ) : (
                                                        `${roleId ? "Update" : "Add"} Role`
                                                    )}
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

        </div>
    )
}

export default ListPermission
