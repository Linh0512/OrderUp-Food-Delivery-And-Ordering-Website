import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faFacebookSquare,faInstagramSquare} from '@fortawesome/free-brands-svg-icons'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'

export default function Footer() {
  return (
    <footer className='flex items-center justify-between p-5'>
        <div className='flex space-x-10'>
            <div className='space-y-3'>
                <h3 className='font-bold text-xl'>Về chúng tôi</h3>
                <Link to="/about"><p className='underline'>Giới thiệu</p></Link>
                <Link to="/contact"><p className='underline'>Liên hệ</p></Link>
                <Link to="/terms"><p className='underline'>Điều khoản sử dụng</p></Link>
                <Link to="/faq"><p className='underline'>Câu hỏi thường gặp</p></Link>
            </div>
            <div className='space-y-3'>
                <h3 className='font-bold text-xl'>Chính sách</h3>
                <Link to="/shipping-policy"><p className='underline'>Chính sách giao hàng</p></Link>
                <Link to="/return-policy"><p className='underline'>Chính sách đổi trả</p></Link>
                <Link to="/privacy-policy"><p className='underline'>Chính sách bảo mật</p></Link>
                <Link to="/data-policy"><p className='underline'>Chính sách thu thập & sử dụng dữ liệu cá nhân</p></Link>
            </div>
        </div>
        <div className='flex flex-col space-y-3 justify-around items-end'>
            <div className='text-2xl space-x-2'>
                <FontAwesomeIcon icon={faFacebookSquare} />
                <FontAwesomeIcon icon={faInstagramSquare} />
                <FontAwesomeIcon icon={faEnvelope} />
            </div>
            <img src={logo} alt="" className='h-15'/>
            <h2>&copy; MADE BY NHÓM 7</h2>
        </div>
    </footer>
  )
}
