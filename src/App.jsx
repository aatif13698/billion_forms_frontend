import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, useEffect, useState } from "react";

import AuthLayout from "./layout/AuthLayout";

const Layout = lazy(() => import("./layout/Layout"));
const Login = lazy(() => import("../src/pages/login/Login"));
const SignUp = lazy(() => import("../src/pages/signup/SignUp"));
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

import PublicRoute from "./routes/PublicRoute";
import PrivateRoute from "./routes/PrivateRoute";


// import Home from "./pages/home/Home";
import useDarkmode from "./Hooks/useDarkMode";
import { useSelector } from "react-redux";

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

          <Route element={<PublicRoute isLoggedIn={isLoggedIn} />} >
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login companyIdentifier={companyIdentifier} />} />
            <Route path="/signup" element={<SignUp />} />
          </Route>


          {/* testing */}

          <Route element={<PrivateRoute isLoggedIn={isLoggedIn} />} >
            <Route path="/" element={<Layout />}>
              <Route path="home1" element={<Home />} />
              <Route path="createCustomField" element={<CreateCustomField />} />
              <Route path="create/company" element={<CreateCompany />} />
              <Route path="list/company" element={<ListCompany />} />
              <Route path="create/clients" element={<CreateClients />} />
              <Route path="list/clients" element={<ListClients />} />
              <Route path="list/subscription" element={<ListSubscriptionPlan />} />
              <Route path="create/subscription" element={<CreateSubscriptionPlan />} />
              <Route path="list/topup" element={<ListTopup />} />
              <Route path="create/topup" element={<CreateTopup />} />
              <Route path="list/subscribed" element={<ListSubscribed />} />
              <Route path="create/subscribed" element={<CreatedSubscribed />} />
              <Route path="view/subscribed" element={<ViewSubscribed />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Route>


        </Route>


      </Routes>
    </main>
  );
}
