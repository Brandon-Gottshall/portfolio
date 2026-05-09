# Drizzle Type System & Validation

This document describes our approach to database type safety and validation using Drizzle ORM with Zod integration.

## Overview

Our type system architecture follows these principles:

1. **Single Source of Truth**: Database schema definitions in `src/drizzle/schema.ts` are the canonical source of type information
2. **Type Inference**: TypeScript types are inferred directly from Drizzle schema definitions
3. **Zod Validation**: Validation schemas are generated directly from Drizzle tables
4. **Consistent Patterns**: Standard patterns for database operations and validation
5. **Colocated Types**: Types, schemas, and their augmentations are kept together by domain

This approach eliminates "split brain" issues where types are defined in multiple places and can become out of sync.

## Key Components

### Type Inference

Types are inferred directly from Drizzle tables using the `InferSelectModel` and `InferInsertModel` types from Drizzle ORM:

```typescript
import type { InferSelectModel } from 'drizzle-orm'
import * as schema from '@schema'

// Type for data retrieved from the 'projects' table
export type Project = InferSelectModel<typeof schema.projects>
```

### Zod Schema Generation

Validation schemas are generated from Drizzle tables using `drizzle-zod`:

```typescript
import { createSelectSchema, createInsertSchema } from 'drizzle-zod'
import * as schema from '@schema'

// Generate Zod schemas from Drizzle tables
export const projectSelectSchema = createSelectSchema(schema.projects)
export const projectInsertSchema = createInsertSchema(schema.projects)

// Add additional validation or constraints
export const projectCreateSchema = projectInsertSchema
  .omit({ id: true, createdAt: true, updatedAt: true })
  .extend({
    title: z.string().min(3).max(255),
    shortDescription: z.string().min(10).max(500)
  })

// Schema for updates (all fields optional)
export const projectUpdateSchema = projectCreateSchema.partial()
```

## Usage Patterns

### In Server Actions

```typescript
import { projectCreateSchema } from '@/schemas/project.schema'
import { db } from '@connection'
import { projects } from '@schema'

export async function createProject(data: unknown) {
  // Validate input data
  const validated = projectCreateSchema.parse(data)
  
  // Insert into database
  return await db.insert(projects).values(validated)
}
```

### In Components

```typescript
import type { Project } from '@/types/project'

// Components receive the inferred types
function ProjectCard({ title, shortDescription, status }: Omit<Project, 'id' | 'slug'>) {
  // Component implementation
}
```

## Maintaining the Type System

### Adding New Table Fields

1. Add the field to the appropriate table in `src/drizzle/schema.ts`
2. Run migrations to update the database
3. Update any Zod schema refinements if needed

No type updates are needed as they're automatically inferred!

### Adding New Tables

1. Define the new table in `src/drizzle/schema.ts`
2. Create a new schema file in `src/schemas/<domain>.ts` that exports both types and schemas
3. Use the common utilities from `src/schemas/common.ts` for consistent patterns

## Project-Specific Implementation

### Project Types

Our project type is inferred directly from the Drizzle schema:

```typescript
// src/types/project.ts
import type { InferSelectModel } from 'drizzle-orm'
import * as schema from '@schema'
import { z } from 'zod'
import { createSelectSchema, createInsertSchema } from 'drizzle-zod'

// Export ProjectStatus enum from schema for reuse
export type ProjectStatus = typeof schema.projectStatusEnum.enumValues[number]

// Infer project type directly from schema
export type Project = InferSelectModel<typeof schema.projects>

// Generate Zod schemas automatically
export const projectSelectSchema = createSelectSchema(schema.projects)
export const projectInsertSchema = createInsertSchema(schema.projects)

// Create operation-specific schemas with additional validation
export const projectCreateSchema = projectInsertSchema
  .omit({ id: true, createdAt: true, updatedAt: true })
  .extend({
    title: z.string().min(3).max(255),
    shortDescription: z.string().min(10).max(500),
    technologies: z.array(z.string()).min(1)
  })

export const projectUpdateSchema = projectCreateSchema.partial()
```

### UI Type Adaptations

For components that need differently shaped data (e.g., direct image URLs instead of IDs):

```typescript
// Helper type for UI components that need direct image URLs
export type ProjectUI = Omit<Project, 'thumbnailId'> & {
  thumbnail: string // Direct URL instead of ID
}

// Helper function to transform DB projects to UI projects
export function toProjectUI(project: Project, getImageUrl: (id: number) => string): ProjectUI {
  const { thumbnailId, ...rest } = project
  return {
    ...rest,
    thumbnail: thumbnailId ? getImageUrl(thumbnailId) : '/placeholder.jpg'
  }
}
```

## Common Commands

### Generate Migration Files

```bash
# Generate migration files based on schema changes
pnpm drizzle-kit generate
```

### Push Schema Changes (Development)

```bash
# Push schema changes directly to database (dev only)
pnpm drizzle-kit push
```

### Run Migrations

```bash
# Apply migrations to database
pnpm drizzle-kit migrate
```

## Best Practices

### Schema-Driven Development

1. **Define Schema First**: Always start by defining or updating the database schema
2. **Use Type Inference**: Avoid manually defining types that could be inferred
3. **Validate Early**: Use Zod schemas to validate data as early as possible in the request flow

### Type Safety Guidelines

1. **No Type Casting**: Avoid `as` or type assertions that bypass type safety
2. **Use Zod for Parsing**: Parse external data with Zod before database operations
3. **Explicit Error Handling**: Handle validation errors explicitly with proper user feedback

### Code Organization

1. **Schema Definitions**: Keep all table definitions in `src/drizzle/schema.ts`
2. **Colocated Types and Schemas**: Keep types and their related schemas in the same domain-specific file
3. **Direct Path Aliases**: Use `@schemas` path alias to import directly from domain files
4. **Domain Organization**: Organize schemas by domain in separate files

### Performance Considerations

1. **Select Only Needed Fields**: Use partial selects when retrieving large tables
2. **Batch Database Operations**: Use transactions for related operations
3. **Cache Validation Results**: Consider caching validation results for frequent operations

## References

- [Drizzle Documentation](https://orm.drizzle.team/)
- [drizzle-zod Documentation](https://github.com/drizzle-team/drizzle-orm/tree/main/drizzle-zod)
- [Zod Documentation](https://zod.dev/)
