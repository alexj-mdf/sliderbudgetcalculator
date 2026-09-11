import { DEPOSIT_PER_ROOM, describeTier } from '../calc';
import MinimumMessage from './MinimumMessage';

const currency = (n) =>
  n.toLocaleString('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 });

function depositLine(roomCount, deposit, stairsFeeApplied) {
  const base = `£${DEPOSIT_PER_ROOM} per room (£${deposit} total for ${roomCount} room${roomCount > 1 ? 's' : ''}), due on the day`;
  return stairsFeeApplied ? `${base} — includes £150 for stairs.` : base;
}

function MaterialCard({ label, tier, cost, deposit, roomCount, stairsFeeApplied }) {
  if (!tier) {
    return (
      <div className="tier-card">
        <span className="tier-card-label">{label}</span>
        <MinimumMessage />
      </div>
    );
  }

  return (
    <div className="tier-card">
      <span className="tier-card-label">{label}</span>
      <span className="tier-card-tier">{describeTier(tier)}</span>
      <span className="tier-card-rooms">
        {roomCount} room{roomCount > 1 ? 's' : ''}
      </span>
      <span className="tier-card-cost">{currency(cost)}</span>
      <span className="tier-card-deposit">{depositLine(roomCount, deposit, stairsFeeApplied)}</span>
    </div>
  );
}

function renderMaterialCard(m) {
  return (
    <MaterialCard
      key={m.key}
      label={m.label}
      tier={m.tier}
      cost={m.cost}
      deposit={m.deposit}
      roomCount={m.roomCount}
      stairsFeeApplied={m.stairsFeeApplied}
    />
  );
}

function MixCard({ mix }) {
  const label = `Mix of ${mix.materialLabels.join(' & ')}`;

  if (!mix.tier) {
    return (
      <div className="tier-card">
        <span className="tier-card-label">{label}</span>
        <MinimumMessage />
      </div>
    );
  }

  return (
    <div className="tier-card">
      <span className="tier-card-label">{label}</span>
      <span className="tier-card-tier">{describeTier(mix.tier)}</span>
      <span className="tier-card-rooms">
        {mix.roomCount} room{mix.roomCount > 1 ? 's' : ''}
      </span>
      <span className="tier-card-split">~{mix.splitSqm.toFixed(1)}m² each</span>
      <span className="tier-card-cost">{currency(mix.cost)}</span>
      <span className="tier-card-deposit">
        {depositLine(mix.roomCount, mix.deposit, mix.stairsFeeApplied)}
      </span>
      <span className="option-note">Exact combination confirmed at your free measure-up.</span>
    </div>
  );
}

export default function ResultPanel({
  result,
  mixMode,
  onToggleMixMode,
  hasStairs,
  onToggleStairs,
  stairsWarning,
  frequency,
  amount,
  onBookMeasureUp,
}) {
  const { belowMinimum, totalBudget, materials, mix } = result;
  const showMixToggle = materials.length >= 2;
  // Mixing materials across a single room doesn't make sense — the toggle
  // only unlocks once the blended tier reaches 2+ rooms.
  const mixAvailable = Boolean(mix?.tier) && mix.roomCount >= 2;
  const showMix = mixMode && mixAvailable;

  return (
    <div className="result-block">
      <div className="budget-hero">
        <div className="budget-hero-glow" aria-hidden="true" />
        <span className="budget-hero-label">Your budget</span>
        <span className="budget-hero-amount">{currency(totalBudget)}</span>
      </div>
      <p className="subhead subhead--tight result-basis">to spend on flooring.</p>

      <label className="stairs-row">
        <span className="stairs-row-text">
          <span className="stairs-row-label">Add stairs</span>
          <span className="stairs-row-hint">Flat fee for carpet and vinyl</span>
        </span>
        <span className="switch">
          <input
            type="checkbox"
            checked={hasStairs}
            onChange={(e) => onToggleStairs(e.target.checked)}
          />
          <span className="switch-track" aria-hidden="true" />
        </span>
      </label>
      {stairsWarning && <p className="stairs-warning">{stairsWarning}</p>}

      {belowMinimum ? (
        <MinimumMessage />
      ) : (
        <>
          {showMixToggle && (
            <button
              type="button"
              className="mix-toggle-btn"
              onClick={onToggleMixMode}
              disabled={!mixAvailable}
              title={mixAvailable ? undefined : 'Available once your budget covers 2+ rooms'}
            >
              {showMix ? 'Show separately' : 'Mix these instead'}
            </button>
          )}

          {showMix ? (
            <div className="tier-cards-grid tier-cards-grid--single">
              <MixCard mix={mix} />
            </div>
          ) : materials.length === 2 ? (
            <div className="tier-cards-pair">
              {renderMaterialCard(materials[0])}
              <span className="tier-cards-or" aria-hidden="true">
                Or
              </span>
              {renderMaterialCard(materials[1])}
            </div>
          ) : (
            <div className="tier-cards-grid">{materials.map(renderMaterialCard)}</div>
          )}

          <p className="fitting-note">
            Based on {currency(amount)}/{frequency === 'weekly' ? 'week' : 'month'} over 36 weeks.
            Fitting fee applies, confirmed at your free measure-up.
          </p>
        </>
      )}

      <button className="btn btn--primary btn--cta btn--fixed" onClick={onBookMeasureUp}>
        Book a free measure-up
      </button>

      <p className="disclaimer-note">
        This is a guide only. A quick affordability check (income and outgoings, not a credit
        check) is carried out before anything's confirmed.
      </p>
    </div>
  );
}
