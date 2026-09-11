import { FLOORING_LABELS, FLOORING_ORDER } from '../calc';

export default function MaterialSelect({ selected, onToggle }) {
  return (
    <>
      <h2 className="step-heading">What are you interested in?</h2>
      <p className="subhead subhead--tight">Pick one or more — your budget will show what fits.</p>

      <div className="flooring-select-grid" role="group" aria-label="Flooring materials">
        {FLOORING_ORDER.map((key) => {
          const active = selected.includes(key);
          return (
            <button
              type="button"
              key={key}
              className={`flooring-select-btn${active ? ' flooring-select-btn--active' : ''}`}
              onClick={() => onToggle(key)}
              aria-pressed={active}
            >
              {FLOORING_LABELS[key]}
            </button>
          );
        })}
      </div>
    </>
  );
}
