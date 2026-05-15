const documentsBaseUrl =
  process.env.NEXT_PUBLIC_ABOUT_ME_DOCUMENTS_BASE_URL ??
  'https://brandon-gottshall.github.io/About-Me'

export const aboutMeConfig = {
  repoOwner: 'Brandon-Gottshall',
  repoName: 'About-Me',
  sourceBranch: 'master',
  documentsBaseUrl,
  manifestPath: 'documents.json',
  cacheDuration: 30 * 60 * 1000
}
