import type { GlobalConfig } from 'payload'
import {
  BlocksFeature,
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { MediaBlock } from '../../blocks/MediaBlock/config'
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
        description: 'Intro text with images and links.',
      },
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          BlocksFeature({ blocks: [MediaBlock] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
    },
    {
      name: 'projectsContent',
      type: 'richText',
      label: 'Projects Content',
      admin: {
        description: 'Write freely about your projects with paragraphs, images, and links.',
      },
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          BlocksFeature({ blocks: [MediaBlock] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
    },
  ],
  hooks: {
    afterChange: [revalidateHome],
  },
}
