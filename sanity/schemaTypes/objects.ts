import {defineArrayMember, defineField, defineType} from 'sanity'

export const seoFields = [
  defineField({
    name: 'metaTitle',
    title: 'Meta title',
    type: 'string',
    validation: (Rule) => Rule.max(60).warning('Aim for 50-60 characters.'),
  }),
  defineField({
    name: 'metaDescription',
    title: 'Meta description',
    type: 'text',
    rows: 3,
    validation: (Rule) => Rule.max(160).warning('Aim for 140-160 characters.'),
  }),
  defineField({name: 'ogImage', title: 'Open Graph image', type: 'imageWithAlt'}),
  defineField({name: 'canonicalUrl', title: 'Canonical URL', type: 'url'}),
  defineField({name: 'noIndex', title: 'Hide from search engines', type: 'boolean', initialValue: false}),
  defineField({
    name: 'keywords',
    title: 'SEO keywords',
    type: 'array',
    of: [defineArrayMember({type: 'string'})],
    options: {layout: 'tags'},
  }),
  defineField({name: 'schemaJson', title: 'Structured data JSON', type: 'text', rows: 8}),
]

export const sharedObjects = [
  defineType({
    name: 'imageWithAlt',
    title: 'Image',
    type: 'image',
    options: {hotspot: true},
    fields: [
      defineField({name: 'alt', title: 'Alt text', type: 'string'}),
      defineField({name: 'caption', title: 'Caption', type: 'string'}),
      defineField({
        name: 'legacyPath',
        title: 'Legacy/static asset path',
        description: 'Used while migrating current static images into Sanity assets.',
        type: 'string',
      }),
    ],
  }),
  defineType({
    name: 'link',
    title: 'Link',
    type: 'object',
    fields: [
      defineField({name: 'label', type: 'string', validation: (Rule) => Rule.required()}),
      defineField({name: 'href', type: 'string', validation: (Rule) => Rule.required()}),
      defineField({name: 'openInNewTab', type: 'boolean', initialValue: false}),
    ],
    preview: {
      select: {title: 'label', subtitle: 'href'},
    },
  }),
  defineType({
    name: 'cta',
    title: 'CTA',
    type: 'object',
    fields: [
      defineField({name: 'label', type: 'string', validation: (Rule) => Rule.required()}),
      defineField({name: 'href', type: 'string', validation: (Rule) => Rule.required()}),
      defineField({
        name: 'style',
        type: 'string',
        options: {list: ['primary', 'secondary', 'dark', 'light', 'ghost']},
        initialValue: 'primary',
      }),
    ],
  }),
  defineType({
    name: 'stat',
    title: 'Statistic',
    type: 'object',
    fields: [
      defineField({name: 'value', type: 'string', validation: (Rule) => Rule.required()}),
      defineField({name: 'label', type: 'string', validation: (Rule) => Rule.required()}),
      defineField({name: 'description', type: 'text', rows: 2}),
    ],
    preview: {
      select: {title: 'value', subtitle: 'label'},
    },
  }),
  defineType({
    name: 'processStep',
    title: 'Process step',
    type: 'object',
    fields: [
      defineField({name: 'title', type: 'string', validation: (Rule) => Rule.required()}),
      defineField({name: 'description', type: 'text', rows: 3}),
      defineField({name: 'points', type: 'array', of: [defineArrayMember({type: 'string'})]}),
    ],
    preview: {
      select: {title: 'title', subtitle: 'description'},
    },
  }),
  defineType({
    name: 'faqItem',
    title: 'FAQ item',
    type: 'object',
    fields: [
      defineField({name: 'question', type: 'string', validation: (Rule) => Rule.required()}),
      defineField({name: 'answer', type: 'text', rows: 4, validation: (Rule) => Rule.required()}),
    ],
  }),
  defineType({
    name: 'pageScreenshot',
    title: 'Website page screenshot',
    type: 'object',
    fields: [
      defineField({name: 'title', type: 'string', validation: (Rule) => Rule.required()}),
      defineField({name: 'image', type: 'imageWithAlt'}),
      defineField({name: 'legacyPath', title: 'Legacy/static image path', type: 'string'}),
    ],
    preview: {
      select: {title: 'title', media: 'image'},
    },
  }),
  defineType({
    name: 'paletteColor',
    title: 'Palette color',
    type: 'object',
    fields: [
      defineField({name: 'name', type: 'string'}),
      defineField({
        name: 'hex',
        type: 'string',
        validation: (Rule) => Rule.regex(/^#([0-9A-Fa-f]{3}){1,2}$/).warning('Use a valid HEX color.'),
      }),
    ],
    preview: {
      select: {title: 'name', subtitle: 'hex'},
    },
  }),
  defineType({
    name: 'portableBody',
    title: 'Rich content',
    type: 'array',
    of: [
      defineArrayMember({
        type: 'block',
        styles: [
          {title: 'Normal', value: 'normal'},
          {title: 'H2', value: 'h2'},
          {title: 'H3', value: 'h3'},
          {title: 'Quote', value: 'blockquote'},
        ],
        marks: {
          annotations: [
            {
              name: 'link',
              type: 'object',
              title: 'Link',
              fields: [
                defineField({name: 'href', type: 'url'}),
                defineField({name: 'openInNewTab', type: 'boolean', initialValue: true}),
              ],
            },
          ],
        },
      }),
      defineArrayMember({type: 'imageWithAlt'}),
      defineArrayMember({
        type: 'object',
        name: 'callout',
        title: 'Callout',
        fields: [
          defineField({
            name: 'tone',
            type: 'string',
            options: {list: ['teal', 'navy', 'cream', 'warning']},
            initialValue: 'teal',
          }),
          defineField({name: 'title', type: 'string'}),
          defineField({name: 'text', type: 'text', rows: 3}),
        ],
      }),
      defineArrayMember({
        type: 'object',
        name: 'infographic',
        title: 'Infographic block',
        fields: [
          defineField({name: 'title', type: 'string'}),
          defineField({name: 'label', type: 'string'}),
          defineField({
            name: 'items',
            type: 'array',
            of: [
              defineArrayMember({
                type: 'object',
                fields: [
                  defineField({name: 'title', type: 'string'}),
                  defineField({name: 'description', type: 'text', rows: 2}),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  }),
  defineType({
    name: 'pageSection',
    title: 'Page section',
    type: 'object',
    fields: [
      defineField({
        name: 'sectionType',
        type: 'string',
        options: {
          list: [
            'hero',
            'logoMarquee',
            'caseStudyStack',
            'servicesGrid',
            'testimonials',
            'stats',
            'faq',
            'resourceGrid',
            'blogGrid',
            'cta',
            'custom',
          ],
        },
        validation: (Rule) => Rule.required(),
      }),
      defineField({name: 'eyebrow', type: 'string'}),
      defineField({name: 'heading', type: 'string'}),
      defineField({name: 'subheading', type: 'text', rows: 3}),
      defineField({name: 'image', type: 'imageWithAlt'}),
      defineField({name: 'cta', type: 'cta'}),
      defineField({name: 'secondaryCta', type: 'cta'}),
      defineField({name: 'body', type: 'portableBody'}),
    ],
    preview: {
      select: {title: 'heading', subtitle: 'sectionType', media: 'image'},
      prepare({title, subtitle, media}) {
        return {title: title || subtitle || 'Page section', subtitle, media}
      },
    },
  }),
]
