import React from 'react'
import { FieldValues, UseFormRegister, Validate } from 'react-hook-form'

import classes from './index.module.scss'

type Props = {
  name: string
  label: string
  register: UseFormRegister<FieldValues & any>
  required?: boolean
  error: any
  type?: 'text' | 'number' | 'password' | 'email'
  validate?: (value: string) => boolean | string
  disabled?: boolean
}

export const Input: React.FC<Props> = ({
  name,
  label,
  required,
  register,
  error,
  type = 'text',
  validate,
  disabled,
}) => {
  return (
    <div className={classes.inputWrap}>
      <label htmlFor="name" className={classes.label}>
        {label}
        {required ? <span className={classes.asterisk}>&nbsp;*</span> : ''}
      </label>
      <input
        className={[classes.input, error && classes.error].filter(Boolean).join(' ')}
        {...{ type }}
        {...register(name, {
          required,
          validate,
          ...(type === 'email'
            ? {
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: '請輸入正確的Email格式',
                },
              }
            : {}),
        })}
        disabled={disabled}
      />
      {error && (
        <div className={classes.errorMessage}>
          {!error?.message && error?.type === 'required' ? '此為必填欄位' : error?.message}
        </div>
      )}
    </div>
  )
}
