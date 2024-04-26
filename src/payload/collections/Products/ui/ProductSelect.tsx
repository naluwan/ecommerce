import * as React from 'react'
import { Select, useFormFields } from 'payload/components/forms'
import CopyToClipboard from 'payload/dist/admin/components/elements/CopyToClipboard'
import { TextField } from 'payload/dist/fields/config/types'

export const ProductSelect: React.FC<TextField> = props => {
  const { name, label } = props
  const [options, setOptions] = React.useState<
    {
      label: string
      value: string
    }[]
  >([])

  const { value: stripeProductID } = useFormFields(([fields]) => fields[name])

  React.useEffect(() => {
    const getStripeProducts = async () => {
      const productsFetch = await fetch('/api/stripe/products', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const res = await productsFetch.json()

      if (res?.data) {
        const fetchedProducts = res.data.reduce(
          (acc, item) => {
            acc.push({
              label: item.name || item.id,
              value: item.id,
            })
            return acc
          },
          [
            {
              label: '請選擇一個商品',
              value: '',
            },
          ],
        )
        setOptions(fetchedProducts)
      }
    }

    getStripeProducts()
  }, [])

  const href = `https://dashboard.stripe.com/${
    process.env.PAYLOAD_PUBLIC_STRIPE_IS_TEST_KEY ? 'test/' : ''
  }products/${stripeProductID}`

  return (
    <div>
      <p style={{ marginBottom: '0' }}>{typeof label === 'string' ? label : 'Product'}</p>
      <p
        style={{
          marginBottom: '0.75rem',
          color: 'var(--theme-elevation-400)',
        }}
      >
        {`請選擇一個已在Stripe建立的商品或 `}
        <a
          href={`https://dashboard.stripe.com/${
            process.env.PAYLOAD_PUBLIC_STRIPE_IS_TEST_KEY ? 'test/' : ''
          }products/create`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--theme-text' }}
        >
          建立Stripe新商品
        </a>
        {'.'}
      </p>
      <Select {...props} label="" options={options} />
      {Boolean(stripeProductID) && (
        <div
          style={{
            marginTop: '-1rem',
            marginBottom: '1.5rem',
          }}
        >
          <div style={{ marginTop: '20px' }}>
            <span
              className="label"
              style={{
                color: '#9A9A9A',
              }}
            >
              {`在Stripe中檢視 「 ${
                options.find(option => option.value === stripeProductID)?.label || 'Unknown'
              } 」`}
            </span>
            <CopyToClipboard value={href} />
          </div>
          <div
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              fontWeight: '600',
            }}
          >
            <a
              href={`https://dashboard.stripe.com/${
                process.env.PAYLOAD_PUBLIC_STRIPE_IS_TEST_KEY ? 'test/' : ''
              }products/${stripeProductID}`}
              target="_blank"
              rel="noreferrer noopener"
            >
              {href}
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
