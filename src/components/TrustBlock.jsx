import { useEffect, useRef } from 'react';

export default function TrustBlock() {
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
    <div className="trust-block">
      <p className="trust-block-line">No pressure, no obligation — just a free measure-up.</p>
      <p className="trust-block-line">0% in-house finance available, no credit checks.</p>
      {/* TrustBox widget - Micro Star */}
      <div
        ref={widgetRef}
        className="trustpilot-widget"
        data-locale="en-US"
        data-template-id="5419b732fbfb950b10de65e5"
        data-businessunit-id="6728f7e9261bfeb02d62b9bb"
        data-style-height="24px"
        data-style-width="100%"
        data-theme="dark"
        data-token="13e161d4-331a-4891-b888-a31d3bd75631"
      >
        <a href="https://www.trustpilot.com/review/mydreamflooring.co.uk" target="_blank" rel="noopener noreferrer">
          Trustpilot
        </a>
      </div>
      {/* End TrustBox widget */}
    </div>
  );
}
