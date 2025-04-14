// import React from 'react'

// function ListSubscribed() {
//   return (
//     <div>
//       List Subscribed
//     </div>
//   )
// }

// export default ListSubscribed










import React, { useEffect, useState, Fragment } from 'react'
import CustomTable from '../../components/CustomTable/CustomTable'
import useDarkmode from '../../Hooks/useDarkMode';
import Hamberger from '../../components/Hamberger/Hamberger';
import { FaRegEdit } from "react-icons/fa";
import { FaRedoAlt } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa6";



import { FaTrashAlt } from "react-icons/fa";
import { useLocation, useNavigate } from 'react-router-dom';
import companyService from '../../services/companyService';
import { Dialog, Transition } from "@headlessui/react";
import LoadingSpinner from '../../components/Loading/LoadingSpinner';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // Optional: default CSS styling
import "../../App.css"
import subscriptionService from '../../services/subscriptionService';
import topupService from '../../services/topupService';
import subscribedUserService from '../../services/subscribedUserService';

function ListSubscribed({ noFade }) {
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
        const fullName = (row?.userId?.firstName + " " + row?.userId?.lastName);
        return (
          <span className={`whitespace-nowrap  text-black dark:text-white  rounded-md`} >
            {fullName}
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


    // {
    //   key: 'isActive',
    //   header: 'Status',
    //   render: (value, row) => {
    //     console.log("row active", row?.isActive);
    //     return (
    //       <Tippy
    //         content={value ? "Click to deactivate" : "Click to activate"}
    //         placement="top"
    //         theme="custom"
    //       >
    //         <button
    //           onClick={() => handleActiveInactive(currentPage, rowsPerPage, text, row?.isActive, row?._id)}
    //           className={`${value ? "bg-green-500/60" : "bg-red-500/50"} shadow-lg text-[.80rem] font-bold text-black dark:text-white px-2 py-1 rounded-md`}
    //         >
    //           {value ? "Active" : "InActive"}
    //         </button>
    //       </Tippy>
    //     )
    //   },
    // },
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
      const response = await subscribedUserService.getSubscribedUserList(currentPage, rowsPerPage, text);
      return response
    } catch (error) {
      throw error
    }
  }

  async function handleView(id) {
    try {
      setShowLoadingModal(true)
      const response = await subscribedUserService.getParticularSubscribedUser(id);
      setShowLoadingModal(false);
      setTimeout(() => {
        navigate("/view/subscribed", { state: { company: response?.data?.data } })
      }, 600);
    } catch (error) {
      setShowLoadingModal(false)
      console.log("error while getting topup data", error);
    }
  }

  async function handleDelete(currentPage, rowsPerPage, text, id) {
    try {
      const dataObject = {
        topupId: id,
        keyword: text,
        page: currentPage,
        perPage: rowsPerPage
      }
      setShowLoadingModal(true)
      const response = await topupService.softDeleteTopup(dataObject);
      setUpdatedData(response.data?.data?.data)
      setShowLoadingModal(false);
    } catch (error) {
      setShowLoadingModal(false)
      console.log("error while deleting topup data", error);
    }
  }


  async function handleRestore(currentPage, rowsPerPage, text, id) {
    try {
      const dataObject = {
        topupId: id,
        keyword: text,
        page: currentPage,
        perPage: rowsPerPage
      }
      setShowLoadingModal(true)
      const response = await topupService.restoreTopup(dataObject);
      setUpdatedData(response.data?.data?.data)
      setShowLoadingModal(false);
    } catch (error) {
      setShowLoadingModal(false)
      console.log("error while restroring data", error);
    }
  }

  function buttonAction() {
    navigate("/create/subscribed")
  }

  async function handleActiveInactive(currentPage, rowsPerPage, text, status, id) {
    try {
      const dataObject = {
        status: status ? "0" : "1",
        topupId: id,
        keyword: text,
        page: currentPage,
        perPage: rowsPerPage
      }
      setShowLoadingModal(true)
      const response = await topupService.activeInactiveTopup(dataObject);
      setUpdatedData(response.data?.data?.data)
      setShowLoadingModal(false)
    } catch (error) {
      setShowLoadingModal(false)
      console.log("error while active inactive status", error);
    }
  }




  return (
    <div className="flex flex-col md:mx-4  mx-2     mt-3 min-h-screen bg-light dark:bg-dark">
      <Hamberger text={"Subscribed / List"} />
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
          buttonName={"Assign Subscription"}
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
      <Transition appear show={showLoadingModal} as={Fragment}>
        <Dialog as="div" className="relative z-[99999]" onClose={handleCloseLoadingModal}>
          <Transition.Child
            as={Fragment}
            enter={noFade ? "" : "duration-300 ease-out"}
            enterFrom={noFade ? "" : "opacity-0"}
            enterTo={noFade ? "" : "opacity-100"}
            leave={noFade ? "" : "duration-200 ease-in"}
            leaveFrom={noFade ? "" : "opacity-100"}
            leaveTo={noFade ? "" : "opacity-0"}
          >
            <div className="fixed inset-0 bg-slate-900/50 backdrop-filter backdrop-blur-sm" />
          </Transition.Child>
          <div className="fixed  inset-0 overflow-y-auto flex justify-center items-center">
            <Transition.Child
              as={Fragment}
              enter={noFade ? "" : "duration-300 ease-out"}
              enterFrom={noFade ? "" : "opacity-0 scale-95"}
              enterTo={noFade ? "" : "opacity-100 scale-100"}
              leave={noFade ? "" : "duration-200 ease-in"}
              leaveFrom={noFade ? "" : "opacity-100 scale-100"}
              leaveTo={noFade ? "" : "opacity-0 scale-95"}
            >
              <Dialog.Panel>
                <div className='flex  justify-center items-center'>
                  <LoadingSpinner />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  )
}

export default ListSubscribed
