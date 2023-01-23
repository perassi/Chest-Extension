import React from 'react'

import './ProductInfo.scss'

const img_url =
  'https://content.italic.com/bb74ffa1-eef0-489a-9d74-abc8bcb27e1f.jpeg?ixlib=react-9.5.1-beta.1&q=80&w=1600&auto=format&fit=max'

export const ProductInfo = () => {
  return (
    <div className="product-info">
      <img src={img_url} />

      <div className="product-info-content">
        <p className="product-title">Basic hooded sweatshirt in pink</p>
        <p className="product-link">freepeople.com</p>
        <p className="product-cost">$52</p>
      </div>
    </div>
  )
}
