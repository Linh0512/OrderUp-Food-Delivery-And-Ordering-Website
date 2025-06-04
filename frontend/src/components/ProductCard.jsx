
import product from '../assets/product.jpg'
import ProductPopUp from './ProductPopUp'

export default function ProductCard() {

  return (
    <div className='flex shadow p-3 space-x-5 items-center bg-white'>
        <img src={product} alt=""  className='size-24 shadow-xl'/>
        <div className='flex-1 space-y-5'>
            <h3 className='font-bold text-lg'>Trà sữa thái đỏ</h3>
            <div className='flex items-center justify-between'>
                <p>55.000 đ</p>
                <button className='bg-orange-500 px-2 py-0.5 text-lg rounded-lg text-white font-semibold hover:bg-orange-600 transition-colors duration-150'>+</button>
            </div>
        </div>
    </div>
  )
}
