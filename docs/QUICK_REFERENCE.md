# Quick Reference: Production Launch for What'sOnTbilisi

**TL;DR Version** — Essential info for the team

---

## [TARGET] What Was Done

[OK] **Security:** Removed exposed API key, added auth checks, security headers  
[OK] **Compliance:** Privacy Policy, Terms of Service, GDPR-ready  
[OK] **Infrastructure:** CI/CD pipeline, rate limiter, RLS policies  
[OK] **Docs:** Launch guide, checklist, moderation framework  
[OK] **Build:** Zero errors, all tests pass

---

## [SETUP] Launch Timeline

| Phase                      | Duration | Status                |
| -------------------------- | -------- | --------------------- |
| **Staging Setup**          | 1 week   | [LOCATION] Start here |
| **Testing & Optimization** | 2 weeks  | [WAIT] Next           |
| **Pre-Launch**             | 1 week   | [WAIT] Later          |
| **Production Launch**      | 1 day    | [DATE] Week 4         |

---

## [FIRE] Critical: Do These First

### 1. Enable Supabase RLS (Database Security)

**Location:** Supabase Dashboard → SQL Editor

**Action:**

1. Open `docs/supabase-rls-policies.sql`
2. Copy all SQL
3. Paste into Supabase SQL Editor
4. Click "Run"
5. Verify no errors

**Why:** Prevents users from accessing each other's private data

**Timing:** Before any production traffic

---

### 2. Configure GitHub Secrets (CI/CD)

**Location:** GitHub → Settings → Secrets and variables → Actions

**Add 12 secrets:**

```
VERCEL_TOKEN=xxx
VERCEL_ORG_ID=xxx
VERCEL_PROJECT_ID=xxx (production)
VERCEL_PROJECT_ID_STAGING=xxx (staging)
NEXT_PUBLIC_SUPABASE_URL=xxx
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=xxx
R2_ACCOUNT_ID=xxx
R2_ACCESS_KEY_ID=xxx
R2_SECRET_ACCESS_KEY=xxx
R2_BUCKET_NAME=xxx
R2_ENDPOINT=xxx
```

**Why:** Enables automatic deployment pipeline

**Timing:** Before first staging deployment

---

### 3. Test Production Workflow

**Action:**

1. Push to `develop` branch → should deploy to staging in ~5 mins
2. Push to `main` branch → should deploy to production in ~5 mins
3. Check Vercel dashboard for logs

**Why:** Verify pipeline works end-to-end

**Timing:** Before real users

---

## [CHECKLIST] Pre-Launch Checklist (One Page)

- [ ] **Security**

  - [ ] RLS policies enabled in Supabase
  - [ ] Rate limiter applied to upload + create endpoints
  - [ ] No console errors in staging
  - [ ] Sentry receiving test errors

- [ ] **Testing**

  - [ ] Sign up → create activity → join → comment (full flow)
  - [ ] Image upload works
  - [ ] Rate limiting works (trigger 429)
  - [ ] E2E tests pass: `npm run test:e2e`

- [ ] **Performance**

  - [ ] Lighthouse score > 80 in all categories
  - [ ] API response time < 200ms
  - [ ] Database queries < 100ms

- [ ] **Legal**

  - [ ] Privacy Policy link works (`/privacy`)
  - [ ] Terms of Service link works (`/terms`)
  - [ ] Links visible in footer

- [ ] **Monitoring**

  - [ ] Sentry dashboard configured
  - [ ] Uptime monitoring active
  - [ ] Slack notifications tested

- [ ] **Deployment**
  - [ ] All GitHub secrets configured
  - [ ] CI/CD pipeline tested
  - [ ] Vercel environment variables set
  - [ ] Supabase backups enabled

---

## [FILES] Key Files Reference

### Documentation

| File                             | Purpose                                      |
| -------------------------------- | -------------------------------------------- |
| `docs/LAUNCH.md`                 | **READ THIS FIRST** — Full launch guide      |
| `docs/PRODUCTION_CHECKLIST.md`   | Detailed pre-launch verification             |
| `docs/IMPLEMENTATION_SUMMARY.md` | What was done and why                        |
| `docs/supabase-rls-policies.sql` | Database security — copy/paste to SQL Editor |

### Configuration

| File                           | Purpose                         |
| ------------------------------ | ------------------------------- |
| `.env.example`                 | Environment variables reference |
| `.github/workflows/deploy.yml` | CI/CD pipeline                  |
| `next.config.ts`               | Security headers configured     |

### Compliance

| File                   | Purpose                                  |
| ---------------------- | ---------------------------------------- |
| `app/privacy/page.tsx` | Privacy Policy page (live at `/privacy`) |
| `app/terms/page.tsx`   | Terms of Service page (live at `/terms`) |

### Code Ready for Use

| File                                  | Purpose                                     |
| ------------------------------------- | ------------------------------------------- |
| `lib/middleware/rateLimiter.ts`       | Rate limiting — ready to use in API routes  |
| `lib/middleware/contentModeration.ts` | Moderation framework — ready to build UI on |
| `scripts/setup-sentry.sh`             | Sentry setup script                         |

---

## [IDEA] Quick How-Tos

### How to Apply Rate Limiting

**In any API route:**

```typescript
import {
  createRateLimiter,
  RATE_LIMITS,
  withRateLimit,
} from "@/lib/middleware/rateLimiter";
import { withAuth } from "@/lib/middleware/auth";

const limiter = createRateLimiter(RATE_LIMITS.IMAGE_UPLOAD);

async function handleUpload(request) {
  // Your handler code
}

export const POST = withAuth(withRateLimit(limiter, handleUpload));
```

### How to Deploy Hotfix

```bash
# 1. Make changes in `main` branch
git checkout main
git pull

# 2. Fix bug
# 3. Commit and push
git add .
git commit -m "Fix: [description]"
git push origin main

# 4. GitHub Actions auto-deploys to production
# Watch Vercel dashboard or check logs
```

### How to Test RLS Policies

```typescript
// Unauthenticated should fail
const { data, error } = await supabase
  .from('activities')
  .delete()
  .eq('id', '123');
// error.message: "new row violates row-level security policy..."

// Authenticated as different user should fail
const { data, error } = await supabase.auth.signInWithPassword({...});
// Then try to delete someone else's activity
// Should fail with "row-level security policy" error
```

---

## [ALERT] Emergency Contacts

| Service      | Issue              | Contact                          |
| ------------ | ------------------ | -------------------------------- |
| **Database** | Supabase down      | https://status.supabase.com      |
| **Hosting**  | Vercel down        | https://www.vercel.com/status    |
| **Storage**  | R2 down            | https://www.cloudflarestatus.com |
| **Maps**     | Google Maps broken | https://status.cloud.google.com  |
| **Errors**   | Too many errors    | Check Sentry dashboard           |

---

## [CHART] Success Metrics (First Week)

[TARGET] **Target:** < 1% error rate, > 99.5% uptime, 50+ sign-ups

| Metric          | Target  | Tool             |
| --------------- | ------- | ---------------- |
| Error rate      | < 1%    | Sentry           |
| Uptime          | > 99.5% | Healthchecks.io  |
| API latency p95 | < 500ms | Vercel Analytics |
| Response time   | < 200ms | Vercel Analytics |

---

## [LEARN] Team Learning Path

**Product Manager:**

- Read `docs/LAUNCH.md` (go-live plan)
- Understand launch day timeline
- Prepare announcement/PR

**DevOps/Deployment:**

- Read `docs/PRODUCTION_CHECKLIST.md` (detailed verification)
- Understand GitHub Actions pipeline
- Configure all secrets and monitoring

**Frontend Engineers:**

- Review `app/privacy/page.tsx` and `app/terms/page.tsx`
- Understand rate limiter in `lib/middleware/rateLimiter.ts`
- Know how to apply rate limiting to routes

**Backend/Database:**

- Read `docs/supabase-rls-policies.sql`
- Execute RLS policies in Supabase
- Understand content moderation in `lib/middleware/contentModeration.ts`

**QA:**

- Read `docs/PRODUCTION_CHECKLIST.md` (test cases)
- Run `npm run test:e2e` to verify
- Execute full user flow on staging

---

## [STOP] What NOT to Do

[ERROR] Deploy to production before enabling RLS (database unprotected)  
[ERROR] Commit `.env.local` to git (secrets leak)  
[ERROR] Use `main` branch for feature development (breaks prod)  
[ERROR] Ignore Sentry alerts (bugs spread)  
[ERROR] Skip backup testing (data loss risk)

---

## [OK] Next Step

→ **Read:** `docs/LAUNCH.md` (full launch guide)  
→ **Then:** Follow pre-launch checklist above  
→ **Finally:** Execute staging deployment

---

**Questions?** Check `docs/` folder or contact the team lead.

**Build Status:** [OK] Zero errors, ready to deploy

**Estimated Time to Launch:** 4–6 weeks from staging start

---

_Generated: January 14, 2026_
