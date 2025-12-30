import type { GlobalConfig } from 'payload'
import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
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
      name: 'profileGif',
      type: 'upload',
      relationTo: 'media',
      label: 'Profile GIF/Image',
      admin: {
        description: 'GIF or image displayed under your name on the home page',
      },
    },
    {
      name: 'tagline',
      type: 'text',
      required: true,
      defaultValue: 'Builds for the web obsessed with AI',
    },
    {
      name: 'introContent',
      type: 'richText',
      label: 'Intro Content',
      admin: {
        description: 'Intro text with links. Use the link feature to add CTAs.',
      },
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
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
