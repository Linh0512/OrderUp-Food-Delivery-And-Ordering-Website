import React from 'react'
import SideBar from '../components/SideBar'
import { Outlet } from 'react-router-dom'

export default function RestaurentLayout() {
  return (
    <div className='flex'>
        <SideBar/>
        <Outlet/>
    </div>
  )
}
