// import React from 'react'

// function CreatedSubscribed() {
//   return (
//     <div>
//        create subscribed
//     </div>
//   )
// }

// export default CreatedSubscribed


import React, { useEffect, useState } from "react";
import companyService from "../../services/companyService";
import Hamberger from "../../components/Hamberger/Hamberger";
import clientService from "../../services/clientService";
import Select from 'react-select';
import common from "../../helper/common";
import { useLocation, useNavigate } from "react-router-dom";
import { Country, State, City } from "country-state-city";
import subscriptionService from "../../services/subscriptionService";
import topupService from "../../services/topupService";
import subscribedUserService from "../../services/subscribedUserService";


function CreatedSubscribed() {
    const location = useLocation();
    const company = location?.state?.company
    const navigate = useNavigate();
    // states
    const [errors, setErrors] = useState({});
    const [errors2, setErrors2] = useState({});
    const [responseError, setResponseError] = useState([])
    const [responseError2, setResponseError2] = useState([])
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitting2, setIsSubmitting2] = useState(false);
    const [formData, setFormData] = useState({
        userId: "",
        subscriptionId: "",
    });

    console.log("formData",formData);
    

    const [formData2, setFormData2] = useState({
        userId: "",
        topupId: "",
    });

    const [clients, setClients] = useState([]);
    const [subscriptions, setSubscriptions] = useState([]);
    const [topups, setTopups] = useState([]);

    console.log("formData2",formData2);
    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        let newErrors = { ...errors };
        if (name == "userId") {
            if (!value) {
                newErrors.userId = "Client is required";
            } else {
                delete newErrors.userId;
            }
        }
        if (name == "subscriptionId") {
            if (!value) {
                newErrors.subscriptionId = "Plan is required";
            } else {
                delete newErrors.subscriptionId;
            }
        }
        setErrors(newErrors);
    };

    const handleChange2 = (e) => {
        const { name, value } = e.target;
        setFormData2({ ...formData2, [name]: value });
        let newErrors = { ...errors };
        if (name == "userId") {
            if (!value) {
                newErrors.userId = "Client is required";
            } else {
                delete newErrors.userId;
            }
        }

        if (name == "topupId") {
            if (!value) {
                newErrors.topupId = "Plan is required";
            } else {
                delete newErrors.topupId;
            }
        }
        setErrors2(newErrors);
    };

    const validateForm = () => {
        let newErrors = {};
        if (!formData.userId) newErrors.userId = "Client is required";
        if (!formData.subscriptionId) newErrors.subscriptionId = "Plan is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateForm2 = () => {
        let newErrors = {};
        if (!formData2.userId) newErrors.userId = "Client is required";
        if (!formData2.topupId) newErrors.topupId = "Plan is required";
        setErrors2(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setIsSubmitting(true);
        try {
            if (company) {
                // const response = await subscribedUserService.updateTopup({ ...formData, topupId: company?._id });
            } else {
                const response = await subscribedUserService.createSubscribedUser(formData);
            }
            setFormData({
                userId: "",
                subscriptionId: "",
            });
            navigate("/list/subscribed")
        } catch (error) {
            console.error("Error creating customer plan:", error);
            const errorMessage = error || 'An error occurred while creating customer plan';
            setResponseError([errorMessage]);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSubmit2 = async (e) => {
        e.preventDefault();
        if (!validateForm2()) return;
        setIsSubmitting2(true);
        try {
            if (company) {
                // const response = await subscribedUserService.updateTopup({ ...formData, topupId: company?._id });
            } else {
                const response = await subscribedUserService.createTopupScribedUser(formData2);
            }
            setFormData2({
                userId: "",
                topupId: "",
            });
            navigate("/list/subscribed")
        } catch (error) {
            console.error("Error creating customer plan:", error);
            const errorMessage = error || 'An error occurred while creating customer plan';
            setResponseError2([errorMessage]);
        } finally {
            setIsSubmitting2(false);
        }
    };


    useEffect(() => {
        getClientList();
        getSubscriptionPlan();
        getTopupPlan();
    }, [])

    async function getClientList(params) {
        try {
            const response = await clientService.getAllClients();
            setClients(response?.data?.data?.user)
        } catch (error) {
            console.log("error while getting the clients");
        }
    }

    async function getSubscriptionPlan(params) {
        try {
            const response = await subscriptionService.getAllSubscriptionPlan();
            console.log("all", response);

            setSubscriptions(response?.data?.data?.data)

        } catch (error) {
            console.log("error while getting the subscription plans");
        }
    }

    async function getTopupPlan(params) {
        try {
            const response = await subscriptionService.getAllTopupPlan();
            setTopups(response?.data?.data?.data)
        } catch (error) {
            console.log("error while getting the topup plans");
        }
    }




    return (
        <div className="flex flex-col md:mx-4  mx-2     mt-3 min-h-screen bg-light dark:bg-dark">
            <Hamberger text={`Subscribed / ${company ? "Update" : "Add New"} `} />
            <div className="w-[100%]   bg-cardBgLight dark:bg-cardBgDark shadow-lg rounded-lg p-6 mb-4">
                <h2 className="text-2xl font-semibold text-formHeadingLight dark:text-formHeadingDark mb-4 text-start">{`${company ? "Update" : "Create"} Subscribed`}</h2>
                <div className="h-[2px] bg-black dark:bg-white mb-4"></div>
                <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="">
                        <label className="block text-formLabelLight dark:text-formLabelDark mb-1 font-medium">Client</label>
                        <select
                            name="userId"
                            value={formData?.userId}
                            className="w-[100%] bg-white text-black dark:bg-cardBgDark dark:text-white p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={(e) => handleChange(e)}
                        >
                            <option value="">--Select Client--</option>
                            {clients && clients?.length > 0 &&
                                clients?.map((item) => (
                                    <option
                                        key={item?.serialNumber}
                                        value={item?._id}
                                        className="bg-white  text-black dark:bg-cardBgDark dark:text-white"
                                    >
                                        {item?.email}
                                    </option>
                                ))}

                        </select>
                        {errors.userId && <p className="text-red-500 text-sm mt-1">{errors?.userId}</p>}
                    </div>
                    <div className="">
                        <label className="block text-formLabelLight dark:text-formLabelDark mb-1 font-medium">Subscription Plan</label>
                        <select
                            name="subscriptionId"
                            value={formData?.subscriptionId}
                            className="w-[100%] bg-white text-black dark:bg-cardBgDark dark:text-white p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={(e) => handleChange(e)}
                        >
                            <option value="">--Select Plan--</option>
                            {subscriptions && subscriptions?.length > 0 &&
                                subscriptions?.map((item) => (
                                    <option
                                        key={item?.serialNumber}
                                        value={item?._id}
                                        className="bg-white text-black dark:bg-cardBgDark dark:text-white"
                                    >
                                        {item?.name}
                                    </option>
                                ))}
                        </select>
                        {errors.subscriptionId && <p className="text-red-500 text-sm mt-1">{errors?.subscriptionId}</p>}
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
                        className="w-auto p-2 text-sm text-white  rounded-lg transition-all duration-300 ease-in-out 
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
                            `${company ? "Update" : "Create"} Subscribed`
                        )}
                    </button>
                </div>
            </div>
            <div className="w-[100%]   bg-cardBgLight dark:bg-cardBgDark shadow-lg rounded-lg p-6">
                <h2 className="text-2xl font-semibold text-formHeadingLight dark:text-formHeadingDark mb-4 text-start">{`Create Topup`}</h2>
                <div className="h-[2px] bg-black dark:bg-white mb-4"></div>
                <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="">
                        <label className="block text-formLabelLight dark:text-formLabelDark mb-1 font-medium">Client</label>
                        <select
                            name="userId"
                            value={formData2?.userId}
                            className="w-[100%] bg-white text-black dark:bg-cardBgDark dark:text-white p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={(e) => handleChange2(e)}
                        >
                            <option value="">--Select Client--</option>
                            {clients && clients?.length > 0 &&
                                clients?.map((item) => (
                                    <option
                                        key={item?.serialNumber}
                                        value={item?._id}
                                        className="bg-white  text-black dark:bg-cardBgDark dark:text-white"
                                    >
                                        {item?.email}
                                    </option>
                                ))}

                        </select>
                        {errors2.userId && <p className="text-red-500 text-sm mt-1">{errors2?.userId}</p>}
                    </div>
                    <div className="">
                        <label className="block text-formLabelLight dark:text-formLabelDark mb-1 font-medium">Topup Plan</label>
                        <select
                            name="topupId"
                            value={formData2?.topupId}
                            className="w-[100%] bg-white text-black dark:bg-cardBgDark dark:text-white p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={(e) => handleChange2(e)}
                        >
                            <option value="">--Select Plan--</option>
                            {topups && topups?.length > 0 &&
                                topups?.map((item) => (
                                    <option
                                        key={item?.serialNumber}
                                        value={item?._id}
                                        className="bg-white text-black dark:bg-cardBgDark dark:text-white"
                                    >
                                        {item?.name}
                                    </option>
                                ))}
                        </select>
                        {errors2.topupId && <p className="text-red-500 text-sm mt-1">{errors2?.topupId}</p>}
                    </div>
                </form>
                {responseError2.length > 0 && (
                    <div className="w-[100%] mt-4 flex flex-col gap-1 p-4 bg-red-100 rounded-md">
                        {responseError2.map((error, index) => (
                            <p key={index} className="text-red-700 text-sm">{error}</p>
                        ))}
                    </div>
                )}
                <div className="flex justify-end mt-3">
                    <button
                        onClick={handleSubmit2}
                        className="w-auto text-sm p-2 text-white  rounded-lg transition-all duration-300 ease-in-out 
                bg-custom-gradient-button-dark dark:bg-custom-gradient-button-light 
                 hover:bg-custom-gradient-button-light dark:hover:bg-custom-gradient-button-dark 
                 flex items-center justify-center shadow-lg"
                        disabled={isSubmitting2}
                    >
                        {isSubmitting2 ? (
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
                            `${company ? "Update" : "Create"} Topup`
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CreatedSubscribed;
