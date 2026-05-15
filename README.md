# Brandon Gottshall Portfolio

Canonical field record for Brandon Gottshall’s software systems, research
notes, visual studies, developer tools, and older traces.

- **Live site:** https://brandongottshall.com
- **Current direction:** App Router field record with static Work, Notes, and
  Objects surfaces plus Payload-backed project content.
- **Portfolio rule:** keep active, staged, draft, and archive work visibly
  labeled so the site can grow without pretending everything is finished.

## Development Roadmap

## 📊 Current Status

**Foundation:** ✅ Complete - Next.js 15, Payload CMS, TypeScript, responsive design
**Core Pages:** ✅ Home, Work/Projects, Notes, Objects, About, Contact functional
**Current Gap:** Notes and Objects are seeded static surfaces, not full publishing systems yet

👉 **[Complete Project Status & Development Plan →](./PROJECT_STATUS.md)**

---

## Table of Contents

- Technical Documentation
  - [GitHub Stats Configuration](./docs/Technical%20Documentation/github-stats.md)
  - [Development Patterns](./docs/Technical%20Documentation/development-patterns.md)
  - [Tools & Technologies](./docs/Technical%20Documentation/tools-and-technologies.md)
  - [Drizzle Type System](./docs/Technical%20Documentation/drizzle-type-system.md)
- [MVP (Minimum Viable Product)](#mvp-minimum-viable-product)
  - [Core Features](#core-features)
  - [Essential Technical](#essential-technical)
- [MVP+ (Stabilization)](#mvp-stabilization)
  - [Code Quality](#code-quality)
  - [Performance & Testing](#performance--testing)
- [PMVP (Enhancement)](#pmvp-enhancement)
  - [Advanced Features](#advanced-features)
  - [Advanced Technical](#advanced-technical)

---

## 🏗 What's Built & Working

### ✅ Core Infrastructure (Complete)
- **Framework:** Next.js 15 with App Router, TypeScript, Tailwind CSS
- **CMS:** Payload CMS with PostgreSQL backend
- **Type Safety:** Drizzle ORM with Zod validation, schema-driven development
- **Code Quality:** ESLint, Prettier, Husky, Vitest testing setup

### ✅ Homepage (Complete)
- Field-record hero
- Work, Notes, Objects, Archive, and minimal contact sections
- Featured projects can still render from Payload when populated

### ✅ Pages & Navigation (Functional)
- **Home:** Complete with all sections
- **Work/Projects:** Static record plus optional CMS-backed project cards
- **Notes:** Static field-note staging surface
- **Objects:** Static 3D/visual-study staging surface
- **About:** Short orientation note
- **Contact:** Minimal contact channels

### ✅ CMS Collections (Active)
- **Projects:** Full CRUD, featured projects, rich content
- **Media:** Image upload and management
- **Users:** Authentication and admin access

---

## 🚧 Critical Gaps (High Priority)

### Field Record Content
- [ ] **Notes publishing:** Decide whether field notes should stay static JSON or move into Payload.
- [ ] **Object studies:** Add real object images, progression frames, and project stories.
- [ ] **Document publishing:** Decide how About-Me generated outputs should surface publicly.

---

## MVP (Minimum Viable Product)

### Core Features

- **Navigation**
  - [ ] Slow the animation of the logo initials (e.g., "BG") with animation to full name
  - [ ] Add smooth rolling down dropdown animation (200-300ms)
  - [x] Add visual indicator for dropdown functionality
  - [x] Implement light/dark mode theming
  - [x] Apply established color palette (navy, red, tan, cream)

- **Content**
  - [x] Connect homepage featured projects to Payload CMS
  - [x] Add Notes route for field notes, research logs, and build fragments
  - [x] Add Objects route for 3D/visual studies and progression stories
  - [ ] Replace seeded Notes/Object placeholders with real artifacts over time
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
- [x] Set up basic testing infrastructure (Vitest configured)
- [ ] Write critical component tests

## PMVP (Enhancement)

### Advanced Features

- [ ] Set up Payload Live Preview for content
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
- [ ] Improve type safety by replacing `any` types in declaration files
  - [ ] Check for official `@types` packages for external modules
  - [ ] Replace remaining `any` types with `unknown` or more specific types
  - [ ] Enable stricter TypeScript compiler options (noImplicitAny)

---

## 🚀 Quick Start

```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Build for production
bun run build

# Test Payload connection
bun run test:db

# Lint code
bun run lint
```

---

## 📋 Next Actions

1. **This Week:** Create Resume collection in Payload CMS
2. **Next Week:** Implement cover letter system and PDF downloads
3. **Week 3-4:** GitHub stats automation and blog integration
4. **Week 4-5:** Social integration and final polish

**📖 For detailed implementation plan:** [PROJECT_STATUS.md](./PROJECT_STATUS.md)
