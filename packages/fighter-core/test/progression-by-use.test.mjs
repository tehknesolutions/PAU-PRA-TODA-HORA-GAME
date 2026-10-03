import test from "node:test";
import assert from "node:assert/strict";
import {
  createFighter, learnTechnique, useTechnique, recordTechniqueExperience, getTechniqueProgress
} from "../src/index.mjs";
import { PROGRESSION_ENGINE_VERSION, evaluateTechniqueProgress } from "../src/progression-engine.mjs";

const technique = (id = "jab") => ({ id, name: id === "jab" ? "Jab" : "Bandal Tchagui", art: id === "jab" ? "boxing" : "taekwondo", family: id === "jab" ? "punches" : "kicks" });

test("a fighter can learn a named technique at zero proficiency", () => {
  let fighter = createFighter({ id: "p1", name: "Rookie" }); fighter = learnTechnique(fighter, technique("bandal-tchagui"));
  assert.deepEqual(getTechniqueProgress(fighter, "bandal-tchagui"), { ...technique("bandal-tchagui"), level: 1, xp: 0, uses: 0, experience: { observed: 0, recognized: 0, defended: 0, reproduced: 0, adapted: 0, mastered: 0 }, evidence: [] });
});

test("using a learned technique produces technique-specific XP and usage history", () => {
  let fighter = learnTechnique(createFighter({ id: "p1", name: "Rookie" }), technique("bandal-tchagui"));
  fighter = useTechnique(fighter, "bandal-tchagui", { repetitions: 10 }); const progress = getTechniqueProgress(fighter, "bandal-tchagui");
  assert.equal(progress.uses, 10); assert.ok(progress.xp > 0); assert.equal(fighter.history.at(-1).type, "technique-use");
});

test("contextual martial experience is recorded independently from raw repetitions", () => {
  let fighter = learnTechnique(createFighter({ id: "p1", name: "Rookie" }), technique("bandal-tchagui"));
  fighter = recordTechniqueExperience(fighter, "bandal-tchagui", { kind: "defended", quality: 0.8 }); const progress = getTechniqueProgress(fighter, "bandal-tchagui");
  assert.equal(progress.uses, 0); assert.equal(progress.experience.defended, 1); assert.equal(progress.evidence.length, 1); assert.ok(progress.xp > 0); assert.equal(fighter.history.at(-1).type, "technique-experience");
});

test("progression engine is versioned and deterministic", () => {
  assert.equal(PROGRESSION_ENGINE_VERSION, 1);
  const sample = { ...technique(), uses: 12, experience: { observed: 2, recognized: 1, defended: 1, reproduced: 1, adapted: 0, mastered: 0 }, evidence: [{ kind: "observed", quality: 1 }, { kind: "defended", quality: 0.75 }] };
  assert.deepEqual(evaluateTechniqueProgress(sample), evaluateTechniqueProgress(structuredClone(sample)));
});

test("higher-order adaptation is worth more than passive observation", () => {
  let observed = learnTechnique(createFighter({ id: "o", name: "Observer" }), technique()); let adapted = learnTechnique(createFighter({ id: "a", name: "Adapter" }), technique());
  observed = recordTechniqueExperience(observed, "jab", { kind: "observed", quality: 1 }); adapted = recordTechniqueExperience(adapted, "jab", { kind: "adapted", quality: 1 });
  assert.ok(getTechniqueProgress(adapted, "jab").xp > getTechniqueProgress(observed, "jab").xp);
});

test("quality changes learning value without changing the number of experiences", () => {
  let low = learnTechnique(createFighter({ id: "low", name: "Low" }), technique()); let high = learnTechnique(createFighter({ id: "high", name: "High" }), technique());
  low = recordTechniqueExperience(low, "jab", { kind: "reproduced", quality: 0.25 }); high = recordTechniqueExperience(high, "jab", { kind: "reproduced", quality: 1 });
  assert.equal(getTechniqueProgress(low, "jab").experience.reproduced, 1); assert.equal(getTechniqueProgress(high, "jab").experience.reproduced, 1); assert.ok(getTechniqueProgress(high, "jab").xp > getTechniqueProgress(low, "jab").xp);
});

test("engine rejects invalid numeric evidence instead of producing NaN or Infinity", () => {
  const base = { ...technique(), uses: 1, experience: { observed: 1, recognized: 0, defended: 0, reproduced: 0, adapted: 0, mastered: 0 } };
  assert.throws(() => evaluateTechniqueProgress({ ...base, evidence: [{ kind: "observed", quality: Number.NaN }] }), /quality/);
  assert.throws(() => evaluateTechniqueProgress({ ...base, evidence: [{ kind: "observed", quality: Infinity }] }), /quality/);
});

test("training one technique does not grant free proficiency to another", () => {
  let fighter = createFighter({ id: "p1", name: "Rookie" }); fighter = learnTechnique(fighter, technique("bandal-tchagui")); fighter = learnTechnique(fighter, technique()); fighter = useTechnique(fighter, "bandal-tchagui", { repetitions: 20 }); assert.equal(getTechniqueProgress(fighter, "jab").xp, 0);
});

test("technique level is earned from technique XP rather than global level-up points", () => {
  let fighter = learnTechnique(createFighter({ id: "p1", name: "Rookie" }), technique("bandal-tchagui")); fighter = useTechnique(fighter, "bandal-tchagui", { repetitions: 120 }); assert.ok(getTechniqueProgress(fighter, "bandal-tchagui").level > 1); assert.equal(fighter.progression.level, 1);
});

test("repeated bulk practice has diminishing XP return", () => {
  let fighter = learnTechnique(createFighter({ id: "p1", name: "Rookie" }), technique("bandal-tchagui")); fighter = useTechnique(fighter, "bandal-tchagui", { repetitions: 10 }); const firstGain = getTechniqueProgress(fighter, "bandal-tchagui").xp; fighter = useTechnique(fighter, "bandal-tchagui", { repetitions: 100 }); const total = getTechniqueProgress(fighter, "bandal-tchagui").xp; assert.ok((total - firstGain) / 100 < firstGain / 10);
});

test("invalid experience kinds and qualities are rejected", () => {
  let fighter = learnTechnique(createFighter({ id: "p1", name: "Rookie" }), technique()); assert.throws(() => recordTechniqueExperience(fighter, "jab", { kind: "magic", quality: 1 }), /invalid experience kind/); assert.throws(() => recordTechniqueExperience(fighter, "jab", { kind: "observed", quality: 2 }), /quality/);
});

test("an unknown technique cannot be progressed by use", () => { const fighter = createFighter({ id: "p1", name: "Rookie" }); assert.throws(() => useTechnique(fighter, "flying-magic-kick", { repetitions: 1 }), /technique not learned/); });
