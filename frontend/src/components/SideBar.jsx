import React from 'react'
import logo from '../assets/logo.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartPie } from '@fortawesome/free-solid-svg-icons'

export default function SideBar() {
  return (
    <div className='w-[20vw] p-5 px-10'>
        <img src={logo} alt=""  className='w-[40%]'/>
        <div className='bg-gray-400 p-5 rounded-2xl'>
            <div className='flex items-center space-x-2 text-white font-bold hover:sidebar_selected'>
                <FontAwesomeIcon icon={faChartPie}/>
                <p>Dashboard</p>
            </div>
        </div>
    </div>
  )
}
