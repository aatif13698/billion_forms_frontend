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


function ViewSubscribed() {
    const location = useLocation();
    const company = location?.state?.company;


    console.log("part data", company);

    const navigate = useNavigate();
    // states
    const [errors, setErrors] = useState({});
    const [responseError, setResponseError] = useState([])
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        userId: "",
        subscriptionId: "",
    });


    const [clients, setClients] = useState([]);
    const [subscriptions, setSubscriptions] = useState([]);


    // useEffect(() => {
    //     if (company) {
    //         setFormData((prev) => ({
    //             ...prev,
    //             name: company?.name,
    //             country: company?.country,
    //             currency: company?.currency,
    //             subscriptionCharge: company?.subscriptionCharge,
    //             formLimit: company?.formLimit,
    //             organisationLimit: company?.organisationLimit,
    //             userLimint: company?.userLimint,
    //             validityPeriod: company?.validityPeriod
    //         }));
    //         const selectedCountry = Country?.getAllCountries()?.find((item) => item?.name == company?.country);
    //         setCountryData((prev) => ({
    //             ...prev,
    //             countryName: selectedCountry?.name,
    //             countryISOCode: selectedCountry?.isoCode,
    //         }));
    //     }
    // }, [company])




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

    const validateForm = () => {
        let newErrors = {};
        if (!formData.userId) newErrors.userId = "Client is required";
        if (!formData.subscriptionId) newErrors.subscriptionId = "Plan is required";
        setErrors(newErrors);
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


    useEffect(() => {
        getClientList();
        getSubscriptionPlan();
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




    return (
        <div className="flex flex-col md:mx-4  mx-2     mt-3 min-h-screen bg-light dark:bg-dark">
            <Hamberger text={`Subscribed / View `} />
            <div className="w-[100%]   bg-cardBgLight dark:bg-cardBgDark shadow-lg rounded-lg p-6 mb-20">
                {/* <h2 className="text-2xl font-semibold text-formHeadingLight dark:text-formHeadingDark mb-4 text-start">{`View Plans Details`}</h2> */}
                <h2 className="text-2xl font-semibold text-formHeadingLight dark:text-formHeadingDark mb-1 text-start">

                    <span
                        className="bg-gradient-to-r from-[#0FD6D6] to-[#1DD229] bg-clip-text text-transparent "
                    >
                        View Plans Details
                    </span>
                </h2>
                <div className="h-[2px] bg-black dark:bg-white mb-4"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-subscriptionCardBgLightFrom dark:bg-subscriptionCardBgDarkFrom my-4 py-4 px-2 rounded-md">
                    <div className="">
                        <h2 class="text-lg  mb-2 text-white">Customer Name :<span className="ml-1 font-semibold">{company?.userId?.firstName + " " + company?.userId?.lastName}</span></h2>
                        <h2 class="text-lg  mb-2 text-white">Email :<span className="ml-1 font-semibold">{company?.userId?.email || 'N/A'}</span></h2>
                        <h2 class="text-lg  mb-2 text-white">Phone :<span className="ml-1 font-semibold">{company?.userId?.phone || 'N/A'}</span></h2>
                    </div>
                    <div className="">
                        <h2 class="text-lg  mb-2 text-white">Total Forms :<span className="ml-1 font-semibold">{company?.totalFormLimit == "0" ? "0" : company?.totalFormLimit || "N/A"}</span></h2>
                        <h2 class="text-lg  mb-2 text-white">Total Organisations :<span className="ml-1 font-semibold">{company?.totalOrgLimit == "0" ? "0" : company?.totalOrgLimit  || 'N/A'}</span></h2>
                        <h2 class="text-lg  mb-2 text-white">Total Users :<span className="ml-1 font-semibold">{company?.totalUserLimint == "0" ? "0" : company?.totalUserLimint || 'N/A'}</span></h2>
                    </div>
                </div>

                <h2 className="text-2xl font-semibold text-formHeadingLight dark:text-formHeadingDark mb-4 text-start">
                    {/* <span className="border-b-2 border-current inline-block pb-1">
                        Subscription
                    </span> */}
                    <span
                        className="bg-gradient-to-r from-[#0FD6D6] to-[#1DD229] bg-clip-text text-transparent border-b-2 border-black dark:border-white inline-block pb-1"
                    >
                        Subscription
                    </span>
                </h2>

                <div
                    className="grid grid-cols-1 md:grid-cols-2 mb-4 gap-4"
                >
                    {
                        company && company?.subscription?.length > 0 ? company?.subscription?.map((item, index) => {
                            console.log("data", item);
                            return (
                                <div
                                    key={index}
                                    className="bg-gradient-to-r from-subscriptionCardBgLightFrom dark:from-subscriptionCardBgDarkFrom to-subscriptionCardBgLightTo dark:to-subscriptionCardBgDarkTo rounded-lg overflow-hidden shadow-xl transition-transform hover:scale-105 "
                                >
                                    <div class="p-4">

                                        <h2
                                            className="text-xl font-semibold bg-gradient-to-r from-textGradientLightFrom to-textGradientLightkTo dark:from-textGradientDarktFrom dark:to-textGradientDarkTo bg-clip-text text-transparent   pb-1"
                                        >{item?.subscriptionId?.name || 'Unknown Plan'}</h2>
                                        <div className=" grid grid-cols-1 lg:grid-cols-2 gap-2 space-y-2 mb-6">
                                            <div className="">
                                                <p className="text-md my-2 font-medium text-white flex items-center">
                                                    <svg
                                                        className="w-5 h-5 mr-2 text-white"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                        ></path>
                                                    </svg>
                                                    Form Limit: <span className="ml-1 font-semibold">{item?.subscriptionId?.formLimit || 'N/A'}</span>
                                                </p>
                                                <p className="text-md my-2 font-medium text-white flex items-center">
                                                    <svg
                                                        className="w-5 h-5 mr-2 text-white"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h-2m-6 0H7m2-5h6m-6-4h6"
                                                        ></path>
                                                    </svg>
                                                    Organization Limit: <span className="ml-1 font-semibold">{item?.subscriptionId?.organisationLimit || 'N/A'}</span>
                                                </p>
                                                <p className="text-md my-2 font-medium text-white flex items-center">
                                                    <svg
                                                        className="w-5 h-5 mr-2 text-white"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                                                        ></path>
                                                    </svg>
                                                    User Limit: <span className="ml-1 font-semibold">{item?.subscriptionId?.userLimint || 'N/A'}</span>
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-md font-medium text-white flex items-center">
                                                    <svg
                                                        className="w-5 h-5 mr-2 text-white"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                        />
                                                    </svg>

                                                    Start Date: <span className="ml-1 font-semibold">{common.formatDateToReadableString(item?.startDate)}</span>
                                                </p>
                                                <p className="text-md font-medium text-white flex items-center">
                                                    <svg
                                                        className="w-5 h-5 mr-2 text-white"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                        />
                                                    </svg>

                                                    End Date: <span className="ml-1 font-semibold">{common.formatDateToReadableString(item?.endDate)}</span>
                                                </p>
                                            </div>

                                        </div>
                                        {/* <div class="flex justify-end space-x-4">
                                            <button
                                                className="duration-300 bg-custom-gradient-sidebar dark:bg-custom-gradient-sidebar-dark hover:bg-custom-gradient-sidebar/25 text-white font-bold py-2 px-4 rounded"
                                            >
                                                Inactivate
                                            </button>
                                        </div> */}
                                    </div>
                                </div>
                            )
                        })
                            :
                            <div className="bg-gradient-to-r flex justify-center from-subscriptionCardBgLightFrom dark:from-subscriptionCardBgDarkFrom to-subscriptionCardBgLightTo dark:to-subscriptionCardBgDarkTo rounded-lg col-span-2 py-2 px-2">
                                <span className="text-white ">No Subscription Found</span>
                            </div>
                    }
                </div>

                <h2 className="text-2xl font-semibold text-formHeadingLight dark:text-formHeadingDark mb-4 text-start">
                    {/* <span className="border-b-2 border-current inline-block pb-1">
                        Subscription
                    </span> */}
                    <span
                        className="bg-gradient-to-r from-[#0FD6D6] to-[#1DD229] bg-clip-text text-transparent border-b-2 border-black dark:border-white inline-block pb-1"
                    >
                        Topups
                    </span>
                </h2>
                <div
                    className="grid grid-cols-1 md:grid-cols-2 mb-4 gap-4"
                >
                    {
                        company && company?.topup?.length > 0 ? company?.topup?.map((item, index) => {
                            console.log("data", item);
                            return (
                                <div
                                    key={index}
                                    className="bg-gradient-to-r from-subscriptionCardBgLightFrom dark:from-subscriptionCardBgDarkFrom to-subscriptionCardBgLightTo dark:to-subscriptionCardBgDarkTo rounded-lg overflow-hidden shadow-xl transition-transform hover:scale-105 "
                                >
                                    <div class="p-4">
                                        <h2
                                            className="text-xl font-semibold bg-gradient-to-r from-textGradientLightFrom to-textGradientLightkTo dark:from-textGradientDarktFrom dark:to-textGradientDarkTo bg-clip-text text-transparent   pb-1"
                                        >{item?.topupId?.name || 'Unknown Plan'}
                                        </h2>
                                        <div className=" grid grid-cols-1 lg:grid-cols-2 gap-4 space-y-2 mb-6">
                                            <div>
                                                <p className="text-md font-medium text-white flex items-center">
                                                    <svg
                                                        className="w-5 h-5 mr-2 text-white"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                        ></path>
                                                    </svg>
                                                    Form Limit: <span className="ml-1 font-semibold">{item?.topupId?.formLimit || 'N/A'}</span>
                                                </p>
                                                <p className="text-md font-medium text-white flex items-center">
                                                    <svg
                                                        className="w-5 h-5 mr-2 text-white"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h-2m-6 0H7m2-5h6m-6-4h6"
                                                        ></path>
                                                    </svg>
                                                    Organization Limit: <span className="ml-1 font-semibold">{item?.topupId?.organisationLimit || 'N/A'}</span>
                                                </p>
                                                <p className="text-md font-medium text-white flex items-center">
                                                    <svg
                                                        className="w-5 h-5 mr-2 text-white"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                                                        ></path>
                                                    </svg>
                                                    User Limit: <span className="ml-1 font-semibold">{item?.topupId?.userLimint || 'N/A'}</span>
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-md font-medium text-white flex items-center">
                                                    <svg
                                                        className="w-5 h-5 mr-2 text-white"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                        />
                                                    </svg>

                                                    Start Date: <span className="ml-1 font-semibold">{common.formatDateToReadableString(item?.startDate)}</span>
                                                </p>
                                                <p className="text-md font-medium text-white flex items-center">
                                                    <svg
                                                        className="w-5 h-5 mr-2 text-white"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                        />
                                                    </svg>

                                                    End Date: <span className="ml-1 font-semibold">{common.formatDateToReadableString(item?.endDate)}</span>
                                                </p>
                                            </div>

                                        </div>
                                        {/* <div class="flex justify-end space-x-4">
                                            <button
                                                className="duration-300 bg-custom-gradient-sidebar dark:bg-custom-gradient-sidebar-dark hover:bg-custom-gradient-sidebar/25 text-white font-bold py-2 px-4 rounded"
                                            >
                                                Inactivate
                                            </button>
                                        </div> */}
                                    </div>
                                </div>
                            )
                        })
                            :
                            <div className="bg-gradient-to-r flex justify-center from-subscriptionCardBgLightFrom dark:from-subscriptionCardBgDarkFrom to-subscriptionCardBgLightTo dark:to-subscriptionCardBgDarkTo rounded-lg col-span-2 py-2 px-2">
                                <span className="text-white ">No Topups Found</span>
                            </div>
                    }
                </div>


                {responseError.length > 0 && (
                    <div className="w-[100%] mt-4 flex flex-col gap-1 p-4 bg-red-100 rounded-md">
                        {responseError.map((error, index) => (
                            <p key={index} className="text-red-700 text-sm">{error}</p>
                        ))}
                    </div>
                )}

                <div className="flex justify-end mt-3">


                    <button
                        onClick={() => navigate("/list/subscribed")}
                        className="w-auto px-4 my-3 text-white py-2 rounded-lg transition-all duration-300 ease-in-out 
                bg-custom-gradient-button-dark dark:bg-custom-gradient-button-light 
                 hover:bg-custom-gradient-button-light dark:hover:bg-custom-gradient-button-dark 
                 flex items-center justify-center shadow-lg"
                    >
                        Back
                    </button>

                </div>


            </div>

        </div>
    );
}

export default ViewSubscribed;
