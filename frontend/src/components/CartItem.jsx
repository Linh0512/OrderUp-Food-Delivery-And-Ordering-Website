import { useState } from 'react'
import product from '../assets/product.jpg'
import ProductPopUp from './ProductPopUp'

export default function CartItem() {
    const [showPopup,setShowPopup]=useState(false)
  return (
    <div className='flex w-full shadow caret-transparent bg-white p-3'>
        <img src={product} alt="" className='w-[15%] h-auto object-contain shadow'/>
        <div className='flex justify-between w-full  ml-5'>
            <div className='space-y-4'>
                <p className='font-bold'>Cơm chiên dương châu</p>
                <p>Thêm ớt trái không hành</p>
                <button className='text-red-700' onClick={()=>setShowPopup(true)}>Chỉnh sửa</button>
            </div>
            <p className='font-semibold'>1</p>
            <p className='font-semibold'>59.000đ</p>
        </div>
        {showPopup && (
        <ProductPopUp handleClose={setShowPopup}/>
      )}
    </div>
  )
}
