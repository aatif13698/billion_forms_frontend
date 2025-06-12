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
import authSrvice from '../../services/authSrvice';
import { useSelector } from 'react-redux';
import { BsDot } from "react-icons/bs";
import organizationService from '../../services/organizationService';
import { MdOutlineRemoveRedEye } from 'react-icons/md';





function UserList({ noFade }) {

    const { clientUser: currentUser } = useSelector((state) => state.authCustomerSlice);
    const { capability } = useSelector((state) => state.capabilitySlice);
    const [permission, setPermission] = useState(null);

    const [showLoadingModal, setShowLoadingModal] = useState(false);
    const handleCloseLoadingModal = () => {
        setShowLoadingModal(false);
    };
    const [companyData, setCompanyData] = useState(null)


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
            key: 'organization', header: 'Organizations', with: "auto",
            render: (value, row) => {
                const organizationName = value?.length > 0 ? value?.map((item) => item?.name) : [];
                console.log("organizationName", organizationName);
                return (



                    <div className='flex flex-col'>

                        {
                            value && value?.length > 0 ? value?.map((item) => {
                                return (
                                    <p
                                        onClick={() => viewOrganization(item?._id)}
                                        className={` cursor-pointer flex items-center text-[.90rem] whitespace-nowrap  font-bold text-blue-800 dark:text-white px-2 py-1 rounded-md`} >
                                        <BsDot />
                                        <span>{item?.name}</span>
                                    </p>
                                )
                            }) : "No Organization Assigned"
                        }

                    </div>

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
                    <Tippy
                        content={"Edit"}
                        placement="top"
                        theme="custom"
                    >
                        <button
                            className='bg-hambergerLight dark:bg-hambergerDark p-2 rounded-md'
                            onClick={() => handleEdit(row?._id)}
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

    async function viewOrganization(id) {
        try {
            setShowLoadingModal(true);
            const response = await organizationService.getParticularOrganization(id);
            setShowLoadingModal(false);
            setTimeout(() => {
                navigate("/view/organization", { state: { organization: response?.data?.data?.data } })
            }, 600);
        } catch (error) {
            setShowLoadingModal(false);
            console.log("error while getting the particular organization", error);
        }
    }

    async function getUsers(currentPage, rowsPerPage, text) {
        try {
            const response = await clientService.getUser(currentPage, rowsPerPage, text, currentUser?.companyId);
            return response
        } catch (error) {
            throw error
        }
    }

    async function handleView(id) {
        try {
            if (permission && permission[0].subMenus?.view?.access) {
                setShowLoadingModal(true)
                const response = await clientService.getParticularClient(id);
                setShowLoadingModal(false);
                setTimeout(() => {
                    navigate("/view/user", { state: { client: response?.data?.data?.data } })
                }, 600);
            } else {
                alert("Unauthorize to access this!")
            }
        } catch (error) {
            setShowLoadingModal(false)
            console.log("error while getting user data", error);
        }
    }

      async function handleEdit(id) {
        try {
            if (permission && permission[0].subMenus?.update?.access) {
                setShowLoadingModal(true)
                const response = await clientService.getParticularClient(id);
                setShowLoadingModal(false);
                setTimeout(() => {
                    navigate("/update/user", { state: { client: response?.data?.data?.data } })
                }, 600);
            } else {
                alert("Unauthorize to access this!")
            }
        } catch (error) {
            setShowLoadingModal(false)
            console.log("error while getting user data", error);
        }
    }


    async function handleDelete(currentPage, rowsPerPage, text, id) {
        try {
            if (permission && permission[0].subMenus?.softDelete?.access) {
                const dataObject = {
                    clientId: id,
                    keyword: text,
                    page: currentPage,
                    perPage: rowsPerPage,
                    companyId: currentUser?.companyId
                }
                setShowLoadingModal(true)
                const response = await clientService.softDeleteUser(dataObject);
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
                    perPage: rowsPerPage,
                    companyId: currentUser?.companyId
                }
                setShowLoadingModal(true)
                const response = await clientService.restoreUser(dataObject);
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


    async function handleActiveInactive(currentPage, rowsPerPage, text, status, id) {
        try {
            if (permission && permission[0].subMenus?.update?.access) {
                const dataObject = {
                    status: status ? "0" : "1",
                    clientId: id,
                    keyword: text,
                    page: currentPage,
                    perPage: rowsPerPage,
                    companyId: currentUser?.companyId
                }
                setShowLoadingModal(true)
                const response = await clientService.activeInactiveUser(dataObject);
                setUpdatedData(response.data?.data?.data)
                setShowLoadingModal(false)
            } else {
                alert("Unauthorize to access this!")
            }
        } catch (error) {
            setShowLoadingModal(false)
            console.log("error while active inactive status", error);
        }
    }

    function buttonAction() {
        if (permission && permission[0].subMenus?.create?.access) {
             navigate("/create/user")
        } else {
            alert("Unauthorize to access this!")
        }
    }


    useEffect(() => {
        if (capability && capability?.length > 0) {
            const administration = capability?.filter((item) => item?.name == "Administration");
            const menu = administration[0].menu;
            const permission = menu?.filter((menu) => menu?.name == "User");
            setPermission(permission);
            if (!permission[0].subMenus?.view?.access) {
                alert("Unauthorize to access this!");
                navigate("/home")
            }
        }
    }, [capability])

    return (
        <div className="flex flex-col md:mx-4  mx-2     mt-3 min-h-screen bg-light dark:bg-dark">
            <Hamberger text={"User / List"} />
            <div
                className="bg-cardBgLight dark:bg-cardBgDark rounded-lg shadow-lg md:p-6 p-2 mb-6"
            >
                <CustomTable
                    columns={columns}
                    fetchData={getUsers}
                    headerBackground={isDark ? "#00868d" : "#3f8e90"}
                    headerTextColor="#fff"
                    rowBackground={isDark ? "rgb(7 38 44)" : "#fff"}
                    rowTextColor={isDark ? "#fff" : "#3f8e90"}
                    alternateRowBackground={isDark ? "#16414ca3" : "#80abb124"}
                    defaultRowsPerPage={10}
                    buttonName={"Create User"}
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

export default UserList
