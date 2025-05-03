import React, { useEffect, useState } from "react";
import CryptoJS from "crypto-js";
import { useNavigate, useParams } from "react-router-dom";
import customFieldService from "../../services/customFieldService";
import { FaSpinner } from "react-icons/fa";
import LoadingSpinner from "../../components/Loading/LoadingSpinner";
import images from "../../constant/images";
import Swal from "sweetalert2";
import "../../App.css"
import Select from 'react-select';



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

function SubmitForm() {
    const navigate = useNavigate();
    const { formId: encryptedId } = useParams();
    const [password, setPassword] = useState("");
    const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);
    const [navigateToForm, setNavigateToForm] = useState(false);
    const [logoPreview, setLogoPreview] = useState("");
    const [bannerPreview, setBannerPreview] = useState("");
    const [decryptedId, setDecryptedId] = useState("");
    const [organizationData, setOrganizationData] = useState(null);
    const [sessionData, setSessionData] = useState(null);
    const [existingFields, setExistingFields] = useState([]);
    const [errors, setErrors] = useState({});
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [customizationValues, setCustomizationValues] = useState({});

    // console.log("customizationValues", customizationValues);


    // Handle input changes and validate
    const handleInputChange = (fieldName, value, field) => {
        setCustomizationValues((prev) => ({
            ...prev,
            [fieldName]: value,
        }));

        let newErrors = { ...errors };
        const validation = field.validation;
        // Required field validation
        if (field?.isRequired) {
            if (typeof value === "string" && !value.trim()) {
                newErrors[fieldName] = `${field?.label} is required`;
            } else if (value === null || value === undefined || value === false) {
                newErrors[fieldName] = `${field?.label} is required`;
            } else {
                delete newErrors[fieldName];
            }
        } else {
            // Remove error if field is not required and empty
            if (typeof value === "string" && !value.trim()) {
                delete newErrors[fieldName];
            }
        }
        // Regex validation
        if (validation?.regex && value) {
            try {
                // Convert string regex to RegExp object
                const regex = new RegExp(validation.regex);
                console.log("regex", regex);


                if (typeof value === "string" && !regex.test(value.trim())) {
                    newErrors[fieldName] = `Please enter a valid ${field?.label}`;
                } else {
                    delete newErrors[fieldName];
                }
            } catch (error) {
                console.error(`Invalid regex for ${fieldName}:`, validation.regex, error);
                newErrors[fieldName] = `Invalid validation rule for ${field?.label}`;
            }
        }
        // min length and max length
        if (validation?.minLength && value) {
            if (value?.length < validation?.minLength) {
                newErrors[fieldName] = `Minimun ${validation?.minLength} characters are required.`;
            } else if (value?.length > validation?.maxLength) {
                newErrors[fieldName] = `Maximum ${validation?.maxLength} characters are required.`;

            } else {
                delete newErrors[fieldName];
            }
        }
        // min value and max value
        if (validation?.min && value) {
            if (value < validation?.min) {
                newErrors[fieldName] = `Must be grater than or equal to ${validation?.min}`;
            } else if (value > validation?.max) {
                newErrors[fieldName] = `Must be less than or equal to ${validation?.max}`;
            } else {
                delete newErrors[fieldName];
            }
        }
        setErrors(newErrors);
    };

    useEffect(() => {
        if (encryptedId) {
            const decryptedId = decryptId(encryptedId);
            if (decryptedId) {
                setDecryptedId(decryptedId);
                fetchFields(decryptedId);
            } else {
                setIsPageLoading(false);
                setErrors({ general: "Invalid or corrupted form ID" });
            }
        }
    }, [encryptedId]);

    const fetchFields = async (decryptedId) => {
        try {
            setIsPageLoading(true);
            const response = await customFieldService.getCustomFormsBySession(decryptedId);
            const fields = response?.data?.data?.data || [];
            setExistingFields(fields);
            setOrganizationData(fields[0]?.sessionId?.organizationId);
            setSessionData(fields[0]?.sessionId);
            setBannerPreview(
                `${import.meta.env.VITE_API_URL_IMG}${fields[0]?.sessionId?.organizationId?.banner || ""}`
            );
            setLogoPreview(
                `${import.meta.env.VITE_API_URL_IMG}${fields[0]?.sessionId?.organizationId?.logo || ""}`
            );

            if (fields[0]?.sessionId?.isPasswordRequired) {
                setNavigateToForm(false)
            } else {
                setNavigateToForm(true)
            }
            setIsPageLoading(false);

        } catch (error) {
            console.error("Error fetching fields:", error);
            setIsPageLoading(false);
            setErrors({ general: "Failed to fetch form fields" });
        }
    };

    const renderFieldPreview = (field) => {
        const options = field?.options ? field?.options?.map((item) => ({ value: item, label: item })) : [];

        const baseStyles =
            "w-[100%] bg-transparent p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500";
        const fieldName = field.name;

        switch (field.type) {
            case "text":
            case "number":
            case "email":
            case "hyperlink":
                return (
                    <>
                        <input
                            type={field.type}
                            placeholder={field?.placeholder}
                            className={baseStyles}
                            value={customizationValues[fieldName] || ""}
                            onChange={(e) => handleInputChange(fieldName, e.target.value, field)}
                        />
                        {errors[fieldName] && <p className="text-red-500 text-sm mt-1">{errors[fieldName]}</p>}
                    </>
                );
            case "textarea":
                return (
                    <>
                        <textarea
                            placeholder={field?.placeholder}
                            className={`${baseStyles} min-h-[100px]`}
                            value={customizationValues[fieldName] || ""}
                            onChange={(e) => handleInputChange(fieldName, e.target.value, field)}
                        />
                        {errors[fieldName] && <p className="text-red-500 text-sm mt-1">{errors[fieldName]}</p>}
                    </>
                );
            case "select":
                return (
                    <>
                        <Select
                            name="select"
                            options={options}
                            // className="basic-multi-select"
                            classNamePrefix="select"
                            onChange={(e) => {
                                console.log("123", e);
                                handleInputChange(fieldName, e, field)
                            }}
                        />
                        {errors[fieldName] && <p className="text-red-500 text-sm mt-1">{errors[fieldName]}</p>}
                    </>
                );
            case "multiselect":
                return (
                    <>
                        {/* <select
                            className={baseStyles}
                            value={customizationValues[fieldName] || ""}
                            onChange={(e) => handleInputChange(fieldName, e.target.value, field)}
                        >
                            <option value="">{field?.placeholder || "Select an option"}</option>
                            {field?.options?.map((opt, idx) => (
                                <option key={idx} value={opt}>
                                    {opt}
                                </option>
                            ))}
                        </select> */}

                        <Select
                            isMulti
                            name="colors"
                            options={options}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            onChange={(e) => {
                                console.log("123", e);
                                handleInputChange(fieldName, e, field)
                            }}
                        />
                        {errors[fieldName] && <p className="text-red-500 text-sm mt-1">{errors[fieldName]}</p>}
                    </>
                );
            case "checkbox":
                return (
                    <>
                        <input
                            type="checkbox"
                            checked={customizationValues[fieldName] || false}
                            onChange={(e) => handleInputChange(fieldName, e.target.checked, field)}
                            className="h-5 w-5 text-blue-600"
                        />
                        {errors[fieldName] && <p className="text-red-500 text-sm mt-1">{errors[fieldName]}</p>}
                    </>
                );
            case "file":
                return (
                    <>
                        <input
                            type="file"
                            accept={field?.validation?.fileTypes?.join(",")}
                            onChange={(e) => handleInputChange(fieldName, e.target.files[0], field)}
                            className={baseStyles}
                        />
                        {errors[fieldName] && <p className="text-red-500 text-sm mt-1">{errors[fieldName]}</p>}
                    </>
                );
            case "date":
                return (
                    <>
                        <input
                            type="date"
                            placeholder={field?.placeholder || "Select a date"}
                            className={baseStyles}
                            value={customizationValues[fieldName] || ""}
                            onChange={(e) => handleInputChange(fieldName, e.target.value, field)}
                        />
                        {errors[fieldName] && <p className="text-red-500 text-sm mt-1">{errors[fieldName]}</p>}
                    </>
                );
            case "timepicker":
                return (
                    <>
                        <input
                            type="time"
                            placeholder={field?.placeholder || "Select a time"}
                            className={baseStyles}
                            value={customizationValues[fieldName] || ""}
                            onChange={(e) => handleInputChange(fieldName, e.target.value, field)}
                        />
                        {errors[fieldName] && <p className="text-red-500 text-sm mt-1">{errors[fieldName]}</p>}
                    </>
                );
            case "color":
                return (
                    <>
                        <input
                            type="color"
                            className={`${baseStyles} h-10`}
                            value={customizationValues[fieldName] || "#000000"}
                            onChange={(e) => handleInputChange(fieldName, e.target.value, field)}
                        />
                        {errors[fieldName] && <p className="text-red-500 text-sm mt-1">{errors[fieldName]}</p>}
                    </>
                );
            default:
                return (
                    <div className={baseStyles}>
                        {field?.type} (Preview not available)
                        {errors[fieldName] && <p className="text-red-500 text-sm mt-1">{errors[fieldName]}</p>}
                    </div>
                );
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            // Validate required fields
            const newErrors = {};
            existingFields.forEach((field) => {
                const fieldName = field.name;
                const value = customizationValues[fieldName];
                if (field.isRequired) {
                    if (
                        value === undefined ||
                        value === null ||
                        (typeof value === "string" && !value.trim()) ||
                        (field.type === "file" && !value) ||
                        (field.type === "checkbox" && value === false)
                    ) {
                        newErrors[fieldName] = `${field.label} is required`;
                    }
                }
                // Validate regex
                if (field.validation?.regex && value) {
                    try {
                        const regex = new RegExp(field.validation.regex);
                        if (typeof value === "string" && !regex.test(value.trim())) {
                            newErrors[fieldName] = `Please enter a valid ${field.label}`;
                        }
                    } catch (error) {
                        newErrors[fieldName] = `Invalid validation rule for ${field.label}`;
                    }
                }
            });
            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
                setIsSubmitting(false);
                Swal.fire({
                    icon: "error",
                    title: "Validation Error",
                    text: "Please correct the errors in the form before submitting.",
                });
                return;
            }
            // Prepare form data
            const formData = new FormData();
            formData.append("sessionId", decryptedId);
            formData.append("userId", sessionData?.userId || organizationData?.userId);
            formData.append("organizationId", organizationData?._id);
            formData.append("phone", customizationValues?.phone);
            formData.append("firstName", customizationValues?.firstName);
            // Map fields to formData
            existingFields.forEach((field) => {
                const fieldName = field.name;
                const label = field.label
                const value = customizationValues[fieldName];
                if (value !== undefined && value !== null) {
                    if (field.type === "file" && value instanceof File) {
                        formData.append(label, value);
                    } else if (field.type === "multiselect" || field.type === "select") {
                        const stringData = JSON.stringify(value)
                        formData.append(label, stringData);
                    } else {
                        formData.append(label, value);
                    }
                }
            });
            // Submit to backend
            const response = await customFieldService.submitFormData(formData);
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Form Submitted Successfully",
                showConfirmButton: false,
                timer: 1500,
                toast: true,
                customClass: {
                    popup: 'my-toast-size'
                }
            });
            // Reset form
            setCustomizationValues({});
            setErrors({});
            setTimeout(() => {
                Swal.fire({
                    title: "Please Note",
                    html: `
                    <p>If you need to edit the form, you can use this credential.</p>
                    <p><strong>ID:</strong> ${response?.data?.data?.data?.serialNumber}</p>
                    <p><strong>Password:</strong> ${response?.data?.data?.data?.password}</p>
                  `,
                    icon: "info"
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.reload()
                    }
                });
            }, 700);
        } catch (error) {
            setIsSubmitting(false);
            console.error("Error submitting form:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text:
                    error === "A form with this phone, first name, and session already exists"
                        ? "This form has already been submitted with the same phone, first name, and session."
                        : error === "Invalid email format"
                            ? "Please enter a valid email address"
                            : error || "Failed to submit form",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    async function handleSubmitPassword(e) {
        e.preventDefault();
        setIsSubmittingPassword(true);
        if (!password) {
            Swal.fire({
                icon: "warning",
                title: "Validation Password",
                text: "Please enter password.",
            });

            setIsSubmittingPassword(false);
            return
        }
        try {
            const dataObject = {
                password: password,
                sessionId: sessionData?._id
            }
            const response = await customFieldService.submitPassword(dataObject);
            if (response?.data?.success) {
                setNavigateToForm(true);
            }
            setIsSubmittingPassword(false);
        } catch (error) {
            setIsSubmittingPassword(false);
            console.log("error in submitting password", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text:
                    error
                        ? error
                        : "Failed to submit password.",
            });
        }
    }


    const encryptId = (id) => {
        const encrypted = CryptoJS.AES.encrypt(id.toString(), SECRET_KEY).toString();
        // URL-safe encoding
        return encodeURIComponent(encrypted);
    };

    return (
        <div className={`flex ${navigateToForm ? "" : "flex-col justify-center items-center"}  justify-center h-full overflow-auto bg-custom-gradient-sidebar dark:bg-dark`}>
            {isPageLoading ? (
                <LoadingSpinner />
            ) : errors.general ? (
                <div className="text-red-500 text-center p-4">{errors.general}</div>
            ) : (
                <>
                    {
                        !navigateToForm ?
                            <>
                                <div className="w-full max-w-4xl mx-auto flex flex-col  ">
                                    <div className="flex flex-col items-center mt-4 mb-0 md:px-1 px-1">
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
                                        <div className="w-[100%]  max-w-2xl bg-white dark:bg-cardBgDark rounded-lg shadow-lg">
                                            <div className="relative  bg-white dark:bg-gray-800 rounded-lg   overflow-hidden ">
                                                <div
                                                    className="absolute inset-0 bg-cover bg-center"
                                                // style={{ backgroundImage: `url(${bannerPreview})` }}
                                                />
                                                <div className="absolute z-20 top-2 sm:top-4 right-2 sm:right-4">
                                                    {/* <img
                                                        src={logoPreview}
                                                        alt={`${organizationData?.name} logo`}
                                                        className="h-12 sm:h-16 w-12 sm:w-16 rounded-full object-cover border-2 border-white dark:border-gray-200 shadow-md"
                                                    /> */}
                                                </div>
                                                <div className="relative z-10 bg-opacity-50 hover:bg-opacity-40 flex flex-col justify-between py-4 sm:py-6 px-3 sm:px-4">
                                                    <div className="text-left text-textLight dark:text-dark w-full">
                                                        <h2 className="text-lg sm:text-2xl md:text-4xl font-bold mb-2 drop-shadow-md">
                                                            {organizationData?.name || "Organization Name"}
                                                        </h2>
                                                        {/* <h4 className="text-xs sm:text-sm md:text-base font-medium mb-1 drop-shadow-sm">
                                                            {organizationData?.captionText || "Caption Text"}
                                                        </h4> */}
                                                        <h2 className="text-base sm:text-xl md:text-3xl font-bold mb-2 drop-shadow-md">
                                                            {`${sessionData?.for || "Session"} (${sessionData?.name || "Name"})`}
                                                        </h2>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-[100%] my-3 max-w-2xl border-subscriptionCardBgLightFrom border-2 dark:border-white bg-cardBgLight dark:bg-cardBgDark shadow-lg rounded-lg p-6">
                                            <h2 className="md:text-2xl text-1xl font-semibold text-formHeadingLight dark:text-formHeadingDark md:mb-2 mb-2 text-start">Continue With The Password</h2>
                                            <div className="h-[1.8px] bg-black dark:bg-white mb-4"></div>
                                            <div
                                                // onSubmit={handleSubmit}
                                                className="grid grid-cols-1 md:grid-cols-1 gap-4">
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
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
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
                                            </div>

                                            <div className="flex justify-end mt-6">
                                                <button
                                                    // type="submit"
                                                    onClick={handleSubmitPassword}
                                                    disabled={isSubmittingPassword}
                                                    className="w-auto p-2 text-sm text-white rounded-lg transition-all duration-300 ease-in-out 
                                            bg-custom-gradient-button-dark dark:bg-custom-gradient-button-light 
                                             hover:bg-custom-gradient-button-light dark:hover:bg-custom-gradient-button-dark 
                                             flex items-center justify-center shadow-lg"
                                                // className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-700 dark:from-blue-600 dark:to-blue-800 rounded-lg shadow-md hover:from-blue-600 hover:to-blue-800 dark:hover:from-blue-700 dark:hover:to-blue-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {isSubmittingPassword ? (
                                                        <>
                                                            <FaSpinner className="animate-spin" />
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

                                <div className=" w-[100%] max-w-2xl p-2  mt-0   flex justify-center items-center gap-2 bg-cardBgLight shadow-lg rounded-md  sm:p-2">
                                    <span>
                                        <img src={images?.treeLogo} className="w-8 h-8" alt="" />
                                    </span>
                                    <h4 className="text-xs text-textLight sm:text-sm md:text-base font-medium drop-shadow-lg">
                                        Powered By Aestree Webnet Pvt. Ltd.
                                    </h4>
                                </div>
                            </>





                            :
                            <div className="w-full max-w-4xl mx-auto flex flex-col p-2 sm:p-4 mt-2 sm:mt-3">
                                <div className="w-[100%] bg-cardBgLight dark:bg-cardBgDark rounded-t-md shadow-lg">
                                    <div className="relative border-2 hover:border-subscriptionCardBgLightFrom bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden transition-transform duration-300 hover:shadow-xl">
                                        <div
                                            className="absolute inset-0 bg-cover bg-center"
                                            style={{ backgroundImage: `url(${bannerPreview})` }}
                                        />
                                        <div className="absolute z-20 top-2 sm:top-4 right-2 sm:right-4">
                                            <img
                                                src={logoPreview}
                                                alt={`${organizationData?.name} logo`}
                                                className="h-12 sm:h-16 w-12 sm:w-16 rounded-full object-cover border-2 border-white dark:border-gray-200 shadow-md"
                                            />
                                        </div>
                                        <div className="relative z-10 bg-black bg-opacity-50 hover:bg-opacity-40 flex flex-col justify-between py-4 sm:py-6 px-3 sm:px-4">
                                            <div className="text-left text-white w-full">
                                                <h2 className="text-lg sm:text-2xl md:text-4xl font-bold mb-2 drop-shadow-md">
                                                    {organizationData?.name || "Organization Name"}
                                                </h2>
                                                <h4 className="text-xs sm:text-sm md:text-base font-medium mb-1 drop-shadow-sm">
                                                    {organizationData?.captionText || "Caption Text"}
                                                </h4>
                                                <h2 className="text-base sm:text-xl md:text-3xl font-bold mb-2 drop-shadow-md">
                                                    {`${sessionData?.for || "Session"} (${sessionData?.name || "Name"})`}
                                                </h2>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-[100%] bg-cardBgLight dark:bg-cardBgDark shadow-lg rounded-b-md p-4 sm:p-6">
                                    {existingFields?.length > 0 ? (

                                        <>
                                            <div
                                                // onSubmit={handleFormSubmit}
                                                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
                                            >

                                                <div className="flex justify-center items-center gap-2 mt-4 col-span-1 sm:col-span-2 md:col-span-3 my-2">
                                                    <span className="">Already submitted and want to modify the details:</span>
                                                    <button
                                                        onClick={() => navigate(`/passwordForm/auth/${encryptId(decryptedId)}`)}
                                                        className="flex items-center gap-1 px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-700 dark:from-red-600 dark:to-red-800 rounded-lg shadow-md hover:from-red-600 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                                                    >
                                                        Click Here
                                                    </button>
                                                </div>

                                                {[...existingFields]
                                                    .sort((a, b) => a.gridConfig?.order - b.gridConfig?.order)
                                                    .map((field, index) => (
                                                        <div
                                                            key={index}
                                                            style={{ order: field?.gridConfig?.order }}
                                                            className={`min-w-0 ${field?.type === "checkbox" ? "flex items-center gap-2" : ""}`}
                                                        >
                                                            <label className="block text-xs sm:text-sm font-medium text-formLabelLight dark:text-formLabelDark mb-1">
                                                                {field?.label}
                                                                {field?.isRequired && <span className="text-red-500">*</span>}
                                                            </label>
                                                            {renderFieldPreview(field)}
                                                        </div>
                                                    ))}

                                            </div>
                                            <div className="flex justify-end mt-4 col-span-1 sm:col-span-2 md:col-span-3">
                                                <button
                                                    // type="submit"
                                                    onClick={handleFormSubmit}
                                                    disabled={isSubmitting}
                                                    className="w-auto p-2 text-sm text-white rounded-lg transition-all duration-300 ease-in-out bg-custom-gradient-button-dark dark:bg-custom-gradient-button-light hover:bg-custom-gradient-button-light dark:hover:bg-custom-gradient-button-dark flex items-center justify-center shadow-lg"
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
                                        </>



                                    ) : (
                                        <div className="flex justify-center items-center">
                                            <h2 className="text-lg sm:text-2xl md:text-4xl font-bold mb-2 drop-shadow-md">
                                                No Fields Have Been Added
                                            </h2>
                                        </div>
                                    )}
                                </div>
                                <div className="w-[100%] mt-2 flex justify-center items-center gap-2 bg-cardBgLight shadow-lg rounded-md p-2 sm:p-2">
                                    <span>
                                        <img src={images?.treeLogo} className="w-8 h-8" alt="" />
                                    </span>
                                    <h4 className="text-xs text-textLight sm:text-sm md:text-base font-medium drop-shadow-lg">
                                        Powered By Aestree Webnet Pvt. Ltd.
                                    </h4>
                                </div>
                            </div>

                    }

                </>

            )}
        </div>
    );
}

export default SubmitForm;