const VERSION = 1;
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const bounded = value => clamp(Number(value), 0, 100);
const round2 = value => Math.round(value * 100) / 100;
const finite = value => Number.isFinite(value);
const inRange = (value, min, max) => finite(value) && value >= min && value <= max;

export function validateFighter(fighter) {
  const valid = fighter && fighter.schemaVersion === VERSION && typeof fighter.id === "string" && fighter.id.length > 0 &&
    typeof fighter.name === "string" && fighter.name.length > 0 && fighter.body && fighter.needs && fighter.condition && fighter.martial && Array.isArray(fighter.history) &&
    finite(fighter.condition.staminaMax) && fighter.condition.staminaMax > 0 &&
    inRange(fighter.condition.stamina, 0, fighter.condition.staminaMax) && inRange(fighter.condition.combatStamina, 0, fighter.condition.staminaMax) &&
    inRange(fighter.condition.fatigue, 0, 100) && inRange(fighter.condition.health, 0, 100) && inRange(fighter.condition.pain, 0, 100) &&
    [fighter.needs.nutrition, fighter.needs.hydration, fighter.needs.sleep].every(value => inRange(value, 0, 100)) &&
    Array.isArray(fighter.condition.injuries) && fighter.condition.injuries.every(injury => injury && typeof injury.id === "string" && injury.id.length > 0 && typeof injury.region === "string" && injury.region.length > 0 && inRange(injury.severity, 0, 100) && inRange(injury.pain, 0, 100));
  if (!valid) throw new Error("invalid fighter state");
  return true;
}

export function createFighter({ id, name, background = "untrained", body = {} }) {
  if (!id || !name) throw new Error("fighter requires id and name");
  const staminaMax = Math.max(1, Number(body.staminaMax ?? 100));
  const fighter = {
    schemaVersion: VERSION, id, name, background,
    progression: { level: 1, experience: 0 },
    body: { massKg: Number(body.massKg ?? 70), muscleMass: Number(body.muscleMass ?? 10), strength: Number(body.strength ?? 10), endurance: Number(body.endurance ?? 10), mobility: Number(body.mobility ?? 10), flexibility: Number(body.flexibility ?? 10), balance: Number(body.balance ?? 10), coordination: Number(body.coordination ?? 10) },
    needs: { nutrition: 100, hydration: 100, sleep: 100 },
    condition: { staminaMax, stamina: staminaMax, combatStamina: staminaMax, fatigue: 0, health: 100, pain: 0, injuries: [] },
    martial: { arts: {}, techniques: {}, integrations: {} }, history: []
  };
  validateFighter(fighter);
  return fighter;
}

export function learnTechnique(fighter, technique) {
  validateFighter(fighter);
  if (!technique?.id || !technique?.name || !technique?.art || !technique?.family) throw new Error("technique requires id, name, art and family");
  if (fighter.martial.techniques[technique.id]) throw new Error("technique already learned");
  const next = structuredClone(fighter);
  next.martial.techniques[technique.id] = { id: technique.id, name: technique.name, art: technique.art, family: technique.family, level: 1, xp: 0, uses: 0 };
  next.history.push({ type: "technique-learned", techniqueId: technique.id });
  validateFighter(next); return next;
}

export function getTechniqueProgress(fighter, techniqueId) {
  validateFighter(fighter);
  const technique = fighter.martial.techniques[techniqueId];
  if (!technique) throw new Error("technique not learned");
  return structuredClone(technique);
}

const techniqueLevelForXp = xp => 1 + Math.floor(Math.sqrt(Math.max(0, xp) / 100));

export function useTechnique(fighter, techniqueId, { repetitions = 1 } = {}) {
  validateFighter(fighter);
  const current = fighter.martial.techniques[techniqueId];
  if (!current) throw new Error("technique not learned");
  const reps = Math.floor(Number(repetitions));
  if (!Number.isFinite(reps) || reps <= 0) throw new Error("repetitions must be positive");
  const next = structuredClone(fighter);
  const technique = next.martial.techniques[techniqueId];
  let gain = 0;
  for (let i = 0; i < reps; i += 1) {
    const lifetimeUse = technique.uses + i;
    gain += 10 / (1 + lifetimeUse / 10);
  }
  technique.uses += reps;
  technique.xp = round2(technique.xp + gain);
  technique.level = techniqueLevelForXp(technique.xp);
  next.history.push({ type: "technique-use", techniqueId, repetitions: reps, xpGain: round2(gain), totalUses: technique.uses, level: technique.level });
  validateFighter(next); return next;
}

export function applyNeeds(fighter, changes = {}) {
  validateFighter(fighter); const next = structuredClone(fighter);
  for (const key of ["nutrition", "hydration", "sleep"]) next.needs[key] = bounded(next.needs[key] + Number(changes[key] ?? 0));
  next.history.push({ type: "needs", changes: { nutrition: Number(changes.nutrition ?? 0), hydration: Number(changes.hydration ?? 0), sleep: Number(changes.sleep ?? 0) } });
  validateFighter(next); return next;
}

export function addInjury(fighter, injury) {
  validateFighter(fighter); if (!injury?.id || !injury?.region) throw new Error("injury requires id and region");
  const next = structuredClone(fighter); const normalized = { id: injury.id, region: injury.region, severity: bounded(injury.severity ?? 0), pain: bounded(injury.pain ?? 0) };
  next.condition.injuries.push(normalized); next.condition.pain = bounded(next.condition.injuries.reduce((total, item) => total + item.pain, 0));
  next.history.push({ type: "injury", ...normalized }); validateFighter(next); return next;
}

export function recoverInjuries(fighter, { severity = 0, pain = 0 } = {}) {
  validateFighter(fighter); const next = structuredClone(fighter); const severityRecovery = Math.max(0, Number(severity)); const painRecovery = Math.max(0, Number(pain));
  next.condition.injuries = next.condition.injuries.map(injury => ({ ...injury, severity: bounded(injury.severity - severityRecovery), pain: bounded(injury.pain - painRecovery) })).filter(injury => injury.severity > 0 || injury.pain > 0);
  next.condition.pain = bounded(next.condition.injuries.reduce((total, injury) => total + injury.pain, 0)); next.history.push({ type: "injury-recovery", severity: severityRecovery, pain: painRecovery });
  validateFighter(next); return next;
}

export function applyActivity(fighter, activity) {
  validateFighter(fighter); const next = structuredClone(fighter); const staminaCost = Math.max(0, Number(activity.staminaCost ?? 0)); const fatigueGain = Math.max(0, Number(activity.fatigueGain ?? staminaCost * 0.25));
  if (next.condition.stamina < staminaCost) throw new Error("insufficient stamina");
  next.condition.stamina = clamp(next.condition.stamina - staminaCost, 0, next.condition.staminaMax); next.condition.fatigue = bounded(next.condition.fatigue + fatigueGain);
  next.history.push({ type: "activity", id: activity.id ?? "unknown", staminaCost, fatigueGain }); validateFighter(next); return next;
}

export function recover(fighter, { stamina = 0, fatigue = 0 } = {}) {
  validateFighter(fighter); const next = structuredClone(fighter); next.condition.stamina = clamp(next.condition.stamina + Math.max(0, stamina), 0, next.condition.staminaMax); next.condition.fatigue = bounded(next.condition.fatigue - Math.max(0, fatigue));
  next.history.push({ type: "recovery", stamina: Math.max(0, stamina), fatigue: Math.max(0, fatigue) }); validateFighter(next); return next;
}

export function getReadiness(fighter) {
  validateFighter(fighter); const staminaRatio = bounded((fighter.condition.stamina / fighter.condition.staminaMax) * 100); const needsAverage = (fighter.needs.nutrition + fighter.needs.hydration + fighter.needs.sleep) / 3; const recoveryState = 100 - fighter.condition.fatigue; const painState = 100 - fighter.condition.pain;
  return round2(bounded(staminaRatio * 0.4 + needsAverage * 0.25 + recoveryState * 0.25 + painState * 0.1));
}

export function prepareCombat(fighter) {
  validateFighter(fighter); const next = structuredClone(fighter); const readiness = getReadiness(next) / 100; next.condition.combatStamina = round2(clamp(next.condition.stamina * readiness, 0, next.condition.stamina));
  next.history.push({ type: "combat-preparation", readiness: round2(readiness * 100), combatStamina: next.condition.combatStamina }); validateFighter(next); return next;
}

export function serializeFighter(fighter) { validateFighter(fighter); return JSON.stringify(fighter); }
export function deserializeFighter(serialized) { const fighter = JSON.parse(serialized); if (fighter.schemaVersion !== VERSION) throw new Error("unsupported fighter schema version"); validateFighter(fighter); return fighter; }
