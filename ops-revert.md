# LegalIndia Infra Revert Guide

1. To revert last commit:
   ```bash
   git revert HEAD
   git push origin main
   ```

2. To tag stable release:
   ```bash
   git tag stable-v1
   git push origin stable-v1
   ```

3. To deploy previous release in Railway:
   - Open Railway project > backend service
   - Click "Deployments" > select previous tag > "Redeploy"

4. Always create a backup tag before changes:
   ```bash
   git tag backup-$(date +%Y%m%d%H%M)
   git push origin --tags
   ```

