// @ts-ignore -- buildConfig is exported by payload but type resolution struggles here
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'
// import { webpackBundler } from '@payloadcms/bundler-webpack'

import { Users } from './collections/Users.ts'
import { Media } from './collections/Media.ts'
import { Projects } from './collections/Projects.ts'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Build the database connection string.
// Neon's connection URL already includes `sslmode=require`, and the pool config below
// sets `ssl: { rejectUnauthorized: false }` for production. Don't append a cert path —
// the previous AWS RDS setup referenced a `rds-ca-2019-root.pem` file that isn't shipped.
const dbUrl = process.env.DATABASE_URL || ''

const isProd = process.env.NODE_ENV === 'production'

const connectionString = dbUrl

const config = {
  admin: {
    user: 'users',
    // bundler: webpackBundler(),
    meta: {
      titleSuffix: '- Portfolio',
      favicon: '/favicon.ico'
    }
  },
  collections: [Users, Media, Projects],
  editor: lexicalEditor({}),
  db: postgresAdapter({
    pool: {
      connectionString,
      ssl: isProd ? { rejectUnauthorized: false } : undefined
    },
    migrationDir: path.resolve(dirname, '../drizzle/migrations'),
    push: process.env.NODE_ENV === 'development' // Enable push in development only
  }),
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || '',
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, '../payload-types.ts')
  },
  graphQL: {
    schemaOutputFile: path.resolve(dirname, '../generated-schema.graphql')
  },
  upload: {
    limits: {
      fileSize: 5000000 // 5MB
    }
  }
}

export default buildConfig(config)
