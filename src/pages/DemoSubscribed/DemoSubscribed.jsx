




import React, { useEffect, useState } from 'react'
import CustomTable from '../../components/CustomTable/CustomTable'
import useDarkmode from '../../Hooks/useDarkMode';
import Hamberger from '../../components/Hamberger/Hamberger';
import { FaRegEye } from "react-icons/fa6";


import { useNavigate } from 'react-router-dom';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // Optional: default CSS styling
import "../../App.css"
import subscribedUserService from '../../services/subscribedUserService';
import LoadingModel from '../../components/Loading/LoadingModel';
import { useSelector } from 'react-redux';
import common from '../../helper/common';

function DemoSubscribed({ noFade }) {

  const { capability } = useSelector((state) => state.capabilitySlice);
  const [permission, setPermission] = useState(null);

  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const handleCloseLoadingModal = () => {
    setShowLoadingModal(false);
  };
  const [isDark] = useDarkmode();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [text, setText] = useState("");
  const [updatedData, setUpdatedData] = useState([])
  const columns = [
    {
      key: 'serialNumber', header: 'ID',
      render: (value) => {
        return (
          <span className={`whitespace-nowrap  text-black dark:text-white  rounded-md`} >
            {value}
          </span>
        )
      }
    },
    {
      header: 'Customer Name', width: 'auto',
      render: (value, row) => {
        const fullName = (row?.userId?.firstName + " " + (row?.userId?.lastName ? row?.userId?.lastName : "") );
        return (
          <span className={`whitespace-nowrap  text-black dark:text-white  rounded-md`} >
            {fullName}
          </span>
        )
      }
    },
     {
      header: 'Expiry Date', width: 'auto',
      render: (value, row) => {
        const date = (row?.finalExpiryDate );
        return (
          <span className={`whitespace-nowrap  text-black dark:text-white  rounded-md`} >
            {common.formatDateToReadableString(date)}
          </span>
        )
      }
    },
    {
      header: 'Total Forms', width: 'auto',
      render: (value, row) => {
        const limit = (row?.totalFormLimit);
        return (
          <span className={`whitespace-nowrap ${limit < 200 ? "bg-red-300/45" : "bg-green-300/65"} shadow-md px-2 py-1  text-black dark:text-white  rounded-md`} >
            {limit}
          </span>
        )
      }
    },
    {
      header: 'Total Organisations', width: 'auto',
      render: (value, row) => {
        const limit = (row?.totalOrgLimit);
        return (
          <span className={`whitespace-nowrap ${limit < 1 ? "bg-red-300/45" : "bg-green-300/65"} shadow-md  px-2 py-1   text-black dark:text-white  rounded-md`} >
            {limit}
          </span>
        )
      }
    },
    {
      header: 'Total Usrs', width: 'auto',
      render: (value, row) => {
        const limit = (row?.totalUserLimint);
        return (
          <span className={`whitespace-nowrap text-center ${limit < 1 ? "bg-red-300/45" : "bg-green-300/65"} shadow-md  px-2 py-1  text-black dark:text-white  rounded-md`} >
            {limit}
          </span>
        )
      }
    },
    {
      header: 'Action',
      render: (value, row) => (
        <div className='flex gap-3'>
          <Tippy
            content={"View Details"}
            placement="top"
            theme="custom"
          >
            <button
              className='bg-hambergerLight dark:bg-hambergerDark p-2 rounded-md shadow-lg'
              onClick={() => handleView(row?._id)}
            >
              <FaRegEye />
            </button>
          </Tippy>

        </div>
      ),
    }
  ];

  async function getData(currentPage, rowsPerPage, text) {
    try {
      const response = await subscribedUserService.getDemoSubscribedUserList(currentPage, rowsPerPage, text);
      return response
    } catch (error) {
      throw error
    }
  }

  async function handleView(id) {
    try {
      if (permission && permission[0].subMenus?.view?.access) {
        setShowLoadingModal(true)
        const response = await subscribedUserService.getParticularSubscribedUser(id);
        setShowLoadingModal(false);
        setTimeout(() => {
          navigate("/view/lead", { state: { company: response?.data?.data } })
        }, 600);
      } else {
        alert("Unauthorize to access this!")
      }
    } catch (error) {
      setShowLoadingModal(false)
      console.log("error while getting topup data", error);
    }
  }

  function buttonAction() {
    navigate("/list/request")
  }


  useEffect(() => {
    if (capability && capability?.length > 0) {
      const administration = capability?.filter((item) => item?.name == "Administration");
      const menu = administration[0].menu;
      const permission = menu?.filter((menu) => menu?.name == "Subscribed");
      setPermission(permission);
      if (!permission[0].subMenus?.view?.access) {
        alert("Unauthorize to access this!");
        navigate("/home")
      }
    }
  }, [capability])

  return (
    <div className="flex flex-col md:mx-4  mx-2     mt-3 min-h-screen bg-light dark:bg-dark">
      <Hamberger text={"Lead / List"} />
      <div className="bg-cardBgLight dark:bg-cardBgDark rounded-lg shadow-lg md:p-6 p-2 mb-6">
        <CustomTable
          columns={columns}
          fetchData={getData}
          headerBackground={isDark ? "#00868d" : "#3f8e90"}
          headerTextColor="#fff"
          rowBackground={isDark ? "rgb(7 38 44)" : "#fff"}
          rowTextColor={isDark ? "#fff" : "#3f8e90"}
          alternateRowBackground={isDark ? "#16414ca3" : "#80abb124"}
          defaultRowsPerPage={10}
          buttonName={"Assign Demo"}
          buttonAction={buttonAction}
          currentPage={currentPage}
          updatedData={updatedData}
          setCurrentPage={setCurrentPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          text={text}
          setText={setText}
        />
      </div>
      {/* loading model */}
      <LoadingModel showLoadingModal={showLoadingModal} setShowLoadingModal={setShowLoadingModal} handleCloseLoadingModal={handleCloseLoadingModal} />
    </div>
  )
}

export default DemoSubscribed
