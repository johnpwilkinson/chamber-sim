# dev-engine PR surface — a-small-badge-in-the-app-header-showing

## Commits

98f3689 docs(a-small-badge-in-the-app-header-showing): improve plans round 1 [improve-turbo]
59e331d feat(a-small-badge-in-the-app-header-showing): Update  src/App.tsx  to import  HeaderBuildBadge  from  ./components/hea
516b174 feat(a-small-badge-in-the-app-header-showing): Create  src/components/header-build-badge/header-build-badge.tsx : a pro
187d400 merge lane/a-small-badge-in-the-app-header-showing/1.2 [dev-engine]
2cfd290 merge lane/a-small-badge-in-the-app-header-showing/1.1 [dev-engine]
ff3a57e feat(a-small-badge-in-the-app-header-showing): Add  declare const __BUILD_TIME__: number  to  src/vite-env.d.ts  alongs
7e03725 feat(a-small-badge-in-the-app-header-showing): Add  __BUILD_TIME__: JSON.stringify(Date.now())  to the  define  block i

## Tasks

- checked: 4
- unchecked: 0

## Plans

| slug | status |
|------|--------|
| extract-repeated-build-time-formatting-i | residual |
| no-test-covers-the-new-ambient-declarati | residual |
| third-integration-test-duplicates-the-fi | residual |
| test-tagged-req-8-3-never-checks-other-f | deferred |
| no-test-for-req-7-3-always-rendered-no-e | deferred |

### Deferred pick-list

- test-tagged-req-8-3-never-checks-other-f
- no-test-for-req-7-3-always-rendered-no-e

## Residual findings

- [MED] Test tagged req:8.3 never checks other files (src/components/header-build-badge/app-integration.test.tsx:18)
- [MED] No test for req:7.3 always-rendered/no env-gating (src/components/header-build-badge/header-build-badge.test.tsx:93)

## Gate receipts

- gate: green

## Tokens

- zero point: 0
- impl: 0
- validate: 0
- improve: 0
- gate: 0
