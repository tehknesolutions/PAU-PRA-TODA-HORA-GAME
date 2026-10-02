import test from "node:test";
import assert from "node:assert/strict";
import {
  createFighter,
  applyActivity,
  recover,
  prepareCombat,
  serializeFighter,
  deserializeFighter
} from "../src/index.mjs";

test("creates an inexperienced persistent fighter", () => {
  const fighter = createFighter({ id: "p1", name: "Rookie" });
  assert.equal(fighter.progression.level, 1);
  assert.equal(fighter.condition.stamina, 100);
  assert.deepEqual(fighter.martial.arts, {});
});

test("activity spends stamina and accumulates fatigue deterministically", () => {
  const fighter = createFighter({ id: "p1", name: "Rookie" });
  const after = applyActivity(fighter, { id: "roadwork", staminaCost: 20, fatigueGain: 8 });
  assert.equal(after.condition.stamina, 80);
  assert.equal(after.condition.fatigue, 8);
  assert.equal(fighter.condition.stamina, 100);
});

test("cannot train without enough stamina", () => {
  const fighter = createFighter({ id: "p1", name: "Rookie", body: { staminaMax: 10 } });
  assert.throws(() => applyActivity(fighter, { staminaCost: 11 }), /insufficient stamina/);
});

test("recovery restores stamina but does not magically exceed capacity", () => {
  let fighter = createFighter({ id: "p1", name: "Rookie" });
  fighter = applyActivity(fighter, { staminaCost: 40, fatigueGain: 20 });
  fighter = recover(fighter, { stamina: 999, fatigue: 5 });
  assert.equal(fighter.condition.stamina, 100);
  assert.equal(fighter.condition.fatigue, 15);
});

test("combat stamina reflects persistent preparation", () => {
  let fresh = createFighter({ id: "fresh", name: "Fresh" });
  let tired = createFighter({ id: "tired", name: "Tired" });
  tired = applyActivity(tired, { staminaCost: 30, fatigueGain: 40 });
  fresh = prepareCombat(fresh);
  tired = prepareCombat(tired);
  assert.ok(fresh.condition.combatStamina > tired.condition.combatStamina);
});

test("fighter save/load round trip preserves state", () => {
  let fighter = createFighter({ id: "p1", name: "Rookie", background: "taekwondo-beginner" });
  fighter = applyActivity(fighter, { id: "mobility", staminaCost: 12, fatigueGain: 3 });
  const restored = deserializeFighter(serializeFighter(fighter));
  assert.deepEqual(restored, fighter);
});
