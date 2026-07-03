import type {StructureResolver} from 'sanity/structure'

const singleton = (S: Parameters<StructureResolver>[0], id: string, title: string) =>
  S.listItem()
    .title(title)
    .id(id)
    .child(S.document().schemaType(id).documentId(id).title(title))

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Velaris Web CMS')
    .items([
      singleton(S, 'siteSettings', 'Site Settings'),
      S.divider(),
      S.listItem()
        .title('Pages')
        .child(
          S.documentTypeList('page')
            .title('Pages')
            .filter('_type == "page"')
            .defaultOrdering([{field: 'title', direction: 'asc'}]),
        ),
      S.listItem()
        .title('Services')
        .child(
          S.documentTypeList('service')
            .title('Services')
            .filter('_type == "service"')
            .defaultOrdering([{field: 'orderRank', direction: 'asc'}]),
        ),
      S.listItem()
        .title('Case Studies')
        .child(
          S.documentTypeList('caseStudy')
            .title('Case Studies')
            .filter('_type == "caseStudy"')
            .defaultOrdering([{field: 'caseNumber', direction: 'asc'}]),
        ),
      S.divider(),
      S.listItem()
        .title('Blog')
        .child(
          S.list()
            .title('Blog')
            .items([
              S.documentTypeListItem('post').title('Posts'),
              S.documentTypeListItem('category').title('Categories'),
              S.documentTypeListItem('author').title('Authors'),
            ]),
        ),
      S.listItem()
        .title('Resources')
        .child(
          S.list()
            .title('Resources')
            .items([
              S.documentTypeListItem('resource').title('Resources'),
              S.documentTypeListItem('leadMagnet').title('Lead Magnets'),
            ]),
        ),
      S.divider(),
      S.listItem()
        .title('Social Proof')
        .child(
          S.list()
            .title('Social Proof')
            .items([
              S.documentTypeListItem('testimonial').title('Testimonials'),
              S.documentTypeListItem('clientLogo').title('Client Logos'),
            ]),
        ),
      S.listItem()
        .title('Commercial')
        .child(
          S.list()
            .title('Commercial')
            .items([
              S.documentTypeListItem('pricingPlan').title('Pricing Plans'),
              S.documentTypeListItem('faq').title('FAQs'),
            ]),
        ),
      S.divider(),
      S.documentTypeListItem('navigation').title('Navigation'),
    ])
