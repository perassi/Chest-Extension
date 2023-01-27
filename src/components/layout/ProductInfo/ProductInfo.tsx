import React, { useContext } from 'react'
import { ProductContext } from '../../../contexts/productContext'

import './ProductInfo.scss'

export const ProductInfo = () => {
  const { pageParsedData } = useContext(ProductContext)

  return (
    <div className="product-info">
      {pageParsedData.product && (
        <>
          <img src={pageParsedData.product.image} />

          <div className="product-info-content">
            <p className="product-title">{pageParsedData.product.title}</p>
            <p className="product-link">{pageParsedData.product.url}</p>
            <p className="product-cost">${pageParsedData.product.price}</p>
          </div>
        </>
      )}
    </div>
  )
}
