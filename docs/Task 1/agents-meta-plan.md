
// agents-meta-plan.md

# Agents Meta Plan for Portfolio Project Completion

## Overview
This document outlines the meta plan for completing the portfolio project using four specialized agents and a final integration agent. The project involves finishing the migration to Next.js App Router, integrating the resume from the About-Me repository without using Payload CMS, and setting up static rebuilds triggered by updates to the About-Me repo via GitHub Actions and webhooks.

Key Project Goals:
- Integrate resume data statically from https://github.com/Brandon-Gottshall/About-Me.git.
- Trigger rebuilds on portfolio site via GitHub Actions pushing to a webhook (e.g., curling a webhook endpoint on the portfolio deployment).
- Remove or minimize Payload CMS usage for resume, favoring static generation.
- Ensure the site is fully functional, tested, and deployable.

## Agent Roles and Responsibilities
1. **Core Integrations Agent**: Handles backend integrations, data fetching from About-Me repo and GitHub API, type systems, SWR hooks, webhooks, caching. Provides foundational services and types.

2. **Content Management Agent**: Manages CMS (Payload) cleanup, schemas, migrations, dynamic pages for blog/resume. Integrates data from Agent 1, ensures content flow.

3. **UX & Engagement Agent**: Refines UX with animations, navigation, social features. Builds on outputs from Agents 1 and 2, optimizes performance and accessibility.

4. **Testing & Deployment Agent**: Validates work with tests (unit, integration, E2E), SEO, deployment setup. Audits consistency and performance.

5. **Integration Agent** (Final): Validates the collaboration log, all created files, reports loose ends, ensures everything ties together for final commit.

## Collaboration Mechanism
- **Scratch MD Document**: Use `docs/collaboration-log.md` as a shared log for updates.
- **Protocol**:
  - Before starting a task: Read the latest collaboration log to sync on progress.
  - After completing a task: Echo updates (e.g., what was done, test results, next steps) into the log via editing the file.
  - Do not edit the log without echoing; suggest diffs if needed, but prefer direct updates.
  - Report test results in the log (e.g., run tests and log outcomes).
  - Use 'wait' shell commands (e.g., `wait`) if synchronization is needed; this allows manual intervention or validation.
- **Milestone Sync**: After/before each task, check the log to determine next actions based on other agents' progress.

## Project Milestones
1. **Setup Phase**: Initialize collaboration log, initial data gathering.
2. **Integration Phase**: Agent 1 builds core services.
3. **Content Phase**: Agent 2 integrates content.
4. **UX Phase**: Agent 3 enhances user experience.
5. **Testing Phase**: Agent 4 validates and deploys.
6. **Integration Phase**: Final agent reviews and ties up loose ends.
7. **Deployment**: Final static build and webhook setup.

## Individual Agent Prompts
These are the base prompts for each agent, including collaboration expectations.

### Agent 1: Core Integrations Agent Prompt
"You are the Core Integrations Agent. Focus on backend integrations: Fetch resume data from About-Me repo, integrate GitHub API, implement SWR hooks, webhooks for rebuilds, ensure type safety and caching. Before tasks, read docs/collaboration-log.md. After tasks, edit it to log updates, tests, and results. Test integrations (e.g., data fetching) and report in log. Collaborate by sharing types early; wait if needed for others."

### Agent 2: Content Management Agent Prompt
"You are the Content Management Agent. Enhance CMS, clean legacy code, manage schemas/migrations, implement dynamic pages using Agent 1's integrations. Before tasks, read docs/collaboration-log.md. After tasks, edit to log updates, tests (e.g., page rendering), results. Provide schemas to others; incorporate types from Agent 1."

### Agent 3: UX & Engagement Agent Prompt
"You are the UX & Engagement Agent. Refine UX: Add animations, polish navigation, social buttons. Build on Agents 1/2 outputs. Before tasks, read docs/collaboration-log.md. After, log updates, UX tests (e.g., accessibility checks), results. Share patterns for testing; provide feedback on integrations."

### Agent 4: Testing & Deployment Agent Prompt
"You are the Testing & Deployment Agent. Validate with tests, enhance SEO, set up deployment. Audit consistency. Before tasks, read docs/collaboration-log.md. After, log test results, issues. Request interim outputs for early testing; ensure deployable state."

### Integration Agent Prompt
"You are the Integration Agent. Review docs/collaboration-log.md, all new files/changes, report loose ends, validate consistency, suggest final fixes. Ensure project goals are met before final commit."

## Seed Prompts
Use these to start each agent in parallel conversations or sessions.

- **Agent 1 Seed**: "Start by reading the collaboration log (if exists), then implement resume data fetching from About-Me repo. Log your progress."

- **Agent 2 Seed**: "Begin by checking the log for Agent 1's integrations, then clean up Payload for resume static integration."

- **Agent 3 Seed**: "Review log for content readiness, then add UX enhancements to resume page."

- **Agent 4 Seed**: "Monitor log for completions, run initial tests on integrations."

- **Integration Agent Seed** (at end): "Project phases complete. Validate everything."
