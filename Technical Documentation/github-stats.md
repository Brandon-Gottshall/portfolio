# GitHub Stats Configuration

## Language Exclusions

Languages excluded from stats as they are generated files or not author-written:

- SVG, JSON with Comments, Dotenv, Diff, Prisma
- Gemfile.lock, Gradle, Objective-C, Starlark
- Java, robots.txt, INI, XML Property List
- Procfile, Java Properties, vCard, PLpgSQL
- C++, HTML+ERB

## Tools Organization

- **Markup & Configuration**: Markdown, YAML, JSON, XML, TOML
- **Linting & Formatting**: ESLint, Prettier
- **Hosting & Deployment**: Vercel, PM2, Netlify
- **Infrastructure**: Firebase, Kubernetes, Docker, Terraform, AWS
- **CSS Frameworks**: Tailwind CSS
- **Database Tools**: Drizzle, Supabase

## Chart Implementation

The GitHub statistics visualization uses Chart.js with a custom factory pattern:

1. **Data Flow**:
   - Stats data from GitHub API → Processed and cached → Visualized with Chart.js

2. **Chart Types**:
   - Doughnut charts for language/framework distribution
   - Interactive tooltips with detailed statistics

3. **Accessibility**:
   - Color schemes optimized for light/dark modes
   - Text alternatives for screen readers
   - Keyboard navigation support

4. **Technical Implementation**:
   - Factory pattern for chart creation (`createDoughnutChart`)
   - Type-safe event handlers
   - Clean component structure separating data and visualization
