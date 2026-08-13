# Data Model

## users
id
email
display_name
avatar
created_at
updated_at
last_active_at
settings_json

## profiles
user_id
xp
level
streak
best_score
memory_score
attention_score
speed_score
logic_score
spatial_score
flexibility_score
inhibition_score

## games
id
slug
name
category
description
version
enabled
difficulty_min
difficulty_max

## challenge_templates
id
game_id
generator_version
config_json
enabled

## challenges
id
game_id
seed
generator_version
difficulty
config_json
created_at
expires_at

## attempts
id
user_id
game_id
challenge_id
started_at
completed_at
score
accuracy
reaction_ms
mistakes
difficulty
client_version
server_validated

## achievements
id
slug
name
description
rule_json

## user_achievements
user_id
achievement_id
unlocked_at

## daily_challenges
date
challenge_id
ruleset_version

## leaderboard_entries
season_id
user_id
category
score
verified
updated_at

## sessions
id
user_id
mode
started_at
completed_at
score

## subscriptions
user_id
provider
status
product_id
expires_at

## admin_audit_logs
id
admin_user_id
action
target_type
target_id
metadata
created_at
