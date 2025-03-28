import type { CollectionConfig } from 'payload/types'
import path from 'path'

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    staticDir: path.resolve(process.cwd(), 'media'),
    mimeTypes: ['image/*'],
    adminThumbnail: 'thumbnail',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre'
      },
      {
        name: 'card',
        width: 768,
        height: 1024,
        position: 'centre'
      },
      {
        name: 'tablet',
        width: 1024,
        height: undefined,
        position: 'centre'
      }
    ]
  },
  access: {
    read: () => true,
    create: ({ req }) => {
      return Boolean(req.user)
    },
    update: ({ req }) => {
      return Boolean(req.user?.role === 'admin')
    },
    delete: ({ req }) => {
      return Boolean(req.user?.role === 'admin')
    }
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true
    },
    {
      name: 'caption',
      type: 'text',
      required: false
    }
  ]
}
