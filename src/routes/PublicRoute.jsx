import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const PublicRoute = ({ isLoggedIn }) => {
    console.log("isLogin",isLoggedIn);
    
    return isLoggedIn ? <Navigate to="/dashboard" replace /> : (
        <Outlet />
    )


}

export default PublicRoute