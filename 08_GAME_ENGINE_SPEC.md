# Game Engine Contract

Every game implements the same interface conceptually:

GameDefinition:
- id
- name
- category
- version
- tutorial
- accessibilityOptions
- createChallenge(seed, difficulty)
- start()
- handleInput(input)
- pause()
- resume()
- finish()
- calculateScore()
- calculateAccuracy()
- resultSummary()
- analyticsEvents()

Challenge:
- id
- seed
- difficulty
- rulesetVersion
- payload

Result:
- score
- accuracy
- durationMs
- reactionMetrics
- mistakes
- difficulty
- metadata

Scoring:
- server-verifiable when competitive
- no client-only leaderboard scores
- cap impossible values
- reject impossible timing
- store raw metrics where privacy policy permits

Adaptive difficulty:
Use recent performance over several attempts.
Do not jump difficulty drastically.
Avoid changing difficulty mid-trial unless the game explicitly requires it.
Store difficulty decisions for explainability.
