# M2 Contextual Progression Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Evolve technique progression from repetition-only XP into deterministic contextual martial learning while preserving the fighter's historical evidence and save compatibility.

**Architecture:** Persistent martial events record facts; a versioned progression engine interprets those facts into XP, level and proficiency signals. Technique history, experience and proficiency remain distinct. Balance formulas are derived state, not historical truth.

**Tech Stack:** JavaScript ES modules, Node.js built-in test runner, immutable fighter-state transforms.

**Spec:** `docs/TAIJIFU-REUSE-MAP.md` plus the approved M2 design in project discovery.

## Global Constraints

- `CONSULTAR ≠ IMPORTAR ≠ APROVAR ≠ CANONIZAR` for external Taijifu repositories.
- XP is not repetitions; experience is not mastery.
- Technique progress is isolated per technique.
- Repetition has diminishing returns.
- Contextual events: `observed`, `recognized`, `defended`, `reproduced`, `adapted`, `mastered`.
- Event quality is bounded `0..1`.
- Historical evidence must survive balance changes.
- No M3-M5 combat simulator concerns are required by M2.
- Existing M1 state invariants remain valid.

## Review Focus

1. Invalid/NaN quality must be rejected rather than poisoning persisted XP.
2. Unknown event kinds must never create progress.
3. Replaying the same event history through the same engine version must be deterministic.
4. Legacy technique records without contextual fields must migrate to neutral defaults without invented experience.
5. Large repetition counts must remain finite and must not bypass diminishing returns.

---

### Task 1: Contextual technique experience state

**Files:**
- Modify: `packages/fighter-core/src/index.mjs`
- Modify: `packages/fighter-core/test/progression-by-use.test.mjs`

**Interfaces:**
- Produces: `recordTechniqueExperience(fighter, techniqueId, event)` and contextual `experience` counters on learned techniques.
- Consumes: existing `learnTechnique`, `getTechniqueProgress`, `validateFighter`.

- [ ] Extend the existing failing tests so a newly learned technique contains neutral counters for all six experience kinds.
- [ ] Verify the contextual progression test file fails because production code lacks the approved interface.
- [ ] Implement `recordTechniqueExperience(fighter, techniqueId, { kind, quality, source?, contextId?, timestamp? })` with kind validation and quality `0..1` validation.
- [ ] Record immutable `technique-experience` history entries without incrementing raw `uses`.
- [ ] Extend fighter validation to reject malformed contextual technique state.
- [ ] Run `node --test packages/fighter-core/test/progression-by-use.test.mjs`; expected PASS for Task 1 cases.
- [ ] Commit: `feat: record contextual martial experience`.

### Task 2: Versioned ProgressionEngine

**Files:**
- Create: `packages/fighter-core/src/progression-engine.mjs`
- Modify: `packages/fighter-core/src/index.mjs`
- Modify: `packages/fighter-core/test/progression-by-use.test.mjs`

**Interfaces:**
- Produces: `PROGRESSION_ENGINE_VERSION`, `evaluateTechniqueProgress(technique)` returning deterministic derived `{ xp, level, proficiency }`.
- Consumes: persisted uses and contextual experience/evidence.

- [ ] Add tests proving same technique history + same engine version produces identical derived progress.
- [ ] Add tests proving `adapted` quality 1 has greater learning value than `observed` quality 1 without making either event equal to mastery.
- [ ] Add tests proving invalid numeric inputs cannot produce NaN/Infinity progress.
- [ ] Implement the engine as a pure function with isolated versioned weights.
- [ ] Route contextual progression through the engine instead of embedding permanent balance truth in event records.
- [ ] Run the progression test file; expected PASS for deterministic engine cases.
- [ ] Commit: `feat: add versioned martial progression engine`.

### Task 3: Evidence diversity and mastery gate

**Files:**
- Modify: `packages/fighter-core/src/progression-engine.mjs`
- Modify: `packages/fighter-core/test/progression-by-use.test.mjs`

**Interfaces:**
- Produces: proficiency/mastery signal derived from evidence diversity.
- Consumes: contextual experience counters/evidence and technique XP.

- [ ] Add a test proving massive raw repetitions alone cannot produce the `mastered` proficiency signal.
- [ ] Add a test proving contextual diversity can advance proficiency when minimum evidence requirements are met.
- [ ] Add a test proving one high-order event cannot fabricate all missing lower evidence categories.
- [ ] Implement the minimal diversity gate; keep thresholds centralized and versioned.
- [ ] Run progression tests; expected PASS.
- [ ] Commit: `feat: gate mastery on diverse martial evidence`.

### Task 4: Save compatibility and migration

**Files:**
- Modify: `packages/fighter-core/src/index.mjs`
- Modify: `packages/fighter-core/test/fighter-core.test.mjs`
- Modify: `packages/fighter-core/test/progression-by-use.test.mjs`

**Interfaces:**
- Produces: save migration path from legacy M1/M2 technique shape to contextual technique shape.
- Consumes: `serializeFighter`, `deserializeFighter`, `validateFighter`.

- [ ] Add a legacy-save fixture whose technique has `level/xp/uses` but no contextual `experience`.
- [ ] Assert migration adds neutral counters and does not invent observed/defended/adapted evidence.
- [ ] Assert valid contextual saves round-trip identically.
- [ ] Implement migration before strict validation during deserialize.
- [ ] Keep current schema behavior deterministic and reject structurally corrupt saves.
- [ ] Run both fighter-core test files; expected PASS.
- [ ] Commit: `feat: migrate contextual progression saves`.

### Task 5: M2 integration gate and documentation

**Files:**
- Modify: `docs/TAIJIFU-REUSE-MAP.md`
- Create: `docs/M2-PROGRESSION-BY-USE.md`

**Interfaces:**
- Produces: documented contract for M3-M5 consumers.
- Consumes: all M2 public interfaces and test evidence.

- [ ] Document `MartialExperienceEvent → TechniqueExperience → ProgressionEngine(version) → TechniqueProficiency`.
- [ ] Document that M3 may add training/session context and M4-M5 may add opponent/distance/pressure/combat context without changing the event contract.
- [ ] Document derived-vs-persisted fields and the non-equivalence of game proficiency to real Taijifu graduation.
- [ ] Run `node --test packages/fighter-core/test/*.test.mjs`; expected all tests PASS when an executable environment is available.
- [ ] If GitHub Actions still fails before steps execute, record that as infrastructure evidence rather than declaring the suite green.
- [ ] Commit: `docs: close M2 progression contract`.

## Completion Gate

M2 is complete only when the implementation satisfies the contextual tests, legacy saves migrate without invented evidence, progression is deterministic for an engine version, spam cannot directly imply mastery, and the full fighter-core suite has verifiable execution evidence. Infrastructure failure is tracked separately and cannot be represented as a test PASS.
