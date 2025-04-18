import axios from "axios";



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

        console.log("error aaa",error);
        
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


export default {
    createCustomField,
    getCustomFields
}
