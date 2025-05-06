





// import React, { useEffect, useState, useMemo } from 'react';
// import { useParams } from 'react-router-dom';
// import { FaEnvelope, FaExclamationCircle } from 'react-icons/fa';
// import PropTypes from 'prop-types';
// import Hamberger from '../../components/Hamberger/Hamberger';
// import common from '../../helper/common';
// import sessionService from '../../services/sessionService';
// import customFieldService from '../../services/customFieldService';
// import LoadingSpinner from '../../components/Loading/LoadingSpinner';
// import styles from '../../components/CustomTable/CustomTable.module.css';


// // Error Message Component
// const ErrorMessage = ({ message }) => (
//     <div className="flex justify-center items-center min-h-screen">
//         <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 p-4 rounded-lg shadow-lg">
//             <p className="text-sm md:text-base">{message}</p>
//         </div>
//     </div>
// );

// ErrorMessage.propTypes = {
//     message: PropTypes.string.isRequired,
// };

// // Pagination Component
// const Pagination = ({ currentPage, totalPages, onPageChange }) => (
//     <div className="flex justify-center items-center space-x-2 mt-4">
//         <button
//             onClick={() => onPageChange(currentPage - 1)}
//             disabled={currentPage === 1}
//             className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded disabled:opacity-50"
//             aria-label="Previous page"
//         >
//             Previous
//         </button>
//         {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//             <button
//                 key={page}
//                 onClick={() => onPageChange(page)}
//                 className={`px-3 py-1 rounded ${page === currentPage
//                     ? 'bg-blue-500 text-white'
//                     : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
//                     }`}
//                 aria-current={page === currentPage ? 'page' : undefined}
//             >
//                 {page}
//             </button>
//         ))}
//         <button
//             onClick={() => onPageChange(currentPage + 1)}
//             disabled={currentPage === totalPages}
//             className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded disabled:opacity-50"
//             aria-label="Next page"
//         >
//             Next
//         </button>
//     </div>
// );

// Pagination.propTypes = {
//     currentPage: PropTypes.number.isRequired,
//     totalPages: PropTypes.number.isRequired,
//     onPageChange: PropTypes.func.isRequired,
// };

// function ListForm() {
//     const { sessionId: encryptedId } = useParams();
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [organizationData, setOrganizationData] = useState(null);
//     const [sessionData, setSessionData] = useState(null);
//     const [formsData, setFormsData] = useState([]);
//     const [searchQuery, setSearchQuery] = useState('');
//     const [currentPage, setCurrentPage] = useState(1);
//     const [rowsPerPage, setRowsPerPage] = useState(5);

//     const itemsPerPage = 10;

//     // Fetch data
//     useEffect(() => {
//         const fetchData = async () => {
//             if (!encryptedId) {
//                 setError('No session ID provided');
//                 setIsLoading(false);
//                 return;
//             }

//             try {
//                 const decryptedId = common.decryptId(encryptedId);
//                 if (!decryptedId) {
//                     throw new Error('Invalid or corrupted session ID');
//                 }

//                 const [sessionResponse, formsResponse] = await Promise.all([
//                     sessionService.getSession(decryptedId).catch(() => {
//                         throw new Error('Failed to fetch session data');
//                     }),
//                     customFieldService.getAllFormsBySession(decryptedId).catch(() => {
//                         throw new Error('Failed to fetch forms data');
//                     }),
//                 ]);

//                 const session = sessionResponse?.data?.data?.data;
//                 if (!session) {
//                     throw new Error('No session data found');
//                 }

//                 const forms = formsResponse?.data?.data?.data || [];
//                 setOrganizationData(session.organizationId);
//                 setSessionData(session);
//                 setFormsData(forms);
//                 setIsLoading(false);
//             } catch (err) {
//                 setError(err.message || 'An unexpected error occurred');
//                 setIsLoading(false);
//             }
//         };

//         fetchData();
//     }, [encryptedId]);

//     // Parse JSON strings safely
//     const parseValue = (value) => {
//         try {
//             if (typeof value === 'string' && (value.startsWith('{') || value.startsWith('['))) {
//                 const parsed = JSON.parse(value);
//                 if (Array.isArray(parsed)) {
//                     return parsed.map((item) => item.label || item.value).join(', ');
//                 }
//                 return parsed.label || parsed.value || value;
//             }
//             return value;
//         } catch {
//             return value;
//         }
//     };

//     // Get dynamic columns from otherThanFiles
//     const columns = useMemo(() => {
//         const fixedColumns = [
//             { key: 'serialNumber', label: 'Serial Number' },
//             //   { key: 'firstName', label: 'First Name' },
//             //   { key: 'phone', label: 'Phone' },
//             { key: 'createdAt', label: 'Created At', format: (value) => new Date(value).toLocaleDateString() },
//         ];

//         const dynamicKeys = new Set();
//         formsData.forEach((form) => {
//             if (form.otherThanFiles) {
//                 Object.keys(form.otherThanFiles).forEach((key) => dynamicKeys.add(key));
//             }
//         });

//         const dynamicColumns = Array.from(dynamicKeys).map((key) => ({
//             key: `otherThanFiles.${key}`,
//             label: key,
//         }));

//         return [...fixedColumns, ...dynamicColumns];
//     }, [formsData]);

//     // Filter forms based on search query
//     const filteredForms = useMemo(() => {
//         if (!searchQuery) return formsData;

//         const lowerQuery = searchQuery.toLowerCase().trim();
//         return formsData.filter((form) => {
//             const values = [
//                 form.serialNumber,
//                 form.firstName,
//                 form.phone,
//                 ...Object.values(form.otherThanFiles || {}),
//             ].map((value) => parseValue(value)?.toString().toLowerCase());
//             return values.some((value) => value?.includes(lowerQuery));
//         });
//     }, [formsData, searchQuery]);

//     // Paginate filtered forms
//     const totalPages = Math.ceil(filteredForms.length / itemsPerPage);
//     const paginatedForms = useMemo(() => {
//         const start = (currentPage - 1) * itemsPerPage;
//         return filteredForms.slice(start, start + itemsPerPage);
//     }, [filteredForms, currentPage]);

//     // Handle page change
//     const handlePageChange = (page) => {
//         if (page >= 1 && page <= totalPages) {
//             setCurrentPage(page);
//         }
//     };

//     const handleRowsPerPageChange = (e) => {
//         setRowsPerPage(Number(e.target.value));
//         setCurrentPage(1);
//     };

//     // Conditional Rendering
//     if (isLoading) {
//         return <LoadingSpinner />;
//     }

//     if (error) {
//         return <ErrorMessage message={error} />;
//     }

//     return (
//         <div className="flex flex-col md claw mx-4  mt-3 min-h-screen bg-light dark:bg-dark">
//             <Hamberger text="Forms / List" />
//             <div className="w-[100%] mb-4 bg-cardBgLight dark:bg-cardBgDark shadow-lg rounded-lg p-1">
//                 <div className="relative bg-light dark:bg-transparent overflow-hidden transition-transform duration-300">
//                     <div className="absolute inset-0 bg-cover" />
//                     <div className="relative z-10 hover:bg-opacity-40 flex flex-col justify-start py-6 px-4">
//                         {/* Organization and Session Details */}
//                         <div className="text-left text-textLight dark:text-textDark w-full">
//                             <h2 className="text-md md:text-4xl font-bold mb-2 drop-shadow-md">
//                                 {`${organizationData?.name || 'Unknown Organization'} - ${sessionData?.for || ''} (${sessionData?.name || 'Unknown Session'})`}
//                             </h2>
//                             <h4 className="text-sm md:text-base text-gray-600 dark:text-white font-medium mb-1 drop-shadow-sm">
//                                 {organizationData?.captionText || 'No caption available'}
//                             </h4>
//                             <div className="flex text-gray-600 dark:text-white items-center text-sm md:text-base font-medium mb-1 drop-shadow-sm">
//                                 <FaEnvelope className="mr-2" aria-hidden="true" />
//                                 <span>{organizationData?.email || 'No email available'}</span>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Forms Table */}
//             <div className="w-[100%] bg-cardBgLight dark:bg-cardBgDark shadow-lg rounded-lg p-4 mb-20">
//                 <h3 className="text-lg md:text-2xl font-semibold text-textLight dark:text-textDark mb-4">
//                     Forms List
//                 </h3>

//                 {/* Search Filter */}
//                 <div className="mb-4">
//                     <input
//                         type="text"
//                         value={searchQuery}
//                         onChange={(e) => {
//                             setSearchQuery(e.target.value);
//                             setCurrentPage(1); // Reset to first page on search
//                         }}
//                         placeholder="Search forms..."
//                         className="w-full md:w-1/3 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-light dark:bg-dark text-textLight dark:text-textDark focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         aria-label="Search forms"
//                     />
//                 </div>

//                 {filteredForms.length > 0 ? (
//                     <>
//                         <div
//                         // className={styles.tableContainer}
//                         >
//                             <div
//                                 // className={styles.tableWrapper}
//                                 className='overflow-auto rounded-lg'
//                             >
//                                 <table
//                                     className="w-full border-2 border-t-0 text-sm md:text-base text-textLight dark:text-textDark"
//                                     role="grid"
//                                     aria-label="Forms table"
//                                 >
//                                     <thead>
//                                         <tr className="bg-[#3f8e90] text-white ">
//                                             {columns.map((col) => (
//                                                 <th
//                                                     key={col.key}
//                                                     className=" whitespace-nowrap py-4  px-4 text-left font-bold  "
//                                                     scope="col"
//                                                 >
//                                                     {col.label}
//                                                 </th>
//                                             ))}
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {paginatedForms.map((form) => (
//                                             <tr
//                                                 key={form._id.$oid}
//                                                 className="border-b border-gray-200 text-dark/80 dark:text-white dark:border-gray-700 hover:bg-[#3f8e90]/20 dark:hover:bg-[#3f8e90]/15"
//                                             >
//                                                 {columns.map((col) => {
//                                                     let value;
//                                                     if (col.key.includes('otherThanFiles.')) {
//                                                         const key = col.key.split('.')[1];
//                                                         value = form.otherThanFiles?.[key];
//                                                     } else {
//                                                         value = form[col.key];
//                                                     }
//                                                     value = parseValue(value);
//                                                     if (col.format) {
//                                                         value = col.format(value);
//                                                     }
//                                                     return (
//                                                         <td key={col.key} className="py-2 px-4  ">
//                                                             {value || '-'}
//                                                         </td>
//                                                     );
//                                                 })}
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </table>


//                             </div>

//                         </div>
//                         {/* <div className="overflow-x-auto">
//                             <table
//                                 className="w-full text-sm md:text-base text-textLight dark:text-textDark"
//                                 role="grid"
//                                 aria-label="Forms table"
//                             >
//                                 <thead>
//                                     <tr className="bg-gray-100 dark:bg-gray-800">
//                                         {columns.map((col) => (
//                                             <th
//                                                 key={col.key}
//                                                 className="py-2 px-4 text-left font-medium text-gray-700 dark:text-gray-300"
//                                                 scope="col"
//                                             >
//                                                 {col.label}
//                                             </th>
//                                         ))}
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {paginatedForms.map((form) => (
//                                         <tr
//                                             key={form._id.$oid}
//                                             className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
//                                         >
//                                             {columns.map((col) => {
//                                                 let value;
//                                                 if (col.key.includes('otherThanFiles.')) {
//                                                     const key = col.key.split('.')[1];
//                                                     value = form.otherThanFiles?.[key];
//                                                 } else {
//                                                     value = form[col.key];
//                                                 }
//                                                 value = parseValue(value);
//                                                 if (col.format) {
//                                                     value = col.format(value);
//                                                 }
//                                                 return (
//                                                     <td key={col.key} className="py-2 px-4">
//                                                         {value || '-'}
//                                                     </td>
//                                                 );
//                                             })}
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div> */}
//                         <div className={styles.pagination}>
//                             <div className={styles.rowsPerPage}>
//                                 <span className='text-[.70rem]'>Rows per page:</span>
//                                 <select className='text-black dark:text-white bg-white dark:bg-cardBgDark'
//                                     value={rowsPerPage}
//                                     onChange={handleRowsPerPageChange}
//                                 >
//                                     {[5, 10, 20, 50].map((option, index) => (
//                                         <option className='text-black dark:text-white py-1 text-[.70rem]' key={index} value={option}>
//                                             {option}
//                                         </option>
//                                     ))}
//                                 </select>
//                             </div>
//                             <div className={styles.pageControls}>
//                                 <button
//                                     onClick={() => handlePageChange(currentPage - 1)}
//                                     disabled={currentPage === 1}
//                                     className=' text-black dark:text-white px-2 py-1 text-[.7rem]'
//                                 >
//                                     Previous
//                                 </button>
//                                 <span className='text-[.70rem]'>
//                                     Page {currentPage} of {totalPages}
//                                 </span>
//                                 <button
//                                     onClick={() => handlePageChange(currentPage + 1)}
//                                     disabled={currentPage === totalPages}
//                                     className=' text-black dark:text-white px-2 py-1 text-[.7rem]'
//                                 >
//                                     Next
//                                 </button>
//                             </div>
//                         </div>

//                     </>
//                 ) : (
//                     <div className="flex mt-4 flex-col justify-center items-center py-8 sm:py-12 bg-gray-100 dark:bg-gray-900 rounded-xl shadow-sm">
//                         <FaExclamationCircle className="text-3xl sm:text-4xl text-gray-400 dark:text-gray-500  sm:mb-4" />
//                         <p className="text-sm md:text-lg text-center text-gray-600 dark:text-white">
//                             No data available
//                         </p>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }

// export default ListForm;



import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { FaEnvelope, FaExclamationCircle } from 'react-icons/fa';
import PropTypes from 'prop-types';
import Hamberger from '../../components/Hamberger/Hamberger';
import common from '../../helper/common';
import sessionService from '../../services/sessionService';
import customFieldService from '../../services/customFieldService';
import LoadingSpinner from '../../components/Loading/LoadingSpinner';
import styles from '../../components/CustomTable/CustomTable.module.css';

// Error Message Component
const ErrorMessage = ({ message }) => (
    <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 p-4 rounded-lg shadow-lg">
            <p className="text-sm md:text-base">{message}</p>
        </div>
    </div>
);

ErrorMessage.propTypes = {
    message: PropTypes.string.isRequired,
};

// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange, rowsPerPage, onRowsPerPageChange }) => (
    <div className={styles.pagination}>
        <div className={styles.rowsPerPage}>
            <span className="text-[.70rem]">Rows per page:</span>
            <select
                className="text-black dark:text-white bg-white dark:bg-cardBgDark"
                value={rowsPerPage}
                onChange={onRowsPerPageChange}
            >
                {[5, 10, 20, 50].map((option) => (
                    <option key={option} value={option} className="text-black dark:text-white py-1 text-[.70rem]">
                        {option}
                    </option>
                ))}
            </select>
        </div>
        <div className={styles.pageControls}>
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="text-white bg-blue-700 dark:text-white px-2 py-2 text-[.8rem]"
                aria-label="Previous page"
            >
                Previous
            </button>
            <span className="text-[.70rem]">
                Page {currentPage} of {totalPages}
            </span>
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="text-white bg-green-700 dark:text-white px-2 py-2 text-[.8rem]"
                aria-label="Next page"
            >
                Next
            </button>
        </div>
    </div>
);

Pagination.propTypes = {
    currentPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
    onRowsPerPageChange: PropTypes.func.isRequired,
};

function ListForm() {
    const { sessionId: encryptedId } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [organizationData, setOrganizationData] = useState(null);
    const [sessionData, setSessionData] = useState(null);
    const [formsData, setFormsData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    // Fetch data
    useEffect(() => {
        const fetchData = async () => {
            if (!encryptedId) {
                setError('No session ID provided');
                setIsLoading(false);
                return;
            }

            try {
                const decryptedId = common.decryptId(encryptedId);
                if (!decryptedId) {
                    throw new Error('Invalid or corrupted session ID');
                }

                const [sessionResponse, formsResponse] = await Promise.all([
                    sessionService.getSession(decryptedId).catch(() => {
                        throw new Error('Failed to fetch session data');
                    }),
                    customFieldService.getAllFormsBySession(decryptedId).catch(() => {
                        throw new Error('Failed to fetch forms data');
                    }),
                ]);

                const session = sessionResponse?.data?.data?.data;
                if (!session) {
                    throw new Error('No session data found');
                }

                const forms = formsResponse?.data?.data?.data || [];
                setOrganizationData(session.organizationId);
                setSessionData(session);
                setFormsData(forms.reverse());
                setIsLoading(false);
            } catch (err) {
                setError(err.message || 'An unexpected error occurred');
                setIsLoading(false);
            }
        };

        fetchData();
    }, [encryptedId]);

    // Parse JSON strings safely
    const parseValue = (value) => {
        try {
            if (typeof value === 'string' && (value.startsWith('{') || value.startsWith('['))) {
                const parsed = JSON.parse(value);
                if (Array.isArray(parsed)) {
                    return parsed.map((item) => item.label || item.value).join(', ');
                }
                return parsed.label || parsed.value || value;
            }
            return value;
        } catch {
            return value;
        }
    };

    // Get dynamic columns from otherThanFiles
    const columns = useMemo(() => {
        const fixedColumns = [
            { key: 'serialNumber', label: 'Serial Number' },
            { key: 'createdAt', label: 'Created At', format: (value) => new Date(value).toLocaleDateString() },
        ];

        const dynamicKeys = new Set();
        formsData.forEach((form) => {
            if (form.otherThanFiles) {
                Object.keys(form.otherThanFiles).forEach((key) => dynamicKeys.add(key));
            }
        });

        const dynamicColumns = Array.from(dynamicKeys).map((key) => ({
            key: `otherThanFiles.${key}`,
            label: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize label
        }));

        return [...fixedColumns, ...dynamicColumns];
    }, [formsData]);

    // Filter forms based on search query
    const filteredForms = useMemo(() => {
        if (!searchQuery) return formsData;

        const lowerQuery = searchQuery.toLowerCase().trim();
        return formsData.filter((form) => {
            const values = [
                form.serialNumber,
                form.firstName,
                form.phone,
                ...Object.values(form.otherThanFiles || {}),
            ].map((value) => parseValue(value)?.toString().toLowerCase());
            return values.some((value) => value?.includes(lowerQuery));
        });
    }, [formsData, searchQuery]);

    // Paginate filtered forms
    const totalPages = Math.ceil(filteredForms.length / rowsPerPage);
    const paginatedForms = useMemo(() => {
        const start = (currentPage - 1) * rowsPerPage;
        return filteredForms.slice(start, start + rowsPerPage);
    }, [filteredForms, currentPage, rowsPerPage]);

    // Handle page change
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // Handle rows per page change
    const handleRowsPerPageChange = (e) => {
        const newRowsPerPage = Number(e.target.value);
        setRowsPerPage(newRowsPerPage);
        setCurrentPage(1); // Reset to first page
    };

    // Conditional Rendering
    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <ErrorMessage message={error} />;
    }

    return (
        <div className="flex flex-col md claw mx-4 mt-3 min-h-screen bg-light dark:bg-dark">
            <Hamberger text="Forms / List" />
            <div className="w-[100%] mb-4 bg-cardBgLight dark:bg-cardBgDark shadow-lg rounded-lg p-1">
                <div className="relative bg-light dark:bg-transparent overflow-hidden transition-transform duration-300">
                    <div className="absolute inset-0 bg-cover" />
                    <div className="relative z-10 hover:bg-opacity-40 flex flex-col justify-start py-6 px-4">
                        {/* Organization and Session Details */}
                        <div className="text-left text-textLight dark:text-textDark w-full">
                            <h2 className="text-md md:text-4xl font-bold mb-2 drop-shadow-md">
                                {`${organizationData?.name || 'Unknown Organization'} - ${sessionData?.for || ''} (${sessionData?.name || 'Unknown Session'})`}
                            </h2>
                            <h4 className="text-sm md:text-base text-gray-600 dark:text-white font-medium mb-1 drop-shadow-sm">
                                {organizationData?.captionText || 'No caption available'}
                            </h4>
                            <div className="flex text-gray-600 dark:text-white items-center text-sm md:text-base font-medium mb-1 drop-shadow-sm">
                                <FaEnvelope className="mr-2" aria-hidden="true" />
                                <span>{organizationData?.email || 'No email available'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Forms Table */}
            <div className="w-[100%] bg-cardBgLight dark:bg-cardBgDark shadow-lg rounded-lg p-4 mb-20">
                <h3 className="text-lg md:text-2xl font-semibold text-textLight dark:text-textDark mb-4">
                    Forms List
                </h3>

                {/* Search Filter */}
                <div className="mb-4">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1); // Reset to first page on search
                        }}
                        placeholder="Search forms..."
                        className="w-[100%] md:w-1/3 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-textLight dark:text-textDark focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="Search forms"
                    />
                </div>

                {filteredForms.length > 0 ? (
                    <>
                        <div className="overflow-auto rounded-lg">
                            <table
                                className="w-full border-2 border-t-0 text-sm md:text-base text-textLight dark:text-textDark"
                                role="grid"
                                aria-label="Forms table"
                            >
                                <thead>
                                    <tr className="bg-[#3f8e90] text-white">
                                        {columns.map((col) => (
                                            <th
                                                key={col.key}
                                                className="whitespace-nowrap py-4 px-4 text-left font-bold"
                                                scope="col"
                                            >
                                                {col.label}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedForms.map((form) => (
                                        <tr
                                            key={form._id.$oid}
                                            className="border-b border-gray-200 text-dark/80 dark:text-white dark:border-gray-700 hover:bg-[#3f8e90]/20 dark:hover:bg-[#3f8e90]/15"
                                        >
                                            {columns.map((col) => {
                                                let value;
                                                if (col.key.includes('otherThanFiles.')) {
                                                    const key = col.key.split('.')[1];
                                                    value = form.otherThanFiles?.[key];
                                                } else {
                                                    value = form[col.key];
                                                }
                                                value = parseValue(value);
                                                if (col.format) {
                                                    value = col.format(value);
                                                }
                                                return (
                                                    <td key={col.key} className="py-2 px-4">
                                                        {value || '-'}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={handleRowsPerPageChange}
                        />
                        <div className='flex justify-end '>

                            <span className='text-[.85rem] mx-4 '>
                                Total Data - <span className='font-bold'>{formsData?.length} </span>
                            </span>

                        </div>
                    </>
                ) : (
                    <div className="flex mt-4 flex-col justify-center items-center py-8 sm:py-12 bg-gray-100 dark:bg-gray-900 rounded-xl shadow-sm">
                        <FaExclamationCircle className="text-3xl sm:text-4xl text-gray-400 dark:text-gray-500 sm:mb-4" />
                        <p className="text-sm md:text-lg text-center text-gray-600 dark:text-white">
                            No data available
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ListForm;






