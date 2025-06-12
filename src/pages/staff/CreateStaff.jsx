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
import Select from 'react-select';
import a from "../../helper/common";
import rolesService from "../../services/rolesService";
import { useSelector } from "react-redux";


function CreateStaff() {
    const location = useLocation();
    const client = location?.state?.client
    const navigate = useNavigate();

    console.log("location", location);
    const pathName = location?.pathname;


    const { capability } = useSelector((state) => state.capabilitySlice);
    const [permission, setPermission] = useState(null);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        roleId: "",
        roleName: "",
        password: "",
        confirmPassword: ""
    });

    console.log("formData", formData);

    const [jobRole, setJobRole] = useState([])

    useEffect(() => {
        if (client) {
            setFormData((prev) => ({
                ...prev,
                firstName: client?.firstName,
                lastName: client?.lastName,
                email: client?.email,
                phone: client?.phone,
                roleId: client?.role?._id,
                roleName: client?.role?.name
            }));
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
        setFormData({ ...formData, [name]: value });
        let newErrors = { ...errors };

        if (name === "firstName") {
            if (!value.trim()) {
                newErrors.firstName = "First Name is required";
            } else {
                delete newErrors.firstName;
            }
        }

        if (name === "lastName") {
            if (!value.trim()) {
                newErrors.lastName = "Last Name is required";
            } else {
                delete newErrors.lastName;
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
        if (name === "password") {
            if (!value.trim()) {
                newErrors.password = "Password is required";
            } else if (!passwordRegex.test(value)) {
                newErrors.password = "Password must be at least 8 characters long and include a letter, number, and special character";
            } else {
                delete newErrors.password;
            }
            if (formData.confirmPassword && value !== formData.confirmPassword) {
                newErrors.confirmPassword = "Passwords do not match";
            } else if (formData.confirmPassword) {
                delete newErrors.confirmPassword;
            }
        }
        if (name == "confirmPassword") {
            if (value == "") {
                newErrors.confirmPassword = "Confirm Password is Required."
            } else if (formData?.password !== value) {
                newErrors.confirmPassword = "Password doesn't Match."
            } else {
                delete newErrors.confirmPassword;
            }
        }
        setErrors(newErrors);
    };

    const validateForm = () => {
        let newErrors = {};
        if (!formData.roleId.trim()) newErrors.roleId = "Role is required";
        if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
        if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
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

        // if (!formData.password.trim()) {
        //     newErrors.password = "Password is required";
        // } else if (!passwordRegex.test(formData.password)) {
        //     newErrors.password = "Password must be at least 8 characters long and include a letter, number, and special character";
        // }

        if (!client) {
            console.log("Aadsfdfdsfa");

            if (!formData.password.trim()) {
                newErrors.password = "Password is required";
            } else if (!passwordRegex.test(formData.password)) {
                newErrors.password = "Password must be at least 8 characters long and include a letter, number, and special character";
            }
        } else {
            console.log("Aaa", errors?.password);

            if (errors?.password) {
                console.log("Bbb", errors?.password);

                if (!formData.password.trim()) {
                    newErrors.password = "Password is required";
                } else if (!passwordRegex.test(formData.password)) {
                    newErrors.password = "Password must be at least 8 characters long and include a letter, number, and special character";
                }
            }
        }


        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
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
                firstName: formData?.firstName,
                lastName: formData?.lastName,
                email: formData?.email,
                phone: formData?.phone,
                roleId: formData?.roleId,
                password: formData?.password
            }
            let response;
            if (client) {
                response = await clientService.updateStaff({ ...dataObject, clientId: client?._id });
            } else {
                response = await clientService.createStaff(dataObject);
            }
            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                roleId: "",
                roleName: "",
                password: "",
                confirmPassword: ""
            });
            setErrors({});
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: response?.data?.message,
                showConfirmButton: false,
                timer: 1500,
                toast: true,
                customClass: {
                    popup: 'my-toast-size'
                }
            });
            navigate("/list/staff")
        } catch (error) {
            console.log("Error creating user:", error);
            const errorMessage = error || 'An error occurred while creating user';
            // toast.error(errorMessage);
            setResponseError([errorMessage]);
        } finally {
            setIsSubmitting(false);
        }
    };


    const handleSelectChange = (selectedOptions) => {
        console.log("selectedOptions", selectedOptions);
        setFormData({ ...formData, ["roleId"]: selectedOptions?.value, ["roleName"]: selectedOptions?.label });
        setErrors((prev) => ({ ...prev, roleId: "" }))
    };


    useEffect(() => {
        async function getJobRoles() {
            try {
                const response = await rolesService.getActiveRoles();
                console.log("response active role", response?.data?.data?.data);
                const data = response?.data?.data?.data?.length > 0 ? response?.data?.data?.data?.map(type => ({ value: type?._id, label: type?.name })) : []
                setJobRole(data)
            } catch (error) {
                console.log("error while getting the job role", error);
            }
        }
        getJobRoles()
    }, []);


    useEffect(() => {
        if (!capability || capability.length === 0) return;
        const administration = capability.find(item => item?.name === "Administration");
        if (!administration) return;
        const staffMenu = administration.menu?.find(menu => menu?.name === "Staff");
        if (!staffMenu) return;
        setPermission([staffMenu]); 
        const accessMap = {
            "/view/staffs": staffMenu.subMenus?.view?.access,
            "/update/staffs": staffMenu.subMenus?.update?.access,
            "/create/staffs": staffMenu.subMenus?.create?.access,
        };
        const hasAccess = accessMap[pathName];
        if (hasAccess === false) {
            alert("Unauthorized to access this!");
            navigate("/home");
        }
    }, [capability, pathName, navigate]);


    return (
        <div className="flex flex-col md:mx-4  mx-2     mt-3 min-h-screen bg-light dark:bg-dark">
            <Hamberger text={`${client ? "Staff / Update" : "Staff / Add New"}`} />
            <div className="w-[100%] mb-20  bg-cardBgLight dark:bg-cardBgDark shadow-lg rounded-lg p-6">
                <h2 className="md:text-2xl text-1xl font-semibold text-formHeadingLight dark:text-formHeadingDark md:mb-4 mb-2 text-start">{`${pathName == "/view/staffs" ? "View Staff" : client ? "Update Staff" : "Create Staff"}`}</h2>
                <div className="h-[1.8px] bg-black dark:bg-white mb-4"></div>
                <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-formLabelLight dark:text-formLabelDark mb-1 font-medium">Job Role</label>
                        <Select
                            options={jobRole}
                            className="basic-multi-select bg-transparent"
                            classNamePrefix="select"
                            placeholder="Select Role..."
                            onChange={handleSelectChange}
                            styles={a.customStyles}
                            value={{ value: formData?.roleId, label: formData?.roleName }}
                            isDisabled={pathName == "/view/staffs" ? true : false}
                        />
                        {errors.roleId && <p className="text-red-500 text-sm mt-1">{errors.roleId}</p>}
                    </div>
                    <div>
                        <label className="block text-formLabelLight dark:text-formLabelDark mb-1 font-medium">First Name</label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="w-[100%]  bg-transparent p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter first name"
                            disabled={pathName == "/view/staffs" ? true : false}
                        />
                        {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                    </div>
                    <div>
                        <label className="block text-formLabelLight dark:text-formLabelDark mb-1 font-medium">Last Name</label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="w-[100%] bg-transparent p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter last name"
                            disabled={pathName == "/view/staffs" ? true : false}

                        />
                        {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
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
                            disabled={pathName == "/view/staffs" ? true : false}

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
                            disabled={pathName == "/view/staffs" ? true : false}

                        />
                        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>
                    <div className="relative">
                        <label className="block text-formLabelLight dark:text-formLabelDark mb-1 font-medium">Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-[100%]  bg-transparent p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter password"
                            disabled={pathName == "/view/staffs" ? true : false}

                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2 top-10 text-gray-600"
                        >
                            {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                        </button>
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                    </div>
                    <div className="relative">
                        <label className="block text-formLabelLight dark:text-formLabelDark mb-1 font-medium">Confirm Password</label>
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-[100%]  bg-transparent p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Confirm password"
                            disabled={pathName == "/view/staffs" ? true : false}

                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-2 top-10 text-white"
                        >
                            {showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                        </button>
                        {errors.confirmPassword && (
                            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                        )}
                    </div>
                </form>

                {responseError.length > 0 && (
                    <div className="w-[100%] mt-4 flex flex-col gap-1 p-4 bg-red-100 rounded-md">
                        {responseError.map((error, index) => (
                            <p key={index} className="text-red-700 text-sm">{error}</p>
                        ))}
                    </div>
                )}


                {
                    pathName == "/view/staffs" ? ""
                        :
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
                                    `${client ? "Update Staff" : "Create Staff"}`
                                )}
                            </button>
                        </div>
                }



            </div>
        </div>
    );
}

export default CreateStaff