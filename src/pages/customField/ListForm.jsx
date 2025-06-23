

// import React, { useEffect, useState, useMemo } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { FaEnvelope, FaExclamationCircle, FaRegEye, FaTrashAlt } from 'react-icons/fa';
// import PropTypes from 'prop-types';
// import * as XLSX from 'xlsx';
// import Swal from 'sweetalert2';
// import { FiDownload } from 'react-icons/fi';
// import Hamberger from '../../components/Hamberger/Hamberger';
// import common from '../../helper/common';
// import sessionService from '../../services/sessionService';
// import customFieldService from '../../services/customFieldService';
// import LoadingSpinner from '../../components/Loading/LoadingSpinner';
// import styles from '../../components/CustomTable/CustomTable.module.css';
// import io from 'socket.io-client';
// import { useSelector } from 'react-redux';
// import { v4 as uuidv4 } from 'uuid';

// console.log("VITE_SOCKET_API_URL", import.meta.env.VITE_SOCKET_API_URL);

// let socket;

// if (import.meta.env.VITE_NODE_ENV == "development") {
//   socket = io(import.meta.env.VITE_SOCKET_API_URL);
// } else {
//   socket = io(import.meta.env.VITE_SOCKET_API_URL, {
//     path: '/api/socket.io',
//   });
// }

// // Error Message Component
// const ErrorMessage = ({ message }) => (
//   <div className="flex justify-center items-center min-h-screen">
//     <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 p-4 rounded-lg shadow-lg">
//       <p className="text-sm md:text-base">{message}</p>
//     </div>
//   </div>
// );

// ErrorMessage.propTypes = {
//   message: PropTypes.string.isRequired,
// };

// // Pagination Component
// const Pagination = ({ currentPage, totalPages, onPageChange, rowsPerPage, onRowsPerPageChange }) => (
//   <div className={styles.pagination}>
//     <div className={styles.rowsPerPage}>
//       <span className="text-[.70rem]">Rows per page:</span>
//       <select
//         className="text-black dark:text-white bg-white dark:bg-cardBgDark"
//         value={rowsPerPage}
//         onChange={onRowsPerPageChange}
//       >
//         {[5, 10, 20, 50].map((option) => (
//           <option key={option} value={option} className="text-black dark:text-white py-1 text-[.70rem]">
//             {option}
//           </option>
//         ))}
//       </select>
//     </div>
//     <div className={styles.pageControls}>
//       <button
//         onClick={() => onPageChange(currentPage - 1)}
//         disabled={currentPage === 1}
//         className="text-white bg-blue-700 dark:text-white px-2 py-1 text-[.7rem]"
//         aria-label="Previous page"
//       >
//         Previous
//       </button>
//       <span className="text-[.70rem]">
//         Page {currentPage} of {totalPages}
//       </span>
//       <button
//         onClick={() => onPageChange(currentPage + 1)}
//         disabled={currentPage === totalPages}
//         className="text-white bg-green-700 dark:text-white px-2 py-1 text-[.7rem]"
//         aria-label="Next page"
//       >
//         Next
//       </button>
//     </div>
//   </div>
// );

// Pagination.propTypes = {
//   currentPage: PropTypes.number.isRequired,
//   totalPages: PropTypes.number.isRequired,
//   onPageChange: PropTypes.func.isRequired,
//   rowsPerPage: PropTypes.number.isRequired,
//   onRowsPerPageChange: PropTypes.func.isRequired,
// };

// function ListForm() {
//   const { sessionId: encryptedId } = useParams();
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [organizationData, setOrganizationData] = useState(null);
//   const [sessionData, setSessionData] = useState(null);
//   const [formsData, setFormsData] = useState([]);
//   const [filesName, setFilesName] = useState([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [isDownloading, setIsDownloading] = useState(false);
//   const [isCopying, setIsCopying] = useState(false);
//   const [downloadJobs, setDownloadJobs] = useState({});
//   const [serialNumberLimit, setSerialNumberLimit] = useState('');
//   const { clientUser: currentUser } = useSelector((state) => state.authCustomerSlice);
//   const [refreshCount, setRefreshCount] = useState(0);
//   const [enableAll, setEnableAll] = useState(false)
//   const navigate = useNavigate();

//   console.log("serialNumberLimit", serialNumberLimit);
//   console.log("sessionData", sessionData);



//   // Fetch data
//   useEffect(() => {
//     const fetchData = async () => {
//       if (!encryptedId) {
//         setError('No session ID provided');
//         setIsLoading(false);
//         return;
//       }

//       try {
//         const decryptedId = common.decryptId(encryptedId);
//         if (!decryptedId) {
//           throw new Error('Invalid or corrupted session ID');
//         }

//         const [sessionResponse, formsResponse] = await Promise.all([
//           sessionService.getSession(decryptedId).catch(() => {
//             throw new Error('Failed to fetch session data');
//           }),
//           customFieldService.getAllFormsBySession(decryptedId, enableAll).catch(() => {
//             throw new Error('Failed to fetch forms data');
//           }),
//         ]);

//         const session = sessionResponse?.data?.data?.data;
//         if (!session) {
//           throw new Error('No session data found');
//         }

//         const forms = formsResponse?.data?.data?.data || [];
//         const filesNameArray =
//           forms.length > 0 && forms[0].files.length > 0
//             ? [...new Set(forms.flatMap((form) => form.files.map((file) => file.fieldName)))]
//             : [];
//         setFilesName(filesNameArray);
//         setOrganizationData(session.organizationId);
//         setSessionData(session);
//         setFormsData(forms);
//         setIsLoading(false);
//       } catch (err) {
//         setError(err.message || 'An unexpected error occurred');
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, [encryptedId, refreshCount, enableAll]);

//   // Parse JSON strings safely
//   const parseValue = (value) => {
//     try {
//       if (typeof value === 'string' && (value.startsWith('{') || value.startsWith('['))) {
//         const parsed = JSON.parse(value);
//         if (Array.isArray(parsed)) {
//           return parsed.map((item) => item.label || item.value).join(', ');
//         }
//         return parsed.label || parsed.value || value;
//       }
//       return value;
//     } catch {
//       return value;
//     }
//   };

//   // Get dynamic columns from otherThanFiles and files
//   const columns = useMemo(() => {
//     const fixedColumns = [
//       { key: 'serialNumber', label: 'Serial Number' },
//       { key: 'createdAt', label: 'Created At', format: (value) => new Date(value).toLocaleDateString() },
//     ];

//     const actionColumn = [
//       { key: 'action', label: 'Action' },
//     ];

//     const dynamicKeys = new Set();
//     formsData.forEach((form) => {
//       if (form.otherThanFiles) {
//         Object.keys(form.otherThanFiles).forEach((key) => dynamicKeys.add(key));
//       }
//     });

//     const dynamicColumns = Array.from(dynamicKeys).map((key) => ({
//       key: `otherThanFiles.${key}`,
//       label: key.charAt(0).toUpperCase() + key.slice(1),
//     }));

//     const dynamicColumns2 = filesName.map((key) => ({
//       key: `files.${key}`,
//       label: key.charAt(0).toUpperCase() + key.slice(1),
//     }));

//     return [...fixedColumns, ...dynamicColumns, ...dynamicColumns2, ...actionColumn];
//   }, [formsData, filesName]);

//   // Extract numeric part from serial number
//   const getSerialNumberValue = (serialNumber) => {
//     if (typeof serialNumber !== 'string') return 0;
//     const match = serialNumber.match(/^AES-BF-25-FM(\d+)$/);
//     return match ? parseInt(match[1], 10) : 0;
//   };

//   // Filter forms based on search query and serial number limit
//   const filteredForms = useMemo(() => {
//     let filtered = formsData;

//     // Apply search query filter
//     if (searchQuery) {
//       const lowerQuery = searchQuery.toLowerCase().trim();
//       filtered = filtered.filter((form) => {
//         const values = [
//           form.serialNumber,
//           form.firstName,
//           form.phone,
//           ...Object.values(form.otherThanFiles || {}),
//         ].map((value) => parseValue(value)?.toString().toLowerCase());
//         return values.some((value) => value?.includes(lowerQuery));
//       });
//     }

//     // Apply serial number limit filter
//     if (serialNumberLimit) {
//       const limit = Number(serialNumberLimit);
//       if (!isNaN(limit) && limit > 0) {
//         filtered = filtered.filter((form) => {
//           const serialValue = getSerialNumberValue(form.serialNumber);
//           console.log("serialValue", serialValue);

//           return serialValue <= limit;
//         });
//       }
//     }

//     return filtered;
//   }, [formsData, searchQuery, serialNumberLimit]);

//   // Paginate filtered forms
//   const totalPages = Math.ceil(filteredForms.length / rowsPerPage);
//   const paginatedForms = useMemo(() => {
//     const start = (currentPage - 1) * rowsPerPage;
//     return filteredForms.slice(start, start + rowsPerPage);
//   }, [filteredForms, currentPage, rowsPerPage]);

//   // Handle page change
//   const handlePageChange = (page) => {
//     if (page >= 1 && page <= totalPages) {
//       setCurrentPage(page);
//     }
//   };

//   // Handle rows per page change
//   const handleRowsPerPageChange = (e) => {
//     const newRowsPerPage = Number(e.target.value);
//     setRowsPerPage(newRowsPerPage);
//     setCurrentPage(1);
//   };

//   // Handle Excel download
//   const handleDownloadExcel = () => {
//     setIsDownloading(true);
//     try {
//       const data = filteredForms.map((form) => {
//         const row = {};
//         columns.forEach((col) => {
//           let value;
//           if (col.key.includes('otherThanFiles.')) {
//             const key = col.key.split('.')[1];
//             value = form.otherThanFiles?.[key];
//           } else if (col.key.includes('files.')) {
//             const key = col.key.split('.')[1];
//             const fileValue = form?.files?.find((file) => file.fieldName === key);
//             value = fileValue ? common.extractFilename(fileValue.fileUrl) : null;
//           } else {
//             value = form[col.key];
//           }
//           value = parseValue(value);
//           if (col.format) {
//             value = col.format(value);
//           }
//           row[col.label] = value || '-';
//         });
//         return row;
//       });

//       const ws = XLSX.utils.json_to_sheet(data);
//       const wb = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(wb, ws, 'Forms');

//       const sessionName = sessionData?.name?.replace(/[^a-zA-Z0-9]/g, '_') || 'Session';
//       const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
//       const suffix = serialNumberLimit ? `_UpToSerial${serialNumberLimit}` : '';
//       const fileName = `Forms_${sessionName}_${date}${suffix}.xlsx`;

//       XLSX.writeFile(wb, fileName);
//       Swal.fire({
//         icon: 'success',
//         title: 'Success',
//         text: 'Excel file downloaded successfully!',
//         timer: 1500,
//         showConfirmButton: false,
//       });
//     } catch (error) {
//       console.error('Error generating Excel:', error);
//       Swal.fire({
//         icon: 'error',
//         title: 'Error',
//         text: 'Failed to generate Excel file. Please try again.',
//       });
//     } finally {
//       setIsDownloading(false);
//     }
//   };

//   // Handle Copy Data
//   const handleCopyData = async () => {
//     setIsCopying(true);
//     try {
//       const headers = columns.map((col) => col.label);
//       const headerRow = headers.join('\t');

//       const dataRows = filteredForms.map((form) => {
//         const row = columns.map((col) => {
//           let value;
//           if (col.key.includes('otherThanFiles.')) {
//             const key = col.key.split('.')[1];
//             value = form.otherThanFiles?.[key];
//           } else if (col.key.includes('files.')) {
//             const key = col.key.split('.')[1];
//             const fileValue = form?.files?.find((file) => file.fieldName === key);
//             value = fileValue ? common.extractFilename(fileValue.fileUrl) : null;
//           } else {
//             value = form[col.key];
//           }
//           value = parseValue(value);
//           if (col.format) {
//             value = col.format(value);
//           }
//           return (value || '-').toString().replace(/\t/g, ' ').replace(/\n/g, ' ');
//         });
//         return row.join('\t');
//       });

//       const tsvContent = [headerRow, ...dataRows].join('\n');
//       await navigator.clipboard.writeText(tsvContent);
//       Swal.fire({
//         icon: 'success',
//         title: 'Success',
//         text: `Copied ${filteredForms.length} rows to clipboard!`,
//         timer: 1500,
//         showConfirmButton: false,
//       });
//     } catch (error) {
//       console.error('Error copying data:', error);
//       Swal.fire({
//         icon: 'error',
//         title: 'Error',
//         text: 'Failed to copy data to clipboard. Please try again.',
//       });
//     } finally {
//       setIsCopying(false);
//     }
//   };

//   const handleDownloadByField = async (fieldName) => {
//     try {
//       setDownloadJobs((prev) => ({
//         ...prev,
//         [fieldName]: { jobId: null, status: 'pending', progress: 0, fieldName },
//       }));

//       const uniqueId = uuidv4();
//       socket.emit('joinDownload', { userId: currentUser.id, jobId: uniqueId });

//       const response = await customFieldService.initiateDownloadByField(common.decryptId(encryptedId), fieldName, uniqueId,enableAll );
//       const jobId = response.headers['x-job-id'] || response.headers['X-Job-Id'];
//       socket.emit('joinDownload', { userId: currentUser.id, jobId: jobId });

//       const blob = await response.data;
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', `${fieldName.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.zip`);
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(url);

//       setDownloadJobs((prev) => ({
//         ...prev,
//         [fieldName]: { jobId, status: 'processing', progress: 0, fieldName },
//       }));
//     } catch (error) {
//       setDownloadJobs((prev) => ({
//         ...prev,
//         [fieldName]: { ...prev[fieldName], status: 'failed', errorMessage: error.message },
//       }));
//       Swal.fire({
//         icon: 'error',
//         title: 'Error',
//         text: `Failed to initiate download for ${fieldName}: ${error.message}`,
//       });
//     }
//   };

//   useEffect(() => {
//     if (!currentUser?.id) {
//       console.warn('No user ID available for WebSocket connection');
//       return;
//     }

//     socket.connect();
//     socket.emit('joinDownload', { userId: currentUser.id });

//     socket.on('connect', () => {
//       console.log('Socket connected:', socket.id);
//     });

//     socket.on('downloadProgress', (data) => {
//       setDownloadJobs((prev) => ({
//         ...prev,
//         [data.fieldName]: {
//           jobId: data.jobId,
//           status: data.status,
//           progress: data.progress,
//           fieldName: data.fieldName,
//           errorMessage: data.errorMessage,
//         },
//       }));

//       if (data.progress == 100) {
//         Swal.fire({
//           icon: 'success',
//           title: data.status.charAt(0).toUpperCase() + data.status.slice(1),
//           text: data.errorMessage || `Download for ${data.fieldName} success`,
//           timer: 1500,
//           showConfirmButton: false,
//         });
//       }
//     });

//     socket.on('downloadProgressLive', (data) => {
//       if (data.progress == 100) {
//         setDownloadJobs((prev) => ({
//           ...prev,
//           [data.fieldName]: {
//             jobId: data.jobId,
//             status: "completed",
//             progress: 100,
//             fieldName: data.fieldName,
//             errorMessage: data.errorMessage,
//           },
//         }));
//       } else {
//         setDownloadJobs((prev) => ({
//           ...prev,
//           [data.fieldName]: {
//             jobId: data.jobId,
//             status: data.status,
//             progress: data.progress,
//             fieldName: data.fieldName,
//             errorMessage: data.errorMessage,
//           },
//         }));
//       }
//     });

//     socket.on('connect_error', (err) => {
//       console.error('Socket connection error:', err.message);
//     });

//     return () => {
//       socket.disconnect();
//     };
//   }, [currentUser?.id]);

//   // Validate serial number input (numeric part only)
//   const handleSerialNumberChange = (e) => {
//     const value = e.target.value;
//     if (value === '' || /^[0-9]*$/.test(value)) {
//       setSerialNumberLimit(value);
//       setCurrentPage(1);
//     }
//   };

//   const handleDeleteForm = async (id) => {
//     try {
//       const dataObject = {
//         formId: id,
//       }
//       const response = await customFieldService.deleteForm({ ...dataObject });
//       Swal.fire({
//         position: "top-end",
//         icon: "success",
//         title: "Deleted Successfully",
//         showConfirmButton: false,
//         timer: 1500,
//         toast: true,
//         customClass: {
//           popup: 'my-toast-size'
//         }
//       });
//       setRefreshCount((prev) => prev + 1)
//     } catch (error) {
//       console.log("Error deleting form:", error);
//       const errorMessage = error || 'An error occurred while deleting form';
//     }
//   };

//   const handleUpdateId = async () => {
//     try {
//       const dataObject = {
//         sessionId: sessionData?._id,
//         formId: `AES-BF-25-FM${serialNumberLimit}`
//       }
//       const response = await customFieldService.updateLastPrintedForm({ ...dataObject });
//       setSerialNumberLimit("");
//       setRefreshCount((prev) => prev+1)
//       Swal.fire({
//         position: "top-end",
//         icon: "success",
//         title: "Updated Successfully",
//         showConfirmButton: false,
//         timer: 1500,
//         toast: true,
//         customClass: {
//           popup: 'my-toast-size'
//         }
//       });
//       setRefreshCount((prev) => prev + 1)
//     } catch (error) {
//       const errorMessage = error || 'An error occurred while updating form id';
//       console.log("errorMessage", errorMessage);
//       Swal.fire({
//         position: "top-end",
//         icon: "error",
//         title: errorMessage,
//         showConfirmButton: false,
//         timer: 1500,
//         toast: true,
//         customClass: {
//           popup: 'my-toast-size'
//         }
//       });
//     }
//   };


//   // Conditional Rendering
//   if (isLoading) {
//     return <LoadingSpinner />;
//   }

//   if (error) {
//     return <ErrorMessage message={error} />;
//   }

//   return (
//     <div className="flex flex-col md claw mx-4 mt-3 min-h-screen bg-light dark:bg-dark">
//       <Hamberger text="Forms / List" />
//       <div className="w-[100%] mb-4 bg-cardBgLight dark:bg-cardBgDark shadow-lg rounded-lg p-1">
//         <div className="relative bg-light dark:bg-transparent overflow-hidden transition-transform duration-300">
//           <div className="absolute inset-0 bg-cover" />
//           <div className="relative z-10 hover:bg-opacity-40 flex flex-col justify-start py-6 px-4">
//             <div className="text-left text-textLight dark:text-textDark w-full">
//               <h2 className="text-md md:text-4xl font-bold mb-2 drop-shadow-md">
//                 {`${organizationData?.name || 'Unknown Organization'} - ${sessionData?.for || ''} (${sessionData?.name || 'Unknown Session'})`}
//               </h2>
//               <h4 className="text-sm md:text-base text-gray-600 dark:text-white font-medium mb-1 drop-shadow-sm">
//                 {organizationData?.captionText || 'No caption available'}
//               </h4>
//               <div className="flex text-gray-600 dark:text-white items-center text-sm md:text-base font-medium mb-1 drop-shadow-sm">
//                 <FaEnvelope className="mr-2" aria-hidden="true" />
//                 <span>{organizationData?.email || 'No email available'}</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="w-[100%] bg-cardBgLight dark:bg-cardBgDark shadow-lg rounded-lg p-4 mb-20">
//         <h3 className="text-lg md:text-2xl font-semibold text-textLight dark:text-textDark mb-4">
//           Forms List
//         </h3>

//         <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
//           <div className="flex flex-col sm:flex-row gap-2  md:w-[70%] sm:w-[100%]">
//             <button
//               onClick={handleDownloadExcel}
//               disabled={isDownloading || filteredForms.length === 0}
//               className="w-auto p-2 text-sm text-white rounded-lg transition-all duration-300 ease-in-out bg-custom-gradient-button-dark dark:bg-custom-gradient-button-light hover:bg-custom-gradient-button-light dark:hover:bg-custom-gradient-button-dark flex items-center justify-center shadow-lg"
//               aria-label="Download forms as Excel"
//             >
//               {isDownloading ? (
//                 <>
//                   <svg
//                     className="animate-spin mr-2 h-4 w-4 text-white"
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                   >
//                     <circle
//                       className="opacity-25"
//                       cx="12"
//                       cy="12"
//                       r="10"
//                       stroke="currentColor"
//                       strokeWidth="4"
//                     ></circle>
//                     <path
//                       className="opacity-75"
//                       fill="currentColor"
//                       d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                     ></path>
//                   </svg>
//                   Generating...
//                 </>
//               ) : (
//                 'Download Excel'
//               )}
//             </button>

//           </div>
//           <input
//             type="text"
//             value={searchQuery}
//             onChange={(e) => {
//               setSearchQuery(e.target.value);
//               setCurrentPage(1);
//             }}
//             placeholder="Search forms..."
//             className="w-[100%] sm:w-1/3 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-textLight dark:text-textDark focus:outline-none focus:ring-2 focus:ring-blue-500"
//             aria-label="Search forms"
//           />
//         </div>

//         <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
//           <div className="flex items-center md:w-[50%] sm:w-[100%] gap-2">
//             <input
//               type="text"
//               value={serialNumberLimit}
//               onChange={handleSerialNumberChange}
//               placeholder="Set Max Serial Number (e.g., 16026)"
//               className="md:w-[60%] w-[100%] px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-textLight dark:text-textDark focus:outline-none focus:ring-2 focus:ring-blue-500"
//               aria-label="Filter by maximum serial number"
//             />
//             {serialNumberLimit && (
//               <>
//                 <button
//                   onClick={() => setSerialNumberLimit('')}
//                   className="text-sm bg-red-300 p-1 rounded-md  text-white hover:text-gray-700 dark:hover:text-gray-200"
//                   aria-label="Clear serial number filter"
//                 >
//                   Clear
//                 </button>
//                 <button
//                   onClick={handleUpdateId}
//                   className="text-sm bg-green-300 p-1 rounded-md  text-white hover:text-gray-700 dark:hover:text-gray-200"
//                   aria-label="Clear serial number filter"
//                 >
//                   Update ID
//                 </button>
//               </>

//             )}
//           </div>
//           <div>
//             <button
//               onClick={() => setEnableAll(!enableAll)}
//               className="w-auto p-2 text-sm text-white rounded-lg transition-all duration-300 ease-in-out bg-custom-gradient-button-dark dark:bg-custom-gradient-button-light hover:bg-custom-gradient-button-light dark:hover:bg-custom-gradient-button-dark flex items-center justify-center shadow-lg"
//               aria-label="Download forms as Excel"
//             >
//               {
//                 enableAll  ? "Diable All" : "Enable All"
//               }

//             </button>

//           </div>

//         </div>


//         {filteredForms.length > 0 ? (
//           <>
//             <div className="overflow-auto rounded-lg">
//               <table
//                 className="w-full border-2 border-t-0 text-sm md:text-base text-textLight dark:text-textDark"
//                 role="grid"
//                 aria-label="Forms table"
//               >
//                 <thead>
//                   <tr className="bg-[#3f8e90] text-white">
//                     {columns.map((col) => (
//                       <th
//                         key={col.key}
//                         className="whitespace-nowrap py-4 px-4 text-left font-bold"
//                         scope="col"
//                       >
//                         {col.label}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {paginatedForms.map((form) => (
//                     <tr
//                       key={form._id.$oid}
//                       className="border-b border-gray-200 text-dark/80 dark:text-white dark:border-gray-700 hover:bg-[#3f8e90]/20 dark:hover:bg-[#3f8e90]/15"
//                     >
//                       {columns.map((col) => {
//                         let value;
//                         if (col.key.includes('otherThanFiles.')) {
//                           const key = col.key.split('.')[1];
//                           value = form.otherThanFiles?.[key];
//                         } else if (col.key.includes('files.')) {
//                           const key = col.key.split('.')[1];
//                           const fileValue = form?.files?.find((file) => file.fieldName === key);
//                           value = fileValue ? common.extractFilename(fileValue.fileUrl) : null;
//                         } else if (col.key.includes('action')) {
//                           value = (
//                             <div className='flex flex-row gap-2'>
//                               <button
//                                 onClick={() => {
//                                   navigate(`/editformbyadmin/${common.encryptId(form.sessionId)}/${common.encryptId(form._id)}`)
//                                 }}
//                                 className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm font-medium text-white bg-gradient-to-r from-yellow-400 to-yellow-600 dark:from-yellow-500 dark:to-yellow-700 rounded-lg  hover:from-yellow-500 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
//                               >
//                                 <FaRegEye />
//                                 View/Edit
//                               </button>
//                               <button
//                                 onClick={() => handleDeleteForm(form._id)}
//                                 className="flex items-center gap-1 px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-700 dark:from-red-600 dark:to-red-800 rounded-lg hover:from-red-600 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-500"
//                               >
//                                 <FaTrashAlt />
//                                 Delete
//                               </button>
//                             </div>
//                           );
//                         } else {
//                           value = form[col.key];
//                         }
//                         value = parseValue(value);
//                         if (col.format) {
//                           value = col.format(value);
//                         }
//                         return (
//                           <td key={col.key} className="py-2 px-4">
//                             {value || '-'}
//                           </td>
//                         );
//                       })}
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//             <Pagination
//               currentPage={currentPage}
//               totalPages={totalPages}
//               onPageChange={handlePageChange}
//               rowsPerPage={rowsPerPage}
//               onRowsPerPageChange={handleRowsPerPageChange}
//             />
//             <div className="flex justify-end">
//               <span className="text-[.85rem] mx-4">
//                 Total Data - <span className="font-bold">{formsData?.length}</span>
//               </span>
//             </div>
//           </>
//         ) : (
//           <div className="flex mt-4 flex-col justify-center items-center py-8 sm:py-12 bg-gray-100 dark:bg-gray-900 rounded-xl shadow-sm">
//             <FaExclamationCircle className="text-3xl sm:text-4xl text-gray-400 dark:text-gray-500 sm:mb-4" />
//             <p className="text-sm md:text-lg text-center text-gray-600 dark:text-white">
//               No data available
//             </p>
//           </div>
//         )}

//         <div className="mt-6">
//           <h4 className="text-md font-semibold text-textLight dark:text-textDark mb-2">
//             Download Files by Type
//           </h4>
//           {filesName && filesName.length > 0 ? (
//             filesName.map((file) => (
//               <div key={file} className="flex flex-col gap-2 my-2">
//                 <div className="flex gap-2 items-center">
//                   <span>
//                     Download <span className="text-green-700">{file}</span> :
//                   </span>
//                   <button
//                     onClick={() => handleDownloadByField(file)}
//                     disabled={downloadJobs[file]?.status === 'pending' || downloadJobs[file]?.status === 'processing'}
//                     className="w-auto p-2 text-sm text-white rounded-lg transition-all duration-300 ease-in-out bg-custom-gradient-button-dark dark:bg-custom-gradient-button-light hover:bg-custom-gradient-button-light dark:hover:bg-custom-gradient-button-dark flex items-center justify-center gap-1 shadow-lg"
//                   >
//                     <FiDownload className="text-base" />
//                     {downloadJobs[file]?.status === 'pending' || downloadJobs[file]?.status === 'processing'
//                       ? 'Preparing...'
//                       : 'Download'}
//                   </button>
//                 </div>
//                 {downloadJobs[file] && (
//                   <div className="ml-4">
//                     <p className="text-sm text-textLight dark:text-textDark mb-1">
//                       Progress: {downloadJobs[file].progress}%
//                     </p>
//                     <div className="w-[100%] bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
//                       <div
//                         className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
//                         style={{ width: `${downloadJobs[file].progress}%` }}
//                       ></div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ))
//           ) : (
//             <div>No Files Available</div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ListForm;


import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaEnvelope, FaExclamationCircle, FaRegEye, FaTrashAlt } from 'react-icons/fa';
import PropTypes from 'prop-types';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { FiDownload } from 'react-icons/fi';
import Hamberger from '../../components/Hamberger/Hamberger';
import common from '../../helper/common';
import sessionService from '../../services/sessionService';
import customFieldService from '../../services/customFieldService';
import LoadingSpinner from '../../components/Loading/LoadingSpinner';
import FilterModal from '../../components/FilterModel/FilterModal'; // New component
import styles from '../../components/CustomTable/CustomTable.module.css';
import io from 'socket.io-client';
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

// Initialize Socket.IO
const socket = import.meta.env.VITE_NODE_ENV === 'development'
  ? io(import.meta.env.VITE_SOCKET_API_URL)
  : io(import.meta.env.VITE_SOCKET_API_URL, { path: '/api/socket.io' });

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
        className="text-white bg-blue-700 dark:text-white px-2 py-1 text-[.7rem]"
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
        className="text-white bg-green-700 dark:text-white px-2 py-1 text-[.7rem]"
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
  const [filesName, setFilesName] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadJobs, setDownloadJobs] = useState({});
  const [serialNumberLimit, setSerialNumberLimit] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false); // New state for filter modal
  const [selectedFilters, setSelectedFilters] = useState({}); // New state for filter selections
  const { clientUser: currentUser } = useSelector((state) => state.authCustomerSlice);
  const [refreshCount, setRefreshCount] = useState(0);
  const [enableAll, setEnableAll] = useState(false);
  const navigate = useNavigate();

  // console.log("formsData",formsData);
  
  // console.log("selectedFilters", selectedFilters);


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
          sessionService.getSession(decryptedId),
          customFieldService.getAllFormsBySession(decryptedId, enableAll),
        ]);

        const session = sessionResponse?.data?.data?.data;
        if (!session) {
          throw new Error('No session data found');
        }

        const forms = formsResponse?.data?.data?.data || [];
        const filesNameArray =
          forms.length > 0 && forms[0].files.length > 0
            ? [...new Set(forms.flatMap((form) => form.files.map((file) => file.fieldName)))]
            : [];
        setFilesName(filesNameArray);
        setOrganizationData(session.organizationId);
        setSessionData(session);
        setFormsData(forms);
        setIsLoading(false);
      } catch (err) {
        setError(err.message || 'An unexpected error occurred');
        setIsLoading(false);
      }
    };

    fetchData();
  }, [encryptedId, refreshCount, enableAll]);

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

  // Get dynamic columns from otherThanFiles and files
  const columns = useMemo(() => {
    const fixedColumns = [
      { key: 'serialNumber', label: 'Serial Number' },
      { key: 'createdAt', label: 'Created At', format: (value) => new Date(value).toLocaleDateString() },
    ];

    const actionColumn = [{ key: 'action', label: 'Action' }];

    const dynamicKeys = new Set();
    formsData.forEach((form) => {
      if (form.otherThanFiles) {
        Object.keys(form.otherThanFiles).forEach((key) => dynamicKeys.add(key));
      }
    });

    const dynamicColumns = Array.from(dynamicKeys).map((key) => ({
      key: `otherThanFiles.${key}`,
      label: key.charAt(0).toUpperCase() + key.slice(1),
    }));

    const dynamicColumns2 = filesName.map((key) => ({
      key: `files.${key}`,
      label: key.charAt(0).toUpperCase() + key.slice(1),
    }));

    return [...fixedColumns, ...dynamicColumns, ...dynamicColumns2, ...actionColumn];
  }, [formsData, filesName]);

  // Extract unique filter options for dynamic fields
  const filterOptions = useMemo(() => {
    const options = [];

    // OtherThanFiles fields
    const dynamicKeys = new Set();
    formsData.forEach((form) => {
      if (form.otherThanFiles) {
        Object.keys(form.otherThanFiles).forEach((key) => dynamicKeys.add(key));
      }
    });

    // console.log("formsData 11", formsData);
    

    Array.from(dynamicKeys).forEach((key) => {
      const values = [...new Set(
        formsData
          .map((form) => parseValue(form.otherThanFiles?.[key]))
          .filter((value) => value && value !== '-')
      )].sort();
      // console.log("values 11",values);
      
      if (values.length > 0) {
        options.push({
          field: `otherThanFiles.${key}`,
          label: key.charAt(0).toUpperCase() + key.slice(1),
          options: values,
        });
      }
    });

    // Files fields
    // filesName.forEach((key) => {
    //   const values = [...new Set(
    //     formsData
    //       .map((form) => {
    //         const file = form.files?.find((f) => f.fieldName === key);
    //         return file ? common.extractFilename(file.fileUrl) : null;
    //       })
    //       .filter((value) => value)
    //   )].sort();
    //   if (values.length > 0) {
    //     options.push({
    //       field: `files.${key}`,
    //       label: key.charAt(0).toUpperCase() + key.slice(1),
    //       options: values,
    //     });
    //   }
    // });

    return options;
  }, [formsData, filesName]);

  // Extract numeric part from serial number
  const getSerialNumberValue = (serialNumber) => {
    if (typeof serialNumber !== 'string') return 0;
    const match = serialNumber.match(/^AES-BF-25-FM(\d+)$/);
    return match ? parseInt(match[1], 10) : 0;
  };

  // Filter forms based on search query, serial number limit, and advanced filters
  const filteredForms = useMemo(() => {
    let filtered = formsData;

    // Apply search query filter
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((form) => {
        const values = [
          form.serialNumber,
          form.firstName,
          form.phone,
          ...Object.values(form.otherThanFiles || {}),
        ].map((value) => parseValue(value)?.toString().toLowerCase());
        return values.some((value) => value?.includes(lowerQuery));
      });
    }

    // Apply serial number limit filter
    if (serialNumberLimit) {
      const limit = Number(serialNumberLimit);
      if (!isNaN(limit) && limit > 0) {
        filtered = filtered.filter((form) => {
          const serialValue = getSerialNumberValue(form.serialNumber);
          return serialValue <= limit;
        });
      }
    }

    // Apply advanced filters
    Object.entries(selectedFilters).forEach(([field, value]) => {
      if (value) {
        if (field.startsWith('otherThanFiles.')) {
          const key = field.split('.')[1];
          filtered = filtered.filter((form) => {
            const formValue = parseValue(form.otherThanFiles?.[key]);
            return formValue === value;
          });
        } else if (field.startsWith('files.')) {
          const key = field.split('.')[1];
          filtered = filtered.filter((form) => {
            const file = form.files?.find((f) => f.fieldName === key);
            return file && common.extractFilename(file.fileUrl) === value;
          });
        }
      }
    });

    return filtered;
  }, [formsData, searchQuery, serialNumberLimit, selectedFilters]);

  // console.log("filteredForms", filteredForms);

  const [limitOptions, setLimitOptions] = useState([]);
  const [limit, setLimit] = useState(20);
  const [page, setPage] = useState(1)

  // console.log("limitOptions", limitOptions);
  // console.log("page",page);
  


  // useEffect(() => {
  //   if(filteredForms && filteredForms.length > 0){
  //     const serialNumberArray = filteredForms?.map((item) => {
  //       const extracted = common.extractAfterFM(item?.serialNumber)
  //       return extracted
  //     });
  //     const serialRange =  common.createSerialRanges(serialNumberArray.reverse());
  //     const serialOptions = serialRange?.map((option, index) => {
  //       return {
  //         ...option, page: index+1
  //       }
  //     });
  //     setLimitOptions(serialOptions)
  //   }
  // },[filteredForms])

  useEffect(() => {
    if (!filteredForms?.length) return;

    const serialNumberArray = filteredForms
      .map(item => common.extractAfterFM(item?.serialNumber))
      .reverse();

      // console.log("serialNumberArray",serialNumberArray);
      

    const serialRanges = common.createSerialRanges(serialNumberArray, limit);

    const serialOptions = serialRanges.map((range, index) => ({
      ...range,
      page: index + 1,
    }));

    setLimitOptions(serialOptions);
  }, [filteredForms, limit]);


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
    setCurrentPage(1);
  };

  // Handle Excel download
  const handleDownloadExcel = () => {
    setIsDownloading(true);
    try {
      const data = filteredForms.map((form) => {
        const row = {};
        columns.forEach((col) => {
          let value;
          if (col.key.includes('otherThanFiles.')) {
            const key = col.key.split('.')[1];
            value = form.otherThanFiles?.[key];
          } else if (col.key.includes('files.')) {
            const key = col.key.split('.')[1];
            const fileValue = form?.files?.find((file) => file.fieldName === key);
            value = fileValue ? common.extractFilename(fileValue.fileUrl) : null;
          } else {
            value = form[col.key];
          }
          value = parseValue(value);
          if (col.format) {
            value = col.format(value);
          }
          row[col.label] = value || '-';
        });
        return row;
      });

      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Forms');

      const sessionName = sessionData?.name?.replace(/[^a-zA-Z0-9]/g, '_') || 'Session';
      const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const suffix = serialNumberLimit ? `_UpToSerial${serialNumberLimit}` : '';
      const fileName = `Forms_${sessionName}_${date}${suffix}.xlsx`;

      XLSX.writeFile(wb, fileName);
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Excel file downloaded successfully!',
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error('Error generating Excel:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to generate Excel file. Please try again.',
      });
    } finally {
      setIsDownloading(false);
    }
  };

 

  // Handle Download by Field
  const handleDownloadByField = async (fieldName) => {
    try {
      setDownloadJobs((prev) => ({
        ...prev,
        [fieldName]: { jobId: null, status: 'pending', progress: 0, fieldName },
      }));

      const uniqueId = uuidv4();
      socket.emit('joinDownload', { userId: currentUser.id, jobId: uniqueId });

      const response = await customFieldService.initiateDownloadByField(
        common.decryptId(encryptedId),
        fieldName,
        uniqueId,
        enableAll,
        selectedFilters,
        limit,
        page
      );
      const jobId = response.headers['x-job-id'] || response.headers['X-Job-Id'];
      socket.emit('joinDownload', { userId: currentUser.id, jobId });

      const blob = await response.data;
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${fieldName.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.zip`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setDownloadJobs((prev) => ({
        ...prev,
        [fieldName]: { jobId, status: 'processing', progress: 0, fieldName },
      }));
    } catch (error) {
      setDownloadJobs((prev) => ({
        ...prev,
        [fieldName]: { ...prev[fieldName], status: 'failed', errorMessage: error.message },
      }));
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Failed to initiate download for ${fieldName}: ${error.message}`,
      });
    }
  };

  // Socket.IO connection
  useEffect(() => {
    if (!currentUser?.id) {
      console.warn('No user ID available for WebSocket connection');
      return;
    }

    socket.connect();
    socket.emit('joinDownload', { userId: currentUser.id });

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
    });

    socket.on('downloadProgress', (data) => {
      setDownloadJobs((prev) => ({
        ...prev,
        [data.fieldName]: {
          jobId: data.jobId,
          status: data.status,
          progress: data.progress,
          fieldName: data.fieldName,
          errorMessage: data.errorMessage,
        },
      }));

      if (data.progress === 100) {
        Swal.fire({
          icon: 'success',
          title: data.status.charAt(0).toUpperCase() + data.status.slice(1),
          text: data.errorMessage || `Download for ${data.fieldName} success`,
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });

    socket.on('downloadProgressLive', (data) => {
      setDownloadJobs((prev) => ({
        ...prev,
        [data.fieldName]: {
          jobId: data.jobId,
          status: data.progress === 100 ? 'completed' : data.status,
          progress: data.progress,
          fieldName: data.fieldName,
          errorMessage: data.errorMessage,
        },
      }));
    });

    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err.message);
    });

    return () => {
      socket.disconnect();
    };
  }, [currentUser?.id]);

  // Validate serial number input
  const handleSerialNumberChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^[0-9]*$/.test(value)) {
      setSerialNumberLimit(value);
      setCurrentPage(1);
    }
  };

  // Handle Delete Form
  const handleDeleteForm = async (id) => {
    try {
      const dataObject = { formId: id };
      await customFieldService.deleteForm(dataObject);
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Deleted Successfully',
        showConfirmButton: false,
        timer: 1500,
        toast: true,
        customClass: { popup: 'my-toast-size' },
      });
      setRefreshCount((prev) => prev + 1);
    } catch (error) {
      console.error('Error deleting form:', error);
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Error deleting form',
        showConfirmButton: false,
        timer: 1500,
        toast: true,
        customClass: { popup: 'my-toast-size' },
      });
    }
  };

  // Handle Update ID
  const handleUpdateId = async () => {
    try {
      const dataObject = {
        sessionId: sessionData?._id,
        formId: `AES-BF-25-FM${serialNumberLimit}`,
      };
      await customFieldService.updateLastPrintedForm(dataObject);
      setSerialNumberLimit('');
      setRefreshCount((prev) => prev + 1);
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Updated Successfully',
        showConfirmButton: false,
        timer: 1500,
        toast: true,
        customClass: { popup: 'my-toast-size' },
      });
    } catch (error) {
      console.error('Error updating form ID:', error);
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: error.message || 'Error updating form ID',
        showConfirmButton: false,
        timer: 1500,
        toast: true,
        customClass: { popup: 'my-toast-size' },
      });
    }
  };

  // Handle filter application
  const handleApplyFilters = () => {
    setIsFilterOpen(false);
    setCurrentPage(1);
  }

  // Handle filter reset
  const handleResetFilters = () => {
    setSelectedFilters({});
    setIsFilterOpen(false);
    setCurrentPage(1);
  }

  // Count active filters
  const activeFilterCount = Object.values(selectedFilters).filter(Boolean).length;

  // Conditional Rendering
  if (isLoading && !error && !formsData.length) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="flex flex-col md:claw mx-4 mt-3 min-h-screen bg-light dark:bg-dark">
      <Hamberger text="Forms / List" />
      <div className="w-[100%] mb-4 bg-cardBgLight dark:bg-dark shadow-lg rounded-lg p-1">
        <div className="relative bg-light dark:bg-transparent overflow-hidden transition-transform duration-300">
          <div className="absolute inset-0 bg-cover" />
          <div className="relative z-10 hover:bg-opacity-40 flex flex-col justify-start py-6 px-4">
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

      <div className="w-[100%] bg-cardBgLight dark:bg-cardBgDark shadow-lg rounded-lg p-4 mb-20">
        <h3 className="text-lg md:text-2xl font-semibold text-textLight dark:text-textDark mb-4">
          Forms List
        </h3>

        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex flex-col sm:flex-row gap-2 md:w-[70%] sm:w-[100%]">
            <button
              onClick={handleDownloadExcel}
              disabled={isDownloading || filteredForms.length === 0}
              className="w-auto p-2 text-sm text-white rounded-lg transition-all duration-300 ease-in-out bg-custom-gradient-button-dark dark:bg-custom-gradient-button-light hover:bg-custom-gradient-button-light dark:hover:bg-custom-gradient-button-dark flex items-center justify-center shadow-lg"
              aria-label="Download forms as Excel"
            >
              {isDownloading ? (
                <>
                  <svg
                    className="animate-spin mr-2 h-4 w-4 text-white"
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
                  Generating...
                </>
              ) : (
                'Download Excel'
              )}
            </button>
            {/* <button
              onClick={handleCopyData}
              disabled={isCopying || filteredForms.length === 0}
              className="w-auto p-2 text-sm text-white rounded-lg transition-all duration-300 ease-in-out bg-custom-gradient-button-dark dark:bg-custom-gradient-button-light hover:bg-custom-gradient-button-light dark:hover:bg-custom-gradient-button-dark flex items-center justify-center shadow-lg"
              aria-label="Copy forms data to clipboard"
            >
              {isCopying ? (
                <>
                  <svg
                    className="animate-spin mr-2 h-4 w-4 text-white"
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
                  Copying...
                </>
              ) : (
                'Copy Data'
              )}
            </button> */}
            <button
              onClick={() => setIsFilterOpen(true)}
              className="relative w-auto p-2 text-sm text-white rounded-lg transition-all duration-300 ease-in-out bg-custom-gradient-button-dark dark:bg-custom-gradient-button-light hover:bg-custom-gradient-button-light dark:hover:bg-custom-gradient-button-dark flex items-center justify-center shadow-lg"
              aria-label="Open advanced filters"
            >
              Advanced Filter
              {activeFilterCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search forms..."
            className="w-[100%] sm:w-1/3 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-textLight dark:text-textDark focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Search forms"
          />
        </div>

        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center md:w-[50%] sm:w-[100%] gap-2">
            <input
              type="text"
              value={serialNumberLimit}
              onChange={handleSerialNumberChange}
              placeholder="Set Max Serial Number (e.g., 16026)"
              className="md:w-[60%] w-[100%] px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-textLight dark:text-textDark focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Filter by maximum serial number"
            />
            {serialNumberLimit && (
              <>
                <button
                  onClick={() => setSerialNumberLimit('')}
                  className="text-sm bg-red-300 p-1 rounded-md text-white hover:bg-red-400"
                  aria-label="Clear serial number filter"
                >
                  Clear
                </button>
                <button
                  onClick={handleUpdateId}
                  className="text-sm bg-green-300 p-1 rounded-md text-white hover:bg-green-400"
                  aria-label="Update form ID"
                >
                  Update ID
                </button>
              </>
            )}
          </div>
          <div>
            <button
              onClick={() => setEnableAll(!enableAll)}
              className="w-auto p-2 text-sm text-white rounded-lg transition-all duration-300 ease-in-out bg-custom-gradient-button-dark dark:bg-custom-gradient-button-light hover:bg-custom-gradient-button-light dark:hover:bg-custom-gradient-button-dark flex items-center justify-center shadow-lg"
              aria-label={enableAll ? 'Disable all' : 'Enable all'}
            >
              {enableAll ? 'Disable All' : 'Enable All'}
            </button>
          </div>
        </div>

        <FilterModal
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          onApply={handleApplyFilters}
          onReset={handleResetFilters}
          filterOptions={filterOptions}
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
        />

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
                        } else if (col.key.includes('files.')) {
                          const key = col.key.split('.')[1];
                          const fileValue = form?.files?.find((file) => file.fieldName === key);
                          value = fileValue ? common.extractFilename(fileValue.fileUrl) : null;
                        } else if (col.key.includes('action')) {
                          value = (
                            <div className="flex flex-row gap-2">
                              <button
                                onClick={() =>
                                  navigate(
                                    `/editformbyadmin/${common.encryptId(form.sessionId)}/${common.encryptId(form._id)}`
                                  )
                                }
                                className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm font-medium text-white bg-gradient-to-r from-yellow-400 to-yellow-600 dark:from-yellow-500 dark:to-yellow-700 rounded-lg hover:from-yellow-500 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                              >
                                <FaRegEye />
                                View/Edit
                              </button>
                              <button
                                onClick={() => handleDeleteForm(form._id)}
                                className="flex items-center gap-1 px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-700 dark:from-red-600 dark:to-red-800 rounded-lg hover:from-red-600 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                              >
                                <FaTrashAlt />
                                Delete
                              </button>
                            </div>
                          );
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
            <div className="flex justify-end">
              <span className="text-[.85rem] mx-4">
                Total Data - <span className="font-bold">{filteredForms?.length}</span>
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

        <div className="mt-6">
          <h4 className="text-md font-semibold text-textLight dark:text-textDark mb-2">
            Download Files by Type
          </h4>
          {filesName && filesName.length > 0 ? (
            filesName.map((file) => (
              <div key={file} className="flex flex-col gap-2 my-2">
                <div className="flex gap-2 items-center">

                  <div>
                    <div className="mb-4">
                      <label
                        htmlFor={`filter-${file}`}
                        className="block text-sm font-medium text-textLight dark:text-textDark mb-1"
                      >
                        select Limit
                      </label>
                      <select
                        id={`filter-${file}`}
                        // value={page}
                        onChange={(e) => {
                          setPage(e.target.value)
                        }}
                        className="w-[100%] px-1 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-textLight dark:text-textDark focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        aria-label={`Filter by ${file}`}
                      >
                        <option value=""></option>
                        {limitOptions.map((option) => (
                          <option key={option?.page} value={option.page} className="text-black dark:text-white dark:bg-black">
                            {option.start+ "-" +option.end}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className='flex gap-2 items-center'>
                    <span>
                      Download <span className="text-green-700">{file}</span> :
                    </span>
                    <button
                      onClick={() => handleDownloadByField(file)}
                      disabled={downloadJobs[file]?.status === 'pending' || downloadJobs[file]?.status === 'processing'}
                      className="w-auto p-2 text-sm text-white rounded-lg transition-all duration-300 ease-in-out bg-custom-gradient-button-dark dark:bg-custom-gradient-button-light hover:bg-custom-gradient-button-light dark:hover:bg-custom-gradient-button-dark flex items-center justify-center gap-1 shadow-lg"
                    >
                      <FiDownload className="text-base" />
                      {downloadJobs[file]?.status === 'pending' || downloadJobs[file]?.status === 'processing'
                        ? 'Preparing...'
                        : 'Download'}
                    </button>

                  </div>




                </div>
                {downloadJobs[file] && (
                  <div className="ml-4">
                    <p className="text-sm text-textLight dark:text-textDark mb-1">
                      Progress: {downloadJobs[file].progress}%
                    </p>
                    <div className="w-[100%] bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                        style={{ width: `${downloadJobs[file].progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div>No Files Available</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ListForm;