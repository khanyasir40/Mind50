# Technical Architecture

Recommended client:
Flutter + Dart for Android, iOS and Web.

Recommended structure:

lib/
  core/
    theme/
    routing/
    accessibility/
    constants/
    utils/
    analytics/
  data/
    models/
    repositories/
    local/
    remote/
  features/
    auth/
    home/
    games/
    train/
    perception/
    profile/
    statistics/
    achievements/
    leaderboard/
    social/
    settings/
  game_engine/
    models/
    generators/
    scoring/
    difficulty/
    runtime/
  admin/
  shared/

Backend:
Use a service abstraction so Firebase/Supabase/custom backend can be selected later.

Production backend requirements:
- Authentication
- PostgreSQL-style relational data model
- Object storage for assets
- Server-side score validation
- Leaderboard service
- Challenge seed/version service
- analytics pipeline
- admin RBAC
- audit logs

Do not place secret keys in the client.

## State
Use a predictable state-management architecture (Riverpod/Bloc/etc.). Keep business logic out of widgets.

## Offline
Core games should work offline.
Queue progress events and sync later.

## Determinism
Generated challenges should use:
- seed
- generator version
- difficulty
- ruleset version

This allows a challenge to be reproduced for verification.

## Performance
Target:
- 60fps minimum
- avoid unnecessary rebuilds
- lazy-load game assets
- keep game loop lightweight
- avoid blocking UI thread
- cache generated content
