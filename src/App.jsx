import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, useEffect, useState } from "react";

import AuthLayout from "./layout/AuthLayout";

const Layout = lazy(() => import("./layout/Layout"));
const Login = lazy(() => import("../src/pages/login/Login"));
const SignUp = lazy(() => import("../src/pages/signup/SignUp"));
const Profile = lazy(() => import("../src/pages/profile/Profile"))
const Home = lazy(() => import("../src/pages/home/Home"));
const CreateCustomField = lazy(() => import("../src/pages/demo/customField/CreateCustomField"));
const CreateCompany = lazy(() => import("../src/pages/company/CreateCompany"));
const CreateClients = lazy(() => import("../src/pages/clients/CreateClients"));
const ListClients = lazy(() => import("../src/pages/clients/ListClients"));
const NotFound = lazy(() => import("../src/pages/404NotFound/NotFound"));
const ListCompany = lazy(() => import("../src/pages/company/ListCompany"));
const ListSubscriptionPlan = lazy(() => import("../src/pages/subscriptionPlan/ListSubscriptionPlan"));
const CreateSubscriptionPlan = lazy(() => import("../src/pages/subscriptionPlan/CreateSubscriptionPlan"));
const ListTopup = lazy(() => import("../src/pages/topup/ListTopup"));
const CreateTopup = lazy(() => import("../src/pages/topup/CreateTopup"));
const ListSubscribed = lazy(() => import("../src/pages/subscribed/ListSubscribed"));
const CreatedSubscribed = lazy(() => import("../src/pages/subscribed/CreatedSubscribed"));
const ViewSubscribed = lazy(() => import("../src/pages/subscribed/ViewSubscribed"));
const ListOrganization = lazy(() => import("../src/pages/organization/ListOrganization"));
const CreateOrganization = lazy(() => import("../src/pages/organization/CreateOrganization"));
const ViewOrganization = lazy(() => import("../src/pages/organization/ViewOrganization"));
const ListFields = lazy(() => import("../src/pages/customField/CustomField"));
const SubmitForm = lazy(() => import("../src/pages/customField/SubmitForm"));
const AdjustOrder = lazy(() => import("../src/pages/customField/AdjustOrder"));
const FormPassword = lazy(() => import("../src/pages/customField/FormPassword"));
const EditForm = lazy(() => import("../src/pages/customField/EditForm"));
const ListForms = lazy(() => import("../src/pages/customField/ListForm"));
const UserList = lazy(() => import("../src/pages/user/UserList"));
const CreateUser = lazy(() => import("../src/pages/user/CreateUser"));
const AssignUser = lazy(() => import("../src/pages/user/AssignUser"));
const ListStaff = lazy(() => import("../src/pages/staff/ListStaff"));
const CreateStaff = lazy(() => import("../src/pages/staff/CreateStaff"));
const EditFormByAdmin = lazy(() => import("../src/pages/customField/EditFormByAdmin"));
const ListPermission = lazy(() =>  import("../src/pages/permission/ListPermission"));
const AssignPermission = lazy(() => import("../src/pages/permission/AssignPermission"));
const DemoRequest = lazy(() => import("../src/pages/DemoRequest/DemoRequest"));
const CreateDemoRequest = lazy(() => import("../src/pages/DemoRequest/CreateDemoRequest"));

const LandingPage = lazy(() => import("../src/pages/landingPage/LandingPage"))

import PublicRoute from "./routes/PublicRoute";
import PrivateRoute from "./routes/PrivateRoute";


// import Home from "./pages/home/Home";
import useDarkmode from "./Hooks/useDarkMode";
import { useSelector } from "react-redux";
// import FormPassword from "./pages/customField/formPassword";

export default function App() {

  const { isAuth: isLoggedIn } = useSelector((state) => state?.authCustomerSlice);
  const [isDark] = useDarkmode();
  const [companyIdentifier, setCompanyIdentifier] = useState(null);


  useEffect(() => {
    const loadingScreen = document.getElementById("loading-screen");
    if (loadingScreen) {
      loadingScreen.style.display = "none";
    }
  }, []);

  useEffect(() => {
    const hostname = window.location.hostname;
    const port = window.location.port;
    if (import.meta.env.VITE_NODE_ENV === 'development') {
      setCompanyIdentifier(port || '3000');
    } else {
      const subdomain = hostname.split('.')[0];
      setCompanyIdentifier(subdomain);
    }
  }, []);

  return (
    <main
      className={`${isDark ? "bg-dark text-white" : "bg-light"}`}
      style={{
        width: "100vw",
        height: "100vh",
        overflowX: "hidden",
        overflowY: "hidden",
      }}
    >
      <Routes>
        <Route path="/" element={<AuthLayout />}>
          {/* <Route index element={<Navigate to="/list/company" />} /> */}

          <Route path="/form/:formId" element={<SubmitForm />} />
          <Route path="/editform/:formId/:id" element={<EditForm />} />
          <Route path="/passwordForm/auth/:formId" element={<FormPassword />} />
          <Route element={<PublicRoute isLoggedIn={isLoggedIn} />} >
            <Route path="/" element={<LandingPage companyIdentifier={companyIdentifier} />} />
            <Route path="/login" element={<Login companyIdentifier={companyIdentifier} />} />
            <Route path="/signup" element={<SignUp />} />
          </Route>

          <Route element={<PrivateRoute isLoggedIn={isLoggedIn} />} >
            <Route path="/" element={<Layout />}>
              <Route path="home1" element={<Home />} />
              <Route path="profile" element={<Profile />} />
              <Route path="list/permissions" element={<ListPermission />} />
              <Route path="assign/permissions" element={<AssignPermission />} />
              <Route path="createCustomField" element={<CreateCustomField />} />
              <Route path="create/companies" element={<CreateCompany />} />
              <Route path="update/companies" element={<CreateCompany />} />
              <Route path="view/companies" element={<CreateCompany />} />
              <Route path="list/companies" element={<ListCompany />} />
              <Route path="create/clients" element={<CreateClients />} />
              <Route path="update/clients" element={<CreateClients />} />
              <Route path="view/clients" element={<CreateClients />} />
              <Route path="list/clients" element={<ListClients />} />
              <Route path="list/request" element={<DemoRequest />} />
              <Route path="create/request" element={<CreateDemoRequest />} />
              <Route path="view/request" element={<CreateDemoRequest />} />
              <Route path="create/user" element={<CreateUser />} />
              <Route path="update/user" element={<CreateUser />} />
              <Route path="view/user" element={<CreateUser />} />
              <Route path="list/user" element={<UserList />} />
              <Route path="create/staffs" element={<CreateStaff />} />
              <Route path="update/staffs" element={<CreateStaff />} />
              <Route path="view/staffs" element={<CreateStaff />} />
              <Route path="list/staff" element={<ListStaff />} />
              <Route path="assign/user" element={<AssignUser />} />
              <Route path="list/subscription" element={<ListSubscriptionPlan />} />
              <Route path="create/subscription" element={<CreateSubscriptionPlan />} />
              <Route path="update/subscription" element={<CreateSubscriptionPlan />} />
              <Route path="view/subscription" element={<CreateSubscriptionPlan />} />
              <Route path="list/topup" element={<ListTopup />} />
              <Route path="create/topup" element={<CreateTopup />} />
              <Route path="update/topup" element={<CreateTopup />} />
              <Route path="view/topup" element={<CreateTopup />} />
              <Route path="list/subscribed" element={<ListSubscribed />} />
              <Route path="create/subscribed" element={<CreatedSubscribed />} />
              <Route path="view/subscribed" element={<ViewSubscribed />} />
              <Route path="create/organization" element={<CreateOrganization />} />
              <Route path="view/organization" element={<ViewOrganization />} />
              <Route path="list/organization" element={<ListOrganization />} />
              <Route path="list/fields" element={<ListFields />} />
              <Route path="list/adjustOrder" element={<AdjustOrder />} />
              <Route path="list/forms/:sessionId" element={<ListForms />} />
              <Route path="editformbyadmin/:formId/:id" element={<EditFormByAdmin />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Route>


        </Route>
      </Routes>
    </main>
  );
}
