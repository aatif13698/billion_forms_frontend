import axios from "axios";






const createCompany = async (data) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/superadmin/administration/create-company`, { ...data });
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




const updateCompany = async (data) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/superadmin/administration/update-company`, { ...data });
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


const softDeleteCompany = async (data) => {
  try {
    const authToken = localStorage.getItem("SAAS_BILLION_FORMS_customer_token");

    const response = await axios.delete(
      `${import.meta.env.VITE_API_URL}/api/superadmin/administration/softdelete-company`,
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


const restoreCompany = async (data) => {
  try {
    const authToken = localStorage.getItem("SAAS_BILLION_FORMS_customer_token");

    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/superadmin/administration/restore-company`, { ...data },
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


const getCompanies = async (currentPage, rowsPerPage, text) => {
  const authToken = localStorage.getItem("SAAS_BILLION_FORMS_customer_token");
  try {
      const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/superadmin/administration/get/company?keyword=${text}&page=${currentPage}&perPage=${rowsPerPage}`,
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




const getParticularCompany = async (id) => {
  const authToken = localStorage.getItem("SAAS_BILLION_FORMS_customer_token");
  try {
      const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/superadmin/administration/get/company/${id}`,
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

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/superadmin/administration/activeInactive/company`, { ...data },
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




export default {
  createCompany,
  updateCompany,
  softDeleteCompany,
  getCompanies,
  getParticularCompany,
  activeInactive,
  restoreCompany
}