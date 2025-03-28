import type { CollectionConfig } from 'payload/types'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email'
  },
  access: {
    read: () => true,
    create: () => true,
    update: ({ req, id }) => {
      if (!req.user) return false
      if (req.user.role === 'admin') return true
      return req.user.id === id
    },
    delete: ({ req }) => {
      if (!req.user) return false
      return req.user.role === 'admin'
    }
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' }
      ]
    },
    {
      name: 'name',
      type: 'text',
      required: true
    }
  ]
}
