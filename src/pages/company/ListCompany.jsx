import React, { useEffect } from 'react'
import CustomTable from '../../components/CustomTable/CustomTable'
import useDarkmode from '../../Hooks/useDarkMode';
import clientService from '../../services/clientService';
import Hamberger from '../../components/Hamberger/Hamberger';
import { FaRegEye } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import companyService from '../../services/companyService';



function ListCompany() {

    const [isDark] = useDarkmode();
    const navigate = useNavigate()


    const columns = [
        { key: 'serialNumber', header: 'ID',  },
        { key: 'name', header: 'Name', width: 'auto' },
        { key: 'subDomain', header: 'Sub Domain' },
        { key: 'adminEmail', header: 'Email' },
        {
            key: 'isActive',
            header: 'Status',
            render: (value) => {
                console.log("value", value);

                return (
                    <span className={`${value ? "bg-green-500/40" : "bg-red-500/50"} text-[.80rem] font-bold text-black dark:text-white px-2 py-1 rounded-md`} >
                        {value ? "Active" : "InActive"}
                    </span>
                )
            },
        },
        {
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
            const response = await companyService.getCompanies(currentPage, rowsPerPage, text);
            return response
        } catch (error) {
            throw error
        }
    }

    function buttonAction() {
        navigate("/create/company")
    }


    return (
        <div className="flex flex-col md:mx-4  mx-2     mt-3 min-h-screen bg-light dark:bg-dark">
            <Hamberger text={"Company / List"} />
            <div className="bg-cardBgLight dark:bg-cardBgDark rounded-lg shadow-md md:p-6 p-2 mb-6">
                <CustomTable
                    columns={columns}
                    fetchData={getClients}
                    headerBackground={isDark ? "#000000" : "#3f8e90"}
                    headerTextColor="#fff"
                    rowBackground={isDark ? "rgb(59 64 65)" : "#fff"}
                    rowTextColor={isDark ? "#fff" : "#3f8e90"}
                    alternateRowBackground={isDark ? "#333" : "#f9f9f9"}
                    defaultRowsPerPage={10}
                    buttonName={"Create Company"}
                    buttonAction={buttonAction}
                />
            </div>
        </div>
    )
}

export default ListCompany
