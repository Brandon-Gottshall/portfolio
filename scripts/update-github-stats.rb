#!/usr/bin/env ruby
require 'octokit'
require 'linguist'
require 'rugged'
require 'json'
require 'fileutils'
require 'base64'
require 'time'
require 'dotenv'
require 'set'

# Load environment variables from .env.local
Dotenv.load('.env.local')

# --- Configuration & Helper Functions ---

# Ensure these environment variables are set:
#   GITHUB_USERNAME and GITHUB_TOKEN
username = ENV['NEXT_PUBLIC_GITHUB_USERNAME']
token = ENV['NEXT_PUBLIC_GITHUB_TOKEN']
if username.nil? || token.nil?
  puts "Error: Set Next_Public_Github_Username and Next_Public_Github_Token environment variables."
  exit(1)
end

# Email addresses for commit matching
USER_EMAILS = [
  'brandon@nebulaacademy.org',
  'blgottshall@gmail.com',
  'brandon@effortless.dev',
  'brandon@gottshall.dev',
  'brandon@effortlessdevelopment.com',
  '55668392+brandon-gottshall@users.noreply.github.com',
  'bgkoden11@gmail.com',
  'brandongottshall@pop-os.localdomain'
].uniq

# Track any new email addresses we find
FOUND_EMAILS = Set.new

# Organizations associated with you
ASSOCIATED_ORGS = ['NebulaAcademy', 'Effortless-Development', 'Brandon-Gottshall']

# File extension to language mapping for fallback language detection
LANG_MAP = {
  # JavaScript ecosystem
  'js' => 'JavaScript',
  'jsx' => 'JavaScript', # React JSX
  'ts' => 'TypeScript',
  'tsx' => 'TypeScript', # React TSX
  'mjs' => 'JavaScript', # ES modules
  'cjs' => 'JavaScript', # CommonJS modules
  'vue' => 'Vue',        # Vue single-file components
  'svelte' => 'Svelte',  # Svelte components
  
  # Python ecosystem
  'py' => 'Python',
  'pyx' => 'Python',
  'pyi' => 'Python',
  'ipynb' => 'Python',
  
  # Ruby ecosystem
  'rb' => 'Ruby',
  'rake' => 'Ruby',
  'gemspec' => 'Ruby',
  
  # JVM ecosystem
  'java' => 'Java',
  'kt' => 'Kotlin',
  'kts' => 'Kotlin',
  'scala' => 'Scala',
  'clj' => 'Clojure',
  
  # C-family
  'c' => 'C',
  'h' => 'C',
  'cpp' => 'C++',
  'hpp' => 'C++',
  'cc' => 'C++',
  'cxx' => 'C++',
  'cs' => 'C#',
  
  # Mobile
  'swift' => 'Swift',
  'dart' => 'Dart',
  'm' => 'Objective-C',  # Objective-C implementation
  'mm' => 'Objective-C', # Objective-C++ implementation
  
  # Web
  'php' => 'PHP',
  'go' => 'Go',
  'rs' => 'Rust',
  'elm' => 'Elm',
  
  # Shell scripting
  'sh' => 'Shell',
  'bash' => 'Shell',
  'zsh' => 'Shell',
  
  # Data/ML
  'r' => 'R',
  'jl' => 'Julia',
  
  # Markup/Config (counted as tools instead of languages)
  'html' => 'HTML',
  'htm' => 'HTML',
  'css' => 'CSS',
  'scss' => 'CSS',
  'sass' => 'CSS',
  'less' => 'CSS',
  'md' => 'Markdown',
  'markdown' => 'Markdown',
  'yml' => 'YAML',
  'yaml' => 'YAML',
  'json' => 'JSON',
  'xml' => 'XML',
  'toml' => 'TOML'
}

# Markup languages to count as tools instead of languages
MARKUP_TOOLS = ['Markdown', 'YAML', 'JSON', 'XML', 'TOML']

# Language name normalization map
LANGUAGE_NORMALIZE = {
  'TSX' => 'TypeScript',
  'JavaScript' => 'JavaScript',
  'Dart' => 'Dart',
  'JSX' => 'JavaScript',
  'TypeScript JSX' => 'TypeScript',
  'TypeScript React' => 'TypeScript'
}

# --- Debug flags ---
# Set to true to enable detailed debug logging
DEBUG_HEURISTICS = true 
DEBUG_LANGUAGE_DETECTION = true

def log_with_timestamp(message)
  puts "[#{Time.now.strftime('%H:%M:%S')}] #{message}"
end

# --- GitHub Client Setup ---
client = Octokit::Client.new(access_token: token)
client.auto_paginate = true

# --- Fetching Repositories ---

# Cache file path for repository data
REPO_CACHE_PATH = File.join(Dir.pwd, 'src', 'data', 'github-repos-cache.json')

# Load cached repository data if available and not expired
cached_data = nil
if File.exist?(REPO_CACHE_PATH)
  cached_data = JSON.parse(File.read(REPO_CACHE_PATH), symbolize_names: true)
  cache_age = Time.now - Time.parse(cached_data[:lastUpdated])
  
  # Invalidate cache if older than 24 hours
  if cache_age > 86400
    cached_data = nil
  end
end

if cached_data
  log_with_timestamp("Using cached repository data from #{cached_data[:lastUpdated]}")
  owned_repos = cached_data[:owned_repos].map { |r| OpenStruct.new(r) }
  contributed_repos = cached_data[:contributed_repos].map { |r| OpenStruct.new(r) }
  all_repos = cached_data[:all_repos].map { |r| OpenStruct.new(r) }
  valid_repos = cached_data[:valid_repos].map { |r| OpenStruct.new(r) }
else
  log_with_timestamp("Fetching owned repositories for #{username}...")
  owned_repos = client.repositories(username, type: 'all')
  log_with_timestamp("Fetching contributed repositories for #{username}...")
  search_result = client.search_repositories("user:#{username}", sort: 'updated', order: 'desc')
  contributed_repos = search_result.items

  # Combine and deduplicate repos by full_name
  all_repos = (owned_repos + contributed_repos).uniq { |r| r.full_name }
  log_with_timestamp("Total repositories fetched (owned + contributed): #{all_repos.size}")

  # --- Repository Filtering Function ---

  def valid_repository?(repo, client, username)
    # Skip a specific repository if needed
    return false if repo.full_name == 'Brandon-Gottshall/moodle'

    # Test if languages can be fetched
    begin
      _langs = client.languages(repo.full_name)
    rescue Octokit::NotFound
      log_with_timestamp("Cannot fetch languages for #{repo.full_name} – skipping")
      return false
    end

    # Include repos from associated organizations
    if ASSOCIATED_ORGS.any? { |org| org.downcase == repo.owner.login.downcase }
      log_with_timestamp("Including #{repo.full_name}: Associated organization")
      return true
    end

    # For forks or repos not owned by you, check for contributions via username or email
    if repo.fork || repo.owner.login.downcase != username.downcase
      begin
        commits = client.commits(repo.full_name, author: username, per_page: 1)
        if commits.empty?
          found = USER_EMAILS.any? do |email|
            email_commits = client.commits(repo.full_name, author: email, per_page: 1)
            !email_commits.empty?
          end
          return found
        end
      rescue Octokit::NotFound
        log_with_timestamp("No permission to fetch commits for #{repo.full_name} – skipping")
        return false
      end
    end

    true
  end

  valid_repos = all_repos.select { |repo| valid_repository?(repo, client, username) }
  log_with_timestamp("Valid repositories after filtering: #{valid_repos.size}")

  # Cache the repository data
  cache_data = {
    lastUpdated: Time.now.utc.iso8601,
    owned_repos: owned_repos.map(&:to_h),
    contributed_repos: contributed_repos.map(&:to_h),
    all_repos: all_repos.map(&:to_h),
    valid_repos: valid_repos.map(&:to_h)
  }

  FileUtils.mkdir_p(File.dirname(REPO_CACHE_PATH))
  File.write(REPO_CACHE_PATH, JSON.pretty_generate(cache_data))
  log_with_timestamp("Cached repository data at #{REPO_CACHE_PATH}")
end

# --- Cloning and Analysis with Linguist ---

# Clone each repository (if not already cloned) into a temporary folder.
def clone_repo(repo)
  dir = File.join("tmp_repos", repo.full_name.gsub('/', '_'))
  unless Dir.exist?(dir)
    log_with_timestamp("Cloning #{repo.full_name} into #{dir}...")
    unless system("git clone #{repo.clone_url} #{dir}")
      log_with_timestamp("Error cloning #{repo.full_name}")
    end
  else
    log_with_timestamp("Repository #{repo.full_name} already cloned.")
  end
  dir
end

# Analyze repository with Linguist (overall language bytes)
def analyze_repo(repo_path)
  begin
    languages = {}
    skipped_files = { generated: 0, vendored: 0, documentation: 0, no_language: 0 }
    processed_files = 0
    
    # Walk through all files in the repository
    Dir.glob(File.join(repo_path, '**', '*')).each do |file|
      next if File.directory?(file)
      next if file.include?('.git/')
      
      begin
        relative_path = file.sub("#{repo_path}/", '')
        data = File.read(file)
        blob = Linguist::Blob.new(relative_path, data)
        
        # Enhanced filtering for generated/vendor/documentation files with detailed logging
        if blob.generated?
          skipped_files[:generated] += 1
          log_with_timestamp("Skipping generated file: #{relative_path}") if DEBUG_HEURISTICS
          next
        end
        
        if blob.vendored?
          skipped_files[:vendored] += 1
          log_with_timestamp("Skipping vendored file: #{relative_path}") if DEBUG_HEURISTICS
          next
        end
        
        if blob.documentation?
          skipped_files[:documentation] += 1
          log_with_timestamp("Skipping documentation file: #{relative_path}") if DEBUG_HEURISTICS
          next
        end
        
        language_name = nil
        
        # Try to get language from Linguist
        if blob.language
          language_name = LANGUAGE_NORMALIZE[blob.language.name] || blob.language.name
          log_with_timestamp("Linguist detected: #{blob.language.name} -> #{language_name} for #{relative_path}") if DEBUG_LANGUAGE_DETECTION
        end
        
        # If no language detected or it's a markup language we want to count as a tool,
        # try to detect using file extension
        if language_name.nil? || MARKUP_TOOLS.include?(language_name)
          ext = File.extname(relative_path).sub('.', '').downcase
          fallback_language = LANG_MAP[ext]
          
          # Skip markup languages counted as tools
          if fallback_language && !MARKUP_TOOLS.include?(fallback_language)
            language_name = fallback_language
            log_with_timestamp("Fallback detected #{language_name} for file #{relative_path}") if DEBUG_LANGUAGE_DETECTION
          elsif fallback_language && MARKUP_TOOLS.include?(fallback_language)
            # If it's a markup language, we'll count it as a tool later
            log_with_timestamp("Skipping markup file (will count as tool): #{relative_path}") if DEBUG_LANGUAGE_DETECTION
            next
          else
            # No language detected even with fallback
            skipped_files[:no_language] += 1
            log_with_timestamp("No language detected for file: #{relative_path}") if DEBUG_LANGUAGE_DETECTION
            next
          end
        end
        
        next unless language_name  # Skip if no language detected
        
        languages[language_name] ||= 0
        languages[language_name] += blob.size
        processed_files += 1
        
        # Check for Flutter framework in pubspec.yaml
        if relative_path == 'pubspec.yaml' && data.include?('flutter:')
          languages['Dart'] ||= 0  # Ensure Dart is counted
          languages['Dart'] += blob.size  # Count pubspec.yaml size towards Dart
        end
      rescue => file_error
        log_with_timestamp("Error processing file #{relative_path}: #{file_error.message}") if DEBUG_HEURISTICS
        next
      end
    end
    
    # Log summary of processed and skipped files
    log_with_timestamp("Repository analysis summary for #{repo_path}:")
    log_with_timestamp("  Processed files: #{processed_files}")
    log_with_timestamp("  Skipped files: #{skipped_files.inspect}")
    log_with_timestamp("  Languages detected: #{languages.keys.join(', ')}")
    
    { languages: languages, non_generated_files: [] }
  rescue => e
    log_with_timestamp("ERROR in analyze_repo for #{repo_path}: #{e.message}")
    log_with_timestamp("Stack trace: #{e.backtrace.join("\n")}")
    { languages: {}, non_generated_files: [] }
  end
end

# --- Commit-Level Analysis Using Rugged and Linguist ---

# Check if repo is a Flutter repo (by examining pubspec.yaml)
def flutter_repo?(repo_path)
  pubspec_path = File.join(repo_path, "pubspec.yaml")
  return false unless File.exist?(pubspec_path)
  
  begin
    content = File.read(pubspec_path)
    # Check for Flutter SDK dependency or Flutter configuration
    has_flutter = content.include?('flutter:') || 
                 content.include?('sdk: flutter') || 
                 content.include?('flutter/') ||
                 content.include?('uses-material-design')
    
    # Also check for Flutter-specific directories
    has_flutter_dirs = Dir.exist?(File.join(repo_path, "android")) && 
                       Dir.exist?(File.join(repo_path, "ios")) &&
                       Dir.exist?(File.join(repo_path, "lib"))
    
    is_flutter = has_flutter || has_flutter_dirs
    log_with_timestamp("Repository #{repo_path} Flutter detection: #{is_flutter}")
    return is_flutter
  rescue => e
    log_with_timestamp("Error checking if #{repo_path} is a Flutter repo: #{e.message}")
    return false
  end
end

# Special CSS structure with nested objects for tracking different CSS variants
def create_css_stats_structure
  {
    # Top-level summary stats
    summary: {
      repositories: 0,
      bytes: 0,
      commits: 0,
      percentage_of_all_commits: 0.0 # Will be calculated later
    },
    # Breakdown by variants
    variants: {
      # Vanilla CSS variant tracking
      vanilla: {
        repositories: 0,
        bytes: 0,
        commits: 0,
        percentage_of_css: 0.0, # Will be calculated later
        file_types: {  # Track by file extension
          css: { files: 0, bytes: 0, commits: 0 },
          scss: { files: 0, bytes: 0, commits: 0 },
          sass: { files: 0, bytes: 0, commits: 0 },
          less: { files: 0, bytes: 0, commits: 0 }
        }
      },
      # Tailwind variant tracking
      tailwind: {
        repositories: 0,
        bytes: 0,
        commits: 0,
        percentage_of_css: 0.0, # Will be calculated later
        # Track Tailwind specific metrics
        usage: {
          utility_classes: 0,  # Count of files using utility classes
          config_files: 0,     # Count of tailwind config files
          with_plugins: 0      # Count of repos using Tailwind plugins
        },
        file_types: {  # Track by file extension
          css: { files: 0, bytes: 0, commits: 0 },
          scss: { files: 0, bytes: 0, commits: 0 },
          jsx_tsx: { files: 0, bytes: 0, commits: 0 }, # Tailwind in JSX/TSX
          html: { files: 0, bytes: 0, commits: 0 }     # Tailwind in HTML
        }
      }
    },
    # Historical tracking - could be used if you want to track changes over time
    timeline: {
      first_used: nil,        # When you first used CSS 
      first_tailwind: nil,    # When you first used Tailwind
      recent_activity: []     # Could store recent CSS activity
    },
    # Repository-specific tracking (limited to avoid memory issues)
    top_repos: []  # Will store data about top 5 CSS-heavy repos
  }
end

# Process commits in a repository
def process_commits(repo_path, repo, username)
  language_commits = Hash.new(0)
  framework_commits = Hash.new(0)
  tool_commits = Hash.new(0)
  skipped_files = { generated: 0, vendored: 0, documentation: 0, no_language: 0 }
  processed_files = 0
  
  # Per-repo CSS stats tracker
  repo_css_stats = {
    repo_name: repo.full_name,
    total_css_files: 0,
    total_css_commits: 0,
    total_css_bytes: 0,
    has_tailwind: false,
    tailwind_files: 0,
    tailwind_commits: 0,
    tailwind_bytes: 0,
    vanilla_files: 0,
    vanilla_commits: 0,
    vanilla_bytes: 0,
    # Track individual file extensions
    extensions: {
      css: 0,
      scss: 0,
      sass: 0,
      less: 0,
      jsx_tsx_with_css: 0,
      html_with_css: 0
    },
    first_css_commit_date: nil,
    latest_css_commit_date: nil
  }
  
  # Check if this repo has React in package.json
  is_react_repo = false
  has_tailwind_dep = false
  has_tailwind_plugins = false
  
  begin
    package_json_path = File.join(repo_path, "package.json")
    if File.exist?(package_json_path)
      package_json = JSON.parse(File.read(package_json_path))
      deps = (package_json["dependencies"] || {}).merge(package_json["devDependencies"] || {})
      is_react_repo = deps.keys.any? { |k| k == 'react' || k.include?('@react/') }
      
      # Check for Next.js as well
      is_next_repo = deps.keys.any? { |k| k == 'next' || k == 'nextjs' }
      if is_next_repo
        is_react_repo = true  # Next.js implies React
      end
      
      # Check for Tailwind CSS in dependencies
      has_tailwind_dep = deps.keys.any? { |k| k.include?('tailwind') }
      
      # Check for Tailwind plugins
      has_tailwind_plugins = deps.keys.any? { |k| k.include?('@tailwindcss/') }
      
      if has_tailwind_dep
        repo_css_stats[:has_tailwind] = true
      end
      
      # Free some memory
      deps = nil
      package_json = nil
    end
  rescue => e
    log_with_timestamp("Error checking package.json for React in #{repo_path}: #{e.message}")
  end

  # Check if this is a Flutter repo
  is_flutter_repo = flutter_repo?(repo_path)
  
  # Check for tailwind config files
  tailwind_config_js = File.join(repo_path, "tailwind.config.js")
  tailwind_config_ts = File.join(repo_path, "tailwind.config.ts")
  postcss_config = File.join(repo_path, "postcss.config.js")
  
  has_tailwind_config = File.exist?(tailwind_config_js) || 
                        File.exist?(tailwind_config_ts) ||
                        File.exist?(postcss_config)
                        
  if has_tailwind_config
    repo_css_stats[:has_tailwind] = true
  end
  
  log_with_timestamp("Repository #{repo_path} detected as React repo: #{is_react_repo}, Flutter repo: #{is_flutter_repo}, Has Tailwind: #{has_tailwind_config || has_tailwind_dep}")
  
  begin
    r_repo = Rugged::Repository.new(repo_path)
    walker = Rugged::Walker.new(r_repo)
    
    # Process all local branches
    r_repo.branches.each_name(:local) do |branch_name|
      begin
        branch = r_repo.branches[branch_name]
        walker.push(branch.target_id)
      rescue => e
        log_with_timestamp("Error processing branch #{branch_name}: #{e.message}")
      end
    end

    # If it's a Flutter repo, handle Flutter-specific processing
    if is_flutter_repo
      flutter_commits = 0
      dart_files = 0
      
      walker.each do |commit|
        author_email = commit.author[:email].to_s.downcase
        
        # Track any new email addresses we find
        if commit.author[:name].to_s.downcase.include?('brandon') || 
           commit.author[:name].to_s.downcase.include?('gottshall')
          FOUND_EMAILS.add(author_email)
        end
        
        # Only process commits from you
        next unless (author_email == username.downcase || USER_EMAILS.any? { |e| e.downcase == author_email })
        
        # Count commit toward Flutter and also Dart
        flutter_commits += 1
        
        # Process files in commit to count Dart usage
        if commit.parents.empty?
          diff = commit.diff(nil)
        else
          diff = commit.diff(commit.parents.first)
        end
        
        diff.each_delta do |delta|
          next if delta.status == :deleted
          path = delta.new_file[:path]
          
          # Count Dart files
          if path.end_with?('.dart')
            dart_files += 1
            language_commits['Dart'] += 1
          end
        end
      end
      
      # Add the Flutter commits count
      framework_commits['Flutter'] += flutter_commits
      log_with_timestamp("Counted #{flutter_commits} Flutter commits and #{dart_files} Dart files in Flutter repo #{repo_path}")
    else
      # Regular processing for non-Flutter repos
      walker.each do |commit|
        author_email = commit.author[:email].to_s.downcase
        commit_date = commit.time  # Get commit timestamp
        
        # Track any new email addresses we find
        if commit.author[:name].to_s.downcase.include?('brandon') || 
           commit.author[:name].to_s.downcase.include?('gottshall')
          FOUND_EMAILS.add(author_email)
        end
        
        # Only process commits from you
        next unless (author_email == username.downcase || USER_EMAILS.any? { |e| e.downcase == author_email })

        # Get the diff
        diff = if commit.parents.empty?
                 commit.diff(nil)
               else
                 commit.diff(commit.parents.first)
               end

        # Track if this commit modified CSS
        modified_css = false

        # Process each changed file in the commit
        diff.each_delta do |delta|
          next if delta.status == :deleted
          path = delta.new_file[:path]
          ext = File.extname(path).sub('.', '').downcase
          
          begin
            blob_data = r_repo.read(delta.new_file[:oid]).data
            linguist_blob = Linguist::Blob.new(path, blob_data)
            
            # Skip generated/vendor/documentation files
            next if linguist_blob.generated? || linguist_blob.vendored? || linguist_blob.documentation?
            
            language_name = nil
            
            # Try to get language from Linguist
            if linguist_blob.language
              language_name = LANGUAGE_NORMALIZE[linguist_blob.language.name] || linguist_blob.language.name
            end
            
            # Fallback to extension-based detection if needed
            if language_name.nil? || MARKUP_TOOLS.include?(language_name)
              fallback_language = LANG_MAP[ext]
              
              if fallback_language && !MARKUP_TOOLS.include?(fallback_language)
                language_name = fallback_language
              elsif fallback_language && MARKUP_TOOLS.include?(fallback_language)
                # Count markup languages as tools
                tool_commits[fallback_language] += 1
                next
              else
                # No language detected even with fallback
                next
              end
            end
            
            # Enhanced CSS tracking - process any CSS-related file
            is_css_file = (language_name == 'CSS' || 
                          ['css', 'scss', 'sass', 'less'].include?(ext) ||
                          (path.end_with?('.jsx') && blob_data.include?('className=')) ||
                          (path.end_with?('.tsx') && blob_data.include?('className=')) ||
                          (path.end_with?('.html') && blob_data.include?('class="')))
            
            if is_css_file
              modified_css = true
              file_size = blob_data.size
              
              # Update repo CSS stats
              repo_css_stats[:total_css_files] += 1
              repo_css_stats[:total_css_commits] += 1
              repo_css_stats[:total_css_bytes] += file_size
              
              # Track first/latest CSS commit dates
              if repo_css_stats[:first_css_commit_date].nil? || commit_date < repo_css_stats[:first_css_commit_date]
                repo_css_stats[:first_css_commit_date] = commit_date
              end
              if repo_css_stats[:latest_css_commit_date].nil? || commit_date > repo_css_stats[:latest_css_commit_date]
                repo_css_stats[:latest_css_commit_date] = commit_date
              end
              
              # Update extension-specific counters
              if ['css', 'scss', 'sass', 'less'].include?(ext)
                repo_css_stats[:extensions][ext.to_sym] += 1
              elsif ['jsx', 'tsx'].include?(ext)
                repo_css_stats[:extensions][:jsx_tsx_with_css] += 1
              elsif ['html', 'htm'].include?(ext)
                repo_css_stats[:extensions][:html_with_css] += 1
              end
              
              # Check if it's Tailwind CSS
              uses_tailwind = tailwind_used?(blob_data) || 
                             has_tailwind_config || 
                             has_tailwind_dep || 
                             path.end_with?('tailwind.config.js') ||
                             path.end_with?('tailwind.config.ts')
              
              if uses_tailwind
                repo_css_stats[:has_tailwind] = true
                repo_css_stats[:tailwind_files] += 1
                repo_css_stats[:tailwind_commits] += 1
                repo_css_stats[:tailwind_bytes] += file_size
                log_with_timestamp("Counting Tailwind CSS commit for file #{path}")
              else
                repo_css_stats[:vanilla_files] += 1
                repo_css_stats[:vanilla_commits] += 1
                repo_css_stats[:vanilla_bytes] += file_size
                log_with_timestamp("Counting vanilla CSS commit for file #{path}")
              end
            end
            
            # Add language commit if we found a language
            if language_name && !MARKUP_TOOLS.include?(language_name)
              language_commits[language_name] += 1
              processed_files += 1
              
              # Check for frameworks based on language and file content
              check_for_frameworks(language_name, path, ext, blob_data, framework_commits, is_react_repo)
            end
            
            # Free memory
            blob_data = nil
            linguist_blob = nil
            
          rescue => e
            log_with_timestamp("Error processing file in commit: #{path}, error: #{e.message}") if DEBUG_HEURISTICS
            next
          end
        end
        
        # Free memory after processing each commit
        diff = nil
        GC.start if rand < 0.1  # Occasionally force garbage collection to avoid memory issues
      end
    end

    # Log CSS summary for this repo
    if repo_css_stats[:total_css_commits] > 0
      log_with_timestamp("CSS stats for #{repo_path}:")
      log_with_timestamp("  Total CSS files: #{repo_css_stats[:total_css_files]}")
      log_with_timestamp("  Total CSS commits: #{repo_css_stats[:total_css_commits]}")
      log_with_timestamp("  Has Tailwind: #{repo_css_stats[:has_tailwind]}")
      log_with_timestamp("  Tailwind files: #{repo_css_stats[:tailwind_files]}")
      log_with_timestamp("  Vanilla files: #{repo_css_stats[:vanilla_files]}")
    end
    
  rescue => e
    log_with_timestamp("Error processing commits for #{repo_path}: #{e.message}")
  end

  # Return the stats
  {
    languages: language_commits,
    frameworks: framework_commits.transform_values { |count| { repositories: 0, commits: count } },
    tools: tool_commits,
    css_stats: repo_css_stats
  }
end

# Helper method to check if content contains Tailwind utility classes
def tailwind_used?(content)
  # Robust regex for common Tailwind utility class prefixes
  tailwind_regex = /
    \b(
      container|
      space-|divide-|bg-|from-|via-|to-|text-|font-|leading-|tracking-|
      p(?:[trblxy]?)-|
      m(?:[trblxy]?)-|
      border-|rounded-|shadow-|opacity-|z-|flex-|grid-|justify-|items-|content-|self-
    )
  /x
  
  # Check for presence of Tailwind utility classes
  result = content.match?(tailwind_regex)
  
  # Also check for Tailwind imports/config
  has_tailwind_import = content.include?('tailwind') || 
                       content.include?('@tailwindcss') || 
                       content.include?('tailwind.config')
  
  result || has_tailwind_import
end

# Helper method to check for frameworks based on file content
def check_for_frameworks(language_name, path, ext, content, framework_commits, is_react_repo)
  # JavaScript/TypeScript files - Check for React and Express
  if ['JavaScript', 'TypeScript'].include?(language_name)
    # React detection with multiple methods
    is_react_file = false
    
    # Method 1: Check file extension
    is_react_file ||= ['jsx', 'tsx'].include?(ext)
    
    # Method 2: Check path for React-specific patterns
    is_react_file ||= path.include?('react') || 
                      path.include?('next/') || 
                      path.include?('/pages/') || 
                      path.include?('/app/') ||
                      path.include?('/components/')
    
    # Method 3: Check file content for React imports or JSX
    is_react_file ||= content.include?('import React') || 
                      content.include?("from 'react'") || 
                      content.include?('from "react"') ||
                      content.include?('<React.') ||
                      content.include?('<>') ||  # JSX fragment
                      content.match(/<[A-Z][a-zA-Z]*\s/) # JSX component pattern
                      
    # Method 4: If it's in a known React repo and it's JS/TS, assume it's React
    is_react_file ||= is_react_repo
    
    if is_react_file && !path.include?('node_modules')
      framework_commits['React'] += 1
      log_with_timestamp("Counting React framework commit for file #{path}")
      
      # Check for Tailwind utility classes
      if tailwind_used?(content)
        framework_commits['Tailwind CSS'] += 1
        log_with_timestamp("Counting Tailwind CSS framework commit for file #{path} (detected utility classes)")
      end
      
      # Check if this is also Next.js
      if path.include?('next/') || path.include?('/pages/') || path.include?('/app/')
        framework_commits['Next.js'] += 1
        log_with_timestamp("Counting Next.js framework commit for file #{path}")
      end
    end
    
    # Express detection by file content
    check_for_express(content, framework_commits, path)
  end
  
  # Ruby files - Check for Rails
  if language_name == 'Ruby'
    check_for_rails(content, framework_commits, path, ext)
  end
  
  # HTML files - Check for Tailwind classes directly
  if language_name == 'HTML' || path.end_with?('.html', '.htm')
    if tailwind_used?(content)
      framework_commits['Tailwind CSS'] += 1
      log_with_timestamp("Counting Tailwind CSS framework commit for HTML file #{path}")
    end
  end
  
  # CSS files - Check for Tailwind directives
  if language_name == 'CSS' || ['.css', '.scss', '.sass', '.less'].any? { |ext_name| path.end_with?(ext_name) }
    if content.include?('@tailwind') || content.include?('@apply')
      framework_commits['Tailwind CSS'] += 1
      log_with_timestamp("Counting Tailwind CSS framework commit for CSS file #{path}")
    end
  end
  
  # Check for all frameworks based on path patterns
  FRAMEWORK_MAP.each do |framework, patterns|
    if patterns.any? { |pattern| path.downcase.include?(pattern.downcase.gsub(/^[@]/, "")) }
      framework_commits[framework] += 1
      log_with_timestamp("Counting framework commit for #{framework} in file #{path}") if DEBUG_LANGUAGE_DETECTION
      
      # If this is a Next.js file, also count as React
      if framework == 'Next.js'
        framework_commits['React'] += 1
        log_with_timestamp("Counting Next.js file as React for #{path}") if DEBUG_LANGUAGE_DETECTION
      end
    end
  end
end

# Helper method to check for Express usage in file content
def check_for_express(content, framework_commits, path)
  # Look for common Express import/require patterns
  express_import_patterns = [
    "require('express')",
    'require("express")',
    "import express",
    "from 'express'",
    'from "express"',
    "const express = require",
    "var express = require",
    "let express = require",
    "app = express()",
    "app.use(express.",
    "express.Router()",
    "express.json()",
    "express.static("
  ]
  
  # Check if any pattern is found in the content
  if express_import_patterns.any? { |pattern| content.include?(pattern) }
    framework_commits['Express'] += 1
    log_with_timestamp("Counting Express framework commit for file #{path} (detected import/require)")
    return true
  end
  
  # Also check for typical Express route patterns
  express_route_patterns = [
    "app.get('",
    'app.get("',
    "app.post('",
    'app.post("',
    "app.put('",
    'app.put("',
    "app.delete('",
    'app.delete("',
    "router.get('",
    'router.get("',
    "router.post('",
    'router.post("'
  ]
  
  if express_route_patterns.any? { |pattern| content.include?(pattern) }
    framework_commits['Express'] += 1
    log_with_timestamp("Counting Express framework commit for file #{path} (detected Express routes)")
    return true
  end
  
  return false
end

# Helper method to check for Rails usage in file content
def check_for_rails(content, framework_commits, path, ext)
  # Only check Ruby files
  return false unless ext == 'rb'
  
  # Rails controller/model patterns
  rails_patterns = [
    'class ApplicationController',
    'ActionController::Base',
    'ActiveRecord::Base',
    'Rails.application',
    'has_many',
    'belongs_to',
    'validates',
    'render',
    'redirect_to',
    'before_action',
    'config/routes',
    'resources :',
    'ActiveJob::Base',
    'ActiveStorage',
    'ActionMailer'
  ]
  
  # Check if any pattern is found in the content
  if rails_patterns.any? { |pattern| content.include?(pattern) }
    framework_commits['Rails'] += 1
    log_with_timestamp("Counting Rails framework commit for file #{path} (detected Rails patterns)")
    return true
  end
  
  # Also check for Rails-specific file paths
  rails_paths = [
    'app/controllers/',
    'app/models/',
    'app/views/',
    'db/migrate/',
    'config/routes.rb',
    'config/application.rb'
  ]
  
  if rails_paths.any? { |rail_path| path.include?(rail_path) }
    framework_commits['Rails'] += 1
    log_with_timestamp("Counting Rails framework commit for file #{path} (detected Rails file path)")
    return true
  end
  
  return false
end

# --- Package.json Processing for Frameworks & Tools ---

FRAMEWORK_MAP = {
  "Next.js" => ['next', 'nextjs'],
  "React" => ['react', '@react/core'],
  "React Native" => ['react-native', '@react-native/', 'expo', '@expo/'],
  "Vue.js" => ['vue', '@vue/'],
  "Angular" => ['@angular/', 'angular'],
  "Astro" => ['astro', '@astrojs/'],
  "Svelte" => ['svelte', '@sveltejs/kit'],
  "NestJS" => ['@nestjs/'],
  "Express" => ['express'],
  "Django" => ['django'],
  "Flask" => ['flask'],
  "FastAPI" => ['fastapi'],
  "tRPC" => ['@trpc/'],
  "Flutter" => ['flutter', 'flutter_bloc', 'flutter_riverpod', 'flutter_hooks'],
  "Tailwind CSS" => ['tailwindcss', '@tailwindcss/'],
  "Shadcn UI" => ['@shadcn/ui', 'shadcn-ui'],
  "Drizzle" => ['drizzle-orm', '@drizzle/'],
  "MongoDB" => ['mongodb', 'mongoose'],
  "PyTorch" => ['torch', 'pytorch'],
  "TensorFlow" => ['tensorflow'],
  "Pandas" => ['pandas'],
  "NumPy" => ['numpy'],
  "Rails" => ['rails', 'railties', 'actionpack', 'activerecord', 'activestorage', 'actionmailer', 
              'config/routes.rb', 'app/controllers/', 'app/models/', 'app/views/', 'db/migrate/']
}

TOOL_MAP = {
  "Jest" => ['jest', '@jest/', '@testing-library/react', '@testing-library/dom', '@testing-library/user-event'],
  "Cypress" => ['cypress'],
  "PyTest" => ['pytest'],
  "Vitest" => ['@vitest/'],
  "Mocha" => ['mocha'],
  "Chai" => ['chai'],
  "ESLint" => ['eslint', '@eslint/'],
  "Prettier" => ['prettier'],
  "Storybook" => ['@storybook/', 'storybook'],
  "Jupyter" => ['jupyter', 'notebook', 'ipykernel', '.ipynb'],
  "Docker" => ['docker', 'docker-compose'],
  "GitHub Actions" => ['.github/workflows/', 'actions/', '@actions/'],
  "Terraform" => ['terraform', '.tf'],
  "Kubernetes" => ['kubernetes', 'k8s'],
  "AWS" => ['@aws-sdk/', 'aws-sdk'],
  "Vercel" => ['@vercel/', 'vercel'],
  "Netlify" => ['netlify', '@netlify/'],
  "Firebase" => ['firebase', '@firebase/'],
  "Supabase" => ['@supabase/', 'supabase-js'],
  "Redis" => ['redis', 'ioredis'],
  "PM2" => ['pm2'],
  "VS Code" => ['@vscode/', 'vscode', '.vscode/'],
  "Markdown" => ['.md', '.markdown'],
  "YAML" => ['.yml', '.yaml'],
  "JSON" => ['.json'],
  "XML" => ['.xml'],
  "TOML" => ['.toml']
}

# Fetch and decode package.json from the repository using Octokit.
def fetch_package_json(repo, client)
  begin
    pkg = client.contents(repo.full_name, path: "package.json")
    content = Base64.decode64(pkg.content)
    JSON.parse(content)
  rescue Octokit::NotFound
    nil
  end
end

# Process a list of dependencies against framework and tool patterns
def process_dependency_list(dependencies, repo_name, frameworks, tools, unrecognized)
  dependencies.each do |dep|
    recognized = false
    FRAMEWORK_MAP.each do |framework, patterns|
      if patterns.any? { |pattern| dep.downcase.include?(pattern.downcase.gsub(/^[@]/, "")) }
        frameworks[framework] ||= { repositories: 0, commits: 0 }
        frameworks[framework][:repositories] += 1
        recognized = true
        break
      end
    end
    unless recognized
      TOOL_MAP.each do |tool, patterns|
        if patterns.any? { |pattern| dep.downcase.include?(pattern.downcase.gsub(/^[@]/, "")) }
          tools[tool] ||= { repositories: 0, commits: 0 }
          tools[tool][:repositories] += 1
          recognized = true
          break
        end
      end
    end
    unless recognized
      unrecognized[dep] ||= { count: 0, repos: [] }
      unrecognized[dep][:count] += 1
      unrecognized[dep][:repos] << repo_name unless unrecognized[dep][:repos].include?(repo_name)
    end
  end
end

# Process dependencies from package.json and pubspec.yaml
def process_dependencies(package_json, repo_name, frameworks, tools, unrecognized)
  # Check if this is a Flutter repo
  is_flutter_repo = false
  flutter_repo_path = File.join("tmp_repos", repo_name.gsub('/', '_'))
  
  if Dir.exist?(flutter_repo_path)
    is_flutter_repo = flutter_repo?(flutter_repo_path)
    
    if is_flutter_repo
      frameworks['Flutter'] ||= { repositories: 0, commits: 0 }
      frameworks['Flutter'][:repositories] += 1
      log_with_timestamp("Marked #{repo_name} as a Flutter repository")
    end
  end
  
  # Check if this is a Rails repo
  is_rails_repo = false
  rails_repo_path = File.join("tmp_repos", repo_name.gsub('/', '_'))
  
  if Dir.exist?(rails_repo_path)
    # Check for Rails project markers
    rails_markers = [
      File.join(rails_repo_path, "config/routes.rb"),
      File.join(rails_repo_path, "config/application.rb"),
      File.join(rails_repo_path, "Gemfile")
    ]
    
    # Check if any Rails marker files exist
    has_rails_files = rails_markers.any? { |file| File.exist?(file) }
    
    # Check Gemfile for Rails if it exists
    if File.exist?(rails_markers[2])
      begin
        gemfile_content = File.read(rails_markers[2])
        if gemfile_content.include?("'rails'") || gemfile_content.include?('"rails"')
          is_rails_repo = true
        end
      rescue => e
        log_with_timestamp("Error checking Gemfile for Rails in #{repo_name}: #{e.message}")
      end
    end
    
    is_rails_repo ||= has_rails_files
    
    if is_rails_repo
      frameworks['Rails'] ||= { repositories: 0, commits: 0 }
      frameworks['Rails'][:repositories] += 1
      log_with_timestamp("Marked #{repo_name} as a Rails repository")
    end
  end
  
  # Process package.json dependencies
  if package_json
    dependencies = (package_json["dependencies"] || {}).keys + (package_json["devDependencies"] || {}).keys
    process_dependency_list(dependencies, repo_name, frameworks, tools, unrecognized)
    
    # Enhanced framework detection based on package.json
    tailwind_config_exists = false
    begin
      tailwind_config_path = File.join("tmp_repos", repo_name.gsub('/', '_'), "tailwind.config.js")
      postcss_config_path = File.join("tmp_repos", repo_name.gsub('/', '_'), "postcss.config.js")
      
      tailwind_config_exists = File.exist?(tailwind_config_path) || File.exist?(postcss_config_path)
      
      if tailwind_config_exists || dependencies.any? { |d| d.include?('tailwind') }
        frameworks['Tailwind CSS'] ||= { repositories: 0, commits: 0 }
        frameworks['Tailwind CSS'][:repositories] += 1
        log_with_timestamp("Detected Tailwind CSS in repository #{repo_name}")
      end
    rescue => e
      log_with_timestamp("Error checking for Tailwind config in #{repo_name}: #{e.message}")
    end
    
    # If we found Next.js, also count it as React
    if frameworks['Next.js']
      frameworks['React'] ||= { repositories: 0, commits: 0 }
      frameworks['React'][:repositories] += 1
      log_with_timestamp("Counting Next.js repository #{repo_name} as React framework")
    end
    
    # Verify Express detection from package.json is working
    if dependencies.any? { |d| d == 'express' }
      frameworks['Express'] ||= { repositories: 0, commits: 0 }
      frameworks['Express'][:repositories] += 1
      log_with_timestamp("Detected Express in repository #{repo_name} from package.json")
      
      # Check for common Express app structure files
      express_app_files = ['app.js', 'server.js', 'index.js', 'api.js']
      express_app_files.each do |file|
        file_path = File.join("tmp_repos", repo_name.gsub('/', '_'), file)
        if File.exist?(file_path)
          log_with_timestamp("Found potential Express app entry point: #{file} in #{repo_name}")
          # We don't need to do anything else here, just logging for visibility
        end
      end
    end
  end
  
  # Skip pubspec.yaml processing if we already detected Flutter
  unless is_flutter_repo
    # Process pubspec.yaml for Flutter/Dart projects
    begin
      pubspec_path = File.join("tmp_repos", repo_name.gsub('/', '_'), "pubspec.yaml")
      if File.exist?(pubspec_path)
        pubspec_content = File.read(pubspec_path)
        if pubspec_content.include?('flutter:')
          frameworks['Flutter'] ||= { repositories: 0, commits: 0 }
          frameworks['Flutter'][:repositories] += 1
        end
      end
    rescue => e
      log_with_timestamp("Error processing pubspec.yaml for #{repo_name}: #{e.message}")
    end
  end
end

# --- Aggregating Stats Across Repositories ---

summary = {
  total_repos: all_repos.size,
  owned_repos: owned_repos.size,
  contributed_repos: contributed_repos.size,
  total_commits: 0,
  public_repos: 0,
  private_repos: 0,
  forks: 0
}

# Regular language stats
languages_stats = {}

# Create the complex CSS stats structure
css_complex_stats = create_css_stats_structure

# Track top CSS repositories
top_css_repos = []

frameworks_stats = {}
tools_stats = {}
unrecognized_deps = {}

# Process repositories with memory efficiency in mind
valid_repos.each do |repo|
  summary[:forks] += 1 if repo.fork
  summary[:private_repos] += 1 if repo.private
  summary[:public_repos] += 1 unless repo.private

  # Get contributors for total commit count
  begin
    contributors = client.contributors(repo.full_name)
    if contributors.is_a?(Array)
      repo_commit_count = contributors.map(&:contributions).sum
      summary[:total_commits] += repo_commit_count
    end
  rescue => e
    log_with_timestamp("Error fetching contributors for #{repo.full_name}: #{e.message}")
  end

  # Clone and analyze repository
  repo_path = clone_repo(repo)
  
  # Process language bytes with Linguist
  analysis = analyze_repo(repo_path)
  repo_languages = analysis[:languages]
  
  # Track CSS bytes separately in our complex structure
  css_bytes = repo_languages.delete('CSS') || 0
  if css_bytes > 0
    css_complex_stats[:summary][:bytes] += css_bytes
  end
  
  # Process other languages normally
  repo_languages.each do |lang, bytes|
    languages_stats[lang] ||= { repositories: 0, bytes: 0, commits: 0 }
    languages_stats[lang][:repositories] += 1
    languages_stats[lang][:bytes] += bytes
  end

  # Process commit-level analysis with detailed CSS tracking
  commit_stats = process_commits(repo_path, repo, username)
  
  # Process regular language commits
  commit_stats[:languages].each do |lang, commit_count|
    next if lang == 'CSS' # Skip CSS
    languages_stats[lang] ||= { repositories: 0, bytes: 0, commits: 0 }
    languages_stats[lang][:commits] += commit_count
  end
  
  # Process the detailed CSS stats from this repo
  repo_css = commit_stats[:css_stats]
  if repo_css && repo_css[:total_css_commits] > 0
    # Update the complex CSS structure
    
    # Update summary stats
    css_complex_stats[:summary][:repositories] += 1
    css_complex_stats[:summary][:commits] += repo_css[:total_css_commits]
    
    # Update variants data
    if repo_css[:has_tailwind]
      # Tailwind variant
      css_complex_stats[:variants][:tailwind][:repositories] += 1
      css_complex_stats[:variants][:tailwind][:bytes] += repo_css[:tailwind_bytes]
      css_complex_stats[:variants][:tailwind][:commits] += repo_css[:tailwind_commits]
      
      # Update Tailwind usage stats
      if repo_css[:extensions][:css] > 0
        css_complex_stats[:variants][:tailwind][:file_types][:css][:files] += repo_css[:extensions][:css]
        css_complex_stats[:variants][:tailwind][:file_types][:css][:commits] += repo_css[:tailwind_commits]
      end
      
      if repo_css[:extensions][:scss] > 0
        css_complex_stats[:variants][:tailwind][:file_types][:scss][:files] += repo_css[:extensions][:scss]
        css_complex_stats[:variants][:tailwind][:file_types][:scss][:commits] += repo_css[:tailwind_commits]
      end
      
      if repo_css[:extensions][:jsx_tsx_with_css] > 0
        css_complex_stats[:variants][:tailwind][:file_types][:jsx_tsx][:files] += repo_css[:extensions][:jsx_tsx_with_css]
        css_complex_stats[:variants][:tailwind][:file_types][:jsx_tsx][:commits] += repo_css[:tailwind_commits]
      end
      
      if repo_css[:extensions][:html_with_css] > 0
        css_complex_stats[:variants][:tailwind][:file_types][:html][:files] += repo_css[:extensions][:html_with_css]
        css_complex_stats[:variants][:tailwind][:file_types][:html][:commits] += repo_css[:tailwind_commits]
      end
    end
    
    if repo_css[:vanilla_commits] > 0
      # Vanilla variant
      css_complex_stats[:variants][:vanilla][:repositories] += 1
      css_complex_stats[:variants][:vanilla][:bytes] += repo_css[:vanilla_bytes]
      css_complex_stats[:variants][:vanilla][:commits] += repo_css[:vanilla_commits]
      
      # Update file type stats for vanilla CSS
      ['css', 'scss', 'sass', 'less'].each do |ext|
        if repo_css[:extensions][ext.to_sym] > 0
          css_complex_stats[:variants][:vanilla][:file_types][ext.to_sym][:files] += repo_css[:extensions][ext.to_sym]
          css_complex_stats[:variants][:vanilla][:file_types][ext.to_sym][:commits] += repo_css[:vanilla_commits]
        end
      end
    end
    
    # Update timeline data
    if repo_css[:first_css_commit_date]
      if css_complex_stats[:timeline][:first_used].nil? || 
         repo_css[:first_css_commit_date] < css_complex_stats[:timeline][:first_used]
        css_complex_stats[:timeline][:first_used] = repo_css[:first_css_commit_date]
      end
    end
    
    # Keep track of top CSS repositories
    if top_css_repos.size < 5 || repo_css[:total_css_commits] > top_css_repos.last[:commits]
      top_repo_entry = {
        name: repo.full_name,
        commits: repo_css[:total_css_commits],
        bytes: repo_css[:total_css_bytes],
        has_tailwind: repo_css[:has_tailwind],
        tailwind_commits: repo_css[:tailwind_commits],
        vanilla_commits: repo_css[:vanilla_commits]
      }
      
      # Add to top repos and keep sorted by commit count (descending)
      top_css_repos << top_repo_entry
      top_css_repos.sort_by! { |r| -r[:commits] }
      top_css_repos = top_css_repos.take(5) # Keep only top 5
    end
  end
  
  # Update framework and tool stats
  commit_stats[:frameworks].each do |framework, stats|
    frameworks_stats[framework] ||= { repositories: 0, commits: 0 }
    frameworks_stats[framework][:commits] += stats[:commits]
  end
  
  commit_stats[:tools].each do |tool, commit_count|
    tools_stats[tool] ||= { repositories: 0, commits: 0 }
    tools_stats[tool][:commits] += commit_count
  end

  # Process package.json for framework and tool dependencies
  begin
    package_json = fetch_package_json(repo, client)
    process_dependencies(package_json, repo.full_name, frameworks_stats, tools_stats, unrecognized_deps)
    package_json = nil # Free memory
  rescue => e
    log_with_timestamp("Error processing package.json for #{repo.full_name}: #{e.message}")
  end
  
  # Explicitly clean up variables and force garbage collection occasionally
  analysis = nil
  repo_languages = nil
  commit_stats = nil
  repo_path = nil
  GC.start if rand < 0.2 # Occasionally force garbage collection
end

# Calculate percentages in the CSS complex structure
if css_complex_stats[:summary][:commits] > 0
  total_commits = summary[:total_commits]
  css_complex_stats[:summary][:percentage_of_all_commits] = (css_complex_stats[:summary][:commits].to_f / total_commits * 100).round(2)
  
  # Calculate variant percentages
  variant_commits = css_complex_stats[:variants][:vanilla][:commits] + css_complex_stats[:variants][:tailwind][:commits]
  if variant_commits > 0
    css_complex_stats[:variants][:vanilla][:percentage_of_css] = 
      (css_complex_stats[:variants][:vanilla][:commits].to_f / variant_commits * 100).round(2)
    
    css_complex_stats[:variants][:tailwind][:percentage_of_css] = 
      (css_complex_stats[:variants][:tailwind][:commits].to_f / variant_commits * 100).round(2)
  end
end

# Finalize top CSS repositories
css_complex_stats[:top_repos] = top_css_repos

# Add the complex CSS structure to languages stats
languages_stats['CSS'] = css_complex_stats

# Sort unrecognized dependencies
sorted_unrecognized = unrecognized_deps.sort_by { |_, data| -data[:count] }[0, 50].map do |dep, data|
  { name: dep, count: data[:count], repos: data[:repos] }
end

# Build final stats hash with memory efficiency in mind
cached_stats = {
  lastUpdated: Time.now.utc.iso8601,
  summary: summary,
  repoCount: valid_repos.size,
  languages: languages_stats.sort_by { |lang, stats| 
    # Special handling for CSS with its complex structure
    if lang == 'CSS'
      [-stats[:summary][:commits], -stats[:summary][:bytes]]
    else
      [-stats[:commits], -stats[:bytes]]
    end
  }.to_h,
  frameworks: frameworks_stats.sort_by { |_, stats| [-stats[:commits], -stats[:repositories]] }.to_h,
  tools: tools_stats.sort_by { |_, stats| [-stats[:commits], -stats[:repositories]] }.to_h,
  unrecognizedDependencies: sorted_unrecognized,
  notes: [
    "Languages with high byte counts but in few repositories might be due to generated code or dependency files.",
    "Commit-level analysis processes diffs using Linguist to exclude generated files before counting language contributions.",
    "CSS stats now include a comprehensive breakdown of vanilla CSS vs Tailwind usage patterns.",
    "Memory optimizations have been added to prevent out-of-memory errors during processing."
  ],
  found_emails: FOUND_EMAILS.to_a
}

# Write the cached stats to disk
cache_path = File.join(Dir.pwd, 'src', 'data', 'github-stats.json')
FileUtils.mkdir_p(File.dirname(cache_path))
File.write(cache_path, JSON.pretty_generate(cached_stats))
log_with_timestamp("Successfully updated GitHub stats cache at #{cache_path}")