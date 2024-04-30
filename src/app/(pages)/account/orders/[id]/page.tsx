import React, { Fragment } from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Order as OrderType } from '../../../../../payload/payload-types'
import { HR } from '../../../../_components/HR'
import { Media } from '../../../../_components/Media'
import { Price } from '../../../../_components/Price'
import { formatDateTime } from '../../../../_utilities/formatDateTime'
import { getMeUser } from '../../../../_utilities/getMeUser'
import { mergeOpenGraph } from '../../../../_utilities/mergeOpenGraph'

import classes from './index.module.scss'

export default async function Order({ params: { id } }) {
  const { token } = await getMeUser({
    nullUserRedirect: `/login?error=${encodeURIComponent(
      'You must be logged in to view this order.',
    )}&redirect=${encodeURIComponent(`/order/${id}`)}`,
  })

  let order: OrderType | null = null

  try {
    order = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/orders/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `JWT ${token}`,
      },
    })?.then(async res => {
      if (!res.ok) notFound()
      const json = await res.json()
      if ('error' in json && json.error) notFound()
      if ('errors' in json && json.errors) notFound()
      return json
    })
  } catch (error) {
    console.error(error) // eslint-disable-line no-console
  }

  if (!order) {
    notFound()
  }

  return (
    <div>
      <h5>
        {`訂單編號`}
        <span className={classes.id}>{` ${order.id}`}</span>
      </h5>
      <div className={classes.itemMeta}>
        <p>{`編號: ${order.id}`}</p>
        <p>{`付款編號: ${order.stripePaymentIntentID}`}</p>
        <p>{`訂單日期: ${formatDateTime(order.createdAt)}`}</p>
        <p className={classes.total}>
          {'總金額: '}
          {new Intl.NumberFormat('zh-TW', {
            style: 'currency',
            currency: 'TWD',
            minimumFractionDigits: 0,
          }).format(order.total / 100)}
        </p>
      </div>

      <div className={classes.order}>
        {order.items?.map((item, index) => {
          if (typeof item.product === 'object') {
            const {
              quantity,
              product,
              product: { id, title, meta, stripeProductID },
            } = item

            const metaImage = meta?.image

            return (
              <Fragment key={index}>
                <div className={classes.row}>
                  <Link href={`/products/${product.slug}`} className={classes.mediaWrapper}>
                    {!metaImage && <span className={classes.placeholder}>No image</span>}
                    {metaImage && typeof metaImage !== 'string' && (
                      <Media
                        className={classes.media}
                        imgClassName={classes.image}
                        resource={metaImage}
                        fill
                      />
                    )}
                  </Link>
                  <div className={classes.rowContent}>
                    {!stripeProductID && (
                      <p className={classes.warning}>
                        {'此商品尚未連結至Stripe，請連結至Stripe設定連結 '}
                        <Link
                          href={`${process.env.NEXT_PUBLIC_SERVER_URL}/admin/collections/products/${id}`}
                        >
                          在主控版編輯此商品
                        </Link>
                        {'.'}
                      </p>
                    )}
                    <h6 className={classes.title}>
                      <Link href={`/products/${product.slug}`} className={classes.titleLink}>
                        {title}
                      </Link>
                    </h6>
                    <p>{`數量: ${quantity}`}</p>
                    <Price product={product} button={false} quantity={quantity} />
                  </div>
                </div>
              </Fragment>
            )
          }

          return null
        })}
      </div>
      <HR className={classes.hr} />
    </div>
  )
}

export async function generateMetadata({ params: { id } }): Promise<Metadata> {
  return {
    title: `Order ${id}`,
    description: `Order details for order ${id}.`,
    openGraph: mergeOpenGraph({
      title: `Order ${id}`,
      url: `/orders/${id}`,
    }),
  }
}
