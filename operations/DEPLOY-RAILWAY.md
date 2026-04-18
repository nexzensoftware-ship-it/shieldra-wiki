# Shieldra AI — Railway Deployment Guide

## Architecture Overview

```
Railway Project
├── PostgreSQL (managed)     ← DATABASE_URL auto-injected
├── Redis (managed)          ← REDIS_URL auto-injected
├── API Service              ← FastAPI (apps/api)
├── Worker Service           ← Background tasks (apps/api)
└── Web Service              ← nginx + React SPA (apps/web + apps/landing)
```

## Prerequisites

1. **Railway account** — Sign up at [railway.app](https://railway.app) (GitHub OAuth recommended)
2. **Railway CLI** — `npm install -g @railway/cli && railway login`
3. **Pro plan** ($20/mo) — Required for production workloads

## Step 1: Create Railway Project

```bash
# Create a new project
railway login
railway init

# Or link to existing project
railway link
```

## Step 2: Add Database Services

In the Railway dashboard:

1. Click **"+ New"** → **Database** → **PostgreSQL**
2. Click **"+ New"** → **Database** → **Redis**

Railway auto-creates `DATABASE_URL`, `REDIS_URL`, and related variables.

## Step 3: Create the API Service

1. Click **"+ New"** → **GitHub Repo** → Select your repo
2. In Service Settings:
   - **Root Directory**: (leave empty — Dockerfile uses full repo context)
   - **Builder**: Dockerfile
   - **Dockerfile Path**: `infrastructure/docker/Dockerfile.api.prod`
   - **Watch Paths**: `apps/api/**`
3. Add a **Custom Domain**: `api.shieldra.ai`

### API Environment Variables

Set these in the Railway dashboard (Service > Variables):

```env
# ── Application ──────────────────────────────────────────
ENVIRONMENT=production
DEBUG=false
DISABLE_BG_WORKERS=1

# ── Auth (generate strong random values) ─────────────────
SECRET_KEY=<generate: openssl rand -hex 64>
ADMIN_SECRET_KEY=<generate: openssl rand -hex 64>
ENCRYPTION_KEY=<generate: python3 -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())">
BOOTSTRAP_SECRET=<generate: openssl rand -hex 32>

# ── Database ─────────────────────────────────────────────
# Auto-injected by Railway PostgreSQL — no manual config needed
# DATABASE_URL=postgresql://...

# ── Redis ────────────────────────────────────────────────
# Use Railway's reference variable for private networking:
# REDIS_PRIVATE_URL=${{Redis.REDIS_PRIVATE_URL}}

# ── Frontend URL (for email links) ───────────────────────
FRONTEND_URL=https://app.shieldra.ai

# ── Email ────────────────────────────────────────────────
EMAIL_ENABLED=true
RESEND_API_KEY=<your-resend-api-key>

# ── Stripe Payments ──────────────────────────────────────
STRIPE_SECRET_KEY=<sk_live_...>
STRIPE_PUBLISHABLE_KEY=<pk_live_...>
STRIPE_WEBHOOK_SECRET=<whsec_...>
STRIPE_STARTER_MONTHLY_PRICE_ID=<price_...>
STRIPE_STARTER_YEARLY_PRICE_ID=<price_...>
STRIPE_PROFESSIONAL_MONTHLY_PRICE_ID=<price_...>
STRIPE_PROFESSIONAL_YEARLY_PRICE_ID=<price_...>

# ── LLM ──────────────────────────────────────────────────
LLM_PROVIDER=anthropic
ANTHROPIC_API_KEY=<your-key>

# ── Object Storage (use Cloudflare R2, AWS S3, or MinIO) ─
MINIO_ENDPOINT=<your-s3-endpoint>
MINIO_ACCESS_KEY=<access-key>
MINIO_SECRET_KEY=<secret-key>
MINIO_BUCKET=compliance-docs
MINIO_USE_SSL=true

# ── CORS ─────────────────────────────────────────────────
CORS_EXTRA_ORIGINS=https://app.shieldra.ai,https://www.shieldra.ai
```

> **Tip**: Use Railway **Shared Variables** for DATABASE_URL and REDIS_URL so both API and Worker services share them.

## Step 4: Create the Worker Service

1. Click **"+ New"** → **GitHub Repo** → Select same repo
2. In Service Settings:
   - **Builder**: Dockerfile
   - **Dockerfile Path**: `infrastructure/docker/Dockerfile.worker.prod`
   - **Watch Paths**: `apps/api/**`
3. No custom domain needed (worker has no HTTP interface)

### Worker Environment Variables

Same as API, **except**:
- **Remove** `DISABLE_BG_WORKERS` (worker NEEDS background tasks enabled)
- **Remove** `PORT` (worker has no HTTP server)

> Use Railway's **Shared Variables** to avoid duplicating all env vars. Set common vars at the project level.

## Step 5: Create the Web Service

1. Click **"+ New"** → **GitHub Repo** → Select same repo
2. In Service Settings:
   - **Builder**: Dockerfile
   - **Dockerfile Path**: `infrastructure/docker/Dockerfile.web.prod`
   - **Watch Paths**: `apps/web/**`, `apps/landing/**`, `packages/**`
3. Add **Custom Domains**: `app.shieldra.ai`, `www.shieldra.ai`

### Web Environment Variables

```env
PORT=8080
RAILWAY_API_HOST=<api-service-name>.railway.internal
RAILWAY_API_PORT=<api-service-port>
```

> **Important**: `RAILWAY_API_HOST` must match the internal hostname of your API service. Check the API service's "Networking" section in Railway dashboard for the private DNS name.

## Step 6: DNS Configuration

For each custom domain Railway provides a CNAME target.

At your DNS provider (e.g., Cloudflare):

| Type | Name | Target |
|------|------|--------|
| CNAME | api | `<railway-cname-for-api>.up.railway.app` |
| CNAME | app | `<railway-cname-for-web>.up.railway.app` |
| CNAME | www | `<railway-cname-for-web>.up.railway.app` |
| CNAME | `_acme-challenge.api` | (Railway provides this for SSL) |
| CNAME | `_acme-challenge.app` | (Railway provides this for SSL) |

**Cloudflare users**: Set proxy mode to **DNS-only** (grey cloud) for `_acme-challenge` records.

## Step 7: Database Migration (from Neon)

### Option A: Keep Neon PostgreSQL (recommended initially)

Just set `DATABASE_URL` in Railway to your existing Neon connection string. No data migration needed.

### Option B: Migrate to Railway PostgreSQL

```bash
# Export from Neon
pg_dump "postgresql://user:pass@neon-host/dbname" --no-owner --no-acls > shieldra_dump.sql

# Import to Railway
# Get Railway PostgreSQL connection string from dashboard
psql "postgresql://user:pass@railway-host/railway" < shieldra_dump.sql
```

## Local Testing (Production-like)

Test the full Railway architecture locally:

```bash
docker-compose -f infrastructure/docker-compose.prod.yml up --build
```

This starts:
- PostgreSQL + Redis + MinIO (infrastructure)
- API server (production mode, workers disabled)
- Worker service (background tasks)
- Web server (nginx + SPA)

Access: `http://localhost:8080`

## Monitoring

- **Railway Dashboard**: Real-time logs, metrics, deployments
- **Health Check**: API service has `/api/v1/health` endpoint
- **Logs**: `railway logs --service api` / `railway logs --service worker`

## Scaling

```bash
# Scale API horizontally (Railway dashboard or CLI)
# Add replicas in Service Settings > Scaling

# Scale vertically — Railway auto-scales CPU/RAM up to plan limits
```

**Note**: The Worker service should NOT be horizontally scaled (duplicate workers would create duplicate background task execution). Keep at 1 replica.

## Rollback

Railway keeps deployment history. To rollback:

1. Go to Service > Deployments
2. Click on the previous successful deployment
3. Click "Rollback to this deployment"

## Cost Estimate

| Service | vCPU | RAM | Est. Cost/mo |
|---------|------|-----|-------------|
| API | 1 | 1 GB | ~$30 |
| Worker | 0.5 | 512 MB | ~$15 |
| Web | 0.25 | 256 MB | ~$8 |
| PostgreSQL | — | 256 MB | ~$10 |
| Redis | — | 256 MB | ~$5 |
| **Total** | | | **~$68/mo** |

Pro plan includes $20/mo credit, so effective cost: **~$48/mo**.
