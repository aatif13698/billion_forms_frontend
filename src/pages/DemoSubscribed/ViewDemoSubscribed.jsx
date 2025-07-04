

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
import LoadingSpinner from "../../components/Loading/LoadingSpinner";


function ViewDemoSubscribed() {
    const location = useLocation();
    const company = location?.state?.company;

    console.log("part data", company);

    const navigate = useNavigate();


    // states
    const [pageLoading, setPageLoading] = useState(true);
    const [companyData, setCompanyData] = useState(null)

    const [errors, setErrors] = useState({});
    const [responseError, setResponseError] = useState([])
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        userId: "",
        subscriptionId: "",
    });




    useEffect(() => {

        if (company && company?.userId?.email) {

            checkCompanyCreated(company?.userId?.email)

        }

    }, [company])

    async function checkCompanyCreated(email) {
        try {
            setPageLoading(true)
            const response = await companyService.checkCompanyCreated(email);
            setCompanyData(response?.data?.data?.data);
            setPageLoading(false)
        } catch (error) {
            setPageLoading(false)
            console.log("error while checking the company exists", error);
        }
    }

    async function handleLeadCovert(id) {
        try {
            setIsSubmitting(true)
            const response = await clientService.convertToClient({clientId: id});
            console.log("convert response", response);
            setIsSubmitting(false);
            navigate("/list/leads")
        } catch (error) {
            setIsSubmitting(false)
            console.log("error while converting the lead", error);
        }
    }



    return (
        <div className="flex flex-col md:mx-4  mx-2     mt-3 min-h-screen bg-light dark:bg-dark">
            <Hamberger text={`Lead / View `} />

            <div>
                {
                    pageLoading ?
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                height: "80vh",
                                alignItems: "center",
                                flexDirection: "column",
                            }}
                        >
                            <span className=" mt-1 font-medium  text-sm flex flex-col py-5">
                                {" "}
                                <LoadingSpinner />
                            </span>
                        </div>
                        :

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
                                    <h2 class="text-lg  mb-2 text-white">Customer Name :<span className="ml-1 font-semibold">{company?.userId?.firstName + " " + (company?.userId?.lastName ? company?.userId?.lastName : "")}</span></h2>
                                    <h2 class="text-lg  mb-2 text-white">Email :<span className="ml-1 font-semibold">{company?.userId?.email || 'N/A'}</span></h2>
                                    <h2 class="text-lg  mb-2 text-white">Phone :<span className="ml-1 font-semibold">{company?.userId?.phone || 'N/A'}</span></h2>

                                    {
                                        companyData ?
                                            <>
                                                <h2 class="text-lg  mb-2 text-white">Company :<span className="ml-1 font-semibold">{companyData?.name || 'N/A'}</span></h2>
                                                <h2 class="text-lg  mb-2 text-white">Sub Domain :<span className="ml-1 font-semibold">{companyData?.subDomain || 'N/A'}</span></h2>
                                            </> :
                                            <button
                                                onClick={() => navigate("/create/companies")}
                                                className="w-auto px-4 my-3 text-white py-2 rounded-lg transition-all duration-300 ease-in-out 
                bg-custom-gradient-button-dark dark:bg-custom-gradient-button-light 
                 hover:bg-custom-gradient-button-light dark:hover:bg-custom-gradient-button-dark 
                 flex items-center justify-center shadow-lg"
                                            >
                                                Add Company
                                            </button>

                                    }

                                    <button
                                        onClick={() => handleLeadCovert(company?.userId?._id)}
                                        className="w-auto px-4 my-3 text-white py-2 rounded-lg transition-all duration-300 ease-in-out 
                bg-custom-gradient-button-dark dark:bg-custom-gradient-button-light 
                 hover:bg-custom-gradient-button-light dark:hover:bg-custom-gradient-button-dark 
                 flex items-center justify-center shadow-lg"
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
                                `Convert To Client`
                            )}
                                        
                                    </button>
                                </div>
                                <div className="">
                                    <h2 class="text-lg  mb-2 text-white">Total Forms :<span className="ml-1 font-semibold">{company?.totalFormLimit == "0" ? "0" : company?.totalFormLimit || "N/A"}</span></h2>
                                    <h2 class="text-lg  mb-2 text-white">Total Organisations :<span className="ml-1 font-semibold">{company?.totalOrgLimit == "0" ? "0" : company?.totalOrgLimit || 'N/A'}</span></h2>
                                    <h2 class="text-lg  mb-2 text-white">Total Users :<span className="ml-1 font-semibold">{company?.totalUserLimint == "0" ? "0" : company?.totalUserLimint || 'N/A'}</span></h2>
                                    <h2 class="text-lg  mb-2 text-white">Expiry Date :<span className="ml-1 font-semibold">{company?.finalExpiryDate !== null ? common.formatDateToReadableString(company?.finalExpiryDate) : 'Unlimited'}</span></h2>
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


                            <div className="flex justify-end mt-3">
                                <button
                                    onClick={() => navigate("/list/leads")}
                                    className="w-auto px-4 my-3 text-white py-2 rounded-lg transition-all duration-300 ease-in-out 
                bg-custom-gradient-button-dark dark:bg-custom-gradient-button-light 
                 hover:bg-custom-gradient-button-light dark:hover:bg-custom-gradient-button-dark 
                 flex items-center justify-center shadow-lg"
                                >
                                    Back
                                </button>
                            </div>

                        </div>

                }

            </div>








        </div>
    );
}

export default ViewDemoSubscribed;
