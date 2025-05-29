import React from 'react'
import ProductCard from './ProductCard'

export default function ProdcuctList() {
  return (
    <div className='grid grid-cols-5 gap-3'>
        {Array.from({ length: 20 }).map((_, index) => (
            <ProductCard key={index} />
        ))}
    </div>
  )
}
