'use client'

import React, { Fragment, useEffect, useState } from 'react'
import Link from 'next/link'

import { Settings } from '../../../../payload/payload-types'
import { useAuth } from '../../../_providers/Auth'

import classes from './index.module.scss'

export const LogoutPage: React.FC<{
  settings: Settings
}> = props => {
  const { settings } = props
  const { productsPage } = settings || {}
  const { logout } = useAuth()
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const performLogout = async () => {
      try {
        await logout()
        setSuccess('登出成功.')
      } catch (_) {
        setError('您已登出.')
      }
    }

    performLogout()
  }, [logout])

  return (
    <Fragment>
      {(error || success) && (
        <div>
          <h1>{error || success}</h1>
          <p>
            {'還想繼續購物嗎?'}
            {typeof productsPage === 'object' && productsPage?.slug && (
              <Fragment>
                {' '}
                <Link href={`/${productsPage.slug}`} className={classes.clickLink}>
                  點擊此處
                </Link>
                {` 繼續購物,`}
              </Fragment>
            )}
            {` 或重新`}
            <Link href="/login" className={classes.clickLink}>
              登入
            </Link>
            {'.'}
          </p>
        </div>
      )}
    </Fragment>
  )
}
