import React from 'react'
import ProductCard from './ShopCard'

export default function ProdcuctList() {
  return (
    <div className='grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-1 gap-3'>
        {Array.from({ length: 20 }).map((_, index) => (
            <ProductCard key={index} />
        ))}
    </div>
  )
}
