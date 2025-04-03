import axios from "axios";






const createCompany = async (data) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/superadmin/auth/create-company`, { ...data });
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
  }


  export default {
    createCompany
  }