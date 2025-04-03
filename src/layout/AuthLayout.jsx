import React, {  Suspense } from "react";
import { Outlet, useNavigate } from "react-router-dom";
// import Loading from "@/components/Loading";
import Loading from "../components/Loading/Loading";



const AuthLayout = () => {

  return (
    <>
      <Suspense fallback={<Loading />}>
        {<Outlet />}
      </Suspense>
    </>
  );
};

export default AuthLayout;
