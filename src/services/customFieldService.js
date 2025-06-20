import axios from "axios";
const authToken = localStorage.getItem("SAAS_BILLION_FORMS_customer_token");



const createCustomField = async (data) => {
    const authToken = localStorage.getItem("SAAS_BILLION_FORMS_customer_token");
    try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/superadmin/administration/custom-fields`, { ...data }, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            }
        });
        return response;
    } catch (error) {

        if (error.response) {
            return Promise.reject(error.response.data.error || "Invalid credentials");
        } else if (error.request) {
            return Promise.reject("Network error. Please try again.");
        } else {
            return Promise.reject("An error occurred. Please try again later.");
        }
    }
}


const getCustomFields = async () => {
    const authToken = localStorage.getItem("SAAS_BILLION_FORMS_customer_token");
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/superadmin/administration/custom-fields`,
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            }
        );
        return response;
    } catch (error) {
        if (error.response) {
            // The request was made, but the server responded with a status code
            return Promise.reject(error.response.data.message);
        } else if (error.request) {
            // The request was made but no response was received
            return Promise.reject("Network error. Please try again.");
        } else {
            // Something happened in setting up the request that triggered an Error
            return Promise.reject("An error occurred. Please try again later.");
        }
    }
};

const createCustomForm = async (data) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/superadmin/administration/create/field`, { ...data }, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            }
        });
        return response;
    } catch (error) {
        if (error.response) {
            return Promise.reject(error.response.data.error);
        } else if (error.request) {
            return Promise.reject("Network error. Please try again.");
        } else {
            return Promise.reject("An error occurred. Please try again later.");
        }
    }
}


const getCustomForms = async (userId, sessionId) => {
    const authToken = localStorage.getItem("SAAS_BILLION_FORMS_customer_token");
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/superadmin/administration/get/field/all/${userId}/${sessionId}`,
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            }
        );
        return response;
    } catch (error) {
        if (error.response) {
            // The request was made, but the server responded with a status code
            return Promise.reject(error.response.data.message);
        } else if (error.request) {
            // The request was made but no response was received
            return Promise.reject("Network error. Please try again.");
        } else {
            // Something happened in setting up the request that triggered an Error
            return Promise.reject("An error occurred. Please try again later.");
        }
    }
};



const getCustomFormsBySession = async (sessionId) => {
    const authToken = localStorage.getItem("SAAS_BILLION_FORMS_customer_token");
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/superadmin/administration/get/field/bysession/${sessionId}`,
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            }
        );
        return response;
    } catch (error) {
        if (error.response) {
            // The request was made, but the server responded with a status code
            return Promise.reject(error.response.data.message);
        } else if (error.request) {
            // The request was made but no response was received
            return Promise.reject("Network error. Please try again.");
        } else {
            // Something happened in setting up the request that triggered an Error
            return Promise.reject("An error occurred. Please try again later.");
        }
    }
};



const getFormData = async (id) => {
    const authToken = localStorage.getItem("SAAS_BILLION_FORMS_customer_token");
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/superadmin/administration/get/field/data/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            }
        );
        return response;
    } catch (error) {
        if (error.response) {
            // The request was made, but the server responded with a status code
            return Promise.reject(error.response.data.message);
        } else if (error.request) {
            // The request was made but no response was received
            return Promise.reject("Network error. Please try again.");
        } else {
            // Something happened in setting up the request that triggered an Error
            return Promise.reject("An error occurred. Please try again later.");
        }
    }
};



const deleteCustomField = async (userId, sessionId, fieldId) => {
    const authToken = localStorage.getItem("SAAS_BILLION_FORMS_customer_token");
    try {
        const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/superadmin/administration/delete/field/${userId}/${sessionId}/${fieldId}`, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            }
        });
        return response;
    } catch (error) {

        if (error.response) {
            return Promise.reject(error.response.data.error || "Invalid credentials");
        } else if (error.request) {
            return Promise.reject("Network error. Please try again.");
        } else {
            return Promise.reject("An error occurred. Please try again later.");
        }
    }
}



const updateOrder = async (userId, sessionId, data) => {
    const authToken = localStorage.getItem("SAAS_BILLION_FORMS_customer_token");
    try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/superadmin/administration/update/order/field/${userId}/${sessionId}`, { fields: data }, {
            headers: {
                Authorization: `Bearer ${authToken}`,
                "Content-Type": "application/json",
            }
        });
        return response;
    } catch (error) {

        if (error.response) {
            return Promise.reject(error.response.data.error || "Invalid credentials");
        } else if (error.request) {
            return Promise.reject("Network error. Please try again.");
        } else {
            return Promise.reject("An error occurred. Please try again later.");
        }
    }
}


const submitFormData = async (data) => {
    const authToken = localStorage.getItem("SAAS_BILLION_FORMS_customer_token");
    try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/superadmin/administration/create/form`, data, {
            headers: {
                Authorization: `Bearer ${authToken}`,
                "Content-Type": "multipart/form-data",
            }
        });
        return response;
    } catch (error) {

        console.log("error form", error);


        if (error.response) {
            return Promise.reject(error.response.data.message || "Invalid credentials");
        } else if (error.request) {
            return Promise.reject("Network error. Please try again.");
        } else {
            return Promise.reject("An error occurred. Please try again later.");
        }
    }
}


const editFormData = async (data, id) => {
    const authToken = localStorage.getItem("SAAS_BILLION_FORMS_customer_token");
    try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/superadmin/administration/update/form/${id}`, data, {
            headers: {
                Authorization: `Bearer ${authToken}`,
                "Content-Type": "multipart/form-data",
            }
        });
        return response;
    } catch (error) {
        console.log("error form", error);
        if (error.response) {
            return Promise.reject(error.response.data.message || "Invalid credentials");
        } else if (error.request) {
            return Promise.reject("Network error. Please try again.");
        } else {
            return Promise.reject("An error occurred. Please try again later.");
        }
    }
}




const deleteForm = async (data) => {
    const authToken = localStorage.getItem("SAAS_BILLION_FORMS_customer_token");
    try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/superadmin/administration/delete/form`, data, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            }
        });
        return response;
    } catch (error) {
        console.log("error form", error);
        if (error.response) {
            return Promise.reject(error.response.data.message || "Invalid credentials");
        } else if (error.request) {
            return Promise.reject("Network error. Please try again.");
        } else {
            return Promise.reject("An error occurred. Please try again later.");
        }
    }
}



const updateLastPrintedForm = async (data) => {
    const authToken = localStorage.getItem("SAAS_BILLION_FORMS_customer_token");
    try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/superadmin/administration/update/last/printed/form`, data, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            }
        });
        return response;
    } catch (error) {
        console.log("error form", error);
        if (error.response) {
            return Promise.reject(error.response.data.message || "Invalid credentials");
        } else if (error.request) {
            return Promise.reject("Network error. Please try again.");
        } else {
            return Promise.reject("An error occurred. Please try again later.");
        }
    }
}



const submitPassword = async (data) => {
    const authToken = localStorage.getItem("SAAS_BILLION_FORMS_customer_token");
    try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/superadmin/administration/check/password`, { ...data }, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            }
        });
        return response;
    } catch (error) {

        if (error.response) {
            return Promise.reject(error.response.data.message || "Invalid credentials");
        } else if (error.request) {
            return Promise.reject("Network error. Please try again.");
        } else {
            return Promise.reject("An error occurred. Please try again later.");
        }
    }
}




const submitFormPassword = async (data) => {
    const authToken = localStorage.getItem("SAAS_BILLION_FORMS_customer_token");
    try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/superadmin/administration/login/form`, { ...data }, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            }
        });
        return response;
    } catch (error) {

        if (error.response) {
            return Promise.reject(error.response.data.message || "Invalid credentials");
        } else if (error.request) {
            return Promise.reject("Network error. Please try again.");
        } else {
            return Promise.reject("An error occurred. Please try again later.");
        }
    }
}


const getAllFormsBySession = async (id, getall) => {
    const authToken = localStorage.getItem("SAAS_BILLION_FORMS_customer_token");
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/superadmin/administration/get/all/forms/${id}/${getall ? "1" : "0"}`,
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            }
        );
        return response;
    } catch (error) {
        if (error.response) {
            // The request was made, but the server responded with a status code
            return Promise.reject(error.response.data.message);
        } else if (error.request) {
            // The request was made but no response was received
            return Promise.reject("Network error. Please try again.");
        } else {
            // Something happened in setting up the request that triggered an Error
            return Promise.reject("An error occurred. Please try again later.");
        }
    }
};

const initiateDownload = async (sessionId) => {
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/superadmin/administration/download`,
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
                params: { sessionId },
            }
        );
        return response.data.data.jobId;
    } catch (error) {
        if (error.response) {
            // The request was made, but the server responded with a status code
            return Promise.reject(error.response.data.message);
        } else if (error.request) {
            // The request was made but no response was received
            return Promise.reject("Network error. Please try again.");
        } else {
            // Something happened in setting up the request that triggered an Error
            return Promise.reject("An error occurred. Please try again later.");
        }
    }
}


const initiateDownloadByField = async (sessionId, fieldName, uniqueId, enableAll, filters) => {
    try {

        // old
        // const response = await axios.get(
        //     `${import.meta.env.VITE_API_URL}/api/superadmin/administration/download-by-field`,
        //     {
        //         headers: {
        //             Authorization: `Bearer ${authToken}`,
        //         },
        //         params: { sessionId, fieldName },
        //     }
        // );
        // return response.data.data.jobId;

        // new

        console.log("uniqueIdqqq",uniqueId);
        
        return axios.get(`${import.meta.env.VITE_API_URL}/api/superadmin/administration/download-by-field`, {
            params: { sessionId, fieldName, uniqueId, getall : enableAll ? "1" : "0", filters : filters },
            responseType: 'blob', // Handle binary data
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
            timeout: 300000,
        });
    } catch (error) {
        if (error.response) {
            // The request was made, but the server responded with a status code
            return Promise.reject(error.response.data.message);
        } else if (error.request) {
            // The request was made but no response was received
            return Promise.reject("Network error. Please try again.");
        } else {
            // Something happened in setting up the request that triggered an Error
            return Promise.reject("An error occurred. Please try again later.");
        }
    }
}

const getDownloadStatus = async (jobId) => {
    try {

        // old
        // const response = await axios.get(
        //     `${import.meta.env.VITE_API_URL}/api/superadmin/administration/download/status`,
        //     {
        //         headers: {
        //             Authorization: `Bearer ${authToken}`,
        //         },
        //         params: { jobId },
        //     }
        // );
        // return response.data.data;

        // new
        return axios.get(`${import.meta.env.VITE_API_URL}/api/superadmin/administration/download/status`, {
            params: { jobId },
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });
    } catch (error) {
        if (error.response) {
            // The request was made, but the server responded with a status code
            return Promise.reject(error.response.data.message);
        } else if (error.request) {
            // The request was made but no response was received
            return Promise.reject("Network error. Please try again.");
        } else {
            // Something happened in setting up the request that triggered an Error
            return Promise.reject("An error occurred. Please try again later.");
        }
    }
}


export default {
    createCustomField,
    getCustomFields,
    createCustomForm,
    getCustomForms,
    getCustomFormsBySession,
    deleteCustomField,
    updateOrder,
    submitFormData,
    editFormData,
    deleteForm,
    submitPassword,
    submitFormPassword,
    getFormData,
    getAllFormsBySession,
    initiateDownload,
    initiateDownloadByField,
    getDownloadStatus,
    updateLastPrintedForm
}
