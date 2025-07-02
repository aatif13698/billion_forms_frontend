


import React, { useEffect, useState } from "react";
import companyService from "../../services/companyService";
import Hamberger from "../../components/Hamberger/Hamberger";
import clientService from "../../services/clientService";
import Select from 'react-select';
import common from "../../helper/common";
import { useLocation, useNavigate } from "react-router-dom";
import { Country, State, City } from "country-state-city";
import subscriptionService from "../../services/subscriptionService";
import { useSelector } from "react-redux";


function CreateSubscriptionPlan() {
    const location = useLocation();
    const pathName = location?.pathname;

    const company = location?.state?.company
    const navigate = useNavigate();

    const { capability } = useSelector((state) => state.capabilitySlice);
    const [permission, setPermission] = useState(null);



    // states
    const [errors, setErrors] = useState({});
    const [responseError, setResponseError] = useState([])
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        country: "",
        currency: "",
        subscriptionCharge: "",
        formLimit: "",
        organisationLimit: "",
        userLimint: "",
        validityPeriod: "",
        isDemoSubscription: false,
        
    });

    console.log("formData", formData);
    console.log("errors", errors);


    const [countryData, setCountryData] = useState({
        countryList: "",
        currency: "",
        countryName: "",
        countryISOCode: "",
        CountryISDCode: "",
        stateList: "",
        stateName: "",
        stateISOCode: "",
        cityList: "",
        cityName: "",
    });

    console.log("countryData", countryData);

    const {
        countryList,
        currency,
        countryName,
        countryISOCode,
        CountryISDCode,
        stateList,
        stateName,
        stateISOCode,
        cityList,
        cityName,
    } = countryData;


    useEffect(() => {
        setCountryData((prev) => ({
            ...prev,
            countryList: Country.getAllCountries(),
            stateList: State.getStatesOfCountry(countryISOCode),
            cityList: City.getCitiesOfState(countryISOCode, stateISOCode),
        }));
    }, [countryISOCode, stateISOCode]);

    const handleCountry = (e) => {
        const { name, value } = e.target;
        const selectedCountry = countryList.find(
            (country) => country?.name === value
        );
        if (name == "country") {
            if (value == "") {

                setFormData((prev) => ({
                    ...prev,
                    country: "",
                    currency: ""
                }));

                setErrors((prev) => ({
                    ...prev,
                    country: "Country is required.",
                }));

            } else {
                setErrors((prev) => ({
                    ...prev,
                    country: "",
                }));
            }
        }
        if (selectedCountry) {
            setCountryData((prev) => ({
                ...prev,
                countryName: selectedCountry?.name,
                currency: selectedCountry?.currency,
                countryISOCode: selectedCountry?.isoCode,
                CountryISDCode: selectedCountry?.contactNumbercode,
            }));
            setFormData((prev) => ({
                ...prev,
                country: selectedCountry?.name,
                currency: selectedCountry?.currency
            }))
        } else {

            setCountryData((prev) => ({
                ...prev,
                countryName: "",
                countryISOCode: "",
                CountryISDCode: "",
            }));

        }
    };



    useEffect(() => {
        if (company) {
            setFormData((prev) => ({
                ...prev,
                name: company?.name,
                country: company?.country,
                currency: company?.currency,
                subscriptionCharge: company?.subscriptionCharge,
                formLimit: company?.formLimit,
                organisationLimit: company?.organisationLimit,
                userLimint: company?.userLimint,
                validityPeriod: company?.validityPeriod,
                isDemoSubscription: company?.isDemoSubscription
            }));
            const selectedCountry = Country?.getAllCountries()?.find((item) => item?.name == company?.country);
            setCountryData((prev) => ({
                ...prev,
                countryName: selectedCountry?.name,
                countryISOCode: selectedCountry?.isoCode,
            }));
        }
    }, [company])



    // regex
    const emailRegex = /\S+@\S+\.\S+/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        let newErrors = { ...errors };
        if (name == "name") {
            if (!value) {
                newErrors.name = "Subscription name is required";
            } else {
                delete newErrors.name;
            }
        }
        if (name == "formLimit") {
            if (!value) {
                newErrors.formLimit = "Form Limit is required";
            } else {
                delete newErrors.formLimit;
            }
        }
        if (name == "organisationLimit") {
            if (!value) {
                newErrors.organisationLimit = "Organisation Limit is required";
            } else {
                delete newErrors.organisationLimit;
            }
        }
        if (name == "userLimint") {
            if (!value) {
                newErrors.userLimint = "User Limint is required";
            } else {
                delete newErrors.userLimint;
            }
        }

        if (name == "subscriptionCharge") {
            if (!value) {
                newErrors.subscriptionCharge = "Subscription Charge is required";
            } else {
                delete newErrors.subscriptionCharge;
            }
        }

        if (name == "validityPeriod") {
            if (!value) {
                newErrors.validityPeriod = "Validity is required";
            } else {
                delete newErrors.validityPeriod;
            }
        }
        setErrors(newErrors);
    };

    const validateForm = () => {

        let newErrors = {};
        if (!formData.name.trim()) newErrors.name = "Subscription name is required";
        if (!formData.country.trim()) newErrors.country = "Country is required";
        if (!formData.currency.trim()) newErrors.currency = "Currency is required";
        if (!formData.validityPeriod.trim()) newErrors.validityPeriod = "Validity is required";
        if (!formData.subscriptionCharge) newErrors.subscriptionCharge = "Subscription charge is required";
        if (!formData.formLimit) newErrors.formLimit = "Form Limit is required";
        if (!formData.organisationLimit) newErrors.organisationLimit = "Organisation Limit is required";
        if (!formData.userLimint) newErrors.userLimint = "User Limint is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setIsSubmitting(true);
        try {
            if (company) {
                const response = await subscriptionService.updateSubscription({ ...formData, subscriptionPlanId: company?._id });
            } else {
                const response = await subscriptionService.createSubscriptionPlan(formData);
            }
            setFormData({
                name: "",
                country: "",
                currency: "",
                subscriptionCharge: "",
                formLimit: "",
                organisationLimit: "",
                userLimint: "",
                validityPeriod: "",
                isDemoSubscription: false
            });

            navigate("/list/subscription")

        } catch (error) {
            console.error("Error creating subscription plan:", error);
            const errorMessage = error || 'An error occurred while creating subscription plan';
            setResponseError([errorMessage]);
        } finally {
            setIsSubmitting(false);
        }
    };


    useEffect(() => {
        if (!capability || capability.length === 0) return;
        const administration = capability.find(item => item?.name === "Administration");
        if (!administration) return;
        const staffMenu = administration.menu?.find(menu => menu?.name === "Subscription");
        if (!staffMenu) return;
        setPermission([staffMenu]);
        const accessMap = {
            "/view/subscription": staffMenu.subMenus?.view?.access,
            "/update/subscription": staffMenu.subMenus?.update?.access,
            "/create/subscription": staffMenu.subMenus?.create?.access,
        };
        const hasAccess = accessMap[pathName];
        if (hasAccess === false) {
            alert("Unauthorized to access this!");
            navigate("/home");
        }
    }, [capability, pathName, navigate]);





    return (
        <div className="flex flex-col md:mx-4  mx-2     mt-3 min-h-screen bg-light dark:bg-dark">
            <Hamberger text={`Subscription / ${pathName == "/view/subscription" ? "View" : company ? "Update" : "Add New"} `} />
            <div className="w-[100%]   bg-cardBgLight dark:bg-cardBgDark shadow-lg rounded-lg p-6">
                <h2 className="md:text-2xl text-1xl font-semibold text-formHeadingLight dark:text-formHeadingDark md:mb-4 mb-2 text-start">{`${pathName == "/view/subscription" ? "View" : company ? "Update" : "Create"} Subscription`}</h2>

                <div className="h-[2px] bg-black dark:bg-white mb-4"></div>


                <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                        <label className="block text-formLabelLight dark:text-formLabelDark mb-1 font-medium">Subscription Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData?.name}
                            onChange={handleChange}
                            className="w-[100%] bg-transparent p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter subscription name"
                            disabled={pathName == "/view/subscription" ? true : false}

                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors?.name}</p>}
                    </div>

                    {/* country */}
                    <div className="">
                        <label className="block text-formLabelLight dark:text-formLabelDark mb-1 font-medium">
                            Country
                        </label>
                        <select
                            name="country"
                            value={countryName}
                            className="w-[100%] bg-white text-black dark:bg-cardBgDark dark:text-white p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={(e) => handleCountry(e)}
                            disabled={pathName == "/view/subscription" ? true : false}

                        >
                            <option value="">--select country--</option>
                            {countryList && countryList.length > 0 &&
                                countryList?.map((country) => (
                                    <option
                                        key={country?.isoCode}
                                        value={country?.name}
                                        className="bg-white text-black dark:bg-cardBgDark dark:text-white"
                                    >
                                        {country?.name}
                                    </option>
                                ))}
                        </select>
                        {errors.country && (
                            <p className="text-red-500 text-sm mt-1">{errors?.country}</p>
                        )}
                    </div>

                    {/* currancy */}
                    <div>
                        <label className="block text-formLabelLight dark:text-formLabelDark mb-1 font-medium">Currency</label>
                        <input
                            type="text"
                            name="currency"
                            value={formData?.currency}
                            disabled={true}
                            // onChange={handleChange}
                            className="w-[100%] bg-transparent p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Currency"

                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors?.currency}</p>}
                    </div>

                    <div className="">
                        <label className="block text-formLabelLight dark:text-formLabelDark mb-1 font-medium">Validity</label>
                        <select
                            name="validityPeriod"
                            value={formData?.validityPeriod}
                            className="w-[100%] bg-white text-black dark:bg-cardBgDark dark:text-white p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={(e) => handleChange(e)}
                            disabled={pathName == "/view/subscription" ? true : false}

                        >
                            <option value="">--select validity--</option>
                              <option
                                className="bg-white text-black dark:bg-cardBgDark dark:text-white"

                                value="weekly">Weekly (7 days)</option>
                            <option
                                className="bg-white text-black dark:bg-cardBgDark dark:text-white"

                                value="monthly">Monthly (30 days)</option>
                            <option
                                className="bg-white text-black dark:bg-cardBgDark dark:text-white"

                                value="quarterly">Quarterly (3 months)</option>
                            <option
                                className="bg-white text-black dark:bg-cardBgDark dark:text-white"

                                value="halfyearly">Half-Yearly (6 months)</option>
                            <option
                                className="bg-white text-black dark:bg-cardBgDark dark:text-white"

                                value="yearly">Yearly (12 months)</option>
                            <option
                                className="bg-white text-black dark:bg-cardBgDark dark:text-white"

                                value="infinite">Unlimited</option>

                        </select>
                        {errors.validityPeriod && <p className="text-red-500 text-sm mt-1">{errors?.validityPeriod}</p>}
                    </div>


                    <div>
                        <label className="block text-formLabelLight dark:text-formLabelDark mb-1 font-medium">Subscription Charge</label>
                        <input
                            type="text"
                            name="subscriptionCharge"
                            value={formData?.subscriptionCharge}
                            onChange={handleChange}
                            onInput={common.handleKeyPress}
                            className="w-[100%] bg-transparent p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter subscription charge"
                            disabled={pathName == "/view/subscription" ? true : false}

                        />
                        {errors.subscriptionCharge && <p className="text-red-500 text-sm mt-1">{errors?.subscriptionCharge}</p>}
                    </div>

                    {/* form limit */}
                    <div>
                        <label className="block text-formLabelLight dark:text-formLabelDark mb-1 font-medium">Form Limit</label>
                        <input
                            type="text"
                            name="formLimit"
                            value={formData?.formLimit}
                            onChange={handleChange}
                            onInput={common.handleKeyPress}
                            className="w-[100%] bg-transparent p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter form limit"
                            disabled={pathName == "/view/subscription" ? true : false}

                        />
                        {errors.formLimit && <p className="text-red-500 text-sm mt-1">{errors?.formLimit}</p>}
                    </div>

                    <div>
                        <label className="block text-formLabelLight dark:text-formLabelDark mb-1 font-medium">Organisation Limit</label>
                        <input
                            type="text"
                            name="organisationLimit"
                            value={formData?.organisationLimit}
                            onChange={handleChange}
                            onInput={common.handleKeyPress}
                            className="w-[100%] bg-transparent p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter organisation limit"
                            disabled={pathName == "/view/subscription" ? true : false}

                        />
                        {errors.organisationLimit && <p className="text-red-500 text-sm mt-1">{errors?.organisationLimit}</p>}
                    </div>

                    <div>
                        <label className="block text-formLabelLight dark:text-formLabelDark mb-1 font-medium">User Limit</label>
                        <input
                            type="text"
                            name="userLimint"
                            value={formData?.userLimint}
                            onChange={handleChange}
                            onInput={common.handleKeyPress}
                            className="w-[100%] bg-transparent p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter organisation limit"
                            disabled={pathName == "/view/subscription" ? true : false}

                        />
                        {errors.userLimint && <p className="text-red-500 text-sm mt-1">{errors?.userLimint}</p>}
                    </div>
                    <div className="flex gap-2 items-center">
                        <input
                            type="checkbox"
                            name="isDemoSubscription"
                            checked={formData?.isDemoSubscription}
                            onChange={() => setFormData((prev) => {
                                return {
                                    ...prev,
                                    isDemoSubscription: !formData?.isDemoSubscription
                                }
                            })}
                            className="w-[1rem] h-[1rem]"
                        />
                        <label className="block text-formLabelLight dark:text-formLabelDark mb-1 font-medium">Is Demo Subscription</label>
                    </div>

                </form>

                {responseError.length > 0 && (
                    <div className="w-[100%] mt-4 flex flex-col gap-1 p-4 bg-red-100 rounded-md">
                        {responseError.map((error, index) => (
                            <p key={index} className="text-red-700 text-sm">{error}</p>
                        ))}
                    </div>
                )}


                {pathName == "/view/subscription" ? "" :
                    <div className="flex justify-end mt-3">
                        <button
                            onClick={handleSubmit}
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
                                `${company ? "Update" : "Create"} Subscription`
                            )}
                        </button>

                    </div>

                }





            </div>

        </div>
    );
}

export default CreateSubscriptionPlan;
