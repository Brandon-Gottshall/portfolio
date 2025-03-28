# Chart.js Implementation Guide

## Overview

This document outlines our approach to Chart.js integration with TypeScript and React in our Next.js application.

## Key Components

### 1. Type Definitions (`src/types/chart.d.ts`)

- Custom type declarations for Chart.js
- Focused subset of Chart.js types needed for our implementation
- Explicit interface for chart instances and events

### 2. Chart Factory (`src/lib/charts/createChart.ts`)

- Factory function for consistent chart creation
- Handles type conversion in a centralized location
- Manages event binding
- Provides consistent default options

### 3. Component Integration

- Uses the factory pattern for chart creation
- Maintains clean component code
- Properly handles cleanup on unmount

## Best Practices

### Type Safety

- Use the defined chart instance types rather than generic `Chart` types
- Add null checks before accessing chart methods
- Use early returns for error cases
- Type event handlers explicitly

### Performance

- Clean up chart instances on component unmount
- Minimize re-renders and chart recreation
- Use proper memoization for chart data and options

### Accessibility

- Ensure charts have appropriate ARIA attributes
- Provide text alternatives for chart data
- Support keyboard navigation where possible

## Common Issues and Solutions

### Type Errors

- When encountering "property does not exist" errors, check if you're using the correct chart instance type
- For generic type errors, use the specific chart type (e.g., `DoughnutChartInstance`) rather than the generic `Chart`
- Keep type assertions (`as`) in the factory function, not in components

### Event Handling

- Use the event handlers defined in `DoughnutEventHandlers`
- Ensure proper cleanup of event listeners
- Consider debouncing for frequent events (e.g., hover, resize)

### Theming

- Use the `isDarkMode` parameter for theme-aware charts
- Update charts when theme changes using useEffect dependencies
