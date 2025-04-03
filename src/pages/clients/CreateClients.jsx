import React, { useState } from "react";
import companyService from "../../services/companyService";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import common from "../../helper/common";
import clientService from "../../services/clientService";
import Hamberger from "../../components/Hamberger/Hamberger";

function CreateClients() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: ""
    });

    const [errors, setErrors] = useState({});
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
        if (!formData.password.trim()) {
            newErrors.password = "Password is required";
        } else if (!passwordRegex.test(formData.password)) {
            newErrors.password = "Password must be at least 8 characters long and include a letter, number, and special character";
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
            const response = await clientService.createClient(formData);
            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                password: "",
                confirmPassword: ""
            });
            setErrors({});
        } catch (error) {
            console.error("Error creating client:", error);
            alert(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col md:mx-4  mx-2     mt-3 min-h-screen bg-light dark:bg-dark">

            <Hamberger text={"Client / Add New"} />


            <div className="w-[100%]  bg-cardBgLight dark:bg-cardBgDark shadow-lg rounded-lg p-6">
                <h2 className="text-2xl font-semibold text-formHeadingLight dark:text-formHeadingDark mb-4 text-start">Create Client</h2>

                <div className="h-[1.8px] bg-black dark:bg-white mb-4"></div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* First Name */}
                    <div>
                        <label className="block text-formLabelLight dark:text-formLabelDark mb-1 font-medium">First Name</label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="w-[100%]  bg-transparent p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter first name"
                        />
                        {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                    </div>

                    {/* Last Name */}
                    <div>
                        <label className="block text-formLabelLight dark:text-formLabelDark mb-1 font-medium">Last Name</label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="w-[100%] bg-transparent p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter last name"
                        />
                        {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-formLabelLight dark:text-formLabelDark mb-1 font-medium">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email} bg-transparent
                            onChange={handleChange}
                            className="w-[100%]   bg-transparent p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter email"
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    {/* Phone */}
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
                        />
                        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>

                    {/* Password */}
                    <div className="relative">
                        <label className="block text-formLabelLight dark:text-formLabelDark mb-1 font-medium">Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-[100%]  bg-transparent p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter password"
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

                    {/* Confirm Password */}
                    <div className="relative">
                        <label className="block text-formLabelLight dark:text-formLabelDark mb-1 font-medium">Confirm Password</label>
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-[100%]  bg-transparent p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Confirm password"
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

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-[8rem] my-3 text-white py-2 rounded-lg transition-all duration-300 ease-in-out 
             bg-custom-gradient-button-light dark:bg-custom-gradient-button-dark 
             hover:bg-custom-gradient-button-dark dark:hover:bg-custom-gradient-button-light"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Submitting..." : "Create Client"}
                    </button>

                </form>
            </div>
        </div>
    );
}

export default CreateClients;