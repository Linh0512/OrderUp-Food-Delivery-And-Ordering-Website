import React from 'react'
import SideBar from '../components/SideBar'
import { Outlet } from 'react-router-dom'

export default function RestaurentLayout() {
  return (
    <div className='flex'>
        <SideBar/>
        <hr className="h-auto w-px bg-gray-200 border-0 " style={{height: "100vh"}}/>
        <Outlet/>
    </div>
  )
}
