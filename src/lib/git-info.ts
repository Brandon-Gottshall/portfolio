import { execSync } from 'child_process';

export function getLastCommitDate(): string {
  try {
    // Get the last commit date in ISO format
    const date = execSync('git log -1 --format=%cI').toString().trim();
    return new Date(date).toISOString().split('T')[0];
  } catch (error) {
    console.error('Error getting last commit date:', error);
    return new Date().toISOString().split('T')[0];
  }
} 