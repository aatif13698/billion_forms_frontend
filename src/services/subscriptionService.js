import axios from "axios";
const authToken = localStorage.getItem("SAAS_BILLION_FORMS_customer_token");


const createSubscriptionPlan = async (data) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/superadmin/administration/create/subscription`, { ...data },
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



const updateSubscription = async (data) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/superadmin/administration/update/subscription`, { ...data },
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



const getSubscriptionPlanList = async (currentPage, rowsPerPage, text) => {
    const authToken = localStorage.getItem("SAAS_BILLION_FORMS_customer_token");
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/superadmin/administration/get/subscription/list?keyword=${text}&page=${currentPage}&perPage=${rowsPerPage}`,
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




const getAllSubscriptionPlan = async (currentPage, rowsPerPage, text) => {
    const authToken = localStorage.getItem("SAAS_BILLION_FORMS_customer_token");
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/superadmin/administration/get/all/subscription`,
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


const getAllTopupPlan = async () => {
    const authToken = localStorage.getItem("SAAS_BILLION_FORMS_customer_token");
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/superadmin/administration/get/all/topup`,
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




const activeInactive = async (data) => {
    try {
        const authToken = localStorage.getItem("SAAS_BILLION_FORMS_customer_token");
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/superadmin/administration/activeInactive/subscription`, { ...data },
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



const getParticularSubscriptionPlan = async (id) => {
    const authToken = localStorage.getItem("SAAS_BILLION_FORMS_customer_token");
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/superadmin/administration/get/subscription/${id}`,
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


const softDeleteSubscriptionPlan = async (data) => {
    try {
        const authToken = localStorage.getItem("SAAS_BILLION_FORMS_customer_token");

        const response = await axios.delete(
            `${import.meta.env.VITE_API_URL}/api/superadmin/administration/softdelete/subscription`,
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


const restoreSubscriptionPlan = async (data) => {
    try {
        const authToken = localStorage.getItem("SAAS_BILLION_FORMS_customer_token");
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/superadmin/administration/restore/subscription`, { ...data },
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
    createSubscriptionPlan,
    updateSubscription,
    getSubscriptionPlanList,
    getAllSubscriptionPlan,
    getAllTopupPlan,
    activeInactive,
    getParticularSubscriptionPlan,
    softDeleteSubscriptionPlan,
    restoreSubscriptionPlan
}