import React, { useEffect, useState, Fragment } from 'react'
import CustomTable from '../../components/CustomTable/CustomTable'
import useDarkmode from '../../Hooks/useDarkMode';
import clientService from '../../services/clientService';
import Hamberger from '../../components/Hamberger/Hamberger';
import { FaRedoAlt, FaRegEdit, FaRegEye } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { Dialog, Transition } from "@headlessui/react";
import LoadingSpinner from '../../components/Loading/LoadingSpinner';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // Optional: default CSS styling
import { useSelector } from 'react-redux';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import demoRequestService from '../../services/demoRequestService';




function DemoRequest({ noFade }) {

    const { capability } = useSelector((state) => state.capabilitySlice);
    const [permission, setPermission] = useState(null);


    const [showLoadingModal, setShowLoadingModal] = useState(false);
    const handleCloseLoadingModal = () => {
        setShowLoadingModal(false);
    };
    const [isDark] = useDarkmode();
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [text, setText] = useState("");
    const [updatedData, setUpdatedData] = useState([])

    const columns = [
        
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
            key: 'phone', header: 'Phone', width: '200px',
            render: (value, row) => {
                return (
                    <span className={`whitespace-nowrap  text-black dark:text-white  rounded-md`} >
                        {row?.phone}
                    </span>
                )
            }
        },
        {
            key: 'email', header: 'Email',
            render: (value) => {
                return (
                    <span className={`whitespace-nowrap  text-black dark:text-white  rounded-md`} >
                        {value}
                    </span>
                )
            }
        },
        {
            key: 'message', header: 'Message',
            render: (value) => {
                return (
                    <span className={`whitespace-nowrap  text-black dark:text-white  rounded-md`} >
                        {value}
                    </span>
                )
            }
        },
        {
            header: 'Action',
            render: (value, row) => (
                <div className='flex gap-3'>
                    <Tippy
                        content={"View"}
                        placement="top"
                        theme="custom"
                    >
                        <button
                            className='bg-hambergerLight dark:bg-hambergerDark p-2 rounded-md'
                            onClick={() => handleView(row?._id)}
                        >
                            <MdOutlineRemoveRedEye />
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

    async function getRequest(currentPage, rowsPerPage, text) {
        try {
            const response = await demoRequestService.getDemoRequest(currentPage, rowsPerPage, text);
            return response
        } catch (error) {
            throw error
        }
    }

    async function handleView(id) {
        try {
            if (permission && permission[0].subMenus?.view?.access) {
                setShowLoadingModal(true);
                const response = await demoRequestService.getParticularRequest(id);
                setShowLoadingModal(false);
                setTimeout(() => {
                    navigate("/view/request", { state: { client: response?.data?.data?.data } })
                }, 600);
            } else {
                alert("Unauthorize to access this!")
            }
        } catch (error) {
            setShowLoadingModal(false)
            console.log("error while getting client data", error);
        }
    }


    async function handleDelete(currentPage, rowsPerPage, text, id) {
        try {
            if (permission && permission[0].subMenus?.softDelete?.access) {
                const dataObject = {
                    clientId: id,
                    keyword: text,
                    page: currentPage,
                    perPage: rowsPerPage
                }
                setShowLoadingModal(true)
                const response = await demoRequestService.softDeleteRequest(dataObject);
                setUpdatedData(response.data?.data?.data)
                setShowLoadingModal(false);
            } else {
                alert("Unauthorize to access this!")
            }
        } catch (error) {
            setShowLoadingModal(false)
            console.log("error while getting company data", error);
        }
    }


    async function handleRestore(currentPage, rowsPerPage, text, id) {
        try {
            if (permission && permission[0].subMenus?.update?.access) {
                const dataObject = {
                    clientId: id,
                    keyword: text,
                    page: currentPage,
                    perPage: rowsPerPage
                }
                setShowLoadingModal(true)
                const response = await demoRequestService.restoreRequest(dataObject);
                setUpdatedData(response.data?.data?.data)
                setShowLoadingModal(false);
            } else {
                alert("Unauthorize to access this!")
            }
        } catch (error) {
            setShowLoadingModal(false)
            console.log("error while getting client data", error);
        }
    }


   

    function buttonAction() {
        if (permission && permission[0].subMenus?.create?.access) {
            navigate("/create/request")
        } else {
            alert("Unauthorize to access this!")
        }
    }


    useEffect(() => {
        if (capability && capability?.length > 0) {
            const administration = capability?.filter((item) => item?.name == "Administration");
            const menu = administration[0].menu;
            const permission = menu?.filter((menu) => menu?.name == "Request");
            setPermission(permission);
            if (!permission[0].subMenus?.view?.access) {
                alert("Unauthorize to access this!");
                navigate("/home")
            }
        }
    }, [capability])


    return (
        <div className="flex flex-col md:mx-4  mx-2     mt-3 min-h-screen bg-light dark:bg-dark">
            <Hamberger text={"Request / List"} />
            <div
                className="bg-cardBgLight dark:bg-cardBgDark rounded-lg shadow-lg md:p-6 p-2 mb-6"
            >
                <CustomTable
                    columns={columns}
                    fetchData={getRequest}
                    headerBackground={isDark ? "#00868d" : "#3f8e90"}
                    headerTextColor="#fff"
                    rowBackground={isDark ? "rgb(7 38 44)" : "#fff"}
                    rowTextColor={isDark ? "#fff" : "#3f8e90"}
                    alternateRowBackground={isDark ? "#16414ca3" : "#80abb124"}
                    defaultRowsPerPage={10}
                    buttonName={"Create Request"}
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

        </div>
    )
}

export default DemoRequest
