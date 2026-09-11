// ---- Confirmed figures ----
export const TERM_WEEKS = 36;
export const DEPOSIT_PER_ROOM = 40;
export const MIN_BUDGET_THRESHOLD = 300;
export const MAX_BUDGET = 2000;
export const MAX_ROOMS = 5;
export const STAIRS_FEE = 150;

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

export const ROOM_SIZE_LABELS = { small: 'Small', medium: 'Medium', large: 'Large' };

export const FREQUENCY_LIMITS = {
  weekly: { min: 10, max: 100, step: 1 },
  monthly: { min: 40, max: 400, step: 5 },
};

// Price-independent room combinations, ordered by increasing total m². The
// live result always picks the highest tier that fits the current budget.
export const TIERS = [
  { rooms: ['small'], sqm: 10 },
  { rooms: ['medium'], sqm: 15 },
  { rooms: ['large'], sqm: 20 },
  { rooms: ['small', 'medium'], sqm: 25 },
  { rooms: ['medium', 'medium'], sqm: 30 },
  { rooms: ['medium', 'large'], sqm: 35 },
  { rooms: ['large', 'large'], sqm: 40 },
  { rooms: ['large', 'large', 'small'], sqm: 50 },
  { rooms: ['large', 'large', 'large'], sqm: 60 },
];
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

// Human-readable room breakdown for a tier, e.g. "2 Large + 1 Small".
export function describeTier(tier) {
  const counts = { small: 0, medium: 0, large: 0 };
  tier.rooms.forEach((size) => {
    counts[size] += 1;
  });
  return ['small', 'medium', 'large']
    .filter((size) => counts[size] > 0)
    .map((size) => `${counts[size]} ${ROOM_SIZE_LABELS[size]}`)
    .join(' + ');
}

// Warns when the stairs addon is ticked with laminate selected, since
// laminate isn't fitted on stairs. Returns null when there's nothing to
// warn about.
export function stairsConflictMessage(material, hasStairs) {
  if (!hasStairs || material !== 'laminate') return null;
  return "Stairs aren't available in laminate, so the stairs add-on won't apply to your result.";
}

// Highest tier whose total m² fits the budget left over for flooring area
// once a flat add-on fee (e.g. stairs) is set aside. Null if even Tier 1
// doesn't fit.
function tierForBudget(pricePerM2, totalBudget, flatFee) {
  const budgetForArea = totalBudget - flatFee;
  if (budgetForArea <= 0) return null;

  const affordableSqm = budgetForArea / pricePerM2;
  let fit = null;
  for (const tier of TIERS) {
    if (tier.sqm <= affordableSqm) {
      fit = tier;
    } else {
      break;
    }
  }
  return fit;
}

export function calculateSingleResult({ amount, frequency, material, hasStairs }) {
  const totalBudget = totalBudgetAvailable(amount, frequency);
  const belowMinimum = totalBudget < MIN_BUDGET_THRESHOLD;

  if (!material) {
    return { totalBudget, belowMinimum, tier: null };
  }

  const stairsFeeApplied = hasStairs && STAIRS_ELIGIBLE_FLOORING.includes(material);
  const flatFee = stairsFeeApplied ? STAIRS_FEE : 0;
  const pricePerM2 = FLOORING_PRICES_PER_M2[material];
  const tier = tierForBudget(pricePerM2, totalBudget, flatFee);

  if (!tier) {
    return { totalBudget, belowMinimum, tier: null, stairsFeeApplied };
  }

  const roomCount = tier.rooms.length;

  return {
    totalBudget,
    belowMinimum,
    tier,
    cost: pricePerM2 * tier.sqm + flatFee,
    roomCount,
    deposit: DEPOSIT_PER_ROOM * roomCount,
    stairsFeeApplied,
  };
}
