export function formatBytes (bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

export function getSafePercentage (value: number, total: number): number {
  if (total === 0 || isNaN(total)) return 0
  if (value === 0 || isNaN(value)) return 0
  return (value / total) * 100
}
