import React, { useEffect } from 'react'
import CustomTable from '../../components/CustomTable/CustomTable'
import useDarkmode from '../../Hooks/useDarkMode';
import clientService from '../../services/clientService';
import Hamberger from '../../components/Hamberger/Hamberger';
import { FaRegEye } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';



function ListClients() {

    const [isDark] = useDarkmode();
    const navigate = useNavigate()


    const columns = [
        { 
            // key: 'serialNumber', header: 'ID',

            key: 'serialNumber', header: 'ID', with:"auto",

            render: (value) => {
                return (
                    <span className={`whitespace-nowrap  text-black dark:text-white  rounded-md`} >
                        {value}
                    </span>
                )
            }
          },
        { key: 'firstName', header: 'Name', width: '200px' },
        { key: 'phone', header: 'Phone', width: '200px' },
        { key: 'email', header: 'Email' },
        {
            key: 'companyId', header: 'Company Name', with:"auto",

            render: (value) => {
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
            render: (value) => {
                console.log("value", value);

                return (
                    <span className={`${value ? "bg-green-500/60" : "bg-red-500/50"} text-[.80rem] font-bold text-black dark:text-white px-2 py-1 rounded-md`} >
                        {value ? "Active" : "InActive"}
                    </span>
                )
            },
        },
        {
            // key: 'Action',
            header: 'Action',
            render: () => (

                <div className='flex gap-3'>
                    <button>
                        <FaRegEye />
                    </button>
                    <button>
                        <FaTrashAlt />
                    </button>
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

    function buttonAction() {

        navigate("/create/clients")

    }


    return (
        <div className="flex flex-col md:mx-4  mx-2     mt-3 min-h-screen bg-light dark:bg-dark">
            <Hamberger text={"Client / List"} />

            <div className="bg-cardBgLight dark:bg-cardBgDark rounded-lg shadow-md md:p-6 p-2 mb-6">
                {/* <div className='flex justify-between '>

                    <button
                        onClick={() => navigate("/create/clients")}
                        className="w-auto px-4 my-3 text-white py-2 rounded-lg transition-all duration-300 ease-in-out 
                                    bg-custom-gradient-button-light dark:bg-custom-gradient-button-dark 
                                     hover:bg-custom-gradient-button-dark dark:hover:bg-custom-gradient-button-light 
                                     flex items-center justify-center"
                    >
                        Create Client
                    </button>

                    <div className='flex justify-center items-center'>
                        <input type="text" placeholder='Search...'
                            className="w-[100%] bg-transparent p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"

                        />
                    </div>
                </div> */}

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
                />
            </div>



        </div>
    )
}

export default ListClients
