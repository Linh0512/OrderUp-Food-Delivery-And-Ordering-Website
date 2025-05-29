import React from 'react'
import logo from '../assets/logo.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faNewspaper, faComment, faCartShopping, faList, faUser } from '@fortawesome/free-solid-svg-icons';

export default function Header() {
    const click = () => {
        console.log("click!!!")
    }
    return (
        <div className='flex space-x-3 w-full justify-between items-center mt-2 px-10'>
            <img src={logo} alt="logo" className='w-[10%]' />
            <div className='border rounded-2xl '>
                <input type="text" id="" placeholder='tìm địa điểm, món ăn,...' className='py-2 px-4 w-[30vw] text-center' />
                <button className='bg-green-400 py-2 px-4 rounded-r-2xl ' onClick={click}>
                    <FontAwesomeIcon icon={faMagnifyingGlass} color='green' className='shadow-2xl' />
                </button>
            </div>
            <select id="" className='border rounded-2xl p-2'>
                <option value="hanoi">Hà Nội</option>
                <option value="hochiminh">TP. Hồ Chí Minh</option>
                <option value="danang">Đà Nẵng</option>
                <option value="cantho">Cần Thơ</option>
                <option value="haiphong">Hải Phòng</option>
                <option value="khanhhoa">Khánh Hòa</option>
                <option value="lamdong">Lâm Đồng</option>
                <option value="quangninh">Quảng Ninh</option>
                <option value="thue">Thừa Thiên Huế</option>
                <option value="binhdinh">Bình Định</option>
            </select>
            <div className='flex space-x-5'>
                <button className='border rounded-2xl p-2 px-4'>
                    <FontAwesomeIcon icon={faNewspaper} />
                </button>
                <button className='border rounded-2xl p-2 px-4'>
                    <FontAwesomeIcon icon={faComment}/>
                </button>
                <div className='p-2 rounded-2xl border px-4'>
                    <span >0</span>
                    <button>
                        <FontAwesomeIcon icon={faCartShopping}/>
                    </button>
                </div>
                <button className='space-x-2 border p-2 rounded-2xl px-4'>
                    <FontAwesomeIcon icon={faList}/>
                    <FontAwesomeIcon icon={faUser}/>
                </button>
            </div>
        </div>
    )
}
