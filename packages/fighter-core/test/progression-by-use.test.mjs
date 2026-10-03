import test from "node:test";
import assert from "node:assert/strict";
import {
  createFighter,
  learnTechnique,
  useTechnique,
  recordTechniqueExperience,
  getTechniqueProgress
} from "../src/index.mjs";

test("a fighter can learn a named technique at zero proficiency", () => {
  let fighter = createFighter({ id: "p1", name: "Rookie" });
  fighter = learnTechnique(fighter, {
    id: "bandal-tchagui",
    name: "Bandal Tchagui",
    art: "taekwondo",
    family: "kicks"
  });
  assert.deepEqual(getTechniqueProgress(fighter, "bandal-tchagui"), {
    id: "bandal-tchagui", name: "Bandal Tchagui", art: "taekwondo", family: "kicks",
    level: 1, xp: 0, uses: 0, experience: { observed: 0, recognized: 0, defended: 0, reproduced: 0, adapted: 0, mastered: 0 }
  });
});

test("using a learned technique produces technique-specific XP and usage history", () => {
  let fighter = createFighter({ id: "p1", name: "Rookie" });
  fighter = learnTechnique(fighter, { id: "bandal-tchagui", name: "Bandal Tchagui", art: "taekwondo", family: "kicks" });
  fighter = useTechnique(fighter, "bandal-tchagui", { repetitions: 10 });
  const progress = getTechniqueProgress(fighter, "bandal-tchagui");
  assert.equal(progress.uses, 10);
  assert.ok(progress.xp > 0);
  assert.equal(fighter.history.at(-1).type, "technique-use");
});

test("contextual martial experience is recorded independently from raw repetitions", () => {
  let fighter = createFighter({ id: "p1", name: "Rookie" });
  fighter = learnTechnique(fighter, { id: "bandal-tchagui", name: "Bandal Tchagui", art: "taekwondo", family: "kicks" });
  fighter = recordTechniqueExperience(fighter, "bandal-tchagui", { kind: "defended", quality: 0.8 });
  const progress = getTechniqueProgress(fighter, "bandal-tchagui");
  assert.equal(progress.uses, 0);
  assert.equal(progress.experience.defended, 1);
  assert.ok(progress.xp > 0);
  assert.equal(fighter.history.at(-1).type, "technique-experience");
});

test("higher-order adaptation is worth more than passive observation", () => {
  let observed = createFighter({ id: "o", name: "Observer" });
  let adapted = createFighter({ id: "a", name: "Adapter" });
  for (const fighter of [observed, adapted]) fighter.martial.techniques = fighter.martial.techniques;
  observed = learnTechnique(observed, { id: "jab", name: "Jab", art: "boxing", family: "punches" });
  adapted = learnTechnique(adapted, { id: "jab", name: "Jab", art: "boxing", family: "punches" });
  observed = recordTechniqueExperience(observed, "jab", { kind: "observed", quality: 1 });
  adapted = recordTechniqueExperience(adapted, "jab", { kind: "adapted", quality: 1 });
  assert.ok(getTechniqueProgress(adapted, "jab").xp > getTechniqueProgress(observed, "jab").xp);
});

test("quality changes learning value without changing the number of experiences", () => {
  let low = createFighter({ id: "low", name: "Low" });
  let high = createFighter({ id: "high", name: "High" });
  low = learnTechnique(low, { id: "jab", name: "Jab", art: "boxing", family: "punches" });
  high = learnTechnique(high, { id: "jab", name: "Jab", art: "boxing", family: "punches" });
  low = recordTechniqueExperience(low, "jab", { kind: "reproduced", quality: 0.25 });
  high = recordTechniqueExperience(high, "jab", { kind: "reproduced", quality: 1 });
  assert.equal(getTechniqueProgress(low, "jab").experience.reproduced, 1);
  assert.equal(getTechniqueProgress(high, "jab").experience.reproduced, 1);
  assert.ok(getTechniqueProgress(high, "jab").xp > getTechniqueProgress(low, "jab").xp);
});

test("training one technique does not grant free proficiency to another", () => {
  let fighter = createFighter({ id: "p1", name: "Rookie" });
  fighter = learnTechnique(fighter, { id: "bandal-tchagui", name: "Bandal Tchagui", art: "taekwondo", family: "kicks" });
  fighter = learnTechnique(fighter, { id: "jab", name: "Jab", art: "boxing", family: "punches" });
  fighter = useTechnique(fighter, "bandal-tchagui", { repetitions: 20 });
  assert.equal(getTechniqueProgress(fighter, "jab").xp, 0);
});

test("technique level is earned from technique XP rather than global level-up points", () => {
  let fighter = createFighter({ id: "p1", name: "Rookie" });
  fighter = learnTechnique(fighter, { id: "bandal-tchagui", name: "Bandal Tchagui", art: "taekwondo", family: "kicks" });
  fighter = useTechnique(fighter, "bandal-tchagui", { repetitions: 120 });
  assert.ok(getTechniqueProgress(fighter, "bandal-tchagui").level > 1);
  assert.equal(fighter.progression.level, 1);
});

test("repeated bulk practice has diminishing XP return", () => {
  let fighter = createFighter({ id: "p1", name: "Rookie" });
  fighter = learnTechnique(fighter, { id: "bandal-tchagui", name: "Bandal Tchagui", art: "taekwondo", family: "kicks" });
  fighter = useTechnique(fighter, "bandal-tchagui", { repetitions: 10 });
  const firstGain = getTechniqueProgress(fighter, "bandal-tchagui").xp;
  fighter = useTechnique(fighter, "bandal-tchagui", { repetitions: 100 });
  const total = getTechniqueProgress(fighter, "bandal-tchagui").xp;
  assert.ok((total - firstGain) / 100 < firstGain / 10);
});

test("invalid experience kinds and qualities are rejected", () => {
  let fighter = createFighter({ id: "p1", name: "Rookie" });
  fighter = learnTechnique(fighter, { id: "jab", name: "Jab", art: "boxing", family: "punches" });
  assert.throws(() => recordTechniqueExperience(fighter, "jab", { kind: "magic", quality: 1 }), /invalid experience kind/);
  assert.throws(() => recordTechniqueExperience(fighter, "jab", { kind: "observed", quality: 2 }), /quality/);
});

test("an unknown technique cannot be progressed by use", () => {
  const fighter = createFighter({ id: "p1", name: "Rookie" });
  assert.throws(() => useTechnique(fighter, "flying-magic-kick", { repetitions: 1 }), /technique not learned/);
});
