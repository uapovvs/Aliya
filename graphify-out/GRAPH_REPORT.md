# Graph Report - frontend/src  (2026-06-01)

## Corpus Check
- Corpus is ~21,306 words - fits in a single context window. You may not need a graph.

## Summary
- 355 nodes · 566 edges · 18 communities (16 shown, 2 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 16|Community 16]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 26 edges
2. `home` - 12 edges
3. `timeline` - 12 edges
4. `home` - 12 edges
5. `timeline` - 12 edges
6. `useThemeStore` - 11 edges
7. `useAuthStore` - 10 edges
8. `stage` - 9 edges
9. `stage` - 9 edges
10. `Badge()` - 8 edges

## Surprising Connections (you probably didn't know these)
- `RequireRole()` --calls--> `useAuthStore`  [EXTRACTED]
  App.tsx → store/authStore.ts
- `Props` --references--> `LeaderboardEntry`  [EXTRACTED]
  components/Leaderboard.tsx → types/index.ts
- `ThemeToggle()` --calls--> `useThemeStore`  [EXTRACTED]
  components/ThemeToggle.tsx → store/themeStore.ts
- `Badge()` --calls--> `cn()`  [EXTRACTED]
  components/ui/badge.tsx → lib/utils.ts
- `CinematicHero()` --calls--> `cn()`  [EXTRACTED]
  components/ui/cinematic-landing-hero.tsx → lib/utils.ts

## Import Cycles
- None detected.

## Communities (18 total, 2 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.08
Nodes (35): AdminReviewPage(), barrelsForScore(), STATUS_VARIANT, StatusVariant, cn(), Button, ButtonProps, buttonVariants (+27 more)

### Community 1 - "Community 1"
Cohesion: 0.04
Nodes (44): admin, approve, comment, createUser, review, score, auth, error (+36 more)

### Community 2 - "Community 2"
Cohesion: 0.05
Nodes (36): admin, approve, comment, createUser, review, score, auth, error (+28 more)

### Community 3 - "Community 3"
Cohesion: 0.09
Nodes (18): getLeaderboard(), DMAIC_DATA, Props, ThemeToggle(), ease, HomePage(), applyTheme(), initTheme() (+10 more)

### Community 4 - "Community 4"
Cohesion: 0.11
Nodes (21): RoleFilter, createUser(), CreateUserPayload, getAllUsers(), getSubmittedStages(), reviewStage(), BarrelIconProps, RANK_STYLE (+13 more)

### Community 5 - "Community 5"
Cohesion: 0.12
Nodes (21): AuthResponse, getMe(), login(), LoginPayload, getMyStages(), saveStageContent(), submitStage(), Props (+13 more)

### Community 6 - "Community 6"
Cohesion: 0.14
Nodes (13): api, RequireRole(), LoginPage(), AuthState, useAuthStore, Role, SignInPage(), SignInPageProps (+5 more)

### Community 7 - "Community 7"
Cohesion: 0.14
Nodes (16): Props, STAGE_META, STATUS_ICON, STATUS_VARIANT, StatusVariant, Badge(), BadgeProps, badgeVariants (+8 more)

### Community 8 - "Community 8"
Cohesion: 0.12
Nodes (11): Button(), ButtonProps, shapes, sizes, types, bars, Spinner(), SpinnerProps (+3 more)

### Community 9 - "Community 9"
Cohesion: 0.15
Nodes (13): stage, C, D, deadline, I, M_A, save, status (+5 more)

### Community 10 - "Community 10"
Cohesion: 0.15
Nodes (13): stage, C, D, deadline, I, M_A, save, status (+5 more)

### Community 11 - "Community 11"
Cohesion: 0.17
Nodes (12): home, cta_admin, cta_dashboard, cta_login, hero_subtitle, hero_title, leaderboard_eyebrow, leaderboard_sub (+4 more)

### Community 12 - "Community 12"
Cohesion: 0.17
Nodes (12): timeline, c_label, c_sub, d_label, d_sub, i_label, i_sub, ma_label (+4 more)

### Community 13 - "Community 13"
Cohesion: 0.25
Nodes (8): barrel, label, reward, total, BRANDED_MERCH, JAPAN_TRIP, LEADERSHIP_AWARD, PROJECT_BADGE

## Knowledge Gaps
- **180 isolated node(s):** `CreateUserPayload`, `LoginPayload`, `AuthResponse`, `api`, `BarrelIconProps` (+175 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `stage` connect `Community 9` to `Community 1`?**
  _High betweenness centrality (0.064) - this node is a cross-community bridge._
- **Why does `stage` connect `Community 10` to `Community 2`?**
  _High betweenness centrality (0.064) - this node is a cross-community bridge._
- **Why does `cn()` connect `Community 0` to `Community 3`, `Community 4`, `Community 7`?**
  _High betweenness centrality (0.063) - this node is a cross-community bridge._
- **What connects `CreateUserPayload`, `LoginPayload`, `AuthResponse` to the rest of the system?**
  _180 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.07536231884057971 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.044444444444444446 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.05263157894736842 - nodes in this community are weakly interconnected._