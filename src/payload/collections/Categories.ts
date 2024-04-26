import type { CollectionConfig } from 'payload/types'

const Categories: CollectionConfig = {
  slug: 'categories',
  labels: { singular: '類別 ( categories )', plural: '類別 ( categories )' },
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: '標題',
      required: true,
    },
    {
      name: 'media',
      type: 'upload',
      label: '圖片',
      relationTo: 'media',
    },
  ],
}

export default Categories
