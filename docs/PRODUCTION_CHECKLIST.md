% Production Readiness Checklist for What'sOnTbilisi

# Production Readiness Checklist

**Status: READY FOR IMPLEMENTATION**  
**Last Updated:** January 14, 2026  
**Target Launch:** 4-6 weeks from now

---

## Phase 1: Security Hardening (✅ STARTED)

### Critical Security Issues (COMPLETED ✅)

- [x] Delete `/api/use-secret` endpoint (exposed Google Maps API key)
- [x] Add `withAuth` to `/api/get-image-signed-url`
- [x] Add security headers to `next.config.ts` (HSTS, X-Frame-Options, X-XSS-Protection, etc.)
- [x] Create rate limiter utility in `lib/middleware/rateLimiter.ts`

### Required Before Launch (⏳ TODO)

- [ ] **Enable Supabase RLS Policies**

  - Run SQL from `docs/supabase-rls-policies.sql` in Supabase dashboard
  - Test policies in staging: verify users can't access others' data
  - Impact: Database-level security for all tables

- [ ] **Apply Rate Limiting to API Routes**

  - `/api/upload-image` — 10 per hour per user (prevent storage spam)
  - `/api/create-activity` — 5 per 24 hours per user (prevent spam)
  - Auth endpoints — 5 failed attempts per 15 mins
  - See `lib/middleware/rateLimiter.ts` for example
  - TODO: For distributed deployments, migrate to Upstash Redis

- [ ] **Configure CORS Policy**

  - If planning mobile app, restrict allowed origins (don't use `*`)
  - Add CORS middleware to API routes

- [ ] **Add Content Security Policy (CSP)**
  - Add to `next.config.ts` headers (currently ready but permissive)
  - Tighten as needed after testing

---

## Phase 2: Compliance & Legal (✅ MOSTLY DONE)

### Completed ✅

- [x] Create Privacy Policy page (`app/privacy/page.tsx`)

  - Covers GDPR/CCPA rights (access, deletion, export)
  - Lists third-party services (Supabase, R2, Google Maps, Sentry, Vercel)
  - Documents data retention (30 days post-deletion)

- [x] Create Terms of Service page (`app/terms/page.tsx`)

  - Covers acceptable use (no spam, harassment, NSFW)
  - Documents moderation policies
  - Limits liability

- [x] Create `.env.example` file
  - Reference for all required environment variables
  - Add to documentation for team onboarding

### Before Launch (⏳ TODO)

- [ ] **Add Cookie Consent Banner**

  - Required for GDPR compliance (EU users)
  - Recommend: `react-cookie-consent` package
  - Add to `components/general/mainLayout.tsx`
  - Track: session cookie (essential), analytics (optional)

- [ ] **Implement Data Export Feature**

  - Add button in profile settings: "Download My Data"
  - Export as JSON: profile info, activities, comments, follows
  - Compliance: GDPR Article 20 (right to portability)

- [ ] **Implement Data Deletion Feature**

  - Add button in profile settings: "Delete My Account"
  - Delete: profiles table record, all user data
  - Keep: user content (activities, comments) but disassociate from profile
  - Process: soft-delete (flag for 30-day grace period), then hard-delete

- [ ] **Update Footer & Navigation**

  - Add links to Privacy (`/privacy`), Terms (`/terms`)
  - Add contact email: `privacy@whatson-tbilisi.com`

- [ ] **Add Email to Privacy/Support**
  - Set up email: `privacy@whatson-tbilisi.com`, `support@whatson-tbilisi.com`
  - Can be aliases to team email for now
  - Commit to responding within 48 hours

---

## Phase 3: Environment & Deployment (⏳ IN PROGRESS)

### Infrastructure Setup

- [ ] **Vercel Deployment**

  - [ ] Connect GitHub repository to Vercel
  - [ ] Set environment variables in Vercel dashboard:
    - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
    - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
    - `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_ENDPOINT`
    - (Optional) `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_AUTH_TOKEN`
  - [ ] Configure branch rules:
    - `main` → production auto-deploy
    - `develop` → staging preview

- [ ] **Supabase Production Database**

  - [ ] Create new Supabase project (EU region preferred for Georgia users)
  - [ ] Enable automatic backups (Pro tier includes daily backups + PITR)
  - [ ] Note: URL and anon key (add to Vercel env)
  - [ ] Run RLS policies SQL (see above)
  - [ ] Test connection from staging environment

- [ ] **Cloudflare R2 Bucket**

  - [ ] Create R2 bucket (e.g., `whatson-tbilisi-prod`)
  - [ ] Generate API token with Object Read/Write permissions
  - [ ] Add credentials to Vercel env
  - [ ] (Optional) Enable bucket versioning and lifecycle rules

- [ ] **Google Maps API**
  - [ ] Create GCP project
  - [ ] Enable: Maps JavaScript API, Geocoding API, Places API
  - [ ] Create API key, restrict to domain
  - [ ] Set billing alert ($100/month recommended for early stage)

### CI/CD Pipeline (⏳ TODO)

- [x] Create GitHub Actions workflow (`.github/workflows/deploy.yml`)

  - Runs: linting, unit tests, E2E tests, build
  - Deploys to staging on `develop` push
  - Deploys to production on `main` push
  - (Optional) Sends Slack notifications

- [ ] Configure GitHub repo secrets for workflow:

  ```
  VERCEL_TOKEN
  VERCEL_ORG_ID
  VERCEL_PROJECT_ID (production)
  VERCEL_PROJECT_ID_STAGING (staging)
  NEXT_PUBLIC_SUPABASE_URL
  NEXT_PUBLIC_SUPABASE_ANON_KEY
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  R2_ACCOUNT_ID
  R2_ACCESS_KEY_ID
  R2_SECRET_ACCESS_KEY
  R2_BUCKET_NAME
  R2_ENDPOINT
  SLACK_WEBHOOK_URL (optional)
  ```

- [ ] Test CI/CD pipeline:
  - Push to `develop`, verify staging deploys
  - Push to `main`, verify production deploys
  - Verify tests run before deployment

---

## Phase 4: Monitoring & Logging (⏳ IN PROGRESS)

### Error Tracking (Sentry)

- [ ] Create Sentry account (free tier sufficient for early stage)

  - Go to https://sentry.io
  - Create new project → Next.js
  - Copy DSN

- [ ] Integrate Sentry into app:

  ```bash
  npm install @sentry/nextjs
  ```

  - Initialize in `app/layout.tsx`
  - Update `lib/utils/logger.ts` to pipe errors to Sentry
  - Test: trigger error in dev, verify it appears in Sentry dashboard

- [ ] Configure Sentry alerts:
  - Create alert: trigger on 5+ errors in 1 hour
  - Notify: Slack channel (#errors or #alerts)
  - Review errors daily during first week

### Uptime Monitoring

- [ ] Set up uptime monitoring service (Pingdom, Healthchecks.io, or UptimeRobot)

  - Monitor `/api/health` endpoint every 5 minutes
  - Alert on 2+ consecutive failures (10+ minute downtime)
  - Notify: Email + Slack

- [ ] Extend `/api/health` endpoint:
  - Currently checks Supabase and R2 config
  - TODO: Actually test Supabase auth token refresh
  - TODO: Actually test R2 upload/download (write temp file, delete)

### Analytics (Vercel + Google Search Console)

- [ ] Enable Vercel Analytics:

  - Auto-enabled on deployment
  - Monitor: LCP, FID, CLS, FCP
  - Track Core Web Vitals daily

- [ ] (Optional) Integrate user analytics:
  - Recommend: Mixpanel or Plausible (privacy-friendly)
  - Track: signups, activity creation, joins, comments
  - Setup after launch (v1.1)

---

## Phase 5: Database & Backups (⏳ IN PROGRESS)

### Supabase Database

- [ ] Enable automated backups (Pro tier):

  - Supabase dashboard → Settings → Backups
  - Check daily backups are enabled
  - Enable PITR (Point-In-Time Recovery) if available

- [ ] Document backup restoration:

  - Save recovery procedure to wiki
  - Include: how to access backups, restore process, estimated recovery time
  - Shared with team

- [ ] Test backup restore in staging:
  - Restore a backup to temporary database
  - Verify data integrity
  - Estimate recovery time

### Cloudflare R2

- [ ] Enable R2 bucket versioning (optional):

  - Allows tracking image changes and recovery
  - Slight cost increase (~$0.02/GB stored versions)
  - Recommended: enable during launch

- [ ] Set up lifecycle rules (optional):

  - Auto-delete orphaned images 90 days after activity deletion
  - Reduces storage costs

- [ ] Test R2 uploads/downloads:
  - Verify signed URL generation works
  - Test image access from public URL
  - Confirm WebP/AVIF conversion working

---

## Phase 6: Testing & Quality Assurance (⏳ TODO)

### Unit & Integration Tests

- [ ] Run full test suite:

  ```bash
  npm test -- --coverage
  ```

  - Verify all tests pass
  - Check coverage > 50% (baseline requirement)

- [ ] Test critical user flows (manual):
  - [ ] Sign up with email
  - [ ] Log in with email/password
  - [ ] Create activity with image upload
  - [ ] Join activity
  - [ ] Post comment
  - [ ] Delete activity (if owner)
  - [ ] Follow user
  - [ ] Filter by category
  - [ ] Pagination works

### E2E Tests

- [ ] Run Playwright E2E tests:

  ```bash
  npm run test:e2e
  ```

  - Verify all E2E tests pass
  - Add tests for critical flows if missing

- [ ] Manual staging smoke test:
  - Create test account in staging
  - Test all features with real data
  - Test on mobile (iOS + Android)

### Performance Testing

- [ ] Run Lighthouse audit:

  - Desktop: target LCP < 2.5s, FID < 100ms, CLS < 0.1
  - Mobile: target LCP < 4s, FID < 100ms, CLS < 0.1
  - Fix major issues before launch

- [ ] Load test (optional but recommended):
  - Simulate 50–100 concurrent users
  - Monitor database latency
  - Verify no errors under load

### Security Testing

- [ ] Verify RLS policies:

  - [ ] Unauthenticated user cannot read private data ✓
  - [ ] User cannot update other users' profiles ✓
  - [ ] User cannot delete other users' activities ✓
  - [ ] Activity creator can delete comments on their activity ✓

- [ ] Test auth flows:
  - [ ] Invalid credentials rejected
  - [ ] Rate limiting prevents brute force (5 attempts per 15 mins)
  - [ ] Session tokens expire and refresh
  - [ ] CORS blocks cross-origin requests (if configured)

---

## Phase 7: Documentation & Runbooks (⏳ TODO)

### Production Docs

- [x] Create `docs/LAUNCH.md` — comprehensive launch guide
- [x] Create `docs/supabase-rls-policies.sql` — RLS setup

- [ ] Create `docs/RUNBOOK.md` — emergency procedures:

  - Database down
  - Image storage down
  - Auth broken
  - High error rate
  - Storage quota exceeded

- [ ] Create `docs/POSTMORTEM_TEMPLATE.md` — for incident review:

  - What went wrong?
  - Root cause?
  - How to prevent?
  - Action items?

- [ ] Add to README:
  - Link to Privacy Policy, Terms of Service
  - Link to Sentry dashboard (private link)
  - Link to Vercel dashboard (private link)
  - Tech stack & deployment info

### Team Onboarding

- [ ] `.env.example` file created (✓ done)
- [ ] README updated with setup instructions
- [ ] Add to repo wiki:
  - How to deploy hotfix
  - How to access databases
  - How to reset staging environment
  - Emergency contacts

---

## Launch Week Checklist (Week 4)

### 2 Days Before Launch

- [ ] **Final Security Audit**

  ```bash
  npm run lint
  npm test
  npm run test:e2e
  ```

  - Ensure all tests pass
  - Zero console errors

- [ ] **Staging Smoke Test**

  - Create account → create activity → join → comment
  - Verify all features work end-to-end
  - Test on mobile

- [ ] **Monitor Setup**

  - Sentry: project created and receiving test errors
  - Uptime monitoring: `/api/health` endpoint live
  - Slack notifications: test alert delivery
  - Vercel Analytics: dashboard accessible

- [ ] **Final Backup**
  - Manual backup of Supabase (Settings → Backups)
  - Verify backup completed successfully

### Launch Day (Tuesday 10 AM)

- [ ] **1 Hour Before Launch**

  - Final health check: `curl https://app.vercel.app/api/health`
  - Verify all env vars set in Vercel
  - Verify Sentry DSN correct
  - Team on standby in Slack

- [ ] **Deploy to Production**

  - Merge PR to `main` branch
  - GitHub Actions runs CI/CD pipeline
  - Monitor deployment progress in Vercel dashboard
  - Should complete in ~5 minutes

- [ ] **Immediate Monitoring (First 30 mins)**

  - Watch Sentry errors (should be 0)
  - Check Vercel logs for warnings
  - Test `/api/health` uptime
  - Spot-check user interface

- [ ] **User Communication**
  - Announce on social media (Twitter, Instagram)
  - Send email to early access list
  - Post in Tbilisi tech communities
  - Update website banner

### First Week

- [ ] **Daily Standups**

  - Review Sentry errors
  - Check Vercel logs
  - Monitor database performance
  - Review user feedback

- [ ] **On-Call Rotation**
  - 2–3 people for 24/7 coverage
  - Quick response time for critical issues
  - Escalation path: on-call → team lead → CTO

---

## Post-Launch: First Month

### Week 1: Monitoring & Hotfixes

- [ ] Daily error review (Sentry)
- [ ] Fix critical bugs immediately (hotfix to `main`)
- [ ] Monitor database latency
- [ ] Check storage growth (R2)
- [ ] Review user feedback

### Week 2-4: Stabilization

- [ ] Monitor key metrics:

  - Daily active users (DAU)
  - Error rate (target: < 1%)
  - API latency p95 (target: < 500ms)
  - Uptime (target: > 99.5%)

- [ ] Weekly retrospectives
- [ ] Plan v1.1 features (email, advanced search, recommendations)
- [ ] Security audit: review logs, update dependencies

### Month 2+: Optimization & Iteration

- [ ] Analyze user behavior (analytics)
- [ ] Optimize slow queries (Supabase)
- [ ] Plan feature releases
- [ ] Scale if needed (database connection limits, R2 bandwidth)

---

## Success Criteria

### Technical ✅

- [x] No SQL injection vulnerabilities
- [x] Rate limiting prevents abuse
- [x] RLS policies protect user data
- [x] Security headers implemented
- [ ] Error tracking (Sentry) integrated
- [ ] Uptime monitoring active
- [ ] CI/CD pipeline working
- [ ] Load test passes (50+ concurrent users)

### User Experience ✅

- [ ] Sign up flow works
- [ ] Activity creation + image upload works
- [ ] Map displays correctly
- [ ] Comments display correctly
- [ ] No major console errors
- [ ] Mobile-responsive (tested on iOS + Android)

### Compliance ✅

- [ ] Privacy Policy linked and accessible
- [ ] Terms of Service linked and accessible
- [ ] GDPR right-to-delete implemented
- [ ] Data export feature implemented
- [ ] Cookie consent banner (if needed)

### Performance ✅

- [ ] Lighthouse score: 80+ (all categories)
- [ ] API latency p95 < 500ms
- [ ] Database queries < 100ms
- [ ] Image load time < 2s
- [ ] Map load time < 3s

---

## Rollback Plan

If critical issues found post-launch:

1. **Immediate Rollback** (< 5 mins):

   ```bash
   # Revert to previous commit
   git revert HEAD
   git push origin main
   # Vercel auto-deploys previous version
   ```

2. **Database Rollback** (< 15 mins):

   - Restore Supabase backup from Settings → Backups
   - Test connection
   - Announce maintenance window to users

3. **Feature Flag** (preventive):
   - For future: use feature flags to disable broken features without full rollback
   - Recommend: LaunchDarkly or Vercel Feature Flags

---

## Contacts & Escalation

| Issue              | Contact            | Response Time |
| ------------------ | ------------------ | ------------- |
| Supabase down      | Supabase support   | 24 hours      |
| Vercel down        | Vercel support     | 24 hours      |
| R2/Cloudflare down | Cloudflare support | 24 hours      |
| Critical bug       | On-call engineer   | 15 minutes    |
| Data breach        | CTO + Legal        | Immediate     |

---

## Notes

- **Team Size:** Recommend 2–3 people on-call for first week
- **Timeline:** 4–6 weeks from now to production-ready
- **Cost Estimate:** ~$50–100/month (Vercel, Supabase Pro, R2, Sentry, monitoring)
- **Scaling:** Plan for 1,000+ DAU without major changes; review at 5,000+ DAU

---

**Last Updated:** January 14, 2026  
**Next Review:** Before launch
