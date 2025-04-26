import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Hamberger from '../../components/Hamberger/Hamberger';
import { FaEnvelope, FaExclamationCircle, FaMapMarkerAlt, FaPhone, FaRegEdit } from 'react-icons/fa';
import Select from 'react-select';
import customFieldService from '../../services/customFieldService';
import toast from 'react-hot-toast';
import { RxCross2 } from "react-icons/rx";
import { RxValueNone } from "react-icons/rx";
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // Optional: default CSS styling
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import "../../App.css"


function CustomField() {

    const navigate = useNavigate();
    const location = useLocation();
    const data = location?.state;

    console.log("aatif", data);


    // custom field handling
    const [formData, setFormData] = useState({
        name: '',
        label: '',
        type: '',
        options: [],
        isRequired: false,
        placeholder: '',
        validation: { regex: '', min: '', max: '', maxLength: '', fileTypes: [], maxSize: '' },
        gridConfig: { span: 12, order: 0 }
    });

    const [errors, setErrors] = useState([]);
    const [optionInput, setOptionInput] = useState('');
    const [fileTypeInput, setFileTypeInput] = useState('');
    const [createdFields, setCreatedFields] = useState([]); // Store fields created in this session
    const [existingFields, setExistingFields] = useState([]); // Store fields fetched from API
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [refreshCount, setRefreshCount] = useState(0)

    const fieldTypes = [
        'text', 'number', 'email', 'date', 'select', 'checkbox',
        'textarea', 'multiselect', 'datepicker', 'timepicker', 'color', 'hyperlink', 'file'
    ].map(type => ({ value: type, label: type.charAt(0).toUpperCase() + type.slice(1) }));

    const commonFileTypes = [
        { value: 'image/jpeg', label: 'JPEG Image (.jpg, .jpeg)' },
        { value: 'image/png', label: 'PNG Image (.png)' },
        { value: 'image/gif', label: 'GIF Image (.gif)' },
        { value: 'image/webp', label: 'WebP Image (.webp)' },
        { value: 'image/bmp', label: 'BMP Image (.bmp)' },
        { value: 'image/tiff', label: 'TIFF Image (.tiff, .tif)' },
        { value: 'image/svg+xml', label: 'SVG Image (.svg)' },
        { value: 'image/heic', label: 'HEIC Image (.heic)' },
        { value: 'image/avif', label: 'AVIF Image (.avif)' },
        { value: 'application/pdf', label: 'PDF (.pdf)' },
        { value: 'text/csv', label: 'CSV (.csv)' },
        { value: 'application/vnd.ms-excel', label: 'Excel (.xls)' },
        { value: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', label: 'Excel (.xlsx)' },
        { value: 'application/msword', label: 'Word (.doc)' },
        { value: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', label: 'Word (.docx)' },
        { value: 'text/plain', label: 'Plain Text (.txt)' },
        { value: 'application/json', label: 'JSON (.json)' },
        { value: 'application/zip', label: 'ZIP Archive (.zip)' },
        { value: 'audio/mpeg', label: 'MP3 Audio (.mp3)' },
        { value: 'video/mp4', label: 'MP4 Video (.mp4)' }
    ];

    const customStyles = {
        control: (provided) => ({
            ...provided,
            backgroundColor: "transparent",
            borderColor: "#ccc",
        }),
        input: (provided) => ({
            ...provided,
            backgroundColor: "transparent",
            color: "#000",
        }),
        singleValue: (provided) => ({
            ...provided,
            color: "#000",
        }),
        menu: (provided) => ({
            ...provided,
            backgroundColor: "#333", // Dropdown background color
        }),
        option: (provided, { isFocused, isSelected }) => ({
            ...provided,
            backgroundColor: isSelected ? "#555" : isFocused ? "#444" : "transparent", // Option background color
            color: isSelected ? "#fff" : "#ddd", // Text color for options
            cursor: "pointer",
        })
    };


    // Fetch existing fields on component mount
    useEffect(() => {
        const fetchFields = async () => {
            try {
                const response = await customFieldService.getCustomForms(data?.organization?.userId, data?.session?._id);
                setExistingFields(response?.data?.data?.data);
                setCreatedFields([])
            } catch (error) {
                setErrors(['Failed to fetch existing fields']);
            }
        };
        fetchFields();
    }, [refreshCount]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: type === 'checkbox' ? checked : value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    const handleSelectChange = (name, selectedOption) => {
        setFormData(prev => ({
            ...prev,
            [name]: selectedOption ? selectedOption.value : ''
        }));
    };

    const handleAddOption = () => {
        if (optionInput.trim()) {
            setFormData(prev => ({
                ...prev,
                options: [...prev.options, optionInput.trim()]
            }));
            setOptionInput('');
        }
    };

    const handleRemoveOption = (index) => {
        setFormData(prev => ({
            ...prev,
            options: prev.options.filter((_, i) => i !== index)
        }));
    };

    const handleAddFileType = () => {
        if (fileTypeInput.trim() && !formData.validation.fileTypes.includes(fileTypeInput.trim())) {
            setFormData(prev => ({
                ...prev,
                validation: {
                    ...prev.validation,
                    fileTypes: [...prev.validation.fileTypes, fileTypeInput.trim()]
                }
            }));
            setFileTypeInput('');
        }
    };

    const handleRemoveFileType = (index) => {
        setFormData(prev => ({
            ...prev,
            validation: {
                ...prev.validation,
                fileTypes: prev.validation.fileTypes.filter((_, i) => i !== index)
            }
        }));
    };

    const handleFileTypesChange = (selectedOptions) => {
        setFormData(prev => ({
            ...prev,
            validation: {
                ...prev.validation,
                fileTypes: selectedOptions ? selectedOptions.map(opt => opt.value) : []
            }
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]); // Clear previous errors
        const payload = {
            name: formData.name,
            label: formData.label,
            type: formData.type,
            options: formData.options.length > 0 ? formData.options : undefined,
            isRequired: formData.isRequired,
            placeholder: formData.placeholder || undefined,
            validation: {
                regex: formData.validation.regex || undefined,
                min: formData.validation.min ? Number(formData.validation.min) : undefined,
                max: formData.validation.max ? Number(formData.validation.max) : undefined,
                maxLength: formData.validation.maxLength ? Number(formData.validation.maxLength) : undefined,
                fileTypes: formData.validation.fileTypes.length > 0 ? formData.validation.fileTypes : undefined,
                maxSize: formData.validation.maxSize ? Number(formData.validation.maxSize) : undefined
            },
            gridConfig: {
                span: Number(formData.gridConfig.span),
                order: Number(formData.gridConfig.order)
            },
            userId: data?.organization?.userId,
            sessionId: data?.session?._id
        };
        try {
            setIsSubmitting(true);
            const response = await customFieldService.createCustomForm(payload);
            console.log("Response:", response);
            const newField = response.data?.data;
            if (!newField) {
                throw new Error("No field data returned from the server");
            }
            // Add the new field to the createdFields array
            setCreatedFields(prev => [...prev, newField]);
            // Show success toast
            toast.success('Field created successfully!');
            // Reset form
            setFormData({
                name: '',
                label: '',
                type: '',
                options: [],
                isRequired: false,
                placeholder: '',
                validation: { regex: '', min: '', max: '', maxLength: '', fileTypes: [], maxSize: '' },
                gridConfig: { span: 12, order: 0 }
            });
            setIsSubmitting(false);
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Field Created Successfully",
                showConfirmButton: false,
                timer: 1500,
                toast: true,
                customClass: {
                    popup: 'my-toast-size'
                }
            });
        } catch (error) {
            setIsSubmitting(false);
            console.log("Error creating field:", error);
            const errorMessage = error || 'An error occurred while creating field';
            setErrors([errorMessage]); // Optional: keep in state if you still want to display in UI
        }
    };

    // Render a field preview (simplified for display purposes)
    const renderFieldPreview = (field) => {
        const baseStyles = "w-[100%] bg-transparent   p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500";

        switch (field.type) {
            case 'text':
            case 'number':
            case 'email':
            case 'hyperlink':
                return (
                    <input
                        disabled={true}
                        type={field?.type}
                        placeholder={field?.placeholder}

                        className={baseStyles}
                    />
                );
            case 'textarea':
                return (
                    <textarea
                        disabled={true}

                        placeholder={field?.placeholder}

                        className={`${baseStyles} min-h-[100px]`}
                    />
                );
            case 'select':
            case 'multiselect':
                return (
                    <select
                        disabled={true}

                        className={baseStyles}>
                        <option value="">{field?.placeholder || 'Select an option'}</option>
                        {field?.options?.map((opt, idx) => (
                            <option key={idx} value={opt}>{opt}</option>
                        ))}
                    </select>
                );
            case 'checkbox':
                return (
                    <input
                        disabled={true}

                        type="checkbox"

                        className="h-5 w-5 text-blue-600"
                    />
                );
            case 'file':
                return (
                    <input
                        type="file"
                        disabled={true}

                        accept={field?.validation?.fileTypes?.join(',')}
                        className={baseStyles}
                    />
                );
            case 'date':
                return (
                    <input
                        type="date"
                        disabled={true}

                        placeholder={field?.placeholder || 'Select a date'}

                        className={baseStyles}
                    />
                );
            case 'timepicker':
                return (
                    <input
                        type="time"
                        disabled={true}

                        placeholder={field?.placeholder || 'Select a time'}

                        className={baseStyles}
                    />
                );
            case 'color':
                return (
                    <input
                        type="color"
                        disabled={true}


                        className={`${baseStyles} h-10 cursor-not-allowed`}
                    />
                );
            default:
                return <div className={baseStyles}>{field?.type} (Preview not available)</div>;
        }
    };

    async function handleDeleteField(id) {
        try {
            Swal.fire({
                title: "Are you sure you want to delete this field?",
                icon: "question",
                showCancelButton: true,
                confirmButtonText: "Yes",
                denyButtonText: `Cancel`,
                customClass: {
                    popup: 'my-delete-alert'
                }
            }
            ).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    finalDeleteField(id)
                }
            });

        } catch (error) {
            console.log("error while deleting the field", error);
        }
    }

    async function finalDeleteField(id) {
        try {

            const userId = data?.session?.clientId;
            const sessionId = data?.session?._id;
            const fieldId = id;

            const response = await customFieldService.deleteCustomField(userId, sessionId, fieldId);
            console.log("response", response);
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Deleted Successfully",
                showConfirmButton: false,
                timer: 1500,
                toast: true,
                customClass: {
                    popup: 'my-toast-size'
                }
            });
            setRefreshCount((prev) => prev + 1);

        } catch (error) {
            console.log("error while deleting the field", error);

        }
    }


    return (
        <div className="flex flex-col md:mx-4 mx-2 mt-3 min-h-screen bg-light dark:bg-dark">
            <Hamberger text="Organization / Company Name / Form Fields" />

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
                                {`${data?.organization?.name}-${data?.session?.for}(${data?.session?.name})`}
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

            <div className="w-[100%] mb-4 bg-cardBgLight dark:bg-cardBgDark shadow-lg rounded-lg p-6 ">
                <div className='flex  md:flex-row flex-col md:justify-between justify-start md:items-center  mb-4'>
                    <h3 className="text-xl font-bold text-formHeadingLight mb-2  dark:text-formHeadingDark">Custom Fields Preview</h3>
                    <div>
                        <button
                            // disabled={isSubmitting}
                            onClick={() => navigate("/list/adjustOrder", { state: { organization: data?.organization, session: data?.session, } })}
                            className="w-auto p-2 text-sm text-white rounded-lg transition-all duration-300 ease-in-out 
            bg-custom-gradient-button-dark dark:bg-custom-gradient-button-light 
             hover:bg-custom-gradient-button-light dark:hover:bg-custom-gradient-button-dark 
             flex items-center justify-center shadow-lg">

                            Adjust Order

                        </button>

                    </div>

                </div>
                {
                    [...existingFields, ...createdFields].length > 0 ?
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
                            {[...existingFields, ...createdFields]
                                .sort((a, b) => a.gridConfig?.order - b.gridConfig?.order)
                                .map((field, index) => {
                                    return (
                                        <div
                                            className='relative'
                                            key={index}
                                            style={{ order: field?.gridConfig?.order }}
                                        >

                                            {
                                                field?.isDeleteAble ?
                                                    <Tippy
                                                        content={"delete"}
                                                        placement="top"
                                                    >
                                                        <button
                                                            onClick={() => handleDeleteField(field?._id)}
                                                            className={`bg-red-400/20 dark:bg-red-600 absolute right-0 text-[.90rem] font-bold text-black dark:text-white px-1 py-1 rounded-md`}
                                                        >
                                                            <RxCross2 className='text-red-600 dark:text-red-200' />
                                                        </button>
                                                    </Tippy> :

                                                    <span className=' absolute right-0'>
                                                        <RxValueNone className='text-green-900 dark:text-green-200' />
                                                    </span>


                                            }

                                            <label className="block text-sm font-medium text-formLabelLight dark:text-formLabelDark mb-1">
                                                {field?.label}{field?.isRequired && <span className="text-red-500">*</span>}
                                            </label>
                                            {renderFieldPreview(field)}
                                        </div>
                                    )
                                }
                                )
                            }
                        </div>
                        :
                        <div className="flex mt-4 flex-col justify-center items-center py-8 sm:py-12 bg-gray-100 dark:bg-gray-900 rounded-xl shadow-md">
                            <FaExclamationCircle className="text-3xl sm:text-4xl text-gray-400 dark:text-gray-500 mb-3 sm:mb-4" />
                            <p className="text-base sm:text-lg font-medium text-gray-600 dark:text-gray-300 mb-3 sm:mb-4">
                                No Fields Found
                            </p>
                        </div>
                }
            </div>

            {/* Field section */}
            <div className="w-[100%] mb-20 bg-cardBgLight dark:bg-cardBgDark shadow-lg rounded-lg p-1">
                <div className="bg-cardBgLight dark:bg-cardBgDark p-6 ">
                    <h2 className="md:text-2xl text-1xl font-semibold text-formHeadingLight dark:text-formHeadingDark md:mb-4 mb-2 text-start">Add Custom Field</h2>
                    <div className="h-[1.8px] bg-black dark:bg-white mb-4"></div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-formLabelLight dark:text-formLabelDark mb-1">Field Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-[100%] bg-transparent  p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., emergencyContact"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-formLabelLight dark:text-formLabelDark mb-1">Label</label>
                                <input
                                    type="text"
                                    name="label"
                                    value={formData.label}
                                    onChange={handleChange}
                                    required
                                    className="w-[100%] bg-transparent p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., Emergency Contact"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-formLabelLight dark:text-formLabelDark mb-1">Type</label>
                                <Select
                                    options={fieldTypes}
                                    value={fieldTypes.find(opt => opt.value === formData.type) ? fieldTypes.find(opt => opt.value === formData.type) : null}
                                    onChange={(selected) => handleSelectChange('type', selected)}
                                    className="basic-single "
                                    classNamePrefix="select"
                                    styles={customStyles}
                                    required
                                />
                            </div>
                            {['text', 'number', 'email', 'textarea', 'hyperlink'].includes(formData.type) && (
                                <div>
                                    <label className="block text-sm font-medium text-formLabelLight dark:text-formLabelDark mb-1">Placeholder</label>
                                    <input
                                        type="text"
                                        name="placeholder"
                                        value={formData.placeholder}
                                        onChange={handleChange}
                                        className="w-[100%] bg-transparent p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="e.g., Enter your email"
                                    />
                                </div>
                            )}
                        </div>

                        {(formData.type === 'select' || formData.type === 'multiselect') && (
                            <div>
                                <label className="block text-sm font-medium text-formLabelLight dark:text-formLabelDark mb-1">Options</label>
                                <div className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={optionInput}
                                        onChange={(e) => setOptionInput(e.target.value)}
                                        className="flex-1 bg-transparent p-2 border border-gray-300 rounded-md"
                                        placeholder="Add an option"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddOption}
                                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                                    >
                                        Add
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {formData.options.map((option, index) => (
                                        <div key={index} className="flex items-center justify-between p-2 bg-gray-100 rounded-md">
                                            <span>{option}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveOption(index)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {formData.type === 'file' && (
                            <div>
                                <label className="block text-sm font-medium text-formLabelLight dark:text-formLabelDark mb-1">Accepted File Types</label>
                                <Select
                                    isMulti
                                    options={commonFileTypes}
                                    value={commonFileTypes.filter(opt => formData.validation.fileTypes.includes(opt.value))}
                                    onChange={handleFileTypesChange}
                                    className="basic-multi-select bg-transparent"
                                    classNamePrefix="select"
                                    placeholder="Select file types..."
                                />
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-formLabelLight dark:text-formLabelDark mb-1">Custom File Type</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={fileTypeInput}
                                            onChange={(e) => setFileTypeInput(e.target.value)}
                                            className="flex-1 bg-transparent p-2 border border-gray-300 rounded-md"
                                            placeholder="e.g., image/x-icon"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleAddFileType}
                                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-2 mt-2">
                                    {formData.validation.fileTypes.map((fileType, index) => (
                                        <div key={index} className="flex items-center justify-between p-2 bg-gray-100 rounded-md">
                                            <span>{fileType}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveFileType(index)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-formLabelLight dark:text-formLabelDark mb-1">Max File Size (bytes)</label>
                                    <input
                                        type="number"
                                        name="validation.maxSize"
                                        value={formData.validation.maxSize}
                                        onChange={handleChange}
                                        className="w-[100%] bg-transparent p-2 border border-gray-300 rounded-md"
                                        placeholder="e.g., 5242880 (5MB)"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="isRequired"
                                checked={formData.isRequired}
                                onChange={handleChange}
                                className="h-5 w-5 text-blue-600"
                            />
                            <label className="text-sm font-medium text-formLabelLight dark:text-formLabelDark">Required Field</label>
                        </div>

                        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-formLabelLight dark:text-formLabelDark mb-1">Grid Span (1-12)</label>
                                <input
                                    type="number"
                                    name="gridConfig.span"
                                    value={formData.gridConfig.span}
                                    onChange={handleChange}
                                    min="1"
                                    max="12"
                                    required
                                    className="w-[100%] bg-transparent p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-formLabelLight dark:text-formLabelDark mb-1">Order</label>
                                <input
                                    type="number"
                                    name="gridConfig.order"
                                    value={formData.gridConfig.order}
                                    onChange={handleChange}
                                    min="0"
                                    required
                                    className="w-[100%] bg-transparent p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div> */}

                        {formData.type !== 'file' && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-formHeadingLight dark:text-formHeadingDark">Validation</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-formLabelLight dark:text-formLabelDark mb-1">Regex</label>
                                        <input
                                            type="text"
                                            name="validation.regex"
                                            value={formData.validation.regex}
                                            onChange={handleChange}
                                            className="w-[100%] bg-transparent p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="e.g., ^[0-9]{10}$"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-formLabelLight dark:text-formLabelDark mb-1">Max Length</label>
                                        <input
                                            type="number"
                                            name="validation.maxLength"
                                            value={formData.validation.maxLength}
                                            onChange={handleChange}
                                            className="w-[100%] bg-transparent p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-formLabelLight dark:text-formLabelDark mb-1">Min Value</label>
                                        <input
                                            type="number"
                                            name="validation.min"
                                            value={formData.validation.min}
                                            onChange={handleChange}
                                            className="w-[100%] bg-transparent p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-formLabelLight dark:text-formLabelDark mb-1">Max Value</label>
                                        <input
                                            type="number"
                                            name="validation.max"
                                            value={formData.validation.max}
                                            onChange={handleChange}
                                            className="w-[100%] bg-transparent p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {errors.length > 0 && (
                            <div className="p-4 bg-red-100 rounded-md">
                                {errors.map((error, index) => (
                                    <p key={index} className="text-red-700 text-sm">{error}</p>
                                ))}
                            </div>
                        )}

                        <div className='flex justify-end'>

                            <button
                                disabled={isSubmitting}
                                type="submit"
                                className="w-auto p-2 text-sm text-white rounded-lg transition-all duration-300 ease-in-out 
            bg-custom-gradient-button-dark dark:bg-custom-gradient-button-light 
             hover:bg-custom-gradient-button-light dark:hover:bg-custom-gradient-button-dark 
             flex items-center justify-center shadow-lg">
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
                                    `Create Field`
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default CustomField
