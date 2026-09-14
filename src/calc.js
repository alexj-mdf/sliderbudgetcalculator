// ---- Confirmed figures ----
export const TERM_WEEKS = 36;
export const DEPOSIT_PER_ROOM = 40;
export const MIN_BUDGET_THRESHOLD = 300;
export const MAX_BUDGET = 2000;
export const MAX_ROOMS = 5;
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

// Slider caps at the point where even Laminate (the most expensive
// material) has already reached the 5-room cap — beyond this every
// material shows an identical result, which reads as a dead, unresponsive
// range rather than a meaningful one.
export const FREQUENCY_LIMITS = {
  weekly: { min: 10, max: 55, step: 1 },
  monthly: { min: 40, max: 238, step: 5 },
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

// Every room is treated as a flat 10m² unit — how many whole rooms the
// budget affords at this material's price, capped at MAX_ROOMS.
function roomsForBudget(pricePerM2, totalBudget) {
  if (totalBudget <= 0) return 0;

  const affordableSqm = totalBudget / pricePerM2;
  return Math.min(Math.floor(affordableSqm / ROOM_SQM), MAX_ROOMS);
}

export function calculateSingleResult({ amount, frequency, material }) {
  const totalBudget = totalBudgetAvailable(amount, frequency);
  const belowMinimum = totalBudget < MIN_BUDGET_THRESHOLD;

  if (!material) {
    return { totalBudget, belowMinimum, roomCount: 0 };
  }

  const pricePerM2 = FLOORING_PRICES_PER_M2[material];
  const roomCount = roomsForBudget(pricePerM2, totalBudget);

  if (roomCount < 1) {
    return { totalBudget, belowMinimum, roomCount: 0 };
  }

  return {
    totalBudget,
    belowMinimum,
    roomCount,
    deposit: DEPOSIT_PER_ROOM * roomCount,
  };
}
