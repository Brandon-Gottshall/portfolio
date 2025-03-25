import { defineField, defineType } from 'sanity'

export const projectType = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96
      },
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'featured',
      title: 'Featured Project',
      type: 'boolean',
      description: 'Set to true to show this project prominently',
      initialValue: false
    }),
    defineField({
      name: 'projectUrl',
      title: 'Project URL',
      type: 'url'
    }),
    defineField({
      name: 'githubUrl',
      title: 'GitHub URL',
      type: 'url'
    }),
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail',
      type: 'image',
      options: {
        hotspot: true
      },
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required().max(200)
    }),
    defineField({
      name: 'technologies',
      title: 'Technologies',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags'
      }
    }),
    defineField({
      name: 'description',
      title: 'Full Description',
      type: 'blockContent'
    }),
    defineField({
      name: 'status',
      title: 'Project Status',
      type: 'string',
      options: {
        list: [
          { title: 'In Development', value: 'in-development' },
          { title: 'Completed', value: 'completed' },
          { title: 'Archived', value: 'archived' }
        ]
      },
      initialValue: 'completed'
    })
  ],
  preview: {
    select: {
      title: 'title',
      status: 'status',
      media: 'thumbnail'
    },
    prepare({ title, status, media }) {
      return {
        title,
        subtitle: status.charAt(0).toUpperCase() + status.slice(1),
        media
      }
    }
  }
})
