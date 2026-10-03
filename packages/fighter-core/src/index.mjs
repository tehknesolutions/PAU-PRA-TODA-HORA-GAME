const VERSION = 1;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const bounded = value => clamp(Number(value), 0, 100);
const round2 = value => Math.round(value * 100) / 100;

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
      massKg: Number(body.massKg ?? 70), muscleMass: Number(body.muscleMass ?? 10),
      strength: Number(body.strength ?? 10), endurance: Number(body.endurance ?? 10),
      mobility: Number(body.mobility ?? 10), flexibility: Number(body.flexibility ?? 10),
      balance: Number(body.balance ?? 10), coordination: Number(body.coordination ?? 10)
    },
    needs: { nutrition: 100, hydration: 100, sleep: 100 },
    condition: { staminaMax, stamina: staminaMax, combatStamina: staminaMax, fatigue: 0, health: 100, pain: 0, injuries: [] },
    martial: { arts: {}, techniques: {}, integrations: {} },
    history: []
  };
}

export function applyNeeds(fighter, changes = {}) {
  const next = structuredClone(fighter);
  for (const key of ["nutrition", "hydration", "sleep"]) {
    const delta = Number(changes[key] ?? 0);
    next.needs[key] = bounded(next.needs[key] + delta);
  }
  next.history.push({ type: "needs", changes: {
    nutrition: Number(changes.nutrition ?? 0), hydration: Number(changes.hydration ?? 0), sleep: Number(changes.sleep ?? 0)
  }});
  return next;
}

export function addInjury(fighter, injury) {
  if (!injury?.id || !injury?.region) throw new Error("injury requires id and region");
  const next = structuredClone(fighter);
  const normalized = { id: injury.id, region: injury.region, severity: bounded(injury.severity ?? 0), pain: bounded(injury.pain ?? 0) };
  next.condition.injuries.push(normalized);
  next.condition.pain = bounded(next.condition.injuries.reduce((total, item) => total + item.pain, 0));
  next.history.push({ type: "injury", ...normalized });
  return next;
}

export function recoverInjuries(fighter, { severity = 0, pain = 0 } = {}) {
  const next = structuredClone(fighter);
  const severityRecovery = Math.max(0, Number(severity));
  const painRecovery = Math.max(0, Number(pain));
  next.condition.injuries = next.condition.injuries
    .map(injury => ({ ...injury, severity: bounded(injury.severity - severityRecovery), pain: bounded(injury.pain - painRecovery) }))
    .filter(injury => injury.severity > 0 || injury.pain > 0);
  next.condition.pain = bounded(next.condition.injuries.reduce((total, injury) => total + injury.pain, 0));
  next.history.push({ type: "injury-recovery", severity: severityRecovery, pain: painRecovery });
  return next;
}

export function applyActivity(fighter, activity) {
  const next = structuredClone(fighter);
  const staminaCost = Math.max(0, Number(activity.staminaCost ?? 0));
  const fatigueGain = Math.max(0, Number(activity.fatigueGain ?? staminaCost * 0.25));
  if (next.condition.stamina < staminaCost) throw new Error("insufficient stamina");
  next.condition.stamina = clamp(next.condition.stamina - staminaCost, 0, next.condition.staminaMax);
  next.condition.fatigue = bounded(next.condition.fatigue + fatigueGain);
  next.history.push({ type: "activity", id: activity.id ?? "unknown", staminaCost, fatigueGain });
  return next;
}

export function recover(fighter, { stamina = 0, fatigue = 0 } = {}) {
  const next = structuredClone(fighter);
  next.condition.stamina = clamp(next.condition.stamina + Math.max(0, stamina), 0, next.condition.staminaMax);
  next.condition.fatigue = bounded(next.condition.fatigue - Math.max(0, fatigue));
  next.history.push({ type: "recovery", stamina: Math.max(0, stamina), fatigue: Math.max(0, fatigue) });
  return next;
}

// Experimental diagnostic only. Weights are deliberately isolated so balance can change without changing the state model.
export function getReadiness(fighter) {
  const staminaRatio = bounded((fighter.condition.stamina / fighter.condition.staminaMax) * 100);
  const needsAverage = (fighter.needs.nutrition + fighter.needs.hydration + fighter.needs.sleep) / 3;
  const recoveryState = 100 - bounded(fighter.condition.fatigue);
  const painState = 100 - bounded(fighter.condition.pain);
  return round2(bounded(staminaRatio * 0.4 + needsAverage * 0.25 + recoveryState * 0.25 + painState * 0.1));
}

export function prepareCombat(fighter) {
  const next = structuredClone(fighter);
  const readiness = getReadiness(next) / 100;
  next.condition.combatStamina = round2(clamp(next.condition.stamina * readiness, 0, next.condition.stamina));
  next.history.push({ type: "combat-preparation", readiness: round2(readiness * 100), combatStamina: next.condition.combatStamina });
  return next;
}

export function serializeFighter(fighter) { return JSON.stringify(fighter); }

export function deserializeFighter(serialized) {
  const fighter = JSON.parse(serialized);
  if (fighter.schemaVersion !== VERSION) throw new Error("unsupported fighter schema version");
  return fighter;
}
