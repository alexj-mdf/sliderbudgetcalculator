import { useEffect, useRef } from 'react';

export default function TrustBlock({ disclaimer }) {
  const widgetRef = useRef(null);

  // The widget only exists in the DOM once this screen mounts, after
  // Trustpilot's bootstrap script has already done its one-time page scan —
  // so it needs an explicit (re)load once the script itself is ready.
  useEffect(() => {
    const el = widgetRef.current;
    if (!el) return undefined;

    let cancelled = false;

    function tryLoad(attemptsLeft) {
      if (cancelled) return;
      if (window.Trustpilot) {
        window.Trustpilot.loadFromElement(el, true);
        return;
      }
      if (attemptsLeft > 0) {
        setTimeout(() => tryLoad(attemptsLeft - 1), 250);
      }
    }

    tryLoad(20);
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="section trust-footer">
      {disclaimer && <p className="caption disclaimer-line">{disclaimer}</p>}
      <p className="body finance-line">0% in-house finance available, no credit checks</p>
      {/* TrustBox widget - Micro Star */}
      <div
        ref={widgetRef}
        className="trustpilot-widget caption"
        data-locale="en-US"
        data-template-id="5419b732fbfb950b10de65e5"
        data-businessunit-id="6728f7e9261bfeb02d62b9bb"
        data-style-height="24px"
        data-style-width="100%"
        data-token="899ade73-6338-4dcf-8b34-3554ebea8698"
      >
        <a href="https://www.trustpilot.com/review/mydreamflooring.co.uk" target="_blank" rel="noopener noreferrer">
          Trustpilot
        </a>
      </div>
      {/* End TrustBox widget */}
    </div>
  );
}
