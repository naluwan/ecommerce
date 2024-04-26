import { slateEditor } from '@payloadcms/richtext-slate'
import path from 'path'
import type { CollectionConfig } from 'payload/types'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: '圖片 ( media )', plural: '圖片 ( media )' },
  upload: {
    staticDir: path.resolve(__dirname, '../../../media'),
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: '圖片名稱 ( alt )',
      required: true,
    },
    {
      name: 'caption',
      type: 'richText',
      label: '圖片描述 ( caption )',
      editor: slateEditor({
        admin: {
          elements: ['link'],
        },
      }),
    },
  ],
}
