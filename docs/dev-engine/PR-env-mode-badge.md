# dev-engine PR surface — env-mode-badge

## Commits

6f3972e chore(env-mode-badge): promote sdd-* boundary rules warn->error [dev-engine]
905405f docs(env-mode-badge): improve plans round 1 [improve-turbo]
9500e0a feat(env-mode-badge): In  src/App.tsx , import  FooterEnvModeBadge  from  ./components/footer-
9a315e9 feat(env-mode-badge): Create  src/components/footer-env-mode-badge/footer-env-mode-badge.test.
c1ef4da merge lane/env-mode-badge/2.1 [dev-engine]
3a110d8 merge lane/env-mode-badge/1.1 [dev-engine]
bae2e08 feat(env-mode-badge): In  src/components/footer-commit-badge/footer-commit-badge.tsx , change
33882a4 feat(env-mode-badge): Create  src/components/footer-env-mode-badge/footer-env-mode-badge.tsx :

## Tasks

- checked: 4
- unchecked: 0

## Plans

| slug | status |
|------|--------|
| remove-self-referential-name-obfuscation | residual |
| remove-duplicate-mode-text-assertion | residual |
| drop-unscoped-over-engineered-app-integr | deferred |
| onclick-test-only-checks-dom-attribute-n | deferred |

### Deferred pick-list

- drop-unscoped-over-engineered-app-integr
- onclick-test-only-checks-dom-attribute-n

## Residual findings

- [MED] Drop unscoped, over-engineered app-integration test file (src/components/footer-env-mode-badge/app-integration.test.tsx:10)
- [MED] onClick test only checks DOM attribute, not JSX prop (src/components/footer-env-mode-badge/footer-env-mode-badge.test.tsx:55)

## Gate receipts

- gate: green

## Tokens

- zero point: 0
- impl: 48252
- validate: 48252
- improve: 80944
- gate: 80944
