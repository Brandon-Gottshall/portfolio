import fs from 'fs'
import path from 'path'

/**
 * GitHub Rate Limit Strategy:
 * 
 * GitHub API allows 5000 requests per hour (~1.4 requests/second) for authenticated users.
 * To optimize performance while respecting rate limits:
 * 
 * 1. Base delay of 750ms between standard requests (~1.33 req/sec, just under the limit)
 * 2. Dynamic delays based on remaining rate limit:
 *    - Under 500 remaining: 1000ms delay (slowing down further)
 *    - Under 100 remaining: Wait until reset time
 * 3. 750-1000ms delays between batches of operations (pages, PR fetches, etc.)
 * 4. Proper handling of 403 responses and rate limit headers
 * 
 * This approach strictly adheres to GitHub's rate limit while still being efficient.
 */

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
  private: boolean
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
  commits: number     // Number of commits containing this tech
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
  // Add notes about the data
  notes: string[]
}

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

// Modify the fetchWithRetry function to use a more optimized delay approach
async function fetchWithRetry(url: string, headers: HeadersInit, retries = 3): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    // Use 750ms delay between requests to stay under GitHub's 1.4 requests/second limit
    await delay(750);

    const endpoint = url.split('?')[0]; // Just get the base endpoint for cleaner logs
    logWithTimestamp(`Sending request to ${endpoint}...`);
    
    const response = await fetch(url, { headers });
    logWithTimestamp(`Received response from ${endpoint} with status: ${response.status}`);
    
    // Special handling for 409 Conflict - likely an empty repository
    if (response.status === 409) {
      logWithTimestamp(`Repository is empty or has conflicts - skipping this request`);
      return new Response(null, { status: 409 });
    }
    
    // Check and handle rate limits - this function will add delays only when necessary
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
  // For very small delays, just wait without logging
  if (ms < 100) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  else if (ms >= 2000) {
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

// Modify the checkRateLimit function to be more intelligent about delays
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
  
  // Add dynamic delay based on how close we are to the rate limit
  // Only add extra delays when we're getting close to the limit
  if (remaining < 100) {
    const now = Date.now();
    const waitTime = resetTime - now + 1000;
    if (waitTime > 0) {
      logWithTimestamp(`Rate limit low (${remaining} remaining). Waiting ${Math.round(waitTime/1000)} seconds...`);
      await delay(waitTime);
    }
  } else if (remaining < 500) {
    // Add a 1000ms delay when under 500 remaining to slow down more
    await delay(1000);
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
    // Skip processing the Moodle repository specifically since it's a large public repo 
    // where the user doesn't have commits
    if (repo.full_name === 'Brandon-Gottshall/moodle') {
      console.log(`Skipping ${repo.full_name}: Large public repository with no user contributions`)
      return false
    }

    // First check if we can get languages - this is the most important thing we need
    const languagesResponse = await fetchWithRetry(repo.languages_url, headers)
    if (!languagesResponse.ok) {
      console.log(`Skipping ${repo.full_name}: Cannot fetch languages`)
      return false
    }

    // Define organizations the user is associated with
    const associatedOrgs = ['NebulaAcademy', 'Effortless-Development', 'Brandon-Gottshall'];

    // If this repo belongs to an associated org, consider it valid
    const repoOwner = repo.owner.login;
    if (associatedOrgs.some(org => org.toLowerCase() === repoOwner.toLowerCase())) {
      console.log(`Including ${repo.full_name}: Associated organization`);
      return true;
    }

    // Check if this is a fork or a public repository where we're not the owner
    if (repo.fork || repo.owner.login !== process.env.NEXT_PUBLIC_GITHUB_USERNAME) {
      // For forks or public repos, check if we have made any commits before processing further
      try {
        const commitsResponse = await fetchWithRetry(
          `https://api.github.com/repos/${repo.full_name}/commits?author=${process.env.NEXT_PUBLIC_GITHUB_USERNAME}&per_page=1`,
          headers
        )
        
        // If no commits found by username, check for emails
        if (!commitsResponse.ok || (await commitsResponse.json()).length === 0) {
          // Check for any commits by email addresses
          let foundEmailCommits = false
          for (const email of userEmails) {
            const emailCommitsResponse = await fetchWithRetry(
              `https://api.github.com/repos/${repo.full_name}/commits?author=${email}&per_page=1`,
              headers
            )
            if (emailCommitsResponse.ok && (await emailCommitsResponse.json()).length > 0) {
              foundEmailCommits = true
              break
            }
            // Add small delay between email checks
            await delay(750)
          }
          
          // If no commits found by username or email, skip this repository
          if (!foundEmailCommits) {
            console.log(`Skipping ${repo.full_name}: No contributions found`)
            return false
          }
        }
      } catch (error) {
        console.log(`Error checking commits for ${repo.full_name}:`, error)
        return false
      }
    }

    // If we can get languages and we've confirmed contributions (or it's our own repo), it's valid
    return true
  } catch (error) {
    console.log(`Error validating repository ${repo.full_name}:`, error)
    return false
  }
}

async function shouldFetchPackageFiles(repo: Repository, headers: HeadersInit): Promise<{
  shouldFetchPackageJson: boolean
}> {
  try {
    // Get repository contents
    const contentsResponse = await fetchWithRetry(
      repo.contents_url.replace('{+path}', ''),
      headers
    )
    
    if (!contentsResponse.ok) {
      return { shouldFetchPackageJson: false }
    }
    
    const contents = await contentsResponse.json() as { name: string, type: string }[]
    
    // Check if package.json exists in the repository root
    const hasPackageJson = contents.some(file => 
      file.name === 'package.json' && file.type === 'file'
    )
    
    return { shouldFetchPackageJson: hasPackageJson }
  } catch (error) {
    console.error('Error determining package files to fetch:', error)
    return { shouldFetchPackageJson: false }
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

// Add helper function to check if a file is likely generated
function isLikelyGeneratedSQLFile(filename: string): boolean {
  // Common patterns for generated SQL files
  const generatedPatterns = [
    /migrations?\//i,                  // Files in migration directories
    /\d{14}_.+\.sql$/,                 // Timestamp-based migration files (e.g., 20230101120000_create_users.sql)
    /schema\.sql$/i,                   // Auto-generated schema dumps
    /\.prisma\/migrations\//,          // Prisma-generated migrations
    /db\/seeds\//,                     // Seed files are often generated
    /CREATE\s+PROCEDURE|CREATE\s+FUNCTION/i, // SQL files containing procedures/functions are often generated
    /--\s*Generated by/i,              // Files with generation comments
    /sequelize-cli/i,                  // Sequelize migrations
    /knex/i,                           // Knex.js migrations
    /_dump\.sql$/i                     // Database dumps
  ];
  
  return generatedPatterns.some(pattern => pattern.test(filename));
}

// Expanded function to identify various types of generated files
function isLikelyGeneratedFile(filename: string, language: string): boolean {
  // Common patterns for all generated files
  const commonPatterns = [
    /generated/i,
    /\.generated\./i,
    /auto-generated/i,
    /autogenerated/i,
    /\.g\./i,                     // Common prefix for generated files
    /vendor\//i,                  // Vendor directories usually contain third-party code
    /node_modules\//i,            // Node modules directory
    /dist\//i,                    // Distribution/build directories
    /build\//i,                   // Build directories
    /\.min\./i,                   // Minified files
    /\.bundle\./i,                // Bundled files
    /out\//i,                     // Output directories
    /output\//i,                  // Output directories
    /\.lock$/i,                   // Lock files
    /\.(o|obj|a|lib|so|dll|dylib)$/i, // Binary or object files
    /\.(ico|svg|png|jpg|jpeg|gif|webp)$/i, // Image files are often not hand-coded
    /\.(woff|woff2|ttf|eot)$/i,   // Font files
    /\.(mp3|mp4|wav|ogg|webm)$/i, // Media files
    /\.d\.ts$/i,                  // TypeScript declaration files are often generated
    /generated-sources/i,         // Generated source directories
    /\.cache\//i,                 // Cache directories
    /tmp\//i,                     // Temporary directories
    /\.next\//i,                  // Next.js build directory
    /\.nuxt\//i,                  // Nuxt.js build directory
    /\.vercel\//i,                // Vercel build directory
    /\.netlify\//i,               // Netlify build directory
    /\.github\//i,                // GitHub workflows are often templates
    /\.git\//i,                   // Git internal files
    /[.]map$/i,                   // Source maps
    /package-lock.json$/i,        // NPM lock file
    /yarn.lock$/i,                // Yarn lock file
    /pnpm-lock.yaml$/i,           // PNPM lock file
    /Podfile.lock$/i,             // CocoaPods lock file
    /composer.lock$/i,            // Composer lock file
    /Gemfile.lock$/i,             // Bundler lock file
    /project.pbxproj$/i,          // Xcode project files
  ];
  
  // If the file matches any common pattern for generated files
  if (commonPatterns.some(pattern => pattern.test(filename))) {
    return true;
  }
  
  // Language-specific patterns
  const languagePatterns: Record<string, RegExp[]> = {
    // SQL and database-related
    'PLpgSQL': [
      /migrations?\//i,
      /\d{14}_.+\.sql$/,
      /schema\.sql$/i,
      /\.prisma\/migrations\//,
      /db\/seeds\//,
      /CREATE\s+PROCEDURE|CREATE\s+FUNCTION/i,
      /--\s*Generated by/i,
      /sequelize-cli/i,
      /knex/i,
      /_dump\.sql$/i,
      /\.db$/i,
      /\.sqlite$/i,
    ],
    
    // C/C++ related
    'C': [
      /\.o$/i,                     // Object files
      /CMakeFiles\//i,             // CMake-generated files
      /\.framework\//i,            // Frameworks
      /\.xcodeproj\//i,            // Xcode project files
      /third[_\-]party\//i,        // Third-party code
      /external\//i,               // External dependencies
      /deps\//i,                   // Dependencies
      /lib\//i,                    // Libraries
      /\.h\.in$/i,                 // Header template files
      /\.hpp\.in$/i,               // C++ header template files
      /moc_.*\.cpp$/i,             // Qt generated files
      /ui_.*\.h$/i,                // Qt UI files
      /qrc_.*\.cpp$/i,             // Qt resource files
    ],
    'C++': [
      /\.o$/i,
      /CMakeFiles\//i,
      /\.framework\//i,
      /\.xcodeproj\//i,
      /third[_\-]party\//i,
      /external\//i,
      /deps\//i,
      /lib\//i,
      /\.pch$/i,                  // Precompiled headers
      /\.gch$/i,                  // GCC precompiled headers
      /\.ipp$/i,                  // Inline implementations
      /\.tcc$/i,                  // Template implementations
      /\.pb\.h$/i,                // Protobuf headers
      /\.pb\.cc$/i,               // Protobuf implementation
      /moc_.*\.cpp$/i,            // Qt generated files
      /ui_.*\.h$/i,               // Qt UI files
      /qrc_.*\.cpp$/i,            // Qt resource files
    ],
    'CMake': [
      /CMakeFiles\//i,
      /CMakeCache/i,
      /cmake_install/i,
      /CTestTestfile/i,
      /\.cmake$/i,                // CMake scripts
      /CMakeLists.txt.user$/i,    // User-specific CMake files
      /\.vcxproj/i,               // Visual Studio project files
      /\.sln$/i,                  // Visual Studio solution files
    ],
    
    // Mobile development
    'Objective-C': [
      /\.framework\//i,
      /Pods\//i,                   // CocoaPods dependencies
      /\.xcodeproj\//i,
      /\.xib$/i,                   // Interface builder files
      /\.storyboard$/i,            // Storyboard files
      /\.pbxproj$/i,               // Project files
      /\.modulemap$/i,             // Module map files
      /\.pch$/i,                   // Precompiled headers
      /\.strings$/i,               // Strings files
      /\.lproj\//i,                // Localization directories
    ],
    'Swift': [
      /\.framework\//i,
      /Pods\//i,                   // CocoaPods dependencies
      /\.xcodeproj\//i,
      /\.xib$/i,                   // Interface builder files
      /\.storyboard$/i,            // Storyboard files
      /\.pbxproj$/i,               // Project files
      /\.modulemap$/i,             // Module map files
      /\.pch$/i,                   // Precompiled headers
      /\.strings$/i,               // Strings files
      /\.lproj\//i,                // Localization directories
      /\.swiftmodule$/i,           // Swift module files
      /\.swiftinterface$/i,        // Swift interface files
      /GeneratedSwiftInterface/i,  // Generated Swift files
    ],
    'Kotlin': [
      /\.gradle\//i,               // Gradle build files
      /build\/generated\//i,       // Generated code
      /\.idea\//i,                 // IDE files
      /\.iml$/i,                   // IntelliJ IDEA module files
      /\.kt\.java$/i,              // Kotlin to Java source
      /\.class$/i,                 // Java class files
      /R\.java$/i,                 // Android resource references
      /BuildConfig\.java$/i,       // Android build config
      /\.jar$/i,                   // JAR files
      /\.apk$/i,                   // APK files
      /\.aar$/i,                   // Android library files
    ],
    
    // Build systems and config
    'Starlark': [
      /bazel-/i,                   // Bazel build directories
      /\.bazelrc$/i,               // Bazel config files
      /BUILD$/i,                   // BUILD files
      /WORKSPACE$/i,               // WORKSPACE files
    ],
    'Procfile': [
      /.*Procfile$/i,              // Heroku Procfiles are usually not written manually
    ],
    
    // Python
    'Jupyter Notebook': [
      /\.ipynb_checkpoints\//i,    // Jupyter checkpoints
    ],
    'Python': [
      /\.pyc$/i,                   // Python bytecode
      /\.pyo$/i,                   // Python optimized bytecode
      /__pycache__\//i,            // Python cache directory
      /\.egg-info\//i,             // Python egg info
      /\.egg$/i,                   // Python egg
      /\.whl$/i,                   // Python wheel
      /site-packages\//i,          // Python site packages
      /venv\//i,                   // Virtual environments
      /env\//i,                    // Virtual environments
      /\.virtualenv\//i,           // Virtual environments
    ],
    
    // Documentation files
    'Rich Text Format': [
      /\.rtf$/i,                   // RTF files are often generated
      /\.doc$/i,                   // Word documents
      /\.docx$/i,                  // Word documents
      /\.pdf$/i,                   // PDF files
      /\.ppt$/i,                   // PowerPoint
      /\.pptx$/i,                  // PowerPoint
      /\.xls$/i,                   // Excel
      /\.xlsx$/i,                  // Excel
    ],
    
    // Web development
    'JavaScript': [
      /\.min\.js$/i,               // Minified JavaScript
      /bundle\.js$/i,              // Bundled JavaScript
      /vendor\.js$/i,              // Vendor JavaScript
      /polyfill\.js$/i,            // Polyfill JavaScript
      /\.prod\.js$/i,              // Production JavaScript
      /[0-9a-f]{8,}\.js$/i,        // Chunked/hashed JavaScript files
    ],
    'CSS': [
      /\.min\.css$/i,              // Minified CSS
      /bundle\.css$/i,             // Bundled CSS
      /vendor\.css$/i,             // Vendor CSS
      /\.prod\.css$/i,             // Production CSS
      /[0-9a-f]{8,}\.css$/i,       // Chunked/hashed CSS files
    ],
  };
  
  // Check language-specific patterns if they exist
  if (language in languagePatterns) {
    return languagePatterns[language].some(pattern => pattern.test(filename));
  }
  
  // Default to SQL check for backward compatibility
  if (filename.endsWith('.sql')) {
    return isLikelyGeneratedSQLFile(filename);
  }
  
  return false;
}

// Add function to check if a repository is likely to contain mostly generated code for a specific language
function repoLikelyContainsGeneratedLanguage(repoName: string, language: string, byteCount: number): boolean {
  // For languages that are primary to web development, we're less likely to filter them
  const primaryWebLanguages = ['JavaScript', 'TypeScript', 'HTML', 'CSS', 'SCSS', 'Less'];
  
  if (primaryWebLanguages.includes(language)) {
    // Only filter out excessive web language code (likely generated)
    if (byteCount > 1000000 && !repoName.includes(language.toLowerCase())) {
      console.log(`Excessive ${language} in ${repoName}: ${byteCount} bytes`);
      return true;
    }
    return false; // Don't filter out primary web languages generally
  }
  
  // Language-specific thresholds and repo name patterns
  const generatedLanguagePatterns: Record<string, {byteThreshold: number, repoPatterns: RegExp[]}> = {
    'PLpgSQL': {
      byteThreshold: 10000, // Lower threshold - most SQL in repos is generated
      repoPatterns: [/prisma/i, /migration/i, /database/i, /postgres/i, /sql/i, /schema/i, /model/i]
    },
    'C++': {
      byteThreshold: 10000, // Lower threshold - most C++ in web dev repos is likely from dependencies
      repoPatterns: [/native/i, /module/i, /binding/i, /addon/i, /lib/i, /vendor/i, /third-party/i]
    },
    'C': {
      byteThreshold: 5000, // Lower threshold for C files
      repoPatterns: [/native/i, /module/i, /binding/i, /addon/i, /lib/i, /vendor/i, /third-party/i]
    },
    'CMake': {
      byteThreshold: 1000, // Very low threshold for CMake
      repoPatterns: [/cmake/i, /build/i, /lib/i, /vendor/i, /third-party/i]
    },
    'Objective-C': {
      byteThreshold: 5000, // Lower threshold for Objective-C
      repoPatterns: [/ios/i, /app/i, /mobile/i, /react-native/i, /expo/i]
    },
    'Swift': {
      byteThreshold: 5000, // Lower threshold for Swift
      repoPatterns: [/ios/i, /app/i, /mobile/i, /react-native/i, /expo/i]
    },
    'Kotlin': {
      byteThreshold: 2000, // Lower threshold for Kotlin
      repoPatterns: [/android/i, /app/i, /mobile/i, /react-native/i, /expo/i]
    },
    'Starlark': {
      byteThreshold: 500, // Low threshold for Starlark/Bazel files
      repoPatterns: [/bazel/i, /build/i]
    },
    'Procfile': {
      byteThreshold: 50, // Very low threshold for Procfile
      repoPatterns: [/heroku/i, /deploy/i, /app/i]
    },
    'Makefile': {
      byteThreshold: 1000, // Low threshold for Makefiles
      repoPatterns: [/build/i, /lib/i, /module/i]
    },
    'Shell': {
      byteThreshold: 5000,
      repoPatterns: [/script/i, /ci/i, /build/i]
    },
    'Rich Text Format': {
      byteThreshold: 100, // Very low threshold for RTF - almost always generated
      repoPatterns: [/doc/i, /documentation/i, /report/i, /export/i]
    },
    'Java': {
      byteThreshold: 10000,
      repoPatterns: [/android/i, /app/i, /mobile/i, /java/i, /lib/i]
    },
  };
  
  // If we have specific rules for this language
  if (language in generatedLanguagePatterns) {
    const { byteThreshold, repoPatterns } = generatedLanguagePatterns[language];
    
    // If byte count exceeds threshold for this language
    if (byteCount > byteThreshold) {
      // Or if repo name matches any suspicious pattern
      if (repoPatterns.some(pattern => pattern.test(repoName))) {
        return true;
      }
      
      // For any language not specifically related to the repo name
      if (!repoName.toLowerCase().includes(language.toLowerCase())) {
        // And byte count is significantly above threshold
        if (byteCount > byteThreshold * 2) {
          return true;
        }
      }
      
      // For extremely high byte counts, filter regardless of repo name
      if (byteCount > byteThreshold * 10) {
        return true;
      }
    }
  }
  
  // General case for unexpected languages in repos
  // If a language contributes more than 50KB and isn't mentioned in the repo name,
  // it's likely to be a dependency/generated code
  if (byteCount > 50000 && !primaryWebLanguages.includes(language) && 
      !repoName.toLowerCase().includes(language.toLowerCase())) {
    console.log(`Likely generated ${language} in ${repoName}: ${byteCount} bytes`);
    return true;
  }
  
  return false;
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
      // Use the private field to determine if repo is public or private
      if (repo.private) {
        summary.privateRepos++
      } else {
        summary.publicRepos++
      }
    }

    // Get total commits across all repos
    for (const repo of validRepos) {
      try {
        let repoCommits = 0
        console.log(`\nProcessing ${repo.full_name}...`)

        // Add delay before first commit fetch for each repo
        console.log('  Starting commit fetching...')
        await delay(750)

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
            console.log('    Fetching next page of commits...');
            await delay(750);
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
              console.log('    Fetching next page of commits...');
              await delay(750);
            }
          }
          
          // Add delay between email fetches
          console.log('  Fetching next email commits...');
          await delay(750);
        }
        
        // Add delay between direct commits and committer commits
        console.log('  Checking committer commits...');
        await delay(750);

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
            console.log('    Fetching next page of committer commits...');
            await delay(750);
          }
        }

        // Add delay between committer commits and PR commits
        console.log('  Checking pull requests...');
        await delay(750);

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
              console.log('      Fetching next PR...');
              await delay(750);
            }
          }

          page++;
          
          // Add delay between PR pages
          if (prs.length === 100) { // Only delay if we're likely to have another page
            console.log('    Fetching next page of PRs...');
            await delay(750);
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
        
        // Create tracking objects for each language in this repo
        const repoLanguagesList = Object.keys(repoLanguages)
        repoLanguagesList.forEach(language => {
          if (!languages[language]) {
            languages[language] = { repositories: 0, commits: 0 }
          }
          languages[language].repositories++
        })
        
        // Get repository contents to check for build files
        const contentsResponse = await fetchWithRetry(
          repo.contents_url.replace('{+path}', ''),
          headers
        )
        
        // Skip if contents fetch failed
        if (!contentsResponse.ok) {
          console.log(`Skipping framework/tool detection for ${repo.full_name} - couldn't fetch contents`)
          continue
        }
        
        const contents = await contentsResponse.json() as { name: string, type: string }[]
        
        // Use the contents for checking specific files or directories
        const hasReadmeFile = contents.some(file => 
          file.name.toLowerCase() === 'readme.md' && file.type === 'file'
        )
        if (hasReadmeFile) {
          console.log(`Repository ${repo.full_name} has a README file`)
        }

        // Check for package files
        const { shouldFetchPackageJson } = await shouldFetchPackageFiles(repo, headers)
        
        // Count commits related to each language
        console.log(`Counting language commits for ${repo.full_name}...`)
        let page = 1
        let hasMoreCommits = true
        
        while (hasMoreCommits) {
          const commitsResponse = await fetchWithRetry(
            `https://api.github.com/repos/${repo.full_name}/commits?per_page=100&page=${page}`,
            headers
          )
          
          if (!commitsResponse.ok) {
            if (commitsResponse.status === 403) {
              console.log(`  ⚠️ No permission to access commits for ${repo.full_name}`)
            } else if (commitsResponse.status === 409) {
              console.log(`  ⚠️ Repository ${repo.full_name} is empty or has conflicts`)
            } else {
              console.log(`  ⚠️ Failed to fetch page ${page} of commits`)
            }
            break
          }
          
          const commits = await commitsResponse.json() as { sha: string }[]
          if (commits.length === 0) {
            hasMoreCommits = false
            break
          }
          
          console.log(`  Processing ${commits.length} commits from page ${page}...`)
          
          for (const commit of commits) {
            const commitResponse = await fetchWithRetry(
              `https://api.github.com/repos/${repo.full_name}/commits/${commit.sha}`,
              headers
            )
            
            if (!commitResponse.ok) {
              console.log(`    ⚠️ Failed to fetch details for commit ${commit.sha.substring(0, 7)}`)
              continue
            }
            
            const commitData = await commitResponse.json() as { 
              files: { filename: string, status: string }[] 
            }
            
            // Track which languages are used in this commit
            const commitLanguages = new Set<string>()
            
            for (const file of commitData.files || []) {
              // Skip deleted files
              if (file.status === 'removed') continue
              
              // Determine language from file extension
              const ext = file.filename.split('.').pop()?.toLowerCase()
              if (!ext) continue
              
              // Map extensions to languages (simplified version)
              const langMap: Record<string, string> = {
                'js': 'JavaScript',
                'jsx': 'JavaScript',
                'ts': 'TypeScript',
                'tsx': 'TypeScript',
                'py': 'Python',
                'rb': 'Ruby',
                'php': 'PHP',
                'java': 'Java',
                'c': 'C',
                'cpp': 'C++',
                'h': 'C',
                'hpp': 'C++',
                'cs': 'C#',
                'go': 'Go',
                'rs': 'Rust',
                'swift': 'Swift',
                'kt': 'Kotlin',
                'dart': 'Dart',
                'html': 'HTML',
                'css': 'CSS',
                'scss': 'SCSS',
                'less': 'Less',
                'json': 'JSON',
                'md': 'Markdown',
                'sql': 'SQL',
                'sh': 'Shell',
                'bash': 'Shell',
                'zsh': 'Shell',
                'yml': 'YAML',
                'yaml': 'YAML',
                'xml': 'XML',
                'm': 'Objective-C',
                'mm': 'Objective-C',
                'cmake': 'CMake',
                'bazel': 'Starlark',
                'ipynb': 'Jupyter Notebook',
              }
              
              if (ext in langMap) {
                const language = langMap[ext];
                
                // Skip if this file is likely generated
                if (isLikelyGeneratedFile(file.filename, language)) {
                  console.log(`Skipping likely generated file: ${file.filename} (${language})`);
                  continue;
                }
                
                commitLanguages.add(language);
              }
            }
            
            // Increment commit count for each language found in this commit
            for (const language of commitLanguages) {
              if (repoLanguagesList.includes(language)) {
                languages[language].commits += repoLanguages[language]
              }
            }
          }
          
          page++
          
          // Delay between pages of commits
          console.log('  Fetching next page of commits...')
          await delay(750)
        }
        
        // Process package.json for frameworks and tools detection
        // (We've already counted language usage above)
        if (shouldFetchPackageJson) {
          const packageJsonResponse = await fetchWithRetry(
            repo.contents_url.replace('{+path}', 'package.json'),
            headers
          )
          
          if (packageJsonResponse.ok) {
            const packageJsonData = await packageJsonResponse.json()
            const content = Buffer.from(packageJsonData.content, 'base64').toString('utf-8')
            const packageJson = JSON.parse(content) as PackageJson
            
            // Extract dependencies
            const allDeps = [
              ...Object.keys(packageJson.dependencies || {}),
              ...Object.keys(packageJson.devDependencies || {})
            ]
            
            // Set frameworks
            for (const [framework, patterns] of Object.entries(frameworkMap)) {
              if (allDeps.some(dep => 
                patterns.some(pattern => 
                  dep === pattern || 
                  (pattern.startsWith('^') && dep.startsWith(pattern.substring(1))) ||
                  dep === pattern
                ))) {
                frameworks[framework] = frameworks[framework] || { repositories: 0, commits: 0 }
                frameworks[framework].repositories++
                
                // Estimate commit count based on repo's total commits divided by number of frameworks
                // This is a rough approximation since we can't easily determine which commits used which frameworks
                const estimatedFrameworkCommits = Math.ceil(
                  Object.values(languages).reduce((sum, lang) => sum + lang.commits, 0) / 
                  (Object.keys(frameworks).length || 1)
                )
                frameworks[framework].commits += estimatedFrameworkCommits
              }
            }
            
            // Set tools
            for (const [tool, patterns] of Object.entries(toolMap)) {
              if (allDeps.some(dep => 
                patterns.some(pattern => 
                  dep === pattern || 
                  (pattern.startsWith('^') && dep.startsWith(pattern.substring(1))) ||
                  dep === pattern
                ))) {
                tools[tool] = tools[tool] || { repositories: 0, commits: 0 }
                tools[tool].repositories++
                
                // Estimate commit count similar to frameworks
                const estimatedToolCommits = Math.ceil(languages[Object.keys(languages)[0]]?.commits || 0) / 
                                           (Object.keys(tools).length || 1)
                tools[tool].commits += estimatedToolCommits
              }
            }
            
            // Track unrecognized dependencies
            for (const dep of allDeps) {
              let recognized = false
              
              for (const patterns of Object.values(frameworkMap)) {
                if (patterns.some(pattern => 
                  dep === pattern || 
                  (pattern.startsWith('^') && dep.startsWith(pattern.substring(1))) ||
                  dep === pattern
                )) {
                  recognized = true
                  break
                }
              }
              
              if (!recognized) {
                for (const patterns of Object.values(toolMap)) {
                  if (patterns.some(pattern => 
                    dep === pattern || 
                    (pattern.startsWith('^') && dep.startsWith(pattern.substring(1))) ||
                    dep === pattern
                  )) {
                    recognized = true
                    break
                  }
                }
              }
              
              if (!recognized) {
                if (!unrecognizedDeps.has(dep)) {
                  unrecognizedDeps.set(dep, { count: 0, repos: new Set() })
                }
                unrecognizedDeps.get(dep)!.count++
                unrecognizedDeps.get(dep)!.repos.add(repo.full_name)
              }
            }
          }
        }

        // Update language stats with better filtering
        Object.entries(repoLanguages).forEach(([language, bytes]) => {
          // Skip languages likely to be generated in this repo
          if (repoLikelyContainsGeneratedLanguage(repo.name, language, bytes)) {
            console.log(`Skipping likely generated ${language} in ${repo.full_name} (${bytes} bytes)`);
            return;
          }
          
          // Add all languages without filtering by project type
          languages[language] = languages[language] || { repositories: 0, commits: 0 }
          languages[language].repositories++
          languages[language].commits += bytes
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
      .slice(0, 50) // Keep top 50 most common unrecognized dependencies

    // Log potential missing technologies
    console.log('\nPotentially missing technologies:')
    sortedUnrecognized.forEach(({ name, count, repos }) => {
      if (count > 1) { // Only show deps used in multiple repos
        console.log(`${name}: used ${count} times in repos:`)
        repos.forEach(repo => console.log(`  - ${repo}`))
      }
    })

    // Sort stats by commit count instead of usage
    const cachedStats: CachedStats = {
      lastUpdated: new Date().toISOString(),
      summary,
      repoCount: validRepos.length,
      languages: Object.fromEntries(
        Object.entries(languages)
          .sort(([,a], [,b]) => b.commits - a.commits)
          .filter(([language, stats]) => {
            // Additional filtering for languages that are mostly generated
            
            // Check for unusually high commit counts relative to repository count
            const avgCommitsPerRepo = stats.commits / stats.repositories;
            
            // Languages with significantly high avg commit count are suspicious
            if (avgCommitsPerRepo > 50000 && 
                !['JavaScript', 'TypeScript', 'HTML', 'CSS'].includes(language)) {
              console.log(`Excluding ${language} from results: unusually high commit count (${stats.commits}) across only ${stats.repositories} repos.`);
              return false;
            }
            
            // For languages not commonly used in web development, filter if they're in just a few repos
            const nonWebLanguages = ['PLpgSQL', 'C', 'C++', 'CMake', 'Objective-C', 'Swift', 'Kotlin', 'Starlark', 'Makefile'];
            if (nonWebLanguages.includes(language) && stats.repositories < 3) {
              console.log(`Excluding ${language} from results: only in ${stats.repositories} repos but has ${stats.commits} commits.`);
              return false;
            }
            
            return true;
          })
      ),
      frameworks: Object.fromEntries(
        Object.entries(frameworks)
          .sort(([,a], [,b]) => b.commits - a.commits)
      ),
      tools: Object.fromEntries(
        Object.entries(tools)
          .sort(([,a], [,b]) => b.commits - a.commits)
      ),
      unrecognizedDependencies: Array.from(unrecognizedDeps.entries())
        .map(([name, { count, repos }]) => ({
          name,
          count,
          repos: Array.from(repos)
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 50),
      notes: [
        "Several languages with high commit counts but minimal repository presence are likely from generated code, dependencies, or forks.",
        "Languages like PLpgSQL, C++, CMake, and Objective-C may show as excluded or reduced if they appear to be primarily generated."
      ]
    }

    const cachePath = path.join(process.cwd(), 'src', 'data', 'github-stats.json')
    fs.writeFileSync(cachePath, JSON.stringify(cachedStats, null, 2))
    
    console.log('\nSuccessfully updated GitHub stats cache')
  } catch (error) {
    console.error('Failed to update GitHub stats:', error)
    process.exit(1)
  }
}

// Run the update
updateGitHubStats() 