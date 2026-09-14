import { FREQUENCY_LIMITS } from '../calc';

export default function BudgetSlider({ frequency, amount, onChange }) {
  const limits = FREQUENCY_LIMITS[frequency];

  return (
    <div className="section">
      <h2 className="heading">What's your budget?</h2>

      <div className="toggle-group" role="tablist" aria-label="Budget frequency">
        <button
          type="button"
          className={`toggle-btn${frequency === 'weekly' ? ' toggle-btn--active' : ''}`}
          onClick={() => onChange({ frequency: 'weekly', amount: FREQUENCY_LIMITS.weekly.min })}
        >
          Weekly
        </button>
        <button
          type="button"
          className={`toggle-btn${frequency === 'monthly' ? ' toggle-btn--active' : ''}`}
          onClick={() => onChange({ frequency: 'monthly', amount: FREQUENCY_LIMITS.monthly.min })}
        >
          Monthly
        </button>
      </div>

      <div className="amount-display">
        <span className="amount-currency">£</span>
        <input
          type="number"
          className="amount-input"
          value={amount}
          min={limits.min}
          max={limits.max}
          step={limits.step}
          onChange={(e) => onChange({ amount: Number(e.target.value) })}
        />
        <span className="amount-suffix">/{frequency === 'weekly' ? 'week' : 'month'}</span>
      </div>

      <input
        type="range"
        className="amount-slider"
        min={limits.min}
        max={limits.max}
        step={limits.step}
        value={amount}
        onChange={(e) => onChange({ amount: Number(e.target.value) })}
      />
    </div>
  );
}
