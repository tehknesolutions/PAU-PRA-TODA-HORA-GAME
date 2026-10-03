import test from "node:test";
import assert from "node:assert/strict";
import {
  createFighter,
  learnTechnique,
  useTechnique,
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
    id: "bandal-tchagui",
    name: "Bandal Tchagui",
    art: "taekwondo",
    family: "kicks",
    level: 1,
    xp: 0,
    uses: 0
  });
});

test("using a learned technique produces technique-specific XP and usage history", () => {
  let fighter = createFighter({ id: "p1", name: "Rookie" });
  fighter = learnTechnique(fighter, { id: "bandal-tchagui", name: "Bandal Tchagui", art: "taekwondo", family: "kicks" });
  fighter = useTechnique(fighter, "bandal-tchagui", { repetitions: 10 });
  const progress = getTechniqueProgress(fighter, "bandal-tchagui");
  assert.equal(progress.uses, 10);
  assert.ok(progress.xp > 0);
  assert.equal(fighter.martial.techniques["bandal-tchagui"].xp, progress.xp);
  assert.equal(fighter.history.at(-1).type, "technique-use");
});

test("training one technique does not grant free proficiency to another", () => {
  let fighter = createFighter({ id: "p1", name: "Rookie" });
  fighter = learnTechnique(fighter, { id: "bandal-tchagui", name: "Bandal Tchagui", art: "taekwondo", family: "kicks" });
  fighter = learnTechnique(fighter, { id: "jab", name: "Jab", art: "boxing", family: "punches" });
  fighter = useTechnique(fighter, "bandal-tchagui", { repetitions: 20 });
  assert.equal(getTechniqueProgress(fighter, "jab").xp, 0);
  assert.equal(getTechniqueProgress(fighter, "jab").uses, 0);
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
  const secondGainPerRep = (total - firstGain) / 100;
  assert.ok(secondGainPerRep < firstGain / 10);
});

test("an unknown technique cannot be progressed by use", () => {
  const fighter = createFighter({ id: "p1", name: "Rookie" });
  assert.throws(() => useTechnique(fighter, "flying-magic-kick", { repetitions: 1 }), /technique not learned/);
});
