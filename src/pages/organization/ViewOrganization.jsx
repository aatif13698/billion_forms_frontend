import React, { useEffect, useState } from "react";
import Hamberger from "../../components/Hamberger/Hamberger";
import { useLocation, useNavigate } from "react-router-dom";
import { FaEnvelope, FaMapMarkerAlt, FaPhone, FaUsers, FaEdit, FaTrash, FaTrashAlt, FaRegEdit, FaRegUser, FaUser, FaSpinner } from "react-icons/fa";
import LoadingModel from "../../components/Loading/LoadingModel";
import organizationService from "../../services/organizationService";
import { FcBusinessman } from "react-icons/fc";
import sessionService from "../../services/sessionService";
import { FaCopy, FaExclamationCircle } from "react-icons/fa";
import common from "../../helper/common";
import { FaWpforms } from "react-icons/fa6";

// import { format } from "date-fns";


function ViewOrganization() {

    // loading handling
    const [showLoadingModal, setShowLoadingModal] = useState(false);
    const handleCloseLoadingModal = () => {
        setShowLoadingModal(false);
    };

    const location = useLocation();
    const client = location?.state?.organization;

    console.log("client", client);

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        captionText: "",
        address: "",
        email: "",
        phone: "",
    });
    const [logoPreview, setLogoPreview] = useState("");
    const [bannerPreview, setBannerPreview] = useState("");
    const [refreshCount, setRefreshCount] = useState(0);
    const [isDataLoading, setIsDataLoading] = useState(true)

    useEffect(() => {
        if (client) {
            setFormData({
                name: client?.name || "",
                email: client?.email || "",
                phone: client?.phone || "",
                address: client?.address || "",
                captionText: client?.captionText || "",
            });
            setBannerPreview(`${import.meta.env.VITE_API_URL_IMG}${client?.banner || ""}`);
            setLogoPreview(`${import.meta.env.VITE_API_URL_IMG}${client?.logo || ""}`);
        }
    }, [client]);

    const handleManageUser = () => {
        console.log("Manage User clicked");
    };

    const handleEdit = async () => {
        try {
            setShowLoadingModal(true);
            const response = await organizationService.getParticularOrganization(client?._id);
            setShowLoadingModal(false);
            setTimeout(() => {
                navigate("/create/organization", { state: { organization: response?.data?.data?.data } })
            }, 500);
        } catch (error) {
            setShowLoadingModal(false);
            console.log("error while getting the particular organization", error);
        }
    };

    const handleDelete = () => {
        console.log("Delete clicked");
    };

    // session handling
    const [formData2, setFormData2] = useState({
        session: "",
        for: "",
        closeDate: "",
        status: false,
        isPasswordRequired: false,
        password: ""
    });
    const [sessions, setSessions] = useState([])
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    console.log("formData2", formData2);


    const sessionRegex = /^\d{4}-\d{2}$/; // Matches YYYY-YY

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData2({ ...formData2, [name]: value });
        // Clear error when user starts typing
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleToggle = () => {
        setFormData2((prev) => ({ ...prev, status: !prev.status }));
        setErrors((prev) => ({ ...prev, status: "" }));
    };

    const handleToggle2 = () => {
        setFormData2((prev) => ({ ...prev, isPasswordRequired: !prev.isPasswordRequired }));
        setErrors((prev) => ({ ...prev, isPasswordRequired: "" }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData2.session.trim()) {
            newErrors.session = "Session is required";
        } else if (!sessionRegex.test(formData2.session)) {
            newErrors.session = "Session must be in YYYY-YY format (e.g., 2023-24)";
        }
        if (!formData2.for.trim()) {
            newErrors.for = "For field is required";
        }
        if (!formData2.password.trim()) {
            newErrors.password = "Password is required";
        }
        if (!formData2.closeDate) {
            newErrors.closeDate = "Close date is required";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setIsSubmitting(true);
        try {
            const dataObject = {
                organizationId: client?._id, name: formData2?.session, forWhom: formData2?.for, isActive: formData2?.status, closeDate: formData2?.closeDate, isPasswordRequired : formData2?.isPasswordRequired, password : formData2?.password
            }
            const response = await sessionService.createSession(dataObject);
            console.log("response session", response);
            setFormData2({ session: "", for: "", closeDate: "", status: false, password: "", isPasswordRequired : false });
            setErrors({});
            setRefreshCount((prev) => prev + 1);
        } catch (error) {
            console.error("Error submitting session:", error);
            setErrors({ general: "An error occurred. Please try again." });
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        if (client?._id) {
            getSessions()
        }
    }, [client, refreshCount]);

    async function getSessions(params) {
        try {
            setIsDataLoading(true);
            const response = await sessionService.getAllSession(client?.userId, client?._id);
            setSessions(response?.data?.data?.data);
            setIsDataLoading(false);

        } catch (error) {
            setIsDataLoading(false);
            console.log("error while fetching the session", error);
        }
    }


    // handle session list
    const [copiedLink, setCopiedLink] = useState(null);

    const handleCopyLink = (link) => {
        navigator.clipboard.writeText(link).then(() => {
            setCopiedLink(link);
            setTimeout(() => setCopiedLink(null), 2000); // Reset after 2s
        });
    };

    function handleAddField(session) {
        navigate("/list/fields", { state: { session: session, organization: client } })
    }

    return (
        <div className="flex flex-col md:mx-4 mx-2 mt-3 min-h-screen bg-light dark:bg-dark">
            <Hamberger text="Organization / View" />
            <div className="w-[100%] mb-20 bg-cardBgLight dark:bg-cardBgDark shadow-lg rounded-lg p-1">
                <div
                    className="relative min-h-[200px] border-2 hover:border-subscriptionCardBgLightFrom bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:shadow-xl"
                >
                    {/* Banner background */}
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage: `url(${bannerPreview})`,
                        }}
                    />
                    {/* Overlay for text readability */}
                    <div className="relative z-10 bg-black bg-opacity-50 hover:bg-opacity-40 flex flex-col justify-between py-6 px-4">
                        {/* Logo in top-right corner */}
                        <div className="absolute z-20 top-4 right-4">
                            <img
                                src={logoPreview}
                                alt={`${formData.name} logo`}
                                className="h-16 w-16 rounded-full object-cover border-2 border-white dark:border-gray-200 shadow-md"
                            // onError={(e) => {
                            //     e.target.src = '/fallback-logo.png'; // Fallback image
                            // }}
                            />
                        </div>
                        {/* School details */}
                        <div className="text-left text-white w-[100%] max-w-md">
                            <h2 className="text-xl md:text-4xl font-bold mb-2 drop-shadow-md">
                                {formData?.name}
                            </h2>
                            <h4 className="text-sm md:text-base font-medium mb-1 drop-shadow-sm">
                                {formData?.captionText}
                            </h4>
                            <div className="flex items-center text-sm md:text-base font-medium mb-1 drop-shadow-sm">
                                <FaEnvelope className="mr-2 text-white" />
                                <span>{formData?.email}</span>
                            </div>
                            <div className="flex items-center text-sm md:text-base font-medium mb-1 drop-shadow-sm">
                                <FaPhone className="mr-2 text-white" />
                                <span>{formData?.phone}</span>
                            </div>
                            <div className="flex items-center text-sm md:text-base font-light drop-shadow-sm">
                                <FaMapMarkerAlt className="mr-2 text-white" />
                                <span>{formData?.address}</span>
                            </div>
                        </div>
                        {/* Action buttons */}
                        <div className="flex flex-wrap justify-start gap-2 mt-4">
                            <button
                                onClick={handleManageUser}
                                className="flex items-center justify-center gap-2 px-2 sm:px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-700 dark:from-blue-600 dark:to-blue-800 rounded-lg shadow-md hover:from-blue-600 hover:to-blue-800 dark:hover:from-blue-700 dark:hover:to-blue-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[120px] w-[45%] sm:w-auto"
                                aria-label="Manage users for this organization"
                            >
                                <FaUser />
                                Manage User
                            </button>
                            <button
                                onClick={handleEdit}
                                className="flex items-center justify-center gap-2 px-2 sm:px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-500 to-green-700 dark:from-green-600 dark:to-green-800 rounded-lg shadow-md hover:from-green-600 hover:to-green-800 dark:hover:from-green-700 dark:hover:to-blue-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 min-w-[120px] w-[45%] sm:w-auto"
                                aria-label="Edit this organization"
                            >
                                <FaRegEdit />
                                Edit
                            </button>
                            <button
                                onClick={handleDelete}
                                className="flex items-center justify-center gap-2 px-2 sm:px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-700 dark:from-red-600 dark:to-red-800 rounded-lg shadow-md hover:from-red-600 hover:to-red-800 dark:hover:from-red-700 dark:hover:to-blue-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 min-w-[120px] w-[45%] sm:w-auto"
                                aria-label="Delete this organization"
                            >
                                <FaTrashAlt />
                                Delete
                            </button>
                        </div>
                    </div>
                </div>

                {/* sessions list */}

                {
                    isDataLoading ? 
                    <>
                        <div className="w-[100%] h-60 flex justify-center items-center mb-4 bg-cardBgLight dark:bg-cardBgDark  p-6 ">
                            <svg
                                className={`animate-spin mr-2 h-10 w-10  text-black dark:text-white`}
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
                            <span>Loading</span>
                        </div>
                    </> 
                     :

                     <div className="flex flex-col p-1 md:max-w-screen-xl mx-auto">
                     {sessions && sessions.length > 0 ? (
                         sessions.map((item, index) => (
                             <div
                                 key={index}
                                 className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg my-4 overflow-hidden"
                                 aria-label={`Session ${item?.name} for ${item?.for}`}
                             >
                                 <div className="flex flex-col md:flex-row border-b border-gray-300 dark:border-gray-600">
                                     {/* Sidebar/Header */}
                                     <div className="bg-custom-gradient-session-light dark:bg-custom-gradient-session-dark flex flex-col justify-center items-center px-4 py-3 sm:py-4 md:w-1/4">
                                         <p className="text-base sm:text-lg font-semibold text-white">
                                             {item?.for}
                                         </p>
                                         <p className="text-xs sm:text-sm text-white">{item?.name}</p>
                                     </div>
                                     {/* Details Section */}
                                     <div className="flex-1 px-3 sm:px-4 py-4 bg-white dark:bg-sessionTableBgDark  sm:py-6">
                                         {/* Mobile: Stacked Layout */}
                                         <div className="sm:hidden flex flex-col gap-3 text-xs text-gray-700 dark:text-gray-200">
                                             <div className="border-b-2 pb-2">
                                                 <span className="font-bold">Shareable Link</span>
                                                 <div className="flex flex-col items-start gap-2 mt-1">
                                                 <a
                                                             href={item?.link}
                                                             target="_blank"
                                                             rel="noopener noreferrer"
                                                             className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 truncate max-w-[300px]"
                                                         >
                                                             {item?.link}
                                                         </a>
                                                     <button
                                                         onClick={() => handleCopyLink(item?.link)}
                                                         className="flex items-center  text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                                                         aria-label="Copy shareable link"
                                                         title="Copy link"
                                                     >
                                                         <FaCopy />
                                                         {copiedLink === item?.link && (
                                                             <span className="text-green-500 text-xs">Copied!</span>
                                                         )}
                                                     </button>
 
                                                 </div>
                                             </div>
                                             <div className="border-b-2 pb-2">
                                                 <span className="font-bold">Form Close Date</span>
                                                 <p className="mt-1">
                                                     {item?.closeDate
                                                         ? common.formatDateToReadableString(item.closeDate)
                                                         : "N/A"}
                                                 </p>
                                             </div>
                                             <div className="border-b-2 pb-2">
                                                 <span className="font-bold">Total Forms Received</span>
                                                 <p className="mt-1">{item?.formReceived || 0}</p>
                                             </div>
                                             <div className="">
                                                 <span className="font-bold">Form Fields</span>
                                                 {/* <p className="mt-1">
                                                     {item?.formFields?.join(", ") || "N/A"}
                                                 </p> */}
                                                 <button
                                                     onClick={() => handleAddField(item)}
                                                     className="flex mt-2 items-center gap-1 px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-700 dark:from-blue-600 dark:to-blue-800 rounded-lg shadow-md hover:from-blue-600 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                     aria-label={`Add/Remove Fields`}
                                                 >
                                                     <FaWpforms />
                                                     Add / Remove Fields
                                                 </button>
                                             </div>
                                         </div>
                                         {/* Tablet/Desktop: Table Layout */}
                                         <table className="hidden sm:table w-[100%] text-xs sm:text-sm text-gray-700 dark:text-gray-200">
                                             <tbody>
                                                 <tr className="border-b w-[100%]  border-gray-200 dark:border-gray-700">
                                                     <th
                                                         scope="row"
                                                         className="py-2 px-3 sm:px-4 font-bold text-left  w-[40%]"
                                                     >
                                                         Shareable Link
                                                     </th>
                                                     <td className="py-2 px-3 sm:px-4 w-[60%]  flex items-center gap-2">
                                                         <a
                                                             href={item?.link}
                                                             target="_blank"
                                                             rel="noopener noreferrer"
                                                             className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 truncate max-w-[300px]"
                                                         >
                                                             {item?.link}
                                                         </a>
                                                         <button
                                                             onClick={() => handleCopyLink(item?.link)}
                                                             className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                                                             aria-label="Copy shareable link"
                                                             title="Copy link"
                                                         >
                                                             <FaCopy />
                                                         </button>
                                                         {copiedLink === item?.link && (
                                                             <span className="text-green-500 text-xs">Copied!</span>
                                                         )}
                                                     </td>
                                                 </tr>
                                                 <tr className="border-b border-gray-200 dark:border-gray-700">
                                                     <th
                                                         scope="row"
                                                         className="py-2 px-3 sm:px-4 font-bold text-left w-[40%]"
                                                     >
                                                         Form Close Date
                                                     </th>
                                                     <td className="py-2 px-3 sm:px-4 w-[60%]">
                                                         {item?.closeDate
                                                             ? common.formatDateToReadableString(item.closeDate)
                                                             : "N/A"}
                                                     </td>
                                                 </tr>
                                                 <tr className="border-b border-gray-200 dark:border-gray-700">
                                                     <th
                                                         scope="row"
                                                         className="py-2 px-3 sm:px-4 font-bold text-left w-[40%]"
                                                     >
                                                         Total Forms Received
                                                     </th>
                                                     <td className="py-2 px-3 sm:px-4 w-[60%]">
                                                         {item?.formReceived || 0}
                                                     </td>
                                                 </tr>
                                                 <tr>
                                                     <th
                                                         scope="row"
                                                         className="py-2 px-3 sm:px-4 font-bold text-left w-[40%]"
                                                     >
                                                         Form Fields
                                                     </th>
                                                     <td className="py-2 px-3 sm:px-4 w-[60%]">
                                                         <button
                                                             onClick={() => handleAddField(item)}
                                                             className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-700 dark:from-blue-600 dark:to-blue-800 rounded-lg shadow-md hover:from-blue-600 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                             aria-label={`Add or remove fields for ${item?.name}`}
                                                         >
                                                             <FaWpforms />
                                                             Add / Remove Fields
                                                         </button>
                                                     </td>
                                                 </tr>
                                             </tbody>
                                         </table>
                                     </div>
                                 </div>
                                 {/* Footer */}
                                 <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center px-3 sm:px-4 py-2 sm:py-3 bg-custom-gradient-session-light dark:bg-custom-gradient-session-dark text-white dark:text-dark gap-2">
                                     <p className="text-xs sm:text-sm text-white ">
                                         <span className="font-bold">Created on:</span> {" "}
                                         {item?.createdAt
                                             ? common.formatDateToReadableString(item.createdAt)
                                             : "N/A"}
                                     </p>
                                     <div className="flex gap-2">
 
                                         <button
                                             className="flex items-center gap-1 px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-700 dark:from-red-600 dark:to-red-800 rounded-lg shadow-md hover:from-red-600 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                                             aria-label={`Delete session ${item?.name}`}
                                         >
                                             <FaTrashAlt />
                                             Delete
                                         </button>
                                     </div>
                                 </div>
                             </div>
                         ))
                     ) : (
                         <div className="flex mt-4 flex-col justify-center items-center py-8 sm:py-12 bg-gray-100 dark:bg-gray-900 rounded-xl shadow-md">
                             <FaExclamationCircle className="text-3xl sm:text-4xl text-gray-400 dark:text-gray-500 mb-3 sm:mb-4" />
                             <p className="text-base sm:text-lg font-medium text-gray-600 dark:text-gray-300 mb-3 sm:mb-4">
                                 No Sessions Found
                             </p>
                         </div>
                     )}
                 </div>

                }

               
                {/* Add New Session */}
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
          }
        `}
                    </style>
                    <div className="w-[100%] max-w-2xl border-subscriptionCardBgLightFrom border-2 dark:border-white bg-cardBgLight dark:bg-cardBgDark shadow-lg rounded-lg p-6">
                        <h2 className="md:text-2xl text-1xl font-semibold text-formHeadingLight dark:text-formHeadingDark md:mb-2 mb-2 text-start">Add New Session</h2>
                        <div className="h-[1.8px] bg-black dark:bg-white mb-4"></div>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label
                                    htmlFor="session"
                                    className="block text-sm font-medium text-formLabelLight dark:text-formLabelDark mb-1"
                                >
                                    Session
                                </label>
                                <input
                                    type="text"
                                    id="session"
                                    name="session"
                                    value={formData2.session}
                                    onChange={handleChange}
                                    className="w-[100%] bg-transparent border border-gray-300    rounded-lg p-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="YYYY-YY (e.g., 2023-24)"
                                    aria-describedby={errors.session ? "session-error" : undefined}
                                />
                                {errors.session && (
                                    <p id="session-error" className="text-red-500 text-sm mt-1">
                                        {errors.session}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label
                                    htmlFor="for"
                                    className="block text-sm font-medium text-formLabelLight dark:text-formLabelDark mb-1"
                                >
                                    For
                                </label>
                                <input
                                    type="text"
                                    id="for"
                                    name="for"
                                    value={formData2.for}
                                    onChange={handleChange}
                                    className="w-[100%] bg-transparent border border-gray-300 rounded-lg p-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="e.g., Student"
                                    aria-describedby={errors.for ? "for-error" : undefined}
                                />
                                {errors.for && (
                                    <p id="for-error" className="text-red-500 text-sm mt-1">
                                        {errors.for}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label
                                    htmlFor="closeDate"
                                    className="block text-sm font-medium text-formLabelLight dark:text-formLabelDark mb-1"
                                >
                                    Close Date
                                </label>
                                <input
                                    type="date"
                                    id="closeDate"
                                    name="closeDate"
                                    value={formData2.closeDate}
                                    onChange={handleChange}
                                    className="w-[100%] bg-transparent border border-gray-300    rounded-lg p-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    aria-describedby={errors.closeDate ? "closeDate-error" : undefined}
                                />
                                {errors.closeDate && (
                                    <p id="closeDate-error" className="text-red-500 text-sm mt-1">
                                        {errors.closeDate}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label
                                    htmlFor="status"
                                    className="block text-sm font-medium text-formLabelLight dark:text-formLabelDark mb-1"
                                >
                                    Status
                                </label>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="status"
                                        checked={formData2.status}
                                        onChange={handleToggle}
                                        className="sr-only"
                                        aria-label="Toggle session status"
                                    />
                                    <div
                                        onClick={handleToggle}
                                        className={`relative inline-flex items-center h-6 w-11 rounded-full cursor-pointer transition-colors duration-200 ${formData2.status
                                            ? "bg-blue-500 dark:bg-blue-600"
                                            : "bg-gray-300 dark:bg-gray-600"
                                            }`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 rounded-full bg-white transform transition-transform duration-200 ${formData2.status ? "translate-x-6" : "translate-x-1"
                                                }`}
                                        />
                                    </div>
                                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                        {formData2.status ? "Active" : "Inactive"}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-formLabelLight dark:text-formLabelDark mb-1"
                                >
                                    Password
                                </label>
                                <input
                                    type="text"
                                    id="password"
                                    name="password"
                                    value={formData2.password}
                                    onChange={handleChange}
                                    className="w-[100%] bg-transparent border border-gray-300 rounded-lg p-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter Password"
                                    aria-describedby={errors.password ? "for-error" : undefined}
                                />
                                {errors.password && (
                                    <p id="for-error" className="text-red-500 text-sm mt-1">
                                        {errors.password}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label
                                    htmlFor="isPasswordRequired"
                                    className="block text-sm font-medium text-formLabelLight dark:text-formLabelDark mb-1"
                                >
                                    Password Required
                                </label>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="isPasswordRequired"
                                        checked={formData2.isPasswordRequired}
                                        onChange={handleToggle2}
                                        className="sr-only"
                                        aria-label="Toggle session isPasswordRequired"
                                    />
                                    <div
                                        onClick={handleToggle2}
                                        className={`relative inline-flex items-center h-6 w-11 rounded-full cursor-pointer transition-colors duration-200 ${formData2.isPasswordRequired
                                            ? "bg-blue-500 dark:bg-blue-600"
                                            : "bg-gray-300 dark:bg-gray-600"
                                            }`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 rounded-full bg-white transform transition-transform duration-200 ${formData2.isPasswordRequired ? "translate-x-6" : "translate-x-1"
                                                }`}
                                        />
                                    </div>
                                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                        {formData2.isPasswordRequired ? "Yes" : "No"}
                                    </span>
                                </div>
                            </div>
                            
                        </form>
                        {errors.general && (
                            <p className="text-red-500 text-sm mt-4 text-center">
                                {errors.general}
                            </p>
                        )}
                        <div className="flex justify-end mt-6">
                            <button
                                type="submit"
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
                                    "Add Session"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <LoadingModel showLoadingModal={showLoadingModal} setShowLoadingModal={setShowLoadingModal} handleCloseLoadingModal={handleCloseLoadingModal} />
        </div>
    );
}

export default ViewOrganization;