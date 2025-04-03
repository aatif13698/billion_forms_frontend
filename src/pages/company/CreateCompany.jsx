import React, { useState } from "react";
import companyService from "../../services/companyService";
import Hamberger from "../../components/Hamberger/Hamberger";

function CreateCompany() {
    const [formData, setFormData] = useState({
        name: "",
        subDomain: "",
        adminEmail: "",
        adminPassword: "",
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        let newErrors = {};
        if (!formData.name.trim()) newErrors.name = "Company name is required";
        if (!formData.subDomain.trim()) newErrors.subDomain = "Subdomain is required";
        if (!formData.adminEmail.trim() || !/\S+@\S+\.\S+/.test(formData.adminEmail))
            newErrors.adminEmail = "Valid email is required";
        if (!formData.adminPassword.trim() || formData.adminPassword.length < 6)
            newErrors.adminPassword = "Password must be at least 6 characters long";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            const response = await companyService.createCompany(formData);

            console.log("response company", response);


            setFormData({ name: "", subDomain: "", adminEmail: "", adminPassword: "" });
        } catch (error) {
            console.error("Error creating company:", error);
            alert(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col md:mx-4  mx-2     mt-3 min-h-screen bg-light dark:bg-dark">
            <Hamberger text={"Company / Add New"} />
            <div className="w-[100%]   bg-cardBgLight dark:bg-cardBgDark shadow-lg rounded-lg p-6">
                <h2 className="text-2xl font-semibold text-formHeadingLight dark:text-formHeadingDark mb-4 text-start">Create Company</h2>

                <div className="h-[2px] bg-black dark:bg-white mb-4"></div>


                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                    {/* Admin Email */}
                    <div>
                        <label className="block text-formLabelLight dark:text-formLabelDark mb-1 font-medium">Admin Email</label>
                        <input
                            type="email"
                            name="adminEmail"
                            value={formData.adminEmail}
                            onChange={handleChange}
                            className="w-[100%] bg-transparent p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter admin email"
                        />
                        {errors.adminEmail && <p className="text-red-500 text-sm mt-1">{errors.adminEmail}</p>}
                    </div>

                    {/* Admin Password */}
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

                    <button
                        type="submit"
                        className="w-[10rem] my-3 b text-white py-2 rounded-lg hover:bg-custom-gradient-button-dark dark:hover:bg-custom-gradient-button-light transition bg-custom-gradient-button-light dark:bg-custom-gradient-button-dark"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Submitting..." : "Create Company"}
                    </button>

                    {/* Submit Button */}

                </form>

            </div>

        </div>
    );
}

export default CreateCompany;
