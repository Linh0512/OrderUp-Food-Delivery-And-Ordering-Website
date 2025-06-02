
import product from '../assets/product.jpg'
import ProductPopUp from './ProductPopUp'

export default function ProductCard() {

  return (
    <div className='flex shadow-2xl p-3 space-x-2 items-center'>
        <img src={product} alt=""  className='size-24 shadow-lg'/>
        <div className='flex-1'>
            <h3 className='font-bold text-lg'>Trà sữa thái đỏ</h3>
            <div className='flex items-center justify-between'>
                <p>55.000 đ</p>
                <button className='bg-orange-500 p-0.5 px-2 text-lg rounded-lg text-white font-semibold hover:bg-orange-600'>+</button>
            </div>
        </div>
    </div>
  )
}
