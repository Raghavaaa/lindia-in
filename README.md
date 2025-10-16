# LegalIndia Infrastructure

Simple connection layer that links:
- Frontend → Vercel
- Backend → Railway  
- Database → Railway

## Endpoints

- `GET /` - Service info
- `GET /health` - Health check

## Railway Deployment

This will auto-deploy when you connect it to Railway.

**Railway API Key:** Stored in GitHub Secrets as `RAILWAY_TOKEN`

Deploy: https://railway.app/new

---

## 📸 Snapshot & Rollback Runbook

### Creating Manual Snapshots (Railway UI)

**Path:** Railway Dashboard → Project → Service → Deployments → ⋮ Menu → Create Snapshot

**Steps:**
1. Navigate to https://railway.app/dashboard
2. Select project: `LegalIndia` or `lindia-in`
3. Click target service (e.g., `database` or `backend`)
4. Go to `Deployments` tab
5. Click ⋮ (three dots) on desired deployment
6. Select `Create Snapshot`
7. Name format: `pre-migration-YYYYMMDD-HHMM-description`
8. Click `Create`
9. **Verify:** Check `Snapshots` section for confirmation

### Creating Snapshots (Railway CLI)

```bash
# Login to Railway
railway login

# Link to project
railway link

# Create snapshot (example - adjust for actual Railway CLI)
railway deployment snapshot create \
  --service database \
  --name "pre-migration-$(date +%Y%m%d-%H%M)-schema-update"

# List snapshots
railway deployment snapshot list

# Verify snapshot creation
railway deployment snapshot show <snapshot-id>
```

### Restoring from Snapshot (Railway UI)

**Path:** Railway Dashboard → Project → Service → Snapshots → Select Snapshot → Restore

**Steps:**
1. Navigate to https://railway.app/dashboard
2. Select project: `LegalIndia` or `lindia-in`
3. Click affected service
4. Go to `Snapshots` tab
5. Locate desired snapshot by name/timestamp
6. Click snapshot to view details
7. **APPROVAL GATE:** Verify snapshot is correct version
8. Click `Restore` button
9. **Approval Required:** Confirm restoration in modal
10. Monitor restoration progress in Deployments tab
11. **Post-Restore:** Verify service health at `/health` endpoint
12. Check logs for any errors
13. Test critical functionality

### Restoring from Snapshot (Railway CLI)

```bash
# List available snapshots
railway deployment snapshot list --service database

# Restore specific snapshot
railway deployment snapshot restore <snapshot-id>

# Monitor restoration
railway logs --service database --follow

# Verify health
curl https://your-service.railway.app/health
```

### Approval Gates Required

**Before Snapshot Creation:**
- Manual trigger via GitHub Actions workflow
- Environment approval (production/staging)
- Migration description required

**Before Snapshot Restore:**
- Manual confirmation in Railway UI
- Team notification recommended
- Incident ticket reference (if applicable)

**After Restore:**
- Health check verification mandatory
- Manual testing of critical paths
- Log review for errors

### Automated Snapshot Policy

**Recommended Schedule:**
- **Daily:** 02:00 UTC (off-peak hours)
- **Pre-deployment:** Automatic via CI/CD workflow
- **Pre-migration:** Manual trigger required (see GitHub Actions)

**Retention Policy:**
- **Production snapshots:** 30 days minimum
- **Pre-migration snapshots:** 90 days
- **Manual snapshots:** 60 days
- **Staging snapshots:** 7 days

**Storage Considerations:**
- Monitor snapshot storage usage monthly
- Archive critical snapshots beyond retention
- Document snapshot purpose in name

**Implementation Steps (DO NOT ENABLE YET):**
1. Access Railway Dashboard → Project Settings
2. Navigate to `Backups` or `Snapshots` section
3. Click `Configure Automated Snapshots`
4. Set schedule: Daily at 02:00 UTC
5. Set retention: 30 days for production
6. **⚠️ IMPORTANT:** Require manual approval for production
7. Test with staging environment first
8. Monitor first 7 days of automated snapshots
9. Verify snapshot integrity weekly
10. Document snapshot restoration test procedure

### Railway CLI Command Sequence

```bash
# Complete snapshot workflow
# 1. Setup
railway login
railway link --project lindia-in --environment production

# 2. Pre-snapshot verification
railway status
railway logs --tail 100

# 3. Create snapshot
SNAPSHOT_NAME="manual-$(date +%Y%m%d-%H%M)-backup"
railway deployment snapshot create --name "$SNAPSHOT_NAME"

# 4. Verify snapshot
railway deployment snapshot list | grep "$SNAPSHOT_NAME"

# 5. Document snapshot
echo "$SNAPSHOT_NAME created at $(date)" >> snapshot-log.txt

# Rollback workflow
# 1. List snapshots
railway deployment snapshot list --service database

# 2. Select snapshot (note the ID)
SNAPSHOT_ID="<snapshot-id-from-list>"

# 3. Restore snapshot
railway deployment snapshot restore "$SNAPSHOT_ID"

# 4. Monitor restoration
railway logs --follow --service database

# 5. Verify service health
sleep 30
railway status
curl $(railway status --json | jq -r '.url')/health

# 6. Tag restored version
git tag "rollback-$(date +%Y%m%d-%H%M)"
git push origin "rollback-$(date +%Y%m%d-%H%M)"
```

### Emergency Rollback Checklist

- [ ] Identify snapshot to restore (timestamp, version)
- [ ] Notify team in Slack/Discord
- [ ] Create incident ticket
- [ ] Take current state snapshot before rollback
- [ ] Execute snapshot restore (UI or CLI)
- [ ] Monitor restoration logs
- [ ] Verify `/health` endpoint returns 200
- [ ] Test critical user flows
- [ ] Update status page
- [ ] Document rollback reason
- [ ] Schedule post-mortem
- [ ] Plan forward fix if needed

---

## GitHub Actions Workflows

### CI Build and Test (`ci-build-test.yml`)
- Runs on push to main/staging
- Tests multiple Node.js versions
- Validates configuration files
- No secrets required

### Pre-Migration Snapshot (`pre-migration-snapshot.yml`)
- Manual trigger only
- Requires approval gate
- Creates timestamped snapshot
- Requires `RAILWAY_TOKEN` secret

### Safe Deploy (`safe-deploy.yml`)
- Manual or tag-triggered
- Requires production approval
- Progressive rollout (canary → full)
- Requires `RAILWAY_TOKEN` secret

## Required GitHub Secrets

Set these in: Repository Settings → Secrets and Variables → Actions

- `RAILWAY_TOKEN` - Railway API token for deployments
- (Optional) `SENTRY_DSN` - Error monitoring

## Environment Variables

See `env.template` for all required variables. Never commit actual secrets.

---

## Quick Start

```bash
# Local development
npm install
npm start

# Deploy to Railway
railway login
railway link
railway up

# Create snapshot before changes
railway deployment snapshot create --name "pre-deploy-$(date +%Y%m%d)"
```
