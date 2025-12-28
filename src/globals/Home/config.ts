import type { GlobalConfig } from 'payload'
import { revalidateHome } from './hooks/revalidateHome'

export const Home: GlobalConfig = {
  slug: 'home',
  label: 'Home Page',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      defaultValue: 'Omar Taheri',
    },
    {
      name: 'tagline',
      type: 'text',
      required: true,
      defaultValue: 'Builds for the web obsessed with AI',
    },
    {
      name: 'intro',
      type: 'textarea',
      required: true,
      defaultValue: "Hi, I'm Omar Taheri and welcome to my digital corner. I'm happy you're here. Please make yourself comfortable.\nI love web dev, experimenting with new tools, and making things that feel good to use.",
    },
    {
      name: 'ctaText',
      type: 'text',
      defaultValue: 'Want to chat?',
    },
    {
      name: 'ctaLink',
      type: 'text',
      defaultValue: 'Drop me a line',
    },
    {
      name: 'projects',
      type: 'array',
      label: 'Projects',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'text',
          required: true,
        },
        {
          name: 'linkedPost',
          type: 'relationship',
          relationTo: 'posts',
          label: 'Link to Post (optional)',
          admin: {
            description: 'If set, the project name will link to this post',
          },
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateHome],
  },
}
