import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Hamberger from '../../components/Hamberger/Hamberger';
import { FaEnvelope, FaSpinner } from 'react-icons/fa';
import Select from 'react-select';
import 'tippy.js/dist/tippy.css'; // Optional: default CSS styling
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import "../../App.css"
import clientService from '../../services/clientService';
import { useSelector } from 'react-redux';
import a from "../../helper/common";
import { AiOutlinePlus } from "react-icons/ai";







function AssignUser() {

    const navigate = useNavigate();
    const location = useLocation();
    const data = location?.state;

    console.log("id", data?.organization?._id);


    const { clientUser: currentUser } = useSelector((state) => state.authCustomerSlice);
    const [users, setUsers] = useState([])
    const [formData, setFormData] = useState({
        userEmail: ""
    });
    const [errors, setErrors] = useState([]);
    const [responseError, setResponseError] = useState([])

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDataLoading, setIsDataLoading] = useState(true);

    console.log("errors", errors);


    const handleSelectChange = (selectedOptions) => {
        setFormData({ ...formData, ["userEmail"]: selectedOptions?.value });
        setErrors((prev) => ({ ...prev, userEmail: "" }));
    };

    // Fetch existing fields on component mount
    useEffect(() => {
        const fetchUser = async () => {
            try {
                setIsDataLoading(true);
                const response = await clientService.getAllUser(currentUser?.companyId);
                const data = response?.data?.data?.user?.map(type => ({ value: type?.email, label: `${type?.firstName}(${type?.email})` }));
                setUsers(data)
                console.log("user response", response);
                setIsDataLoading(false);
            } catch (error) {
                setIsDataLoading(false);
                setErrors(['Failed to fetch users']);
            }
        };
        fetchUser();
    }, []);

    const validateForm = () => {
        let newErrors = {};
        if (!formData.userEmail.trim() || !/\S+@\S+\.\S+/.test(formData.userEmail))
            newErrors.userEmail = "Select user";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setIsSubmitting(true);
        try {
            const dataObject = {
                email: formData.userEmail,
                organizationId: data?.organization?._id
            }
            const response = await clientService.assignUser(dataObject);
            setResponseError([]);
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
            setFormData({ userEmail: "" });
        } catch (error) {
            console.error("Error assigning user:", error);
            const errorMessage = error || 'An error occurred while assiging user';
            // setErrors([errorMessage]);
            setResponseError([errorMessage]);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col md:mx-4 mx-2 mt-3 min-h-screen bg-light dark:bg-dark">
            <Hamberger text="Organization / Assign user" />
            <div className="w-[100%] mb-4 bg-cardBgLight dark:bg-cardBgDark shadow-lg rounded-lg p-1">
                <div
                    className="relative   bg-light dark:bg-transparent  overflow-hidden transition-transform duration-300 "
                >
                    <div
                        className="absolute inset-0 bg-cover "
                    />
                    <div className="relative z-10  hover:bg-opacity-40 flex flex-col  justify-start py-6 px-4">
                        {/* School details */}
                        <div className="text-left text-textLight dark:text-textDark  w-[100%] ">
                            <h2 className="text-md md:text-4xl font-bold mb-2 drop-shadow-md">
                                {`${data?.organization?.name}`}
                            </h2>
                            <h4 className="text-sm md:text-base font-medium mb-1 drop-shadow-sm">
                                {data?.organization?.captionText}
                            </h4>
                            <div className="flex items-center text-sm md:text-base font-medium mb-1 drop-shadow-sm">
                                <FaEnvelope className="mr-2 " />
                                <span>{data?.organization?.email}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='flex justify-center'>
                <div className="md:w-[50%] w-[100%]  border-subscriptionCardBgLightFrom border-2 dark:border-white bg-cardBgLight dark:bg-cardBgDark shadow-lg rounded-lg p-6">
                    <div className='flex justify-between mb-2'>
                        <h2 className="md:text-2xl text-1xl font-semibold text-formHeadingLight dark:text-formHeadingDark md:mb-2 mb-2 text-start">Assign User</h2>
                        <button
                            onClick={() => navigate("/create/user")}
                            className="w-auto p-1 font-body px-2 text-sm text-white rounded-lg transition-all duration-300 ease-in-out 
                              bg-blue-400 dark:bg-blue-400
                             hover:bg-blue-800/40 dark:hover:bg-blue-800/90
                             flex items-center justify-center shadow-lg "
                        >

                            <AiOutlinePlus size={20} />
                            <span>Create New</span>
                        </button>
                    </div>
                    <div className="h-[1.8px] bg-black dark:bg-white mb-4"></div>
                    <form className="grid grid-cols-1 md:grid-cols-1 gap-4">
                        <div>
                            <label className="block text-formLabelLight dark:text-formLabelDark mb-1 font-medium">Select User Email</label>
                            <Select
                                options={users}
                                className="basic-multi-select bg-transparent"
                                classNamePrefix="select"
                                placeholder="Select Client..."
                                onChange={handleSelectChange}
                                styles={a.customStyles}
                                value={{ value: formData?.userEmail, label: formData?.userEmail }}
                            />
                            {errors.userEmail && <p className="text-red-500 text-sm mt-1">{errors.userEmail}</p>}
                        </div>
                    </form>
                    {responseError.length > 0 && (
                        <div className="w-[100%] mt-4 flex flex-col gap-1 p-4 bg-red-100 rounded-md">
                            {responseError.map((error, index) => (
                                <p key={index} className="text-red-700 text-sm">{error}</p>
                            ))}
                        </div>
                    )}
                    <div className="flex justify-end mt-6">
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="w-auto p-2 text-sm text-white rounded-lg transition-all duration-300 ease-in-out 
                            bg-custom-gradient-button-dark dark:bg-custom-gradient-button-light 
                             hover:bg-custom-gradient-button-light dark:hover:bg-custom-gradient-button-dark 
                             flex items-center justify-center shadow-lg"
                        >
                            {isSubmitting ? (
                                <>
                                    <FaSpinner className="animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                `Assign User`
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AssignUser
