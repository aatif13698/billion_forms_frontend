// src/components/CustomTable/CustomTable.js
import React, { useState, useEffect, useCallback } from 'react';
import styles from './CustomTable.module.css';
import Loading from '../Loading/Loading';
import LoadingSpinner from '../Loading/LoadingSpinner';
import { useNavigate } from 'react-router-dom';
import debounceFunction from '../../helper/Debounce';

function CustomTable({
    columns,
    fetchData,
    headerBackground = '#f5f5f5',
    headerTextColor = '#333',
    nodataTextColor = '#000000',
    rowBackground = '#fff',
    rowTextColor = '#666',
    alternateRowBackground = '#fafafa',
    defaultRowsPerPage = 10,
    buttonName,
    buttonAction,
    updatedData,
    currentPage,
    setCurrentPage,
    rowsPerPage,
    setRowsPerPage,
    text,
    setText


}) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    // const [currentPage, setCurrentPage] = useState(1);
    // const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
    const [totalItems, setTotalItems] = useState(0);
    // const [text, setText] = useState("")
    const navigate = useNavigate();

    useEffect(() => {
        loadData();
    }, [currentPage, rowsPerPage]);

    useEffect(() => {
        if (updatedData && updatedData?.length > 0) {
            setData(updatedData)
            setTotalItems(updatedData?.length);
        }
    }, [updatedData])

    const loadData = async () => {
        try {
            setLoading(true);
            const response = await fetchData(currentPage, rowsPerPage, text);
            console.log("aaa", response);

            setData(response.data?.data?.data);
            setTotalItems(response.data?.data?.total);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const totalPages = Math.ceil(totalItems / rowsPerPage);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleRowsPerPageChange = (e) => {
        setRowsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    function handleChange(e) {
        const { value } = e.target;
        setText(value)
        debounceSearch(value);
    }

    const debounceSearch = useCallback(
        debounceFunction(
            async (nextValue) => {
                try {
                    setLoading(true);
                    const response = await fetchData(currentPage, rowsPerPage, nextValue);
                    setData(response.data?.data?.data);
                    setTotalItems(response.data?.data?.total);
                } catch (error) {
                    console.error('Error fetching data:', error);
                } finally {
                    setLoading(false);
                }
            },
            1000
        ),
        []
    );


    return (
        <>

            <div className='flex justify-between md:flex-row flex-col gap-3 '>
                <div>
                    <button
                        onClick={buttonAction}
                        className="w-auto text-sm p-2 text-white py-2 rounded-lg transition-all duration-300 ease-in-out 
                bg-custom-gradient-button-dark dark:bg-custom-gradient-button-light 
                 hover:bg-custom-gradient-button-light dark:hover:bg-custom-gradient-button-dark 
                 flex items-center justify-center shadow-lg"
                    >
                        {buttonName}
                    </button>
                </div>


                <div className='flex justify-center items-center'>
                    <input
                        onChange={handleChange}
                        type="text"
                        name='search'
                        value={text}
                        placeholder='Search...'
                        className="w-[100%] bg-transparent px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>


            <div className={styles.tableContainer}>
                <div className={styles.tableWrapper}>
                    <table
                        className={styles.table}
                        style={{
                            '--header-bg': headerBackground,
                            '--header-color': headerTextColor,
                            '--nodata-color': nodataTextColor,
                            '--row-bg': rowBackground,
                            '--row-color': rowTextColor,
                            '--alternate-row-bg': alternateRowBackground,
                        }}
                    >
                        <thead>
                            <tr>
                                {columns?.map((column, index) => (
                                    <th
                                        key={index}
                                        style={{ width: column.width }}
                                    >
                                        {column.header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={columns.length} className={styles.loadingCell}>

                                        <div className=' flex justify-center items-center'>
                                            <svg
                                                className={`animate-spin mr-2 h-5 w-5  text-black dark:text-white`}
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                ></path>
                                            </svg>

                                            <span className={styles.loader}>Loading...</span>

                                        </div>

                                    </td>
                                </tr>
                            ) : data?.length === 0 ? (
                                <tr>
                                    <td colSpan={columns.length} className={styles.noData}>
                                        No data available
                                    </td>
                                </tr>
                            ) : (
                                data?.map((row, index) => (
                                    <tr key={index}>
                                        {columns.map((column, index) => (
                                            <td key={index}>
                                                {column.render
                                                    ? column.render(row[column.key], row)
                                                    : row[column.key]}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className={styles.pagination}>
                    <div className={styles.rowsPerPage}>
                        <span className='text-[.70rem]'>Rows per page:</span>
                        <select className='text-black dark:text-white bg-white dark:bg-cardBgDark' value={rowsPerPage} onChange={handleRowsPerPageChange}>
                            {[5, 10, 20, 50].map((option, index) => (
                                <option className='text-black dark:text-white py-1 text-[.70rem]' key={index} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className={styles.pageControls}>
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className=' text-black dark:text-white px-2 py-1 text-[.7rem]'
                        >
                            Previous
                        </button>
                        <span className='text-[.70rem]'>
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className=' text-black dark:text-white px-2 py-1 text-[.7rem]'
                        >
                            Next
                        </button>
                    </div>
                </div>

                <div className='flex justify-end '>

                    <span className='text-[.80rem] mx-4 '>
                        Total Data - <span className='font-bold'>{totalItems} </span>
                    </span>

                </div>
            </div>
        </>

    );
}

export default CustomTable;