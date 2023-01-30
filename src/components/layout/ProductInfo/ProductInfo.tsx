import React, { useContext } from 'react'
import { ProductContext } from '../../../contexts/productContext'

import './ProductInfo.scss'

const websiteDomainRegex =
  /(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/

const chainImage =
  'https://firebasestorage.googleapis.com/v0/b/chestr-app.appspot.com/o/constants%2Fsaved-as-link.png?alt=media&token=a95d66a9-4f9e-45d7-ad9f-7a4ec6bc5e20'

export const ProductInfo = () => {
  const { pageParsedData } = useContext(ProductContext)

  return (
    <div className="product-info">
      <img src={pageParsedData.product?.image ?? chainImage} />

      <div className="product-info-content">
        <p className="product-title">
          {pageParsedData.product?.title ?? pageParsedData.meta?.title}
        </p>
        <p className="product-brand">
          {pageParsedData.product?.brand ??
            pageParsedData.meta?.url.match(websiteDomainRegex)}
        </p>
        <p className="product-cost">
          {pageParsedData.product?.price
            ? `$${pageParsedData.product?.price}`
            : ''}
        </p>
      </div>
    </div>
  )
}
