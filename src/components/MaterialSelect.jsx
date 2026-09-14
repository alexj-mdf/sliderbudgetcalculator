import { FLOORING_LABELS, FLOORING_ORDER } from '../calc';

export default function MaterialSelect({ selected, onSelect }) {
  return (
    <div className="section section--top">
      <h2 className="heading">What are you interested in?</h2>
      <p className="caption">Pick one — your budget will show what fits.</p>

      <div className="flooring-select-grid" role="radiogroup" aria-label="Flooring material">
        {FLOORING_ORDER.map((key) => {
          const active = selected === key;
          return (
            <button
              type="button"
              key={key}
              className={`flooring-select-btn${active ? ' flooring-select-btn--active' : ''}`}
              onClick={() => onSelect(key)}
              role="radio"
              aria-checked={active}
            >
              {FLOORING_LABELS[key]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
