import React from 'react'
import { AlertTriangle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export function NoDataWarning() {
  return (
    <Alert
      variant='destructive'
      className='bg-white/95 dark:bg-navy-darkest/95'
    >
      <AlertTriangle className='w-4 h-4' />
      <AlertTitle>No Data Available</AlertTitle>
      <AlertDescription>
        No GitHub statistics are available for this category. This could be
        because no repositories were found or the data collection failed.
      </AlertDescription>
    </Alert>
  )
}
