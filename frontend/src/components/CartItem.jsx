import { useState } from 'react'
import product from '../assets/product.jpg'
import ProductPopUp from './ProductPopUp'

export default function CartItem({cartItem}) {
    const [showPopup,setShowPopup]=useState(false)
  return (
    <div className='flex w-full shadow caret-transparent bg-white p-3'>
        <img src={cartItem.dishImage} alt={cartItem.dishName} className='w-[15%] h-auto object-contain shadow'/>
        <div className='flex justify-between w-full  ml-5'>
            <div className='space-y-4'>
                <p className='font-bold'>{cartItem.dishName}</p>
                <p>{cartItem.specialInstructions}</p>
                <button className='text-red-700' onClick={()=>setShowPopup(true)}>Chỉnh sửa</button>
            </div>
            <p className='font-semibold'>{cartItem.quantity}</p>
            <p className='font-semibold'>{cartItem.unitPrice}</p>
        </div>
        {showPopup && (
        <ProductPopUp handleClose={setShowPopup} cartItem={cartItem}/>
      )}
    </div>
  )
}
