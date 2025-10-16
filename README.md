# LegalIndia Infra & Integration Layer

This repository connects all LegalIndia modules:
- Frontend (Vercel)
- Backend (Railway)
- Database (Railway)

## Local Setup
```bash
docker-compose up --build
```
Access backend: http://localhost:8000

## Deployment
- Backend & Database auto-deploy via Railway GitHub integration.
- Frontend auto-deploy via Vercel.

## Load Testing
Run k6 test:
```bash
k6 run tests/load/k6-test.js
```

## Rollback
See ops-revert.md

