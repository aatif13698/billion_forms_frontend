import React, { useEffect, useState } from "react";
import companyService from "../../services/companyService";
import Hamberger from "../../components/Hamberger/Hamberger";
import clientService from "../../services/clientService";
import Select from 'react-select';
import a from "../../helper/common"
import { useLocation, useNavigate } from "react-router-dom";

function CreateCompany() {
    const location = useLocation();
    const company = location?.state?.company
    const navigate = useNavigate();

    // states
    const [formData, setFormData] = useState({
        name: "",
        subDomain: "",
        adminEmail: "",
        adminPassword: "",
    });

    console.log("formData", formData);

    const [errors, setErrors] = useState({});
    const [responseError, setResponseError] = useState([])
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [clientsNotSetuped, setClientsNotSetuped] = useState([])

    useEffect(() => {
        if (company) {
            setFormData((prev) => ({
                ...prev,
                name: company?.name,
                subDomain: company?.subDomain,
                adminEmail: company?.adminEmail
            }))
        }
    }, [company])



    // regex
    const emailRegex = /\S+@\S+\.\S+/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        let newErrors = { ...errors };
        if (name === "adminEmail") {
            if (!value.trim()) {
                newErrors.adminEmail = "Email is required";
            } else if (!emailRegex.test(value)) {
                newErrors.adminEmail = "Please enter a valid email address";
            } else {
                delete newErrors.adminEmail;
            }
        }

        if (name == "name") {
            if (!value.trim()) {
                newErrors.name = "Company Name is required";
            } else if (value.trim().length < 3) {
                newErrors.name = "Minimum 3 characters required!";
            } else {
                delete newErrors.name;
            }
        }

        if (name === "adminPassword") {
            if (!value.trim()) {
                newErrors.adminPassword = "Password is required";
            } else if (!passwordRegex.test(value)) {
                newErrors.adminPassword = "Password must be at least 8 characters long and include a letter, number, and special character";
            } else {
                delete newErrors.adminPassword;
            }
        }

        if (name == "subDomain") {
            if (value == "") {
                newErrors.subDomain = "Sub Domain Password is Required."
            } else {
                delete newErrors.subDomain;
            }
        }
        setErrors(newErrors);
    };

    const validateForm = () => {
        let newErrors = {};
        if (!formData.name.trim()) newErrors.name = "Company name is required";
        if (!formData.subDomain.trim()) newErrors.subDomain = "Subdomain is required";
        if (!formData.adminEmail.trim() || !/\S+@\S+\.\S+/.test(formData.adminEmail))
            newErrors.adminEmail = "Valid email is required";
        if (!company) {
            if (!formData.adminPassword.trim() || !passwordRegex.test(formData.adminPassword))
                newErrors.adminPassword = "Password must be at least 8 characters long and include a letter, number, and special character";
        } else {
            if (errors?.adminPassword) {
                if (!formData.adminPassword.trim() || !passwordRegex.test(formData.adminPassword))
                    newErrors.adminPassword = "Password must be at least 8 characters long and include a letter, number, and special character";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setIsSubmitting(true);
        try {
            if (company) {
                const response = await companyService.updateCompany({ ...formData, companyId: company?._id });

            } else {
                const response = await companyService.createCompany(formData);

            }
            setFormData({ name: "", subDomain: "", adminEmail: "", adminPassword: "" });

            navigate("/list/company")

        } catch (error) {
            console.error("Error creating company:", error);
            const errorMessage = error || 'An error occurred while creating company';
            setResponseError([errorMessage]);

        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        getClientNotSetuped()
    }, [])

    async function getClientNotSetuped() {
        try {
            const response = await clientService.getClientsNotSetuped();
            const data = response?.data?.data?.user?.map(type => ({ value: type?.email, label: type?.email }));
            setClientsNotSetuped(data);
        } catch (error) {
            console.log("error while getting the not setuped client");
        }
    }

    const handleSelectChange = (selectedOptions) => {

        console.log("selectedOptions", selectedOptions);

        setFormData({ ...formData, ["adminEmail"]: selectedOptions?.label });

        setErrors((prev) => ({ ...prev, adminEmail: "" }))

    };

    return (
        <div className="flex flex-col md:mx-4  mx-2     mt-3 min-h-screen bg-light dark:bg-dark">
            <Hamberger text={`Company / ${company ? "Update" : "Add New"} `} />
            <div className="w-[100%]   bg-cardBgLight dark:bg-cardBgDark shadow-lg rounded-lg p-6">
                <h2 className="text-2xl font-semibold text-formHeadingLight dark:text-formHeadingDark mb-4 text-start">{`${company ? "Update" : "Create"} Company`}</h2>

                <div className="h-[2px] bg-black dark:bg-white mb-4"></div>


                <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                        <label className="block text-formLabelLight dark:text-formLabelDark mb-1 font-medium">Company Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-[100%] bg-transparent p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter company name"
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>

                    {/* Subdomain */}
                    <div>
                        <label className="block text-formLabelLight dark:text-formLabelDark mb-1 font-medium">Subdomain</label>
                        <input
                            type="text"
                            name="subDomain"
                            value={formData.subDomain}
                            onChange={handleChange}
                            className="w-[100%] bg-transparent p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter subdomain (e.g., mycompany)"
                        />
                        {errors.subDomain && <p className="text-red-500 text-sm mt-1">{errors.subDomain}</p>}
                    </div>
                    <div>
                        <label className="block text-formLabelLight dark:text-formLabelDark mb-1 font-medium">Admin Email</label>
                        <Select
                            options={clientsNotSetuped}
                            className="basic-multi-select bg-transparent"
                            classNamePrefix="select"
                            placeholder="Select Client..."
                            onChange={handleSelectChange}
                            styles={a.customStyles}
                            value={{ value: formData?.adminEmail, label: formData?.adminEmail }}
                            isDisabled={company ? true : false}
                        />
                        {errors.adminEmail && <p className="text-red-500 text-sm mt-1">{errors.adminEmail}</p>}
                    </div>
                    <div>
                        <label className="block text-formLabelLight dark:text-formLabelDark mb-1 font-medium">Admin Password</label>
                        <input
                            type="password"
                            name="adminPassword"
                            value={formData.adminPassword}
                            onChange={handleChange}
                            className="w-[100%] bg-transparent p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter password"
                        />
                        {errors.adminPassword && (
                            <p className="text-red-500 text-sm mt-1">{errors.adminPassword}</p>
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

                <div className="flex justify-end mt-3">


                    <button
                        onClick={handleSubmit}
                        className="w-auto text-sm p-2  text-white py-2 rounded-lg transition-all duration-300 ease-in-out 
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
                            `${company ? "Update" : "Create"} Company`
                        )}
                    </button>

                </div>


            </div>

        </div>
    );
}

export default CreateCompany;
