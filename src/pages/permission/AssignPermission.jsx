import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
// import clientService from '@/services/roles/role.service';
import clientService from '../../services/clientService';
import { FaPlus } from "react-icons/fa";
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import LoadingSpinner from '../../components/Loading/LoadingSpinner';
import Hamberger from '../../components/Hamberger/Hamberger';
import Swal from "sweetalert2";

// import FormLoader from '@/Common/formLoader/FormLoader';

function AssignPermission() {

    const [pageLoading, setPageLoading] = useState(false)
    const [rolesListData, setRolesListData] = useState([]);
    const [rolesListData2, setRolesListData2] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [mainArr, setMainArr] = useState([])
    const navigate = useNavigate()
    const location = useLocation();
    const id = location?.state?.id;
    const name = location?.state?.name

    const { capability: capabilityarray, isCapability } = useSelector((state) => state.capabilitySlice)


    // console.log("rolesListData2", rolesListData2);
    // console.log("rolesListData",rolesListData);

    // console.log("capabilityarray",capabilityarray);





    // const { capability: capabilityarray, isCapability } = useSelector((state) => state.capabilitySlice)

    // console.log("rolesListData", rolesListData);
    // console.log("capabilityarray", capabilityarray);

    useEffect(() => {

        if (rolesListData2 && capabilityarray) {
            const mainArray = capabilityarray;
            let newArr1 = [];
            for (let i = 0; i < mainArray.length; i++) {
                const element = mainArray[i];
                const moduleName = element?.name;
                const menu = element?.menu;
                let array2 = []
                for (let i = 0; i < menu.length; i++) {
                    let dataObject = {
                        module: "",
                        feature: "",
                        menuList: {},

                    }
                    const menuElement = menu[i];
                    dataObject.module = moduleName;
                    dataObject.feature = menuElement?.displayName;
                    dataObject.menuList = menuElement?.subMenus;
                    array2.push(dataObject)
                }
                newArr1 = [...newArr1, ...array2]
            }



            const result = updateDisabledKeys(newArr1, rolesListData2);

            setRolesListData(result)


        }

    }, [capabilityarray, rolesListData2]);



    function updateDisabledKeys(arr1, arr2) {
        return arr2.map(item2 => {
            const matchingItem = arr1.find(item1 => item1.feature === item2.feature);

            if (matchingItem) {
                // Update menuList in arr2 based on arr1
                const updatedMenuList = Object.keys(item2.menuList).reduce((acc, key) => {
                    acc[key] = {
                        ...item2.menuList[key],
                        disabled: !matchingItem.menuList[key]?.access // disabled is true if access is false
                    };
                    return acc;
                }, {});

                return {
                    ...item2,
                    menuList: updatedMenuList
                };
            }
            return item2; // If no matching feature is found, return the item as is
        });
    }


    useEffect(() => {
        setPageLoading(true)
        const data = {
            roleId: id
        }

        if (id) {
            getParticularRoles(data)
        }
    }, [])

    async function getParticularRoles(data) {
        try {
            const response = await clientService.getParticularRolesAndPermissionList(data?.roleId);
            const mainArray = response?.data?.capability;
            let newArr1 = [];
            for (let i = 0; i < mainArray.length; i++) {
                const element = mainArray[i];
                const moduleName = element?.name;
                const menu = element?.menu;
                let array2 = []
                for (let i = 0; i < menu.length; i++) {
                    let dataObject = {
                        module: "",
                        feature: "",
                        menuList: {},

                    }
                    const menuElement = menu[i];
                    dataObject.module = moduleName;
                    dataObject.feature = menuElement?.displayName;
                    dataObject.menuList = menuElement?.subMenus;
                    array2.push(dataObject)
                }
                newArr1 = [...newArr1, ...array2]
            }
            setRolesListData2(newArr1);
            setPageLoading(false)
        } catch (error) {
            console.log("Error while getting particular Roles And Permission", error);
        }

    }

    // function handleCheckBox(id, feature) {
    //     const newArr = rolesListData2.map((item) => {
    //         if (item?.feature == feature) {
    //             for (const key in item?.menuList) {
    //                 if (item?.menuList.hasOwnProperty(key)) { // Check to ensure it's the object's own property
    //                     console.log(`${key}`);
    //                     const value = item?.menuList[key];
    //                     if (value.id == id) {
    //                         item.menuList[key].access = !item.menuList[key].access;
    //                         return item
    //                     }
    //                 }
    //             }
    //         } else {
    //             return item
    //         }
    //     });
    //     setRolesListData2(newArr)
    // }

    // function convertMenuData(inputData) {
    //     const output = [];
    //     const moduleMap = {};

    //     inputData.forEach(item => {
    //         const { module, feature, menuList } = item;

    //         // Create a new module entry if it doesn't exist
    //         if (!moduleMap[module]) {
    //             moduleMap[module] = {
    //                 name: module,
    //                 access: false,
    //                 menu: [],
    //             };
    //             output.push(moduleMap[module]);
    //         }

    //         // Check if any access is true in the menuList
    //         const hasAccess = Object.values(menuList).some(menuItem => menuItem.access === true);

    //         // Create a new menu entry
    //         const menuEntry = {
    //             subMenus: menuList,
    //             name: feature.replace("All ", ""), // Remove "All " from the feature name
    //             displayName: feature,
    //             access: hasAccess, // Set access based on the menuList
    //         };

    //         // Add the menu entry to the corresponding module
    //         moduleMap[module].menu.push(menuEntry);

    //         // If the menu has access, set the module access to true
    //         if (hasAccess) {
    //             moduleMap[module].access = true;
    //         }
    //     });

    //     return output;
    // }

    function handleCheckBox(id, feature) {
        const newArr = rolesListData.map((item) => {
            if (item?.feature == feature) {
                for (const key in item?.menuList) {
                    if (item?.menuList.hasOwnProperty(key)) { // Check to ensure it's the object's own property
                        console.log(`${key}`);
                        const value = item?.menuList[key];
                        if (value.id == id) {
                            item.menuList[key].access = !item.menuList[key].access;
                            return item
                        }
                    }
                }
            } else {
                return item
            }
        });
        setRolesListData(newArr)
    }

    function convertMenuData(inputData) {
        const output = [];
        const moduleMap = {};

        inputData.forEach(item => {
            const { module, feature, menuList } = item;

            // Create a new module entry if it doesn't exist
            if (!moduleMap[module]) {
                moduleMap[module] = {
                    name: module,
                    access: false,
                    menu: [],
                };
                output.push(moduleMap[module]);
            }

            // Check if any access is true in the menuList
            const hasAccess = Object.values(menuList).some(menuItem => menuItem.access === true);

            // Create a new menu entry
            const menuEntry = {
                subMenus: menuList,
                name: feature.replace("All ", ""), // Remove "All " from the feature name
                displayName: feature,
                access: hasAccess, // Set access based on the menuList
            };

            // Add the menu entry to the corresponding module
            moduleMap[module].menu.push(menuEntry);

            // If the menu has access, set the module access to true
            if (hasAccess) {
                moduleMap[module].access = true;
            }
        });

        return output;
    }

    async function handleSubmitRoles(e) {
        e.preventDefault();
        setIsSubmitting(true)
        const result = convertMenuData(rolesListData);
        const dataObject = {
            roleId: id,
            capability: result
        }
        try {
            const response = await clientService.submitRolesAndPermission(dataObject)
            toast.success(response?.data?.message)
            setIsSubmitting(false);
            Swal.fire({
                icon: "success",
                title: "Success",
                text: "Updated successfully!",
                timer: 1500,
                showConfirmButton: false,
            });
            // navigate("/roles-permissions-list")
        } catch (error) {
            console.log("Error while Submitting Roles And Permission", error);
        }

    }





    return (
        <>
            <div className="flex flex-col md:mx-4  mx-2  mt-3 min-h-screen  dark:bg-dark">
                <Hamberger text={"Assign / Permission"} />

                <div>
                    {
                        pageLoading ?
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    height: "80vh",
                                    alignItems: "center",
                                    flexDirection: "column",
                                }}
                            >
                                <span className=" mt-1 font-medium  text-sm flex flex-col py-5">
                                    {" "}
                                    <LoadingSpinner />
                                </span>
                            </div>
                            :
                            <div className="bg-cardBgLight dark:bg-cardBgDark rounded-lg shadow-lg  p-2 mb-6">
                                <div className='flex flex-col  overflow-hidden overflow-x-hidden  md:mx-auto px-0 '>
                                    <div className='  px-4 py-5 flex justify-between items-center  '>
                                        <div>
                                            <h1 className='text-xl'>Assign Permission to <span className='text-textLight dark:text-textDark font-body uppercase underline'>{name}</span> </h1>
                                        </div>
                                    </div>

                                    <div className='overflow-x-auto px-4'>
                                        <table className="min-w-full mt-5 table-fixed">
                                            <thead className="sticky top-0">
                                                <tr className="border-b border border-l-0 border-r-0 border-t-0 rounded-full bg-[#3f8e90] text-white  border-white dark:border-white">
                                                    <th scope="col" className="w-1/2 px-6 py-3 text-start text-xs font-semibold border-r border-white dark:border-white tracking-wider">
                                                        Feature
                                                    </th>
                                                    <th scope="col" className="w-1/8 px-6 py-3 text-start text-xs font-semibold tracking-wider">
                                                        View
                                                    </th>
                                                    <th scope="col" className="w-1/8 px-6 py-3 text-start text-xs font-semibold tracking-wider">
                                                        Create
                                                    </th>
                                                    <th scope="col" className="w-1/8 px-6 py-3 text-start text-xs font-semibold tracking-wider">
                                                        Edit
                                                    </th>
                                                    <th scope="col" className="w-1/8 px-6 py-3 text-start text-xs font-semibold tracking-wider">
                                                        Delete
                                                    </th>
                                                </tr>
                                            </thead>

                                            <tbody className="">
                                                {rolesListData && rolesListData.length > 0 && (() => {
                                                    const moduleRowSpanMap = {};
                                                    rolesListData.forEach((item, index) => {
                                                        if (!moduleRowSpanMap[item.module]) {
                                                            moduleRowSpanMap[item.module] = 1;
                                                        } else {
                                                            moduleRowSpanMap[item.module]++;
                                                        }
                                                    });

                                                    let renderedModules = new Set(); // Track rendered modules to avoid duplicates

                                                    return rolesListData.map((item, index) => (
                                                        <tr key={index} className="border-b border rounded-lg border-lightButton dark:border-white">
                                                            {renderedModules.add(item.module) && null}
                                                            <td className="px-6 py-4 whitespace-nowrap text-start border-r border-lightButton dark:border-white text-sm font-medium text-tableTextColor dark:text-white">
                                                                {item.feature}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-tableTextColor dark:text-white">
                                                                <div
                                                                    className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${item?.menuList?.view?.access ? "bg-lightButton dark:bg-primary" : "bg-gray-300 dar:bg-gray-100"}`}
                                                                    onClick={() => !item?.menuList?.view?.disabled && handleCheckBox(item?.menuList?.view?.id, item?.feature)}
                                                                >
                                                                    <div
                                                                        className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${item?.menuList?.view?.access ? "translate-x-4" : "translate-x-0"}`}
                                                                    ></div>
                                                                </div>
                                                            </td>

                                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-tableTextColor dark:text-white">
                                                                <div
                                                                    className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer  ${item?.menuList?.create?.access ? "bg-lightButton dark:bg-primary" : "bg-gray-300 dar:bg-gray-100"}`}
                                                                    onClick={() => !item?.menuList?.create?.disabled && handleCheckBox(item?.menuList?.create?.id, item?.feature)}
                                                                >
                                                                    <div
                                                                        className={`w-4 h-4 bg-white rounded-full shadow-md transform ${item?.menuList?.create?.access ? "translate-x-4" : "translate-x-0"
                                                                            }`}
                                                                    ></div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-tableTextColor dark:text-white">
                                                                <div
                                                                    className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer ${item?.menuList?.update?.access ? "bg-lightButton dark:bg-primary" : "bg-gray-300 dar:bg-gray-100"
                                                                        }`}
                                                                    onClick={() => !item?.menuList?.update?.disabled && handleCheckBox(item?.menuList?.update?.id, item?.feature)}
                                                                >
                                                                    <div
                                                                        className={`w-4 h-4 bg-white rounded-full shadow-md transform ${item?.menuList?.update?.access ? "translate-x-4" : "translate-x-0"
                                                                            }`}
                                                                    ></div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-tableTextColor dark:text-white">
                                                                <div
                                                                    className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer ${item?.menuList?.softDelete?.access ? "bg-lightButton dark:bg-primary" : "bg-gray-300 dar:bg-gray-100"
                                                                        }`}
                                                                    onClick={() => !item?.menuList?.softDelete?.disabled && handleCheckBox(item?.menuList?.softDelete?.id, item?.feature)}
                                                                >
                                                                    <div
                                                                        className={`w-4 h-4 bg-white rounded-full shadow-md transform ${item?.menuList?.softDelete?.access ? "translate-x-4" : "translate-x-0"
                                                                            }`}
                                                                    ></div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ));
                                                })()}
                                            </tbody>
                                        </table>


                                    </div>
                                    <div className="flex flex-wrap  items-center mt-5 px-3 pb-4">
                                        <div className="w-[100%] flex justify-end text-right">
                                            <button
                                                text="Save"
                                                className="w-auto text-sm p-2 text-white py-2 rounded-lg transition-all duration-300 ease-in-out 
                bg-custom-gradient-button-dark dark:bg-custom-gradient-button-light 
                 hover:bg-custom-gradient-button-light dark:hover:bg-custom-gradient-button-dark 
                 flex items-center justify-center shadow-lg"
                                                onClick={handleSubmitRoles}
                                                isLoading={loading}
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
                                                ) : (
                                                    `Update`
                                                )}
                                            </button>


                                        </div>
                                    </div>
                                </div>
                            </div>
                    }

                </div>

            </div>

        </>
    )
}

export default AssignPermission