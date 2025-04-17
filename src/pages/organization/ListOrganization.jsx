import React, { useEffect, useState } from 'react'
import Hamberger from '../../components/Hamberger/Hamberger'
import { useNavigate } from 'react-router-dom'
import organizationService from '../../services/organizationService'
import { useSelector } from 'react-redux'
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import LoadingModel from '../../components/Loading/LoadingModel'
import LoadingSpinner from '../../components/Loading/LoadingSpinner'


function ListOrganization() {

  const navigate = useNavigate();

  const [isDataLoading, setIsDataLoaing] = useState(true);

  // loading handling
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const handleCloseLoadingModal = () => {
    setShowLoadingModal(false);
  };

  const { clientUser: currentUser, isAuth: isLoggedIn } = useSelector((state) => state?.authCustomerSlice);
  const [organizations, setOrganizations] = useState([])


  useEffect(() => {
    if (currentUser && currentUser?.id) {
      getData(currentUser?.id)
    }
  }, [currentUser])

  async function getData(id) {
    try {
      setIsDataLoaing(true);
      const response = await organizationService.getAllOrganization(id);
      setOrganizations(response?.data?.data?.data);
      setIsDataLoaing(false);
    } catch (error) {
      setIsDataLoaing(false);
      console.log("error while getting the organization list", error);
    }
  }

  async function viewOrganization(id) {
    try {
      setShowLoadingModal(true);
      const response = await organizationService.getParticularOrganization(id);
      navigate("/create/organization", { state: { organization: response?.data?.data?.data } })
      setShowLoadingModal(false);
    } catch (error) {
      setShowLoadingModal(false);
      console.log("error while getting the particular organization", error);
    }
  }

  return (
    <div className="flex flex-col md:mx-4  mx-2     mt-3 min-h-screen bg-light dark:bg-dark">
      <Hamberger text={"Organization / List"} />
      <div className="bg-cardBgLight dark:bg-cardBgDark rounded-lg shadow-lg md:p-6 p-2 mb-40">
        <div className='flex justify-between md:flex-row flex-col gap-3 '>
          <div>
            <button
              onClick={() => navigate("/create/organization")}
              className="w-auto text-sm p-2 text-white py-2 rounded-lg transition-all duration-300 ease-in-out 
                bg-custom-gradient-button-dark dark:bg-custom-gradient-button-light 
                 hover:bg-custom-gradient-button-light dark:hover:bg-custom-gradient-button-dark 
                 flex items-center justify-center shadow-lg"
            >
              Add Organization
            </button>
          </div>
          <div className='flex justify-center items-center'>
            <input
              // onChange={handleChange}
              type="text"
              name='search'
              // value={text}
              placeholder='Search...'
              className="w-[100%] bg-transparent px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        {
          isDataLoading ?
            <div className='flex justify-center items-center bg-white'>
              <LoadingSpinner />
            </div>
            :
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-2 md:p-2 mt-4">
              {organizations && organizations.length > 0 ? (
                organizations.map((item) => {
                  const bannerUrl = `${import.meta.env.VITE_API_URL_IMG}${item.banner}`;
                  const logoUrl = `${import.meta.env.VITE_API_URL_IMG}${item.logo}`;
                  return (
                    <div
                      onClick={() => viewOrganization(item?._id)}
                      key={item._id}
                      className="relative hover:border-subscriptionCardBgLightFrom border-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl"
                      style={{
                        backgroundImage: `url(${bannerUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        minHeight: '250px',
                      }}
                    >
                      {/* Overlay for text readability */}
                      <div className="absolute inset-0 bg-black bg-opacity-70 hover:bg-opacity-40 flex flex-col justify-center items-start p-4">
                        {/* Logo in top-right corner */}
                        <div className="absolute z-[9] top-4 right-4">
                          <img
                            src={logoUrl}
                            alt={`${item.name} logo`}
                            className="h-16 w-16 rounded-full object-cover border-2 border-white dark:border-gray-200 shadow-md"
                            onError={(e) => {
                              e.target.src = '/fallback-logo.png'; // Fallback image
                            }}
                          />
                        </div>
                        {/* School details */}
                        <div className="text-left text-white z-10 w-[100%] max-w-md">
                          <h2 className="text-xl md:text-2xl font-bold mb-2 drop-shadow-md">
                            {item.name}
                          </h2>
                          <h4 className="text-sm md:text-base font-medium mb-1 drop-shadow-sm">
                            {item.captionText}
                          </h4>
                          <div className="flex items-center text-sm md:text-base font-medium mb-1 drop-shadow-sm">
                            <FaEnvelope className="mr-2 text-white" />
                            <span>{item.email}</span>
                          </div>
                          <div className="flex items-center text-sm md:text-base font-medium mb-1 drop-shadow-sm">
                            <FaPhone className="mr-2 text-white" />
                            <span>{item.phone}</span>
                          </div>
                          <div className="flex items-center text-sm md:text-sm font-light drop-shadow-sm">
                            <FaMapMarkerAlt className="mr-2 text-white" />
                            <span>{item.address}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full flex justify-center items-center py-12 bg-gray-100 dark:bg-gray-900 rounded-xl shadow-md">
                  <p className="text-lg font-medium text-gray-600 dark:text-gray-300">
                    No Organizations Found
                  </p>
                </div>
              )}
            </div>
        }
      </div>
      {/* loading model */}
      <LoadingModel showLoadingModal={showLoadingModal} setShowLoadingModal={setShowLoadingModal} handleCloseLoadingModal={handleCloseLoadingModal} />
    </div>
  )
}

export default ListOrganization
