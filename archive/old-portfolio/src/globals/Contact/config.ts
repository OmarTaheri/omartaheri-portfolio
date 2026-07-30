import type { GlobalConfig } from 'payload'
import { revalidateContact } from './hooks/revalidateContact'

export const Contact: GlobalConfig = {
  slug: 'contact',
  label: 'Contact Page',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Contact me',
    },
    {
      name: 'email',
      type: 'text',
      required: true,
      defaultValue: 'omartaheri2005@gmail.com',
    },
    {
      name: 'description',
      type: 'textarea',
      defaultValue: "Feel free to reach out if you want to collaborate, have a question, or just want to say hi!",
    },
    {
      name: 'socialLinks',
      type: 'array',
      label: 'Social Links',
      fields: [
        {
          name: 'platform',
          type: 'text',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateContact],
  },
}
