import React, { useEffect, useState } from 'react'
import CryptoJS from "crypto-js";
import { useParams } from 'react-router-dom';
import customFieldService from '../../services/customFieldService';
import Hamberger from '../../components/Hamberger/Hamberger';
import { div } from 'framer-motion/client';
import { FaEnvelope } from 'react-icons/fa';
import LoadingSpinner from '../../components/Loading/LoadingSpinner';


// Secret key for decryption (same as used for encryption)
const SECRET_KEY = import.meta.env.VITE_ENCRYPTION_KEY || "my-secret-key";
const decryptId = (encryptedId) => {
    try {
        const decoded = decodeURIComponent(encryptedId);
        const bytes = CryptoJS.AES.decrypt(decoded, SECRET_KEY);
        return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
        console.error("Decryption failed:", error);
        return null;
    }
};


function SubmitForm() {
    const { formId: encryptedId } = useParams();
    const [logoPreview, setLogoPreview] = useState("");
    const [bannerPreview, setBannerPreview] = useState("");
    const [decryptedId, setDecryptedId] = useState("");
    const [organizationData, setOrganizationData] = useState(null);
    const [sessionData, setDessionData] = useState(null)
    const [existingFields, setExistingFields] = useState([]); // Store fields fetched from API
    const [errors, setErrors] = useState([]);

    const [isPageLoading, setIspageLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);


    // form handling
    const [customizationValues, setCustomizationValues] = useState({});

    console.log("customizationValues",customizationValues);
    


    // handle input
    const handleInputChange = (fieldName, value) => {
        setCustomizationValues((prev) => ({
            ...prev,
            [fieldName]: value,
        }));
    };




    useEffect(() => {
        if (encryptedId) {
            const decryptedId = decryptId(encryptedId);
            setDecryptedId(decryptedId);
            fetchFields(decryptedId)
        }
    }, [encryptedId]);


    const fetchFields = async (decryptedId) => {
        try {
            setIspageLoading(true)
            const response = await customFieldService.getCustomFormsBySession(decryptedId);
            console.log("fields", response?.data?.data?.data);
            setExistingFields(response?.data?.data?.data);
            setOrganizationData(response?.data?.data?.data[0]?.sessionId?.organizationId);
            setDessionData(response?.data?.data?.data[0]?.sessionId)
            setBannerPreview(`${import.meta.env.VITE_API_URL_IMG}${response?.data?.data?.data[0]?.sessionId?.organizationId?.banner || ""}`);
            setLogoPreview(`${import.meta.env.VITE_API_URL_IMG}${response?.data?.data?.data[0]?.sessionId?.organizationId?.logo || ""}`);
            setIspageLoading(false)
        } catch (error) {
            setIspageLoading(false)
            setErrors(['Failed to fetch existing fields']);
        }
    };


    const renderFieldPreview = (field) => {
        const baseStyles = "w-[100%] bg-transparent  p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500";
        const fieldName = field.name;
        // console.log("field",field);
        
        switch (field.type) {
            case 'text':
            case 'number':
            case 'email':
            case 'hyperlink':
                return (
                    <input
                        // name={}
                        type={field?.type}
                        placeholder={field?.placeholder}
                        className={baseStyles}
                        value={customizationValues[fieldName] || ""}
                        onChange={(e) => handleInputChange(fieldName, e.target.value)}
                    />
                );
            case 'textarea':
                return (
                    <textarea
                        placeholder={field?.placeholder}
                        className={`${baseStyles} min-h-[100px]`}
                        value={customizationValues[fieldName] || ""}
                        onChange={(e) => handleInputChange(fieldName, e.target.value)}
                    />
                );
            case 'select':
            case 'multiselect':
                return (
                    <select
                        className={baseStyles}
                        value={customizationValues[fieldName] || ""}
                        onChange={(e) => handleInputChange(fieldName, e.target.value)}
                    >
                        <option value="">{field?.placeholder || 'Select an option'}</option>
                        {field?.options?.map((opt, idx) => (
                            <option key={idx} value={opt}>{opt}</option>
                        ))}
                    </select>
                );
            case 'checkbox':
                return (
                    <input
                        type="checkbox"
                        checked={customizationValues[fieldName] || false}
                        onChange={(e) => handleInputChange(fieldName, e.target.checked)}
                        className="h-5 w-5 text-blue-600"
                    />
                );
            case 'file':
                return (
                    <input
                        type="file"
                        accept={field?.validation?.fileTypes?.join(',')}
                        onChange={(e) => handleInputChange(fieldName, e.target.files[0])} // Store file object
                        className={baseStyles}
                    />
                );
            case 'date':
                return (
                    <input
                        type="date"
                        placeholder={field?.placeholder || 'Select a date'}
                        className={baseStyles}
                    />
                );
            case 'timepicker':
                return (
                    <input
                        type="time"
                        placeholder={field?.placeholder || 'Select a time'}
                        className={baseStyles}
                    />
                );
            case 'color':
                return (
                    <input
                        type="color"
                        className={`${baseStyles} h-10 cursor-not-allowed`}
                    />
                );
            default:
                return <div className={baseStyles}>{field?.type} (Preview not available)</div>;
        }
    };

    async function handleFormSubmit () {
        try {


            
        } catch (error) {
            console.log("error while submitting dynamic form", error);
        }
    }

    return (
        <div className="flex justify-center  h-full overflow-auto bg-light dark:bg-dark">
            {isPageLoading ? (
                <LoadingSpinner />
            ) : (
                <div className="w-full max-w-4xl mx-auto flex flex-col p-2 sm:p-4 mt-2 sm:mt-3">
                    {/* Header */}
                    <div className="w-[100%] bg-cardBgLight dark:bg-cardBgDark rounded-t-md shadow-lg">
                        <div className="relative  border-2 hover:border-subscriptionCardBgLightFrom bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden transition-transform duration-300 hover:shadow-xl">
                            {/* Banner Background */}
                            <div
                                className="absolute inset-0 bg-cover bg-center"
                                style={{ backgroundImage: `url(${bannerPreview})` }}
                            />
                            {/* Logo */}
                            <div className="absolute z-20 top-2 sm:top-4 right-2 sm:right-4">
                                <img
                                    src={logoPreview}
                                    alt={`${organizationData?.name} logo`}
                                    className="h-12 sm:h-16 w-12 sm:w-16 rounded-full object-cover border-2 border-white dark:border-gray-200 shadow-md"
                                    // onError={(e) => (e.target.src = "/fallback-logo.png")}
                                />
                            </div>
                            {/* Overlay and Text */}
                            <div className="relative z-10 bg-black bg-opacity-50 hover:bg-opacity-40 flex flex-col justify-between py-4 sm:py-6 px-3 sm:px-4">
                                <div className="text-left text-white w-full">
                                    <h2 className="text-lg sm:text-2xl md:text-4xl font-bold mb-2 drop-shadow-md">
                                        {organizationData?.name || "Organization Name"}
                                    </h2>
                                    <h4 className="text-xs sm:text-sm md:text-base font-medium mb-1 drop-shadow-sm">
                                        {organizationData?.captionText || "Caption Text"}
                                    </h4>
                                    <h2 className="text-base sm:text-xl md:text-3xl font-bold mb-2 drop-shadow-md">
                                        {`${sessionData?.for || "Session"} (${sessionData?.name || "Name"
                                            })`}
                                    </h2>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="w-[100%] bg-cardBgLight dark:bg-cardBgDark shadow-lg rounded-b-md p-4 sm:p-6">
                        <form
                            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
                            aria-label="Session form preview"
                        >
                            {[...existingFields]
                                .sort((a, b) => a.gridConfig?.order - b.gridConfig?.order)
                                .map((field, index) => (
                                    <div
                                        key={index}
                                        style={{ order: field?.gridConfig?.order }}
                                        className={`min-w-0 ${field?.type == "checkbox" ? "flex items-center gap-2" : ""}`}
                                    >
                                        <label className="block text-xs sm:text-sm font-medium text-formLabelLight dark:text-formLabelDark mb-1">
                                            {field?.label}
                                            {field?.isRequired && (
                                                <span className="text-red-500">*</span>
                                            )}
                                        </label>
                                        {renderFieldPreview(field)}
                                    </div>
                                ))}
                            <div className="flex justify-end mt-4 col-span-1 sm:col-span-2 md:col-span-3">
                                <button
                                    onClick={handleFormSubmit}
                                    disabled={isSubmitting}
                                    className="w-auto p-2 text-sm text-white rounded-lg transition-all duration-300 ease-in-out 
                  bg-custom-gradient-button-dark dark:bg-custom-gradient-button-light 
                   hover:bg-custom-gradient-button-light dark:hover:bg-custom-gradient-button-dark 
                   flex items-center justify-center shadow-lg"
                                    aria-label="Submit session form"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <svg
                                                className="animate-spin mr-2 h-4 sm:h-5 w-4 sm:w-5 text-white"
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
                                            Submitting...
                                        </>
                                    ) : (
                                        "Submit Form"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default SubmitForm
