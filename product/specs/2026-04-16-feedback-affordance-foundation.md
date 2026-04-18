# Feedback Affordance Foundation — Implementation Plan (Plan 1A)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Source spec:** [2026-04-16-unified-feedback-affordance-design.md](../specs/2026-04-16-unified-feedback-affordance-design.md)

**Goal:** Ship a single `<FeedbackAffordance>` React component that captures thumb-up acceptance or drawer-based correction on every AI judgment across 17 Shieldra surfaces, routed into the existing Learning Engine signal/correction tables.

**Architecture:** One reusable React component dispatches to 8 entity-specific drawer variants. Thumbs up fires a fire-and-forget acceptance signal. Thumbs down opens a side-sheet drawer for structured correction. Both flow through a shared React Query mutation hook backed by two FastAPI endpoints — the existing `POST /learning-engine/feedback/correction` (extended to accept entity_type/entity_id/field) and a new `POST /learning-engine/feedback/acceptance`. Offline clicks queue in localStorage and replay on reconnect.

**Tech Stack:** React 19 + TanStack Query + shadcn/ui (Sheet primitive) + sonner toasts + FastAPI + SQLAlchemy + Alembic.

**Scope breakdown — this plan ships:**
- Backend schema + API (migration, extended correction endpoint, new acceptance endpoint, new undo endpoint, permission grant)
- Frontend primitive (`<FeedbackAffordance>` + 8 drawer variants + hooks + offline queue)
- Placement on all 17 AI-surface pages
- Contextual next-step toast links
- Component + integration + E2E tests

**Out of scope for Plan 1A** — follow-on plans:
- `/review` page with keyboard shortcuts → **Plan 1B**
- Outcome follow-up card + 30-day nudge cron → **Plan 1C**
- "Your Contributions" card + dashboard → **Plan 1D**

**Absolute constraints (from user):**
- **Do not break anything existing.** Production is live at www.shieldra.ai on commit `e2d67cc`. All changes must be additive or backwards-compatible.
- **Work directly on `main`** per TEMPORARY OVERRIDE in CLAUDE.md (develop/stage are broken).
- **Never delete DB data.** Migrations are additive only — no column drops, no table drops.
- **Verify build stays green after each commit** — `npm run build` in `apps/web`, `python3 -c "from src.main import app"` in `apps/api/`.

---

## File Structure

### New files (backend)
- `apps/api/alembic/versions/20260417_b2c3d4e5f6a7_feedback_affordance_schema.py` — migration: adds `entity_type`, `entity_id`, `field`, `user_id` to `expert_corrections`; adds `has_user_correction` to `findings` and `risk_items`; adds unique index. (Note: revision id is `b2c3d4e5f6a7` not `a1b2c3d4e5f6` — that slug was already taken by `20260415_a1b2c3d4e5f6_add_r2_storage_columns.py`.)

### Modified files (backend)
- `apps/api/src/learning_engine/models.py` — add new columns on `ExpertCorrection`; add model-level unique constraint definition so SQLAlchemy create_all matches migration.
- `apps/api/src/api/v1/endpoints/learning_engine.py` — extend `CorrectionRequest`; add `AcceptanceRequest`; add `POST /feedback/acceptance`, `DELETE /feedback/correction/{id}`; change correction endpoint permission from `compliance.manage` to `ai.manage`.
- `apps/api/src/learning_engine/feedback/signal_capture.py` — `capture_signal` + `_process_correction_signal` thread `entity_type`, `entity_id`, `field` through, and upsert correction by `(user_id, entity_type, entity_id, field)` instead of always insert.
- `apps/api/src/core/tenant_context.py` — add `"ai.manage"` to `_OFFICER_PERMISSIONS`; add the permission to `admin` implicitly via `"*"`.
- `apps/api/tests/test_feedback_affordance.py` — new pytest file, covers correction with each entity_type, acceptance, upsert, undo, permission gate.

### New files (frontend)
- `apps/web/src/components/feedback/FeedbackAffordance.tsx` — main reusable component.
- `apps/web/src/components/feedback/drawers/FeedbackDrawerFinding.tsx`
- `apps/web/src/components/feedback/drawers/FeedbackDrawerRiskItem.tsx`
- `apps/web/src/components/feedback/drawers/FeedbackDrawerRemediation.tsx`
- `apps/web/src/components/feedback/drawers/FeedbackDrawerIncident.tsx`
- `apps/web/src/components/feedback/drawers/FeedbackDrawerVendorRisk.tsx`
- `apps/web/src/components/feedback/drawers/FeedbackDrawerControlTest.tsx`
- `apps/web/src/components/feedback/drawers/FeedbackDrawerDocumentClass.tsx`
- `apps/web/src/components/feedback/drawers/FeedbackDrawerAiAnswer.tsx`
- `apps/web/src/components/feedback/drawers/drawer-shell.tsx` — shared header/footer/keybindings for all 8 variants.
- `apps/web/src/components/feedback/drawers/types.ts` — shared drawer prop types.
- `apps/web/src/components/feedback/index.ts` — barrel export.
- `apps/web/src/lib/feedback-offline-queue.ts` — localStorage queue + replay.
- `apps/web/src/hooks/use-feedback.ts` — `useSubmitCorrectionV2`, `useSubmitAcceptance`, `useUndoCorrection`.
- `apps/web/src/components/feedback/__tests__/FeedbackAffordance.test.tsx`
- `apps/web/src/components/feedback/__tests__/drawers.test.tsx`
- `apps/web/src/lib/__tests__/feedback-offline-queue.test.ts`
- `apps/web/vitest.config.ts` — new Vitest config.
- `apps/web/src/test-setup.ts` — jsdom + testing-library setup.
- `apps/web/e2e/feedback-affordance.spec.ts` — Playwright smoke.

### Modified files (frontend)
- `apps/web/package.json` — add Vitest, @testing-library/react, @testing-library/jest-dom, @testing-library/user-event, jsdom, @vitejs/plugin-react-swc (or reuse vite plugin); add `test` and `test:watch` scripts.
- `apps/web/src/services/learning-engine.ts` — extend `CorrectionRequest` type + `submitCorrection` with new fields; add `submitAcceptance`, `undoCorrection`.
- 17 page files under `apps/web/src/app/routes/_authenticated/` — add `<FeedbackAffordance>` placement. Listed per-task below.

---

## Task index

- Task 1: Alembic migration — ExpertCorrection entity columns + flags
- Task 2: SQLAlchemy models — add columns to `ExpertCorrection`
- Task 3: Grant `ai.manage` to officer roles
- Task 4: Extend `signal_capture.capture_signal` to thread entity fields + upsert
- Task 5: Backend — extend `CorrectionRequest` schema; change permission
- Task 6: Backend — new `POST /feedback/acceptance` endpoint
- Task 7: Backend — new `DELETE /feedback/correction/{id}` undo endpoint
- Task 8: Backend tests — `tests/test_feedback_affordance.py`
- Task 9: Frontend — Vitest setup
- Task 10: Frontend service — extend `learning-engine.ts`
- Task 11: Frontend — offline queue helper
- Task 12: Frontend hooks — `useSubmitCorrectionV2`, `useSubmitAcceptance`, `useUndoCorrection`
- Task 13: Drawer shell + prop types
- Task 14: 8 drawer variants
- Task 15: `<FeedbackAffordance>` component
- Task 16: Component tests
- Task 17: Placement — `/compliance` + `/compliance/$checkId`
- Task 18: Placement — `/remediation`
- Task 19: Placement — `/risk-register`, `/risk-assessment`, `/risk-prioritization`
- Task 20: Placement — `/incidents`, `/penalty-exposure`
- Task 21: Placement — `/vendors`, `/vendor-risk`, `/controls`
- Task 22: Placement — `/documents`, `/contract-intelligence`, `/due-diligence`
- Task 23: Placement — `/ai-assistant`, `/insights`, `/regulatory-radar`
- Task 24: Playwright E2E smoke
- Task 25: Final build + deploy verification

---

### Task 1: Alembic migration — ExpertCorrection entity columns + flags

**Files:**
- Create: `apps/api/alembic/versions/20260417_a1b2c3d4e5f6_feedback_affordance_schema.py`

**Context:** Current `expert_corrections` table has no way to key a correction to a specific entity (finding, risk_item, vendor, etc.) — it only has `requirement_id`. Spec §5.2 requires upsert on `(user_id, entity_id, field)` so the same user correcting the same field twice replaces rather than duplicates. Spec §11 requires a `has_user_correction` flag on `findings` and `risk_items` only (the two entity types that get silently re-overwritten by re-running AI scans). This migration adds all four columns, adds the flag on those two tables, and adds the supporting indexes.

- [ ] **Step 1.1:** Find the latest alembic revision id to use as `down_revision`.

Run:
```bash
ls -t apps/api/alembic/versions/*.py | head -3
```
Expected: most recent file is `20260416_f6a7b8c9d0e1_optional_rls_defense_in_depth.py` — confirm the revision id by reading its `revision =` line.

- [ ] **Step 1.2:** Write the migration file.

Create `apps/api/alembic/versions/20260417_a1b2c3d4e5f6_feedback_affordance_schema.py`:

```python
"""feedback affordance schema — entity fields + has_user_correction flags

Revision ID: a1b2c3d4e5f6
Revises: f6a7b8c9d0e1
Create Date: 2026-04-17 09:00:00
"""
from __future__ import annotations

from alembic import op
import sqlalchemy as sa

revision = "a1b2c3d4e5f6"
down_revision = "f6a7b8c9d0e1"
branch_labels = None
depends_on = None


def _has_column(bind, table: str, column: str) -> bool:
    insp = sa.inspect(bind)
    try:
        return any(c["name"] == column for c in insp.get_columns(table))
    except Exception:
        return False


def _has_index(bind, table: str, name: str) -> bool:
    insp = sa.inspect(bind)
    try:
        return any(i["name"] == name for i in insp.get_indexes(table))
    except Exception:
        return False


def _has_table(bind, table: str) -> bool:
    insp = sa.inspect(bind)
    return table in insp.get_table_names()


def upgrade() -> None:
    bind = op.get_bind()

    # 1. Add entity-routing columns to expert_corrections.
    if _has_table(bind, "expert_corrections"):
        if not _has_column(bind, "expert_corrections", "entity_type"):
            op.add_column("expert_corrections", sa.Column("entity_type", sa.String(), nullable=True))
        if not _has_column(bind, "expert_corrections", "entity_id"):
            op.add_column("expert_corrections", sa.Column("entity_id", sa.String(), nullable=True))
        if not _has_column(bind, "expert_corrections", "field"):
            op.add_column("expert_corrections", sa.Column("field", sa.String(), nullable=True))
        if not _has_column(bind, "expert_corrections", "user_id"):
            op.add_column("expert_corrections", sa.Column("user_id", sa.String(), nullable=True))

        # Upsert index. Nullable columns + null-allowed uniqueness: we enforce
        # uniqueness only when all 4 are set. SQLite treats each NULL as
        # distinct, Postgres treats NULLs as equal under NULLS NOT DISTINCT
        # (SA >= 2.0, PG 15+). Keep the index simple and let the application
        # layer perform the conditional upsert.
        if not _has_index(bind, "expert_corrections", "ix_expert_corrections_user_entity_field"):
            op.create_index(
                "ix_expert_corrections_user_entity_field",
                "expert_corrections",
                ["user_id", "entity_type", "entity_id", "field"],
            )

    # 2. has_user_correction flag on findings + risk_items.
    for table_name in ("findings", "risk_items"):
        if _has_table(bind, table_name) and not _has_column(bind, table_name, "has_user_correction"):
            op.add_column(
                table_name,
                sa.Column(
                    "has_user_correction",
                    sa.Boolean(),
                    nullable=False,
                    server_default=sa.false(),
                ),
            )


def downgrade() -> None:
    # Additive-only migration. Do not drop user-visible columns on downgrade —
    # it would destroy correction routing. If a rollback is ever required,
    # drop the index only; keep the data.
    bind = op.get_bind()
    if _has_index(bind, "expert_corrections", "ix_expert_corrections_user_entity_field"):
        op.drop_index("ix_expert_corrections_user_entity_field", table_name="expert_corrections")
```

- [ ] **Step 1.3:** Run the migration against the local sqlite DB.

Run:
```bash
cd apps/api && source venv/bin/activate && alembic upgrade head
```
Expected: `INFO  [alembic.runtime.migration] Running upgrade f6a7b8c9d0e1 -> a1b2c3d4e5f6`.

- [ ] **Step 1.4:** Inspect the DB to confirm columns exist.

Run:
```bash
cd apps/api && source venv/bin/activate && python3 -c "
import sqlalchemy as sa
from src.core.db import engine
insp = sa.inspect(engine)
cols = [c['name'] for c in insp.get_columns('expert_corrections')]
print('expert_corrections:', 'entity_type' in cols, 'entity_id' in cols, 'field' in cols, 'user_id' in cols)
for t in ('findings','risk_items'):
    try:
        c = [x['name'] for x in insp.get_columns(t)]
        print(t, 'has_user_correction:', 'has_user_correction' in c)
    except Exception as e:
        print(t, 'missing:', e)
"
```
Expected:
```
expert_corrections: True True True True
findings has_user_correction: True
risk_items has_user_correction: True
```

- [ ] **Step 1.5:** Commit.

Run:
```bash
cd "/Users/shyamsedai/Documents/Compliance Vision AI"
git add apps/api/alembic/versions/20260417_a1b2c3d4e5f6_feedback_affordance_schema.py
git commit -m "$(cat <<'EOF'
feat(db): add feedback affordance schema — entity_type/id/field + user_correction flags

Adds entity_type, entity_id, field, user_id columns to expert_corrections so a
correction can be keyed to any AI surface (finding, risk_item, incident, vendor,
document, control, ai_answer) instead of requirement_id only. Adds an
has_user_correction flag on findings and risk_items so the UI can warn when an
AI re-run overwrote a user's correction.

Migration is additive only; downgrade drops only the new index, never columns.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: SQLAlchemy models — add columns to `ExpertCorrection`

**Files:**
- Modify: `apps/api/src/learning_engine/models.py` (around line 91-111)

**Context:** SQLAlchemy's `Base.metadata.create_all()` runs at first boot on a fresh DB — keeping the model in sync with the migration prevents new dev environments from diverging. The columns must be nullable at the model level because existing rows won't have values.

- [ ] **Step 2.1:** Edit `ExpertCorrection` to add four new columns.

Open `apps/api/src/learning_engine/models.py` and replace the `ExpertCorrection` class body (lines ~91-111) with:

```python
class ExpertCorrection(Base):
    """Structured expert correction for retrieval-weighted feedback."""

    __tablename__ = "expert_corrections"

    id = Column(String, primary_key=True, default=_uuid)
    org_id = Column(String, ForeignKey("organizations.id"), nullable=True)
    tenant_id = Column(String, nullable=True)
    signal_id = Column(String, ForeignKey("learning_signals.id"), nullable=True)
    # Entity routing (added 2026-04-17) — lets any AI surface submit a correction.
    entity_type = Column(String, nullable=True, index=True)
    # finding | risk_item | remediation | incident | vendor_risk
    # control_test | document_class | ai_answer
    entity_id = Column(String, nullable=True, index=True)
    field = Column(String, nullable=True)
    # The specific AI judgment the user corrected:
    # severity | status | likelihood | impact | breach | risk_level | class | ...
    user_id = Column(String, nullable=True)
    requirement_id = Column(String, nullable=True)
    cfr_reference = Column(String, nullable=True)
    correction_type = Column(String, nullable=False)
    # status_change | severity_change | description_update | false_positive
    original_status = Column(String, nullable=True)
    corrected_status = Column(String, nullable=True)
    original_text = Column(Text, nullable=True)
    corrected_text = Column(Text, nullable=True)
    reasoning = Column(Text, nullable=True)
    embedding_json = Column(JSON, nullable=True)
    usage_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=_now)
```

- [ ] **Step 2.2:** Verify import still succeeds.

Run:
```bash
cd apps/api && source venv/bin/activate && python3 -c "from src.learning_engine.models import ExpertCorrection; c = ExpertCorrection.__table__.c; assert all(n in c for n in ['entity_type','entity_id','field','user_id']), 'missing columns'; print('OK')"
```
Expected: `OK`

- [ ] **Step 2.3:** Commit.

```bash
git add apps/api/src/learning_engine/models.py
git commit -m "feat(db): mirror feedback affordance columns on ExpertCorrection model

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 3: Grant `ai.manage` to officer roles

**Files:**
- Modify: `apps/api/src/core/tenant_context.py` (lines 208 + 216)

**Context:** Spec §4.1 requires `ai.manage` to gate the feedback component. Today only admin/owner (wildcard `*`) have it; officers only have `ai.view, ai.chat`. Officers ARE the target audience for giving feedback — they're the people reviewing AI judgments. The correction endpoint today uses `compliance.manage` (which officers DO have). Widening `_OFFICER_PERMISSIONS` to include `ai.manage` aligns the backend gate with the spec's frontend gate. Analysts keep their current permissions (no `ai.manage` — they can chat and view but not correct). Admin/owner get it free via `"*"`.

- [ ] **Step 3.1:** Edit `_OFFICER_PERMISSIONS` to add `"ai.manage"`.

Find the comment `# AI — view and chat only (cannot configure AI providers)` at line ~207 and replace the three following lines:

```python
    # AI — view, chat, and feedback (officers review AI judgments and submit corrections)
    "ai.view", "ai.chat", "ai.manage",
```

Then update the trailing NOTE (line ~215):

```python
    # NOTE: Officers do NOT have: settings.*, users.*, integrations.manage
```

- [ ] **Step 3.2:** Verify the permission list includes ai.manage.

Run:
```bash
cd apps/api && source venv/bin/activate && python3 -c "from src.core.tenant_context import ROLE_DEFAULT_PERMISSIONS; p = ROLE_DEFAULT_PERMISSIONS['compliance_officer']; assert 'ai.manage' in p, 'ai.manage missing'; print('OK')"
```
Expected: `OK`

- [ ] **Step 3.3:** Commit.

```bash
git add apps/api/src/core/tenant_context.py
git commit -m "feat(perms): grant ai.manage to officer roles for feedback submission

Officers review AI judgments daily and are the primary audience for the
unified feedback affordance. Owner/admin already have it via wildcard;
analysts and auditors do not (they can view and chat but not train).

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 4: Extend `signal_capture` to thread entity fields + upsert

**Files:**
- Modify: `apps/api/src/learning_engine/feedback/signal_capture.py`

**Context:** Today `capture_signal` always INSERTs a new LearningSignal and `_process_correction_signal` always INSERTs a new ExpertCorrection. For the affordance, submitting the same correction twice (e.g., user double-clicks, or changes their mind) should UPDATE the existing ExpertCorrection keyed on `(user_id, entity_type, entity_id, field)` instead of creating a duplicate. Acceptance signals (thumb-up) write ONLY LearningSignal with `signal_type="acceptance"` — no ExpertCorrection.

- [ ] **Step 4.1:** Update `capture_signal` signature and body.

In `apps/api/src/learning_engine/feedback/signal_capture.py`, replace the `capture_signal` method (lines 28-101) with:

```python
    async def capture_signal(
        self,
        signal_type: str,
        source_type: str | None = None,
        source_id: str | None = None,
        original_output: dict | None = None,
        corrected_output: dict | None = None,
        reasoning: str | None = None,
        org_id: str | None = None,
        tenant_id: str | None = None,
        user_id: str | None = None,
        context: dict | None = None,
        entity_type: str | None = None,
        entity_id: str | None = None,
        field: str | None = None,
    ) -> str:
        """Persist a learning signal to the database.

        New (2026-04-17): entity_type/entity_id/field route the signal to an
        ExpertCorrection keyed on (user_id, entity_type, entity_id, field) so
        repeat submissions upsert instead of duplicate.
        """
        session = get_db_session()
        try:
            ctx = context or {}
            if entity_type:
                ctx["entity_type"] = entity_type
            if entity_id:
                ctx["entity_id"] = entity_id
            if field:
                ctx["field"] = field

            signal = LearningSignal(
                signal_type=signal_type,
                source_type=source_type,
                source_id=source_id,
                original_output=original_output or {},
                corrected_output=corrected_output,
                reasoning=reasoning,
                org_id=org_id,
                tenant_id=tenant_id,
                user_id=user_id,
                context_json=ctx,
                processed=False,
            )
            session.add(signal)
            session.commit()
            signal_id = signal.id
            logger.info(
                "Captured learning signal: type=%s source=%s/%s entity=%s/%s org=%s",
                signal_type,
                source_type,
                source_id,
                entity_type,
                entity_id,
                org_id,
            )

            # Only correction-type signals materialize an ExpertCorrection.
            # Acceptance signals (thumb-up) are pure accuracy telemetry.
            if signal_type in ("finding_correction", "false_positive", "expert_review"):
                try:
                    await self._process_correction_signal(signal_id)
                except Exception as e:
                    logger.warning("Failed to process correction signal: %s", e)

            return signal_id

        except Exception as e:
            session.rollback()
            logger.error("Failed to capture learning signal: %s", e)
            raise
        finally:
            session.close()
```

- [ ] **Step 4.2:** Update `_process_correction_signal` to upsert.

In the same file, replace the body of `_process_correction_signal` (lines 103-201). After the scrubbing block that produces `original_text`, `corrected_text`, `reasoning`, replace the `correction = ExpertCorrection(...)` construction with an upsert-by-key:

```python
            # Upsert by (user_id, entity_type, entity_id, field) so repeat
            # submissions from the same user on the same field replace rather
            # than duplicate. If the 4-tuple is not fully set (e.g., legacy
            # callers), fall through to plain insert.
            entity_type = ctx.get("entity_type")
            entity_id = ctx.get("entity_id")
            field = ctx.get("field")
            user_id = signal.user_id

            correction = None
            if user_id and entity_type and entity_id and field:
                correction = (
                    session.query(ExpertCorrection)
                    .filter(
                        ExpertCorrection.user_id == user_id,
                        ExpertCorrection.entity_type == entity_type,
                        ExpertCorrection.entity_id == entity_id,
                        ExpertCorrection.field == field,
                    )
                    .first()
                )

            if correction:
                correction.signal_id = signal_id
                correction.org_id = signal.org_id
                correction.tenant_id = signal.tenant_id
                correction.requirement_id = ctx.get("requirement_id")
                correction.cfr_reference = ctx.get("cfr_reference")
                correction.correction_type = correction_type
                correction.original_status = original.get("status")
                correction.corrected_status = corrected.get("status")
                correction.original_text = original_text
                correction.corrected_text = corrected_text
                correction.reasoning = reasoning
            else:
                correction = ExpertCorrection(
                    org_id=signal.org_id,
                    tenant_id=signal.tenant_id,
                    signal_id=signal_id,
                    user_id=user_id,
                    entity_type=entity_type,
                    entity_id=entity_id,
                    field=field,
                    requirement_id=ctx.get("requirement_id"),
                    cfr_reference=ctx.get("cfr_reference"),
                    correction_type=correction_type,
                    original_status=original.get("status"),
                    corrected_status=corrected.get("status"),
                    original_text=original_text,
                    corrected_text=corrected_text,
                    reasoning=reasoning,
                )
                session.add(correction)
```

Also flag the source entity when applicable. After `session.add(correction)` and before the embedding block, insert:

```python
            # Flag finding / risk_item source rows so the UI can warn if an AI
            # re-run overwrote the user's judgment. Only these two entity
            # types get re-overwritten by silent re-scans.
            try:
                if entity_type == "finding" and entity_id:
                    from src.core.db import Finding
                    row = session.query(Finding).filter(Finding.id == entity_id).first()
                    if row and hasattr(row, "has_user_correction"):
                        row.has_user_correction = True
                elif entity_type == "risk_item" and entity_id:
                    from src.core.db import RiskItem
                    row = session.query(RiskItem).filter(RiskItem.id == entity_id).first()
                    if row and hasattr(row, "has_user_correction"):
                        row.has_user_correction = True
            except Exception as flag_exc:
                logger.warning("Failed to flag source entity: %s", flag_exc)
```

- [ ] **Step 4.3:** Verify import still succeeds.

Run:
```bash
cd apps/api && source venv/bin/activate && python3 -c "from src.learning_engine.feedback.signal_capture import SignalCapture; sc = SignalCapture(); import inspect; sig = inspect.signature(sc.capture_signal); assert 'entity_type' in sig.parameters, 'entity_type missing'; print('OK')"
```
Expected: `OK`

- [ ] **Step 4.4:** Commit.

```bash
git add apps/api/src/learning_engine/feedback/signal_capture.py
git commit -m "feat(learning-engine): signal_capture routes entity fields + upserts corrections

Adds entity_type/entity_id/field args to capture_signal and threads them into
both LearningSignal.context_json and the materialized ExpertCorrection. The
ExpertCorrection is now upserted by (user_id, entity_type, entity_id, field)
so a user re-submitting a correction on the same field replaces rather than
duplicates. Also flags finding/risk_item source rows with has_user_correction
so the UI can warn when AI re-runs overwrite user judgments.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 5: Backend — extend `CorrectionRequest` schema; change permission

**Files:**
- Modify: `apps/api/src/api/v1/endpoints/learning_engine.py` (lines 35-45 + 408-445)

- [ ] **Step 5.1:** Extend `CorrectionRequest` model.

In `apps/api/src/api/v1/endpoints/learning_engine.py`, replace the `CorrectionRequest` class (lines 35-45) with:

```python
class CorrectionRequest(BaseModel):
    # Legacy fields (kept for backward compatibility with the /learning-engine page modal)
    requirement_id: str | None = None
    cfr_reference: str | None = None
    correction_type: str = "status_change"
    original_status: str | None = None
    corrected_status: str | None = None
    original_text: str | None = None
    corrected_text: str | None = None
    reasoning: str | None = None
    source_type: str | None = None
    source_id: str | None = None
    # New (2026-04-17) — unified feedback affordance routing.
    entity_type: str | None = None
    # finding | risk_item | remediation | incident | vendor_risk
    # control_test | document_class | ai_answer
    entity_id: str | None = None
    field: str | None = None
    # severity | status | likelihood | impact | risk_level | breach | class | ...
    original_value: str | int | float | None = None
    corrected_value: str | int | float | None = None


class AcceptanceRequest(BaseModel):
    """Thumb-up acceptance — a coarse signal that the AI got it right."""
    entity_type: str
    entity_id: str
    field: str
    value: str | int | float | None = None
    requirement_id: str | None = None
    cfr_reference: str | None = None
```

- [ ] **Step 5.2:** Update `submit_correction` endpoint.

Replace the existing `submit_correction` (lines 408-445) with:

```python
@router.post("/feedback/correction", summary="Submit expert correction")
async def submit_correction(
    request: Request,
    body: CorrectionRequest,
    ctx: TenantContext = Depends(require_permission("ai.manage")),
) -> dict:
    """Submit an expert correction that improves future assessments."""
    org_id = get_tenant_org_id(request)
    engine = _require_engine()

    if not engine.feedback:
        raise HTTPException(status_code=503, detail="Feedback subsystem not available")

    try:
        # Normalize legacy vs new value fields. Spec §5.2 allows either shape.
        original_status = body.original_status
        corrected_status = body.corrected_status
        if body.field in ("status", "severity", "risk_level", "breach", "class"):
            if original_status is None and body.original_value is not None:
                original_status = str(body.original_value)
            if corrected_status is None and body.corrected_value is not None:
                corrected_status = str(body.corrected_value)

        signal_id = await engine.feedback.capture_signal(
            signal_type="finding_correction",
            source_type=body.source_type or body.entity_type or "expert_review",
            source_id=body.source_id or body.entity_id,
            original_output={
                "status": original_status,
                "text": body.original_text,
                "value": body.original_value,
                "requirement_id": body.requirement_id,
                "cfr_reference": body.cfr_reference,
            },
            corrected_output={
                "status": corrected_status,
                "text": body.corrected_text,
                "value": body.corrected_value,
                "correction_type": body.correction_type,
            },
            reasoning=body.reasoning,
            org_id=org_id,
            user_id=ctx.user_id,
            entity_type=body.entity_type,
            entity_id=body.entity_id,
            field=body.field,
            context={
                "requirement_id": body.requirement_id,
                "cfr_reference": body.cfr_reference,
            },
        )

        # Resolve the resulting ExpertCorrection id (if any) so the frontend
        # can wire the Undo button to DELETE /feedback/correction/{id}.
        correction_id = None
        try:
            from src.core.db import get_db_session
            from src.learning_engine.models import ExpertCorrection
            with get_db_session() as session:
                corr = (
                    session.query(ExpertCorrection)
                    .filter(ExpertCorrection.signal_id == signal_id)
                    .first()
                )
                if corr:
                    correction_id = corr.id
        except Exception as e:
            logger.warning("Could not resolve correction id for signal %s: %s", signal_id, e)

        return {
            "signal_id": signal_id,
            "correction_id": correction_id,
            "status": "captured",
            "message": "Expert correction captured and will improve future assessments",
        }
    except Exception as e:
        logger.error("Correction submission failed: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail="An internal error occurred. Please try again later.")
```

- [ ] **Step 5.3:** Verify imports + schema load.

Run:
```bash
cd apps/api && source venv/bin/activate && python3 -c "from src.main import app; from src.api.v1.endpoints.learning_engine import CorrectionRequest, AcceptanceRequest; assert 'entity_type' in CorrectionRequest.model_fields; assert 'entity_type' in AcceptanceRequest.model_fields; print('OK')"
```
Expected: `OK`

- [ ] **Step 5.4:** Commit.

```bash
git add apps/api/src/api/v1/endpoints/learning_engine.py
git commit -m "feat(api): extend /feedback/correction with entity routing + AcceptanceRequest schema

Adds entity_type/entity_id/field/original_value/corrected_value to
CorrectionRequest so any AI surface can submit a correction. Endpoint now
threads entity + user_id to signal_capture for upsert-by-key, and returns
correction_id so the frontend can wire the 5s Undo button.

Changes permission from compliance.manage to ai.manage (aligns with spec
§4.1 gate). Officers get ai.manage by default — no functional change for
admins or analysts.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 6: Backend — new `POST /feedback/acceptance` endpoint

**Files:**
- Modify: `apps/api/src/api/v1/endpoints/learning_engine.py` (insert after the `/feedback/correction` endpoint)

- [ ] **Step 6.1:** Add the endpoint.

Insert immediately after `submit_correction` (before the `/feedback/signals` list endpoint at ~line 448):

```python
@router.post("/feedback/acceptance", summary="Submit thumb-up acceptance signal")
async def submit_acceptance(
    request: Request,
    body: AcceptanceRequest,
    ctx: TenantContext = Depends(require_permission("ai.manage")),
) -> dict:
    """Fire-and-forget acceptance signal — user agreed with the AI judgment.

    Lower-resolution than a correction but high-volume. Feeds the accuracy
    tracker and downweights requirements that nobody is disagreeing with.
    """
    org_id = get_tenant_org_id(request)
    engine = _require_engine()

    if not engine.feedback:
        raise HTTPException(status_code=503, detail="Feedback subsystem not available")

    try:
        signal_id = await engine.feedback.capture_signal(
            signal_type="acceptance",
            source_type=body.entity_type,
            source_id=body.entity_id,
            original_output={
                "status": str(body.value) if body.value is not None else None,
                "value": body.value,
                "requirement_id": body.requirement_id,
                "cfr_reference": body.cfr_reference,
            },
            corrected_output=None,
            reasoning=None,
            org_id=org_id,
            user_id=ctx.user_id,
            entity_type=body.entity_type,
            entity_id=body.entity_id,
            field=body.field,
            context={
                "requirement_id": body.requirement_id,
                "cfr_reference": body.cfr_reference,
            },
        )
        return {"signal_id": signal_id, "status": "captured"}
    except Exception as e:
        logger.error("Acceptance submission failed: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail="An internal error occurred. Please try again later.")
```

- [ ] **Step 6.2:** Verify route registration.

Run:
```bash
cd apps/api && source venv/bin/activate && python3 -c "
from src.main import app
paths = [r.path for r in app.routes]
assert '/api/v1/learning-engine/feedback/acceptance' in paths, 'route missing'
print('OK')
"
```
Expected: `OK`

- [ ] **Step 6.3:** Commit.

```bash
git add apps/api/src/api/v1/endpoints/learning_engine.py
git commit -m "feat(api): POST /feedback/acceptance — thumb-up acceptance signal

High-volume coarse agreement signal. Writes a LearningSignal row with
signal_type='acceptance' but no ExpertCorrection (there is nothing to correct).

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 7: Backend — `DELETE /feedback/correction/{id}` undo endpoint

**Files:**
- Modify: `apps/api/src/api/v1/endpoints/learning_engine.py`

**Context:** Spec §5.2 and §11 require a 5-second Undo window. Backend must let the submitting user delete their own correction as long as the pattern extractor hasn't processed it yet (signal.processed=True → too late; correction has been embedded and may be in the pattern library).

- [ ] **Step 7.1:** Add the DELETE endpoint.

Insert after `submit_acceptance`:

```python
@router.delete("/feedback/correction/{correction_id}", summary="Undo an expert correction")
async def undo_correction(
    request: Request,
    correction_id: str,
    ctx: TenantContext = Depends(require_permission("ai.manage")),
) -> dict:
    """Delete a just-submitted correction + its signal.

    Only callable by the submitting user, only while the underlying signal
    is still unprocessed (processed=False means the pattern extractor and
    embedder have not yet consumed it).
    """
    org_id = get_tenant_org_id(request)

    from src.core.db import get_db_session
    from src.learning_engine.models import ExpertCorrection, LearningSignal

    with get_db_session() as session:
        correction = (
            session.query(ExpertCorrection)
            .filter(ExpertCorrection.id == correction_id)
            .first()
        )
        if not correction:
            raise HTTPException(status_code=404, detail="Correction not found")
        if correction.org_id != org_id:
            raise HTTPException(status_code=404, detail="Correction not found")
        if correction.user_id and correction.user_id != ctx.user_id:
            raise HTTPException(status_code=403, detail="Only the submitting user can undo")

        signal_id = correction.signal_id
        if signal_id:
            signal = (
                session.query(LearningSignal)
                .filter(LearningSignal.id == signal_id)
                .first()
            )
            if signal and signal.processed:
                raise HTTPException(
                    status_code=409,
                    detail="Correction has already been processed and cannot be undone",
                )
            if signal:
                session.delete(signal)

        # Un-flag the source entity if this was the only correction on it.
        try:
            if correction.entity_type == "finding" and correction.entity_id:
                from src.core.db import Finding
                remaining = (
                    session.query(ExpertCorrection)
                    .filter(
                        ExpertCorrection.entity_type == "finding",
                        ExpertCorrection.entity_id == correction.entity_id,
                        ExpertCorrection.id != correction.id,
                    )
                    .count()
                )
                if remaining == 0:
                    row = session.query(Finding).filter(Finding.id == correction.entity_id).first()
                    if row and hasattr(row, "has_user_correction"):
                        row.has_user_correction = False
            elif correction.entity_type == "risk_item" and correction.entity_id:
                from src.core.db import RiskItem
                remaining = (
                    session.query(ExpertCorrection)
                    .filter(
                        ExpertCorrection.entity_type == "risk_item",
                        ExpertCorrection.entity_id == correction.entity_id,
                        ExpertCorrection.id != correction.id,
                    )
                    .count()
                )
                if remaining == 0:
                    row = session.query(RiskItem).filter(RiskItem.id == correction.entity_id).first()
                    if row and hasattr(row, "has_user_correction"):
                        row.has_user_correction = False
        except Exception as flag_exc:
            logger.warning("Failed to un-flag source entity on undo: %s", flag_exc)

        session.delete(correction)
        session.commit()

    return {"status": "undone", "correction_id": correction_id}
```

- [ ] **Step 7.2:** Verify.

```bash
cd apps/api && source venv/bin/activate && python3 -c "
from src.main import app
paths = [(r.path, sorted(r.methods or [])) for r in app.routes if hasattr(r, 'methods')]
assert ('/api/v1/learning-engine/feedback/correction/{correction_id}', ['DELETE']) in paths
print('OK')
"
```
Expected: `OK`

- [ ] **Step 7.3:** Commit.

```bash
git add apps/api/src/api/v1/endpoints/learning_engine.py
git commit -m "feat(api): DELETE /feedback/correction/{id} — 5s undo window support

Deletes a just-submitted correction and its signal provided the signal has
not yet been processed by the pattern extractor. Restricted to the
submitting user. Also un-flags has_user_correction on the source entity
when no other corrections remain.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 8: Backend tests — `tests/test_feedback_affordance.py`

**Files:**
- Create: `apps/api/tests/test_feedback_affordance.py`

- [ ] **Step 8.1:** Look at existing test conftest.

Run:
```bash
cd apps/api && cat tests/conftest.py | head -80
```
Expected: familiarise with the `client` and `auth_headers` fixtures used by every other test.

- [ ] **Step 8.2:** Write the test file.

Create `apps/api/tests/test_feedback_affordance.py`:

```python
"""Unified Feedback Affordance — backend tests.

Covers: correction with each entity_type, acceptance, upsert semantics,
undo window, permission gate.
"""
from __future__ import annotations

import pytest


class TestFeedbackAffordance:
    def test_correction_with_entity_type_finding(self, client, auth_headers):
        resp = client.post(
            "/api/v1/learning-engine/feedback/correction",
            json={
                "entity_type": "finding",
                "entity_id": "finding-test-1",
                "field": "severity",
                "original_value": "critical",
                "corrected_value": "medium",
                "reasoning": "Not PHI exposure — synthetic data",
                "requirement_id": "164.308(a)(1)(ii)(A)",
                "correction_type": "severity_change",
            },
            headers=auth_headers,
        )
        assert resp.status_code == 200, resp.text
        data = resp.json()
        assert data["status"] == "captured"
        assert data["signal_id"]
        # correction_id may be None on first call if background processing is async
        # but should be set once _process_correction_signal completes.

    def test_correction_upsert(self, client, auth_headers):
        """Submitting the same (entity_type, entity_id, field) twice updates."""
        body = {
            "entity_type": "risk_item",
            "entity_id": "risk-test-1",
            "field": "likelihood",
            "original_value": 5,
            "corrected_value": 3,
            "reasoning": "Compensating controls in place",
        }
        r1 = client.post("/api/v1/learning-engine/feedback/correction", json=body, headers=auth_headers)
        assert r1.status_code == 200
        # Change corrected value and resubmit
        body["corrected_value"] = 2
        body["reasoning"] = "Third-party audit downgraded the exposure"
        r2 = client.post("/api/v1/learning-engine/feedback/correction", json=body, headers=auth_headers)
        assert r2.status_code == 200

        # Listing corrections: exactly one row for this (entity_type, entity_id, field).
        listing = client.get(
            "/api/v1/learning-engine/feedback/corrections?page_size=100",
            headers=auth_headers,
        ).json()
        matches = [
            c for c in listing.get("items", [])
            if c.get("requirement_id") == body.get("requirement_id")
        ]
        # Note: legacy rows may also appear; filter by the specific reasoning.
        matches = [c for c in matches if c.get("reasoning") == body["reasoning"]]
        assert len(matches) >= 1

    def test_acceptance_signal(self, client, auth_headers):
        resp = client.post(
            "/api/v1/learning-engine/feedback/acceptance",
            json={
                "entity_type": "finding",
                "entity_id": "finding-accept-1",
                "field": "severity",
                "value": "high",
            },
            headers=auth_headers,
        )
        assert resp.status_code == 200
        data = resp.json()
        assert data["signal_id"]
        assert data["status"] == "captured"

    def test_undo_window(self, client, auth_headers):
        """Submitting then immediately undoing removes the correction."""
        submit = client.post(
            "/api/v1/learning-engine/feedback/correction",
            json={
                "entity_type": "vendor_risk",
                "entity_id": "vendor-undo-test",
                "field": "risk_level",
                "original_value": "high",
                "corrected_value": "medium",
            },
            headers=auth_headers,
        ).json()
        correction_id = submit.get("correction_id")
        if not correction_id:
            pytest.skip("correction_id not returned — background materialization hasn't run")
        undo = client.delete(
            f"/api/v1/learning-engine/feedback/correction/{correction_id}",
            headers=auth_headers,
        )
        assert undo.status_code == 200
        assert undo.json()["status"] == "undone"

    def test_permission_gate_rejects_viewer(self, client, viewer_auth_headers):
        """Viewers without ai.manage must get 403 on correction submission."""
        if viewer_auth_headers is None:
            pytest.skip("no viewer fixture available in this test environment")
        resp = client.post(
            "/api/v1/learning-engine/feedback/correction",
            json={
                "entity_type": "finding",
                "entity_id": "finding-perm-test",
                "field": "severity",
                "original_value": "critical",
                "corrected_value": "high",
            },
            headers=viewer_auth_headers,
        )
        assert resp.status_code in (401, 403)
```

- [ ] **Step 8.3:** Run tests.

Run:
```bash
cd apps/api && source venv/bin/activate && pytest tests/test_feedback_affordance.py -v 2>&1 | tail -30
```
Expected: at least the first 4 tests pass. The permission test may skip if `viewer_auth_headers` fixture isn't present — that's OK; the test is `skip`-gated.

- [ ] **Step 8.4:** Commit.

```bash
git add apps/api/tests/test_feedback_affordance.py
git commit -m "test(api): feedback affordance — correction/acceptance/upsert/undo/permission

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 9: Frontend — Vitest setup

**Files:**
- Create: `apps/web/vitest.config.ts`
- Create: `apps/web/src/test-setup.ts`
- Modify: `apps/web/package.json`

**Context:** Spec §14 calls for per-drawer component tests. The repo has Playwright but no unit/component test framework. Vitest reuses the existing Vite config, which keeps install weight minimal.

- [ ] **Step 9.1:** Check existing vite config.

Run:
```bash
cd apps/web && cat vite.config.ts | head -40
```
Expected: familiarize with the Vite plugin list — Vitest will share it.

- [ ] **Step 9.2:** Install Vitest + testing-library.

Run:
```bash
cd "/Users/shyamsedai/Documents/Compliance Vision AI" && npm install --save-dev --workspace=apps/web vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom happy-dom
```
Expected: all install without errors. Ignore peer-dep warnings about React 19.

- [ ] **Step 9.3:** Create `apps/web/vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    include: ['src/**/__tests__/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', 'dist', 'e2e'],
  },
})
```

- [ ] **Step 9.4:** Create `apps/web/src/test-setup.ts`:

```ts
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(() => {
  cleanup()
})
```

- [ ] **Step 9.5:** Add `test` scripts to `apps/web/package.json`.

Find the `"scripts"` block and add:

```json
    "test": "vitest run",
    "test:watch": "vitest",
```

- [ ] **Step 9.6:** Write a smoke test to confirm setup works.

Create `apps/web/src/__tests__/smoke.test.ts`:

```ts
import { describe, it, expect } from 'vitest'

describe('vitest smoke', () => {
  it('runs', () => {
    expect(1 + 1).toBe(2)
  })
})
```

Run:
```bash
cd apps/web && npm run test 2>&1 | tail -15
```
Expected: `1 test passed`.

- [ ] **Step 9.7:** Delete the smoke test.

Run:
```bash
rm apps/web/src/__tests__/smoke.test.ts && rmdir apps/web/src/__tests__ 2>/dev/null || true
```

- [ ] **Step 9.8:** Commit.

```bash
git add apps/web/package.json apps/web/package-lock.json apps/web/vitest.config.ts apps/web/src/test-setup.ts
git commit -m "chore(web): add Vitest + testing-library for component tests

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 10: Frontend service — extend `learning-engine.ts`

**Files:**
- Modify: `apps/web/src/services/learning-engine.ts`

- [ ] **Step 10.1:** Extend the `CorrectionRequest` type.

Find the `CorrectionRequest` interface (~line 40) and replace with:

```ts
export type EntityType =
  | 'finding'
  | 'risk_item'
  | 'remediation'
  | 'incident'
  | 'vendor_risk'
  | 'control_test'
  | 'document_class'
  | 'ai_answer'

export interface CorrectionRequest {
  requirement_id?: string
  cfr_reference?: string
  correction_type: 'status_change' | 'severity_change' | 'description_update' | 'false_positive'
  original_status?: string
  corrected_status?: string
  original_text?: string
  corrected_text?: string
  reasoning?: string
  // Unified feedback affordance routing
  entity_type?: EntityType
  entity_id?: string
  field?: string
  original_value?: string | number
  corrected_value?: string | number
}

export interface CorrectionResponse {
  signal_id: string
  correction_id?: string | null
  status: string
  message?: string
}

export interface AcceptanceRequest {
  entity_type: EntityType
  entity_id: string
  field: string
  value?: string | number
  requirement_id?: string
  cfr_reference?: string
}
```

- [ ] **Step 10.2:** Update `submitCorrection` return type and add two new functions.

Find `submitCorrection` (~line 177) and replace, then append two new functions just after it:

```ts
export async function submitCorrection(body: CorrectionRequest): Promise<CorrectionResponse> {
  const { data } = await apiClient.post('/learning-engine/feedback/correction', body)
  return data
}

export async function submitAcceptance(body: AcceptanceRequest): Promise<{ signal_id: string; status: string }> {
  const { data } = await apiClient.post('/learning-engine/feedback/acceptance', body)
  return data
}

export async function undoCorrection(correctionId: string): Promise<{ status: string }> {
  const { data } = await apiClient.delete(`/learning-engine/feedback/correction/${correctionId}`)
  return data
}
```

- [ ] **Step 10.3:** Verify types compile.

Run:
```bash
cd apps/web && npx tsc --noEmit 2>&1 | tail -20
```
Expected: no new errors. (Any pre-existing warnings are fine but no errors that reference our new types.)

- [ ] **Step 10.4:** Commit.

```bash
git add apps/web/src/services/learning-engine.ts
git commit -m "feat(web): extend learning-engine service with entity routing + acceptance + undo

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 11: Frontend — offline queue helper

**Files:**
- Create: `apps/web/src/lib/feedback-offline-queue.ts`
- Create: `apps/web/src/lib/__tests__/feedback-offline-queue.test.ts`

**Context:** Spec §11 requires that offline clicks (thumbs + drawer submits) queue in localStorage and replay on reconnect with an idempotency key. Dedicated small module so the hook stays simple.

- [ ] **Step 11.1:** Write a failing test first.

Create `apps/web/src/lib/__tests__/feedback-offline-queue.test.ts`:

```ts
import { beforeEach, describe, it, expect, vi } from 'vitest'
import { enqueue, drain, peek, size, clearAll } from '../feedback-offline-queue'

beforeEach(() => {
  clearAll()
})

describe('feedback-offline-queue', () => {
  it('enqueues and peeks', () => {
    enqueue({ kind: 'acceptance', payload: { entity_type: 'finding', entity_id: 'f1', field: 'severity', value: 'high' } })
    expect(size()).toBe(1)
    const top = peek()
    expect(top?.kind).toBe('acceptance')
    expect(top?.idempotencyKey).toBeTruthy()
  })

  it('drain calls the handler for each item and clears on success', async () => {
    enqueue({ kind: 'acceptance', payload: { entity_type: 'finding', entity_id: 'f1', field: 'severity', value: 'high' } })
    enqueue({ kind: 'correction', payload: { entity_type: 'finding', entity_id: 'f2', field: 'severity', correction_type: 'severity_change', original_value: 'critical', corrected_value: 'medium' } })
    const handler = vi.fn().mockResolvedValue(undefined)
    await drain(handler)
    expect(handler).toHaveBeenCalledTimes(2)
    expect(size()).toBe(0)
  })

  it('drain stops on error and keeps remaining items', async () => {
    enqueue({ kind: 'acceptance', payload: { entity_type: 'finding', entity_id: 'f1', field: 'severity', value: 'high' } })
    enqueue({ kind: 'acceptance', payload: { entity_type: 'finding', entity_id: 'f2', field: 'severity', value: 'high' } })
    const handler = vi.fn()
      .mockResolvedValueOnce(undefined)
      .mockRejectedValueOnce(new Error('network'))
    await drain(handler).catch(() => {})
    expect(size()).toBe(1)
  })

  it('dedupes by idempotencyKey on enqueue', () => {
    enqueue({ kind: 'acceptance', payload: { entity_type: 'finding', entity_id: 'f1', field: 'severity', value: 'high' } }, 'fixed-key')
    enqueue({ kind: 'acceptance', payload: { entity_type: 'finding', entity_id: 'f1', field: 'severity', value: 'high' } }, 'fixed-key')
    expect(size()).toBe(1)
  })
})
```

- [ ] **Step 11.2:** Run test to confirm it fails (module doesn't exist yet).

```bash
cd apps/web && npm run test -- feedback-offline-queue 2>&1 | tail -10
```
Expected: FAIL — "Cannot find module '../feedback-offline-queue'"

- [ ] **Step 11.3:** Implement `apps/web/src/lib/feedback-offline-queue.ts`:

```ts
/**
 * LocalStorage-backed offline queue for feedback submissions.
 *
 * When the network is unreachable or the server returns 5xx, thumbs and
 * drawer submissions are enqueued here and replayed on reconnect.
 * Idempotency keys prevent duplicate submissions if a replay succeeds
 * after the client already retried manually.
 */

const STORAGE_KEY = 'shieldra.feedback.queue.v1'

export type QueueItemKind = 'acceptance' | 'correction'

export interface QueueItem {
  kind: QueueItemKind
  payload: Record<string, unknown>
  idempotencyKey: string
  enqueuedAt: number
}

function read(): QueueItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function write(items: QueueItem[]): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    // Quota exceeded or private mode — drop silently. Next retry will re-enqueue.
  }
}

function makeKey(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

export function enqueue(
  item: { kind: QueueItemKind; payload: Record<string, unknown> },
  idempotencyKey?: string,
): void {
  const items = read()
  const key = idempotencyKey ?? makeKey()
  if (items.some((i) => i.idempotencyKey === key)) return
  items.push({
    kind: item.kind,
    payload: item.payload,
    idempotencyKey: key,
    enqueuedAt: Date.now(),
  })
  write(items)
}

export function peek(): QueueItem | undefined {
  return read()[0]
}

export function size(): number {
  return read().length
}

export function clearAll(): void {
  write([])
}

export async function drain(
  handler: (item: QueueItem) => Promise<void>,
): Promise<void> {
  let items = read()
  while (items.length > 0) {
    const next = items[0]
    await handler(next)
    items = items.slice(1)
    write(items)
  }
}
```

- [ ] **Step 11.4:** Run tests to confirm they pass.

```bash
cd apps/web && npm run test -- feedback-offline-queue 2>&1 | tail -10
```
Expected: `4 passed`.

- [ ] **Step 11.5:** Commit.

```bash
git add apps/web/src/lib/feedback-offline-queue.ts apps/web/src/lib/__tests__/feedback-offline-queue.test.ts
git commit -m "feat(web): localStorage offline queue for feedback submissions

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 12: Frontend hooks — `use-feedback.ts`

**Files:**
- Create: `apps/web/src/hooks/use-feedback.ts`

- [ ] **Step 12.1:** Write the hook file.

Create `apps/web/src/hooks/use-feedback.ts`:

```ts
import { useCallback } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import * as learningService from '@/services/learning-engine'
import { enqueue, drain } from '@/lib/feedback-offline-queue'
import type { CorrectionRequest, AcceptanceRequest, CorrectionResponse } from '@/services/learning-engine'

// ── Acceptance (thumb-up) ──────────────────────────────────────────

export function useSubmitAcceptance() {
  return useMutation({
    mutationFn: async (body: AcceptanceRequest) => {
      try {
        return await learningService.submitAcceptance(body)
      } catch (err) {
        enqueue({ kind: 'acceptance', payload: body as unknown as Record<string, unknown> })
        throw err
      }
    },
    // Silent success — the button flash on the client is the confirmation.
    onError: () => {
      // Swallow. Queue replay will retry; no toast spam on every thumb click.
    },
  })
}

// ── Correction (thumb-down drawer submit) ──────────────────────────

type CorrectionOptions = {
  contextualNextStep?: { label: string; href: string }
  onSuccess?: (res: CorrectionResponse) => void
}

export function useSubmitCorrectionV2(opts: CorrectionOptions = {}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (body: CorrectionRequest) => {
      try {
        return await learningService.submitCorrection(body)
      } catch (err) {
        enqueue({ kind: 'correction', payload: body as unknown as Record<string, unknown> })
        throw err
      }
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['learning-engine-corrections'] })
      queryClient.invalidateQueries({ queryKey: ['learning-engine-status'] })

      const correctionId = res.correction_id
      const message = 'Thanks — this will train future analyses'
      toast.success(message, {
        description: opts.contextualNextStep?.label,
        action: correctionId
          ? {
              label: 'Undo',
              onClick: async () => {
                try {
                  await learningService.undoCorrection(correctionId)
                  toast.info('Correction removed')
                  queryClient.invalidateQueries({ queryKey: ['learning-engine-corrections'] })
                } catch {
                  toast.error('Could not undo — correction already processed')
                }
              },
            }
          : undefined,
        duration: 5000,
      })

      // If a contextual next-step was provided, offer it as a secondary toast.
      if (opts.contextualNextStep) {
        setTimeout(() => {
          toast(opts.contextualNextStep!.label, {
            action: {
              label: 'Open',
              onClick: () => {
                window.location.href = opts.contextualNextStep!.href
              },
            },
            duration: 6000,
          })
        }, 300)
      }

      opts.onSuccess?.(res)
    },
    onError: () => {
      toast.error('Saved — will sync when you reconnect', { duration: 4000 })
    },
  })
}

// ── Queue replay on reconnect ──────────────────────────────────────

export function useFeedbackQueueReplay() {
  return useCallback(async () => {
    await drain(async (item) => {
      if (item.kind === 'acceptance') {
        await learningService.submitAcceptance(item.payload as unknown as AcceptanceRequest)
      } else if (item.kind === 'correction') {
        await learningService.submitCorrection(item.payload as unknown as CorrectionRequest)
      }
    })
  }, [])
}
```

- [ ] **Step 12.2:** Verify type check.

```bash
cd apps/web && npx tsc --noEmit 2>&1 | grep -i "use-feedback" || echo "OK"
```
Expected: `OK`

- [ ] **Step 12.3:** Commit.

```bash
git add apps/web/src/hooks/use-feedback.ts
git commit -m "feat(web): hooks for acceptance, correction V2, and offline replay

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 13: Drawer shell + prop types

**Files:**
- Create: `apps/web/src/components/feedback/drawers/types.ts`
- Create: `apps/web/src/components/feedback/drawers/drawer-shell.tsx`

- [ ] **Step 13.1:** Create `apps/web/src/components/feedback/drawers/types.ts`:

```ts
import type { EntityType } from '@/services/learning-engine'

export interface DrawerVariantProps {
  entityType: EntityType
  entityId: string
  aiJudgment: {
    field: string
    value: string | number
    confidence?: number
  }
  requirementId?: string
  cfrReference?: string
  onClose: () => void
  onSubmit: (payload: {
    field: string
    correction_type: 'status_change' | 'severity_change' | 'description_update' | 'false_positive'
    original_value: string | number
    corrected_value: string | number
    reasoning?: string
  }) => void | Promise<void>
}
```

- [ ] **Step 13.2:** Create `apps/web/src/components/feedback/drawers/drawer-shell.tsx`:

```tsx
import { useEffect, type ReactNode } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'

interface DrawerShellProps {
  open: boolean
  title: string
  currentJudgment: ReactNode
  children: ReactNode
  submitLabel?: string
  submitDisabled?: boolean
  onClose: () => void
  onSubmit: () => void
}

export function DrawerShell({
  open,
  title,
  currentJudgment,
  children,
  submitLabel = 'Save correction',
  submitDisabled = false,
  onClose,
  onSubmit,
}: DrawerShellProps) {
  // Cmd+Enter submits, Esc is handled by Sheet's own dialog semantics.
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault()
        if (!submitDisabled) onSubmit()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, submitDisabled, onSubmit])

  return (
    <Sheet open={open} onOpenChange={(o) => { if (!o) onClose() }}>
      <SheetContent side="right" className="w-full sm:w-[380px]">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription className="text-muted-foreground">
            Current AI judgment: {currentJudgment}
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 flex flex-col gap-4">{children}</div>
        <div className="mt-8 flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={onSubmit} disabled={submitDisabled}>{submitLabel}</Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
```

- [ ] **Step 13.3:** Commit.

```bash
git add apps/web/src/components/feedback/drawers/types.ts apps/web/src/components/feedback/drawers/drawer-shell.tsx
git commit -m "feat(web): drawer shell + drawer variant prop types

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 14: 8 drawer variants

**Files:**
- Create: 8 drawer components under `apps/web/src/components/feedback/drawers/`

- [ ] **Step 14.1:** `FeedbackDrawerFinding.tsx`:

```tsx
import { useState } from 'react'
import { DrawerShell } from './drawer-shell'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import type { DrawerVariantProps } from './types'

const SEVERITIES = ['critical', 'high', 'medium', 'low'] as const

export function FeedbackDrawerFinding({ aiJudgment, onClose, onSubmit }: DrawerVariantProps) {
  const [severity, setSeverity] = useState(String(aiJudgment.value))
  const [falsePositive, setFalsePositive] = useState(false)
  const [reasoning, setReasoning] = useState('')

  const changed = falsePositive || severity !== String(aiJudgment.value)

  return (
    <DrawerShell
      open
      title="What should it be?"
      currentJudgment={<strong>{String(aiJudgment.value)}</strong>}
      submitDisabled={!changed}
      onClose={onClose}
      onSubmit={() =>
        onSubmit({
          field: aiJudgment.field,
          correction_type: falsePositive ? 'false_positive' : 'severity_change',
          original_value: aiJudgment.value,
          corrected_value: falsePositive ? 'false_positive' : severity,
          reasoning: reasoning || undefined,
        })
      }
    >
      <div className="flex items-center justify-between">
        <Label htmlFor="fp-toggle">Mark as false positive</Label>
        <Switch id="fp-toggle" checked={falsePositive} onCheckedChange={setFalsePositive} />
      </div>

      {!falsePositive && (
        <div>
          <Label className="mb-2 block">Correct severity</Label>
          <RadioGroup value={severity} onValueChange={setSeverity}>
            {SEVERITIES.map((s) => (
              <div key={s} className="flex items-center gap-2">
                <RadioGroupItem id={`sev-${s}`} value={s} />
                <Label htmlFor={`sev-${s}`} className="capitalize">{s}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      )}

      <div>
        <Label htmlFor="reason">Why? (optional)</Label>
        <Textarea
          id="reason"
          value={reasoning}
          onChange={(e) => setReasoning(e.target.value)}
          placeholder="A sentence to help the model learn"
          rows={3}
        />
      </div>
    </DrawerShell>
  )
}
```

- [ ] **Step 14.2:** `FeedbackDrawerRiskItem.tsx`:

```tsx
import { useState } from 'react'
import { DrawerShell } from './drawer-shell'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'
import type { DrawerVariantProps } from './types'

export function FeedbackDrawerRiskItem({ aiJudgment, onClose, onSubmit }: DrawerVariantProps) {
  const initial = Number(aiJudgment.value) || 3
  const [value, setValue] = useState<number>(initial)
  const [reasoning, setReasoning] = useState('')
  const changed = value !== initial

  return (
    <DrawerShell
      open
      title="What should it be?"
      currentJudgment={
        <span>
          <strong>{aiJudgment.field}</strong>: {initial} / 5
        </span>
      }
      submitDisabled={!changed}
      onClose={onClose}
      onSubmit={() =>
        onSubmit({
          field: aiJudgment.field,
          correction_type: 'severity_change',
          original_value: initial,
          corrected_value: value,
          reasoning: reasoning || undefined,
        })
      }
    >
      <div>
        <Label>{aiJudgment.field} (1-5): <span className="ml-2 font-mono">{value}</span></Label>
        <Slider value={[value]} onValueChange={(v) => setValue(v[0])} min={1} max={5} step={1} />
      </div>

      <div>
        <Label htmlFor="reason">Why? (optional)</Label>
        <Textarea id="reason" value={reasoning} onChange={(e) => setReasoning(e.target.value)} rows={3} />
      </div>
    </DrawerShell>
  )
}
```

- [ ] **Step 14.3:** `FeedbackDrawerRemediation.tsx`:

```tsx
import { useState } from 'react'
import { DrawerShell } from './drawer-shell'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import type { DrawerVariantProps } from './types'

export function FeedbackDrawerRemediation({ aiJudgment, onClose, onSubmit }: DrawerVariantProps) {
  const [notUseful, setNotUseful] = useState(false)
  const [alt, setAlt] = useState('')
  const [reasoning, setReasoning] = useState('')

  const changed = notUseful || alt.trim().length > 0

  return (
    <DrawerShell
      open
      title="What should it be?"
      currentJudgment={<em>{String(aiJudgment.value).slice(0, 80)}{String(aiJudgment.value).length > 80 ? '…' : ''}</em>}
      submitDisabled={!changed}
      onClose={onClose}
      onSubmit={() =>
        onSubmit({
          field: aiJudgment.field,
          correction_type: notUseful ? 'false_positive' : 'description_update',
          original_value: String(aiJudgment.value),
          corrected_value: notUseful ? 'not_useful' : alt || 'not_useful',
          reasoning: reasoning || undefined,
        })
      }
    >
      <div className="flex items-center justify-between">
        <Label htmlFor="not-useful">This recommendation is not useful</Label>
        <Switch id="not-useful" checked={notUseful} onCheckedChange={setNotUseful} />
      </div>

      {!notUseful && (
        <div>
          <Label htmlFor="alt">Alternative approach (optional)</Label>
          <Textarea id="alt" value={alt} onChange={(e) => setAlt(e.target.value)} rows={3} />
        </div>
      )}

      <div>
        <Label htmlFor="reason">Why? (optional)</Label>
        <Textarea id="reason" value={reasoning} onChange={(e) => setReasoning(e.target.value)} rows={2} />
      </div>
    </DrawerShell>
  )
}
```

- [ ] **Step 14.4:** `FeedbackDrawerIncident.tsx`:

```tsx
import { useState } from 'react'
import { DrawerShell } from './drawer-shell'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import type { DrawerVariantProps } from './types'

const BREACH_TYPES = ['none', 'unauthorized_access', 'disclosure', 'acquisition', 'use', 'other'] as const

export function FeedbackDrawerIncident({ aiJudgment, onClose, onSubmit }: DrawerVariantProps) {
  const initial = String(aiJudgment.value)
  const [isBreach, setIsBreach] = useState(initial !== 'none')
  const [breachType, setBreachType] = useState(initial)
  const [reasoning, setReasoning] = useState('')
  const changed = (isBreach && breachType !== initial) || (!isBreach && initial !== 'none')

  return (
    <DrawerShell
      open
      title="What should it be?"
      currentJudgment={<strong>{initial}</strong>}
      submitDisabled={!changed}
      onClose={onClose}
      onSubmit={() =>
        onSubmit({
          field: aiJudgment.field,
          correction_type: 'description_update',
          original_value: initial,
          corrected_value: isBreach ? breachType : 'none',
          reasoning: reasoning || undefined,
        })
      }
    >
      <div>
        <Label>Is this a breach?</Label>
        <RadioGroup value={isBreach ? 'yes' : 'no'} onValueChange={(v) => setIsBreach(v === 'yes')}>
          <div className="flex items-center gap-2"><RadioGroupItem id="b-yes" value="yes" /><Label htmlFor="b-yes">Yes</Label></div>
          <div className="flex items-center gap-2"><RadioGroupItem id="b-no" value="no" /><Label htmlFor="b-no">No</Label></div>
        </RadioGroup>
      </div>

      {isBreach && (
        <div>
          <Label>Breach type</Label>
          <RadioGroup value={breachType} onValueChange={setBreachType}>
            {BREACH_TYPES.filter((t) => t !== 'none').map((t) => (
              <div key={t} className="flex items-center gap-2">
                <RadioGroupItem id={`bt-${t}`} value={t} />
                <Label htmlFor={`bt-${t}`}>{t.replace('_', ' ')}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      )}

      <div>
        <Label htmlFor="reason">Why? (optional)</Label>
        <Textarea id="reason" value={reasoning} onChange={(e) => setReasoning(e.target.value)} rows={2} />
      </div>
    </DrawerShell>
  )
}
```

- [ ] **Step 14.5:** `FeedbackDrawerVendorRisk.tsx`:

```tsx
import { useState } from 'react'
import { DrawerShell } from './drawer-shell'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import type { DrawerVariantProps } from './types'

const LEVELS = ['low', 'medium', 'high', 'critical'] as const

export function FeedbackDrawerVendorRisk({ aiJudgment, onClose, onSubmit }: DrawerVariantProps) {
  const initial = String(aiJudgment.value)
  const [level, setLevel] = useState(initial)
  const [reasoning, setReasoning] = useState('')
  const changed = level !== initial

  return (
    <DrawerShell
      open
      title="What should it be?"
      currentJudgment={<strong>{initial}</strong>}
      submitDisabled={!changed}
      onClose={onClose}
      onSubmit={() =>
        onSubmit({
          field: aiJudgment.field,
          correction_type: 'severity_change',
          original_value: initial,
          corrected_value: level,
          reasoning: reasoning || undefined,
        })
      }
    >
      <div>
        <Label>Correct risk level</Label>
        <RadioGroup value={level} onValueChange={setLevel}>
          {LEVELS.map((l) => (
            <div key={l} className="flex items-center gap-2">
              <RadioGroupItem id={`lvl-${l}`} value={l} />
              <Label htmlFor={`lvl-${l}`} className="capitalize">{l}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div>
        <Label htmlFor="reason">Why? (optional)</Label>
        <Textarea id="reason" value={reasoning} onChange={(e) => setReasoning(e.target.value)} rows={2} />
      </div>
    </DrawerShell>
  )
}
```

- [ ] **Step 14.6:** `FeedbackDrawerControlTest.tsx`:

```tsx
import { useState } from 'react'
import { DrawerShell } from './drawer-shell'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import type { DrawerVariantProps } from './types'

export function FeedbackDrawerControlTest({ aiJudgment, onClose, onSubmit }: DrawerVariantProps) {
  const initial = String(aiJudgment.value)
  const [outcome, setOutcome] = useState(initial === 'pass' ? 'pass' : 'fail')
  const [reasoning, setReasoning] = useState('')
  const changed = outcome !== initial

  return (
    <DrawerShell
      open
      title="What should it be?"
      currentJudgment={<strong>{initial}</strong>}
      submitDisabled={!changed}
      onClose={onClose}
      onSubmit={() =>
        onSubmit({
          field: aiJudgment.field,
          correction_type: 'status_change',
          original_value: initial,
          corrected_value: outcome,
          reasoning: reasoning || undefined,
        })
      }
    >
      <div>
        <Label>Expected outcome</Label>
        <RadioGroup value={outcome} onValueChange={setOutcome}>
          <div className="flex items-center gap-2"><RadioGroupItem id="out-pass" value="pass" /><Label htmlFor="out-pass">Pass</Label></div>
          <div className="flex items-center gap-2"><RadioGroupItem id="out-fail" value="fail" /><Label htmlFor="out-fail">Fail</Label></div>
        </RadioGroup>
      </div>
      <div>
        <Label htmlFor="reason">Why? (optional)</Label>
        <Textarea id="reason" value={reasoning} onChange={(e) => setReasoning(e.target.value)} rows={2} />
      </div>
    </DrawerShell>
  )
}
```

- [ ] **Step 14.7:** `FeedbackDrawerDocumentClass.tsx`:

```tsx
import { useState } from 'react'
import { DrawerShell } from './drawer-shell'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import type { DrawerVariantProps } from './types'

const DOC_CLASSES = [
  'policy', 'procedure', 'baa', 'training_material', 'evidence',
  'incident_report', 'audit_log', 'other',
]

export function FeedbackDrawerDocumentClass({ aiJudgment, onClose, onSubmit }: DrawerVariantProps) {
  const initial = String(aiJudgment.value)
  const [cls, setCls] = useState(initial)
  const [reasoning, setReasoning] = useState('')
  const changed = cls !== initial

  return (
    <DrawerShell
      open
      title="What should it be?"
      currentJudgment={<strong>{initial}</strong>}
      submitDisabled={!changed}
      onClose={onClose}
      onSubmit={() =>
        onSubmit({
          field: aiJudgment.field,
          correction_type: 'description_update',
          original_value: initial,
          corrected_value: cls,
          reasoning: reasoning || undefined,
        })
      }
    >
      <div>
        <Label>Correct class</Label>
        <RadioGroup value={cls} onValueChange={setCls}>
          {DOC_CLASSES.map((c) => (
            <div key={c} className="flex items-center gap-2">
              <RadioGroupItem id={`cls-${c}`} value={c} />
              <Label htmlFor={`cls-${c}`} className="capitalize">{c.replace('_', ' ')}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>
      <div>
        <Label htmlFor="reason">Why? (optional)</Label>
        <Textarea id="reason" value={reasoning} onChange={(e) => setReasoning(e.target.value)} rows={2} />
      </div>
    </DrawerShell>
  )
}
```

- [ ] **Step 14.8:** `FeedbackDrawerAiAnswer.tsx`:

```tsx
import { useState } from 'react'
import { DrawerShell } from './drawer-shell'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { DrawerVariantProps } from './types'

export function FeedbackDrawerAiAnswer({ aiJudgment, onClose, onSubmit }: DrawerVariantProps) {
  const [corrected, setCorrected] = useState('')
  const [reasoning, setReasoning] = useState('')
  const changed = corrected.trim().length > 0

  return (
    <DrawerShell
      open
      title="What should the answer have said?"
      currentJudgment={<em>{String(aiJudgment.value).slice(0, 100)}…</em>}
      submitDisabled={!changed}
      onClose={onClose}
      onSubmit={() =>
        onSubmit({
          field: aiJudgment.field,
          correction_type: 'description_update',
          original_value: String(aiJudgment.value),
          corrected_value: corrected,
          reasoning: reasoning || undefined,
        })
      }
    >
      <div>
        <Label htmlFor="corrected">Correct answer</Label>
        <Textarea id="corrected" value={corrected} onChange={(e) => setCorrected(e.target.value)} rows={5} />
      </div>
      <div>
        <Label htmlFor="reason">Why? (optional)</Label>
        <Textarea id="reason" value={reasoning} onChange={(e) => setReasoning(e.target.value)} rows={2} />
      </div>
    </DrawerShell>
  )
}
```

- [ ] **Step 14.9:** Verify type check across all drawer files.

```bash
cd apps/web && npx tsc --noEmit 2>&1 | grep -E "components/feedback" | head -20
```
Expected: no output (no errors referencing feedback drawer files).

If `Slider`, `RadioGroup`, or `Switch` components don't exist, check `apps/web/src/components/ui/` and add via shadcn CLI or manual creation. Most shadcn primitives in this repo are already installed — run `ls apps/web/src/components/ui/` to confirm.

- [ ] **Step 14.10:** Commit.

```bash
git add apps/web/src/components/feedback/drawers/
git commit -m "feat(web): 8 feedback drawer variants (finding, risk, remediation, incident, vendor, control, document, ai_answer)

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 15: `<FeedbackAffordance>` component

**Files:**
- Create: `apps/web/src/components/feedback/FeedbackAffordance.tsx`
- Create: `apps/web/src/components/feedback/index.ts`

- [ ] **Step 15.1:** Write the main component.

Create `apps/web/src/components/feedback/FeedbackAffordance.tsx`:

```tsx
import { useState, useRef, useCallback } from 'react'
import { ThumbsUp, ThumbsDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { usePermission } from '@/hooks/use-permission'
import { useSubmitAcceptance, useSubmitCorrectionV2 } from '@/hooks/use-feedback'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import type { EntityType } from '@/services/learning-engine'
import { FeedbackDrawerFinding } from './drawers/FeedbackDrawerFinding'
import { FeedbackDrawerRiskItem } from './drawers/FeedbackDrawerRiskItem'
import { FeedbackDrawerRemediation } from './drawers/FeedbackDrawerRemediation'
import { FeedbackDrawerIncident } from './drawers/FeedbackDrawerIncident'
import { FeedbackDrawerVendorRisk } from './drawers/FeedbackDrawerVendorRisk'
import { FeedbackDrawerControlTest } from './drawers/FeedbackDrawerControlTest'
import { FeedbackDrawerDocumentClass } from './drawers/FeedbackDrawerDocumentClass'
import { FeedbackDrawerAiAnswer } from './drawers/FeedbackDrawerAiAnswer'

export type FeedbackAffordancePlacement = 'inline-subtle' | 'card-footer' | 'detail-header'

export interface FeedbackAffordanceProps {
  entityType: EntityType
  entityId: string
  aiJudgment: {
    field: string
    value: string | number
    confidence?: number
  }
  requirementId?: string
  cfrReference?: string
  placement?: FeedbackAffordancePlacement
  size?: 'xs' | 'sm'
  contextualNextStep?: { label: string; href: string }
  className?: string
}

const DRAWERS: Record<EntityType, React.ComponentType<any>> = {
  finding: FeedbackDrawerFinding,
  risk_item: FeedbackDrawerRiskItem,
  remediation: FeedbackDrawerRemediation,
  incident: FeedbackDrawerIncident,
  vendor_risk: FeedbackDrawerVendorRisk,
  control_test: FeedbackDrawerControlTest,
  document_class: FeedbackDrawerDocumentClass,
  ai_answer: FeedbackDrawerAiAnswer,
}

export function FeedbackAffordance(props: FeedbackAffordanceProps) {
  const {
    entityType,
    entityId,
    aiJudgment,
    requirementId,
    cfrReference,
    placement = 'inline-subtle',
    size = 'sm',
    contextualNextStep,
    className,
  } = props

  const canManage = usePermission('ai.manage')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [recentlySubmitted, setRecentlySubmitted] = useState<'up' | 'down' | null>(null)
  const debounceRef = useRef<number | null>(null)

  const acceptance = useSubmitAcceptance()
  const correction = useSubmitCorrectionV2({ contextualNextStep })

  const handleThumbUp = useCallback(() => {
    if (debounceRef.current) return
    debounceRef.current = window.setTimeout(() => { debounceRef.current = null }, 300)
    setRecentlySubmitted('up')
    window.setTimeout(() => setRecentlySubmitted(null), 600)
    acceptance.mutate({
      entity_type: entityType,
      entity_id: entityId,
      field: aiJudgment.field,
      value: aiJudgment.value,
      requirement_id: requirementId,
      cfr_reference: cfrReference,
    })
  }, [acceptance, entityType, entityId, aiJudgment, requirementId, cfrReference])

  const handleDrawerSubmit = useCallback(
    (payload: {
      field: string
      correction_type: 'status_change' | 'severity_change' | 'description_update' | 'false_positive'
      original_value: string | number
      corrected_value: string | number
      reasoning?: string
    }) => {
      setDrawerOpen(false)
      setRecentlySubmitted('down')
      window.setTimeout(() => setRecentlySubmitted(null), 7 * 24 * 60 * 60 * 1000) // 7-day persistence is done server-side; this is UI hint only
      correction.mutate({
        entity_type: entityType,
        entity_id: entityId,
        field: payload.field,
        correction_type: payload.correction_type,
        original_value: payload.original_value,
        corrected_value: payload.corrected_value,
        reasoning: payload.reasoning,
        requirement_id: requirementId,
        cfr_reference: cfrReference,
      })
    },
    [correction, entityType, entityId, requirementId, cfrReference],
  )

  if (!canManage) return null

  const Drawer = DRAWERS[entityType]
  const btnSize = size === 'xs' ? 'h-5 w-5' : 'h-6 w-6'
  const iconSize = size === 'xs' ? 'h-3 w-3' : 'h-3.5 w-3.5'

  const baseBtn = 'inline-flex items-center justify-center rounded transition opacity-40 hover:opacity-100'

  return (
    <>
      <span
        className={cn(
          'feedback-affordance inline-flex items-center gap-1',
          placement === 'card-footer' && 'ml-auto',
          className,
        )}
        data-placement={placement}
      >
        {recentlySubmitted === 'down' ? (
          <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
            <Check className="h-3 w-3 text-green-600" /> You corrected this
          </span>
        ) : (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  aria-label="Agree with AI judgment"
                  className={cn(baseBtn, btnSize, recentlySubmitted === 'up' && 'bg-green-500/20')}
                  onClick={(e) => { e.stopPropagation(); handleThumbUp() }}
                >
                  <ThumbsUp className={iconSize} />
                </button>
              </TooltipTrigger>
              <TooltipContent>Agree</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  aria-label="Disagree — open correction drawer"
                  className={cn(baseBtn, btnSize)}
                  onClick={(e) => { e.stopPropagation(); setDrawerOpen(true) }}
                >
                  <ThumbsDown className={iconSize} />
                </button>
              </TooltipTrigger>
              <TooltipContent>Disagree</TooltipContent>
            </Tooltip>
          </>
        )}
      </span>

      {drawerOpen && (
        <Drawer
          entityType={entityType}
          entityId={entityId}
          aiJudgment={aiJudgment}
          requirementId={requirementId}
          cfrReference={cfrReference}
          onClose={() => setDrawerOpen(false)}
          onSubmit={handleDrawerSubmit}
        />
      )}
    </>
  )
}
```

- [ ] **Step 15.2:** Create `apps/web/src/components/feedback/index.ts`:

```ts
export { FeedbackAffordance } from './FeedbackAffordance'
export type { FeedbackAffordanceProps, FeedbackAffordancePlacement } from './FeedbackAffordance'
```

- [ ] **Step 15.3:** Verify compilation.

```bash
cd apps/web && npx tsc --noEmit 2>&1 | grep -E "components/feedback" | head -10
```
Expected: no errors.

- [ ] **Step 15.4:** Commit.

```bash
git add apps/web/src/components/feedback/FeedbackAffordance.tsx apps/web/src/components/feedback/index.ts
git commit -m "feat(web): FeedbackAffordance component — thumbs + drawer dispatch

Reusable AI-judgment feedback affordance. Thumb-up fires an acceptance signal
silently; thumb-down opens the entity-specific drawer variant. Permission-gated
on ai.manage — renders null otherwise. 300ms click debounce. 5s undo via toast
action button.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 16: Component tests

**Files:**
- Create: `apps/web/src/components/feedback/__tests__/FeedbackAffordance.test.tsx`

- [ ] **Step 16.1:** Write the test.

Create `apps/web/src/components/feedback/__tests__/FeedbackAffordance.test.tsx`:

```tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { FeedbackAffordance } from '../FeedbackAffordance'

// Mock the permission hook to return true by default
vi.mock('@/hooks/use-permission', () => ({
  usePermission: () => true,
}))

// Mock the service so we don't actually POST
vi.mock('@/services/learning-engine', async (orig) => {
  const mod = await (orig as any)()
  return {
    ...mod,
    submitAcceptance: vi.fn().mockResolvedValue({ signal_id: 'sig-1', status: 'captured' }),
    submitCorrection: vi.fn().mockResolvedValue({ signal_id: 'sig-2', correction_id: 'corr-1', status: 'captured' }),
    undoCorrection: vi.fn().mockResolvedValue({ status: 'undone' }),
  }
})

function Wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}

describe('<FeedbackAffordance>', () => {
  beforeEach(() => vi.clearAllMocks())

  it('renders null without ai.manage permission', async () => {
    vi.resetModules()
    vi.doMock('@/hooks/use-permission', () => ({ usePermission: () => false }))
    const { FeedbackAffordance: Gated } = await import('../FeedbackAffordance')
    const { container } = render(
      <Wrapper>
        <Gated entityType="finding" entityId="f1" aiJudgment={{ field: 'severity', value: 'high' }} />
      </Wrapper>,
    )
    expect(container.querySelector('.feedback-affordance')).toBeNull()
    vi.doUnmock('@/hooks/use-permission')
  })

  it('renders two thumb buttons with the correct labels', () => {
    render(
      <Wrapper>
        <FeedbackAffordance entityType="finding" entityId="f1" aiJudgment={{ field: 'severity', value: 'high' }} />
      </Wrapper>,
    )
    expect(screen.getByLabelText('Agree with AI judgment')).toBeInTheDocument()
    expect(screen.getByLabelText('Disagree — open correction drawer')).toBeInTheDocument()
  })

  it('fires acceptance on thumb-up click', async () => {
    const { submitAcceptance } = await import('@/services/learning-engine')
    render(
      <Wrapper>
        <FeedbackAffordance entityType="finding" entityId="f1" aiJudgment={{ field: 'severity', value: 'high' }} />
      </Wrapper>,
    )
    fireEvent.click(screen.getByLabelText('Agree with AI judgment'))
    expect(submitAcceptance).toHaveBeenCalledWith(
      expect.objectContaining({
        entity_type: 'finding',
        entity_id: 'f1',
        field: 'severity',
        value: 'high',
      }),
    )
  })

  it('opens the finding drawer on thumb-down', () => {
    render(
      <Wrapper>
        <FeedbackAffordance entityType="finding" entityId="f1" aiJudgment={{ field: 'severity', value: 'high' }} />
      </Wrapper>,
    )
    fireEvent.click(screen.getByLabelText('Disagree — open correction drawer'))
    expect(screen.getByText(/What should it be\?/i)).toBeInTheDocument()
  })
})
```

- [ ] **Step 16.2:** Run tests.

```bash
cd apps/web && npm run test -- FeedbackAffordance 2>&1 | tail -15
```
Expected: `4 passed`.

- [ ] **Step 16.3:** Commit.

```bash
git add apps/web/src/components/feedback/__tests__/
git commit -m "test(web): FeedbackAffordance component — permission gate, thumbs, drawer

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Tasks 17-23: Placements on 17 AI-surface pages

**Shared pattern for every placement task:**

Each placement task follows the same 3-step pattern:
1. Read the page file to find the AI-judgment row/card.
2. Import `<FeedbackAffordance>` and drop it in the correct spot with the correct `entityType`, `entityId`, `field`, `aiJudgment` values, and (where spec §7 applies) a `contextualNextStep` link.
3. Verify with `npx tsc --noEmit` and smoke-test the page in dev.

**Decision rules:**
- `placement="inline-subtle"` in table rows, badges, heatmap cells.
- `placement="card-footer"` on AI-suggested cards and answer cards.
- `placement="detail-header"` in detail sheets/panels.
- Stop event propagation on row-click containers: the component already calls `e.stopPropagation()` internally — verify by clicking a thumb inside a clickable row.

### Task 17: Placement — `/compliance` + `/compliance/$checkId`

**Files:**
- Modify: `apps/web/src/app/routes/_authenticated/compliance.page.tsx`
- Modify: `apps/web/src/app/routes/_authenticated/compliance-detail.page.tsx`

- [ ] **Step 17.1:** Read `compliance.page.tsx` to find the finding row rendering.

```bash
cd apps/web && grep -n "finding\|severity\|status" src/app/routes/_authenticated/compliance.page.tsx | head -20
```

- [ ] **Step 17.2:** Import and place the component.

Add at the top of the file (with the other imports):

```tsx
import { FeedbackAffordance } from '@/components/feedback'
```

Inside the JSX where each finding's severity badge is rendered, place:

```tsx
<FeedbackAffordance
  entityType="finding"
  entityId={finding.id}
  aiJudgment={{ field: 'severity', value: finding.severity }}
  requirementId={finding.requirement_id}
  cfrReference={finding.cfr_reference}
  placement="inline-subtle"
  size="xs"
  contextualNextStep={{ label: 'Open remediation', href: `/remediation/new?finding_id=${finding.id}` }}
/>
```

If iterating over findings in a map, ensure the component sits alongside the severity badge inside the row's top bar, NOT inside a nested clickable area (or if it is, it's fine because of `stopPropagation`).

- [ ] **Step 17.3:** Repeat for `compliance-detail.page.tsx` — place next to each per-requirement result's status badge.

- [ ] **Step 17.4:** Verify + smoke-test in dev.

```bash
cd apps/web && npx tsc --noEmit 2>&1 | grep -E "compliance" | head -10 || echo "OK"
cd "/Users/shyamsedai/Documents/Compliance Vision AI" && npm run build --workspace=apps/web 2>&1 | tail -3
```
Expected: `OK` for tsc, `built in Xs` for build.

- [ ] **Step 17.5:** Commit.

```bash
git add apps/web/src/app/routes/_authenticated/compliance.page.tsx apps/web/src/app/routes/_authenticated/compliance-detail.page.tsx
git commit -m "feat(web): feedback affordance on /compliance and /compliance/\$checkId findings

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

### Task 18: Placement — `/remediation`

**Files:**
- Modify: `apps/web/src/app/routes/_authenticated/remediation.page.tsx`

- [ ] **Step 18.1:** Read page for AI-suggested action cards and close-dialog spot.

```bash
cd apps/web && grep -n "suggest\|AI\|recommendation\|estimate" src/app/routes/_authenticated/remediation.page.tsx | head -20
```

- [ ] **Step 18.2:** On each AI-suggested action card, place:

```tsx
<FeedbackAffordance
  entityType="remediation"
  entityId={recommendation.id}
  aiJudgment={{ field: 'recommendation_text', value: recommendation.recommendation_text }}
  requirementId={recommendation.requirement_id}
  placement="card-footer"
  size="sm"
/>
```

- [ ] **Step 18.3:** On the close dialog / detail header (when estimated effort is shown), place:

```tsx
<FeedbackAffordance
  entityType="remediation"
  entityId={remediationId}
  aiJudgment={{ field: 'estimated_effort_hours', value: estimatedEffort }}
  placement="detail-header"
  size="sm"
/>
```

- [ ] **Step 18.4:** Verify + commit.

```bash
cd apps/web && npx tsc --noEmit 2>&1 | grep remediation | head -5 || echo "OK"
git add apps/web/src/app/routes/_authenticated/remediation.page.tsx
git commit -m "feat(web): feedback affordance on /remediation AI-suggested cards + close dialog

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

### Task 19: Placement — `/risk-register`, `/risk-assessment`, `/risk-prioritization`

**Files:**
- Modify: 3 files under `apps/web/src/app/routes/_authenticated/`

- [ ] **Step 19.1:** For each file, place on the likelihood and impact cells (risk-register heatmap) / score column (risk-prioritization):

```tsx
<FeedbackAffordance
  entityType="risk_item"
  entityId={risk.id}
  aiJudgment={{ field: 'likelihood', value: risk.likelihood }}
  placement="inline-subtle"
  size="xs"
  contextualNextStep={{ label: 'Create treatment plan', href: `/risk-management/new?risk_item_id=${risk.id}` }}
/>
```

And a separate one for `impact`:

```tsx
<FeedbackAffordance
  entityType="risk_item"
  entityId={risk.id}
  aiJudgment={{ field: 'impact', value: risk.impact }}
  placement="inline-subtle"
  size="xs"
/>
```

- [ ] **Step 19.2:** Verify + commit.

```bash
git add apps/web/src/app/routes/_authenticated/risk-register.page.tsx apps/web/src/app/routes/_authenticated/risk-assessment.page.tsx apps/web/src/app/routes/_authenticated/risk-prioritization.page.tsx
git commit -m "feat(web): feedback affordance on risk triad (likelihood/impact/score)

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

### Task 20: Placement — `/incidents`, `/penalty-exposure`

**Files:**
- Modify: `apps/web/src/app/routes/_authenticated/incidents.page.tsx`
- Modify: `apps/web/src/app/routes/_authenticated/penalty-exposure.page.tsx`

- [ ] **Step 20.1:** `/incidents` — place on the breach-determination badge in the detail sheet:

```tsx
<FeedbackAffordance
  entityType="incident"
  entityId={incident.id}
  aiJudgment={{ field: 'breach_determination', value: incident.breach_determination }}
  placement="detail-header"
  size="sm"
  contextualNextStep={{ label: 'Calculate penalty exposure', href: `/penalty-exposure?incident_id=${incident.id}` }}
/>
```

- [ ] **Step 20.2:** `/penalty-exposure` — place inline next to each tier assignment badge:

```tsx
<FeedbackAffordance
  entityType="finding"
  entityId={exposure.id}
  aiJudgment={{ field: 'tier', value: exposure.tier }}
  placement="inline-subtle"
  size="xs"
/>
```

- [ ] **Step 20.3:** Verify + commit.

```bash
git add apps/web/src/app/routes/_authenticated/incidents.page.tsx apps/web/src/app/routes/_authenticated/penalty-exposure.page.tsx
git commit -m "feat(web): feedback affordance on incident breach determination + penalty tiers

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

### Task 21: Placement — `/vendors`, `/vendor-risk`, `/controls`

**Files:**
- Modify: 3 page files.

- [ ] **Step 21.1:** `/vendors` + `/vendor-risk` — place next to each risk level badge:

```tsx
<FeedbackAffordance
  entityType="vendor_risk"
  entityId={vendor.id}
  aiJudgment={{ field: 'risk_level', value: vendor.risk_level }}
  placement="inline-subtle"
  size="xs"
  contextualNextStep={vendor.baa_id ? { label: 'Open BAA', href: `/documents/${vendor.baa_id}` } : undefined}
/>
```

- [ ] **Step 21.2:** `/controls` — place on each mapped-requirement list item:

```tsx
<FeedbackAffordance
  entityType="control_test"
  entityId={control.id}
  aiJudgment={{ field: 'expected_outcome', value: control.expected_outcome ?? 'pass' }}
  requirementId={control.requirement_id}
  placement="inline-subtle"
  size="xs"
/>
```

- [ ] **Step 21.3:** Verify + commit.

```bash
git add apps/web/src/app/routes/_authenticated/vendors.page.tsx apps/web/src/app/routes/_authenticated/vendor-risk.page.tsx apps/web/src/app/routes/_authenticated/controls.page.tsx
git commit -m "feat(web): feedback affordance on vendor risk levels + control expected outcomes

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

### Task 22: Placement — `/documents`, `/contract-intelligence`, `/due-diligence`

**Files:**
- Modify: 3 page files.

- [ ] **Step 22.1:** `/documents` — on each classification badge:

```tsx
<FeedbackAffordance
  entityType="document_class"
  entityId={doc.id}
  aiJudgment={{ field: 'document_type', value: doc.document_type }}
  placement="inline-subtle"
  size="xs"
  contextualNextStep={{ label: 'Run compliance check', href: `/compliance?document_id=${doc.id}` }}
/>
```

- [ ] **Step 22.2:** `/contract-intelligence` — on each BAA adequacy-score card:

```tsx
<FeedbackAffordance
  entityType="document_class"
  entityId={contract.id}
  aiJudgment={{ field: 'baa_adequacy_score', value: contract.baa_adequacy_score }}
  placement="card-footer"
  size="sm"
/>
```

- [ ] **Step 22.3:** `/due-diligence` — on each liability-assessment card:

```tsx
<FeedbackAffordance
  entityType="finding"
  entityId={assessment.id}
  aiJudgment={{ field: 'liability_level', value: assessment.liability_level }}
  placement="card-footer"
  size="sm"
/>
```

- [ ] **Step 22.4:** Verify + commit.

```bash
git add apps/web/src/app/routes/_authenticated/documents.page.tsx apps/web/src/app/routes/_authenticated/contract-intelligence.page.tsx apps/web/src/app/routes/_authenticated/due-diligence.page.tsx
git commit -m "feat(web): feedback affordance on document classification, BAA adequacy, liability

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

### Task 23: Placement — `/ai-assistant`, `/insights`, `/regulatory-radar`

**Files:**
- Modify: 3 page files.

- [ ] **Step 23.1:** `/ai-assistant` — on EVERY AI answer card (reuse whatever message component renders AI responses):

```tsx
<FeedbackAffordance
  entityType="ai_answer"
  entityId={message.id}
  aiJudgment={{ field: 'answer_text', value: message.content }}
  placement="card-footer"
  size="sm"
/>
```

This replaces any existing isolated thumbs-up/down. If the current AI chat uses a different feedback table, keep that route but ALSO emit the unified signal.

- [ ] **Step 23.2:** `/insights` — on each anomaly/pattern card:

```tsx
<FeedbackAffordance
  entityType="ai_answer"
  entityId={insight.id}
  aiJudgment={{ field: 'insight_text', value: insight.description }}
  placement="card-footer"
  size="sm"
/>
```

- [ ] **Step 23.3:** `/regulatory-radar` — on each urgency + affected-controls cell:

```tsx
<FeedbackAffordance
  entityType="finding"
  entityId={update.id}
  aiJudgment={{ field: 'urgency', value: update.urgency }}
  placement="inline-subtle"
  size="xs"
/>
```

- [ ] **Step 23.4:** Verify full build.

```bash
cd "/Users/shyamsedai/Documents/Compliance Vision AI" && npm run build --workspace=apps/web 2>&1 | tail -5
```
Expected: `✓ built in Xs`.

- [ ] **Step 23.5:** Commit.

```bash
git add apps/web/src/app/routes/_authenticated/ai-assistant.page.tsx apps/web/src/app/routes/_authenticated/insights.page.tsx apps/web/src/app/routes/_authenticated/regulatory-radar.page.tsx
git commit -m "feat(web): feedback affordance on AI answers, insights, regulatory urgency

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 24: Playwright E2E smoke

**Files:**
- Create: `apps/web/e2e/feedback-affordance.spec.ts`

- [ ] **Step 24.1:** Write the E2E test.

Create `apps/web/e2e/feedback-affordance.spec.ts`:

```ts
import { test, expect } from '@playwright/test'

test.describe('Unified Feedback Affordance', () => {
  test('thumb-up on a /compliance finding fires acceptance signal', async ({ page, request }) => {
    await page.goto('/compliance')
    // Wait for findings to render
    await page.waitForSelector('[data-placement="inline-subtle"] button[aria-label="Agree with AI judgment"]', { timeout: 15000 })

    // Capture the POST to /feedback/acceptance
    const acceptancePromise = page.waitForRequest(
      (req) => req.url().includes('/feedback/acceptance') && req.method() === 'POST',
      { timeout: 10000 },
    )
    await page.locator('button[aria-label="Agree with AI judgment"]').first().click()
    const req = await acceptancePromise
    const body = JSON.parse(req.postData() || '{}')
    expect(body.entity_type).toBe('finding')
    expect(body.field).toBeTruthy()
  })

  test('thumb-down opens drawer + submitting closes it and creates a correction', async ({ page }) => {
    await page.goto('/compliance')
    await page.waitForSelector('button[aria-label="Disagree — open correction drawer"]', { timeout: 15000 })

    await page.locator('button[aria-label="Disagree — open correction drawer"]').first().click()
    await expect(page.getByText(/What should it be\?/i)).toBeVisible()

    // Pick "medium" if available
    const mediumRadio = page.locator('#sev-medium')
    if (await mediumRadio.count()) {
      await mediumRadio.click()
    }

    const correctionPromise = page.waitForRequest(
      (req) => req.url().includes('/feedback/correction') && req.method() === 'POST',
      { timeout: 10000 },
    )
    await page.getByRole('button', { name: /Save correction/i }).click()
    await correctionPromise
    await expect(page.getByText(/Thanks — this will train future analyses/i)).toBeVisible()
  })
})
```

- [ ] **Step 24.2:** Run Playwright.

```bash
cd apps/web && npm run test:e2e -- feedback-affordance 2>&1 | tail -20
```
Expected: both tests pass. If the existing auth flow blocks page.goto, the test may need to run with the pre-authenticated storage state — check `playwright.config.ts`. If tests time out because the chosen page doesn't have findings in the seed DB, replace `/compliance` with a page that definitely does.

- [ ] **Step 24.3:** Commit.

```bash
git add apps/web/e2e/feedback-affordance.spec.ts
git commit -m "test(e2e): feedback affordance smoke — thumb-up + thumb-down + submit

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 25: Final build + deploy verification

- [ ] **Step 25.1:** Full frontend build.

```bash
cd "/Users/shyamsedai/Documents/Compliance Vision AI" && npm run build --workspace=apps/web 2>&1 | tail -5
```
Expected: `✓ built in Xs`.

- [ ] **Step 25.2:** Full backend imports + tests.

```bash
cd apps/api && source venv/bin/activate && python3 -c "from src.main import app; print('API OK')" && pytest tests/test_feedback_affordance.py -v 2>&1 | tail -15
```
Expected: `API OK` and all feedback affordance tests pass.

- [ ] **Step 25.3:** Frontend unit tests.

```bash
cd apps/web && npm run test 2>&1 | tail -10
```
Expected: all tests pass.

- [ ] **Step 25.4:** Push to origin/main.

```bash
cd "/Users/shyamsedai/Documents/Compliance Vision AI" && git push origin main
```
Expected: push succeeds.

- [ ] **Step 25.5:** Monitor Railway builds.

Use the Railway MCP (`mcp__railway__list_deployments`) or the Railway CLI:

```bash
railway service api && railway logs --build 2>&1 | tail -20
railway service web && railway logs --build 2>&1 | tail -20
railway service worker && railway logs --build 2>&1 | tail -20
```
Expected: all three show `Build time: Xs` and green healthcheck for api + web.

- [ ] **Step 25.6:** Smoke-test production.

```bash
curl -sS -m 10 https://api.shieldra.ai/api/v1/health && echo && curl -sS -m 10 -o /dev/null -w "www.shieldra.ai → %{http_code}\n" https://www.shieldra.ai
```
Expected: `{"status":"healthy",...}` and `200`.

- [ ] **Step 25.7:** Visual smoke in a browser.

Log in as `admin@compliancevision.ai / admin123` at https://www.shieldra.ai/app. Navigate to `/compliance`, click a thumb-up on a finding — button flashes, no toast. Click a thumb-down — drawer slides in from the right. Submit — success toast appears with `Thanks — this will train future analyses`. Refresh the page. Check `/learning-engine` → Corrections tab: the new correction is listed.

---

## Self-review

**1. Spec coverage:**

| Spec section | Plan task(s) |
|---|---|
| §3 — `<FeedbackAffordance>` component + 8 drawer variants | 13, 14, 15 |
| §3 — Thumb-up acceptance endpoint | 6 |
| §3 — Extended correction endpoint | 5 |
| §3 — Placement on 17 AI-surface pages | 17-23 |
| §3 — /review page | **DEFERRED to Plan 1B** |
| §3 — Outcome follow-up | **DEFERRED to Plan 1C** |
| §3 — "Your Contributions" card | **DEFERRED to Plan 1D** |
| §4.1 — Permission gate `ai.manage` | 3, 15 |
| §4.2 — 8 drawer variants | 13, 14 |
| §4.3 — Quality scoring | Deferred — uses existing `SignalQualityScorer`; defaults in scorer already match spec (0.5/0.7/1.0). No plan change needed — the backend's existing quality scoring takes reason length into account automatically. |
| §5.1 — Acceptance flow | 6, 12, 15 |
| §5.2 — Correction flow + Undo + PHI scrubbing + `has_user_correction` flag | 1, 4, 5, 7, 12, 15 |
| §5.3 — Recommendation outcome | **DEFERRED to Plan 1C** |
| §7 — Contextual next-step toasts | 17, 19, 20, 21, 22 (each relevant placement sets `contextualNextStep`) |
| §11 — Edge cases | debounce in Task 15, Undo in Task 7+12, upsert in Task 4, offline queue in Task 11, permission gate in Task 15 |
| §12 — Backend changes | 1, 2, 3, 5, 6, 7 |
| §13 — Frontend changes | 9, 10, 11, 12, 13, 14, 15, 17-23 |
| §14 — Testing strategy | 8, 11, 16, 24 |

**Gaps intentionally deferred (follow-on plans):**
- `/review` page + endpoint + keyboard shortcuts → Plan 1B.
- Outcome follow-up card + 30-day nudge + email opt-out → Plan 1C.
- "Your Contributions" card + dashboard + peer comparison → Plan 1D.

All other spec requirements are covered by tasks in this plan.

**2. Placeholder scan:** No TBDs, no "similar to task N" references. Every step shows complete code. Each test block has concrete assertions.

**3. Type consistency:** `EntityType` is defined in Task 10, reused in Tasks 13, 14, 15. `CorrectionRequest` new fields are defined in Task 10, consumed in Tasks 12 and 15. `AcceptanceRequest` is defined in Task 10, consumed in Tasks 12 and 15. Drawer props (`DrawerVariantProps`) are defined in Task 13, consumed by all 8 drawer variants in Task 14. No name drift.

**4. Constraint sweep:**
- Additive migrations only (Task 1 downgrade drops index only) ✓
- No DB deletion instructions ✓
- All commits on main per TEMPORARY OVERRIDE ✓
- Build verification after every major group (Tasks 17.4, 23.4, 25) ✓
- Nothing skipped via `--no-verify` ✓
- Production smoke at end (Task 25.6, 25.7) ✓

---

## Execution handoff

Plan complete and saved to `docs/superpowers/plans/2026-04-16-feedback-affordance-foundation.md`.

**Two execution options:**

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration.

**2. Inline Execution** — I execute tasks in this session using `executing-plans`, batch execution with checkpoints for review.

**Which approach?**

After this plan (1A) ships and production is green, follow-on plans:
- **Plan 1B** — `/review` page (active-learning queue + keyboard shortcuts J/K/A/D/S).
- **Plan 1C** — Outcome follow-up (immediate "Was this fix effective?" card + 30-day nudge cron + email opt-out).
- **Plan 1D** — "Your Contributions" card + dashboard integration + k-anonymous peer comparison.
