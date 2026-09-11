// ---- Confirmed figures ----
export const TERM_WEEKS = 36;
export const DEPOSIT_PER_ROOM = 40;
export const MIN_BUDGET_THRESHOLD = 300;
export const MAX_BUDGET = 2000;
export const MAX_ROOMS = 5;
export const STAIRS_FEE = 150;
export const ROOM_SQM = 10;

export const FLOORING_PRICES_PER_M2 = {
  carpet: 29,
  vinyl: 31.5,
  laminate: 35,
};

export const FLOORING_LABELS = {
  vinyl: 'Vinyl',
  carpet: 'Carpet',
  laminate: 'Laminate',
};

// Order matters for display (cheapest first)
export const FLOORING_ORDER = ['carpet', 'vinyl', 'laminate'];

// Stairs are only offered in these materials — laminate isn't fitted on stairs.
export const STAIRS_ELIGIBLE_FLOORING = ['vinyl', 'carpet'];

export const FREQUENCY_LIMITS = {
  weekly: { min: 10, max: 100, step: 1 },
  monthly: { min: 40, max: 400, step: 5 },
};
// ---- end confirmed figures ----

export function weeklyEquivalent(amount, frequency) {
  if (frequency === 'monthly') {
    return (amount * 12) / 52;
  }
  return amount;
}

export function totalBudgetAvailable(amount, frequency) {
  const raw = weeklyEquivalent(amount, frequency) * TERM_WEEKS;
  return Math.min(raw, MAX_BUDGET);
}

// Warns when the stairs addon is ticked with laminate selected, since
// laminate isn't fitted on stairs. Returns null when there's nothing to
// warn about.
export function stairsConflictMessage(material, hasStairs) {
  if (!hasStairs || material !== 'laminate') return null;
  return "Stairs aren't available in laminate, so the stairs add-on won't apply to your result.";
}

// Every room is treated as a flat 10m² unit — how many whole rooms the
// budget left over for flooring area affords, once a flat add-on fee (e.g.
// stairs) is set aside, capped at MAX_ROOMS.
function roomsForBudget(pricePerM2, totalBudget, flatFee) {
  const budgetForArea = totalBudget - flatFee;
  if (budgetForArea <= 0) return 0;

  const affordableSqm = budgetForArea / pricePerM2;
  return Math.min(Math.floor(affordableSqm / ROOM_SQM), MAX_ROOMS);
}

export function calculateSingleResult({ amount, frequency, material, hasStairs }) {
  const totalBudget = totalBudgetAvailable(amount, frequency);
  const belowMinimum = totalBudget < MIN_BUDGET_THRESHOLD;

  if (!material) {
    return { totalBudget, belowMinimum, roomCount: 0 };
  }

  const stairsFeeApplied = hasStairs && STAIRS_ELIGIBLE_FLOORING.includes(material);
  const flatFee = stairsFeeApplied ? STAIRS_FEE : 0;
  const pricePerM2 = FLOORING_PRICES_PER_M2[material];
  const roomCount = roomsForBudget(pricePerM2, totalBudget, flatFee);

  if (roomCount < 1) {
    return { totalBudget, belowMinimum, roomCount: 0, stairsFeeApplied };
  }

  return {
    totalBudget,
    belowMinimum,
    roomCount,
    cost: pricePerM2 * ROOM_SQM * roomCount + flatFee,
    deposit: DEPOSIT_PER_ROOM * roomCount,
    stairsFeeApplied,
  };
}
