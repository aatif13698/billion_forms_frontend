import axios from "axios";
const authToken = localStorage.getItem("SAAS_BILLION_FORMS_customer_token");


const createTopup = async (data) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/superadmin/administration/create/topup`, { ...data },
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



const updateTopup = async (data) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/superadmin/administration/update/topup`, { ...data },
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



const getTopupList = async (currentPage, rowsPerPage, text) => {
    const authToken = localStorage.getItem("SAAS_BILLION_FORMS_customer_token");
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/superadmin/administration/get/topup/list?keyword=${text}&page=${currentPage}&perPage=${rowsPerPage}`,
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




const activeInactiveTopup = async (data) => {
    try {
        const authToken = localStorage.getItem("SAAS_BILLION_FORMS_customer_token");
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/superadmin/administration/activeInactive/topup`, { ...data },
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



const getParticularTopup = async (id) => {
    const authToken = localStorage.getItem("SAAS_BILLION_FORMS_customer_token");
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/superadmin/administration/get/topup/${id}`,
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


const softDeleteTopup = async (data) => {
    try {
        const authToken = localStorage.getItem("SAAS_BILLION_FORMS_customer_token");

        const response = await axios.delete(
            `${import.meta.env.VITE_API_URL}/api/superadmin/administration/softdelete/topup`,
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


const restoreTopup = async (data) => {
    try {
        const authToken = localStorage.getItem("SAAS_BILLION_FORMS_customer_token");
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/superadmin/administration/restore/topup`, { ...data },
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



export default {
    createTopup,
    updateTopup,
    getTopupList,
    activeInactiveTopup,
    getParticularTopup,
    softDeleteTopup,
    restoreTopup
}