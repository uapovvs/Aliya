# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**DMAIC Platform** — internal gamification platform for KazMunayGas (KMG) based on the Six Sigma DMAIC methodology. Participants track project progress across 4 stages (D, M/A, I, C), earn "barrel" rewards scored by admins, and compete on a leaderboard.

UI language: **Russian + Kazakh (bilingual)**.

## Architecture

```
dmaic-platform/
├── backend/   — Java 21, Spring Boot 3, Spring Security (JWT), PostgreSQL
└── frontend/  — React 18, TypeScript, Tailwind CSS, Vite
```

Two separate servers. Frontend communicates with backend via REST JSON API.

## Backend (Spring Boot)

### Run & Build

```bash
cd backend
./mvnw spring-boot:run                  # dev server (port 8080)
./mvnw clean package -DskipTests        # build JAR
./mvnw test                             # all tests
./mvnw test -Dtest=UserServiceTest      # single test class
```

### Key packages

- `kz.kmg.dmaic.entity` — JPA entities: `User`, `Project`, `DmaicStage`, `Barrel`
- `kz.kmg.dmaic.repository` — Spring Data JPA repositories
- `kz.kmg.dmaic.service` — business logic; barrel calculation lives in `BarrelService`
- `kz.kmg.dmaic.controller` — REST controllers; admin endpoints under `/api/admin/**`
- `kz.kmg.dmaic.security` — JWT filter, `SecurityConfig`, `UserDetailsServiceImpl`
- `kz.kmg.dmaic.dto` — request/response DTOs (never expose entities directly)
- `kz.kmg.dmaic.config` — CORS, storage, i18n config

### Security model

- Spring Security with stateless JWT (no sessions)
- Two roles: `ROLE_ADMIN`, `ROLE_PARTICIPANT`
- `/api/admin/**` — ADMIN only
- `/api/leaderboard` — public (no auth)
- All other `/api/**` — authenticated

### Barrel scoring logic

```
score >= 100 → 5 barrels
score >= 80  → 4 barrels
score >= 50  → 2 barrels
score >= 40  → 1 barrel
score < 40   → 0 barrels
```

Total max = 20 barrels (4 stages × 5). Final rewards computed in `BarrelService.computeReward()`.

### Database migrations

Managed by **Flyway**. Migration files in `src/main/resources/db/migration/` named `V{n}__{description}.sql`.

## Frontend (React + TypeScript)

### Run & Build

```bash
cd frontend
npm install
npm run dev        # dev server (port 5173, proxies /api → :8080)
npm run build      # production build
npm run lint       # ESLint
npm test           # Vitest
```

### Key structure

- `src/pages/` — route-level components: `HomePage`, `LoginPage`, `DashboardPage`, `StagePage`, `AdminPage`, `AdminReviewPage`
- `src/components/` — shared UI: `BarrelProgress`, `StageCard`, `Leaderboard`, `AvatarUpload`
- `src/api/` — typed API client (Axios) with interceptors for JWT
- `src/i18n/` — translation files `ru.json` and `kz.json` (react-i18next)
- `src/store/` — Zustand stores: `authStore`, `projectStore`

### Routing

React Router v6. Protected routes check `authStore` role:
- `/` — public leaderboard
- `/login` — public
- `/dashboard` — PARTICIPANT
- `/dashboard/stage/:stage` — PARTICIPANT (stage = d | ma | i | c)
- `/admin` — ADMIN
- `/admin/review/:userId` — ADMIN

## Domain concepts

| Term | Meaning |
|---|---|
| Stage | One of D, M_A, I, C — maps to DMAIC phases |
| Barrel (баррель) | Reward unit awarded per stage based on admin score |
| Status | `DRAFT` → `SUBMITTED` → `APPROVED` / `REJECTED` |
| Leaderboard | Public ranking by total barrels |

## Stage deadlines

| Stage | Deadline |
|---|---|
| D (Define) | 30.06.2026 |
| M/A (Measure + Analyze) | 30.08.2026 |
| I (Improve) | 30.11.2026 |
| C (Control) | 20.12.2026 (flexible, participant sets own date) |

## Docker

```bash
docker-compose up -d   # starts PostgreSQL on port 5432
```

PostgreSQL credentials are in `docker-compose.yml` and mirrored in `backend/src/main/resources/application.yml`.
