import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const publicRoute = ({ isLogin }) => {
    return isLogin ? <Navigate to="/home" replace /> : (
        <Outlet />
    )


}

export default publicRoute