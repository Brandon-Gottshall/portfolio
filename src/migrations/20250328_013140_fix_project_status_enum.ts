import type { Payload } from 'payload'

type MigrationFunction = ({ payload }: { payload: Payload }) => Promise<void>

export const up: MigrationFunction = async ({ payload }) => {
  await payload.db.drizzle.execute(`
    -- Create new enum type
    DO $$ 
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'project_status_new') THEN
        CREATE TYPE project_status_new AS ENUM ('in-development', 'completed', 'archived');
      END IF;
    END $$;

    -- Drop the default constraint
    ALTER TABLE projects ALTER COLUMN status DROP DEFAULT;

    -- Update existing data
    UPDATE projects SET status = CASE 
      WHEN status::text = 'draft' THEN 'in-development'
      WHEN status::text = 'published' THEN 'completed'
      ELSE status::text
    END;

    -- Alter column type
    ALTER TABLE projects ALTER COLUMN status TYPE project_status_new USING status::text::project_status_new;

    -- Drop old enum if it exists
    DROP TYPE IF EXISTS enum_projects_status;

    -- Rename new enum to final name
    ALTER TYPE project_status_new RENAME TO enum_projects_status;

    -- Restore the default value with the new type
    ALTER TABLE projects ALTER COLUMN status SET DEFAULT 'completed'::enum_projects_status;

    -- Ensure NOT NULL constraint is set
    ALTER TABLE projects ALTER COLUMN status SET NOT NULL;
  `)
}

export const down: MigrationFunction = async ({ payload }) => {
  await payload.db.drizzle.execute(`
    -- Drop the default constraint first
    ALTER TABLE projects ALTER COLUMN status DROP DEFAULT;

    -- Convert enum back to text
    ALTER TABLE projects ALTER COLUMN status TYPE text;
    
    -- Drop the enum type
    DROP TYPE IF EXISTS enum_projects_status;

    -- Restore the default value as text
    ALTER TABLE projects ALTER COLUMN status SET DEFAULT 'completed';

    -- Ensure NOT NULL constraint is set
    ALTER TABLE projects ALTER COLUMN status SET NOT NULL;
  `)
}
