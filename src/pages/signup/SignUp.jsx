import React, { useState, useCallback, memo } from 'react';
import images from '../../constant/images';
import logoWhite from "../../assets/logo/instgram_logo_white.png";
import useWidth from '../../Hooks/useWidth';
import { Link } from 'react-router-dom';
import useDarkmode from '../../Hooks/useDarkMode';
import authSrvice from '../../services/authSrvice';
import debounce from 'lodash.debounce';




const SignUp = () => {
  const { width, breakpoints } = useWidth();
  const [isDark] = useDarkmode();

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
  });

  const [formDataError, setFormDataError] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleValidation = (name, value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const errors = {};

    switch (name) {
      case 'email':
        if (!value) {
          errors.email = 'Email is required.';
        } else if (!emailRegex.test(value)) {
          errors.email = 'Enter a valid email.';
        } else {
          errors.email = '';
        }
        break;
      case 'firstName':
        if (!value) {
          errors.firstName = 'First Name is required.';
        } else {
          errors.firstName = '';
        }
        break;
      case 'lastName':
        if (!value) {
          errors.lastName = 'Last Name is required.';
        } else {
          errors.lastName = '';

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
        hasError = true;
        Object.assign(errors, error);
      }
    });

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

    try {
      await authSrvice.signUp(formData);
      // Notify success, redirect, or clear form after successful signup
    } catch (error) {
      console.error('Signup error:', error);
      // Show user-friendly error messages
    } finally {
      setIsSubmitting(false);
    }
  }

  
const LoginLink = memo(() => {
  return (
    <div className='w-[100%] '>
      <div className='sm:border-2 border-gray-300 rounded-sm p-6  max-w-md mx-auto'>
        <div className='  rounded-lg flex   '>
          <h2>Already have an account? <Link to={"/login"} className='text-blue-500 font-bold'>Log in </Link> </h2>
        </div>
      </div>
    </div>
  );
},[]);

  return (
    <div className=' min-h-screen w-full flex justify-center '>
      <div className='w-ful h-fulll sm:w-[100%] md:w-[60%] '>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 '>
          {/* image div */}
          {
            width < breakpoints?.md ? "" :
              <div className=' h-full flex items-center justify-center relative'>
                <div className='relative'>
                  <img
                    src={images?.loginImage2}
                    alt="loginImg2"
                    className='relative z-10 w-[80%] sm:w-[60%] md:w-[90%] lg:w-[90%]'
                  />
                </div>
              </div>

          }

          {/* form div */}
          <div className='  h-full w-[100%] flex flex-col justify-center items-center  '>

            <div className='w-[100%] mb-3'>

              <div className='sm:border-2  border-gray-300 rounded-sm p-6  max-w-md mx-auto'>
                <div className='flex justify-center py-6'>
                  <img src={isDark ? logoWhite : images?.instaLogo} alt="Instagram Logo" className='w-36' />

                </div>

                <div className='w-[90%]   rounded-lg flex justify-center items-center mx-auto'>
                  <div className='w-[100%] space-y-4'>
                    <div>
                      <input
                        name="email"
                        type="text"
                        value={formData?.email}
                        placeholder='Email'
                        className={`w-[100%] ${isDark ? "bg-mediumDark text-light" : "border-2 text-dark"}  p-2  rounded focus:outline-none focus:ring-2 focus:ring-cyan-100`}
                        onChange={handleChange}
                      />
                      <span className='text-deep-orange-400 text-sm mt-4 pb-0 mb-0'>{formDataError?.email}</span>
                    </div>

                    <div>
                      <input
                        name="firstName"
                        type="text"
                        value={formData?.firstName}
                        placeholder='First Name'
                        className={`w-[100%] ${isDark ? "bg-mediumDark text-light" : "border-2 text-dark"}  p-2  rounded focus:outline-none focus:ring-2 focus:ring-cyan-100`}
                        onChange={handleChange}
                      />
                      <span className='text-deep-orange-400 text-sm mt-4 pb-0 mb-0'>{formDataError?.firstName}</span>
                    </div>

                    <div>
                      <input
                        name="lastName"
                        type="text"
                        value={formData?.lastName}
                        placeholder='Last Name'
                        onChange={handleChange}
                        className={`w-[100%] ${isDark ? "bg-mediumDark text-light" : "border-2 text-dark"}  p-2  rounded focus:outline-none focus:ring-2 focus:ring-cyan-100`}
                      />
                      <span className='text-deep-orange-400 text-sm mt-4 pb-0 mb-0'>{formDataError?.lastName}</span>
                    </div>

                    <div>
                      <input
                        name='password'
                        type="password"
                        placeholder='Password'
                        value={formData?.password}
                        onChange={handleChange}
                        className={`w-[100%] ${isDark ? "bg-mediumDark text-light" : "border-2 text-dark"}  p-2  rounded focus:outline-none focus:ring-2 focus:ring-cyan-100`}
                      />
                      <span className='text-deep-orange-400 text-sm mt-4 pb-0 mb-0'>{formDataError?.password}</span>
                    </div>

                    <button onClick={handleSubmit} className='bg-cyan-500 text-white w-[100%] py-2 rounded hover:bg-cyan-600 transition duration-200'>
                      Sign up
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <LoginLink />
            

          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
