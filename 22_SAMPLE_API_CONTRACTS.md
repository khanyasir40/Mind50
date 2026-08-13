# API Contract Sketch

GET /v1/me
GET /v1/games
GET /v1/games/:id
POST /v1/challenges/generate
POST /v1/attempts
GET /v1/me/stats
GET /v1/me/history
GET /v1/daily
POST /v1/daily/:id/complete
GET /v1/leaderboards
GET /v1/achievements
POST /v1/duels
POST /v1/duels/:id/join
GET /v1/admin/analytics

All protected endpoints require authenticated user context.

Attempt submission:
{
  "gameId": "...",
  "challengeId": "...",
  "seed": "...",
  "generatorVersion": "...",
  "startedAt": "...",
  "completedAt": "...",
  "score": 0,
  "accuracy": 0.0,
  "reactionMs": 0,
  "mistakes": 0
}

Server must recompute/validate competitive scores.
