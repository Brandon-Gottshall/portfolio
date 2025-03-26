# Migration Plan: Sanity CMS to Payload CMS with Vercel Postgres

**Version:** 1.3
**Date:** 2024-03≠-26

## 1. Introduction

This document outlines the migration strategy for transitioning the project's content management system from Sanity CMS (currently v3.80.1) to Payload CMS, utilizing Vercel Postgres as the database backend. The current implementation leverages `@sanity/client` (v6.28.3), `next-sanity` (v9.9.5), and a structured approach documented in `Technical Documentation/sanity-implementation.md`.

The migration aims to replace the proprietary Sanity backend with an open-source, self-hostable Payload CMS instance, offering greater flexibility and control. Vercel Postgres provides a serverless, scalable SQL database solution tightly integrated with the existing Vercel hosting environment. This plan details the analysis, setup, mapping, migration, frontend adaptation, testing, and deployment phases required for a successful transition.

## 2. In-Depth Analysis of the Existing Sanity CMS Implementation

* **Schema Definitions:**
  * **Document Types:** `project`, `post`, `author`, `category`. (Ref: `Technical Documentation/sanity-implementation.md:45-49`, `Technical Documentation/sanity-implementation.md:55`)
  * **Object/Utility Types:** `blockContent` (reusable rich text with image support). (Ref: `Technical Documentation/sanity-implementation.md:45`, `Technical Documentation/sanity-implementation.md:88`)
  * **Key Fields (from `projectType.ts`):** `title` (string), `slug` (slug), `featured` (boolean), `projectUrl` (url), `githubUrl` (url), `thumbnail` (image with hotspot), `shortDescription` (text), `technologies` (array of string), `description` (blockContent), `status` (string with list options). (Ref: `src/sanity/schemaTypes/projectType.ts:13-90`)
* **Content Models & Relationships:**
  * `postType` likely references `authorType` and `categoryType` using Sanity's `reference` field. (Inferred from names and docs `Technical Documentation/sanity-implementation.md:47`)
  * `projectType` uses `blockContent` for its `description` field. (Ref: `src/sanity/schemaTypes/projectType.ts:75`)
* **Data Fetching:**
  * Uses `@sanity/client` configured in `src/sanity/lib/client.ts`. (Ref: `src/sanity/lib/client.ts`)
  * Uses `next-sanity` for potential live previews (`src/sanity/lib/live.ts`). (Ref: `src/sanity/lib/live.ts`)
  * Employs type-safe API functions organized by schema type in `src/sanity/api/` (e.g., `src/sanity/api/project.ts`). (Ref: `Technical Documentation/sanity-implementation.md:13`, `Technical Documentation/sanity-implementation.md:98-106`)
  * Likely uses GROQ queries within the API functions (e.g., `src/sanity/api/project.ts:19-33`).
  * Data is fetched in Next.js Server Components. (Ref: `Technical Documentation/sanity-implementation.md:132`)
* **Custom Configurations & Features:**
  * Custom Studio structure defined in `src/sanity/structure.ts`. (Ref: `Technical Documentation/sanity-implementation.md:17`, `Technical Documentation/sanity-implementation.md:126`)
  * Environment variable validation in `src/sanity/env.ts`. (Ref: `Technical Documentation/sanity-implementation.md:16`, `Technical Documentation/sanity-implementation.md:24-35`)
  * Custom preview preparation in schemas (e.g., `src/sanity/schemaTypes/projectType.ts:91-110`).
  * Type augmentation for Sanity modules in `src/types/external-modules.d.ts`. (Ref: `src/types/external-modules.d.ts`)
  * Image URL generation via `src/sanity/lib/image.ts`. (Ref: `src/sanity/lib/image.ts`)
* **Access Control:** No explicit custom roles defined in the provided Sanity context. Payload's default access control or custom functions will need to be configured based on requirements (e.g., public read access, admin-only write access).

* **Initial Mapping Table (Schema Overview):** *(Remains a high-level overview; detailed mapping in Section 4)*

    | Sanity Document Type | Sanity Field Name   | Sanity Field Type        | Notes                                    |
    | :------------------- | :------------------ | :----------------------- | :--------------------------------------- |
    | `project`            | `title`             | `string`                 | Required                                 |
    | `project`            | `slug`              | `slug`                   | Required, sourced from `title`           |
    | `project`            | `featured`          | `boolean`                |                                          |
    | `project`            | `projectUrl`        | `url`                    |                                          |
    | `project`            | `githubUrl`         | `url`                    |                                          |
    | `project`            | `thumbnail`         | `image`                  | Required, hotspot enabled                |
    | `project`            | `shortDescription`  | `text`                   | Required, max 200 chars                  |
    | `project`            | `technologies`      | `array` (of `string`)    | Tag layout                               |
    | `project`            | `description`       | `blockContent`           | Reusable rich text type                  |
    | `project`            | `status`            | `string` (with list)     | `in-development`, `completed`, `archived` |
    | `post`               | *Fields TBD*        | *Types TBD*              | Likely includes `reference` to `author`, `category` |
    | `author`             | *Fields TBD*        | *Types TBD*              |                                          |
    | `category`           | *Fields TBD*        | *Types TBD*              |                                          |
    | `blockContent`       | *N/A (Object Type)* | `array` (of `block`, `image`) | Reusable rich text definition            |

## 3. Comprehensive Guide to Setting Up Vercel Postgres

1. **Create Database:**
    * Navigate to your project in the Vercel Dashboard.
    * Go to the "Storage" tab.
    * Click "Connect Database" -> "Create New" -> "Postgres".
    * Vercel offers multiple providers through their marketplace, including Vercel Postgres (default), Neon, and Supabase. Select the one that best matches your specific requirements.
    * Provide a database name (e.g., `payload-cms-db`) and select the region closest to your application's deployment region to minimize latency. Ideally, choose the same region as your Edge and Serverless Function regions.
    * Click "Create".
2. **Retrieve Credentials & Configure Environment Variables:**
    * Vercel automatically creates environment variables for your database. Within the Vercel dashboard, be sure to click "Show" to reveal the full values of any secrets before copying them.
    * Copy these variables from the Vercel project settings ("Settings" -> "Environment Variables") into your local `.env` file for development. Ensure they are also set correctly in your Vercel project's Production, Preview, and Development environments.
    * **Security Best Practice:** Add your `.env` file to `.gitignore` to prevent accidentally exposing sensitive database credentials in your repository.
    * **Key Vercel Postgres Environment Variables:**

        | Variable Name             | Description                                                                                                | Usage Notes                                                                                                                               |
        | :------------------------ | :--------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------- |
        | `POSTGRES_URL`            | **Primary Connection String (Pooled).** Use this for serverless functions.                                 | Payload's `@payloadcms/db-vercel-postgres` adapter uses this by default on Vercel.                                                        |
        | `POSTGRES_PRISMA_URL`     | Prisma-specific pooled connection string.                                                                  | Generally use `POSTGRES_URL` unless specifically using Prisma directly outside Payload.                                                   |
        | `POSTGRES_URL_NON_POOLING`| Direct connection string (Non-Pooled). Avoid using in serverless functions due to connection limits.       | Useful for database management tools or long-running processes, but **not** for typical application requests on Vercel.                   |
        | `POSTGRES_USER`           | Database username.                                                                                         | Included in connection strings.                                                                                                           |
        | `POSTGRES_HOST`           | Database host address.                                                                                     | Included in connection strings.                                                                                                           |
        | `POSTGRES_PASSWORD`       | Database password.                                                                                         | Included in connection strings.                                                                                                           |
        | `POSTGRES_DATABASE`       | Database name.                                                                                             | Included in connection strings.                                                                                                           |

    * **Important:** Always use the **pooled connection string** (`POSTGRES_URL`) for Payload running in Vercel's serverless environment. This leverages Vercel's connection pooling to efficiently manage database connections and avoid exceeding limits.
3. **Configure Payload Adapter:**
    * Install the Vercel-optimized adapter: `pnpm add @payloadcms/db-vercel-postgres` (or npm/yarn).
    * In your `payload.config.ts`, configure the adapter. It automatically detects and uses `process.env.POSTGRES_URL` when deployed on Vercel.

    ```typescript
    // payload.config.ts
    import { buildConfig } from 'payload/config';
    import { vercelPostgresAdapter } from '@payloadcms/db-vercel-postgres';
    // ... other imports (collections, globals, etc.)

    export default buildConfig({
      // ... other config options
      db: vercelPostgresAdapter({
        // Adapter automatically uses process.env.POSTGRES_URL on Vercel.
        // No explicit connectionString needed here when deploying to Vercel.
        // For local development against a local Postgres instance (e.g., localhost),
        // the adapter intelligently uses the standard 'pg' module.
        // If you need to force '@vercel/postgres' locally (e.g., with a Docker Neon DB setup),
        // use: forceUseVercelPostgres: true
        // [https://payloadcms.com/docs/database/postgres]

        // Optional pool config (rarely needed, Vercel manages pooling):
        // pool: { ... }
      }),
      // Define collections, globals, etc.
      collections: [
        // Your collections here
      ],
      // ...
    });
    ```

    * **Serverless Connection Management:** While Vercel Postgres and the adapter handle pooling, be mindful of long-running operations or complex queries within a single serverless function invocation that might hold connections longer than necessary. Structure code to connect, query, and release connections efficiently.

4. **Configure Drizzle with Payload:**
    * **Install Dependencies:**

      ```bash
      pnpm add drizzle-orm @payloadcms/db-drizzle
      pnpm add -D drizzle-kit
      ```

    * **Create Drizzle Configuration:**

      ```typescript
      // src/drizzle/config.ts
      import { defineConfig } from 'drizzle-kit'
      
      export default defineConfig({
        schema: './src/payload/schema.ts',
        driver: 'pg',
        dbCredentials: {
          connectionString: process.env.POSTGRES_URL!
        },
        verbose: true,
        strict: true
      })
      ```

    * **Configure Payload with Drizzle:**

      ```typescript
      // payload.config.ts
      import { buildConfig } from 'payload/config'
      import { drizzleAdapter } from '@payloadcms/db-drizzle'
      import { PostgresJsDatabase } from 'drizzle-orm/postgres-js'
      
      export default buildConfig({
        db: drizzleAdapter({
          // Drizzle will automatically use POSTGRES_URL in production
          url: process.env.POSTGRES_URL,
          // Optional pool configuration
          pool: {
            max: 5
          }
        }),
        // ... rest of your Payload config
      })
      ```

    * **Development vs Production:**
      * **Development:** Use `db push` for schema changes during development

        ```bash
        pnpm drizzle-kit push:pg
        ```

      * **Production:** Generate and apply migrations

        ```bash
        # Generate migration
        pnpm drizzle-kit generate:pg
        
        # Apply migration (via Payload's migration system)
        pnpm payload migrate
        ```

    * **Type Generation:**

      ```bash
      # Generate Drizzle types
      pnpm drizzle-kit generate:pg --custom
      ```

5. **Best Practices:**
    * Never use `db push` in production; always use migrations
    * Keep migrations in version control (`src/payload/migrations/`)
    * Use Payload's migration system rather than running Drizzle migrations directly
    * Set appropriate pool sizes based on your Vercel plan limits
    * Monitor query performance using Vercel Postgres insights

6. **Schema Management:**
    * Let Payload manage the schema through its collections config
    * Avoid direct schema manipulation with Drizzle unless absolutely necessary
    * If custom tables are needed outside Payload:

      ```typescript
      // src/payload/schema.ts
      import { pgTable, serial, text } from 'drizzle-orm/pg-core'
      
      // Custom table example (if needed)
      export const customTable = pgTable('custom_table', {
        id: serial('id').primaryKey(),
        name: text('name').notNull(),
        // ... other fields
      })
      ```

7. **Error Handling:**

    ```typescript
    // src/payload/db/errorHandler.ts
    import { DrizzleError } from 'drizzle-orm'
    
    export function handleDrizzleError(error: unknown) {
      if (error instanceof DrizzleError) {
        // Log the error appropriately
        console.error('Database error:', error)
        
        // Return user-friendly error
        return new Error('An error occurred while accessing the database')
      }
      throw error
    }
    ```

## 4. Detailed Mapping of Sanity CMS Schemas to Payload CMS Collections

This section outlines the methodology for translating the existing Sanity CMS schema structure into Payload CMS collections and fields. Since no content is being migrated, this mapping serves as the blueprint for building the new content structure in Payload.

* **Methodology:**
    1. **Analyze Sanity Schema:** Review each Sanity document type (`project`, `post`, `author`, `category`) and object type (`blockContent`) defined in the Sanity Studio codebase (e.g., `src/sanity/schemaTypes/`). Identify all fields, their types (`string`, `slug`, `boolean`, `url`, `image`, `text`, `array`, `reference`, `blockContent`), validation rules, and relationships.
    2. **Create a Detailed Mapping Table:** Document every field from the Sanity schema and its corresponding Payload equivalent. This explicit mapping will serve as a reference during implementation and helps ensure nothing is missed. The table should include:
       * Sanity field name and type
       * Payload field name and type
       * Any transformations required
       * Notes on validation rules or special handling
    3. **Map Sanity Types to Payload Collections:** For each Sanity document type, define a corresponding Payload collection (e.g., `project` -> `projects`).
    4. **Handle Rich Text (`blockContent`):** Determine the best Payload equivalent for Sanity's Portable Text (`blockContent`). **The goal is *not* to perfectly replicate all custom Sanity Portable Text features (like specific custom blocks or marks) but to use the closest standard Payload field.**
       * **Option A: `richText` (Lexical - Recommended):** Provides standard rich text editing capabilities. Use Payload's default Lexical editor configuration. **Avoid complex custom configurations solely to mimic Sanity features.** This is the preferred approach for simplicity and maintainability.
       * **Option B: `blocks`:** Only consider if the content structure is inherently block-based and significantly diverges from standard rich text, *and* if the standard `richText` field is insufficient. This adds complexity.
       * **Conversion Tools:** While direct content migration isn't needed for this project, for future reference, tools like `sanity-blocks-to-text` can help convert Sanity's Portable Text to plain text, and custom scripts can be written to transform Portable Text to Lexical format if needed.
    5. **Map Relationships:** Translate Sanity `reference` fields into Payload `relationship` fields.
        * Single reference: `type: 'relationship', relationTo: 'targetCollection'`
        * Array of references: `type: 'relationship', relationTo: 'targetCollection', hasMany: true`
    6. **Replicate Custom Configurations:** Identify any custom Sanity configurations (validation rules, custom input components, conditional fields, initial values). **Evaluate if these are strictly necessary.** If so, find equivalent implementations in Payload using standard field properties (`validate`, `defaultValue`), hooks (`beforeChange`, `afterRead`), or admin UI customizations. **Prioritize simplicity over exact replication.**
    7. **Define Media Handling:** Create a dedicated `media` collection in Payload for handling image and file uploads, mapping Sanity `image` fields to Payload `upload` fields with `relationTo: 'media'`. Add necessary fields like `alt` text to the `media` collection.

* **Collections:** `projects`, `posts`, `authors`, `categories`, `media`.
* **Globals:** None identified.
* **Field Mapping Table:**

    | Sanity Document Type | Sanity Field Name   | Sanity Field Type        | Payload CMS Collection | Payload CMS Field Name | Payload CMS Field Type | Notes                                                                                                                                                           |
    | :------------------- | :------------------ | :----------------------- | :--------------------- | :--------------------- | :--------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | `project`            | `title`             | `string`                 | `projects`             | `title`                | `text`                 | Required. Use `admin.useAsTitle: true`.                                                                                                                         |
    | `project`            | `slug`              | `slug`                   | `projects`             | `slug`                 | `text`                 | Required, unique, indexed. Use a `beforeValidate` hook for auto-generation from `title`.                                                                        |
    | `project`            | `featured`          | `boolean`                | `projects`             | `featured`             | `checkbox`             | Default `false`.                                                                                                                                                |
    | `project`            | `projectUrl`        | `url`                    | `projects`             | `projectUrl`           | `text`                 | Add URL validation using Payload's `validate` function.                                                                                                           |
    | `project`            | `githubUrl`         | `url`                    | `projects`             | `githubUrl`            | `text`                 | Add URL validation using Payload's `validate` function.                                                                                                           |
    | `project`            | `thumbnail`         | `image`                  | `projects`             | `thumbnail`            | `upload`               | Required. `relationTo: 'media'`. Sanity hotspot data is not directly transferable; implement cropping/positioning within Payload's `imageSizes` or frontend. |
    | `project`            | `shortDescription`  | `text`                   | `projects`             | `shortDescription`     | `textarea`             | Required, add `maxLength: 200`.                                                                                                                                 |
    | `project`            | `technologies`      | `array` (of `string`)    | `projects`             | `technologies`         | `array`                | Field within array: `{ name: 'technology', type: 'text', required: true }`. Consider Payload `tags` field type if suitable.                                     |
    | `project`            | `description`       | `blockContent`           | `projects`             | `description`          | `richText`             | **Use standard Payload `richText` (Lexical). Do not replicate custom Sanity block features.**                                                                   |
    | `project`            | `status`            | `string` (with list)     | `projects`             | `status`               | `select`               | Required. Options: `in-development`, `completed`, `archived`. Default: `completed`.                                                                             |
    | `post`               | `title`             | `string`                 | `posts`                | `title`                | `text`                 | Required. `admin.useAsTitle: true`. (Assuming standard fields)                                                                                                  |
    | `post`               | `slug`              | `slug`                   | `posts`                | `slug`                 | `text`                 | Required, unique, indexed. Hook for auto-generation. (Assuming standard fields)                                                                                 |
    | `post`               | `author`            | `reference`              | `posts`                | `author`               | `relationship`         | `relationTo: 'authors'`, required, `hasMany: false`. (Assuming standard fields)                                                                                 |
    | `post`               | `categories`        | `array` (of `reference`) | `posts`                | `categories`           | `relationship`         | `relationTo: 'categories'`, `hasMany: true`. (Assuming standard fields)                                                                                         |
    | `post`               | `publishedDate`     | `datetime`               | `posts`                | `publishedDate`        | `date`                 | Add date picker options (`admin.date`). (Assuming standard fields)                                                                                              |
    | `post`               | `body`              | `blockContent`           | `posts`                | `body`                 | `richText`             | **Use standard Payload `richText` (Lexical). Do not replicate custom Sanity block features.** (Assuming standard fields)                                          |
    | `author`             | `name`              | `string`                 | `authors`              | `name`                 | `text`                 | Required. `admin.useAsTitle: true`. (Assuming standard fields)                                                                                                  |
    | `author`             | `picture`           | `image`                  | `authors`              | `picture`              | `upload`               | `relationTo: 'media'`. (Assuming standard fields)                                                                                                               |
    | `category`           | `title`             | `string`                 | `categories`           | `title`                | `text`                 | Required. `admin.useAsTitle: true`. (Assuming standard fields)                                                                                                  |
    | `category`           | `description`       | `text`                   | `categories`           | `description`          | `textarea`             | (Assuming standard fields)                                                                                                                                      |
    | `blockContent`       | *N/A (Object Type)* | `array` (of `block`, `image`) | *N/A*                  | *N/A*                  | `richText`             | **Map to standard Payload `richText` features. Avoid custom block/node implementation unless absolutely essential.**                                          |
    | *N/A*                | *N/A*               | *N/A*                    | `media`                | *Standard Fields*      | `upload`               | Create a dedicated collection for images/files. Add `alt` text field (required).                                                                                |

* **Slugs:** Map Sanity `slug` to Payload `text` with `unique: true`, `index: true`. Implement a `beforeValidate` hook (as shown in Section 6) to auto-generate the slug from the `title` field if empty.

## 5. Step-by-Step Configuration of Payload CMS

1. **Initialize Payload Project:**
    * Use `npx create-payload-app@latest my-payload-project -t blank` (or `pnpm`/`yarn`) for a new project, **OR**
    * Integrate Payload into your existing Next.js app. Ensure Node.js v20.9.0+ is used. Follow Payload's Next.js integration guide.
2. **Install Dependencies:** `pnpm install payload @payloadcms/db-vercel-postgres @payloadcms/richtext-lexical` (or equivalents).
3. **Configure `payload.config.ts`:**
    * **Database:** Add the `vercelPostgresAdapter` as shown in **Section 3**.
    * **Admin Users:** Define a `users` collection (or similar) for admin access and link it via `admin: { user: 'users' }`. Ensure this collection has necessary fields like `email`, `password`, and potentially `roles`.
    * **Server URL:** Set `serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL`. Add this variable to `.env` (e.g., `http://localhost:3000`) and Vercel environment settings (your production URL).
    * **Secret:** Set `secret: process.env.PAYLOAD_SECRET`. Generate a strong random string (e.g., using `openssl rand -base64 32`) and add it to `.env` and Vercel.
    * **CORS/CSRF:** Configure `cors` to allow requests from your frontend domain(s) and `csrf` to allow your frontend domain or configure it to use a custom header approach if needed.

        ```typescript
        cors: [
          process.env.FRONTEND_URL || 'http://localhost:3001', // Adjust port if needed
          // Add other allowed origins if necessary
        ].filter(Boolean),
        csrf: [
          process.env.FRONTEND_URL || 'http://localhost:3001',
          // Add other allowed origins if necessary
        ].filter(Boolean),
        ```

    * **Editor:** Configure the Lexical editor if using `richText` fields (recommended, see **Section 4**): `editor: lexicalEditor({})`. Import `lexicalEditor` from `@payloadcms/richtext-lexical`. Customize features as needed to match Sanity's `blockContent`.
    * **GraphQL Path:** (Optional) Define `graphQL: { schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql') }` if using GraphQL.
    * **TypeScript Generation:** Add `typescript: { outputFile: path.resolve(__dirname, 'payload-types.ts') }` to generate types for frontend usage.
4. **Define Collections/Globals:** Create collection configuration files (see **Section 6**) based on the mapping in **Section 4**. Import and add these collections to the `collections` array in `payload.config.ts`.
5. **Environment Variables:** Ensure `POSTGRES_URL`, `PAYLOAD_PUBLIC_SERVER_URL`, `PAYLOAD_SECRET`, and `FRONTEND_URL` (if used in CORS/CSRF) are configured locally (`.env`) and in all relevant Vercel environments (Production, Preview, Development).
6. **Create First Admin User:** Run the app locally (`pnpm dev`). Payload will typically prompt you to create the first user via the CLI or by navigating to `/admin/create-first-user` in your browser. Follow the prompts.
7. **Database Schema Sync (Local Dev):** Payload's Postgres adapters use Drizzle ORM's `db push` by default in development mode (`pnpm dev`). This automatically syncs schema changes from your Payload config to your local database, simplifying development. Avoid mixing `db push` with manual migration commands locally unless you have a specific reason. For production/staging, use migrations (see **Section 10**).

## 6. Implementation of Payload CMS Collections Based on Mapped Schemas

1. **Create Collection Files:** Organize in a logical directory, e.g., `src/payload/collections/`. Create files like `Users.ts`, `Projects.ts`, `Posts.ts`, `Authors.ts`, `Categories.ts`, `Media.ts`.
2. **Define `Media` Collection:** (Essential for `upload` fields)

    ```typescript
    // src/payload/collections/Media.ts
    import type { CollectionConfig } from 'payload/types';
    import path from 'path';

    export const Media: CollectionConfig = {
      slug: 'media',
      upload: {
        staticDir: path.resolve(__dirname, '../../../media'), // Adjust path relative to payload.config.ts
        // Consider using Vercel Blob or S3 for production storage via plugins
        mimeTypes: ['image/*', 'application/pdf'],
        // Define imageSizes for automatic resizing on upload
        imageSizes: [
          { name: 'thumbnail', width: 480, height: 320, position: 'centre' },
          { name: 'card', width: 768, height: 1024, position: 'centre' },
          { name: 'tablet', width: 1024, height: undefined, position: 'centre' },
        ],
        adminThumbnail: 'thumbnail', // Use 'thumbnail' size in admin UI list/preview
        // Consider adding formatOptions for output formats like webp
        // formatOptions: { format: 'webp', options: { quality: 80 } },
      },
      access: {
        read: () => true, // Publicly readable files
        // Restrict create/update/delete based on user roles (e.g., only logged-in admins)
        create: ({ req }) => req.user?.role === 'admin', // Example: Only admins can upload
        update: ({ req }) => req.user?.role === 'admin',
        delete: ({ req }) => req.user?.role === 'admin',
      },
      fields: [
        {
          name: 'alt',
          type: 'text',
          required: true,
          label: 'Alt Text',
        },
        // Add other media fields if needed (e.g., caption)
      ],
    };
    ```

3. **Define Mapped Collections (Examples based on Section 4):**

    ```typescript
    // src/payload/collections/Projects.ts
    import type { CollectionConfig } from 'payload/types';
    import { slugify } from '../utils/slugify'; // Ensure you have a slugify utility

    export const Projects: CollectionConfig = {
      slug: 'projects',
      admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'status', 'updatedAt'],
        // Enable search on specific fields
        // searchableFields: ['title', 'shortDescription'],
      },
      access: {
        read: () => true, // Public read access
        // Define create/update/delete based on roles
        create: ({ req }) => req.user?.role === 'admin',
        update: ({ req }) => req.user?.role === 'admin',
        delete: ({ req }) => req.user?.role === 'admin',
      },
      fields: [
        // --- Main Content ---
        { name: 'title', type: 'text', required: true, label: 'Project Title' },
        {
          name: 'description', // Mapped from Sanity blockContent
          type: 'richText', // Using Lexical (recommended)
          required: true,
          label: 'Full Description',
          // Add editor customizations here if needed
        },
        { name: 'shortDescription', type: 'textarea', required: true, maxLength: 200, label: 'Short Summary' },
        {
          name: 'technologies',
          type: 'array', // Simple array of text tags
          label: 'Technologies Used',
          fields: [{ name: 'technology', type: 'text', required: true }],
          // Alternatively, use 'tags' field type if more suitable:
          // type: 'tags',
        },
        { name: 'thumbnail', type: 'upload', relationTo: 'media', required: true, label: 'Project Thumbnail' },

        // --- Metadata & Sidebar ---
        {
          name: 'slug', type: 'text', required: true, unique: true, index: true,
          admin: { position: 'sidebar', description: 'Auto-generated from title if left blank.' },
          hooks: { beforeValidate: [({ value, data }) => (!value && data?.title) ? slugify(data.title) : value] }
        },
        { name: 'featured', type: 'checkbox', defaultValue: false, label: 'Featured Project', admin: { position: 'sidebar' } },
        {
          name: 'status', type: 'select', required: true,
          options: [
            { label: 'In Development', value: 'in-development' },
            { label: 'Completed', value: 'completed' },
            { label: 'Archived', value: 'archived' },
          ],
          defaultValue: 'completed',
          admin: { position: 'sidebar' }
        },
        {
          name: 'projectUrl', type: 'text', label: 'Project URL',
          validate: (value) => { /* Basic URL validation logic */ return true; }
        },
        {
          name: 'githubUrl', type: 'text', label: 'GitHub URL',
          validate: (value) => { /* Basic URL validation logic */ return true; }
        },
      ],
    };

    // src/payload/collections/Posts.ts
    import type { CollectionConfig } from 'payload/types';
    import { slugify } from '../utils/slugify';

    export const Posts: CollectionConfig = {
      slug: 'posts',
      admin: { useAsTitle: 'title', defaultColumns: ['title', 'author', 'status', 'publishedDate'] },
      access: { read: () => true, /* Add admin access controls */ },
      fields: [
        // --- Main Content ---
        { name: 'title', type: 'text', required: true },
        { name: 'body', type: 'richText', required: true, label: 'Post Content' }, // Or 'blocks'

        // --- Metadata & Sidebar ---
        {
          name: 'slug', type: 'text', required: true, unique: true, index: true,
          admin: { position: 'sidebar' },
          hooks: { beforeValidate: [({ value, data }) => (!value && data?.title) ? slugify(data.title) : value] }
        },
        {
          name: 'publishedDate', type: 'date', required: true, label: 'Publication Date',
          admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly', displayFormat: 'yyyy-MM-dd' } }
        },
        {
          name: 'author', type: 'relationship', relationTo: 'authors', required: true, hasMany: false, // Explicitly false for single relationship
          admin: { position: 'sidebar' }
        },
        {
          name: 'categories', type: 'relationship', relationTo: 'categories', hasMany: true,
          admin: { position: 'sidebar' }
        },
        // Add a status field (e.g., draft, published)
        {
          name: 'status', type: 'select', options: ['draft', 'published'], defaultValue: 'draft',
          admin: { position: 'sidebar' }
        },
        // Add other fields like excerpt (textarea), featuredImage (upload) if needed
        // { name: 'excerpt', type: 'textarea', maxLength: 300 },
        // { name: 'featuredImage', type: 'upload', relationTo: 'media' },
      ],
      // Add hooks for setting publishedDate on status change, etc.
    };

    // src/payload/collections/Authors.ts
    import type { CollectionConfig } from 'payload/types';

    export const Authors: CollectionConfig = {
      slug: 'authors',
      admin: { useAsTitle: 'name' },
      access: { read: () => true, /* Add admin access controls */ },
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'picture', type: 'upload', relationTo: 'media', label: 'Author Picture' },
        // Add other author fields (e.g., bio - richText or textarea)
        // { name: 'bio', type: 'textarea' },
      ],
    };

    // src/payload/collections/Categories.ts
    import type { CollectionConfig } from 'payload/types';
    import { slugify } from '../utils/slugify'; // Add slug for categories too

    export const Categories: CollectionConfig = {
      slug: 'categories',
      admin: { useAsTitle: 'title' },
      access: { read: () => true, /* Add admin access controls */ },
      fields: [
        { name: 'title', type: 'text', required: true },
        {
          name: 'slug', type: 'text', required: true, unique: true, index: true,
          admin: { position: 'sidebar' },
          hooks: { beforeValidate: [({ value, data }) => (!value && data?.title) ? slugify(data.title) : value] }
        },
        { name: 'description', type: 'textarea' },
      ],
    };
    ```

4. **Import Collections in `payload.config.ts`:** Ensure all defined collection files (`Users`, `Projects`, `Posts`, `Authors`, `Categories`, `Media`) are imported and added to the `collections` array in `payload.config.ts`.
5. **Generate Types:** Run `pnpm payload generate:types` (or equivalent) to create/update `src/payload-types.ts`.
6. **Generate DB Schema (Optional):** Run `pnpm payload generate:db-schema` if you plan to interact with Drizzle directly.

## 7. Detailed Adaptation of Frontend Data Fetching Mechanisms

Transitioning the frontend requires updating how data is fetched from the new Payload CMS API. Payload offers REST, GraphQL, and Local APIs. Assuming the use of the REST API (common for Next.js Server Components):

1. **Update API Client/Configuration:**
    * Replace `@sanity/client` usage with standard `fetch` calls or a lightweight wrapper.
    * Base URL: Use `process.env.PAYLOAD_PUBLIC_SERVER_URL` (or a dedicated internal API route if preferred).
    * Authentication: If fetching restricted content, include necessary authentication headers (e.g., API keys if configured in Payload, or session cookies if using Payload auth). Public content typically requires no auth.
2. **Translate Queries (GROQ to Payload REST):**
    * The following table provides a mapping of common GROQ patterns to their Payload REST API equivalents:

    | Operation | Sanity GROQ | Payload REST API | Notes |
    |-----------|-------------|------------------|-------|
    | **Basic Fetch** | `*[_type == "project"]` | `GET /api/projects` | Fetches all projects |
    | **Fetch by Slug** | `*[_type == "project" && slug.current == "your-slug"][0]` | `GET /api/projects?where[slug][equals]=your-project-slug&limit=1` | Fetches a specific project by slug |
    | **Filtering (Simple)** | `*[_type == "project" && featured == true]` | `GET /api/projects?where[featured][equals]=true` | Boolean filter |
    | **Filtering (Multiple)** | `*[_type == "post" && publishedDate > "2023-01-01"]` | `GET /api/posts?where[publishedDate][greater_than]=2023-01-01` | Date comparison |
    | **Sorting** | `*[_type == "post"] \| order(publishedDate desc)` | `GET /api/posts?sort=-publishedDate` | Use `-` prefix for descending order |
    | **Pagination** | `*[_type == "post"] \| order(publishedDate desc) [0...10]` | `GET /api/posts?sort=-publishedDate&page=1&limit=10` | Page 1 with 10 items per page |
    | **Field Selection** | `*[_type == "project"]{title, slug}` | `GET /api/projects?fields[title]=true&fields[slug]=true` | Select specific fields |
    | **Relationship (Simple)** | `*[_type == "post"]{..., "author": author->}` | `GET /api/posts?depth=1` | Depth=1 populates direct relationships |
    | **Relationship (Nested)** | `*[_type == "post"]{..., "author": author->{..., "avatar": image}}` | `GET /api/posts?depth=2` | Depth=2 populates nested relationships |
    | **Text Search** | `*[_type == "post" && [title, body] match "search term"]` | `GET /api/posts?where[or][0][title][like]=search term&where[or][1][body][like]=search term` | Text search across multiple fields |

    * **Basic Fetch:** Fetching all projects: `GET /api/projects`
    * **Fetch by Slug:** Fetching a specific project: `GET /api/projects?where[slug][equals]=your-project-slug`

3. **Update Fetching Functions:** Refactor functions in `src/sanity/api/` (e.g., `src/sanity/api/project.ts`) to use `fetch` with the new Payload endpoints and query parameters. Update return types using the generated `payload-types.ts`.

    ```typescript
    // Example: src/payload/api/projects.ts (New or adapted file)
    import type { Project } from '@/payload-types'; // Import generated types

    const PAYLOAD_API_URL = process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000';

    export async function getAllProjects(): Promise<Project[]> {
      try {
        // Add '&depth=1' if you need populated fields like thumbnail details immediately
        const response = await fetch(`${PAYLOAD_API_URL}/api/projects?limit=100&depth=1`, {
          // cache: 'no-store', // Or configure Next.js caching as needed
          next: { tags: ['projects'] }, // Example using Next.js cache tags
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch projects: ${response.statusText}`);
        }
        const data = await response.json();
        return data.docs as Project[]; // Payload returns paginated results in 'docs'
      } catch (error) {
        console.error("Error fetching projects:", error);
        return [];
      }
    }

    export async function getProjectBySlug(slug: string): Promise<Project | null> {
      try {
        // Use depth=2 if you need nested relationships like author picture within a post reference
        const response = await fetch(`${PAYLOAD_API_URL}/api/projects?where[slug][equals]=${slug}&limit=1&depth=2`, {
          next: { tags: [`projects_${slug}`] },
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch project ${slug}: ${response.statusText}`);
        }
        const data = await response.json();
        return (data.docs?.[0] as Project) || null;
      } catch (error) {
        console.error(`Error fetching project ${slug}:`, error);
        return null;
      }
    }
    ```

4. **Cache Invalidation:** Implement cache invalidation strategies if using Next.js caching (e.g., using Payload webhooks triggered on content changes to revalidate specific paths or tags).

## 8. Thorough Update of Frontend Content Rendering Components

Adapt React components to consume and render data fetched from Payload.

1. **Identify Components:** Locate components currently rendering Sanity data (e.g., `ProjectCard`, `PostBody`, image renderers, components using `PortableText`).
2. **Update Prop Types:** Replace Sanity-specific types with types imported from the generated `src/payload-types.ts`.
3. **Adapt Data Access:** Adjust how data is accessed within components based on Payload's REST API response structure.
    * Relationships: Access populated data directly (e.g., `props.post.author.name` if `depth >= 1`). Check if the relationship field contains an object (populated) or just an ID string/number (not populated or `depth=0`).
    * Uploads (Media): Access file details from the populated media object (e.g., `props.project.thumbnail.url`, `props.project.thumbnail.alt`, `props.project.thumbnail.width`). Ensure the `thumbnail` field itself is checked for existence before accessing its properties.
4. **Rich Text Rendering:**
    * **If using Payload `richText` (Lexical):**
        * Install the standard frontend renderer: `pnpm add @payloadcms/richtext-react`.
        * Import the renderer component: `import { RichText } from '@payloadcms/richtext-react';`
        * Use it directly in your component: `<RichText content={props.project.description} />`.
        * **Simplification:** Since the goal is *not* to replicate custom Sanity features, **custom serializers for the frontend `<RichText>` component should generally be unnecessary.** Rely on the standard rendering provided by `@payloadcms/richtext-react`.
    * **If using Payload `blocks`:** (Less likely given the simplification goal)
        * Create React components for each defined block type.
        * Map the `props.project.description` array to these components based on `blockType`.
5. **Image Rendering:**
    * Update `next/image` components or standard `<img>` tags.
    * `src`: Use the URL from the populated upload field: `src={props.project.thumbnail.url}`. Check if `thumbnail` and `url` exist.
    * `alt`: Use the required `alt` field from the media object: `alt={props.project.thumbnail.alt || ''}`.
    * `width`/`height`: Use dimensions from the media object if available: `width={props.project.thumbnail.width}`, `height={props.project.thumbnail.height}`. If using `imageSizes`, you might access URLs for specific sizes like `props.project.thumbnail.sizes?.thumbnail?.url`.
6. **Maintain Consistency:** Strive for visual and functional parity where it makes sense with standard Payload features, but **do not invest effort in replicating non-essential Sanity-specific UI behaviors or complex custom field interactions.** Adjust styles as needed for the standard Payload data structures and rendering.

## 9. Rigorous Testing and Validation Procedures

Since no production content is being migrated, testing focuses on the correctness of the new Payload setup and the ability to manage content effectively.

1. **Schema and Functionality Testing (Payload Admin):**
    * **CRUD Operations:** Thoroughly test creating, reading, updating, and deleting entries for *every* collection (`projects`, `posts`, `authors`, `categories`, `media`, `users`) via the Payload admin panel (`/admin`).
    * **Field Validation:** Verify all field types, validation rules (`required`, `maxLength`, `unique`, custom `validate`), and default values work as expected.
    * **Relationships:** Test creating and linking related documents (e.g., assigning an author and categories to a post). Verify `hasMany` relationships allow selecting multiple items.
    * **Rich Text/Blocks:** Test the rich text editor features (or block functionality) extensively. Ensure content saves and renders correctly. Test any custom elements/nodes configured.
    * **Uploads:** Test uploading different file types (images, PDFs) to the `media` collection. Verify `alt` text is required. Check if `imageSizes` are generated correctly (if configured). Test linking media to other collections (e.g., `thumbnail`).
    * **Access Control:** Log in as different user roles (if defined, e.g., admin vs. editor) and verify that permissions (read, create, update, delete) are enforced correctly for each collection and field.
    * **Slug Generation:** Verify slugs are auto-generated correctly from titles and that uniqueness constraints work.
2. **Frontend Integration Testing:**
    * **Data Display:** Verify that *new* content created in Payload is fetched and rendered correctly on the frontend for all relevant pages and components.
    * **Relationships:** Ensure related data (e.g., author name on a post page, project thumbnail) is displayed correctly (requires correct `depth` parameter in fetch calls).
    * **Rich Text Rendering:** Confirm rich text content renders correctly using the chosen frontend renderer, including any custom elements.
    * **Images:** Verify images load correctly with proper `src` and `alt` text.
    * **Links:** Test all internal and external links generated from CMS data.
3. **User Acceptance Testing (UAT):**
    * Allow stakeholders (e.g., content editors) to use the Payload admin panel in a staging environment.
    * Task them with creating representative content for all collections.
    * Gather feedback on usability, workflow, and any discrepancies compared to the Sanity experience (where relevant).
    * Have them review the frontend rendering of the content they created.
4. **Performance Testing:**
    * Assess the load times of key frontend pages displaying Payload data.
    * Monitor the response times of Payload API endpoints under typical load.
    * Check the performance of the Payload admin panel, especially with larger amounts of test data.
5. **Regression Testing:**
    * Ensure that the changes related to integrating Payload haven't negatively impacted other parts of the application (e.g., unrelated features, styling).

6. **Advanced Testing for Regression Prevention:**
    * **Content Integrity Checks:** Create simple automated scripts to compare content structure between Sanity and Payload. For example:

      ```typescript
      // scripts/compare-content-structure.ts
      import { sanityClient } from '../src/sanity/lib/client';
      import { payload } from '../src/payload';
      
      async function compareProjectStructure() {
        // Get sample project from Sanity
        const sanityProject = await sanityClient.fetch(`*[_type == "project"][0]`);
        
        // Get sample project from Payload
        const payloadProjects = await payload.find({
          collection: 'projects',
          limit: 1
        });
        const payloadProject = payloadProjects.docs[0];
        
        // Log structure comparison
        console.log('Sanity structure:', Object.keys(sanityProject));
        console.log('Payload structure:', Object.keys(payloadProject));
        
        // Check for required fields
        const requiredFields = ['title', 'slug', 'description', 'shortDescription'];
        for (const field of requiredFields) {
          console.log(`Field "${field}" in Sanity:`, !!sanityProject[field]);
          console.log(`Field "${field}" in Payload:`, !!payloadProject[field]);
        }
      }
      
      compareProjectStructure();
      ```

    * **Link Verification:** Test all internal navigation links to ensure proper routing:

      ```typescript
      // Example test case for navigation links using Playwright or a similar testing library
      test('Navigation links should work correctly', async ({ page }) => {
        await page.goto('/');
        
        // Test main navigation links
        const navLinks = await page.locator('nav a').all();
        for (const link of navLinks) {
          const href = await link.getAttribute('href');
          if (href && !href.startsWith('http')) { // Internal link
            await link.click();
            await page.waitForLoadState('networkidle');
            expect(page.url()).toContain(href);
            await page.goBack();
          }
        }
      });
      ```

    * **SEO Audit:** Verify meta tags, titles, and descriptions are correctly populated from CMS data:

      ```typescript
      // Example test case for SEO verification
      test('SEO elements should be correctly populated', async ({ page }) => {
        // Test project page SEO
        await page.goto('/projects/example-project');
        
        // Check page title
        expect(await page.title()).toContain('Example Project');
        
        // Check meta description
        const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
        expect(metaDescription).toBeTruthy();
        
        // Check canonical URL
        const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
        expect(canonical).toContain('/projects/example-project');
      });
      ```

    * **Cross-Browser and Device Testing:** Test the site on multiple browsers (Chrome, Firefox, Safari, Edge) and devices (desktop, tablet, mobile) to ensure responsive design works correctly.

    * **Accessibility Testing:** Run basic accessibility checks using tools like Lighthouse or axe:

      ```bash
      # Using Lighthouse CLI
      npm install -g lighthouse
      lighthouse https://your-site.com --view --only-categories=accessibility
      
      # Or integrate with Playwright/Jest for automated testing
      ```

    * **Performance Load Testing (Optional):** For a basic performance check, use a simple load testing tool:

      ```bash
      # Using k6 (https://k6.io/)
      npm install -g k6
      
      # Create a simple test script
      cat > load-test.js << EOF
      import http from 'k6/http';
      import { sleep } from 'k6';
      
      export default function() {
        http.get('https://your-site.com/');
        http.get('https://your-site.com/projects');
        sleep(1);
      }
      EOF
      
      # Run the test with 10 virtual users for 30 seconds
      k6 run --vus 10 --duration 30s load-test.js
      ```

    * **Documentation:** Keep a testing log documenting all tests performed, issues found, and resolutions applied. This can be a valuable addition to a portfolio project.

## 10. Deployment Guide for the Updated Application

Deploying Payload CMS integrated with a Next.js app to Vercel requires careful handling of environment variables and database schema management.

1. **Preparation:**
    * Merge all finalized code changes (Payload config, collections, frontend adaptations) into the deployment branch (e.g., `main` or `production`).
    * **Verify Environment Variables:** Double-check that *all* required environment variables (`POSTGRES_URL`, `PAYLOAD_SECRET`, `PAYLOAD_PUBLIC_SERVER_URL`, `FRONTEND_URL`, etc.) are correctly configured in the Vercel project settings for the Production environment (and Preview/Development environments as needed). **Use the pooled `POSTGRES_URL`**.
    * **Database Migrations (Crucial for Production/Staging):** Unlike local development using `db push`, Vercel deployments require explicit database migrations managed by Payload.
        * **Generate Migration File(s):** After finalizing all schema changes in your `payload.config.ts` and collection files locally, run the migration generation command:

            ```bash
            pnpm payload migrate:create your_migration_name
            # or yarn payload migrate:create your_migration_name
            # or npx payload migrate:create your_migration_name
            ```

            This command compares your Payload config schema to the database state tracked by Payload (usually via a `_payload_migrations` table in your DB) and generates a SQL migration file (e.g., `src/payload/migrations/YYYYMMDD_HHMMSS_your_migration_name.sql`).
        * **Commit Migration Files:** Add and commit the generated migration file(s) to your Git repository. These files define the necessary SQL changes to update the database schema.
2. **Configure Vercel Build Command for Migrations:**
    * Modify your `package.json` build script to run Payload migrations *before* the Next.js build command. This ensures the database schema is up-to-date before the application builds and starts.
    * Example `package.json` script:

        ```json
        {
          "scripts": {
            "dev": "cross-env PAYLOAD_CONFIG_PATH=src/payload/payload.config.ts nodemon",
            "build:payload": "cross-env PAYLOAD_CONFIG_PATH=src/payload/payload.config.ts payload build",
            "build:next": "next build",
            "build": "pnpm copyfiles && pnpm build:payload && pnpm build:next", // Original build
            // --- Vercel Specific Build ---
            // Ensure payload CLI runs migrations, then build payload admin, then build next app
            "vercel-build": "pnpm payload migrate && pnpm build",
            "copyfiles": "copyfiles -u 1 \"src/payload/migrations/**/*.sql\" dist/payload/migrations", // Ensure migrations are copied to build output if needed by Payload runtime
            "start": "cross-env PAYLOAD_CONFIG_PATH=dist/payload.config.js NODE_ENV=production node dist/server.js", // Example start script
            "lint": "next lint",
            "payload": "cross-env PAYLOAD_CONFIG_PATH=src/payload/payload.config.ts payload",
            "generate:types": "pnpm payload generate:types",
            "generate:db-schema": "pnpm payload generate:db-schema"
            // Add migrate:create, migrate:status etc. if desired
          }
          // ... other package.json content
        }
        ```

    * **Important:** In your Vercel project settings (Build & Development Settings), set the **Build Command** to `pnpm vercel-build` (or `yarn vercel-build` / `npm run vercel-build`). Ensure Payload CLI (`payload`) is available in the build environment (it should be if `payload` is in your `dependencies` or `devDependencies`). The `copyfiles` step might be necessary depending on your project structure to ensure migration files are accessible at runtime if Payload needs them, adjust the path accordingly.
3. **Deployment to Vercel:**
    * Push the code changes (including committed migration files) to the branch connected to your Vercel project (e.g., `main`).
    * Vercel will trigger a new build. Monitor the build logs carefully, paying close attention to the `pnpm payload migrate` step. Ensure it completes successfully. If it fails, the database schema is likely out of sync or there's an issue with the migration file or database connection.
4. **Post-Deployment Checks:**
    * Access the deployed application URL and verify it loads correctly.
    * Access the Payload admin panel (`/admin`) and log in.
    * Perform basic smoke tests: check if collections are visible, try creating/viewing a piece of content.
    * Verify frontend pages are loading data from the production Payload instance.
5. **DNS Configuration:** Update DNS records if migrating a domain to point to the new Vercel deployment.
6. **Monitoring and Maintenance:**
    * Monitor Vercel logs and function performance.
    * Set up uptime monitoring for the application and Payload admin panel.
    * Plan for regular updates to Payload CMS, its plugins, and other dependencies.
    * Regularly back up the Vercel Postgres database (Vercel may offer automated backups, or use standard Postgres tools).

## 11. Conclusion and Recommendations

This revised plan provides a detailed roadmap for establishing Payload CMS with Vercel Postgres as a replacement for the existing Sanity CMS setup, specifically tailored for a scenario **without production content migration**. The focus is entirely on accurately replicating the intended content structure based on the Sanity schema **using standard Payload fields and features**, configuring Payload, adapting the frontend, and deploying the new system. **Exact replication of Sanity-specific functionality, especially custom rich text features, is explicitly out of scope.**

Success hinges on:

* **Pragmatic Schema Mapping:** Diligently translating Sanity types and fields into the closest standard Payload equivalents, **avoiding unnecessary complexity to mimic Sanity** (**Section 4**).
* **Correct Configuration:** Properly setting up Payload, the Vercel Postgres adapter, environment variables, and the standard Lexical editor (**Sections 3, 5**).
* **Thorough Frontend Adaptation:** Updating data fetching logic and rendering components using standard Payload data structures and renderers (**Sections 7, 8**).
* **Robust Database Migration Workflow:** Understanding and correctly implementing the `migrate:create` and `migrate` workflow for staging/production environments (**Section 10**).
* **Comprehensive Testing:** Rigorously testing all aspects of the Payload admin panel functionality and frontend integration using *newly created* content (**Section 9**).

**Key Considerations:**

* **Rich Text Simplicity:** By using the standard Payload `richText` field and renderer, the complexity associated with mapping/replicating Sanity's Portable Text is significantly reduced.
* **Database Workflow:** The distinction between local development (`db push`) and staging/production (`migrate`) is critical for database schema management. **Always use `migrate` for deployments.**
* **Environment Variables:** Consistency and correctness of environment variables across local and Vercel environments are paramount.

**Recommendations:**

* **Document Your Migration Process:** Keep a detailed log of your migration journey, including:
  * Initial schema mapping decisions
  * Challenges encountered and solutions implemented
  * Testing strategies employed and results observed
  * Performance optimizations made
  This documentation will be valuable for your portfolio, demonstrating both technical proficiency and methodical problem-solving.

* **Prioritize Standard Features:** Spend adequate time refining the Payload collection definitions (**Section 6**) based on the detailed mapping (**Section 4**) before extensive frontend work. Resist the urge to implement custom field types or complex hooks solely for parity with Sanity unless a core requirement cannot be met otherwise.
* **Use Staging Environment:** Deploy and test thoroughly in a Vercel Preview/Staging environment connected to a separate staging database before deploying to production. Test the migration workflow (`pnpm payload migrate`) in staging.
* **Implement Seed Script (Optional):** Create a Payload seed script (`payload.create(...)`) to populate the development/staging environments with consistent test data, facilitating testing (**Section 9**).
* **Involve Content Editors Early:** Conduct UAT (**Section 9**) with stakeholders in the staging environment to gather feedback on the standard Payload admin experience. Manage expectations regarding differences from the Sanity UI.
* **Monitor Post-Launch:** Closely monitor application performance, logs, and database metrics after going live.
* **Leverage Payload Standard Features:** Utilize Payload's built-in hooks, access control, and standard field options before considering custom development.

By following this simplified, schema-driven setup plan, the project can efficiently transition to a flexible, self-hosted CMS solution powered by Payload and Vercel Postgres, focusing on core content management needs rather than exact feature replication.
