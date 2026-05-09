export const aboutMeConfig = {
  repoOwner: 'Brandon-Gottshall',
  repoName: 'About-Me',
  branch: 'main',
  webhookSecret: process.env.GITHUB_WEBHOOK_SECRET ?? '',
  cacheDuration: 24 * 60 * 60 * 1000,
  documents: {
    resume: 'output/resume.pdf',
    cv: 'output/cv.pdf',
    'cover-letter': 'output/cover-letter.pdf'
  }
}
