import * as migration_20250328_013140_fix_project_status_enum from './20250328_013140_fix_project_status_enum'

export const migrations = [
  {
    up: migration_20250328_013140_fix_project_status_enum.up,
    down: migration_20250328_013140_fix_project_status_enum.down,
    name: '20250328_013140_fix_project_status_enum'
  }
]
