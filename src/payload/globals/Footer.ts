import type { GlobalConfig } from 'payload/types'

import link from '../fields/link'

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: '頁尾 ( Footer )',
  access: {
    read: () => true,
  },
  fields: [
    { name: 'copyright', label: 'Copyright', type: 'text', required: true },
    {
      name: 'navItems',
      type: 'array',
      label: '頁尾連結',
      maxRows: 6,
      fields: [
        link({
          appearances: false,
        }),
      ],
    },
  ],
}
