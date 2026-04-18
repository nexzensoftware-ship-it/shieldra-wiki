# Background Workers

Shieldra runs scheduled, long-lived work through a set of asyncio loops (one per concern). The model is intentionally simple — no Celery, no APScheduler, no external queue — each worker is a `while True: do_work(); await asyncio.sleep(interval)` coroutine with error swallowing so one failure can't take down the rest.

## Deployment topology (Railway)

The app ships as three Railway services:

| Service | Dockerfile | What it runs |
|---|---|---|
| `api` | [infrastructure/docker/Dockerfile.api.prod](../infrastructure/docker/Dockerfile.api.prod) | FastAPI HTTP server. Set `DISABLE_BG_WORKERS=1` in prod. |
| `worker` | [infrastructure/docker/Dockerfile.worker.prod](../infrastructure/docker/Dockerfile.worker.prod) | [`python -m src.worker`](../apps/api/src/worker.py) — runs every worker listed below. |
| `web` | [infrastructure/docker/Dockerfile.web.prod](../infrastructure/docker/Dockerfile.web.prod) | Vite-built React frontend. |

**Why the split.** With `DISABLE_BG_WORKERS=1` the API container skips starting any workers, so there's exactly one worker process per worker — no duplicate execution, and the API stays small and restart-friendly. For local dev (`DISABLE_BG_WORKERS` unset), workers run alongside the API in the same process so you don't need a second container.

**Serverless note.** If the API is ever deployed on Vercel/Lambda the background loops are auto-skipped (`VERCEL` / `AWS_LAMBDA_FUNCTION_NAME` env vars). Don't rely on that — always run a worker service.

## Registered workers

Ordered by the cadence each loop runs at. All intervals are configurable via the env vars listed.

| Worker | Interval | Purpose | Entry point |
|---|---|---|---|
| Evidence collection | 5 min | Poll `evidence_collection_schedules` and run any scans that are due. | [tasks/evidence_scheduler.py](../apps/api/src/tasks/evidence_scheduler.py) |
| Dashboard snapshot | 10 min (`SNAPSHOT_WORKER_INTERVAL_SECONDS`) | Pre-compute `/dashboard/overview`, `/dashboard/intelligence-briefing`, `/dashboard/data` per org → `dashboard_snapshots` table. Endpoints read from this table; live compute is the fallback path. | [tasks/dashboard_snapshot_worker.py](../apps/api/src/tasks/dashboard_snapshot_worker.py) |
| Billing | 1 h | Generate recurring invoices, mark overdue invoices, send invoice emails. | [services/billing_worker.py](../apps/api/src/services/billing_worker.py) |
| Trial lifecycle | 6 h | Send halfway / expiring / expired emails for trial subscriptions. | [services/trial_worker.py](../apps/api/src/services/trial_worker.py) |
| Learning engine intelligence | 6 h (`LE_WORKER_INTERVAL_SECONDS`) | Pattern aggregation, calibration refresh, signal quality scoring, proactive gap discovery, autonomous-agent sweep, **cohort-benchmark aggregation**, embedding backfill, prompt accuracy refresh, health check. | [tasks/learning_engine_worker.py](../apps/api/src/tasks/learning_engine_worker.py) |
| Regulatory radar | 24 h | Poll Federal Register / HHS / CISA / NIST feeds, store new entries in `regulatory_updates`, trigger RAG ingestion + tenant impact analysis. | [main.py](../apps/api/src/main.py) `_regulatory_radar_worker` |
| Reminder | 24 h (`REMINDER_WORKER_INTERVAL_SECONDS`) | Send digest emails for remediations due within 7 days and regulatory updates whose `effective_date` lands within 14 days. Honours a 3-day per-item cooldown (see `AuditLog.action="deadline_reminder.sent"`). | [tasks/reminder_worker.py](../apps/api/src/tasks/reminder_worker.py) |
| Invite-token cleanup | 24 h (`INVITE_CLEANUP_INTERVAL_SECONDS`) | Mark expired pending invites as `expired`; delete terminal-state tokens older than 90 days (`INVITE_RETENTION_DAYS`). Replaces the "expired sessions cleanup" step — the app uses stateless JWTs, so `invite_tokens` is the equivalent target. | [tasks/invite_cleanup_worker.py](../apps/api/src/tasks/invite_cleanup_worker.py) |
| Retention | 24 h | Purge tenants whose deletion grace period has elapsed, via `offboarding_service`. | [tasks/retention_worker.py](../apps/api/src/tasks/retention_worker.py) |

## Dashboard snapshot cache

Dashboard endpoints previously ran the autonomous agent + cross-org benchmarker + a large pile of SQL aggregates on every request, with only a 30s in-process cache. On Railway that cache resets on every deploy and isn't shared across API replicas.

The snapshot worker now refreshes a DB-backed cache instead:

- Table: `dashboard_snapshots(id, org_id, snapshot_type, data JSON, computed_at)` — unique on `(org_id, snapshot_type)`.
- Snapshot types: `overview`, `intelligence_briefing`, `dashboard_data`.
- Endpoints check this table first; if the snapshot is fresher than `DASHBOARD_SNAPSHOT_FRESH_SECONDS` (default 15 min), they serve it directly. Miss → live compute → write snapshot back so the next request is fast.
- In-process cache kept as an L1 to absorb repeat requests inside a single process.

Result: typical dashboard page load drops from "agent run + benchmarker + ~20 SQL queries" to one SELECT.

## Adding a new worker

1. Create `apps/api/src/tasks/<name>_worker.py` exporting an `async def <name>_worker()` coroutine that follows the standard shape (initial stagger `await asyncio.sleep(N)`, `while True:` with try/except, `await asyncio.sleep(interval)` at the end).
2. Register it in **both** places:
   - [apps/api/src/main.py](../apps/api/src/main.py) lifespan (for dev / single-container setups)
   - [apps/api/src/worker.py](../apps/api/src/worker.py) (for the dedicated Railway worker service)
3. Add a row to the table above.

**Consistency rule.** Every worker registered in `main.py` must also be registered in `worker.py`. Before this rewrite, `retention_worker` was only in `main.py`, which meant it silently didn't run in production. Keep the lists in lock-step.
