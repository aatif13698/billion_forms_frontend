import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import customFieldService from '../../../services/customFieldService';
import toast from 'react-hot-toast';

const CreateCustomField = ({ onFieldCreated }) => {
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

  console.log("existingFields", existingFields);


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
        const response = await customFieldService.getCustomFields();
        setExistingFields(response.data?.data); // Assuming response is { data: [...] }
      } catch (error) {
        setErrors(['Failed to fetch existing fields']);
      }
    };
    fetchFields();
  }, []);

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
      }
    };

    try {
      const response = await customFieldService.createCustomField(payload);
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

    } catch (error) {
      console.log("Error form:", error);
      // Show error toast with backend message
      const errorMessage = error || 'An error occurred while creating the field';
      // toast.error(errorMessage);
      setErrors([errorMessage]); // Optional: keep in state if you still want to display in UI
    }
  };

  // Render a field preview (simplified for display purposes)
  const renderFieldPreview = (field) => {
    const baseStyles = "w-[100%] p-2 border border-gray-300 rounded-md";

    switch (field.type) {
      case 'text':
      case 'number':
      case 'email':
      case 'hyperlink':
        return (
          <input
            type={field?.type}
            placeholder={field?.placeholder}

            className={baseStyles}
          />
        );
      case 'textarea':
        return (
          <textarea
            placeholder={field?.placeholder}

            className={`${baseStyles} min-h-[100px]`}
          />
        );
      case 'select':
      case 'multiselect':
        return (
          <select className={baseStyles}>
            <option value="">{field?.placeholder || 'Select an option'}</option>
            {field?.options?.map((opt, idx) => (
              <option key={idx} value={opt}>{opt}</option>
            ))}
          </select>
        );
      case 'checkbox':
        return (
          <input
            type="checkbox"

            className="h-5 w-5 text-blue-600"
          />
        );
      case 'file':
        return (
          <input
            type="file"

            accept={field?.validation?.fileTypes?.join(',')}
            className={baseStyles}
          />
        );
      case 'date':
        return (
          <input
            type="date"
            placeholder={field?.placeholder || 'Select a date'}

            className={baseStyles}
          />
        );
      case 'timepicker':
        return (
          <input
            type="time"
            placeholder={field?.placeholder || 'Select a time'}

            className={baseStyles}
          />
        );
      case 'color':
        return (
          <input
            type="color"

            className={`${baseStyles} h-10 cursor-not-allowed`}
          />
        );
      default:
        return <div className={baseStyles}>{field?.type} (Preview not available)</div>;
    }
  };

  return (
    <>
      <div className="max-w-2xl mx-auto my-3 ">
        <div className="bg-cardBgLight dark:bg-cardBgDark rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold mb-6 text-formHeadingLight dark:text-formHeadingDark">Create Custom Field</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-formLabelLight dark:text-formLabelDark mb-1">Type</label>
                <Select
                  options={fieldTypes}
                  value={fieldTypes.find(opt => opt.value === formData.type)}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>

            {formData.type !== 'file' && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-800">Validation</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-formLabelLight dark:text-formLabelDark mb-1">Regex</label>
                    <input
                      type="text"
                      name="validation.regex"
                      value={formData.validation.regex}
                      onChange={handleChange}
                      className="w-[100%] bg-transparent p-2 border border-gray-300 rounded-md"
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
                      className="w-[100%] bg-transparent p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-formLabelLight dark:text-formLabelDark mb-1">Min Value</label>
                    <input
                      type="number"
                      name="validation.min"
                      value={formData.validation.min}
                      onChange={handleChange}
                      className="w-[100%] bg-transparent p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-formLabelLight dark:text-formLabelDark mb-1">Max Value</label>
                    <input
                      type="number"
                      name="validation.max"
                      value={formData.validation.max}
                      onChange={handleChange}
                      className="w-[100%] bg-transparent p-2 border border-gray-300 rounded-md"
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

            <button
              type="submit"
              className="w-[100%] bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Create Field
            </button>

          </form>
        </div>

        {/* Display existing and newly created fields */}
        <div className="bg-cardBgLight dark:bg-cardBgDark rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-xl font-bold mb-4 text-formHeadingLight dark:text-formHeadingDark">Custom Fields Preview</h3>
          <div className="grid grid-cols-12 gap-4">
            {[...existingFields, ...createdFields]
              .sort((a, b) => a.gridConfig?.order - b.gridConfig?.order)
              .map((field, index) => (
                <div
                  key={index}
                  className={`col-span-12 md:col-span-${field?.gridConfig?.span} flex flex-col`}
                  style={{ order: field?.gridConfig?.order }}
                >
                  <label className="mb-1 text-gray-700 font-medium">
                    {field?.label}{field?.isRequired && <span className="text-red-500">*</span>}
                  </label>
                  {renderFieldPreview(field)}
                </div>
              ))}
          </div>
        </div>
      </div>
    </>

  );
};

export default CreateCustomField;