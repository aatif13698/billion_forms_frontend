import React, { useEffect, useState } from "react";
import common from "../../helper/common";
import clientService from "../../services/clientService";
import Hamberger from "../../components/Hamberger/Hamberger";
import { useLocation, useNavigate } from "react-router-dom";
import organizationService from "../../services/organizationService";

function CreateOrganization() {
    const location = useLocation();
    const client = location?.state?.organization;

    console.log("adfaf", client);
    

    

    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        name: "",
        captionText: "",
        address: "",
        email: "",
        phone: "",
    });

    const [logoPreview, setLogoPreview] = useState("");
    const [bannerPreview, setBannerPreview] = useState("");

    const [logoFile, setLogoFile] = useState(null);
    const [bannerFile, setBannerFile] = useState(null);
    const [responseError, setResponseError] = useState([])
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const emailRegex = /\S+@\S+\.\S+/;
    const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxFileSize = 2 * 1024 * 1024; // 2MB


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
        if (name == "name") {
            if (value == "") {
                newErrors.name = "Name is Required."
            } else {
                delete newErrors.name;
            }
        }
        if (name == "captionText") {
            if (value == "") {
                newErrors.captionText = "Caption Text is Required."
            } else {
                delete newErrors.captionText;
            }
        }
        if (name == "address") {
            if (value == "") {
                newErrors.address = "Address is Required."
            } else {
                delete newErrors.address;
            }
        }
        setErrors(newErrors);
    };

    const validateForm = () => {
        let newErrors = {};
        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (!formData.captionText.trim()) newErrors.captionText = "Caption Text is required";
        if (!formData.address.trim()) newErrors.address = "Address is required";
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

            const dataObject = new FormData();
            dataObject.append("name", formData.name);
            dataObject.append("captionText", formData.captionText);
            dataObject.append("address", formData.address);
            dataObject.append("email", formData.email);
            dataObject.append("phone", formData.phone);
            if (logoFile) dataObject.append("logo", logoFile);
            if (bannerFile) dataObject.append("banner", bannerFile);

            let response;
            if (client) {
                dataObject.append("clientId", client._id);
                response = await organizationService.createOrganization(dataObject);
            } else {
                response = await organizationService.createOrganization(dataObject);
            }

            setFormData({
                name: "",
                captionText: "",
                address: "",
                email: "",
                phone: "",
            });
            setErrors({});

            navigate("/list/organization")

        } catch (error) {
            console.log("Error creating organization:", error);
            const errorMessage = error || 'An error occurred while creating organization';
            // toast.error(errorMessage);
            setResponseError([errorMessage]);
        } finally {
            setIsSubmitting(false);
        }
    };


    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        let newErrors = { ...errors };

        if (file) {
            // Validate file size
            if (file.size > maxFileSize) {
                newErrors[type] = "File size exceeds 2MB limit";
                if (type === "logo") setLogoFile(null);
                else setBannerFile(null);
            }
            // Validate file type
            else if (!allowedFileTypes.includes(file.type)) {
                newErrors[type] = "Only JPG, JPEG, PNG, GIF, or WEBP files are allowed";
                if (type === "logo") setLogoFile(null);
                else setBannerFile(null);
            }
            else {
                if (type === "logo"){
                    setLogoFile(file);
                    const url = URL.createObjectURL(file);
                    setLogoPreview(url)

                } else{
                    setBannerFile(file);
                    const url = URL.createObjectURL(file);
                    setBannerPreview(url)
                }
                delete newErrors[type];
            }
        } else {
            if (type === "logo") setLogoFile(null);
            else setBannerFile(null);
            delete newErrors[type];
        }

        setErrors(newErrors);
    };

    useEffect(()=>{
        if(client){
            setFormData({
                name : client?.name,
                email : client?.email,
                phone : client?.phone,
                address : client?.address,
                captionText : client?.captionText
            });
            setBannerPreview(`${import.meta.env.VITE_API_URL_IMG}${client?.banner}`)
            setLogoPreview(`${import.meta.env.VITE_API_URL_IMG}${client?.logo}`)
        }
    },[client])

    return (
        <div className="flex flex-col md:mx-4  mx-2     mt-3 min-h-screen bg-light dark:bg-dark">
            <Hamberger text={`${client ? "Organization / Update" : "Organization / Add New"}`} />
            <div className="w-[100%] mb-20  bg-cardBgLight dark:bg-cardBgDark shadow-lg rounded-lg p-6">
                <h2 className="md:text-2xl text-1xl font-semibold text-formHeadingLight dark:text-formHeadingDark md:mb-4 mb-2 text-start">{`${client ? "Update Organization" : "Create Organization"}`}</h2>
                <div className="h-[1.8px] bg-black dark:bg-white mb-4"></div>
                <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-formLabelLight dark:text-formLabelDark mb-1 font-medium">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-[100%]  bg-transparent p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter first name"
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>
                    <div>
                        <label className="block text-formLabelLight dark:text-formLabelDark mb-1 font-medium">Caption Text</label>
                        <input
                            type="text"
                            name="captionText"
                            value={formData.captionText}
                            onChange={handleChange}
                            className="w-[100%] bg-transparent p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter last name"
                        />
                        {errors.captionText && <p className="text-red-500 text-sm mt-1">{errors.captionText}</p>}
                    </div>
                    <div>
                        <label className="block text-formLabelLight dark:text-formLabelDark mb-1 font-medium">Address</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="w-[100%] bg-transparent p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter last name"
                        />
                        {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
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
                        />
                        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>

                    <div className="">
                        <label className="block text-formLabelLight dark:text-formLabelDark mb-1 font-medium">Logo (Max 2MB)</label>
                        <input
                            id="logo-input"
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, "logo")}
                            className="w-[100%] bg-transparent p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <span>
                            {logoPreview && (
                                <img src={logoPreview} alt="Logo Preview" className="h-20 mt-2 rounded" />
                            )}
                        </span>
                        {errors.logo && <p className="text-red-500 text-sm mt-1">{errors.logo}</p>}
                    </div>
                    <div className="">
                        <label className="block text-formLabelLight dark:text-formLabelDark mb-1 font-medium">Banner (Max 2MB)</label>
                        <input
                            id="banner-input"
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, "banner")}
                            className="w-[100%] bg-transparent p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <span>
                            {bannerPreview && (
                                <img src={bannerPreview} alt="Banner Preview" className="h-[60%] w-[100%] mt-2 rounded" />
                            )}
                        </span>
                        {errors.banner && <p className="text-red-500 text-sm mt-1">{errors.banner}</p>}
                    </div>

                </form>

                {responseError.length > 0 && (
                    <div className="w-[100%] mt-4 flex flex-col gap-1 p-4 bg-red-100 rounded-md">
                        {responseError.map((error, index) => (
                            <p key={index} className="text-red-700 text-sm">{error}</p>
                        ))}
                    </div>
                )}


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
                            `${client ? "Update Organization" : "Create Organization"}`
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CreateOrganization















