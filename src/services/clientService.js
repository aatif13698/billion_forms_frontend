import axios from "axios";
const authToken = localStorage.getItem("SAAS_BILLION_FORMS_customer_token");


const createClient = async (data) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/superadmin/administration/create/cleint`, { ...data });
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



const updateClient = async (data) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/superadmin/administration/update/client`, { ...data },
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



const activeInactive = async (data) => {
    try {
        const authToken = localStorage.getItem("SAAS_BILLION_FORMS_customer_token");

        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/superadmin/administration/activeInactive/client`, { ...data },
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



const getClients = async (currentPage, rowsPerPage, text) => {
    const authToken = localStorage.getItem("SAAS_BILLION_FORMS_customer_token");
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/superadmin/administration/get/client?keyword=${text}&page=${currentPage}&perPage=${rowsPerPage}`,
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




const getParticularClient = async (id) => {
    const authToken = localStorage.getItem("SAAS_BILLION_FORMS_customer_token");
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/superadmin/administration/get/client/${id}`,
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
  


const getClientsNotSetuped = async () => {
    const authToken = localStorage.getItem("SAAS_BILLION_FORMS_customer_token");
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/superadmin/administration/get/client/by-status/notsetuped`,
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



const getAllClients = async () => {
    const authToken = localStorage.getItem("SAAS_BILLION_FORMS_customer_token");
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/superadmin/administration/get/all/client`,
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



const softDeleteClient = async (data) => {
    try {
      const authToken = localStorage.getItem("SAAS_BILLION_FORMS_customer_token");
  
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/superadmin/administration/softdelete/client`,
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
  
  
  const restoreClient = async (data) => {
    try {
      const authToken = localStorage.getItem("SAAS_BILLION_FORMS_customer_token");
  
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/superadmin/administration/restore/client`, { ...data },
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
    createClient,
    updateClient,
    activeInactive,
    getClients,
    getParticularClient,
    getClientsNotSetuped,
    getAllClients,
    softDeleteClient,
    restoreClient

}