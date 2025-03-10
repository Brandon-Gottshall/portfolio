"use client"

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface Repository {
  fork: boolean
  languages_url: string
  contents_url: string
  default_branch: string
  name: string
}

interface RepoFile {
  name: string
  path: string
  type: 'file' | 'dir'
}

interface Stats {
  [key: string]: number
}

interface Props {
  type: 'languages' | 'frameworks' | 'tools'
}

export default function GithubLanguageStats({ type }: Props) {
  const [languageStats, setLanguageStats] = useState<Stats>({})
  const [frameworkStats, setFrameworkStats] = useState<Stats>({})
  const [toolStats, setToolStats] = useState<Stats>({})
  const [repoCount, setRepoCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const username = process.env.NEXT_PUBLIC_GITHUB_USERNAME
        const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN
        
        if (!username || !token) {
          throw new Error('GitHub credentials not configured')
        }

        const headers = {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'X-GitHub-Api-Version': '2022-11-28'
        }

        console.log('Fetching repos for:', username)
        const response = await fetch(`https://api.github.com/users/${username}/repos`, { headers })
        
        if (!response.ok) {
          console.error('GitHub API Error:', response.status, await response.text())
          throw new Error(`Failed to fetch repositories: ${response.status}`)
        }
        
        const repos = await response.json() as Repository[]
        const nonForkRepos = repos.filter(repo => !repo.fork)
        setRepoCount(nonForkRepos.length)

        const languages: Stats = {}
        const frameworks: Stats = {}
        const tools: Stats = {}

        // Define framework and tool mappings with more specific package names
        const frameworkMap: Record<string, string[]> = {
          'Next.js': ['next', 'nextjs'],
          'React': ['react', 'react-dom', '@react/', 'preact'],
          'Vue.js': ['vue', '@vue/'],
          'Angular': ['@angular/', 'angular'],
          'NestJS': ['@nestjs/'],
          'Express': ['express'],
          'Flutter': ['flutter', 'flutter_bloc', 'flutter_riverpod', 'flutter_hooks'],
          'Tailwind CSS': ['tailwindcss', '@tailwindcss/'],
          'Prisma': ['@prisma/client', 'prisma'],
          'MongoDB': ['mongodb', 'mongoose'],
          'PostgreSQL': ['pg', 'postgres', 'postgresql'],
          'Django': ['django'],
          'Flask': ['flask'],
          'FastAPI': ['fastapi'],
          'PyTorch': ['torch', 'pytorch'],
          'TensorFlow': ['tensorflow'],
          'Pandas': ['pandas'],
          'NumPy': ['numpy']
        }

        const toolMap: Record<string, string[]> = {
          'Testing': ['jest', '@jest/', 'cypress', '@testing-library/', 'pytest', '@vitest/', 'mocha', 'chai'],
          'Jupyter Notebook': ['jupyter', 'notebook', 'ipykernel', '.ipynb'],
          'ESLint': ['eslint', '@eslint/'],
          'Prettier': ['prettier'],
          'Docker': ['docker'],
          'AWS SDK': ['@aws-sdk/', 'aws-sdk'],
          'Redis': ['redis', 'ioredis'],
          'SQLite': ['sqlite', 'sqlite3'],
          'VS Code': ['@vscode/', 'vscode'],
          'Webpack': ['webpack', '@webpack/'],
          'Babel': ['@babel/', 'babel'],
          'Nodemon': ['nodemon'],
          'PM2': ['pm2']
        }
        
        await Promise.all(
          nonForkRepos.map(async (repo) => {
            try {
              // Fetch languages for this repo
              const langResponse = await fetch(repo.languages_url, { headers })
              if (langResponse.ok) {
                const repoLanguages = await langResponse.json() as Record<string, number>
                // Count languages by repo instead of bytes
                Object.keys(repoLanguages).forEach(lang => {
                  // Filter out Jupyter Notebook from languages
                  if (lang !== 'Jupyter Notebook') {
                    languages[lang] = (languages[lang] || 0) + 1
                  }
                })
              }

              // Try to fetch package.json
              const packageJsonUrl = repo.contents_url.replace('{+path}', 'package.json')
              const packageJsonResponse = await fetch(packageJsonUrl, { headers })
              
              if (packageJsonResponse.ok) {
                const data = await packageJsonResponse.json()
                const content = JSON.parse(Buffer.from(data.content, 'base64').toString())
                
                // Analyze dependencies and devDependencies
                const allDeps = {
                  ...content.dependencies || {},
                  ...content.devDependencies || {}
                }

                // Check dependencies for frameworks and tools
                Object.keys(allDeps).forEach(dep => {
                  // Check frameworks
                  Object.entries(frameworkMap).forEach(([frameworkName, patterns]) => {
                    if (patterns.some(pattern => dep.toLowerCase().includes(pattern.toLowerCase()))) {
                      frameworks[frameworkName] = (frameworks[frameworkName] || 0) + 1
                    }
                  })

                  // Check tools
                  Object.entries(toolMap).forEach(([toolName, patterns]) => {
                    if (patterns.some(pattern => dep.toLowerCase().includes(pattern.toLowerCase()))) {
                      tools[toolName] = (tools[toolName] || 0) + 1
                    }
                  })
                })
              }

              // Check for Jupyter Notebooks in the repo
              try {
                const treeUrl = repo.contents_url.replace('{+path}', '')
                const treeResponse = await fetch(treeUrl, { headers })
                if (treeResponse.ok) {
                  const files = await treeResponse.json() as RepoFile[]
                  const hasNotebooks = files.some(file => file.name.endsWith('.ipynb'))
                  if (hasNotebooks) {
                    tools['Jupyter Notebook'] = (tools['Jupyter Notebook'] || 0) + 1
                  }
                }
              } catch (error) {
                console.log(`Error checking for notebooks in ${repo.name}:`, error)
              }

              // Try to fetch requirements.txt for Python projects
              const requirementsUrl = repo.contents_url.replace('{+path}', 'requirements.txt')
              const requirementsResponse = await fetch(requirementsUrl, { headers })
              
              if (requirementsResponse.ok) {
                const data = await requirementsResponse.json()
                const content = Buffer.from(data.content, 'base64').toString()
                
                content.split('\n').forEach(line => {
                  const package_name = line.split('==')[0]?.toLowerCase().trim()
                  if (package_name) {
                    // Check frameworks
                    Object.entries(frameworkMap).forEach(([frameworkName, patterns]) => {
                      if (patterns.some(pattern => package_name.includes(pattern.toLowerCase()))) {
                        frameworks[frameworkName] = (frameworks[frameworkName] || 0) + 1
                      }
                    })

                    // Check tools
                    Object.entries(toolMap).forEach(([toolName, patterns]) => {
                      if (patterns.some(pattern => package_name.includes(pattern.toLowerCase()))) {
                        tools[toolName] = (tools[toolName] || 0) + 1
                      }
                    })
                  }
                })
              }

              // Try to fetch pubspec.yaml for Flutter/Dart projects
              const pubspecUrl = repo.contents_url.replace('{+path}', 'pubspec.yaml')
              const pubspecResponse = await fetch(pubspecUrl, { headers })
              
              if (pubspecResponse.ok) {
                const data = await pubspecResponse.json()
                const content = Buffer.from(data.content, 'base64').toString()
                
                // Simple YAML parsing for dependencies
                content.split('\n').forEach(line => {
                  const trimmedLine = line.trim()
                  if (trimmedLine && !trimmedLine.startsWith('#')) {
                    const package_name = trimmedLine.split(':')[0]?.toLowerCase().trim()
                    if (package_name) {
                      // Check frameworks
                      Object.entries(frameworkMap).forEach(([frameworkName, patterns]) => {
                        if (patterns.some(pattern => package_name.includes(pattern.toLowerCase()))) {
                          frameworks[frameworkName] = (frameworks[frameworkName] || 0) + 1
                        }
                      })

                      // Check tools
                      Object.entries(toolMap).forEach(([toolName, patterns]) => {
                        if (patterns.some(pattern => package_name.includes(pattern.toLowerCase()))) {
                          tools[toolName] = (tools[toolName] || 0) + 1
                        }
                      })
                    }
                  }
                })
              }
            } catch (error) {
              console.log(`Skipping dependency analysis for repo: ${repo}`, error)
            }
          })
        )
        
        setLanguageStats(languages)
        setFrameworkStats(frameworks)
        setToolStats(tools)
      } catch (error) {
        console.error('GitHub Stats Error:', error)
        setError(error instanceof Error ? error.message : 'Failed to fetch GitHub data')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  // Get the appropriate stats based on type
  const stats = type === 'languages' 
    ? languageStats 
    : type === 'frameworks'
    ? frameworkStats
    : toolStats

  const sortedStats = Object.entries(stats)
    .map(([name, count]) => ({
      name,
      count,  // Keep track of the actual count
      percentage: (count / repoCount) * 100
    }))
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 8) // Show top 8 items

  if (loading) {
    return (
      <div className="h-48 flex items-center justify-center text-navy dark:text-cream">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-48 flex items-center justify-center text-red dark:text-red-bright">
        <p className="text-sm">{error}</p>
      </div>
    )
  }

  return (
    <TooltipProvider delayDuration={100}>
      <div className="space-y-6">
        {sortedStats.map((stat) => (
          <div key={stat.name} className="group">
            <div className="flex justify-between mb-2">
              <span className="font-code text-navy dark:text-cream">{stat.name}</span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="px-2 py-1 -my-1 rounded hover:bg-cream/50 dark:hover:bg-navy-light/30 cursor-help transition-colors">
                    <span className="text-gray-dark dark:text-tan">
                      {stat.percentage.toFixed(1)}%
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="left" className="bg-navy dark:bg-cream border-navy/10 dark:border-cream/10">
                  <p className="text-cream dark:text-navy font-medium">
                    Used in {stat.count} {stat.count === 1 ? 'repository' : 'repositories'}
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="relative h-2 bg-cream/50 dark:bg-navy-light/30 rounded-full overflow-hidden cursor-help group-hover:bg-cream/70 dark:group-hover:bg-navy-light/50 transition-colors">
                  <div 
                    className="h-full bg-red/80 dark:bg-red-bright/80 rounded-full transition-all duration-500 group-hover:bg-red dark:group-hover:bg-red-bright" 
                    style={{ width: `${stat.percentage}%` }}
                  />
                  {/* Invisible larger hit area */}
                  <div className="absolute inset-0 -my-3" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-navy dark:bg-cream border-navy/10 dark:border-cream/10">
                <p className="text-cream dark:text-navy font-medium">
                  {stat.name} is used in {stat.count} out of {repoCount} repositories
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
        ))}
      </div>
    </TooltipProvider>
  )
} 