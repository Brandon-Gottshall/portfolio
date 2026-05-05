# About-Me Repository Integration Documentation

This document details the integration of the [About-Me LaTeX resume repository](https://github.com/Brandon-Gottshall/About-Me) with the portfolio site, focusing on static PDF consumption, SWR caching, and webhook-triggered rebuilds.

## 1. Integration Architecture Overview

### 1.1 Design Philosophy

The About-Me integration follows the project's core principle of **separation of concerns** and **external service integration patterns** established in the Sanity CMS and GitHub stats implementations. This approach treats professional documents as a separate microservice rather than duplicating content in the portfolio CMS.

**Key Architectural Decisions:**

- **Static PDF Consumption**: Fetch generated PDFs from the About-Me repository's public URLs
- **Build-time + Runtime Hybrid**: Static generation with runtime revalidation via SWR
- **MD5 Hash Validation**: Ensure document freshness without unnecessary re-fetching
- **Webhook Integration**: Trigger portfolio rebuilds when About-Me repository is updated
- **Graceful Degradation**: Fallback handling when external repository is unavailable

### 1.2 Repository Context

The [About-Me repository](https://github.com/Brandon-Gottshall/About-Me) is a LaTeX-based document generator using the Awesome-CV template:

```
About-Me Repository Structure:
├── src/                    # LaTeX source files
├── examples/              # Generated PDF outputs
├── Makefile              # Build commands
└── README.md             # Documentation
```

**Generated Documents:**
- `Resume.pdf` - Professional resume
- `CV.pdf` - Academic curriculum vitae
- `Cover-Letter.pdf` - Cover letter template

## 2. Technical Implementation Strategy

### 2.1 Service Layer Architecture

Following the established pattern from `src/sanity/api/` and GitHub stats integration:

```typescript
// src/services/aboutMeRepo.ts
interface AboutMeDocument {
  type: 'resume' | 'cv' | 'cover-letter'
  url: string
  lastModified: string
  contentHash: string
  size: number
}

interface AboutMeResponse {
  documents: AboutMeDocument[]
  lastUpdated: string
  repoCommitHash: string
}

export async function fetchAboutMeDocuments(): Promise<AboutMeResponse>
export async function validateDocumentFreshness(hash: string): Promise<boolean>
export async function getDocumentMetadata(type: DocumentType): Promise<AboutMeDocument>
```

### 2.2 Type System Integration

Following [drizzle-type-system.md](./drizzle-type-system.md) patterns for external API validation:

```typescript
// src/types/documents.ts
import { z } from 'zod'

// Zod validation for external API responses
export const aboutMeDocumentSchema = z.object({
  type: z.enum(['resume', 'cv', 'cover-letter']),
  url: z.string().url(),
  lastModified: z.string().datetime(),
  contentHash: z.string().min(32),
  size: z.number().positive()
})

export const aboutMeResponseSchema = z.object({
  documents: z.array(aboutMeDocumentSchema),
  lastUpdated: z.string().datetime(),
  repoCommitHash: z.string().min(7)
})

// Type inference from schemas
export type AboutMeDocument = z.infer<typeof aboutMeDocumentSchema>
export type AboutMeResponse = z.infer<typeof aboutMeResponseSchema>
```

### 2.3 Caching Strategy with SWR

Implementing SWR pattern similar to GitHub stats but optimized for document fetching:

```typescript
// src/hooks/useAboutMeDocuments.ts
import useSWR from 'swr'

const CACHE_KEY = 'about-me-documents'
const REVALIDATION_INTERVAL = 24 * 60 * 60 * 1000 // 24 hours

export function useAboutMeDocuments() {
  return useSWR(
    CACHE_KEY,
    fetchAboutMeDocuments,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshInterval: REVALIDATION_INTERVAL,
      fallbackData: getCachedDocuments(), // Local storage fallback
      onError: (error) => {
        // Graceful error handling with fallback content
        console.warn('About-Me repo unavailable:', error)
        return getStaticFallback()
      }
    }
  )
}
```

## 3. GitHub Integration Patterns

### 3.1 API Consumption Strategy

**Primary Approach: GitHub API + Raw File Access**

```typescript
// Repository metadata via GitHub API
const GITHUB_API_BASE = 'https://api.github.com/repos/Brandon-Gottshall/About-Me'
const RAW_BASE = 'https://raw.githubusercontent.com/Brandon-Gottshall/About-Me/main'

// Document URLs (public repository)
const DOCUMENT_URLS = {
  resume: `${RAW_BASE}/Resume.pdf`,
  cv: `${RAW_BASE}/CV.pdf`,
  coverLetter: `${RAW_BASE}/Cover-Letter.pdf`
} as const
```

**Metadata and Freshness Detection:**

```typescript
// Get latest commit info for freshness detection
async function getLatestCommit(): Promise<CommitInfo> {
  const response = await fetch(`${GITHUB_API_BASE}/commits/main`)
  return await response.json()
}

// Generate content hash for caching
async function generateDocumentHash(url: string): Promise<string> {
  const response = await fetch(url, { method: 'HEAD' })
  const lastModified = response.headers.get('last-modified')
  const etag = response.headers.get('etag')
  return btoa(lastModified + etag).slice(0, 32)
}
```

### 3.2 Webhook Integration

**Trigger Pattern: Repository Push → Portfolio Rebuild**

```typescript
// src/app/api/webhooks/about-me/route.ts
import { NextRequest } from 'next/server'
import { revalidateTag } from 'next/cache'

export async function POST(request: NextRequest) {
  // Validate GitHub webhook signature
  const signature = request.headers.get('x-hub-signature-256')
  const payload = await request.text()

  if (!validateWebhookSignature(payload, signature)) {
    return new Response('Unauthorized', { status: 401 })
  }

  // Parse webhook payload
  const event = JSON.parse(payload)

  // Only respond to main branch pushes
  if (event.ref === 'refs/heads/main') {
    // Invalidate cache and trigger revalidation
    revalidateTag('about-me-documents')

    // Optional: Trigger full site rebuild for critical updates
    await triggerVercelRedeployment()
  }

  return new Response('OK', { status: 200 })
}
```

## 4. Implementation Patterns

### 4.1 Component Architecture

Following established patterns from `src/components/github-stats/`:

```
src/components/documents/
├── DocumentViewer.tsx       # PDF display component
├── DocumentDownload.tsx     # Download links with metadata
├── DocumentStatus.tsx       # Version/update information
├── DocumentError.tsx        # Error boundary and fallback
└── index.ts                # Barrel exports
```

### 4.2 Page Integration

**Resume Page Enhancement:**

```typescript
// src/app/resume/page.tsx
import { DocumentViewer, DocumentDownload, DocumentStatus } from '@/components/documents'
import { useAboutMeDocuments } from '@/hooks/useAboutMeDocuments'

export default function ResumePage() {
  const { data: documents, error, isLoading } = useAboutMeDocuments()

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-light mb-8">Resume</h1>

      <DocumentStatus documents={documents} />

      <div className="grid gap-8 lg:grid-cols-2">
        <DocumentViewer document={documents?.resume} />
        <DocumentDownload documents={documents} />
      </div>

      <DocumentError error={error} fallback={<StaticResumeFallback />} />
    </div>
  )
}
```

### 4.3 Build-time Static Generation

**Next.js ISR Integration:**

```typescript
// src/app/resume/page.tsx
export const revalidate = 86400 // 24 hours

export async function generateStaticParams() {
  // Pre-fetch documents at build time
  try {
    const documents = await fetchAboutMeDocuments()
    return { props: { documents }, revalidate: 86400 }
  } catch {
    // Graceful fallback if repository unavailable at build time
    return { props: { documents: null }, revalidate: 3600 }
  }
}
```

## 5. Error Handling & Fallback Strategy

### 5.1 Graceful Degradation Levels

**Level 1: Repository Unavailable**
- Display cached documents from previous successful fetch
- Show "last updated" timestamp with warning indicator
- Provide static contact information for document requests

**Level 2: Documents Missing**
- Display static resume content from portfolio
- Show notice that documents are being updated
- Provide alternative contact methods

**Level 3: Complete Failure**
- Fallback to static About page content
- Clear call-to-action for direct contact
- Maintain professional appearance

### 5.2 Error Boundary Implementation

```typescript
// src/components/documents/DocumentError.tsx
interface DocumentErrorProps {
  error: Error | null
  fallback: React.ComponentType
}

export function DocumentError({ error, fallback: Fallback }: DocumentErrorProps) {
  if (!error) return null

  // Log error for monitoring
  console.error('Document integration error:', error)

  return (
    <div className="border border-amber-200 bg-amber-50 p-4 rounded-lg">
      <p className="text-amber-800">
        Documents are temporarily unavailable. Using cached version.
      </p>
      <Fallback />
    </div>
  )
}
```

## 6. Performance Considerations

### 6.1 Optimization Strategy

**Caching Layers:**
1. **Browser Cache**: SWR with 24-hour revalidation
2. **CDN Cache**: Vercel edge caching for document URLs
3. **Local Storage**: Fallback document metadata
4. **Build Cache**: Static generation with ISR

**Bandwidth Optimization:**
- HEAD requests for metadata before full PDF fetch
- Conditional requests using ETags and Last-Modified headers
- Progressive loading with skeleton states

### 6.2 Monitoring and Analytics

```typescript
// Document access tracking
export function trackDocumentAccess(documentType: string) {
  // Analytics integration
  analytics.track('Document Accessed', {
    type: documentType,
    source: 'about-me-repo',
    timestamp: new Date().toISOString()
  })
}

// Performance monitoring
export function monitorDocumentLoad(documentType: string, loadTime: number) {
  // Performance tracking
  performance.mark(`document-${documentType}-loaded`)

  if (loadTime > 3000) {
    console.warn(`Slow document load: ${documentType} took ${loadTime}ms`)
  }
}
```

## 7. Security Considerations

### 7.1 Webhook Security

**GitHub Webhook Validation:**
- HMAC-SHA256 signature verification
- Timestamp validation to prevent replay attacks
- IP allowlist for GitHub webhook IPs
- Rate limiting on webhook endpoint

### 7.2 Content Security

**Document Integrity:**
- Content hash validation for document authenticity
- CORS headers for cross-origin requests
- Content-Type validation for PDF documents
- File size limits to prevent abuse

## 8. Development Workflow

### 8.1 Local Development

```bash
# Set up environment variables
NEXT_PUBLIC_ABOUT_ME_REPO=Brandon-Gottshall/About-Me
GITHUB_WEBHOOK_SECRET=your-webhook-secret

# Test document fetching
npm run dev:test-documents

# Validate webhook integration
npm run dev:test-webhook
```

### 8.2 Testing Strategy

**Unit Tests:**
- Document fetching service validation
- Hash generation and comparison
- Error handling scenarios
- SWR hook behavior

**Integration Tests:**
- End-to-end document flow
- Webhook trigger simulation
- Fallback behavior validation
- Performance benchmarks

## 9. Deployment Strategy

### 9.1 Environment Configuration

```typescript
// src/config/aboutMe.ts
export const aboutMeConfig = {
  repoOwner: 'Brandon-Gottshall',
  repoName: 'About-Me',
  branch: 'main',
  webhookSecret: process.env.GITHUB_WEBHOOK_SECRET,
  cacheDuration: 24 * 60 * 60 * 1000, // 24 hours

  documents: {
    resume: 'Resume.pdf',
    cv: 'CV.pdf',
    coverLetter: 'Cover-Letter.pdf'
  }
}
```

### 9.2 Production Considerations

**Vercel Configuration:**
- Function timeout: 30 seconds for document processing
- Edge caching: 1 hour for document URLs
- ISR revalidation: 24 hours for resume page
- Environment variables: GitHub webhook secrets

**GitHub Configuration:**
- Webhook URL: `https://your-domain.com/api/webhooks/about-me`
- Events: `push` to main branch
- Content type: `application/json`
- Secret: Strong webhook signature secret

## 10. Migration from Payload CMS

### 10.1 Removal Strategy

**Files to Remove:**
- Payload Collections related to resume/documents
- Resume-related database schemas
- Document upload functionality
- CMS document management pages

**Files to Preserve:**
- Basic resume page structure (`src/app/resume/page.tsx`)
- Existing styling and layout components
- Navigation and routing structure

### 10.2 Content Migration

**Static Fallback Content:**
- Extract any existing resume content as fallback
- Preserve professional summary and key details
- Maintain responsive layout and design
- Ensure accessibility standards

## 11. Implementation Status & Roadmap

| Component | Status | Priority | Notes |
|-----------|--------|----------|-------|
| Service Layer | 🔄 Planned | High | Core API integration |
| SWR Integration | 🔄 Planned | High | Caching and revalidation |
| Resume Page Update | 🔄 Planned | High | Display integration |
| Webhook Endpoint | 🔄 Planned | Medium | Auto-rebuild trigger |
| Error Boundaries | 🔄 Planned | Medium | Graceful degradation |
| Performance Monitoring | 🔄 Planned | Low | Analytics and optimization |

## 12. Success Metrics

### 12.1 Technical Metrics
- [ ] Document load time < 2 seconds
- [ ] 99.9% uptime for document access
- [ ] Automatic updates within 5 minutes of repo changes
- [ ] Graceful fallback in 100% of error scenarios

### 12.2 Professional Metrics
- [ ] Always current professional documents
- [ ] Seamless user experience for document access
- [ ] Professional impression of technical integration skills
- [ ] Reduced maintenance overhead vs. CMS approach

## 13. References and Dependencies

- [About-Me Repository](https://github.com/Brandon-Gottshall/About-Me)
- [GitHub Webhooks Documentation](https://docs.github.com/en/developers/webhooks-and-events/webhooks)
- [SWR Documentation](https://swr.vercel.app/)
- [Next.js ISR](https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration)
- [Project Status Documentation](../../PROJECT_STATUS.md)
- [Drizzle Type System](./drizzle-type-system.md)

---

**Architecture Philosophy:** External service integration with static consumption, following established patterns for type safety, caching, and graceful degradation while maintaining separation of concerns between portfolio presentation and document generation.