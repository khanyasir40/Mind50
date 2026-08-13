# NeuroVault — GUI Reference & Premium UI Direction

## IMPORTANT VISUAL REFERENCE

A user-provided visual reference image is included in this package:

`assets/gui_reference.png`

The reference should be treated as a **visual direction**, not copied literally.

The desired feel is:
- premium wellness/fitness app quality
- clean editorial layout
- soft lavender/lilac background
- rounded white cards
- large rounded image/illustration cards
- generous whitespace
- compact but information-rich dashboard
- elegant rounded typography
- pill-shaped controls
- bottom navigation
- subtle shadows
- friendly illustrations/photos
- polished iOS-style presentation
- strong hierarchy without visual clutter

## DO NOT COPY THE REFERENCE

Do not reproduce the exact:
- branding
- text
- images
- logo
- icons
- layout pixel-for-pixel
- proprietary assets

Instead, translate the visual language into an original NeuroVault identity.

---

# TARGET UI QUALITY

The app must look like a **top-tier App Store product**, not a generic Flutter/Material template.

Quality target:
- Apple-level polish
- modern wellness/productivity app feel
- Dribbble/Behance-quality visual hierarchy
- smooth micro-interactions
- consistent spacing
- premium cards
- excellent typography
- responsive design

Avoid:
- default Material-looking screens
- excessive gradients
- excessive neon
- crowded dashboards
- giant unnecessary icons
- cheap-looking game UI
- random colors
- inconsistent corner radii
- inconsistent shadows
- excessive borders

---

# COLOR DIRECTION

Primary visual direction:
- soft lavender/lilac environment
- warm/off-white surfaces
- dark charcoal text
- deep violet as the main brand accent
- small amounts of secondary accent colors

Suggested starting tokens (the agent may tune them):
- Background light: #F3F0FF
- Surface: #FFFFFF
- Primary: #6C4DFF
- Primary dark: #4B32C3
- Text: #17151F
- Secondary text: #777281
- Success: #39B982
- Warning: #F0A83A
- Error: #E85D75

Dark theme should be a separate carefully designed palette rather than simply inverting the light theme.

---

# TYPOGRAPHY

Use a modern rounded/geometric sans-serif.

Recommended:
- Inter
- Plus Jakarta Sans
- Manrope
- SF Pro on Apple platforms where appropriate

Hierarchy:
- Display: bold/extra-bold
- Screen title: bold
- Section title: semibold/bold
- Card title: semibold
- Body: regular
- Caption: medium

Never use too many font families.

---

# SHAPE LANGUAGE

Primary corner radius:
- small controls: 12–14px
- buttons/chips: 14–18px
- cards: 20–26px
- hero cards: 26–32px
- bottom sheets: 28–32px

Buttons should feel tactile and premium.

Use:
- pill filters
- rounded rectangular CTAs
- icon buttons
- soft circular avatars
- progress rings
- rounded progress bars

---

# HOME SCREEN

Create a layout inspired by the reference's clean dashboard structure.

Top:
- greeting
- profile/avatar
- notification icon

Hero:
- Daily Challenge
- large visual/illustration
- challenge title
- estimated duration
- reward
- primary CTA

Below:
- Your Plan / Quick Train
- horizontal cards
- category labels
- colorful but restrained visual coding

Then:
- Cognitive Profile
- progress cards for Memory, Attention, Speed, Logic, Spatial, Flexibility

Then:
- Continue Training
- Recently Played
- Achievements

The screen must scroll naturally and feel spacious.

---

# GAME LIBRARY

Do NOT show 50 games as a boring list.

Use:
- category chips
- featured game
- recommended for you
- recently played
- difficulty filters
- search
- horizontal card carousels
- grid/list switch on larger screens

Each game card:
- original visual
- category
- title
- one-line description
- difficulty
- average duration
- personal best
- play button

---

# GAME DETAIL

Before launching:
- large visual
- game name
- skill category
- "What you'll do"
- estimated time
- difficulty
- personal best
- optional tutorial
- Play button

Do not make users read a wall of text.

---

# GAMEPLAY UI

Gameplay must be extremely focused.

At top:
- close/pause
- progress
- score

Center:
- challenge

Bottom:
- large touch targets
- minimal controls

Avoid distractions.

For reaction/attention games:
- use the whole available screen
- keep UI chrome minimal

For memory games:
- strong visual focus
- controlled transitions

For logic games:
- clean cards and deliberate spacing

---

# RESULT SCREEN

Make the result screen feel rewarding.

Show:
- large score animation
- "New Personal Best" when applicable
- accuracy
- speed/reaction
- difficulty
- XP earned
- skill affected
- comparison with personal history

Actions:
- Play Again
- Next Challenge
- Back to Home

Use tasteful celebration animations, not childish confetti everywhere.

---

# PROFILE SCREEN

Follow the reference's profile style:
- large circular avatar
- username
- level
- XP
- streak
- compact stat chips
- organized settings/list rows

Sections:
- Cognitive Profile
- Training Statistics
- Achievements
- History
- Preferences
- Accessibility
- Privacy

---

# BOTTOM NAVIGATION

Mobile navigation:
1. Home
2. Games
3. Train
4. Rank
5. Profile

Use a clean floating/rounded navigation treatment where appropriate.

Do not make it visually heavy.

---

# ILLUSTRATION / IMAGE DIRECTION

Use original visual assets.

Preferred:
- abstract brain-inspired shapes
- 3D soft objects
- abstract geometric forms
- friendly minimal illustrations
- original generated visual scenes
- subtle photography only when it materially helps

For cognitive games, prefer original abstract visual stimuli rather than generic stock images.

---

# MOTION

Motion should communicate:
- progress
- success
- transition
- focus

Use:
- 150–250ms micro-interactions
- 250–450ms screen transitions
- spring-like card/button feedback

Support:
- reduced motion
- reduced visual stimulation

Never use rapid flashing patterns.

---

# RESPONSIVE WEB

The mobile UI must not simply be stretched on desktop.

At desktop widths:
- max content width
- sidebar/navigation rail
- 2–4 column cards
- larger hero composition
- more information density
- keyboard support

At tablet:
- 2-column layouts where appropriate

At mobile:
- single-column
- horizontal scrolling sections
- bottom navigation

---

# DESIGN SYSTEM IMPLEMENTATION

Create centralized tokens:
- AppColors
- AppTypography
- AppSpacing
- AppRadii
- AppShadows
- AppMotion

Create reusable components:
- NvButton
- NvIconButton
- NvCard
- NvHeroCard
- NvGameCard
- NvSkillCard
- NvStatChip
- NvProgressRing
- NvProgressBar
- NvSectionHeader
- NvBottomNav
- NvAvatar
- NvBadge
- NvPill
- NvResultCard
- NvModal
- NvBottomSheet
- NvEmptyState
- NvSkeleton

Do not duplicate styling in individual screens.

---

# QUALITY GATE

Before considering UI complete, test:
- iPhone-sized portrait
- Android portrait
- iPad/tablet
- desktop browser
- light theme
- dark theme
- large text
- screen reader
- reduced motion
- keyboard navigation

The final UI should feel like one coherent premium product.

## Final instruction to AI agent

Use `assets/gui_reference.png` throughout design review as a **quality benchmark for visual polish and composition**.

The target is NOT to clone the screenshot.

The target is:
**"NeuroVault, designed with the same level of polish and premium simplicity as a leading modern wellness/productivity app, but with an original cognitive-gaming identity."**
