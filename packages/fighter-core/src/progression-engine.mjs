export const PROGRESSION_ENGINE_VERSION = 1;

export const EXPERIENCE_KINDS = ["observed", "recognized", "defended", "reproduced", "adapted", "mastered"];
const WEIGHTS = Object.freeze({ observed: 2, recognized: 3, defended: 6, reproduced: 8, adapted: 12, mastered: 16 });
const round2 = value => Math.round(value * 100) / 100;

const assertQuality = quality => {
  if (!Number.isFinite(quality) || quality < 0 || quality > 1) throw new Error("quality must be a finite number between 0 and 1");
};

export function repetitionXp(uses) {
  if (!Number.isInteger(uses) || uses < 0) throw new Error("uses must be a non-negative integer");
  let xp = 0;
  for (let i = 0; i < uses; i += 1) xp += 10 / (1 + i / 10);
  return round2(xp);
}

export function evaluateTechniqueProgress(technique) {
  if (!technique || !Number.isInteger(technique.uses) || technique.uses < 0) throw new Error("invalid technique uses");
  const evidence = technique.evidence ?? [];
  if (!Array.isArray(evidence)) throw new Error("invalid technique evidence");
  let contextualXp = 0;
  for (const event of evidence) {
    if (!event || !EXPERIENCE_KINDS.includes(event.kind)) throw new Error("invalid experience kind");
    assertQuality(event.quality);
    contextualXp += WEIGHTS[event.kind] * event.quality;
  }
  const xp = round2(repetitionXp(technique.uses) + contextualXp);
  const level = 1 + Math.floor(Math.sqrt(Math.max(0, xp) / 100));
  const diversity = EXPERIENCE_KINDS.filter(kind => (technique.experience?.[kind] ?? 0) > 0).length;
  return { engineVersion: PROGRESSION_ENGINE_VERSION, xp, level, proficiency: { diversity } };
}
