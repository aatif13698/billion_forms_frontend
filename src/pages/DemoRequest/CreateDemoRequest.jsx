import React, { useEffect, useState } from "react";
import companyService from "../../services/companyService";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import common from "../../helper/common";
import clientService from "../../services/clientService";
import Hamberger from "../../components/Hamberger/Hamberger";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import "../../App.css"
import { useSelector } from "react-redux";
import demoRequestService from "../../services/demoRequestService";


function CreateDemoRequest() {
    const location = useLocation();
    const pathName = location?.pathname;

    const client = location?.state?.client

    const navigate = useNavigate();

    const { capability } = useSelector((state) => state.capabilitySlice);
    const [permission, setPermission] = useState(null);



    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: "",
    });

    useEffect(() => {
        if (client) {
            setFormData((prev) => ({
                ...prev,
                name: client?.name,
                message: client?.message,
                email: client?.email,
                phone: client?.phone
            }))
        }
    }, [client])



    const [responseError, setResponseError] = useState([])

    const [errors, setErrors] = useState({});
    console.log("errors", errors);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const emailRegex = /\S+@\S+\.\S+/;
    const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;



    const handleChange = (e) => {
        const { name, value } = e.target;
        let newErrors = { ...errors };
        if (name === "name") {
            if (!value.trim()) {
                newErrors.name = "Name is required";
            } else {
                delete newErrors.name;
            }
        }
        if (name === "message") {
            if (!value.trim()) {
                newErrors.message = "Message is required";
            } else {
                delete newErrors.message;
            }
        }
        if (name === "email") {
            if (!value.trim()) {
                newErrors.email = "Email is required";
            } else if (!emailRegex.test(value)) {
                newErrors.email = "Please enter a valid email address";
            } else {
                delete newErrors.email;
            }
        }
        if (name === "phone") {
            if (!value.trim()) {
                newErrors.phone = "Phone number is required";
            } else if (!phoneRegex.test(value)) {
                newErrors.phone = "Please enter a valid phone number (e.g., 123-456-7890)";
            } else {
                delete newErrors.phone;
            }
        }
        setFormData({ ...formData, [name]: value });
        setErrors(newErrors);
    };

    const validateForm = () => {
        let newErrors = {};
        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (!formData.message.trim()) newErrors.message = "Message is required";
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }
        if (!formData.phone.trim()) {
            newErrors.phone = "Phone number is required";
        } else if (!phoneRegex.test(formData.phone)) {
            newErrors.phone = "Please enter a valid phone number (e.g., 123-456-7890)";
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
                name: formData?.name,
                message: formData?.message,
                email: formData?.email,
                phone_number: formData?.phone,
            }
            let response;
            if (client) {

            } else {
                response = await demoRequestService.createRequest(dataObject);
            }
            setFormData({
                name: "",
                message: "",
                email: "",
                phone: "",
            });
            setErrors({});
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Updated Successfully",
                showConfirmButton: false,
                timer: 1500,
                toast: true,
                customClass: {
                    popup: 'my-toast-size'
                }
            });
            navigate("/list/request")
        } catch (error) {
            console.log("Error creating user:", error);
            const errorMessage = error || 'An error occurred while creating user';
            // toast.error(errorMessage);
            setResponseError([errorMessage]);
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        if (!capability || capability.length === 0) return;
        const administration = capability.find(item => item?.name === "Administration");
        if (!administration) return;
        const staffMenu = administration.menu?.find(menu => menu?.name === "Request");
        if (!staffMenu) return;
        setPermission([staffMenu]);
        const accessMap = {
            "/view/request": staffMenu.subMenus?.view?.access,
            "/update/request": staffMenu.subMenus?.update?.access,
            "/create/request": staffMenu.subMenus?.create?.access,
        };
        const hasAccess = accessMap[pathName];
        if (hasAccess === false) {
            alert("Unauthorized to access this!");
            navigate("/home");
        }
    }, [capability, pathName, navigate]);

    return (
        <div className="flex flex-col md:mx-4  mx-2     mt-3 min-h-screen bg-light dark:bg-dark">
            <Hamberger text={`${pathName == "/view/request" ? "Request / View" : client ? "Request / Update" : "Request / Add New"}`} />
            <div className="w-[100%] mb-20  bg-cardBgLight dark:bg-cardBgDark shadow-lg rounded-lg p-6">
                <h2 className="md:text-2xl text-1xl font-semibold text-formHeadingLight dark:text-formHeadingDark md:mb-4 mb-2 text-start">{`${pathName == "/view/request" ? "View Request" : client ? "Update request" : "Create Request"}`}</h2>
                <div className="h-[1.8px] bg-black dark:bg-white mb-4"></div>
                <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-formLabelLight dark:text-formLabelDark mb-1 font-medium">First Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-[100%]  bg-transparent p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter first name"
                            disabled={pathName == "/view/request" ? true : false}

                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>
                    <div>
                        <label className="block text-formLabelLight dark:text-formLabelDark mb-1 font-medium">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-[100%]   bg-transparent p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter email"
                            disabled={pathName == "/view/request" ? true : false}

                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>
                    <div>
                        <label className="block text-formLabelLight dark:text-formLabelDark mb-1 font-medium">Phone</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            onInput={common.handleKeyPress}
                            className="w-[100%]  bg-transparent p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter phone number (e.g., 123-456-7890)"
                            disabled={pathName == "/view/request" ? true : false}

                        />
                        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>

                    <div>
                        <label className="block text-formLabelLight dark:text-formLabelDark mb-1 font-medium">Message</label>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            className="w-[100%]  bg-transparent p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter message..."
                            disabled={pathName == "/view/request" ? true : false}
                        />
                        {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                    </div>

                </form>

                {responseError.length > 0 && (
                    <div className="w-[100%] mt-4 flex flex-col gap-1 p-4 bg-red-100 rounded-md">
                        {responseError.map((error, index) => (
                            <p key={index} className="text-red-700 text-sm">{error}</p>
                        ))}
                    </div>
                )}

                {pathName == "/view/request" ? "" :
                    <div className="flex justify-end mt-4">
                        <button
                            onClick={handleSubmit}
                            type="submit"
                            className="w-auto p-2 text-sm text-white rounded-lg transition-all duration-300 ease-in-out 
                bg-custom-gradient-button-dark dark:bg-custom-gradient-button-light 
                 hover:bg-custom-gradient-button-light dark:hover:bg-custom-gradient-button-dark 
                 flex items-center justify-center shadow-lg"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <svg
                                        className="animate-spin mr-2 h-5 w-5 text-white"
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
                                `${client ? "Update Request" : "Create Request"}`
                            )}
                        </button>
                    </div>
                }
            </div>
        </div>
    );
}

export default CreateDemoRequest;