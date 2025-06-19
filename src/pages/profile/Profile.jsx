import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Hamberger from '../../components/Hamberger/Hamberger';

// Slide-up animation
const slideUp = (delay) => ({
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1], delay },
  },
});

const Profile = () => {

  const { clientUser: currentUser, isAuth: isLoggedIn } = useSelector((state) => state?.authCustomerSlice);

  console.log("currentUser", currentUser);


  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    meetingLink: '',
  });
  const [formErrors, setFormErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    meetingLink: '',
  });
  const [apiStatus, setApiStatus] = useState({ message: '', type: '' });

  // Fetch profile data on mount
  useEffect(() => {
    const fetchProfile = async (id) => {
      try {
        console.log("comning here");

        const authToken = localStorage.getItem("SAAS_BILLION_FORMS_customer_token");
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/get/profile/${id}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        console.log("response", response);



        setProfileData({
          firstName: response.data?.data?.data.firstName || '',
          lastName: response.data?.data?.data.lastName || '',
          email: response.data?.data?.data.email || '',
          phone: response.data?.data?.data.phone || '',
          password: '',
          meetingLink: response.data?.data?.data.meetingLink || '',
        });
      } catch (error) {
        setApiStatus({
          message: 'Failed to load profile. Please try again.',
          type: 'error',
        });
      }
    };

    if (currentUser && currentUser?.id) {

      fetchProfile(currentUser?.id);


    }


  }, [currentUser]);

  // Handle input changes with validation
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;

    setFormErrors((prev) => ({
      ...prev,
      [name]: (() => {
        if (name === 'firstName' || name === 'lastName')
          return value ? '' : `${name === 'firstName' ? 'First' : 'Last'} Name is required.`;
        if (name === 'email') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return value ? (emailRegex.test(value) ? '' : 'Invalid email format.') : 'Email is required.';
        }
        if (name === 'phone') {
          const phoneRegex = /^\d{10}$/;
          return value ? (phoneRegex.test(value) ? '' : 'Phone number must be 10 digits.') : 'Phone number is required.';
        }
        if (name === 'password')
          return value
            ? value.length >= 8
              ? ''
              : 'Password must be at least 8 characters.'
            : '';
        if (name === 'meetingLink') {
          const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
          return value ? (urlRegex.test(value) ? '' : 'Invalid URL format.') : '';
        }
        return '';
      })(),
    }));

    setProfileData((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Validate form before submission
  const validateForm = useCallback(() => {
    const errors = {};
    let errorCount = 0;

    if (!profileData.firstName) {
      errors.firstName = 'First Name is required.';
      errorCount++;
    }
    if (!profileData.lastName) {
      errors.lastName = 'Last Name is required.';
      errorCount++;
    }
    if (!profileData.email) {
      errors.email = 'Email is required.';
      errorCount++;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
      errors.email = 'Invalid email format.';
      errorCount++;
    }
    if (!profileData.phone) {
      errors.phone = 'Phone number is required.';
      errorCount++;
    } else if (!/^\d{10}$/.test(profileData.phone)) {
      errors.phone = 'Phone number must be 10 digits.';
      errorCount++;
    }
    if (profileData.password && profileData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters.';
      errorCount++;
    }

    setFormErrors(errors);
    return errorCount === 0;
  }, [profileData]);

  // Handle profile form submission
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!validateForm()) return;

      try {
        const updateData = {
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          email: profileData.email,
          phone: profileData.phone,
        };
        if (profileData.password) updateData.password = profileData.password;

        await axios.patch('/api/profile', updateData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setApiStatus({ message: 'Profile updated successfully!', type: 'success' });
        setIsEditing(false);
        setProfileData((prev) => ({ ...prev, password: '' }));
      } catch (error) {
        setApiStatus({
          message: error.response?.data?.message || 'Failed to update profile.',
          type: 'error',
        });
      }
    },
    [profileData, validateForm]
  );

  // Handle Google Meeting link submission
  const handleMeetingLinkSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (profileData.meetingLink && !/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(profileData.meetingLink)) {
        setFormErrors((prev) => ({ ...prev, meetingLink: 'Invalid URL format.' }));
        return;
      }

      try {
        await axios.patch(
          '/api/profile/meeting-link',
          { meetingLink: profileData.meetingLink },
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        setApiStatus({ message: 'Meeting link updated successfully!', type: 'success' });
      } catch (error) {
        setApiStatus({
          message: error.response?.data?.message || 'Failed to update meeting link.',
          type: 'error',
        });
      }
    },
    [profileData.meetingLink]
  );

  // Toggle edit mode
  const toggleEdit = () => {
    setIsEditing(!isEditing);
    setFormErrors({});
    setApiStatus({ message: '', type: '' });
    if (isEditing) {
      setProfileData((prev) => ({ ...prev, password: '' }));
    }
  };

  return (
    <>
      <style>
        {`
          .profile-container {
            width: 100%;
          }
          .form-input {
            transition: border-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
          }
          .form-input:focus {
            border-color: #100146;
            box-shadow: 0 0 0 3px rgba(16, 1, 70, 0.1);
            outline: none;
          }
          .status-message {
            animation: fadeIn 0.5s ease-in-out;
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}
      </style>
      <div className="flex flex-col md:mx-4  mx-2     mt-3 min-h-screen bg-light dark:bg-dark">
        <Hamberger text={`View / Profile`} />

        <motion.div
          className="profile-container flex justify-center py-2 sm:py-2 px-4 sm:px-6 lg:px-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={slideUp(0.2)}
        >
          <div className="w-[100%] mb-20  bg-cardBgLight dark:bg-cardBgDark shadow-lg rounded-lg p-6">
            {apiStatus.message && (
              <div
                className={`status-message mb-4 p-3 rounded-xl text-center text-sm sm:text-base ${apiStatus.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
              >
                {apiStatus.message}
              </div>
            )}
              {/* Profile View/Edit Section */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h2
                    className="text-xl sm:text-2xl font-semibold text-[#100146] dark:text-white"
                    style={{ fontFamily: 'GreycliffCF, sans-serif' }}
                  >
                    Personal Information
                  </h2>
                  <button
                    onClick={toggleEdit}
                    className="w-auto p-2 text-sm text-white rounded-lg transition-all duration-300 ease-in-out 
                bg-custom-gradient-button-dark dark:bg-custom-gradient-button-light 
                 hover:bg-custom-gradient-button-light dark:hover:bg-custom-gradient-button-dark 
                 flex items-center justify-center shadow-lg"
                    style={{ backgroundColor: '#100146', fontFamily: 'GreycliffCF, sans-serif' }}
                  >
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                  </button>
                </div>
                {isEditing ? (
                  <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="flex flex-col">
                      <label
                        htmlFor="firstName"
                        className="text-sm sm:text-base text-[#100146] dark:text-white mb-1"
                        style={{ fontFamily: 'GreycliffCF, sans-serif' }}
                      >
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={profileData.firstName}
                        onChange={handleChange}
                        className="w-[100%]  bg-transparent p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter First Name..."
                        aria-label="First Name"
                        aria-describedby={formErrors.firstName ? 'firstName-error' : undefined}
                      />
                      {formErrors.firstName && (
                        <p
                          id="firstName-error"
                          className="text-red-500 text-xs sm:text-sm mt-1"
                          style={{ fontFamily: 'GreycliffCF, sans-serif' }}
                        >
                          {formErrors.firstName}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <label
                        htmlFor="lastName"
                        className="text-sm sm:text-base text-[#100146] dark:text-white mb-1"
                        style={{ fontFamily: 'GreycliffCF, sans-serif' }}
                      >
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={profileData.lastName}
                        onChange={handleChange}
                        className="w-[100%]  bg-transparent p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter Last Name..."
                        aria-label="Last Name"
                        aria-describedby={formErrors.lastName ? 'lastName-error' : undefined}
                      />
                      {formErrors.lastName && (
                        <p
                          id="lastName-error"
                          className="text-red-500 text-xs sm:text-sm mt-1"
                          style={{ fontFamily: 'GreycliffCF, sans-serif' }}
                        >
                          {formErrors.lastName}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <label
                        htmlFor="email"
                        className="text-sm sm:text-base text-[#100146] dark:text-white mb-1"
                        style={{ fontFamily: 'GreycliffCF, sans-serif' }}
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleChange}
                        className="w-[100%]  bg-transparent p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter Email..."
                        aria-label="Email"
                        aria-describedby={formErrors.email ? 'email-error' : undefined}
                      />
                      {formErrors.email && (
                        <p
                          id="email-error"
                          className="text-red-500 text-xs sm:text-sm mt-1"
                          style={{ fontFamily: 'GreycliffCF, sans-serif' }}
                        >
                          {formErrors.email}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <label
                        htmlFor="phone"
                        className="text-sm sm:text-base text-[#100146] dark:text-white mb-1"
                        style={{ fontFamily: 'GreycliffCF, sans-serif' }}
                      >
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleChange}
                        className="w-[100%]  bg-transparent p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter Phone Number..."
                        aria-label="Phone Number"
                        aria-describedby={formErrors.phone ? 'phone-error' : undefined}
                      />
                      {formErrors.phone && (
                        <p
                          id="phone-error"
                          className="text-red-500 text-xs sm:text-sm mt-1"
                          style={{ fontFamily: 'GreycliffCF, sans-serif' }}
                        >
                          {formErrors.phone}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col sm:col-span-2">
                      <label
                        htmlFor="password"
                        className="text-sm sm:text-base text-[#100146] dark:text-white mb-1"
                        style={{ fontFamily: 'GreycliffCF, sans-serif' }}
                      >
                        Password (Optional)
                      </label>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        value={profileData.password}
                        onChange={handleChange}
                        className="w-[100%]  bg-transparent p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter New Password..."
                        aria-label="Password"
                        aria-describedby={formErrors.password ? 'password-error' : undefined}
                      />
                      {formErrors.password && (
                        <p
                          id="password-error"
                          className="text-red-500 text-xs sm:text-sm mt-1"
                          style={{ fontFamily: 'GreycliffCF, sans-serif' }}
                        >
                          {formErrors.password}
                        </p>
                      )}
                    </div>
                    <div className="sm:col-span-2 flex justify-end gap-4 mt-4">
                      <button
                        type="submit"
                        className="w-auto p-2 text-sm text-white rounded-lg transition-all duration-300 ease-in-out 
                bg-custom-gradient-button-dark dark:bg-custom-gradient-button-light 
                 hover:bg-custom-gradient-button-light dark:hover:bg-custom-gradient-button-dark 
                 flex items-center justify-center shadow-lg"
                        style={{ backgroundColor: '#100146', fontFamily: 'GreycliffCF, sans-serif' }}
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <p
                        className="text-sm sm:text-base text-[#100146] dark:text-white/60"
                        style={{ fontFamily: 'GreycliffCF, sans-serif' }}
                      >
                        First Name
                      </p>
                      <p
                        className="text-sm sm:text-base text-[#100146] dark:text-white"
                        style={{ fontFamily: 'GreycliffCF, sans-serif' }}
                      >
                        {profileData.firstName || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p
                        className="text-sm sm:text-base text-[#100146] dark:text-white/60"
                        style={{ fontFamily: 'GreycliffCF, sans-serif' }}
                      >
                        Last Name
                      </p>
                      <p
                        className="text-sm sm:text-base text-[#100146] dark:text-white"
                        style={{ fontFamily: 'GreycliffCF, sans-serif' }}
                      >
                        {profileData.lastName || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p
                        className="text-sm sm:text-base text-[#100146] dark:text-white/60"
                        style={{ fontFamily: 'GreycliffCF, sans-serif' }}
                      >
                        Email
                      </p>
                      <p
                        className="text-sm sm:text-base text-[#100146] dark:text-white"
                        style={{ fontFamily: 'GreycliffCF, sans-serif' }}
                      >
                        {profileData.email || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p
                        className="text-sm sm:text-base text-[#100146] dark:text-white/60"
                        style={{ fontFamily: 'GreycliffCF, sans-serif' }}
                      >
                        Phone Number
                      </p>
                      <p
                        className="text-sm sm:text-base text-[#100146] dark:text-white"
                        style={{ fontFamily: 'GreycliffCF, sans-serif' }}
                      >
                        {profileData.phone || 'N/A'}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Google Meeting Link Section */}
              <div>
                <h2
                  className="text-xl sm:text-2xl font-semibold text-[#100146] dark:text-white mb-4"
                  style={{ fontFamily: 'GreycliffCF, sans-serif' }}
                >
                  Meeting Link
                </h2>
                {isEditing ? (
                  <form onSubmit={handleMeetingLinkSubmit} className="space-y-4">
                    <div className="flex flex-col">
                      <label
                        htmlFor="meetingLink"
                        className="text-sm sm:text-base text-[#100146] dark:text-white mb-1"
                        style={{ fontFamily: 'GreycliffCF, sans-serif' }}
                      >
                        Meeting Link (Optional)
                      </label>
                      <input
                        type="url"
                        id="meetingLink"
                        name="meetingLink"
                        value={profileData.meetingLink}
                        onChange={handleChange}
                        className="w-[100%]  bg-transparent p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter Google Meeting Link..."
                        aria-label="Google Meeting Link"
                        aria-describedby={formErrors.meetingLink ? 'meetingLink-error' : undefined}
                      />
                      {formErrors.meetingLink && (
                        <p
                          id="meetingLink-error"
                          className="text-red-500 text-xs sm:text-sm mt-1"
                          style={{ fontFamily: 'GreycliffCF, sans-serif' }}
                        >
                          {formErrors.meetingLink}
                        </p>
                      )}
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="w-auto p-2 text-sm text-white rounded-lg transition-all duration-300 ease-in-out 
                bg-custom-gradient-button-dark dark:bg-custom-gradient-button-light 
                 hover:bg-custom-gradient-button-light dark:hover:bg-custom-gradient-button-dark 
                 flex items-center justify-center shadow-lg"
                        style={{ backgroundColor: '#100146', fontFamily: 'GreycliffCF, sans-serif' }}
                      >
                        Save Link
                      </button>
                    </div>
                  </form>
                ) : (
                  <div>
                    <p
                      className="text-sm sm:text-base text-[#100146] dark:text-white/60"
                      style={{ fontFamily: 'GreycliffCF, sans-serif' }}
                    >
                      Meeting Link
                    </p>
                    <p
                      className="text-sm sm:text-base text-[#100146] dark:text-white break-all"
                      style={{ fontFamily: 'GreycliffCF, sans-serif' }}
                    >
                      {profileData.meetingLink ? (
                        <a
                          href={profileData.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#100146] dark:text-white hover:underline"
                        >
                          {profileData.meetingLink}
                        </a>
                      ) : (
                        'No meeting link provided'
                      )}
                    </p>
                  </div>
                )}
              </div>
          </div>
        </motion.div>

      </div>


    </>
  );
};

export default Profile;