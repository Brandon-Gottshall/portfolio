import type { CollectionConfig } from 'payload/types'

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'updatedAt']
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
      name: 'title',
      type: 'text',
      required: true
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      required: true,
      maxLength: 200
    },
    {
      name: 'description',
      type: 'richText',
      required: true
    },
    {
      name: 'technologies',
      type: 'array',
      fields: [
        {
          name: 'technology',
          type: 'text',
          required: true
        }
      ]
    },
    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media',
      required: true
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false
    },
    {
      name: 'projectUrl',
      type: 'text',
      validate: (value: string | undefined) => {
        if (value && !value.match(/^https?:\/\/.+/)) {
          return 'Must be a valid URL starting with http:// or https://'
        }
        return true
      }
    },
    {
      name: 'githubUrl',
      type: 'text',
      validate: (value: string | undefined) => {
        if (value && !value.match(/^https?:\/\/github\.com\/.+/)) {
          return 'Must be a valid GitHub URL'
        }
        return true
      }
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      options: [
        { label: 'In Development', value: 'in-development' },
        { label: 'Completed', value: 'completed' },
        { label: 'Archived', value: 'archived' }
      ],
      defaultValue: 'completed'
    }
  ]
}
