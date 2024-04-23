import React, { Fragment } from 'react'
import { Metadata } from 'next'
import Link from 'next/link'

import { Button } from '../../_components/Button'
import { Gutter } from '../../_components/Gutter'
import { HR } from '../../_components/HR'
import { RenderParams } from '../../_components/RenderParams'
import { LowImpactHero } from '../../_heros/LowImpact'
import { getMeUser } from '../../_utilities/getMeUser'
import { mergeOpenGraph } from '../../_utilities/mergeOpenGraph'
import AccountForm from './AccountForm'

import classes from './index.module.scss'

export default async function Account() {
  const { user } = await getMeUser({
    nullUserRedirect: `/login?error=${encodeURIComponent(
      'You must be logged in to access your account.',
    )}&redirect=${encodeURIComponent('/account')}`,
  })

  return (
    <Fragment>
      <Gutter>
        <RenderParams className={classes.params} />
      </Gutter>
      <LowImpactHero
        type="lowImpact"
        media={null}
        richText={[
          {
            type: 'h1',
            children: [
              {
                text: '帳戶資訊',
              },
            ],
          },
          {
            type: 'paragraph',
            children: [
              {
                text: '以下為您的帳戶資訊，在這可以更新你的帳戶資料、查詢購買的商品以及瀏覽歷史訂單',
              },
              {
                type: 'link',
                url: '/admin/collections/users',
                children: [
                  {
                    text: 'login to the admin dashboard.',
                  },
                ],
              },
            ],
          },
        ]}
      />
      <Gutter className={classes.account}>
        <AccountForm />
        <HR />
        <h2>已購買商品</h2>
        <p>所有已付款之訂單中的商品皆會顯示在此清單中</p>
        <div>
          {user?.purchases?.length || 0 > 0 ? (
            <ul className={classes.purchases}>
              {user?.purchases?.map((purchase, index) => {
                return (
                  <li key={index} className={classes.purchase}>
                    {typeof purchase === 'string' ? (
                      <p>{purchase}</p>
                    ) : (
                      <h4>
                        <Link href={`/products/${purchase.slug}`}>{purchase.title}</Link>
                      </h4>
                    )}
                  </li>
                )
              })}
            </ul>
          ) : (
            <div className={classes.noPurchases}>尚無資料</div>
          )}
        </div>
        <HR />
        <h2>歷史訂單</h2>
        <p>可查詢歷史訂單，當您訂購產品時，產品將出現在已購買商品的清單中</p>
        <Button
          className={classes.ordersButton}
          href="/orders"
          appearance="primary"
          label="查詢訂單"
        />
        <HR />
        <Button href="/logout" appearance="secondary" label="登出" />
      </Gutter>
    </Fragment>
  )
}

export const metadata: Metadata = {
  title: 'Account',
  description: 'Create an account or log in to your existing account.',
  openGraph: mergeOpenGraph({
    title: 'Account',
    url: '/account',
  }),
}
