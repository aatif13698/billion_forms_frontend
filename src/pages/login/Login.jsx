import React, { memo, useEffect, useState } from 'react';
import images from '../../constant/images';
import logoWhite from "../../assets/logo/logo.png"
import "../../App.css"


import useWidth from '../../Hooks/useWidth';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import useDarkmode from '../../Hooks/useDarkMode';
import authSrvice from '../../services/authSrvice';
import { setClientUser } from '../../store/reducer/auth/authCustomerSlice';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/Loading/LoadingSpinner';
import { setCapability } from '../../store/reducer/auth/capabilitySlice';


const SignUpLink = memo(() => {
    return (
        <div className='w-[100%]'>
            <div className='sm:border-2 border-gray-300 rounded-sm p-6 max-w-md mx-auto'>
                <div className='rounded-lg flex flex-col'>
                    {/* <h2 className='text-base'>Don't have an account? <Link to={"/signup"} className='text-blue-500 font-bold'>Sign up</Link></h2> */}
                    {/* <h2 className='text-base'>Back to home<Link to={"/home"} className='text-blue-500 font-bold'>Go To Product Page</Link></h2> */}
                </div>
            </div>
        </div>
    );
});

const Login = ({ companyIdentifier }) => {


    const [companyName, setCompanyName] = useState("");
    console.log("companyName", companyName);
    const [dataLoading, setDataLoading] = useState(true);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [errors, setErrors] = useState([]);

    const { width, breakpoints } = useWidth();
    const [isDark] = useDarkmode();

    const [formData, setFormData] = useState({
        identifier: '',
        password: '',
    });

    const [formDataError, setFormDataError] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleValidation = (name, value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const errors = {};

        switch (name) {
            case 'identifier':
                if (!value) {
                    errors.identifier = 'Email or Phone is required.';
                } else {
                    errors.identifier = '';
                }
                break;
            case 'password':
                if (!value) {
                    errors.password = 'Password is required.';
                } else {
                    errors.password = '';

                }
                break;
            default:
                break;
        }
        return errors;
    };


    function handleChange(e) {
        const { name, value } = e.target;

        // Validate input field
        const error = handleValidation(name, value);
        setFormDataError((prev) => ({ ...prev, ...error }));

        // Update form data
        setFormData((prev) => ({ ...prev, [name]: value }));
    }

    const validateFormData = () => {
        const errors = {};
        let hasError = false;

        Object.keys(formData).forEach((key) => {
            const error = handleValidation(key, formData[key]);
            if (Object.keys(error).length > 0) {
                Object.assign(errors, error);
            }
        });

        const isValid = Object.values(errors).every(value => value === '');
        if (!isValid) {
            hasError = true;
        }

        setFormDataError(errors);
        return hasError;
    };

    async function handleSubmit(e) {
        e.preventDefault();
        setIsSubmitting(true);

        if (validateFormData()) {
            setIsSubmitting(false);
            return;
        }

        const dataObject = {
            identifier: formData?.identifier?.trim(),
            password: formData?.password
        };

        // Optional: Add loading toast
        // const loadingToast = toast.loading('Logging in...');

        try {
            const response = await authSrvice.login(dataObject);
            const data = response?.data?.data;

            localStorage.setItem("SAAS_BILLION_FORMS_customer_token", data?.token?.accessToken);
            localStorage.setItem(
                "SAAS_BILLION_FORMS_customerInfo",
                JSON.stringify(data?.user)
            );
            localStorage.setItem("SAAS_BILLION_FORMS_expiryTime", data?.token?.expiresIn);
            dispatch(setClientUser(data?.user));
            dispatch(setCapability(data?.capability))

            // Update loading toast to success
            toast.success('Login successful!');

            navigate("/dashboard");

        } catch (error) {

            console.error('Login error:', error);

            const errorMessage = error || 'Login failed. Please try again.';
            setErrors([errorMessage]); // Optional: keep in state if you still want to display in UI

        } finally {
            setIsSubmitting(false);
        }
    }


    useEffect(() => {
        getCompanyDetail()
    }, [])

    async function getCompanyDetail() {
        try {
            setDataLoading(true)
            const response = await authSrvice.getCompanyData();
            setCompanyName(response?.data?.data?.name);
            setDataLoading(false)
        } catch (error) {
            setDataLoading(false)
            console.log("error while getting the company detail", error);
        }
    }



    return (

        <>
            {
                dataLoading ?

                    <div className='min-h-screen w-full flex justify-center'>
                        <LoadingSpinner />
                    </div > :

                    <div className=' min-h-screen w-full flex justify-center bg-custom-gradient-sidebar dark:bg-custom-gradient-sidebar-dark '>
                        <div className='w-ful h-fulll sm:w-[100%] md:w-[60%] '>
                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 '>
                                {/* image div */}
                                {
                                    width < breakpoints?.md ? "" :
                                        <div className=' h-full flex items-center justify-center relative'>
                                            <div className='relative'>
                                                <img
                                                    src={logoWhite}
                                                    alt="loginImg2"
                                                    className='relative z-10 w-[80%] sm:w-[60%] md:w-[90%] lg:w-[90%]'
                                                />
                                            </div>
                                        </div>

                                }

                                {/* form div */}
                                <div className='  h-full w-[100%] flex flex-col justify-center items-center   '>
                                    <div className='w-[100%] mb-3'>
                                        <div className='sm:border-2 border-2  border-light rounded-sm p-6  max-w-md mx-auto shadow-md'>
                                            <div className='flex justify-center py-6'>
                                                {/* <img src={logoWhite} alt="Instagram Logo" className='w-36' /> */}
                                                <h2 className='text1 text-xl text-white'>{companyName || "Invalid Company"}</h2>
                                            </div>
                                            <div className='w-[90%]   rounded-lg flex justify-center items-center mx-auto'>
                                                <div className='w-[100%] space-y-4'>

                                                    {errors.length > 0 && (
                                                        <div className="p-4 bg-red-100 rounded-md">
                                                            {errors.map((error, index) => (
                                                                <p key={index} className="text-red-700 text-sm">{error}</p>
                                                            ))}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <input
                                                            name='identifier'
                                                            type="text"
                                                            placeholder='Enter Email or Phone No'
                                                            onChange={handleChange}

                                                            className="w-[100%] text-white bg-transparent p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                        <span className='text-deep-orange-400 text-sm mt-4 pb-0 mb-0'>{formDataError?.identifier}</span>
                                                    </div>
                                                    <div>
                                                        <input
                                                            name='password'
                                                            type="password"
                                                            placeholder='Password'
                                                            className="w-[100%] text-white bg-transparent p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            onChange={handleChange}
                                                        />
                                                        <span className='text-deep-orange-400 text-sm mt-4 pb-0 mb-0'>{formDataError?.password}</span>
                                                    </div>

                                                    <button onClick={handleSubmit}
                                                        disabled={isSubmitting}
                                                        className="w-[100%] p-2 text-sm text-white rounded-lg transition-all duration-300 ease-in-out bg-custom-gradient-button-dark dark:bg-custom-gradient-button-light hover:bg-custom-gradient-button-light dark:hover:bg-custom-gradient-button-dark flex items-center justify-center shadow-lg"
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
                                                            `Log In`
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
            }
        </>


    );
};

export default Login;
