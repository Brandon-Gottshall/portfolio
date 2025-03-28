import { buildConfig } from 'payload/config'
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

// Ensure SSL is enabled in the connection string with additional parameters
const dbUrl = process.env.DATABASE_URL || ''
const sslEnabledUrl = dbUrl.includes('?')
  ? `${dbUrl}&sslmode=require&ssl=true&sslcert=rds-ca-2019-root.pem`
  : `${dbUrl}?sslmode=require&ssl=true&sslcert=rds-ca-2019-root.pem`

const config = {
  admin: {
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
      connectionString: sslEnabledUrl,
      ssl: { rejectUnauthorized: false }
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
