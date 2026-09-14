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
  const { belowMinimum, roomCount, stairsFeeApplied } = result;
  const hasResult = !belowMinimum && roomCount >= 1;

  const disclaimer = hasResult
    ? `Guide only, based on ${currency(amount)}/${frequency === 'weekly' ? 'week' : 'month'} over 36 weeks — fitting fee and a quick affordability check apply before anything's confirmed.`
    : null;

  return (
    <>
      <div className="section">
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
        {stairsWarning && <p className="caption stairs-warning">{stairsWarning}</p>}
      </div>

      <div className="section">
        {hasResult ? (
          <>
            <div className="budget-hero">
              <div className="budget-hero-glow" aria-hidden="true" />
              <span className="budget-hero-label">Up to</span>
              <span className="budget-hero-amount">{roomCount}</span>
              <span className="budget-hero-suffix">
                room{roomCount > 1 ? 's' : ''} in {materialLabel}
              </span>
            </div>

            <p className="body deposit-line">
              £{DEPOSIT_PER_ROOM} per room deposit, due on the day of your appointment.
            </p>
            {stairsFeeApplied && <p className="caption">Includes £150 for stairs.</p>}
          </>
        ) : (
          <MinimumMessage />
        )}
      </div>

      <TrustBlock disclaimer={disclaimer} />

      <button className="btn btn--cta btn--fixed" onClick={onBookMeasureUp}>
        Book a free measure-up
      </button>
    </>
  );
}
