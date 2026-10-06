# Killer Fists: OranKork — Phaser Fighting Core Design

Date: 2026-10-06
Status: APPROVED DESIGN

## Intent

Build the first playable version of Killer Fists: OranKork as a browser-based 2D fighting game using Phaser, executed and developed through Windows Command Prompt.

The first implementation proves the fighting core before expanding the campaign, training systems, full roster, and final sprite pipeline.

## Technical stack

- Phaser 3
- JavaScript ES Modules
- Vite
- npm
- Windows CMD as the primary local execution workflow
- Existing packages/fighter-core preserved as an engine-independent rules layer

Primary commands:

```bat
npm install
npm run dev
npm test
npm run build
```

## Architecture

The game layer and combat-domain layer remain separated.

```text
Browser / Phaser
  |
  +-- Scenes
  |    +-- BootScene
  |    +-- MenuScene
  |    +-- CharacterSelectScene
  |    +-- FightScene
  |
  +-- Presentation
  |    +-- sprites / animations
  |    +-- HUD
  |    +-- camera
  |    +-- audio / VFX
  |
  +-- Input Adapter
       |
       v
packages/fighter-core
  +-- fighter state
  +-- combat rules
  +-- damage
  +-- rounds / KO
  +-- command interpretation (next milestone)
```

Phaser owns rendering, scenes, browser input, animation, camera, audio, and visual feedback.

fighter-core owns deterministic combat state and rules wherever practical. It must not depend on Phaser.

## Initial scene flow

`Boot -> Main Menu -> Character Select -> Fight`

BootScene loads required assets and configuration.

MenuScene starts the playable flow.

CharacterSelectScene initially exposes only the fighters available in the vertical slice, while remaining structurally ready for the approved 15-character roster plus two secret fighters.

FightScene runs one complete match.

## First playable fight

The first milestone requires two controllable/representable fighters and supports:

- move left/right
- crouch
- jump
- punch
- kick
- health
- hitbox and hurtbox collision
- hit stun
- knockback
- round state
- KO
- victory/defeat
- restart/rematch path

Final sprites are not a blocker. Temporary placeholders are allowed until approved sprite assets can be imported.

## Input model

Browser keyboard input is translated by an input adapter into semantic fighting actions rather than being read directly by combat-domain rules.

Example semantic actions:

- LEFT
- RIGHT
- UP
- DOWN
- PUNCH
- KICK

The adapter will later feed a timestamped command buffer.

This keeps the future command interpreter capable of recognizing simultaneous inputs, ordered sequences, timing windows, and charge commands without coupling fighter-core to keyboard keys.

## Special-command roadmap

After the basic fight works, the command interpreter must support the approved universal elemental language:

- Electric: UP + PUNCH
- Water: DOWN + PUNCH
- Fire: UP + KICK
- Wind: DOWN + KICK
- Earth: LEFT -> RIGHT + KICK

It must also support Norman Albert's charge/sequential commands, including:

- Tornado Kick: UP held for 3 seconds -> KICK
- Elbow: DOWN held for 2 seconds -> UP -> DOWN -> PUNCH
- Psychic: charge 3 seconds -> Electric -> Water -> Fire

Recognition must be deterministic and testable outside Phaser.

## Visual direction

The runtime is 2D and designed around hand-drawn pixel-art sprites with anime/manga influence and Street Fighter Alpha 2 as the principal visual-language reference.

The architecture must not assume 3D models.

Sprite animation is frame-based. Character logic and animation presentation remain separate so final art can replace placeholders without rewriting combat rules.

## Project layout

```text
/
+-- index.html
+-- package.json
+-- src/
|   +-- main.js
|   +-- scenes/
|   |   +-- BootScene.js
|   |   +-- MenuScene.js
|   |   +-- CharacterSelectScene.js
|   |   +-- FightScene.js
|   +-- fighters/
|   +-- combat/
|   +-- input/
|   +-- ui/
+-- assets/
|   +-- fighters/
|   +-- stages/
|   +-- effects/
+-- packages/
|   +-- fighter-core/
+-- test/
```

The exact number of files may change during implementation, but these boundaries must remain recognizable.

## Data flow

1. Browser input enters the Phaser input adapter.
2. The adapter emits semantic actions.
3. FightScene sends relevant actions to the combat/domain layer.
4. fighter-core updates deterministic fighter/match state.
5. FightScene reads that state.
6. Phaser updates sprites, animations, HUD, camera, and feedback.

Presentation must not silently become the authority for health, KO, or command recognition.

## Error handling

Development should fail visibly when required fighter definitions or core configuration are invalid.

Missing final visual assets should fall back to explicit development placeholders rather than block the fighting core.

Invalid or incomplete special commands should resolve to no special move, not crash the match.

## Testing

Domain tests cover deterministic fighter/combat rules.

Command-interpreter tests will cover input order, timing, charge duration, simultaneous buttons, tolerance windows, and false-positive prevention.

The Phaser layer gets lightweight smoke coverage where practical, while the primary playable gate is verified in the browser.

Required local gates:

```bat
npm test
npm run build
```

The development server is launched with:

```bat
npm run dev
```

## First implementation gate

A build is considered the first playable vertical slice when:

1. the project installs from npm;
2. `npm run dev` launches the Phaser game;
3. the player can reach a Fight scene;
4. two fighters can move, jump/crouch, punch, and kick;
5. attacks can hit and reduce health;
6. hit stun and knockback are visible;
7. a fighter can reach KO;
8. the match declares a winner;
9. tests pass;
10. production build succeeds.

## Scope boundary

This implementation does not yet require:

- all 15 main fighters;
- the two secret fighters;
- final sprite sheets;
- full OranKork campaign;
- progression/training mode;
- complete elemental VFX;
- Norman boss AI;
- multiplayer.

Those follow after the basic fighting loop is proven.

## Sovereignty

This architecture implements the current Killer Fists: OranKork decisions. Taijifu, HNK, TEHKNÉ, other repositories, games, and frameworks remain references for consultation and reuse only.

`CONSULTAR != IMPORTAR != APROVAR != CANONIZAR`
