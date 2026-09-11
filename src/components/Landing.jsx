export default function Landing({ onStart }) {
  return (
    <div className="screen screen--landing">
      <div className="landing-glow" aria-hidden="true" />
      <h1 className="headline">What fits my budget?</h1>
      <p className="subhead">
        Set a weekly or monthly budget to see how many rooms it could cover, then pick your
        flooring to see exactly what fits — updating live as you go.
      </p>
      <button className="btn btn--primary" onClick={onStart}>
        Get started
      </button>
    </div>
  );
}
