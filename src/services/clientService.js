import axios from "axios";



const createClient = async (data) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/superadmin/auth/create-company`, { ...data });
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


export default {
    createClient
}