export default function Landing({ onStart }) {
  return (
    <div className="screen screen--landing">
      <div className="landing-glow" aria-hidden="true" />
      <h1 className="headline">What fits my budget?</h1>
      <p className="subhead">
        Pick your flooring, set a weekly or monthly budget, and watch what it gets you
        update live — no jargon, no surprises.
      </p>
      <button className="btn btn--primary" onClick={onStart}>
        Get started
      </button>
    </div>
  );
}
