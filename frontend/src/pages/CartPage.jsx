import { faAngleLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

export default function CartPage() {
  return (
    <div className='w-[80vw]'>
        <div className='flex items-center'>
            <button className='flex items-center'>
                <FontAwesomeIcon icon={faAngleLeft} className='text-xl mr-1'/>
                trở lại
            </button>
            <h2>
                Giỏ hàng của tôi 
            </h2>
        </div>
    </div>
  )
}
