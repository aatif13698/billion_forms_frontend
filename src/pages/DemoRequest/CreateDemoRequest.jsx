


import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import { FaEye, FaEyeSlash } from "react-icons/fa";
import demoRequestService from "../../services/demoRequestService";
import common from "../../helper/common";
import Hamberger from "../../components/Hamberger/Hamberger";
import "../../App.css";
import subscriptionService from "../../services/subscriptionService";
import subscribedUserService from "../../services/subscribedUserService";

function CreateDemoRequest() {
  const location = useLocation();
  const navigate = useNavigate();
  const pathName = location?.pathname;
  const client = location?.state?.client;

  const { capability } = useSelector((state) => state.capabilitySlice);
  const [permission, setPermission] = useState(null);
  console.log("permission", permission);
  console.log("request data", client);



  const [subscriptions, setSubscriptions] = useState([]);


  useEffect(() => {

    getSubscriptionPlan()

  }, [])
  async function getSubscriptionPlan(params) {
    try {
      const response = await subscriptionService.getAllDemoSubscriptionPlan();
      console.log("all", response);
      setSubscriptions(response?.data?.data?.data)
    } catch (error) {
      console.log("error while getting the subscription plans");
    }
  }






  const [selectedSubscriptioin, setSelectedSubscription] = useState(null)

  const [formData2, setFormData2] = useState({
    subscriptionId: "",
  });


  const handleChange2 = (e) => {
    const { name, value } = e.target;
    setFormData2({ ...formData2, [name]: value });
    let newErrors = { ...errors };
    if (name == "userId") {
      if (!value) {
        newErrors.userId = "Client is required";
      } else {
        delete newErrors.userId;
      }
    }
    if (name == "subscriptionId") {
      if (!value) {
        newErrors.subscriptionId = "Plan is required";
      } else {
        delete newErrors.subscriptionId;
        const subsc = subscriptions?.length > 0 ? subscriptions?.find((item) => item?._id == value) : null
        setSelectedSubscription(subsc)
      }
    }
    setErrors(newErrors);
  };


  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [replyData, setReplyData] = useState({
    subject: "",
    message: "",
    meetingLink: "",
  });

  const [replies, setReplies] = useState([]);
  const [errors, setErrors] = useState({});
  const [replyErrors, setReplyErrors] = useState({});
  const [responseError, setResponseError] = useState([]);
  const [demoResponseError, setDemoResponseError] = useState([]);
  const [demoCheckError, setDemoCheckError] = useState([]);
  const [isAlreadyExists, setIsAlreadyExists] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReplySubmitting, setIsReplySubmitting] = useState(false);
  const [isDemoSubmitting, setIsDemoSubmitting] = useState(false);

  console.log("replies", replies);

  const emailRegex = /\S+@\S+\.\S+/;
  const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/;

  // Populate form with client data if available
  useEffect(() => {
    if (client) {
      setFormData({
        name: client?.name || "",
        email: client?.email || "",
        phone: client?.phone || "",
        message: client?.message || "",
      });
      setReplies(client?.replies || []);
    }
  }, [client]);

  // Check permissions
  useEffect(() => {
    if (!capability || capability.length === 0) return;
    const administration = capability.find((item) => item?.name === "Administration");
    if (!administration) return;
    const staffMenu = administration.menu?.find((menu) => menu?.name === "Request");
    if (!staffMenu) return;
    setPermission([staffMenu]);
    const accessMap = {
      "/view/request": staffMenu.subMenus?.view?.access,
      "/update/request": staffMenu.subMenus?.update?.access,
      "/create/request": staffMenu.subMenus?.create?.access,
    };
    const hasAccess = accessMap[pathName];
    if (hasAccess === false) {
      Swal.fire({
        icon: "error",
        title: "Unauthorized",
        text: "You are not authorized to access this page!",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1500,
      });
      navigate("/home");
    }
  }, [capability, pathName, navigate]);

  // Fetch replies for the request
  useEffect(() => {
    if (client && pathName === "/view/request") {
      const fetchReplies = async () => {
        try {
          const response = await demoRequestService.getParticularRequest(client._id);
          console.log("get part req", response);

          setReplies(response?.data?.data?.data?.replies || []);
        } catch (error) {
          setResponseError(["Failed to fetch replies"]);
        }
      };
      const checkSubscripbed = async () => {
        try {
          const response = await subscribedUserService.checkSubscribed(client.email);
          setIsAlreadyExists(false);
        } catch (error) {
          setDemoCheckError([error || "An error occurred while processing the request"]);
          setIsAlreadyExists(true);
        }
      };
      fetchReplies();
      checkSubscripbed()
    }
  }, [client, pathName]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    let newErrors = { ...errors };
    if (name === "name") {
      newErrors.name = value.trim() ? "" : "Name is required";
    }
    if (name === "message") {
      newErrors.message = value.trim() ? "" : "Message is required";
    }
    if (name === "email") {
      if (!value.trim()) {
        newErrors.email = "Email is required";
      } else if (!emailRegex.test(value)) {
        newErrors.email = "Please enter a valid email address";
      } else {
        newErrors.email = "";
      }
    }
    if (name === "phone") {
      if (!value.trim()) {
        newErrors.phone = "Phone number is required";
      } else if (!phoneRegex.test(value)) {
        newErrors.phone = "Please enter a valid phone number (e.g., 123-456-7890)";
      } else {
        newErrors.phone = "";
      }
    }
    setErrors(newErrors);
  };

  const handleReplyChange = (e) => {
    const { name, value } = e.target;
    setReplyData({ ...replyData, [name]: value });

    let newErrors = { ...replyErrors };
    if (name === "subject") {
      newErrors.subject = value.trim() ? "" : "Subject is required";
    }
    if (name === "message") {
      newErrors.message = value.trim() ? "" : "Reply message is required";
    }
    if (name === "meetingLink") {
      newErrors.meetingLink = value.trim() && !urlRegex.test(value) ? "Please enter a valid URL" : "";
    }
    setReplyErrors(newErrors);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number (e.g., 123-456-7890)";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateReplyForm = () => {
    const newErrors = {};
    if (!replyData.subject.trim()) newErrors.subject = "Subject is required";
    if (!replyData.message.trim()) newErrors.message = "Reply message is required";
    if (replyData.meetingLink.trim() && !urlRegex.test(replyData.meetingLink)) {
      newErrors.meetingLink = "Please enter a valid URL";
    }
    setReplyErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const dataObject = {
        name: formData.name,
        message: formData.message,
        email: formData.email,
        phone: formData.phone,
      };
      let response;
      if (client) {
        // response = await demoRequestService.updateRequest(client._id, dataObject);
      } else {
        response = await demoRequestService.createRequest(dataObject);
      }
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
      setErrors({});
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: client ? "Updated Successfully" : "Created Successfully",
        showConfirmButton: false,
        timer: 1500,
        toast: true,
        customClass: { popup: "my-toast-size" },
      });
      navigate("/list/request");
    } catch (error) {
      console.error("Error processing request:", error);
      setResponseError([error.message || "An error occurred while processing the request"]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!validateReplyForm()) return;
    setIsReplySubmitting(true);
    try {
      const replyObject = {
        subject: replyData.subject,
        message: replyData.message,
        meetingLink: replyData.meetingLink || null,
      };
      const response = await demoRequestService.addReply(client._id, replyObject);
      console.log("add reply response ", response);

      setReplies([...response?.data?.data?.replies]);
      setReplyData({ subject: "", message: "", meetingLink: "" });
      setReplyErrors({});
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Reply Sent Successfully",
        showConfirmButton: false,
        timer: 1500,
        toast: true,
        customClass: { popup: "my-toast-size" },
      });
    } catch (error) {
      console.error("Error sending reply:", error);
      setResponseError([error.message || "An error occurred while sending the reply"]);
    } finally {
      setIsReplySubmitting(false);
    }
  };

  const validateForm2 = () => {
    let newErrors = {};
    if (!formData2.subscriptionId) newErrors.subscriptionId = "Plan is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmitDemo = async (e) => {
    e.preventDefault();
    if (!validateForm2()) return;
    setIsDemoSubmitting(true);
    try {

      const dataObject = {
        email: formData.email,
        firstName: formData.name,
        phone: formData.phone,
        subscriptionId: formData2.subscriptionId
      }
      const response = await subscribedUserService.createDemoSubscribedUser(dataObject);

      console.log("response ddd", response?.data?.data?.subscription?._id);
      
      setFormData2({
        subscriptionId: "",
      });
      setIsDemoSubmitting(false);
      handleView(response?.data?.data?.subscription?._id)
      // navigate("/list/subscribed")
    } catch (error) {
      console.error("Error creating customer plan:", error);
      const errorMessage = error || 'An error occurred while creating customer plan';
      setDemoResponseError([errorMessage]);
    } finally {
      setIsDemoSubmitting(false);
    }
  };


   async function handleView(id) {
      try {
          // setShowLoadingModal(true)
          const response = await subscribedUserService.getParticularSubscribedUser(id);
          // setShowLoadingModal(false);
          setTimeout(() => {
            navigate("/view/lead", { state: { company: response?.data?.data } })
          }, 600);
      } catch (error) {
        setShowLoadingModal(false)
        console.log("error while getting topup data", error);
      }
    }
  

  return (
    <div className="flex flex-col mx-2 md:mx-4 mt-3 min-h-screen bg-light dark:bg-dark">
      <Hamberger
        text={
          pathName === "/view/request"
            ? "Request / View"
            : client
              ? "Request / Update"
              : "Request / Add New"
        }
      />
      <div className="w-[100%] mb-20 bg-cardBgLight dark:bg-cardBgDark shadow-lg rounded-lg p-6">
        <h2 className="text-1xl md:text-2xl font-semibold text-formHeadingLight dark:text-formHeadingDark mb-2 md:mb-4 text-start">
          {pathName === "/view/request"
            ? "View Request"
            : client
              ? "Update Request"
              : "Create Request"}
        </h2>
        <div className="h-[1.8px] bg-black dark:bg-white mb-4"></div>

        {/* Request Form */}
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-formLabelLight dark:text-formLabelDark mb-1 font-medium">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-[100%] bg-transparent p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter name"
              disabled={pathName === "/view/request"}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-formLabelLight dark:text-formLabelDark mb-1 font-medium">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-[100%] bg-transparent p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter email"
              disabled={pathName === "/view/request"}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-formLabelLight dark:text-formLabelDark mb-1 font-medium">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              onInput={common.handleKeyPress}
              className="w-[100%] bg-transparent p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter phone number (e.g., 123-456-7890)"
              disabled={pathName === "/view/request"}
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>
          <div>
            <label className="block text-formLabelLight dark:text-formLabelDark mb-1 font-medium">
              Message
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="w-[100%] bg-transparent p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter message..."
              disabled={pathName === "/view/request"}
            />
            {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
          </div>
          {pathName !== "/view/request" && (
            <div className="col-span-1 md:col-span-2 flex justify-end mt-4">
              <button
                type="submit"
                className="w-auto p-2 text-sm text-white rounded-lg transition-all duration-300 ease-in-out bg-custom-gradient-button-dark dark:bg-custom-gradient-button-light hover:bg-custom-gradient-button-light dark:hover:bg-custom-gradient-button-dark flex items-center justify-center shadow-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin mr-2 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Submitting...
                  </>
                ) : client ? (
                  "Update Request"
                ) : (
                  "Create Request"
                )}
              </button>
            </div>
          )}
        </form>


        {
          isAlreadyExists ?
           <>
           {demoCheckError.length > 0 && (
                <div className="w-[100%] mt-4 flex flex-col mb-2 gap-1 p-4 bg-green-100 rounded-md">
                  {demoCheckError.map((error, index) => (
                    <p key={index} className="text-green-700 text-sm">{error}</p>
                  ))}
                </div>
              )}
          </> :

            <div className="bg-gray-100 dark:bg-gray-100/20 p-2 rounded-md mt-2">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">

                <div className="">
                  <label className="block text-formLabelLight dark:text-formLabelDark mb-1 font-medium">Demo Plan</label>
                  <select
                    name="subscriptionId"
                    value={formData2?.subscriptionId}
                    className="w-[100%] bg-white text-black dark:bg-cardBgDark dark:text-white p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => handleChange2(e)}
                  >
                    <option value="">--Select Plan--</option>
                    {subscriptions && subscriptions?.length > 0 &&
                      subscriptions?.map((item) => (
                        <option
                          key={item?.serialNumber}
                          value={item?._id}
                          className="bg-white text-black dark:bg-cardBgDark dark:text-white"
                        >
                          {item?.name}
                        </option>
                      ))}
                  </select>
                  {errors.subscriptionId && <p className="text-red-500 text-sm mt-1">{errors?.subscriptionId}</p>}
                </div>

                {
                  selectedSubscriptioin && (
                    <>
                      <div className="">
                        <label className="block text-formLabelLight dark:text-formLabelDark mb-1 font-medium">
                          Start Date
                        </label>
                        <input
                          type="text"
                          className="w-[100%] bg-white text-black dark:bg-cardBgDark dark:text-white p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={new Date().toLocaleDateString()} // e.g., "5/25/2025"
                          readOnly
                        />
                      </div>
                      <div className="">
                        <label className="block text-formLabelLight dark:text-formLabelDark mb-1 font-medium">
                          End Date
                        </label>
                        <input
                          type="text"
                          className="w-[100%] bg-white text-black dark:bg-cardBgDark dark:text-white p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={selectedSubscriptioin?.validityPeriod == "infinite" ? "Unlimited" : common.calculateEndDate(selectedSubscriptioin?.validityPeriod)} // e.g., "5/25/2025"
                          readOnly
                        />
                      </div>
                    </>
                  )
                }
              </div>

              {demoResponseError.length > 0 && (
                <div className="w-[100%] mt-4 flex flex-col mb-2 gap-1 p-4 bg-red-100 rounded-md">
                  {demoResponseError.map((error, index) => (
                    <p key={index} className="text-red-700 text-sm">{error}</p>
                  ))}
                </div>
              )}

              <div className="flex justify-end">
                <button
                  onClick={handleSubmitDemo}
                  className="w-auto p-2 text-sm text-white rounded-lg transition-all duration-300 Getting an error: JSX element type 'xaiArtifact' does not have any construct or call signatures.ts(2604) ease-in-out bg-custom-gradient-button-dark dark:bg-custom-gradient-button-light hover:bg-custom-gradient-button-light dark:hover:bg-custom-gradient-button-dark flex items-center justify-center shadow-lg"
                  disabled={isDemoSubmitting}
                >
                  {isDemoSubmitting ? (
                    <>
                      <svg
                        className="animate-spin mr-2 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Assiging...
                    </>
                  ) : (
                    "Assign Access"
                  )}
                </button>
              </div>


            </div>
        }





        {/* Replies List */}
        {pathName === "/view/request" && replies.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-formHeadingLight dark:text-formHeadingDark mb-4">
              Previous Replies
            </h3>
            <div className="space-y-4">
              {replies.map((reply, index) => (
                <div
                  key={reply._id || index}
                  className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-lg font-medium text-formLabelLight dark:text-formLabelDark">
                      {reply.subject}
                    </h4>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(reply.sentAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-formLabelLight dark:text-formLabelDark">{reply.message}</p>
                  {reply.meetingLink && (
                    <a
                      href={reply.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline mt-2 inline-block"
                    >
                      Join Meeting
                    </a>
                  )}
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Sent by: {reply.sentBy?.firstName + " " + reply.sentBy?.lastName || "Admin"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reply Form (Visible only in view mode for admins) */}
        {pathName === "/view/request" && permission?.[0]?.subMenus?.update?.access && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-formHeadingLight dark:text-formHeadingDark mb-4">
              Reply to Request
            </h3>
            <form className="grid grid-cols-1 gap-4" onSubmit={handleReplySubmit}>
              <div>
                <label className="block text-formLabelLight dark:text-formLabelDark mb-1 font-medium">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={replyData.subject}
                  onChange={handleReplyChange}
                  className="w-[100%] bg-transparent p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter reply subject"
                />
                {replyErrors.subject && (
                  <p className="text-red-500 text-sm mt-1">{replyErrors.subject}</p>
                )}
              </div>
              <div>
                <label className="block text-formLabelLight dark:text-formLabelDark mb-1 font-medium">
                  Reply Message
                </label>
                <textarea
                  name="message"
                  value={replyData.message}
                  onChange={handleReplyChange}
                  className="w-[100%] bg-transparent p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter reply message..."
                  rows="4"
                />
                {replyErrors.message && (
                  <p className="text-red-500 text-sm mt-1">{replyErrors.message}</p>
                )}
              </div>
              <div>
                <label className="block text-formLabelLight dark:text-formLabelDark mb-1 font-medium">
                  Meeting Link (Optional)
                </label>
                <input
                  type="text"
                  name="meetingLink"
                  value={replyData.meetingLink}
                  onChange={handleReplyChange}
                  className="w-[100%] bg-transparent p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter meeting link (e.g., https://meet.example.com)"
                />
                {replyErrors.meetingLink && (
                  <p className="text-red-500 text-sm mt-1">{replyErrors.meetingLink}</p>
                )}
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="w-auto p-2 text-sm text-white rounded-lg transition-all duration-300 Getting an error: JSX element type 'xaiArtifact' does not have any construct or call signatures.ts(2604) ease-in-out bg-custom-gradient-button-dark dark:bg-custom-gradient-button-light hover:bg-custom-gradient-button-light dark:hover:bg-custom-gradient-button-dark flex items-center justify-center shadow-lg"
                  disabled={isReplySubmitting}
                >
                  {isReplySubmitting ? (
                    <>
                      <svg
                        className="animate-spin mr-2 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    "Send Reply"
                  )}
                </button>
              </div>
            </form>
          </div>
        )}



        {responseError.length > 0 && (
          <div className="w-[100%] mt-4 flex flex-col gap-1 p-4 bg-red-100 rounded-md">
            {responseError.map((error, index) => (
              <p key={index} className="text-red-700 text-sm">{error}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CreateDemoRequest;