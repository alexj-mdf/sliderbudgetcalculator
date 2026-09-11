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

// Flat average room size used only for the Stage 1 "up to X rooms" estimate,
// before any material is picked. Carpet is the reference price since it's
// the cheapest — this is a maximum, not a material-specific figure. Matches
// the "small" room preset used elsewhere, so at Carpet's price one room
// (£290) sits just under the £300 minimum order — anything that clears the
// minimum resolves to at least 1 room, with no separate zero-room fallback.
export const AVERAGE_ROOM_SQM = 10;

export function maxRoomsForBudget(totalBudget) {
  return Math.floor(totalBudget / (AVERAGE_ROOM_SQM * FLOORING_PRICES_PER_M2.carpet));
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

// Warns when the stairs addon is ticked alongside laminate, since laminate
// isn't fitted on stairs. Returns null when there's nothing to warn about.
export function stairsConflictMessage(selectedFlooring, hasStairs) {
  if (!hasStairs || !selectedFlooring.includes('laminate')) return null;

  const hasEligibleMaterial = selectedFlooring.some((key) =>
    STAIRS_ELIGIBLE_FLOORING.includes(key)
  );

  if (!hasEligibleMaterial) {
    return "Stairs aren't available in laminate, so the stairs add-on won't apply to your result.";
  }
  return "Stairs aren't available in laminate — the add-on will still apply wherever Vinyl or Carpet is used.";
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

function buildMaterialResult({ key, label, pricePerM2, totalBudget, stairsFeeApplies }) {
  const flatFee = stairsFeeApplies ? STAIRS_FEE : 0;
  const tier = tierForBudget(pricePerM2, totalBudget, flatFee);

  if (!tier) {
    return { key, label, tier: null, stairsFeeApplied: stairsFeeApplies };
  }

  const cost = pricePerM2 * tier.sqm + flatFee;
  const roomCount = tier.rooms.length;

  return {
    key,
    label,
    tier,
    cost,
    roomCount,
    deposit: DEPOSIT_PER_ROOM * roomCount,
    stairsFeeApplied: stairsFeeApplies,
  };
}

export function calculateLiveResult({ amount, frequency, selectedFlooring, hasStairs }) {
  const totalBudget = totalBudgetAvailable(amount, frequency);
  const belowMinimum = totalBudget < MIN_BUDGET_THRESHOLD;

  const orderedSelection = FLOORING_ORDER.filter((key) => selectedFlooring.includes(key));

  const materials = orderedSelection.map((key) =>
    buildMaterialResult({
      key,
      label: FLOORING_LABELS[key],
      pricePerM2: FLOORING_PRICES_PER_M2[key],
      totalBudget,
      stairsFeeApplies: hasStairs && STAIRS_ELIGIBLE_FLOORING.includes(key),
    })
  );

  let mix = null;
  if (orderedSelection.length >= 2) {
    const blendedPricePerM2 =
      orderedSelection.reduce((sum, key) => sum + FLOORING_PRICES_PER_M2[key], 0) /
      orderedSelection.length;
    const stairsFeeApplies =
      hasStairs && orderedSelection.some((key) => STAIRS_ELIGIBLE_FLOORING.includes(key));
    const flatFee = stairsFeeApplies ? STAIRS_FEE : 0;
    const tier = tierForBudget(blendedPricePerM2, totalBudget, flatFee);
    const materialLabels = orderedSelection.map((key) => FLOORING_LABELS[key]);

    if (tier) {
      const cost = blendedPricePerM2 * tier.sqm + flatFee;
      const roomCount = tier.rooms.length;
      mix = {
        materialLabels,
        tier,
        cost,
        roomCount,
        deposit: DEPOSIT_PER_ROOM * roomCount,
        splitSqm: tier.sqm / orderedSelection.length,
        stairsFeeApplied: stairsFeeApplies,
      };
    } else {
      mix = { materialLabels, tier: null, stairsFeeApplied: stairsFeeApplies };
    }
  }

  return { totalBudget, belowMinimum, materials, mix };
}
