# Development Patterns

## Component Structure

- Using ShadCN UI components with custom styling
- ProjectCard pattern for consistent project display
- Responsive layout patterns using Tailwind CSS

## Data Fetching

- Sanity CMS integration for projects and blog content
- GitHub stats fetching via Vercel function (planned)

## Styling Patterns

- Dark/Light mode theming using next-themes
- Consistent color palette using CSS variables
- Responsive design breakpoints
- Animation patterns using Framer Motion

## Type Patterns

### Library Integration
- Factory pattern for complex third-party libraries (e.g., Chart.js)
- Centralized type assertions in factory functions
- Module augmentation for extending third-party types
- Custom type definitions for focused library usage

### Type Refinement Strategy
- Incremental type improvements with validation at each step
- Core data structures and interfaces defined first
- Factory patterns for complex initialization
- Type-safe event handling with explicit interfaces

## Factory Patterns

### Chart.js Factory
- Centralized chart creation and configuration
- Type-safe event binding
- Consistent default options
- Theme-aware rendering
- Proper cleanup on unmount
