import test from "node:test";
import assert from "node:assert/strict";
import { createFighter, applyActivity, applyNeeds, addInjury, recover, recoverInjuries, getReadiness, prepareCombat, validateFighter, serializeFighter, deserializeFighter, learnTechnique, recordTechniqueExperience } from "../src/index.mjs";

test("creates an inexperienced persistent fighter", () => { const fighter = createFighter({ id: "p1", name: "Rookie" }); assert.equal(fighter.progression.level, 1); assert.equal(fighter.condition.stamina, 100); assert.deepEqual(fighter.martial.arts, {}); assert.equal(validateFighter(fighter), true); });
test("fighter starts with independent survival needs", () => { assert.deepEqual(createFighter({ id: "p1", name: "Rookie" }).needs, { nutrition: 100, hydration: 100, sleep: 100 }); });
test("needs change independently and remain bounded", () => { const fighter = createFighter({ id: "p1", name: "Rookie" }); const after = applyNeeds(fighter, { nutrition: -15, hydration: -200, sleep: -20 }); assert.deepEqual(after.needs, { nutrition: 85, hydration: 0, sleep: 80 }); assert.deepEqual(fighter.needs, { nutrition: 100, hydration: 100, sleep: 100 }); });
test("activity spends stamina and accumulates fatigue deterministically", () => { const fighter = createFighter({ id: "p1", name: "Rookie" }); const after = applyActivity(fighter, { id: "roadwork", staminaCost: 20, fatigueGain: 8 }); assert.equal(after.condition.stamina, 80); assert.equal(after.condition.fatigue, 8); });
test("cannot train without enough stamina", () => { const fighter = createFighter({ id: "p1", name: "Rookie", body: { staminaMax: 10 } }); assert.throws(() => applyActivity(fighter, { staminaCost: 11 }), /insufficient stamina/); });
test("injuries preserve region severity and pain as persistent state", () => { const after = addInjury(createFighter({ id: "p1", name: "Rookie" }), { id: "ankle-sprain", region: "left-ankle", severity: 30, pain: 20 }); assert.deepEqual(after.condition.injuries[0], { id: "ankle-sprain", region: "left-ankle", severity: 30, pain: 20 }); assert.equal(after.condition.pain, 20); });
test("injury recovery reduces severity and pain and removes healed injuries", () => { let fighter = addInjury(createFighter({ id: "p1", name: "Rookie" }), { id: "bruise", region: "torso", severity: 8, pain: 6 }); fighter = recoverInjuries(fighter, { severity: 3, pain: 2 }); assert.deepEqual(fighter.condition.injuries[0], { id: "bruise", region: "torso", severity: 5, pain: 4 }); fighter = recoverInjuries(fighter, { severity: 99, pain: 99 }); assert.deepEqual(fighter.condition.injuries, []); });
test("recovery restores stamina but does not magically exceed capacity", () => { let fighter = applyActivity(createFighter({ id: "p1", name: "Rookie" }), { staminaCost: 40, fatigueGain: 20 }); fighter = recover(fighter, { stamina: 999, fatigue: 5 }); assert.equal(fighter.condition.stamina, 100); assert.equal(fighter.condition.fatigue, 15); });
test("readiness is bounded and affected by persistent condition", () => { const fresh = createFighter({ id: "fresh", name: "Fresh" }); let depleted = createFighter({ id: "depleted", name: "Depleted" }); depleted = applyNeeds(depleted, { nutrition: -70, hydration: -80, sleep: -60 }); depleted = applyActivity(depleted, { staminaCost: 40, fatigueGain: 35 }); depleted = addInjury(depleted, { id: "ankle", region: "left-ankle", severity: 20, pain: 15 }); assert.ok(getReadiness(fresh) > getReadiness(depleted)); });
test("combat stamina reflects readiness and never exceeds persistent stamina", () => { let fighter = createFighter({ id: "p1", name: "Rookie" }); fighter = applyNeeds(fighter, { hydration: -50, sleep: -30 }); fighter = applyActivity(fighter, { staminaCost: 25, fatigueGain: 20 }); const prepared = prepareCombat(fighter); assert.ok(prepared.condition.combatStamina <= prepared.condition.stamina); });
test("validator rejects corrupted persistent state", () => { const fighter = createFighter({ id: "p1", name: "Rookie" }); fighter.condition.stamina = 999; assert.throws(() => validateFighter(fighter), /invalid fighter state/); });
test("deserialize rejects structurally invalid saves", () => { const fighter = createFighter({ id: "p1", name: "Rookie" }); fighter.needs.hydration = -10; assert.throws(() => deserializeFighter(JSON.stringify(fighter)), /invalid fighter state/); });

test("legacy technique save migrates to neutral contextual evidence", () => {
  const legacy = createFighter({ id: "legacy", name: "Old Fighter" });
  legacy.martial.techniques.jab = { id: "jab", name: "Jab", art: "boxing", family: "punches", level: 4, xp: 900, uses: 75 };
  const restored = deserializeFighter(JSON.stringify(legacy));
  assert.deepEqual(restored.martial.techniques.jab.experience, { observed: 0, recognized: 0, defended: 0, reproduced: 0, adapted: 0, mastered: 0 });
  assert.deepEqual(restored.martial.techniques.jab.evidence, []);
  assert.equal(restored.martial.techniques.jab.uses, 75);
  assert.equal(restored.martial.techniques.jab.legacyProgress.xp, 900);
  assert.equal(restored.martial.techniques.jab.legacyProgress.level, 4);
});

test("migration never invents contextual martial experience", () => {
  const legacy = createFighter({ id: "legacy", name: "Old Fighter" });
  legacy.martial.techniques.kick = { id: "kick", name: "Kick", art: "taekwondo", family: "kicks", level: 9, xp: 6400, uses: 1000 };
  const restored = deserializeFighter(JSON.stringify(legacy));
  assert.equal(Object.values(restored.martial.techniques.kick.experience).reduce((a, b) => a + b, 0), 0);
  assert.equal(restored.martial.techniques.kick.evidence.length, 0);
});

test("contextual fighter save/load round trip preserves valid state exactly", () => {
  let fighter = createFighter({ id: "p1", name: "Rookie", background: "taekwondo-beginner" });
  fighter = learnTechnique(fighter, { id: "bandal", name: "Bandal Tchagui", art: "taekwondo", family: "kicks" });
  fighter = recordTechniqueExperience(fighter, "bandal", { kind: "observed", quality: 0.8, source: "dojo" });
  assert.deepEqual(deserializeFighter(serializeFighter(fighter)), fighter);
});

test("fighter save/load round trip preserves valid state", () => { let fighter = createFighter({ id: "p1", name: "Rookie", background: "taekwondo-beginner" }); fighter = applyNeeds(fighter, { hydration: -12 }); fighter = addInjury(fighter, { id: "bruise", region: "torso", severity: 5, pain: 3 }); fighter = applyActivity(fighter, { id: "mobility", staminaCost: 12, fatigueGain: 3 }); assert.deepEqual(deserializeFighter(serializeFighter(fighter)), fighter); });
