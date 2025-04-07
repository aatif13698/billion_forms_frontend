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




function ListClients({ noFade }) {

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
            key: 'serialNumber', header: 'ID', with: "auto",
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
                        {row?.firstName + " " + row?.lastName}
                    </span>
                )
            }
        },
        {
            key: 'phone', header: 'Phone', width: '200px',
            render: (value) => {
                return (
                    <span className={`whitespace-nowrap  text-black dark:text-white  rounded-md`} >
                        {value}
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
            key: 'companyId', header: 'Company Name', with: "auto",
            render: (value, row) => {
                const name = value ? value?.name : ""
                return (
                    <span className={`${name ? "bg-blue-500/30" : "bg-red-500/50"} text-[.80rem] whitespace-nowrap font-bold text-black dark:text-white px-2 py-1 rounded-md`} >
                        {name ? name : "Not Created Yet"}
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
                            onClick={() => handleView(row?._id)}
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

    async function getClients(currentPage, rowsPerPage, text) {
        try {
            const response = await clientService.getClients(currentPage, rowsPerPage, text);
            return response
        } catch (error) {
            throw error
        }
    }

    async function handleView(id) {
        try {
            setShowLoadingModal(true)
            const response = await clientService.getParticularClient(id);
            setShowLoadingModal(false);
            setTimeout(() => {
                navigate("/create/clients", { state: { client: response?.data?.data?.data } })
            }, 600);
        } catch (error) {
            setShowLoadingModal(false)
            console.log("error while getting client data", error);
        }
    }


    async function handleDelete(currentPage, rowsPerPage, text, id) {
        try {
            const dataObject = {
                clientId: id,
                keyword: text,
                page: currentPage,
                perPage: rowsPerPage
            }
            setShowLoadingModal(true)
            const response = await clientService.softDeleteClient(dataObject);
            setUpdatedData(response.data?.data?.data)
            setShowLoadingModal(false);
        } catch (error) {
            setShowLoadingModal(false)
            console.log("error while getting company data", error);
        }
    }


    async function handleRestore(currentPage, rowsPerPage, text, id) {
        try {
            const dataObject = {
                clientId: id,
                keyword: text,
                page: currentPage,
                perPage: rowsPerPage
            }
            setShowLoadingModal(true)
            const response = await clientService.restoreClient(dataObject);
            setUpdatedData(response.data?.data?.data)
            setShowLoadingModal(false);
        } catch (error) {
            setShowLoadingModal(false)
            console.log("error while getting client data", error);
        }
    }


    async function handleActiveInactive(currentPage, rowsPerPage, text, status, id) {
        try {
            const dataObject = {
                status: status ? "0" : "1",
                clientId: id,
                keyword: text,
                page: currentPage,
                perPage: rowsPerPage
            }
            setShowLoadingModal(true)
            const response = await clientService.activeInactive(dataObject);

            setUpdatedData(response.data?.data?.data)
            setShowLoadingModal(false)


        } catch (error) {
            setShowLoadingModal(false)

            console.log("error while active inactive status", error);
        }
    }

    function buttonAction() {
        navigate("/create/clients")
    }


    return (
        <div className="flex flex-col md:mx-4  mx-2     mt-3 min-h-screen bg-light dark:bg-dark">
            <Hamberger text={"Client / List"} />
            <div
             className="bg-cardBgLight dark:bg-cardBgDark rounded-lg shadow-md md:p-6 p-2 mb-6"
             >
                <CustomTable
                    columns={columns}
                    fetchData={getClients}
                    headerBackground={isDark ? "#000000" : "#3f8e90"}
                    headerTextColor="#fff"
                    rowBackground={isDark ? "rgb(59 64 65)" : "#fff"}
                    rowTextColor={isDark ? "#fff" : "#3f8e90"}
                    alternateRowBackground={isDark ? "#333" : "#f9f9f9"}
                    defaultRowsPerPage={10}
                    buttonName={"Create Client"}
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

export default ListClients
