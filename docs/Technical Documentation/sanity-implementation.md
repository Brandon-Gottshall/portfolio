# Sanity CMS Implementation Documentation

This document details the specific implementation of Sanity CMS in the portfolio project, focusing on architecture, content models, and key integration patterns.

## 1. Implementation Architecture

### 1.1 Directory Structure

The Sanity implementation follows a clean, modular structure:

``` sh
src/sanity/
├── api/             # Content fetching functions organized by schema type
├── lib/             # Utility libraries (client, image, live preview)
├── schemaTypes/     # Content models and schema definitions
├── env.ts           # Environment configuration with validation
└── structure.ts     # Studio structure customization
```

### 1.2 Environment Configuration

Environment variables are managed in `src/sanity/env.ts` with validation:

```typescript
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-03-09'
export const dataset = assertValue(process.env.NEXT_PUBLIC_SANITY_DATASET, '...')
export const projectId = assertValue(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID, '...')

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage)
  }
  return v
}
```

This implementation ensures all required environment variables (`NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`) are present at runtime.

## 2. Content Models

### 2.1 Schema Organization

The project uses multiple content schemas defined in the `schemaTypes` directory:

- `blockContentType.ts` - Reusable rich text field with image support
- `projectType.ts` - Portfolio project schema
- `postType.ts` - Blog post schema with author reference
- `authorType.ts` - Author profiles
- `categoryType.ts` - Categories for blog posts

These schemas are centrally exported from `index.ts`:

```typescript
export const schema: { types: SchemaTypeDefinition[] } = {
  types: [blockContentType, categoryType, postType, authorType, projectType]
}
```

### 2.2 Schema Design Patterns

#### Project Schema

The project schema (`projectType.ts`) demonstrates several important patterns:

```typescript
const PROJECT_STATUSES = ['in-development', 'completed', 'archived'] as const
type ProjectStatus = (typeof PROJECT_STATUSES)[number]

export const projectType = defineType({
  name: 'project',
  // ... fields ...
  preview: {
    select: { /* ... */ },
    prepare(selection) { /* Custom preview format */ }
  }
})
```

Key implementation patterns:

- TypeScript literal types for constrained field values (`ProjectStatus`)
- Custom preview formatting for the Sanity Studio
- Validation rules for required fields
- Hotspot-enabled image fields
- Reusable rich text fields (`blockContent`)

#### Block Content Type

The block content type (`blockContentType.ts`) provides a reusable rich text editor with image support and alt text fields for accessibility.

## 3. Type-Safe Data Fetching

### 3.1 Client Configuration

A typed Sanity client (`SanityClient`) is configured in `src/sanity/lib/client.ts` using `createClient`. It uses environment variables for `projectId`, `dataset`, and `apiVersion`, with `useCdn` set to `true`.

### 3.2 Type-Safe API Functions

The project implements type-safe API functions (e.g., `getProjects`, `getFeaturedProjects` in `src/sanity/api/project.ts`) for fetching content.

```typescript
export interface Project { /* ... */ }

export async function getProjects(): Promise<Project[]> {
  return await client.fetch(`GROQ_QUERY`)
}
```

This pattern ensures type-safe return values and organizes queries by content type.

### 3.3 Live Preview Support

The codebase has prepared for live preview functionality using `defineLive` in `src/sanity/lib/live.ts`, exporting `sanityFetch` and `SanityLive`. Full implementation is planned (see README).

## 4. Image Handling

A centralized image URL builder (`urlFor`) is implemented in `src/sanity/lib/image.ts` using `createImageUrlBuilder`. This is used consistently with the Next.js `Image` component for responsive images and hotspot support.

## 5. Studio Integration

### 5.1 Studio Configuration

The Sanity Studio is mounted at `/studio` using `NextStudio` from `next-sanity/studio` within a Next.js App Router catch-all route (`src/app/studio/[[...tool]]/page.tsx`).

### 5.2 Custom Studio Structure

The Studio's navigation is customized in `src/sanity/structure.ts` using `StructureResolver` to prioritize blog-related content types (`post`, `category`, `author`).

## 6. Next.js Integration

### 6.1 Server Component Data Fetching

The project leverages Next.js Server Components for data fetching (e.g., in `src/app/projects/page.tsx`), calling the type-safe API functions directly.

### 6.2 Component Integration

Components (e.g., `ProjectCard`) receive strictly typed Sanity content as props, often using TypeScript's `Omit` to specify required fields.

## 7. Implementation Status

| Feature                 | Status    | Notes                                      |
| ----------------------- | --------- | ------------------------------------------ |
| Basic Integration       | ✅ Complete | Core setup with client, schemas, studio. |
| Content Models          | ✅ Complete | Project, Post, Author, Category, Block.  |
| Image Handling          | ✅ Complete | `urlFor` builder, Next.js Image.         |
| Type-Safe Queries       | ✅ Complete | Typed API functions and interfaces.      |
| Custom Studio Structure | ✅ Complete | Prioritized blog content navigation.     |
| Live Preview            | 🚧 Planned  | Setup exists, but not fully implemented. |
| Project Filtering       | 🚧 Planned  | No current filtering implementation.     |

## 8. Best Practices Observed

- **Type Safety**: Strong typing throughout schemas, API functions, and components.
- **Modularity**: Clear separation of concerns in the `src/sanity` directory.
- **Performance**: Server Component data fetching, CDN enabled.
- **Developer Experience**: Custom studio structure, reusable types.
- **Component Design**: Minimal props via `Omit`, consistent patterns.
