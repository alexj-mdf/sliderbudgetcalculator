import BudgetSlider from './BudgetSlider';
import MinimumMessage from './MinimumMessage';
import { FLOORING_LABELS, MIN_BUDGET_THRESHOLD, maxRoomsForBudget, totalBudgetAvailable } from '../calc';

export default function Stage1({ frequency, amount, onChange, onSeeOptions }) {
  const totalBudget = totalBudgetAvailable(amount, frequency);
  const belowMinimum = totalBudget < MIN_BUDGET_THRESHOLD;
  const maxRooms = maxRoomsForBudget(totalBudget);

  return (
    <>
      <BudgetSlider frequency={frequency} amount={amount} onChange={onChange} />

      {belowMinimum ? (
        <MinimumMessage />
      ) : (
        <div className="budget-hero">
          <div className="budget-hero-glow" aria-hidden="true" />
          <span className="budget-hero-label">You could get up to</span>
          <span className="budget-hero-amount">{maxRooms}</span>
          <span className="budget-hero-suffix">
            room{maxRooms === 1 ? '' : 's'} in {FLOORING_LABELS.carpet}
          </span>
        </div>
      )}

      <button type="button" className="btn btn--primary btn--fixed" onClick={onSeeOptions}>
        See exact options
      </button>
    </>
  );
}
