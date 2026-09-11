import { DEPOSIT_PER_ROOM } from '../calc';
import MinimumMessage from './MinimumMessage';
import TrustBlock from './TrustBlock';

const currency = (n) =>
  n.toLocaleString('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 });

function depositLine(roomCount, deposit, stairsFeeApplied) {
  const base = `£${DEPOSIT_PER_ROOM} per room (£${deposit} total for ${roomCount} room${roomCount > 1 ? 's' : ''}), due on the day`;
  return stairsFeeApplied ? `${base} — includes £150 for stairs.` : base;
}

export default function ResultPanel({
  result,
  materialLabel,
  hasStairs,
  onToggleStairs,
  stairsWarning,
  frequency,
  amount,
  onBookMeasureUp,
}) {
  const { belowMinimum, cost, deposit, roomCount, stairsFeeApplied } = result;

  return (
    <div className="result-block">
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

      {belowMinimum || roomCount < 1 ? (
        <MinimumMessage />
      ) : (
        <>
          <div className="budget-hero">
            <div className="budget-hero-glow" aria-hidden="true" />
            <span className="budget-hero-label">Up to</span>
            <span className="budget-hero-amount">{roomCount}</span>
            <span className="budget-hero-suffix">
              room{roomCount > 1 ? 's' : ''} in {materialLabel}
            </span>
          </div>

          <div className="tier-card">
            <span className="tier-card-tier">
              {roomCount} room{roomCount > 1 ? 's' : ''}
            </span>
            <span className="tier-card-cost">{currency(cost)}</span>
            <span className="tier-card-deposit">
              {depositLine(roomCount, deposit, stairsFeeApplied)}
            </span>
          </div>
        </>
      )}

      <p className="mix-note">
        You can mix and match materials room to room to create your dream home, this is just a
        guide.
      </p>

      <p className="fitting-note">
        Based on {currency(amount)}/{frequency === 'weekly' ? 'week' : 'month'} over 36 weeks.
        Fitting fee applies, confirmed at your free measure-up.
      </p>

      <TrustBlock />

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
