import { AlertTriangle, Clock } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export function NoDataWarning() {
  return (
    <Alert variant="destructive" className="bg-white/95 dark:bg-navy-darkest/95">
      <AlertTriangle className="w-4 h-4" />
      <AlertTitle>No Data Available</AlertTitle>
      <AlertDescription>
        No GitHub statistics are available for this category. This could be because no repositories were found or the data collection failed.
      </AlertDescription>
    </Alert>
  )
}

export function StaleDataWarning({ lastUpdated }: { lastUpdated: string }) {
  // Calculate if data is more than 24 hours old
  const isStale = new Date().getTime() - new Date(lastUpdated).getTime() > 24 * 60 * 60 * 1000

  if (!isStale) return null

  return (
    <Alert variant="default" className="mb-4 border-yellow-200 bg-yellow-50/95 dark:bg-yellow-900/20 dark:border-yellow-800">
      <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-500" />
      <AlertTitle>Data May Be Outdated</AlertTitle>
      <AlertDescription>
        This data was last updated on {new Date(lastUpdated).toLocaleDateString()}. Some information may be outdated.
      </AlertDescription>
    </Alert>
  )
}

export function ZeroCommitWarning() {
  return (
    <span className="inline-flex items-center ml-2 text-xs text-amber-600 dark:text-amber-400">
      <AlertTriangle className="w-3.5 h-3.5 mr-1" />
      No commits found
    </span>
  )
}

export function TinyRepoWarning() {
  return (
    <span className="inline-flex items-center text-red-600 dark:text-red-400">
      <AlertTriangle className="w-3 h-3 mr-0.5" />
      Repo issue
    </span>
  )
}

export function RepositoryError() {
  return (
    <div className="p-2 mt-2 bg-red-50 rounded-md border border-red-200 dark:bg-red-900/20 dark:border-red-700/30">
      <div className="flex items-center">
        <AlertTriangle className="w-4 h-4 mr-1.5 text-red-600 dark:text-red-400" />
        <span className="text-sm font-medium text-red-700 dark:text-red-400">
          Repository Issue Detected
        </span>
      </div>
      <p className="mt-1 text-xs text-red-600/90 dark:text-red-300/90">
        Commits were detected but couldn&apos;t be associated with any repository. This
        usually happens with generated code or when repository detection fails.
      </p>
    </div>
  )
} 