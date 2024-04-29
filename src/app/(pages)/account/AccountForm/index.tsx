'use client'

import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'

import { Button } from '../../../_components/Button'
import { Input } from '../../../_components/Input'
import { Message } from '../../../_components/Message'
import { useAuth } from '../../../_providers/Auth'

import classes from './index.module.scss'

type FormData = {
  email: string
  name: string
  password: string
  passwordConfirm: string
}

const AccountForm: React.FC = () => {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { user, setUser } = useAuth()
  const [changePassword, setChangePassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isLoading },
    reset,
    watch,
  } = useForm<FormData>()

  const password = useRef({})
  password.current = watch('password', '')

  const router = useRouter()

  const onSubmit = useCallback(
    async (data: FormData) => {
      if (user) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${user.id}`, {
          // Make sure to include cookies with fetch
          credentials: 'include',
          method: 'PATCH',
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (response.ok) {
          const json = await response.json()
          setUser(json.doc)
          setSuccess(`更新${changePassword ? '密碼' : '個人資訊'}成功`)
          setError('')
          setChangePassword(false)
          reset({
            email: json.doc.email,
            name: json.doc.name,
            password: '',
            passwordConfirm: '',
          })
        } else {
          setError('更新您的個人資料時發生錯誤')
        }
      }
    },
    [user, setUser, reset, changePassword],
  )

  useEffect(() => {
    if (user === null) {
      router.push(
        `/login?error=${encodeURIComponent(
          '您必須先登入才能查看個人資訊頁面',
        )}&redirect=${encodeURIComponent('/account')}`,
      )
    }

    // Once user is loaded, reset form to have default values
    if (user) {
      reset({
        email: user.email,
        name: user.name,
        password: '',
        passwordConfirm: '',
      })
    }
  }, [user, router, reset, changePassword])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
      <Message error={error} success={success} className={classes.message} />
      {!changePassword ? (
        <Fragment>
          <p>
            {'更新您的個人資訊或點擊 '}
            <button
              type="button"
              className={classes.changePassword}
              onClick={() => setChangePassword(!changePassword)}
            >
              更新密碼
            </button>
            {' 更新您的密碼'}
          </p>
          <Input
            name="email"
            label="Email"
            required
            register={register}
            error={errors.email}
            type="email"
          />
          <Input name="name" label="使用者名稱" register={register} error={errors.name} />
        </Fragment>
      ) : (
        <Fragment>
          <p>
            {'更新您的密碼, 或 '}
            <button
              type="button"
              className={classes.changePassword}
              onClick={() => setChangePassword(!changePassword)}
            >
              取消
            </button>
            .
          </p>
          <Input
            name="password"
            type="password"
            label="密碼"
            required
            register={register}
            error={errors.password}
          />
          <Input
            name="passwordConfirm"
            type="password"
            label="確認密碼"
            required
            register={register}
            validate={value => value === password.current || '確認密碼與密碼不相符'}
            error={errors.passwordConfirm}
          />
        </Fragment>
      )}
      <Button
        type="submit"
        label={isLoading ? '更新中...' : changePassword ? '更新密碼' : '更新個人資訊'}
        disabled={isLoading}
        appearance="primary"
        className={classes.submit}
      />
    </form>
  )
}

export default AccountForm
