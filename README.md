# Portfolio Development Roadmap

## Table of Contents

- Technical Documentation
  - [GitHub Stats Configuration](./Technical%20Documentation/github-stats.md)
  - [Development Patterns](./Technical%20Documentation/development-patterns.md)
  - [Tools & Technologies](./Technical%20Documentation/tools-and-technologies.md)
- [MVP (Minimum Viable Product)](#mvp-minimum-viable-product)
  - [Core Features](#core-features)
  - [Essential Technical](#essential-technical)
- [MVP+ (Stabilization)](#mvp-stabilization)
  - [Code Quality](#code-quality)
  - [Performance \& Testing](#performance--testing)
- [PMVP (Enhancement)](#pmvp-enhancement)
  - [Advanced Features](#advanced-features)
  - [Advanced Technical](#advanced-technical)

> **Note:** Technical documentation can be found in the Technical Documentation folder, with direct links above for easy access.

## MVP (Minimum Viable Product)

### Core Features

- **Navigation**

  - [ ] Slow the animation of the logo initials (e.g., "BG") with animation to full name
  - [ ] Add smooth rolling down dropdown animation (200-300ms)
  - [x] Add visual indicator for dropdown functionality
  - [x] Implement light/dark mode theming
  - [x] Apply established color palette (navy, red, tan, cream)

- **Content**

  - [ ] Connect homepage featured projects to Sanity CMS
  - [ ] Add resume page with content from Sanity CMS
    - [ ] Add resume content and structure to Sanity CMS
    - [ ] Add resume page to navigation
    - [ ] Implement resume page with content from Sanity CMS
    - [ ] Add resume page to footer
    - [ ] Add resume page to landing page
    - [ ] Add resume page to contact page
  - [ ] Write and publish first blog post
    - [ ] Brainstorm blog post ideas for next 5 posts
    - [ ] Add blog post to Sanity CMS
  - [ ] Convert GitHub stats script to Vercel function with CRON updates
    - [ ] Move the ruby script to a Vercel function
    - [ ] Add the cron job to the Vercel config

- **Social & Engagement**
  - [ ] Add social media buttons in strategic locations
  - [ ] Integrate "Buy Me a Coffee" with creative incentives

### Essential Technical

- [ ] Implement basic keyboard navigation
- [ ] Add critical ARIA attributes
- [ ] Set up basic SEO metadata
- [ ] Fix any major contrast issues

## MVP+ (Stabilization)

### Code Quality

- [ ] Consolidate component patterns
- [ ] Fix component import paths
- [ ] Extract reusable hooks
- [ ] Document component usage patterns
- [ ] Add code comments for complex logic

### Performance & Testing

- [ ] Add loading states for dynamic content
- [ ] Optimize image loading
- [ ] Set up basic testing infrastructure
- [ ] Write critical component tests

## PMVP (Enhancement)

### Advanced Features

- [ ] Set up SanityLive for content preview
- [ ] Add project filtering/sorting
- [ ] Implement blog subscription system
- [ ] Add downloadable PDF resume option
- [ ] Add sharing functionality for blog posts and projects

### Advanced Technical

- [ ] Complete accessibility audit
- [ ] Generate sitemap.xml
- [ ] Add Open Graph metadata
- [ ] Add structured data (JSON-LD)
- [ ] Implement advanced content relationships in CMS
