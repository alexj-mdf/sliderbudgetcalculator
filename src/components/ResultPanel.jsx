import { DEPOSIT_PER_ROOM } from '../calc';
import MinimumMessage from './MinimumMessage';
import TrustBlock from './TrustBlock';

const currency = (n) =>
  n.toLocaleString('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 });

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
  const { belowMinimum, cost, roomCount, stairsFeeApplied } = result;

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

          <p className="result-summary">
            {currency(cost)} total · £{DEPOSIT_PER_ROOM} per room, due on the day
          </p>
          {stairsFeeApplied && <p className="result-summary result-summary--muted">Includes £150 for stairs.</p>}
        </>
      )}

      <p className="mix-note">
        You can mix and match materials room to room to create your dream home, this is just a
        guide.
      </p>

      <p className="disclaimer-note">
        Guide only, based on {currency(amount)}/{frequency === 'weekly' ? 'week' : 'month'} over
        36 weeks — fitting fee and a quick affordability check apply before anything's confirmed.
      </p>

      <TrustBlock />

      <button className="btn btn--primary btn--cta btn--fixed" onClick={onBookMeasureUp}>
        Book a free measure-up
      </button>
    </div>
  );
}
