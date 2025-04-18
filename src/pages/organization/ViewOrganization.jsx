import React, { useEffect, useState } from "react";
import Hamberger from "../../components/Hamberger/Hamberger";
import { useLocation, useNavigate } from "react-router-dom";
import { FaEnvelope, FaMapMarkerAlt, FaPhone, FaUsers, FaEdit, FaTrash, FaTrashAlt, FaRegEdit, FaRegUser, FaUser } from "react-icons/fa";
import LoadingModel from "../../components/Loading/LoadingModel";
import organizationService from "../../services/organizationService";
import { FcBusinessman } from "react-icons/fc";

function ViewOrganization() {

    // loading handling
    const [showLoadingModal, setShowLoadingModal] = useState(false);
    const handleCloseLoadingModal = () => {
        setShowLoadingModal(false);
    };

    const location = useLocation();
    const client = location?.state?.organization;
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
        // navigate(`/organization/${client?._id}/manage-users`);
    };

    const handleEdit = async () => {
        try {
            setShowLoadingModal(true);
            const response = await organizationService.getParticularOrganization(client?._id);
            navigate("/create/organization", { state: { organization: response?.data?.data?.data } })
            setShowLoadingModal(false);
        } catch (error) {
            setShowLoadingModal(false);
            console.log("error while getting the particular organization", error);
        }
        // navigate("/edit-organization", { state: { organization: client } });
    };

    const handleDelete = () => {
        console.log("Delete clicked");
        // Example: await clientService.deleteOrganization(client?._id);
        // navigate("/list/clients");
    };

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
                                onError={(e) => {
                                    e.target.src = '/fallback-logo.png'; // Fallback image
                                }}
                            />
                        </div>
                        {/* School details */}
                        <div className="text-left text-white w-full max-w-md">
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
            </div>

            <LoadingModel showLoadingModal={showLoadingModal} setShowLoadingModal={setShowLoadingModal} handleCloseLoadingModal={handleCloseLoadingModal} />

        </div>
    );
}

export default ViewOrganization;