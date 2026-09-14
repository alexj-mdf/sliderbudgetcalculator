export default function Landing({ onStart }) {
  return (
    <div className="screen screen--landing">
      <div className="landing-glow" aria-hidden="true" />
      <h1 className="heading">What fits my budget?</h1>
      <p className="caption landing-subhead">
        Pick your flooring, then set a weekly or monthly budget to see how many rooms it could
        cover — updating live as you go.
      </p>
      <button className="btn btn--primary" onClick={onStart}>
        Get started
      </button>
    </div>
  );
}
