# Tools & Technologies

## Frontend

- Next.js 15.2.1 with App Router
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion
- ShadCN UI Components
- Chart.js 4.4.0
- SWR (for data fetching and caching)

## CMS & Data

- Sanity CMS
- GitHub API Integration
- About-Me Repository Integration (LaTeX document generation)

## Development Tools

- ESLint
- TypeScript
- Turbopack
- Bun

## Deployment

- Vercel

## Chart.js Integration

- **Version**: 4.4.0
- **Implementation**: Custom factory pattern with TypeScript
- **Key Files**:
  - `src/types/chart.d.ts` - Type definitions
  - `src/lib/charts/createChart.ts` - Chart factory
  - `src/components/GithubLanguageStats.tsx` - Example implementation
- **Resources**:
  - [Chart.js Documentation](https://www.chartjs.org/docs/latest/)
  - [TypeScript Integration Guide](chart-implementation.md)

## About-Me Repository Integration

- **Purpose**: Professional document management (Resume, CV, Cover Letters)
- **Technology**: LaTeX document generation with Awesome-CV template
- **Integration Pattern**: Static PDF consumption with SWR caching
- **Key Features**:
  - MD5 hash validation for document freshness
  - GitHub webhook integration for automatic updates
  - Three-tier graceful degradation system
  - Type-safe API responses with Zod validation
- **Key Files**:
  - `src/services/aboutMeRepo.ts` - API integration service
  - `src/hooks/useAboutMeDocuments.ts` - SWR data fetching hook
  - `src/types/documents.ts` - Type definitions and Zod schemas
  - `src/components/documents/` - Document display components
- **Resources**:
  - [About-Me Integration Documentation](about-me-integration.md)
  - [About-Me Repository](https://github.com/Brandon-Gottshall/About-Me)
  - [SWR Documentation](https://swr.vercel.app/)

## SWR Data Fetching

- **Version**: Latest
- **Purpose**: Client-side data fetching with caching and revalidation
- **Use Cases**:
  - About-Me repository document fetching
  - GitHub API data caching
  - Real-time data synchronization
- **Key Features**:
  - Automatic revalidation
  - Local storage fallback
  - Error boundary integration
  - Performance monitoring
- **Implementation Pattern**: Custom hooks with type-safe fetchers
