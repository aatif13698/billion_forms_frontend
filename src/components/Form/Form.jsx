import React, { useState, useCallback } from 'react';
import axios from 'axios';
import dropDown from '../../assets/down-arrow.png';

function Form() {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        message: '',
    });
    const [formDataError, setFormDataError] = useState({
        name: '',
        phone: '',
        email: '',
        message: '',
    });

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;

        // Validation
        setFormDataError((prev) => ({
            ...prev,
            [name]: (() => {
                if (name === 'name') return value ? '' : 'Name is required.';
                if (name === 'phone') {
                    const phoneRegex = /^\d{10}$/;
                    return value ? (phoneRegex.test(value) ? '' : 'Phone Number is not valid.') : 'Phone Number is required.';
                }
                if (name === 'email') {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    return value ? (emailRegex.test(value) ? '' : 'Email is not valid.') : 'Email is required.';
                }
                if (name === 'message') return value ? '' : 'Message is required.';
                return '';
            })(),
        }));

        setFormData((prev) => ({ ...prev, [name]: value }));
    }, []);

    const validate = useCallback(() => {
        const errors = {};
        let errorCount = 0;

        if (!formData.name) {
            errors.name = 'Name is required.';
            errorCount++;
        }
        if (!formData.phone) {
            errors.phone = 'Phone Number is required.';
            errorCount++;
        } else if (!/^\d{10}$/.test(formData.phone)) {
            errors.phone = 'Phone Number is not valid.';
            errorCount++;
        }
        if (!formData.email) {
            errors.email = 'Email is required.';
            errorCount++;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = 'Email is not valid.';
            errorCount++;
        }
        if (!formData.message) {
            errors.message = 'Message is required.';
            errorCount++;
        }

        setFormDataError(errors);
        return errorCount > 0;
    }, [formData]);

    const handleBookDemo = useCallback(
        async (e) => {
            e.preventDefault();

            if (validate()) {
                return;
            }

            try {
                const dataObject = {
                    name: formData.name,
                    phone_number: formData.phone,
                    email: formData.email,
                    message: formData.message,
                };

                const response = await axios.post('/api/w-site/insert', dataObject);
                console.log('Response from booking demo:', response);

                setFormData({
                    name: '',
                    phone: '',
                    email: '',
                    message: '',
                });
                setFormDataError({
                    name: '',
                    phone: '',
                    email: '',
                    message: '',
                });
                // toast.success(response.data.message);
            } catch (error) {
                console.error('Error while booking free demo:', error.response?.data || error.message);
            }
        },
        [formData, validate]
    );

    return (
        <>
            <style>
                {`
                    .form-container {
                        background: #ffffff;
                        border-radius: 1.5rem;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                        width: 100%;
                    }
                    .form-input, .form-textarea {
                        transition: border-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
                    }
                    .form-input:focus, .form-textarea:focus {
                        border-color: #100146;
                        box-shadow: 0 0 0 3px rgba(16, 1, 70, 0.1);
                        outline: none;
                    }
                `}
            </style>
            <div className="form-container  px-6 sm:px-8 py-8 sm:py-10">
                <h1
                    className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#100146]"
                    style={{ fontFamily: 'DMSerifDisplay, serif' }}
                >
                    Request Demo
                </h1>
                <form className="mt-6 space-y-3 sm:space-y-3" onSubmit={handleBookDemo}>
                    <div className="flex flex-col">
                        <label
                            htmlFor="name"
                            className="text-sm sm:text-base text-[#100146] mb-1"
                            style={{ fontFamily: 'GreycliffCF, sans-serif' }}
                        >
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="form-input w-[100%] border-2 border-gray-200 rounded-xl p-2 sm:p-3 text-sm sm:text-base text-[#100146] bg-transparent placeholder-[#100146]/60"
                            placeholder="Enter Name..."
                            aria-label="Full Name"
                            aria-describedby={formDataError.name ? 'name-error' : undefined}
                        />
                        {formDataError.name && (
                            <p
                                id="name-error"
                                className="text-red-500 text-xs sm:text-sm mt-1"
                                style={{ fontFamily: 'GreycliffCF, sans-serif' }}
                            >
                                {formDataError.name}
                            </p>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <label
                            htmlFor="phone"
                            className="text-sm sm:text-base text-[#100146] mb-1"
                            style={{ fontFamily: 'GreycliffCF, sans-serif' }}
                        >
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="form-input w-[100%] border-2 border-gray-200 rounded-xl p-2 sm:p-3 text-sm sm:text-base text-[#100146] bg-transparent placeholder-[#100146]/60"
                            placeholder="Enter Phone Number..."
                            aria-label="Phone Number"
                            aria-describedby={formDataError.phone ? 'phone-error' : undefined}
                        />
                        {formDataError.phone && (
                            <p
                                id="phone-error"
                                className="text-red-500 text-xs sm:text-sm mt-1"
                                style={{ fontFamily: 'GreycliffCF, sans-serif' }}
                            >
                                {formDataError.phone}
                            </p>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <label
                            htmlFor="email"
                            className="text-sm sm:text-base text-[#100146] mb-1"
                            style={{ fontFamily: 'GreycliffCF, sans-serif' }}
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="form-input w-[100%] border-2 border-gray-200 rounded-xl p-2 sm:p-3 text-sm sm:text-base text-[#100146] bg-transparent placeholder-[#100146]/60"
                            placeholder="Enter Email Id..."
                            aria-label="Email"
                            aria-describedby={formDataError.email ? 'email-error' : undefined}
                        />
                        {formDataError.email && (
                            <p
                                id="email-error"
                                className="text-red-500 text-xs sm:text-sm mt-1"
                                style={{ fontFamily: 'GreycliffCF, sans-serif' }}
                            >
                                {formDataError.email}
                            </p>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <label
                            htmlFor="message"
                            className="text-sm sm:text-base text-[#100146] mb-1"
                            style={{ fontFamily: 'GreycliffCF, sans-serif' }}
                        >
                            Message
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            className="form-textarea w-[100%] border-2 border-gray-200 rounded-xl p-3 sm:p-4 text-sm sm:text-base text-[#100146] bg-transparent placeholder-[#100146]/60 resize-y min-h-[90px]"
                            placeholder="Write A Message..."
                            aria-label="Message"
                            aria-describedby={formDataError.message ? 'message-error' : undefined}
                        />
                        {formDataError.message && (
                            <p
                                id="message-error"
                                className="text-red-500 text-xs sm:text-sm mt-1"
                                style={{ fontFamily: 'GreycliffCF, sans-serif' }}
                            >
                                {formDataError.message}
                            </p>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="w-[100%] py-3 sm:py-4 rounded-xl text-white text-sm sm:text-base font-semibold hover:bg-[#1a0266] active:scale-95 transition-all duration-300"
                        style={{ backgroundColor: '#100146', fontFamily: 'GreycliffCF, sans-serif' }}
                    >
                        Request a Free Demo
                    </button>
                </form>
            </div>
        </>
    );
}

export default Form;