# Phaser Fighting Core Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver the first playable browser build of Killer Fists: OranKork in Phaser, runnable from Windows CMD, with a complete two-fighter match from selection to KO/rematch.

**Architecture:** Phaser owns scenes, rendering, animation, browser input, camera, HUD and feedback. The existing engine-independent `packages/fighter-core` remains the authority for deterministic fighter/match rules and is extended only where the playable fighting loop needs domain state. Input is translated into semantic actions before combat rules see it.

**Tech Stack:** Phaser 3, JavaScript ES Modules, Vite, npm, Node.js 22, node:test.

**Spec:** `docs/superpowers/specs/2026-10-06-phaser-fighting-core-design.md`

## Global Constraints

- Primary local workflow is Windows Command Prompt.
- Required commands: `npm install`, `npm run dev`, `npm test`, `npm run build`.
- Keep `packages/fighter-core` independent from Phaser.
- Runtime is 2D; architecture must not assume 3D models.
- Final sprite assets must not block the first playable build; explicit development placeholders are allowed.
- Presentation must not own health, KO, winner, or command-recognition authority.
- First slice stops at the playable fighting loop; campaign, progression mode, full roster, multiplayer and final art are later milestones.

## Locked first-slice decisions

To remove implementation ambiguity, the first playable pair is **Norman “The Psychic” Albert vs Khabib Nurgaliyev**. Both may use clearly labeled placeholder silhouettes until approved sprites are imported.

Default keyboard mapping for local CMD/browser testing:

- Player 1: `A/D` move, `W` jump, `S` crouch, `F` punch, `G` kick.
- Player 2 local debug control: arrow keys move/jump/crouch, `K` punch, `L` kick.
- `R` requests rematch after match end.
- `ESC` returns to character select.

Match defaults for M1:

- Best of 3 rounds; first to 2 wins.
- 99-second round timer.
- 100 health per fighter.
- Timer expiry awards the round to the fighter with more health; equal health is a draw and awards neither fighter a round.
- A KO occurs at health <= 0.
- Punch base damage: 8.
- Kick base damage: 12.
- Movement and attack tuning remain configuration values rather than scene literals.

These values are implementation defaults for the vertical slice, not permanent balance canon.

## Review Focus

- Opposite-direction input held simultaneously must not create uncontrolled movement.
- Repeated attack keydown/autorepeat must not apply multiple hits from one attack window.
- Two attacks connecting on the same simulation step must resolve deterministically.
- Timer reaching zero during an active hit must resolve exactly once.
- Rematch must reset health, timer, transient hit state and round score without duplicating input listeners.

---

### Task 1: Root Phaser/Vite application and CMD workflow

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `src/main.js`
- Create: `src/game/config.js`
- Create: `test/config.test.mjs`
- Modify: `.github/workflows/ci.yml`

**Interfaces:**
- Produces: `createGameConfig(overrides = {}) -> Phaser.Types.Core.GameConfig-compatible object`; root scripts `dev`, `test`, `build`.

- [ ] **Step 1: Write failing config test**

Assert fixed logical viewport, arcade physics without gravity as the fighting default, pixel-art rendering settings, and scene registration order.

- [ ] **Step 2: Run `npm test` and verify failure because root app/config does not exist**

- [ ] **Step 3: Add root npm workspace/app metadata, Phaser and Vite dependencies, HTML mount point, config module and main entry**

`src/main.js` must only instantiate Phaser from `createGameConfig()`; scene behavior belongs in scene modules.

- [ ] **Step 4: Extend CI to run root install, tests and production build in addition to fighter-core tests**

Use Node.js 22, matching existing CI.

- [ ] **Step 5: Run `npm test && npm run build`; expect PASS and successful Vite build**

- [ ] **Step 6: Commit: `feat: bootstrap Phaser game shell`**

### Task 2: Match-domain rules in fighter-core

**Files:**
- Create: `packages/fighter-core/src/match.mjs`
- Create: `packages/fighter-core/test/match.test.mjs`
- Modify: `packages/fighter-core/src/index.mjs`

**Interfaces:**
- Produces: `createMatch({ fighter1Id, fighter2Id, roundSeconds = 99, roundsToWin = 2 })`
- Produces: `applyHit(match, { attackerId, defenderId, damage, hitId })`
- Produces: `tickMatch(match, deltaMs)`
- Produces: `startNextRound(match)`
- Returns immutable match state containing fighter health, timer, round wins, phase and winner.

- [ ] **Step 1: Write failing tests for 100-health initialization, 8/12 damage application, duplicate `hitId` rejection, KO, timer decision, draw, first-to-two winner and simultaneous-hit deterministic ordering**

- [ ] **Step 2: Run fighter-core tests and verify the new tests fail**

- [ ] **Step 3: Implement the minimal immutable match state/rules and export them from `index.mjs`**

A processed-hit identity must prevent one attack window from damaging the same target repeatedly.

- [ ] **Step 4: Run `npm test` in `packages/fighter-core`; expect all tests PASS**

- [ ] **Step 5: Commit: `feat: add deterministic match rules`**

### Task 3: Semantic input adapter

**Files:**
- Create: `src/input/actions.js`
- Create: `src/input/KeyboardInput.js`
- Create: `test/keyboard-input.test.mjs`

**Interfaces:**
- Produces action constants `LEFT RIGHT UP DOWN PUNCH KICK REMATCH BACK`.
- Produces `KeyboardInput` with `snapshot(playerId) -> { held:Set, pressed:Set }` and `destroy()`.

- [ ] **Step 1: Write failing tests for P1/P2 mappings, edge-triggered attacks, simultaneous opposite directions and listener cleanup**

- [ ] **Step 2: Run `npm test`; verify failure**

- [ ] **Step 3: Implement semantic keyboard translation without exposing raw key codes to combat code**

When LEFT and RIGHT are both held, horizontal intent is neutral. Browser key repeat must not create repeated `pressed` attack actions.

- [ ] **Step 4: Run `npm test`; expect PASS**

- [ ] **Step 5: Commit: `feat: add semantic fighting input`**

### Task 4: Boot, menu and character selection

**Files:**
- Create: `src/scenes/BootScene.js`
- Create: `src/scenes/MenuScene.js`
- Create: `src/scenes/CharacterSelectScene.js`
- Create: `src/fighters/roster.js`
- Modify: `src/game/config.js`
- Create: `test/roster.test.mjs`

**Interfaces:**
- Produces roster entries with stable IDs `norman-albert` and `khabib-nurgaliyev`, display names and placeholder presentation metadata.
- CharacterSelect launches `FightScene` with `{ p1Id, p2Id }`.

- [ ] **Step 1: Write failing roster tests asserting exactly the two vertical-slice fighters are selectable and IDs are unique**

- [ ] **Step 2: Run tests and verify failure**

- [ ] **Step 3: Implement Boot -> Menu -> Character Select flow and two-fighter selection**

Use Phaser text/geometry placeholders; no final asset dependency.

- [ ] **Step 4: Run tests and build; expect PASS**

- [ ] **Step 5: Commit: `feat: add game entry and fighter select flow`**

### Task 5: FightScene movement and fighter presentation

**Files:**
- Create: `src/scenes/FightScene.js`
- Create: `src/fighters/FighterView.js`
- Create: `src/combat/movement.js`
- Create: `test/movement.test.mjs`
- Modify: `src/game/config.js`

**Interfaces:**
- Produces `resolveMovement(state, input, deltaMs, arena) -> nextState`.
- `FighterView` renders a placeholder fighter and exposes presentation methods without owning match health.

- [ ] **Step 1: Write failing movement tests for left/right, neutral opposite directions, jump, crouch, arena bounds and facing**

- [ ] **Step 2: Run tests and verify failure**

- [ ] **Step 3: Implement pure movement resolution and wire two fighter views into FightScene**

Use configurable speed/jump values. Prevent fighters from leaving arena bounds.

- [ ] **Step 4: Run tests/build; expect PASS**

- [ ] **Step 5: Commit: `feat: add playable fighter movement`**

### Task 6: Punch, kick, hitboxes and deterministic damage

**Files:**
- Create: `src/combat/attacks.js`
- Create: `src/combat/collision.js`
- Create: `test/attacks.test.mjs`
- Create: `test/collision.test.mjs`
- Modify: `src/scenes/FightScene.js`
- Modify: `src/fighters/FighterView.js`

**Interfaces:**
- Produces attack definitions `PUNCH` and `KICK` with damage 8/12 and timing/config metadata.
- Produces `overlapsHitbox(attackerState, defenderState, attack) -> boolean`.
- FightScene forwards successful hit events to fighter-core `applyHit`.

- [ ] **Step 1: Write failing tests for attack damage, range, one-hit-per-window, misses, and simultaneous attacks**

- [ ] **Step 2: Run tests and verify failure**

- [ ] **Step 3: Implement attack windows and collision resolution; keep health mutation exclusively in fighter-core**

- [ ] **Step 4: Add visible hit stun and knockback driven by resolved hit events**

Presentation may animate/flash but cannot independently change health.

- [ ] **Step 5: Run tests/build; expect PASS**

- [ ] **Step 6: Commit: `feat: add punches kicks and hit resolution`**

### Task 7: HUD, rounds, timer, KO and rematch

**Files:**
- Create: `src/ui/FightHud.js`
- Create: `test/match-flow.test.mjs`
- Modify: `src/scenes/FightScene.js`

**Interfaces:**
- HUD consumes match state and renders health, timer, round wins and winner.
- FightScene handles round transition, match end, `R` rematch and `ESC` back.

- [ ] **Step 1: Write failing flow tests for 99-second timer, KO, timeout winner, timeout draw, best-of-three match victory and clean rematch reset**

- [ ] **Step 2: Run tests and verify failure**

- [ ] **Step 3: Implement HUD and round/match state transitions**

Round/match completion must be idempotent so timer and hit resolution cannot award a round twice.

- [ ] **Step 4: Implement rematch/back lifecycle and verify input listeners are destroyed before scene recreation**

- [ ] **Step 5: Run tests/build; expect PASS**

- [ ] **Step 6: Commit: `feat: complete playable match loop`**

### Task 8: Browser smoke gate and documentation

**Files:**
- Create: `docs/RUNNING.md`
- Modify: `README.md`
- Modify: `docs/ROADMAP.md`

**Interfaces:**
- Documents exact CMD workflow and controls.
- Marks M1 complete only after verification evidence exists.

- [ ] **Step 1: From a clean install run `npm install`**

Expected: dependency installation completes without errors.

- [ ] **Step 2: Run `npm test`**

Expected: root and fighter-core test suites PASS.

- [ ] **Step 3: Run `npm run build`**

Expected: Vite production build completes successfully.

- [ ] **Step 4: Run `npm run dev` from CMD and manually verify Boot -> Menu -> Character Select -> Fight, both control schemes, damage, KO, winner and rematch**

- [ ] **Step 5: Document CMD commands and controls; update README/roadmap with evidence-based status only**

- [ ] **Step 6: Commit: `docs: document Phaser playable workflow`**

## Deferred plans

These are intentionally separate implementation cycles after M1:

1. Command Interpreter + universal elemental inputs.
2. Norman vertical slice including Tornado Kick, Elbow and Psychic.
3. Final sprite pipeline and approved character assets.
4. Remaining 13 main fighters.
5. Connor McAlpha and Winston Charlie.
6. Training/body progression.
7. OranKork campaign / Grande Guerra.
8. Audio/VFX/polish and broader QA.

## Definition of Done

M1 is done only when a clean checkout can be operated from Windows CMD with `npm install`, `npm test`, `npm run build` and `npm run dev`, and the browser exposes a complete Norman-vs-Khabib match from character selection through KO/timeout to winner and rematch.
