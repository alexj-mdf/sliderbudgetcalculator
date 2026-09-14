import { DEPOSIT_PER_ROOM } from '../calc';
import MinimumMessage from './MinimumMessage';
import TrustBlock from './TrustBlock';

export default function ResultPanel({ result, materialLabel, onBookMeasureUp }) {
  const { belowMinimum, roomCount } = result;
  const hasResult = !belowMinimum && roomCount >= 1;

  return (
    <>
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
          </>
        ) : (
          <MinimumMessage />
        )}
      </div>

      <TrustBlock />

      <button className="btn btn--cta btn--fixed" onClick={onBookMeasureUp}>
        Book a free measure-up
      </button>
    </>
  );
}
