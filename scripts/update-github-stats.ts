import fs from 'fs'
import path from 'path'

interface Repository {
  fork: boolean
  languages_url: string
  contents_url: string
  default_branch: string
  name: string
  full_name: string
  owner: {
    login: string
  }
  html_url: string
}

interface GitHubCommit {
  author: {
    login: string
  } | null
  committer: {
    login: string
  } | null
}

interface DetailedStats {
  repositories: number  // Number of repos using this tech
  usage: number        // Total usage count (e.g., bytes for languages)
}

interface PackageJson {
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
}

interface CachedStats {
  lastUpdated: string
  summary: {
    totalRepos: number
    ownedRepos: number
    contributedRepos: number
    totalCommits: number
    publicRepos: number
    privateRepos: number
    forks: number
  }
  repoCount: number
  languages: Record<string, DetailedStats>
  frameworks: Record<string, DetailedStats>
  tools: Record<string, DetailedStats>
  // Add discovery data
  unrecognizedDependencies: {
    name: string
    count: number
    repos: string[]
  }[]
}

// Define project types and their ignored languages
const PROJECT_IGNORED_LANGUAGES: Record<string, string[]> = {
  // TypeScript projects
  typescript: [
    'JavaScript',  // Compiled output
    'CSS',        // Usually from frameworks/build
    'HTML',       // Usually from frameworks/build
    'SCSS',       // Usually from frameworks/build
    'Less'        // Usually from frameworks/build
  ],

  // Flutter/Dart projects
  flutter: [
    'Swift',        // iOS build output
    'Kotlin',       // Android build output
    'Objective-C',  // iOS build output
    'Java',         // Android build output
    'Ruby',         // CocoaPods
    'C',           // Native build output
    'C++',         // Native build output
    'CMake'        // Build system
  ],

  // React Native projects
  'react-native': [
    'Java',         // Android build output
    'Objective-C',  // iOS build output
    'Swift',        // iOS build output
    'Ruby',         // CocoaPods
    'C',           // Native build output
    'C++',         // Native build output
    'CMake'        // Build system
  ],

  // React projects
  react: [
    'JavaScript',  // If using TypeScript
    'CSS',        // Usually from frameworks
    'HTML',       // Usually from frameworks
    'SCSS',       // Usually from frameworks
    'Less'        // Usually from frameworks
  ],

  // Next.js projects
  next: [
    'JavaScript',  // If using TypeScript
    'CSS',        // Usually from frameworks
    'HTML',       // Usually from frameworks
    'SCSS',       // Usually from frameworks
    'Less',       // Usually from frameworks
    'MDX'         // Usually build time only
  ],

  // Tailwind projects
  tailwind: [
    'CSS',        // All generated
    'SCSS',       // Usually from frameworks
    'Less'        // Usually from frameworks
  ],

  // Node.js projects
  node: [
    'JavaScript', // If using TypeScript
    'C',         // Native addons
    'C++',       // Native addons
    'CMake'      // Build system
  ],

  // Python projects
  python: [
    'JavaScript', // Usually from notebooks or build
    'CSS',       // Usually from notebooks or build
    'HTML',      // Usually from notebooks or build
    'Shell'      // Usually setup scripts
  ],

  // Vanilla Web projects - don't ignore basic web files
  'vanilla-web': [],

  // SQL/Database projects - don't ignore SQL files
  'sql': [],
}

// Define known generated files and build artifacts
const GENERATED_FILES = new Set([
  'Procfile',           // Heroku deployment
  '*.scss',            // Compiled to CSS
  '*.less',            // Compiled to CSS
  '*.sass',            // Compiled to CSS
  '*.gherkin',         // Test files
  '*.feature',         // Test files
  '*.mustache',        // Template files
  '*.php',             // Server-side files
  '*.min.js',          // Minified JS
  '*.min.css',         // Minified CSS
  '*.bundle.js',       // Bundled JS
  '*.d.ts',            // TypeScript declarations
  '*.js.map',          // Source maps
  '*.css.map',         // Source maps
  '*.generated.*',     // Generated files
  '*.compiled.*',      // Compiled files
  '*.transformed.*',   // Transformed files
  '*.processed.*'      // Processed files
])

// Add this array to store all your email addresses
const userEmails = [
  'brandon@nebulaacademy.org'
  // Add any other emails you want to track here
];

// Add a timestamp function to show when each log happens
function logWithTimestamp(message: string) {
  const now = new Date();
  const timestamp = now.toLocaleTimeString();
  console.log(`[${timestamp}] ${message}`);
}

// Modify the fetchWithRetry function to log before and after each fetch
async function fetchWithRetry(url: string, headers: HeadersInit, retries = 3): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    // Add delay between requests (500ms)
    logWithTimestamp(`Waiting 500ms before request...`);
    await delay(500);

    const endpoint = url.split('?')[0]; // Just get the base endpoint for cleaner logs
    logWithTimestamp(`Sending request to ${endpoint}...`);
    
    const response = await fetch(url, { headers });
    logWithTimestamp(`Received response from ${endpoint} with status: ${response.status}`);
    
    // Special handling for 409 Conflict - likely an empty repository
    if (response.status === 409) {
      logWithTimestamp(`Repository is empty or has conflicts - skipping this request`);
      return new Response(null, { status: 409 });
    }
    
    // Check and handle rate limits
    const shouldRetry = await checkRateLimit(response);
    if (shouldRetry) {
      continue;
    }

    if (response.ok) {
      return response;
    }

    if (i < retries - 1) {
      const waitTime = Math.pow(2, i) * 1000;
      logWithTimestamp(`Request failed, retrying in ${waitTime/1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }

  return new Response(null, { status: 500 });
}

// Modify the delay function to show progress during longer waits
async function delay(ms: number) {
  if (ms >= 2000) {
    // For delays >= 2 seconds, show countdown
    const intervals = Math.min(Math.floor(ms / 500), 10); // Max 10 updates
    const step = Math.floor(ms / intervals);
    
    for (let i = 0; i < intervals; i++) {
      const remaining = ms - (i * step);
      logWithTimestamp(`Still waiting... ${(remaining / 1000).toFixed(1)}s remaining`);
      await new Promise(resolve => setTimeout(resolve, step));
    }
  } else {
    // For short delays, just wait
    await new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Helper function to check rate limits and wait if needed
async function checkRateLimit(response: Response) {
  const remaining = parseInt(response.headers.get('x-ratelimit-remaining') || '0');
  const limit = parseInt(response.headers.get('x-ratelimit-limit') || '0');
  const resetTime = parseInt(response.headers.get('x-ratelimit-reset') || '0') * 1000;
  
  logWithTimestamp(`Rate limit status: ${remaining}/${limit} remaining`);
  
  // Only treat as rate limit if it's 403 AND x-ratelimit-remaining is 0
  if (response.status === 403 && remaining === 0) {
    const waitTime = resetTime - Date.now() + 1000;
    logWithTimestamp(`Rate limit exceeded. Waiting ${Math.round(waitTime/1000)} seconds...`);
    await delay(waitTime);
    return true;
  }
  
  // Regular rate limit warning (not exceeded yet)
  if (remaining < 100) {
    const now = Date.now();
    const waitTime = resetTime - now + 1000;
    if (waitTime > 0) {
      logWithTimestamp(`Rate limit low (${remaining} remaining). Waiting ${Math.round(waitTime/1000)} seconds...`);
      await delay(waitTime);
    }
  }

  // Handle other 403 errors separately from rate limits
  if (response.status === 403 && remaining > 0) {
    logWithTimestamp(`Access denied (403) but not rate limited. This may be a permissions issue.`);
    return false; // Don't retry on permission issues
  }

  return false;
}

async function isValidRepository(repo: Repository, headers: HeadersInit): Promise<boolean> {
  try {
    // First check if we can get languages - this is the most important thing we need
    const languagesResponse = await fetchWithRetry(repo.languages_url, headers)
    if (!languagesResponse.ok) {
      console.log(`Skipping ${repo.full_name}: Cannot fetch languages`)
      return false
    }

    // Check if this is a template repository or fork without contributions
    if (repo.fork) {
      // For forks, check if we have made any commits
      try {
        const commitsResponse = await fetchWithRetry(
          `https://api.github.com/repos/${repo.full_name}/commits?author=${process.env.NEXT_PUBLIC_GITHUB_USERNAME}`,
          headers
        )
        if (!commitsResponse.ok || (await commitsResponse.json()).length === 0) {
          console.log(`Skipping ${repo.full_name}: Fork with no contributions`)
          return false
        }
      } catch (error) {
        console.log(`Error checking commits for ${repo.full_name}:`, error)
        return false
      }
    }

    // If we can get languages and it's either not a fork or has our commits, it's valid
    return true
  } catch (error) {
    console.log(`Error validating repository ${repo.full_name}:`, error)
    return false
  }
}

async function shouldFetchPackageFiles(repo: Repository, headers: HeadersInit): Promise<{
  shouldFetchPackageJson: boolean
  shouldFetchPubspecYaml: boolean
  shouldFetchGemfile: boolean
  shouldFetchRequirementsTxt: boolean
}> {
  try {
    // First check if repo name indicates it's likely to have certain package files
    const repoNameLower = repo.name.toLowerCase()
    const isLikelyJS = repoNameLower.includes('node') || 
                       repoNameLower.includes('react') || 
                       repoNameLower.includes('vue') || 
                       repoNameLower.includes('angular') ||
                       repoNameLower.includes('next') ||
                       repoNameLower.includes('typescript') ||
                       repoNameLower.includes('js')
    
    const isLikelyDart = repoNameLower.includes('flutter') || 
                         repoNameLower.includes('dart')
    
    const isLikelyRuby = repoNameLower.includes('rails') || 
                         repoNameLower.includes('ruby')
    
    const isLikelyPython = repoNameLower.includes('django') || 
                          repoNameLower.includes('flask') ||
                          repoNameLower.includes('python')

    // Get the primary language only if the name doesn't already indicate the type
    if (!isLikelyJS && !isLikelyDart && !isLikelyRuby && !isLikelyPython) {
      const languagesResponse = await fetchWithRetry(repo.languages_url, headers)
      if (languagesResponse.ok) {
        const languages = await languagesResponse.json() as Record<string, number>
        const primaryLanguage = Object.entries(languages)
          .sort(([,a], [,b]) => b - a)[0]?.[0] || ''
        
        return {
          shouldFetchPackageJson: ['JavaScript', 'TypeScript'].includes(primaryLanguage),
          shouldFetchPubspecYaml: primaryLanguage === 'Dart',
          shouldFetchGemfile: primaryLanguage === 'Ruby',
          shouldFetchRequirementsTxt: primaryLanguage === 'Python'
        }
      }
    }
    
    // Return based on repo name if we couldn't get languages or if name indicates type
    return {
      shouldFetchPackageJson: isLikelyJS,
      shouldFetchPubspecYaml: isLikelyDart,
      shouldFetchGemfile: isLikelyRuby,
      shouldFetchRequirementsTxt: isLikelyPython
    }
  } catch (error) {
    console.error('Error determining package files to fetch:', error)
    return {
      shouldFetchPackageJson: false,
      shouldFetchPubspecYaml: false,
      shouldFetchGemfile: false,
      shouldFetchRequirementsTxt: false
    }
  }
}

// Define framework and tool mappings
const frameworkMap: Record<string, string[]> = {
  // Frontend Frameworks
  'Next.js': ['next', 'nextjs'],
  'React': ['react', '@react/core'],
  'React Native': ['react-native', '@react-native/', 'expo', '@expo/'],
  'Vue.js': ['vue', '@vue/'],
  'Angular': ['@angular/', 'angular'],
  'Astro': ['astro', '@astrojs/'],
  'Svelte': ['svelte', '@sveltejs/kit'],

  // Backend Frameworks
  'NestJS': ['@nestjs/'],
  'Express': ['express'],
  'Django': ['django'],
  'Flask': ['flask'],
  'FastAPI': ['fastapi'],
  'tRPC': ['@trpc/'],

  // Mobile/Cross-platform
  'Flutter': ['flutter', 'flutter_bloc', 'flutter_riverpod', 'flutter_hooks'],

  // CSS/UI Frameworks
  'Tailwind CSS': ['tailwindcss', '@tailwindcss/'],
  'Shadcn UI': ['@shadcn/ui', 'shadcn-ui'],

  // Data/API Frameworks
  'Prisma': ['@prisma/client', 'prisma'],
  'Drizzle': ['drizzle-orm', '@drizzle/'],
  'GraphQL': ['graphql', '@graphql-tools/', 'type-graphql', '@apollo/'],
  'MongoDB': ['mongodb', 'mongoose'],

  // ML/Data Science
  'PyTorch': ['torch', 'pytorch'],
  'TensorFlow': ['tensorflow'],
  'Pandas': ['pandas'],
  'NumPy': ['numpy']
}

const toolMap: Record<string, string[]> = {
  // Testing Tools
  'Jest': ['jest', '@jest/', '@testing-library/react', '@testing-library/dom', '@testing-library/user-event'],
  'Cypress': ['cypress'],
  'PyTest': ['pytest'],
  'Vitest': ['@vitest/'],
  'Mocha': ['mocha'],
  'Chai': ['chai'],
  
  // Development Tools
  'ESLint': ['eslint', '@eslint/'],
  'Prettier': ['prettier'],
  'TypeScript': ['typescript', '@types/', 'ts-node'],
  'Storybook': ['@storybook/', 'storybook'],
  'Jupyter': ['jupyter', 'notebook', 'ipykernel', '.ipynb'],
  
  // Infrastructure & DevOps
  'Docker': ['docker', 'docker-compose'],
  'GitHub Actions': ['.github/workflows/', 'actions/', '@actions/'],
  'Terraform': ['terraform', '.tf'],
  'Kubernetes': ['kubernetes', 'k8s'],
  
  // Cloud Services
  'AWS': ['@aws-sdk/', 'aws-sdk'],
  'Vercel': ['@vercel/', 'vercel'],
  'Netlify': ['netlify', '@netlify/'],
  'Firebase': ['firebase', '@firebase/'],
  'Supabase': ['@supabase/', 'supabase-js'],
  
  // Databases & Caching
  'Redis': ['redis', 'ioredis'],
  'SQLite': ['sqlite', 'sqlite3'],
  'PostgreSQL': ['pg', 'postgres', 'postgresql'],
  
  // Process Management
  'PM2': ['pm2'],
  
  // Editor/IDE
  'VS Code': ['@vscode/', 'vscode', '.vscode/']
}

// Helper function to check if a file should be ignored
function shouldIgnoreFile(filename: string): boolean {
  // Check if it's a known generated file
  if (GENERATED_FILES.has(filename) || 
      Array.from(GENERATED_FILES).some(pattern => 
        pattern.replace('*', '.*').match(filename)
      )) {
    return true
  }

  // Check if it's in a build/output directory
  const buildDirs = ['dist', 'build', 'out', '.next', '.nuxt', '.output', '.cache']
  if (buildDirs.some(dir => filename.startsWith(dir + '/'))) {
    return true
  }

  // Check if it's a dependency or config file
  const ignoredPatterns = [
    /^(node_modules|vendor)\//,
    /\.(config|conf)\.(js|ts)$/,
    /^\..*rc$/,
    /\.lock$/,
    /package-lock\.json$/,
    /yarn\.lock$/
  ]

  return ignoredPatterns.some(pattern => pattern.test(filename))
}

async function updateGitHubStats() {
  try {
    // Use environment variables with NEXT_PUBLIC_ prefix
    const username = process.env.NEXT_PUBLIC_GITHUB_USERNAME
    const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN
    
    if (!username || !token) {
      throw new Error('GitHub credentials not configured. Please set NEXT_PUBLIC_GITHUB_USERNAME and NEXT_PUBLIC_GITHUB_TOKEN in your .env file')
    }

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'X-GitHub-Api-Version': '2022-11-28'
    }

    // Verify token has required permissions
    const userResponse = await fetchWithRetry('https://api.github.com/user', headers)
    if (!userResponse.ok) {
      throw new Error('Invalid GitHub token')
    }

    console.log('Fetching repos for:', username)
    
    // Fetch all repos (public and private)
    const ownedResponse = await fetchWithRetry(
      `https://api.github.com/user/repos?per_page=100&sort=updated&type=all`,
      headers
    )
    
    if (!ownedResponse.ok) {
      throw new Error(`Failed to fetch owned repositories: ${ownedResponse.status}`)
    }

    // Fetch contributed repos
    const contributedResponse = await fetchWithRetry(
      `https://api.github.com/search/repositories?q=user:${username}+sort:updated&per_page=100`,
      headers
    )
    
    if (!contributedResponse.ok) {
      throw new Error(`Failed to fetch contributed repositories: ${contributedResponse.status}`)
    }

    // Combine and deduplicate repositories
    const ownedRepos = await ownedResponse.json() as Repository[]
    const contributedData = await contributedResponse.json()
    const contributedRepos = contributedData.items as Repository[]
    
    const allRepos = Array.from(
      new Map(
        [...ownedRepos, ...contributedRepos].map(repo => [repo.full_name, repo])
      ).values()
    )

    // Filter valid repositories
    console.log('Validating repositories...')
    const validRepos = []
    for (const repo of allRepos) {
      if (await isValidRepository(repo, headers)) {
        validRepos.push(repo)
      }
    }
    
    console.log(`Found ${validRepos.length} valid repositories out of ${allRepos.length}`)

    // Get commit counts and repo stats
    const summary = {
      totalRepos: allRepos.length,
      ownedRepos: ownedRepos.length,
      contributedRepos: contributedRepos.length,
      totalCommits: 0,
      publicRepos: 0,
      privateRepos: 0,
      forks: 0
    }

    // Count public/private repos and forks
    for (const repo of allRepos) {
      if (repo.fork) summary.forks++
      // Note: We can't easily determine public/private from the API response
      // as it's not included in the basic repo info
    }

    // Get total commits across all repos
    for (const repo of validRepos) {
      try {
        let repoCommits = 0
        console.log(`\nProcessing ${repo.full_name}...`)

        // Add delay before first commit fetch for each repo
        console.log('  Waiting 1 second before fetching commits...')
        await delay(1000)

        let page = 1
        let hasMoreCommits = true

        // Get commits where you are the author
        console.log('  Fetching direct commits...');
        while (hasMoreCommits) {
          const commitsResponse = await fetchWithRetry(
            `https://api.github.com/repos/${repo.full_name}/commits?author=${process.env.NEXT_PUBLIC_GITHUB_USERNAME}&per_page=100&page=${page}`,
            headers
          );
          
          // Skip if we don't have permission (403) or other error
          if (!commitsResponse.ok) {
            if (commitsResponse.status === 403) {
              console.log(`    ⚠️ No permission to access commits for ${repo.full_name}`);
            } else if (commitsResponse.status === 409) {
              console.log(`    ⚠️ Repository ${repo.full_name} is empty or has conflicts`);
            } else {
              console.log(`    ⚠️ Failed to fetch page ${page} of commits`);
            }
            break;
          }

          const commits = await commitsResponse.json() as GitHubCommit[];
          if (commits.length === 0) {
            hasMoreCommits = false;
            break;
          }

          repoCommits += commits.length;
          console.log(`    Page ${page}: Found ${commits.length} commits`);
          page++;

          // Add delay between commit pages
          if (commits.length === 100) { // Only delay if we're likely to have another page
            console.log('    Waiting 1 second before next page of commits...');
            await delay(1000);
          }
        }

        // Then fetch commits for each email
        for (const email of userEmails) {
          console.log(`  Fetching commits for email: ${email}...`);
          page = 1;
          hasMoreCommits = true;
          
          while (hasMoreCommits) {
            console.log(`    Processing page ${page} for email ${email}...`);
            const emailCommitsResponse = await fetchWithRetry(
              `https://api.github.com/repos/${repo.full_name}/commits?author=${email}&per_page=100&page=${page}`,
              headers
            );
            
            // Skip if we don't have permission (403) or other error
            if (!emailCommitsResponse.ok) {
              if (emailCommitsResponse.status === 403) {
                console.log(`    ⚠️ No permission to access commits for email ${email}`);
              } else if (emailCommitsResponse.status === 409) {
                console.log(`    ⚠️ Repository ${repo.full_name} is empty or has conflicts`);
              } else {
                console.log(`    ⚠️ Failed to fetch page ${page} of commits for email ${email}`);
              }
              break;
            }

            const emailCommits = await emailCommitsResponse.json() as GitHubCommit[];
            if (emailCommits.length === 0) {
              hasMoreCommits = false;
              break;
            }

            repoCommits += emailCommits.length;
            console.log(`    Page ${page}: Found ${emailCommits.length} commits for email ${email}`);
            page++;

            // Add delay between commit pages
            if (emailCommits.length === 100) { // Only delay if we're likely to have another page
              console.log('    Waiting 1 second before next page of commits...');
              await delay(1000);
            }
          }
          
          // Add delay between email fetches
          if (userEmails.length > 1) {
            console.log('  Waiting 1 second before fetching next email...');
            await delay(1000);
          }
        }

        // Add delay between direct commits and committer commits
        console.log('  Waiting 2 seconds before checking committer commits...');
        await delay(2000);

        // Reset pagination for committer commits
        page = 1;
        hasMoreCommits = true;

        // Get commits where you are the committer
        console.log('  Fetching commits where you are committer...');
        while (hasMoreCommits) {
          const committerResponse = await fetchWithRetry(
            `https://api.github.com/repos/${repo.full_name}/commits?committer=${process.env.NEXT_PUBLIC_GITHUB_USERNAME}&per_page=100&page=${page}`,
            headers
          );
          
          // Skip if we don't have permission (403) or other error
          if (!committerResponse.ok) {
            if (committerResponse.status === 403) {
              console.log(`    ⚠️ No permission to access committer information for ${repo.full_name}`);
            } else if (committerResponse.status === 409) {
              console.log(`    ⚠️ Repository ${repo.full_name} is empty or has conflicts`);
            } else {
              console.log(`    ⚠️ Failed to fetch page ${page} of committer commits`);
            }
            break;
          }

          const committerCommits = await committerResponse.json() as GitHubCommit[];
          if (committerCommits.length === 0) {
            hasMoreCommits = false;
            break;
          }

          // Add commits where you're the committer but not the author
          const newCommits = committerCommits.filter(commit => 
            commit.author?.login !== process.env.NEXT_PUBLIC_GITHUB_USERNAME
          ).length;
          repoCommits += newCommits;
          console.log(`    Page ${page}: Found ${newCommits} additional commits`);
          page++;

          // Add delay between committer pages
          if (committerCommits.length === 100) { // Only delay if we're likely to have another page
            console.log('    Waiting 1 second before next page of committer commits...');
            await delay(1000);
          }
        }

        // Add delay between committer commits and PR commits
        console.log('  Waiting 2 seconds before checking pull requests...');
        await delay(2000);

        // Get pull request contributions
        page = 1;
        hasMoreCommits = true;
        console.log('  Fetching pull request commits...');
        while (hasMoreCommits) {
          const prsResponse = await fetchWithRetry(
            `https://api.github.com/repos/${repo.full_name}/pulls?state=merged&user=${process.env.NEXT_PUBLIC_GITHUB_USERNAME}&per_page=100&page=${page}`,
            headers
          );
          
          // Skip if we don't have permission (403) or other error
          if (!prsResponse.ok) {
            if (prsResponse.status === 403) {
              console.log(`    ⚠️ No permission to access pull requests for ${repo.full_name}`);
            } else {
              console.log(`    ⚠️ Failed to fetch page ${page} of pull requests`);
            }
            break;
          }

          const prs = await prsResponse.json();
          if (prs.length === 0) {
            hasMoreCommits = false;
            break;
          }

          console.log(`    Found ${prs.length} PRs on page ${page}`);
          // For each merged PR, get its commits
          for (const pr of prs) {
            const prCommitsResponse = await fetchWithRetry(
              `https://api.github.com/repos/${repo.full_name}/pulls/${pr.number}/commits`,
              headers
            );
            
            if (prCommitsResponse.ok) {
              const prCommits = await prCommitsResponse.json();
              repoCommits += prCommits.length;
              console.log(`      PR #${pr.number}: Found ${prCommits.length} commits`);
            } else {
              if (prCommitsResponse.status === 403) {
                console.log(`      ⚠️ No permission to access commits for PR #${pr.number}`);
              } else {
                console.log(`      ⚠️ Failed to fetch commits for PR #${pr.number}`);
              }
            }

            // Add delay between PR commit fetches
            if (prs.length > 1) { // Only delay if there are multiple PRs
              console.log('      Waiting 500ms before next PR...');
              await delay(500);
            }
          }

          page++;
          
          // Add delay between PR pages
          if (prs.length === 100) { // Only delay if we're likely to have another page
            console.log('    Waiting 1 second before next page of PRs...');
            await delay(1000);
          }
        }

        summary.totalCommits += repoCommits
        console.log(`Found ${repoCommits} commits in ${repo.full_name}`)
      } catch (error) {
        console.log(`Error getting commits for ${repo.full_name}:`, error)
      }
    }

    const languages: Record<string, DetailedStats> = {}
    const frameworks: Record<string, DetailedStats> = {}
    const tools: Record<string, DetailedStats> = {}
    
    // Track unrecognized dependencies
    const unrecognizedDeps = new Map<string, { count: number, repos: Set<string> }>()

    // Process each repository
    for (const repo of validRepos) {
      try {
        // Get languages
        const languagesResponse = await fetchWithRetry(repo.languages_url, headers)
        const repoLanguages = await languagesResponse.json() as Record<string, number>
        
        // Get repository contents to check for build files
        const contentsResponse = await fetchWithRetry(
          repo.contents_url.replace('{+path}', ''),
          headers
        )
        
        // Determine project type
        let projectType: string | null = null
        
        if (contentsResponse.ok) {
          const contents = await contentsResponse.json() as Array<{ name: string, type: string }>
          
          // Check if this is a full-stack app by looking for common folders
          const hasFullStackFolders = contents.some(f => 
            f.type === 'dir' && 
            ['api', 'server', 'client', 'frontend', 'backend', 'src'].includes(f.name.toLowerCase())
          )

          // Only check for build files if it's not a full-stack app
          if (!hasFullStackFolders) {
            const hasOnlyBuildFiles = contents
              .filter(item => item.type === 'file')
              .every(item => shouldIgnoreFile(item.name))
            
            if (hasOnlyBuildFiles && contents.every(item => item.type !== 'dir')) {
              console.log(`Skipping ${repo.full_name}: Contains only build/generated files`)
              continue
            }
          }

          // Determine project type based on contents
          if (contents.some(f => f.name.toLowerCase().endsWith('.sql'))) {
            projectType = 'sql'
          } else if (
            contents.some(f => f.name.toLowerCase() === 'index.html') &&
            !contents.some(f => f.name === 'package.json')
          ) {
            projectType = 'vanilla-web'
          }
        }
        
        // If project type not determined by contents, use primary language
        if (!projectType) {
          const primaryLanguage = Object.entries(repoLanguages)
            .sort(([,a], [,b]) => b - a)[0]?.[0]

          if (primaryLanguage === 'TypeScript') {
            projectType = 'typescript'
          } else if (primaryLanguage === 'Dart') {
            projectType = 'flutter'
          } else if (primaryLanguage === 'Python') {
            projectType = 'python'
          } else if (primaryLanguage === 'JavaScript') {
            projectType = 'node'
          } else if (primaryLanguage === 'HTML' || primaryLanguage === 'CSS') {
            projectType = 'vanilla-web'
          } else if (primaryLanguage === 'SQL') {
            projectType = 'sql'
          } else if (primaryLanguage === 'PLpgSQL' || primaryLanguage === 'PostgreSQL') {
            projectType = 'postgres'
          }
        }

        // Check for package files
        const packageFilesToFetch = await shouldFetchPackageFiles(repo, headers)
        
        if (packageFilesToFetch.shouldFetchPackageJson) {
          try {
            const packageJsonUrl = repo.contents_url.replace('{+path}', 'package.json')
            const packageJsonResponse = await fetchWithRetry(packageJsonUrl, headers)
            
            if (packageJsonResponse.ok) {
              const data = await packageJsonResponse.json()
              const content = JSON.parse(Buffer.from(data.content, 'base64').toString()) as PackageJson
              
              const allDeps = {
                ...(content.dependencies || {}),
                ...(content.devDependencies || {})
              }

              // Update project type based on dependencies
              if (Object.keys(allDeps).includes('typescript')) {
                projectType = 'typescript'
              } else if (Object.keys(allDeps).includes('next')) {
                projectType = 'next'
              } else if (Object.keys(allDeps).includes('react-native')) {
                projectType = 'react-native'
              } else if (Object.keys(allDeps).includes('react')) {
                projectType = 'react'
              }

              // Check for Tailwind
              if (Object.keys(allDeps).includes('tailwindcss')) {
                projectType = projectType || 'tailwind'
              }

              // Track all dependencies for discovery
              Object.keys(allDeps).forEach(dep => {
                let recognized = false

                // Check frameworks
                Object.entries(frameworkMap).forEach(([framework, patterns]) => {
                  if (patterns.some(pattern => 
                    dep.startsWith(pattern) || 
                    dep === pattern
                  )) {
                    frameworks[framework] = frameworks[framework] || { repositories: 0, usage: 0 }
                    frameworks[framework].repositories++
                    frameworks[framework].usage++
                    recognized = true
                  }
                })
                
                // Check tools
                Object.entries(toolMap).forEach(([tool, patterns]) => {
                  if (patterns.some(pattern => 
                    dep.startsWith(pattern) || 
                    dep === pattern
                  )) {
                    tools[tool] = tools[tool] || { repositories: 0, usage: 0 }
                    tools[tool].repositories++
                    tools[tool].usage++
                    recognized = true
                  }
                })

                // Track unrecognized dependencies
                if (!recognized) {
                  const existing = unrecognizedDeps.get(dep) || { count: 0, repos: new Set() }
                  existing.count++
                  existing.repos.add(repo.full_name)
                  unrecognizedDeps.set(dep, existing)
                }
              })
            }
          } catch (error) {
            if (error instanceof Error && !error.message.includes('404')) {
              console.log(`Error processing package.json for ${repo.full_name}:`, error)
            }
          }
        }

        // Update language stats with better filtering
        Object.entries(repoLanguages).forEach(([language, bytes]) => {
          if (!projectType || !PROJECT_IGNORED_LANGUAGES[projectType]?.includes(language)) {
            languages[language] = languages[language] || { repositories: 0, usage: 0 }
            languages[language].repositories++
            languages[language].usage += bytes
          }
        })

      } catch (error) {
        console.error(`Error processing repo ${repo.full_name}:`, error)
      }
    }

    // Convert unrecognized dependencies to sorted array
    const sortedUnrecognized = Array.from(unrecognizedDeps.entries())
      .map(([name, { count, repos }]) => ({
        name,
        count,
        repos: Array.from(repos)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 100) // Keep top 100 most common unrecognized dependencies

    // Log potential missing technologies
    console.log('\nPotentially missing technologies:')
    sortedUnrecognized.forEach(({ name, count, repos }) => {
      if (count > 1) { // Only show deps used in multiple repos
        console.log(`${name}: used ${count} times in repos:`)
        repos.forEach(repo => console.log(`  - ${repo}`))
      }
    })

    // Update the cache file
    const stats: CachedStats = {
      lastUpdated: new Date().toISOString(),
      summary,
      repoCount: validRepos.length,
      languages,
      frameworks,
      tools,
      unrecognizedDependencies: sortedUnrecognized
    }

    const cachePath = path.join(process.cwd(), 'src', 'data', 'github-stats.json')
    fs.writeFileSync(cachePath, JSON.stringify(stats, null, 2))
    
    console.log('\nSuccessfully updated GitHub stats cache')
  } catch (error) {
    console.error('Failed to update GitHub stats:', error)
    process.exit(1)
  }
}

// Run the update
updateGitHubStats() 