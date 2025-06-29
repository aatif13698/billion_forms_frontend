

import axios from "axios";
const authToken = localStorage.getItem("SAAS_BILLION_FORMS_customer_token");




const createRequest = async (data) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/superadmin/administration/create/request`, { ...data });
        return response;
    } catch (error) {
        if (error.response) {
            return Promise.reject(error.response.data.message);
        } else if (error.request) {
            return Promise.reject("Network error. Please try again.");
        } else {
            return Promise.reject("An error occurred. Please try again later.");
        }
    }
}



const addReply = async (id, data) => {
    try {
        const authToken = localStorage.getItem("SAAS_BILLION_FORMS_customer_token");
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/superadmin/administration/${id}/reply`, { ...data },
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            }
        );
        return response;
    } catch (error) {
        if (error.response) {
            return Promise.reject(error.response.data.message);
        } else if (error.request) {
            return Promise.reject("Network error. Please try again.");
        } else {
            return Promise.reject("An error occurred. Please try again later.");
        }
    }
}






const getDemoRequest = async (currentPage, rowsPerPage, text) => {
    const authToken = localStorage.getItem("SAAS_BILLION_FORMS_customer_token");
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/superadmin/administration/get/demoRequest?keyword=${text}&page=${currentPage}&perPage=${rowsPerPage}`,
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


const softDeleteRequest = async (data) => {
    try {
        const authToken = localStorage.getItem("SAAS_BILLION_FORMS_customer_token");

        const response = await axios.delete(
            `${import.meta.env.VITE_API_URL}/api/superadmin/administration/softdelete/demoRequest`,
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
                data: data, // Send payload in `data` property for DELETE
            }
        );
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


const restoreRequest = async (data) => {
    try {
        const authToken = localStorage.getItem("SAAS_BILLION_FORMS_customer_token");

        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/superadmin/administration/restore/demoRequest`, { ...data },
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            }
        );
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


const getParticularRequest = async (id) => {
    const authToken = localStorage.getItem("SAAS_BILLION_FORMS_customer_token");
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/superadmin/administration/get/demo/request/${id}`,
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


export default {
    getDemoRequest,
    softDeleteRequest,
    restoreRequest,
    createRequest,
    getParticularRequest,
    addReply
}
