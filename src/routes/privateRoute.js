import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const privateRoute = ({isLoggedIn}) => {
  return isLoggedIn ? (
    <Outlet/>
  ) : 

  <Navigate to="/login" />
}

export default privateRoute