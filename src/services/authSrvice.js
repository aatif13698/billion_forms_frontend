import axios from "axios";





const signUp = async (data) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/customer/auth/signup`, { ...data, clientId: import.meta.env.VITE_DATABASE_ID });
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

const login = async (data) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/superadmin/auth/login`, { ...data });
    return response;
  } catch (error) {
    console.log("login error", error);
    
    if (error.response) {
      return Promise.reject(error.response.data.message || "Invalid credentials");
    } else if (error.request) {
      return Promise.reject("Network error. Please try again.");
    } else {
      return Promise.reject("An error occurred. Please try again later.");
    }
  }
};

const verifyOtp = async (data) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/customer/auth/verifyOtp`, { ...data, clientId: import.meta.env.VITE_DATABASE_ID });
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



const getCompanyData = async () => {
    const authToken = localStorage.getItem("SAAS_BILLION_FORMS_customer_token");
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/getCompanyName`,
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



export default { verifyOtp, signUp, login, getCompanyData}