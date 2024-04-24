'use client'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { Media } from '../../../_components/Media'
import { Price } from '../../../_components/Price'
import { RemoveFromCartButton } from '../../../_components/RemoveFromCartButton'

import classes from './index.module.scss'

const CartItem = ({ product, title, metaImage, qty, addItemToCart }) => {
  const [quantity, setQuantity] = React.useState(qty)

  const decrementQty = () => {
    const updateQty = quantity > 1 ? quantity - 1 : 1
    setQuantity(updateQty)
    addItemToCart({ product, quantity: Number(updateQty) })
  }

  const incrementQty = () => {
    const updateQty = quantity + 1
    setQuantity(updateQty)
    addItemToCart({ product, quantity: Number(updateQty) })
  }

  const enterQty = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updateQty = Number(e.target.value) > 0 ? Number(e.target.value) : 1
    setQuantity(updateQty)
    addItemToCart({ product, quantity: Number(updateQty) })
  }

  return (
    <li className={classes.item}>
      <Link href={`/products/${product.slug}`} className={classes.mediaWrapper}>
        {!metaImage && <span>沒有圖片</span>}
        {metaImage && typeof metaImage !== 'string' && (
          <Media className={classes.media} imgClassName={classes.image} resource={metaImage} fill />
        )}
      </Link>

      <div className={classes.itemDetails}>
        <div className={classes.titleWrapper}>
          <h6>{title}</h6>
          <Price product={product} button={false} />
        </div>

        <div className={classes.quantity}>
          <div className={classes.quantityBtn} onClick={decrementQty}>
            <Image
              src="assets/icons/minus.svg"
              alt="minus"
              width={24}
              height={24}
              className={classes.qtnBt}
            />
          </div>
          <input
            type="text"
            className={classes.quantityInput}
            value={quantity}
            onChange={enterQty}
          />

          <div className={classes.quantityBtn} onClick={incrementQty}>
            <Image
              src="assets/icons/plus.svg"
              alt="plus"
              width={24}
              height={24}
              className={classes.qtnBt}
            />
          </div>
        </div>
      </div>

      <div className={classes.subtotalWrapper}>
        <Price product={product} button={false} quantity={quantity} />
        <RemoveFromCartButton product={product} />
      </div>
    </li>
  )
}

export default CartItem
