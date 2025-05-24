import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { FaEnvelope, FaExclamationCircle } from 'react-icons/fa';
import PropTypes from 'prop-types';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { FiDownload } from 'react-icons/fi';
import Hamberger from '../../components/Hamberger/Hamberger';
import common from '../../helper/common';
import sessionService from '../../services/sessionService';
import customFieldService from '../../services/customFieldService';
import LoadingSpinner from '../../components/Loading/LoadingSpinner';
import styles from '../../components/CustomTable/CustomTable.module.css';
import io from 'socket.io-client';
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';



const socket = io(import.meta.env.VITE_API_URL);

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
  const [filesName, setFilesName] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [downloadJobs, setDownloadJobs] = useState({}); // Track jobs by fieldName

  const { clientUser: currentUser } = useSelector((state) => state.authCustomerSlice);



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
        const filesNameArray =
          forms.length > 0 && forms[0].files.length > 0
            ? [...new Set(forms.flatMap((form) => form.files.map((file) => file.fieldName)))]
            : [];
        setFilesName(filesNameArray);
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

  // Get dynamic columns from otherThanFiles and files
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
      label: key.charAt(0).toUpperCase() + key.slice(1),
    }));

    const dynamicColumns2 = filesName.map((key) => ({
      key: `files.${key}`,
      label: key.charAt(0).toUpperCase() + key.slice(1),
    }));

    return [...fixedColumns, ...dynamicColumns, ...dynamicColumns2];
  }, [formsData, filesName]);

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
      const fileName = `Forms_${sessionName}_${date}.xlsx`;

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

  // Handle Copy Data
  const handleCopyData = async () => {
    setIsCopying(true);
    try {
      const headers = columns.map((col) => col.label);
      const headerRow = headers.join('\t');

      const dataRows = filteredForms.map((form) => {
        const row = columns.map((col) => {
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
          return (value || '-').toString().replace(/\t/g, ' ').replace(/\n/g, ' ');
        });
        return row.join('\t');
      });

      const tsvContent = [headerRow, ...dataRows].join('\n');
      await navigator.clipboard.writeText(tsvContent);
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: `Copied ${filteredForms.length} rows to clipboard!`,
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error('Error copying data:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to copy data to clipboard. Please try again.',
      });
    } finally {
      setIsCopying(false);
    }
  };

  // Handle field-specific download
  // const handleDownloadByField = async (fieldName) => {
  //   try {
  //     const jobId = await customFieldService.initiateDownloadByField(
  //       common.decryptId(encryptedId),
  //       fieldName
  //     );
  //     setDownloadJobs((prev) => ({
  //       ...prev,
  //       [fieldName]: { jobId, status: 'pending', progress: 0 },
  //     }));
  //   } catch (error) {
  //     Swal.fire({
  //       icon: 'error',
  //       title: 'Error',
  //       text: 'Failed to initiate download: ' + error.message,
  //     });
  //   }
  // };
  const handleDownloadByField = async (fieldName) => {
    try {
      // Update downloadJobs to show pending state
      setDownloadJobs((prev) => ({
        ...prev,
        [fieldName]: { jobId: null, status: 'pending', progress: 0, fieldName },
      }));

      const uniqueId = uuidv4();

      console.log("uniqueId", uniqueId);




      socket.emit('joinDownload', { userId: currentUser.id, jobId: uniqueId });


      // Fetch the ZIP file with authentication
      const response = await customFieldService.initiateDownloadByField(common.decryptId(encryptedId), fieldName, uniqueId);
      console.log("headers ", response.headers);

      const jobId = response.headers['x-job-id'] || response.headers['X-Job-Id'];
      // Join WebSocket room for this job
      socket.emit('joinDownload', { userId: currentUser.id, jobId: jobId });

      // Convert response to Blob
      const blob = await response.data;
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${fieldName.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.zip`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);


      // Trigger native download
      // console.log('Initiating native download...');
      // const downloadUrl = `/api/superadmin/administration/download-by-field?sessionId=${encodeURIComponent(common.decryptId(encryptedId))}&fieldName=${encodeURIComponent(fieldName)}&uniqueId=${encodeURIComponent(uniqueId)}&token=${encodeURIComponent(localStorage.getItem('SAAS_BILLION_FORMS_customer_token'))}`;
      // const link = document.createElement('a');
      // link.href = downloadUrl;
      // link.setAttribute('download', `${fieldName.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.zip`);
      // document.body.appendChild(link);
      // link.click();
      // document.body.removeChild(link);

      // Update state to processing
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

  // testing

  // Poll download status (only for progress UI, not triggering download)
  // useEffect(() => {
  //   const intervals = {};

  //   const clearAllIntervals = () => {
  //     Object.values(intervals).forEach(clearInterval);
  //   };

  //   Object.entries(downloadJobs).forEach(([fieldName, job]) => {
  //     if (job.status !== 'completed' && job.status !== 'failed' && job.jobId) {
  //       intervals[fieldName] = setInterval(async () => {
  //         try {
  //           const statusResponse = await customFieldService.getDownloadStatus(job.jobId);
  //           const status = statusResponse.data.data;
  //           setDownloadJobs((prev) => ({
  //             ...prev,
  //             [fieldName]: {
  //               jobId: status.jobId,
  //               status: status.status,
  //               progress: status.progress,
  //               fieldName: status.fieldName,
  //               errorMessage: status.errorMessage,
  //             },
  //           }));

  //           if (status.status === 'completed' || status.status === 'failed') {
  //             clearInterval(intervals[fieldName]);
  //           }
  //         } catch (error) {
  //           clearInterval(intervals[fieldName]);
  //           setDownloadJobs((prev) => ({
  //             ...prev,
  //             [fieldName]: { ...prev[fieldName], status: 'failed', errorMessage: error.message },
  //           }));
  //         }
  //       }, 4000);
  //     }
  //   });

  //   return () => {
  //     clearAllIntervals();
  //   };
  // }, [downloadJobs]);

  // Poll download status for all jobs
  // useEffect(() => {
  //   const intervals = {};
  //   Object.entries(downloadJobs).forEach(([fieldName, job]) => {
  //     if (job.status !== 'completed' && job.status !== 'failed') {
  //       intervals[fieldName] = setInterval(async () => {
  //         try {
  //           const status = await customFieldService.getDownloadStatus(job.jobId);
  //           setDownloadJobs((prev) => ({
  //             ...prev,
  //             [fieldName]: {
  //               jobId: status.jobId,
  //               status: status.status,
  //               progress: status.progress,
  //               zipUrl: status.zipUrl,
  //               fieldName: status.fieldName,
  //               errorMessage: status.errorMessage,
  //             },
  //           }));

  //           if (status.status === 'completed') {
  //             const link = document.createElement('a');
  //             link.href = status.zipUrl;
  //             link.setAttribute('download', `${sessionData?.name || 'session'}_${fieldName}_files.zip`);
  //             document.body.appendChild(link);
  //             link.click();
  //             link.remove();
  //             Swal.fire({
  //               icon: 'success',
  //               title: 'Success',
  //               text: `Downloaded ${fieldName} files successfully!`,
  //               timer: 1500,
  //               showConfirmButton: false,
  //             });
  //           } else if (status.status === 'failed') {
  //             Swal.fire({
  //               icon: 'error',
  //               title: 'Error',
  //               text: status.errorMessage || `Failed to download ${fieldName} files. Please try again.`,
  //             });
  //           }
  //         } catch (error) {
  //           Swal.fire({
  //             icon: 'error',
  //             title: 'Error',
  //             text: `Failed to check download status for ${fieldName}: ${error.message}`,
  //           });
  //           setDownloadJobs((prev) => ({
  //             ...prev,
  //             [fieldName]: { ...prev[fieldName], status: 'failed' },
  //           }));
  //           clearInterval(intervals[fieldName]);
  //         }
  //       }, 4000);
  //     }
  //   });

  //   return () => {
  //     Object.values(intervals).forEach((interval) => clearInterval(interval));
  //   };
  // }, [downloadJobs, sessionData]);

  // useEffect(() => {
  //   const intervals = {};

  //   const clearAllIntervals = () => {
  //     Object.values(intervals).forEach(clearInterval);
  //   };

  //   Object.entries(downloadJobs).forEach(([fieldName, job]) => {
  //     if (job.status !== 'completed' && job.status !== 'failed') {
  //       intervals[fieldName] = setInterval(async () => {
  //         try {
  //           const status = await customFieldService.getDownloadStatus(job.jobId);

  //           setDownloadJobs((prev) => ({
  //             ...prev,
  //             [fieldName]: {
  //               jobId: status.jobId,
  //               status: status.status,
  //               progress: status.progress,
  //               zipUrl: status.zipUrl,
  //               fieldName: status.fieldName,
  //               errorMessage: status.errorMessage,
  //             },
  //           }));

  //           if (status.status === 'completed') {
  //             // Stop all polling
  //             clearAllIntervals();

  //             const link = document.createElement('a');
  //             link.href = status.zipUrl;
  //             link.setAttribute('download', `${sessionData?.name || 'session'}_${fieldName}_files.zip`);
  //             document.body.appendChild(link);
  //             link.click();
  //             link.remove();

  //             Swal.fire({
  //               icon: 'success',
  //               title: 'Success',
  //               text: `Downloaded ${fieldName} files successfully!`,
  //               timer: 1500,
  //               showConfirmButton: false,
  //             });
  //           } else if (status.status === 'failed') {
  //             // Stop all polling
  //             clearAllIntervals();

  //             Swal.fire({
  //               icon: 'error',
  //               title: 'Error',
  //               text: status.errorMessage || `Failed to download ${fieldName} files. Please try again.`,
  //             });
  //           }
  //         } catch (error) {
  //           clearAllIntervals();
  //           Swal.fire({
  //             icon: 'error',
  //             title: 'Error',
  //             text: `Failed to check download status for ${fieldName}: ${error.message}`,
  //           });
  //           setDownloadJobs((prev) => ({
  //             ...prev,
  //             [fieldName]: { ...prev[fieldName], status: 'failed' },
  //           }));
  //         }
  //       }, 4000);
  //     }
  //   });

  //   return () => {
  //     clearAllIntervals();
  //   };
  // }, [downloadJobs, sessionData]);




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
      // console.log('Received progress:', data);
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

      if (data.progress == 100) {
        Swal.fire({
          icon: 'success',
          title: data.status.charAt(0).toUpperCase() + data.status.slice(1),
          text: data.errorMessage || `Download for ${data.fieldName} success`,
          timer: 1500,
          showConfirmButton: false,
        });
      }

      // if (data.status === 'completed' || data.status === 'failed') {
      //   Swal.fire({
      //     icon: data.status === 'completed' ? 'success' : 'error',
      //     title: data.status.charAt(0).toUpperCase() + data.status.slice(1),
      //     text: data.errorMessage || `Download for ${data.fieldName} ${data.status}`,
      //     timer: 1500,
      //     showConfirmButton: false,
      //   });
      // }
    });


    socket.on('downloadProgressLive', (data) => {
      // console.log('Received progress:', data);
      if (data.progress == 100) {
        setDownloadJobs((prev) => ({
          ...prev,
          [data.fieldName]: {
            jobId: data.jobId,
            status: "completed",
            progress: 100,
            fieldName: data.fieldName,
            errorMessage: data.errorMessage,
          },
        }));
      } else {
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

      }
    });

    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err.message);
    });

    return () => {
      socket.disconnect();
    };
  }, [currentUser?.id]);

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
          <div className="flex flex-col sm:flex-row gap-2">
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
            <button
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
                'Copy'
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
                Total Data - <span className="font-bold">{formsData?.length}</span>
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