import React, { Suspense, useEffect } from 'react'

import { Outlet, useLocation } from 'react-router-dom'
import Header from '../Header/Header'
import Loading from '../Loading/Loading'

const MainContent = ({ isCollapsed, setIsCollapsed, toggleSidebar }) => {

  



  return (
    <div className='w-[100%] h-full    '>

      <Suspense fallback={<Loading />}>
        <Outlet />
      </Suspense>
    </div>
  )
}

export default MainContent


function InnerLoading() {
  return (
    <div className='flex w-[100%] h-full flex-col justify-center items-center'>
      <p className='text-white'>Loading...</p>
    </div>
  )
}