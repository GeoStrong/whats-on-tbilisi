# Production Deployment & Launch Guide

**What'sOnTbilisi** — Production Readiness & Launch Plan

---

## Pre-Launch Checklist (Weeks 1–3)

### ✅ Security Hardening

- [x] **Removed `/api/use-secret` endpoint** — Google Maps API key no longer exposed
- [x] **Added authentication to `/api/get-image-signed-url`** — Protected with `withAuth` wrapper
- [x] **Added security headers** — Implemented HSTS, X-Frame-Options, CSP-ready headers in `next.config.ts`
- [ ] **Implement Supabase RLS policies** — Run SQL from `docs/supabase-rls-policies.sql` in Supabase dashboard
  - Ensures row-level security on all tables (profiles, activities, comments, etc.)
  - Prevents unauthorized data access
- [ ] **Add environment variable validation** — Verify all secrets are set before launch
- [ ] **Enable HTTPS enforcement** — Vercel handles this automatically
- [ ] **Configure CORS** — If building mobile apps later, restrict allowed origins

### ✅ Compliance & Legal

- [x] **Privacy Policy** — Live at `/privacy`, covers GDPR/CCPA rights, data retention, third-party services
- [x] **Terms of Service** — Live at `/terms`, covers acceptable use, liability, moderation
- [ ] **Cookie Consent Banner** — Add to [components/general/mainLayout.tsx](../../components/general/mainLayout.tsx) (recommend: `react-cookie-consent`)
- [ ] **Update README** — Add link to Privacy Policy, Terms, and contact email

### ✅ Environment & Secrets

- [x] **Create `.env.example`** — Reference file for all required environment variables
- [ ] **Set GitHub Actions secrets** — Add to repo settings:
  - Production Supabase URL, anon key
  - Cloudflare R2 credentials
  - Google Maps API key
  - Vercel tokens and project IDs
  - (Optional) Sentry DSN, Slack webhook

### ✅ Monitoring & Logging

- [ ] **Integrate Sentry** (recommended for error tracking):
  ```bash
  npm install @sentry/nextjs
  ```
  - Create free account at https://sentry.io/
  - Add initialization in [app/layout.tsx](../../app/layout.tsx)
  - Update [lib/utils/logger.ts](../../lib/utils/logger.ts) to pipe errors to Sentry
  - Set alert for 5+ errors in 1 hour

- [ ] **Set up uptime monitoring** — Use Pingdom or Healthchecks.io
  - Monitor `/api/health` endpoint every 5 minutes
  - Alert on failures

### ✅ Rate Limiting

- [x] **Rate limiter utility created** — `lib/middleware/rateLimiter.ts` ready to use
- [ ] **Apply rate limiting to high-risk endpoints**:
  - `/api/upload-image` — 10 per hour per user
  - `/api/create-activity` — 5 per day per user
  - Auth endpoints — 5 failed attempts per 15 mins
  - See [lib/middleware/rateLimiter.ts](../../lib/middleware/rateLimiter.ts) for implementation

### ✅ CI/CD Pipeline

- [x] **GitHub Actions workflow created** — `.github/workflows/deploy.yml`
- [ ] **Configure workflow secrets** in GitHub repo settings (see file comments)
- [ ] **Test workflow** — Push to `develop` branch, verify staging deployment
- [ ] **Set branch protection rules**:
  - Require CI checks to pass before merge
  - Require code review (recommended: 1 approval)

### ✅ Database & Backups

- [ ] **Enable Supabase backups** — Supabase Pro tier includes daily backups
  - Verify in Supabase dashboard: Settings → Backups
  - Enable Point-In-Time Recovery (PITR) if available

- [ ] **Document backup restoration** — Save recovery procedure to wiki
- [ ] **Test backup restore** in staging environment
- [ ] **Set up R2 bucket versioning** — Enable in Cloudflare dashboard to track image changes

### ✅ Performance & Web Vitals

- [ ] **Run performance audit** — Use Lighthouse in Chrome DevTools:
  - Aim for: LCP < 2.5s, FID < 100ms, CLS < 0.1
  - Optimize images: ensure WebP conversion is working
  - Test with 3G throttling enabled

- [ ] **Monitor Core Web Vitals** — Integrate with Vercel Analytics or Google Search Console
- [ ] **Database query optimization** — Check slow queries in Supabase dashboard
- [ ] **Cache warming strategy** — Plan for popular queries (trending activities, user profiles)

---

## Launch Week (Week 4)

### 📋 Pre-Launch (2 days before)

1. **Final Security Audit**
   ```bash
   # Run security checks
   npm run lint
   npm test
   npm run test:e2e
   ```
   - Ensure all tests pass
   - Check for console warnings/errors

2. **Staging Smoke Test**
   - Sign up with test account
   - Create activity with image upload
   - Join activity
   - Post comments
   - Test all major user flows

3. **Monitor Setup**
   - Sentry project configured and receiving test errors
   - Uptime monitoring active
   - Slack notifications tested

4. **Backup Creation**
   - Manual backup of Supabase database (Settings → Backups)
   - Manual backup of R2 bucket (if configured external sync)

### 🚀 Launch Day

**Recommended: Tuesday 10 AM (not Friday, not weekend)**

#### 1 Hour Before

```bash
# Final health check
curl https://yourapp.vercel.app/api/health
# Should return 200 with status: "ok"

# Verify env vars are set
# Check Vercel dashboard: Settings → Environment Variables
```

#### At Launch

1. **Deploy to production** (via GitHub or Vercel):
   - Merge PR to `main` branch
   - GitHub Actions runs full CI/CD pipeline
   - Deployment completes in ~5 minutes

2. **Monitor immediately** (first 30 minutes):
   - Watch Sentry for errors (should be 0)
   - Check Vercel logs for warnings
   - Monitor `/api/health` uptime (should show 100%)

3. **User communication**:
   - Announce on social media (Twitter, Instagram)
   - Send email to early access list
   - Post on local Tbilisi tech community groups

### 📊 First Week Metrics to Track

- **Error rate** — Should be < 1% (Sentry dashboard)
- **API latency** — p50 < 200ms, p95 < 500ms
- **Sign-ups** — Daily active users (DAU)
- **Feature usage** — Activities created, comments posted, joins
- **Technical issues** — Check logs daily for patterns

### 🔧 On-Call Rotation

- Assign 2–3 people for 24/7 coverage (first week)
- Slack/Discord channel for critical alerts
- Runbook for common issues:
  - Supabase down → contact Supabase support, switch to read-only mode
  - R2 down → temporary fallback to placeholder images
  - Auth broken → check Supabase token expiry

---

## Post-Launch Operations

### 📈 Week 1 Standups

- Review Sentry errors daily
- Monitor database performance (Supabase dashboard)
- Check storage growth (R2)
- Review user feedback and bug reports
- Fix critical bugs immediately (hotfix to `main`)

### 📅 Weekly Maintenance (Ongoing)

1. **Monday: Review Metrics**
   - DAU, feature adoption, retention
   - Error rates and performance
   - User feedback and support tickets

2. **Wednesday: Code Review & Merge**
   - Process PRs from the team
   - Deploy fixes/features to staging first

3. **Friday: Retrospective**
   - What worked? What broke?
   - Plan next week's priorities

### 🔐 Security Checks (Monthly)

- [ ] Review auth logs for suspicious patterns
- [ ] Rotate API keys (Google Maps, R2)
- [ ] Check for unused endpoints
- [ ] Review new dependencies for vulnerabilities
  ```bash
  npm audit
  ```

### 📊 Analytics (Monthly)

- [ ] User growth trends
- [ ] Feature usage breakdown
- [ ] Retention cohorts
- [ ] Geographic distribution
- [ ] Device/browser breakdown

### 🧹 Housekeeping (Monthly)

- [ ] Clean up old Sentry errors (close resolved)
- [ ] Clear old logs
- [ ] Review database storage usage
- [ ] Update dependencies
  ```bash
  npm outdated
  ```

---

## Vercel Deployment Setup

### 1. Connect GitHub Repository

1. Go to [vercel.com](https://vercel.com) → Import Project
2. Select GitHub repository
3. Vercel auto-detects Next.js project
4. Click "Deploy"

### 2. Set Environment Variables in Vercel

**Settings → Environment Variables**, add:

```
NEXT_PUBLIC_SUPABASE_URL = https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = xxx
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY = xxx
R2_ACCOUNT_ID = xxx
R2_ACCESS_KEY_ID = xxx
R2_SECRET_ACCESS_KEY = xxx (marked as Secret)
R2_BUCKET_NAME = xxx
R2_ENDPOINT = https://xxx.r2.cloudflarestorage.com
```

### 3. Configure Branch Rules

**Settings → Git → Branch Rules**

- Production: deploy from `main` (auto-deploy on push)
- Staging: deploy from `develop` (preview URLs)

---

## Supabase Setup for Production

### 1. Create Production Database

1. Go to [supabase.com](https://supabase.com) → New Project
2. Choose region closest to users (EU if serving Georgia)
3. Enable backups (Pro tier: automatic daily)
4. Note URL and anon key

### 2. Enable RLS Policies

Run SQL from [`docs/supabase-rls-policies.sql`](./supabase-rls-policies.sql) in Supabase SQL Editor:

```sql
-- Navigate to: SQL Editor → Create New Query
-- Paste contents of supabase-rls-policies.sql
-- Click "Run"
```

### 3. Set Up Secrets in Supabase

**Settings → Project Settings → Secrets Manager**:

Add R2 credentials and Google Maps key (if needed server-side).

### 4. Test Database Policies

```bash
# In Supabase client code, test:
# 1. Unauthenticated read (should work for public tables)
# 2. Unauthenticated write (should fail)
# 3. User can read all activities (should work)
# 4. User cannot delete other users' activities (should fail)
```

---

## Cloudflare R2 Setup for Production

### 1. Create R2 Bucket

1. Go to Cloudflare dashboard → R2
2. Create bucket (e.g., `whatson-tbilisi-prod`)
3. Note account ID and endpoint URL

### 2. Generate API Token

1. Users & Roles → API Tokens → Create Token
2. Permissions: `Object Read/Write` on bucket
3. Copy token to Vercel env vars

### 3. Enable Bucket Versioning (Optional)

1. R2 → Bucket → Settings → Versioning
2. Enable to track image changes (slight cost increase)

### 4. Set Lifecycle Rules (Recommended)

1. Bucket → Lifecycle Rules
2. Delete orphaned images after 90 days (if activity is deleted)

---

## Google Maps API Setup for Production

### 1. Create GCP Project

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create new project: "WhatsOnTbilisi"
3. Enable: Maps JavaScript API, Geocoding API, Places API

### 2. Create API Key

1. Credentials → Create Credentials → API Key
2. Restrict to:
   - Application type: Browser
   - Allowed referrers: `*.vercel.app`, `whatson-tbilisi.com`

### 3. Set Billing Alert

1. Billing → Budgets & Alerts
2. Set alert for $100/month (reasonable for early-stage)

---

## Monitoring & Alerting Setup

### Sentry (Error Tracking)

```bash
npm install @sentry/nextjs
```

**In `app/layout.tsx`:**

```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
});
```

**Create alerts in Sentry dashboard:**
- Alert on: 5 errors in 1 hour
- Notify: Slack channel #whatson-errors

### Uptime Monitoring (Healthchecks.io)

1. Create check for `/api/health` endpoint
2. Set check interval: 5 minutes
3. Alert on: 2 consecutive failures
4. Notify: Email + Slack

### Vercel Analytics (Built-in)

1. Vercel dashboard → Analytics
2. Monitor: LCP, FID, CLS, FCP
3. Compare production vs staging

---

## Post-Launch v1.1 Features (4–6 weeks after launch)

**Not needed for launch, but plan for:**

- [ ] Email verification for signup
- [ ] Password reset flow
- [ ] Email notifications (activity near you, replies to comments)
- [ ] Advanced search (date range, distance, category filters)
- [ ] User recommendations (similar activities)
- [ ] Moderation dashboard (review flagged content)
- [ ] Analytics dashboard (team can track user growth)
- [ ] Rate limiting (Upstash Redis integration)

---

## Emergency Runbook

### Database Down (Supabase)

1. Check Supabase status page: https://status.supabase.com
2. If regional outage, switch read-only mode temporarily
3. Notify users in header banner
4. Contact Supabase support

**Impact:** Users cannot create/join activities, but can still view.

### Image Storage Down (R2)

1. Check Cloudflare dashboard for outages
2. Display placeholder image while down
3. Retry uploads when service recovers

**Impact:** Images unavailable temporarily, uploads queue until service returns.

### Auth Broken (Supabase Auth)

1. Check Supabase auth logs
2. Verify JWT tokens are still being issued
3. Test login in incognito window

**Impact:** New users cannot sign up, existing sessions may expire.

### High Error Rate (> 5% of requests)

1. Check Sentry dashboard
2. Review recent deployments (rollback if needed)
3. Check database performance (Supabase dashboard)
4. Check R2 storage quota

---

## Contacts & Resources

- **Supabase Support:** https://supabase.com/support (status page linked above)
- **Vercel Support:** https://vercel.com/support
- **Cloudflare Support:** https://support.cloudflare.com
- **Sentry Support:** https://sentry.io/support/

---

## Success Criteria for Launch

✅ **Technical**
- [ ] Zero critical errors (Sentry)
- [ ] API latency p95 < 500ms
- [ ] Database responds in < 100ms
- [ ] Uptime > 99.5%

✅ **User Experience**
- [ ] Users can sign up and create activities
- [ ] Images upload and display correctly
- [ ] Map loads without errors
- [ ] No 404 errors on main pages

✅ **Compliance**
- [ ] Privacy Policy accessible
- [ ] Terms of Service accepted on signup
- [ ] GDPR right-to-delete works
- [ ] Data exports work

---

Last updated: January 14, 2026
