import { defineField, defineType } from 'sanity'
import type { Rule, PreviewValue } from 'sanity'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { urlFor } from '../lib/image'

const PROJECT_STATUSES = ['in-development', 'completed', 'archived'] as const
type ProjectStatus = (typeof PROJECT_STATUSES)[number]

export const projectType = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule: Rule) => rule.required()
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96
      },
      validation: (rule: Rule) => rule.required()
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
      validation: (rule: Rule) => rule.required()
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      type: 'text',
      rows: 3,
      validation: (rule: Rule) => rule.required().max(200)
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
        list: PROJECT_STATUSES.map((status) => ({
          title:
            status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' '),
          value: status
        }))
      },
      initialValue: 'completed' as ProjectStatus
    })
  ],
  preview: {
    select: {
      title: 'title',
      status: 'status',
      media: 'thumbnail'
    },
    prepare(selection: {
      title?: string
      status?: ProjectStatus
      media?: SanityImageSource
    }): PreviewValue {
      const { title = '', status = '', media } = selection
      return {
        title,
        subtitle:
          status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' '),
        media: media ? urlFor(media).width(200).url() : undefined
      }
    }
  }
})
