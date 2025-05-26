import React, { memo, useEffect, useState } from 'react';
import logoWhite from "../../assets/logo/logo.png"
import "../../App.css"


import useWidth from '../../Hooks/useWidth';
import { Link, NavLink, useNavigate, useParams } from 'react-router-dom';
import useDarkmode from '../../Hooks/useDarkMode';
import authSrvice from '../../services/authSrvice';
import { setClientUser } from '../../store/reducer/auth/authCustomerSlice';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/Loading/LoadingSpinner';
import CryptoJS from "crypto-js";
import customFieldService from '../../services/customFieldService';



// Secret key for decryption
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

const FormPassword = ({ companyIdentifier }) => {
    const { formId: encryptedId } = useParams();
    const [decryptedId, setDecryptedId] = useState("");
    const [logoPreview, setLogoPreview] = useState("");
    const [organizationData, setOrganizationData] = useState(null);
    const [sessionData, setSessionData] = useState(null);
    const [isPageLoading, setIsPageLoading] = useState(true);

    useEffect(() => {
        if (encryptedId) {
            const decryptedId = decryptId(encryptedId);
            if (decryptedId) {
                setDecryptedId(decryptedId);
                fetchFields(decryptedId);
            } else {
                setErrors({ general: "Invalid or corrupted form ID" });
            }
        }
    }, [encryptedId]);

    const fetchFields = async (decryptedId) => {
        try {
            setIsPageLoading(true);
            const response = await customFieldService.getCustomFormsBySession(decryptedId);
            const fields = response?.data?.data?.data || [];
            setOrganizationData(fields[0]?.sessionId?.organizationId);
            setSessionData(fields[0]?.sessionId);
            setLogoPreview(
                `${import.meta.env.VITE_API_URL_IMG}${fields[0]?.sessionId?.organizationId?.logo || ""}`
            );
            setIsPageLoading(false);
        } catch (error) {
            console.error("Error fetching fields:", error);
            setIsPageLoading(false);
            setErrors({ general: "Failed to fetch form fields" });
        }
    };

    const [companyName, setCompanyName] = useState("");
    const [dataLoading, setDataLoading] = useState(true);

    const navigate = useNavigate();
    const [errors, setErrors] = useState([]);

    const { width, breakpoints } = useWidth();
    const [formData, setFormData] = useState({
        serialNumber: '',
        password: '',
    });

    console.log("formData", formData);

    const [formDataError, setFormDataError] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleValidation = (name, value) => {
        const errors = {};
        switch (name) {
            case 'serialNumber':
                if (!value) {
                    errors.serialNumber = 'ID is required.';
                } else {
                    errors.serialNumber = '';
                }
                break;
            case 'password':
                if (!value) {
                    errors.password = 'Password is required.';
                } else {
                    errors.password = '';

                }
                break;
            default:
                break;
        }
        return errors;
    };

    const encryptId = (id) => {
            const encrypted = CryptoJS.AES.encrypt(id.toString(), SECRET_KEY).toString();
            // URL-safe encoding
            return encodeURIComponent(encrypted);
    };


    function handleChange(e) {
        const { name, value } = e.target;
        const error = handleValidation(name, value);
        setFormDataError((prev) => ({ ...prev, ...error }));
        setFormData((prev) => ({ ...prev, [name]: value }));
    }

    const validateFormData = () => {
        const errors = {};
        let hasError = false;

        Object.keys(formData).forEach((key) => {
            const error = handleValidation(key, formData[key]);
            if (Object.keys(error).length > 0) {
                Object.assign(errors, error);
            }
        });

        const isValid = Object.values(errors).every(value => value === '');
        if (!isValid) {
            hasError = true;
        }

        setFormDataError(errors);
        return hasError;
    };

    async function handleSubmit(e) {
        e.preventDefault();
        setIsSubmitting(true);
        if (validateFormData()) {
            setIsSubmitting(false);
            return;
        }
        const dataObject = {
            serialNumber: formData?.serialNumber,
            password: formData?.password
        };
        try {
            const response = await customFieldService.submitFormPassword(dataObject);
            const data = response?.data;
            console.log("data form login", data);

            if (data.success) {
                navigate(`/editform/${encryptId(decryptedId)}/${encryptId(data?.data?._id)}`)
            }

            setIsSubmitting(false);


        } catch (error) {
            setIsSubmitting(false);
            console.error('Login error:', error);
            const errorMessage = error || 'Login failed. Please try again.';
            setErrors([errorMessage]); // Optional: keep in state if you still want to display in UI
        } finally {
            setIsSubmitting(false);
        }
    }


    useEffect(() => {
        getCompanyDetail()
    }, [])

    async function getCompanyDetail() {
        try {
            setDataLoading(true)
            const response = await authSrvice.getCompanyData();
            setCompanyName(response?.data?.data?.name);
            setDataLoading(false)
        } catch (error) {
            setDataLoading(false)
            console.log("error while getting the company detail", error);
        }
    }


    return (

        <>
            {
                dataLoading ?
                    <div className='min-h-screen w-full flex justify-center'>
                        <LoadingSpinner />
                    </div > :
                    <div className=' min-h-screen w-full flex justify-center bg-custom-gradient-sidebar dark:bg-custom-gradient-sidebar-dark '>
                        <div className='w-[100%] mx-3 h-fulll sm:w-[100%] md:w-[60%] '>
                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 '>
                                {
                                    width < breakpoints?.md ? "" :
                                        <div className=' text-white h-full flex flex-col gap-3  items-center justify-center relative'>
                                            <img
                                                src={logoPreview}
                                                alt="org-logo"
                                                className=' rounded-full  w-[15%] '
                                            />
                                            <h2 className="text-xl md:text-4xl font-bold mb-2 drop-shadow-md">
                                                {organizationData?.name}
                                            </h2>
                                            <h2 className="text-base sm:text-xl md:text-3xl font-bold mb-2 drop-shadow-md">
                                                {`${sessionData?.for || "Session"} (${sessionData?.name || "Name"})`}
                                            </h2>
                                        </div>
                                }
                                {/* form div */}
                                <div className='  h-full w-[100%] flex flex-col justify-center items-center   '>
                                    <div className='w-[100%] mb-3'>
                                        <div className='sm:border-2 border-2  border-light rounded-sm p-6  max-w-md mx-auto shadow-md'>
                                            <div className='flex flex-col items-center justify-center py-2'>
                                                <h2
                                                    className="text-xl font-semibold bg-gradient-to-r from-textGradientLightFrom to-textGradientLightkTo dark:from-textGradientDarktFrom dark:to-textGradientDarkTo bg-clip-text text-transparent   pb-1"
                                                >{companyName || "Invalid Company"}</h2>
                                                {
                                                    width < breakpoints?.md ?
                                                        <>
                                                            <h2 className="text-xl md:text-4xl text-white font-bold mb-1 drop-shadow-md">
                                                                {organizationData?.name}
                                                            </h2>
                                                            <h2 className="text-base sm:text-xl text-white md:text-3xl font-bold mb-1 drop-shadow-md">
                                                                {`${sessionData?.for || "Session"} (${sessionData?.name || "Name"})`}
                                                            </h2>
                                                        </>
                                                        : ""
                                                }
                                            </div>
                                            <div className='w-[90%]   rounded-lg flex justify-center items-center mx-auto'>
                                                <div className='w-[100%] space-y-4'>
                                                    {errors.length > 0 && (
                                                        <div className="p-4 bg-red-100 rounded-md">
                                                            {errors.map((error, index) => (
                                                                <p key={index} className="text-red-700 text-sm">{error}</p>
                                                            ))}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <input
                                                            name='serialNumber'
                                                            type="text"
                                                            placeholder='Enter ID'
                                                            onChange={handleChange}
                                                            className="w-[100%] text-white bg-transparent p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                        <span className='text-deep-orange-400 text-sm mt-4 pb-0 mb-0'>{formDataError?.serialNumber}</span>
                                                    </div>
                                                    <div>
                                                        <input
                                                            name='password'
                                                            type="password"
                                                            placeholder='Password'
                                                            className="w-[100%] text-white bg-transparent p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            onChange={handleChange}
                                                        />
                                                        <span className='text-deep-orange-400 text-sm mt-4 pb-0 mb-0'>{formDataError?.password}</span>
                                                    </div>
                                                    <button
                                                        onClick={handleSubmit}
                                                        disabled={isSubmitting}
                                                        className="w-[100%] p-2 text-sm text-white rounded-lg transition-all duration-300 ease-in-out bg-custom-gradient-button-dark dark:bg-custom-gradient-button-light hover:bg-custom-gradient-button-light dark:hover:bg-custom-gradient-button-dark flex items-center justify-center shadow-lg"
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
                                                            "Submit"
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
            }
        </>


    );
};

export default FormPassword;
