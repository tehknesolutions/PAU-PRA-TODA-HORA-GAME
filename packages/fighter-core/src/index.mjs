const VERSION = 1;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export function createFighter({ id, name, background = "untrained", body = {} }) {
  if (!id || !name) throw new Error("fighter requires id and name");

  const staminaMax = Math.max(1, Number(body.staminaMax ?? 100));

  return {
    schemaVersion: VERSION,
    id,
    name,
    background,
    progression: { level: 1, experience: 0 },
    body: {
      massKg: Number(body.massKg ?? 70),
      muscleMass: Number(body.muscleMass ?? 10),
      strength: Number(body.strength ?? 10),
      endurance: Number(body.endurance ?? 10),
      mobility: Number(body.mobility ?? 10),
      flexibility: Number(body.flexibility ?? 10),
      balance: Number(body.balance ?? 10),
      coordination: Number(body.coordination ?? 10)
    },
    condition: {
      staminaMax,
      stamina: staminaMax,
      combatStamina: staminaMax,
      fatigue: 0,
      health: 100,
      pain: 0,
      injuries: []
    },
    martial: {
      arts: {},
      techniques: {},
      integrations: {}
    },
    history: []
  };
}

export function applyActivity(fighter, activity) {
  const next = structuredClone(fighter);
  const staminaCost = Math.max(0, Number(activity.staminaCost ?? 0));
  const fatigueGain = Math.max(0, Number(activity.fatigueGain ?? staminaCost * 0.25));

  if (next.condition.stamina < staminaCost) {
    throw new Error("insufficient stamina");
  }

  next.condition.stamina = clamp(next.condition.stamina - staminaCost, 0, next.condition.staminaMax);
  next.condition.fatigue = clamp(next.condition.fatigue + fatigueGain, 0, 100);
  next.history.push({ type: "activity", id: activity.id ?? "unknown", staminaCost, fatigueGain });
  return next;
}

export function recover(fighter, { stamina = 0, fatigue = 0 } = {}) {
  const next = structuredClone(fighter);
  next.condition.stamina = clamp(next.condition.stamina + Math.max(0, stamina), 0, next.condition.staminaMax);
  next.condition.fatigue = clamp(next.condition.fatigue - Math.max(0, fatigue), 0, 100);
  next.history.push({ type: "recovery", stamina: Math.max(0, stamina), fatigue: Math.max(0, fatigue) });
  return next;
}

export function prepareCombat(fighter) {
  const next = structuredClone(fighter);
  const readiness = clamp(1 - next.condition.fatigue / 125, 0.2, 1);
  next.condition.combatStamina = Math.round(next.condition.stamina * readiness * 100) / 100;
  next.history.push({ type: "combat-preparation", combatStamina: next.condition.combatStamina });
  return next;
}

export function serializeFighter(fighter) {
  return JSON.stringify(fighter);
}

export function deserializeFighter(serialized) {
  const fighter = JSON.parse(serialized);
  if (fighter.schemaVersion !== VERSION) throw new Error("unsupported fighter schema version");
  return fighter;
}
