# Production Deployment Guide

## Required Environment Variables

### Database Configuration
```
DATABASE_URL=postgresql://username:password@host:port/database
```

### Payload CMS Configuration
```
PAYLOAD_SECRET=your-super-secret-jwt-key-here
NEXT_PUBLIC_SERVER_URL=https://your-domain.com
PAYLOAD_PUBLIC_SERVER_URL=https://your-domain.com
```

### Site Configuration
```
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_DISABLE_PAYLOAD=false
```

### GitHub Integration (CRITICAL for About-Me Integration)
```
GITHUB_WEBHOOK_SECRET=your-github-webhook-secret
```

**⚠️ IMPORTANT**: The `GITHUB_WEBHOOK_SECRET` is REQUIRED for the enhanced About-Me integration to work properly. This secret:
- Validates webhook signatures from GitHub using HMAC-SHA256
- Prevents unauthorized cache clearing requests
- Must match the secret configured in your GitHub repository webhook settings

### Runtime Configuration
```
NODE_ENV=production
```

## Deployment Steps

### 1. Database Setup
- Set up PostgreSQL database (recommended: Neon, Supabase, or Railway)
- Run migrations: `bun run db:push`

### 2. Environment Configuration
- Set all required environment variables in your deployment platform
- **CRITICAL**: Configure `GITHUB_WEBHOOK_SECRET` to match your GitHub webhook

### 3. GitHub Webhook Setup
- Go to your About-Me repository settings
- Add webhook: `https://your-domain.com/api/webhooks/about-me`
- Set content type: `application/json`
- Set secret to match your `GITHUB_WEBHOOK_SECRET` environment variable
- Select events: "Push" events to main branch

### 4. Build and Deploy
```bash
bun run build
bun run start
```

### 5. Verify Deployment
- Test webhook endpoint: Should return 401 without proper signature
- Test resume page: Should show proper error handling if GitHub API fails
- Check cache behavior: Multiple requests should benefit from caching

## Enhanced About-Me Integration Features

### Rate Limiting & Retry Logic
- Exponential backoff for failed GitHub API requests
- Handles 429 rate limit responses with proper retry delays
- Maximum 3 retry attempts with increasing delays

### Multi-Layer Caching
- **Server-side cache**: 5-30 minute TTL for API responses
- **Client-side cache**: 1 hour localStorage fallback
- **Static fallback**: Hardcoded resume data for complete failures

### Security
- HMAC-SHA256 webhook signature validation
- Timing-safe signature comparison
- Unauthorized request logging and blocking

### Error Handling
- Specific error types for different failure scenarios
- Graceful degradation with cached/fallback data
- User-friendly error messages

## Production Monitoring

### Key Metrics to Monitor
- GitHub API response times and success rates
- Cache hit/miss ratios
- Webhook validation success/failure rates
- Resume page load times

### Expected Performance
- Cache hits: <2s load time
- Fresh API calls: <5s load time
- Fallback scenarios: <1s load time

## Troubleshooting

### Common Issues
1. **Webhook 401 errors**: Check `GITHUB_WEBHOOK_SECRET` configuration
2. **Resume data not updating**: Verify webhook is triggering cache clears
3. **High API usage**: Confirm caching is working properly
4. **Error messages**: Check server logs for specific failure types