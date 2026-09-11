import { useState } from 'react';
import './App.css';
import Landing from './components/Landing';
import Stage1 from './components/Stage1';
import MaterialSelect from './components/MaterialSelect';
import BudgetSlider from './components/BudgetSlider';
import ResultPanel from './components/ResultPanel';
import { calculateLiveResult, stairsConflictMessage } from './calc';

// Temporary placeholder — swap for the real booking page once it's built.
const BOOKING_URL = 'https://mydreamflooring.co.uk/';

function App() {
  // landing -> stage1 (budget only, "up to X rooms") -> stage2 (materials + exact tiers)
  const [step, setStep] = useState('landing');
  const [frequency, setFrequency] = useState('weekly');
  const [amount, setAmount] = useState(30);
  const [selectedFlooring, setSelectedFlooring] = useState([]);
  const [hasStairs, setHasStairs] = useState(false);
  const [mixMode, setMixMode] = useState(false);

  const handleBudgetChange = (partial) => {
    if ('frequency' in partial) setFrequency(partial.frequency);
    if ('amount' in partial) setAmount(partial.amount);
  };

  const handleToggleFlooring = (key) => {
    setSelectedFlooring((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
    // Mix is a per-selection choice — any change to the material list drops
    // back to comparing them side by side.
    setMixMode(false);
  };

  const result = calculateLiveResult({ amount, frequency, selectedFlooring, hasStairs });
  const stairsWarning = stairsConflictMessage(selectedFlooring, hasStairs);

  const handleBookMeasureUp = () => {
    window.location.href = BOOKING_URL;
  };

  const handleStartOver = () => {
    setStep('landing');
    setFrequency('weekly');
    setAmount(30);
    setSelectedFlooring([]);
    setHasStairs(false);
    setMixMode(false);
  };

  return (
    <div className="app-shell">
      {step === 'landing' && <Landing onStart={() => setStep('stage1')} />}

      {step === 'stage1' && (
        <div className="screen">
          <button className="link-back" onClick={() => setStep('landing')} aria-label="Back">
            ← Back
          </button>

          <Stage1
            frequency={frequency}
            amount={amount}
            onChange={handleBudgetChange}
            onSeeOptions={() => setStep('stage2')}
          />

          <button className="link-back link-back--center" onClick={handleStartOver}>
            Start over
          </button>
        </div>
      )}

      {step === 'stage2' && (
        <div className="screen">
          <button className="link-back" onClick={() => setStep('stage1')} aria-label="Back">
            ← Back
          </button>

          <MaterialSelect selected={selectedFlooring} onToggle={handleToggleFlooring} />

          {selectedFlooring.length > 0 && (
            <>
              <BudgetSlider frequency={frequency} amount={amount} onChange={handleBudgetChange} />
              <ResultPanel
                result={result}
                mixMode={mixMode}
                onToggleMixMode={() => setMixMode((v) => !v)}
                hasStairs={hasStairs}
                onToggleStairs={setHasStairs}
                stairsWarning={stairsWarning}
                frequency={frequency}
                amount={amount}
                onBookMeasureUp={handleBookMeasureUp}
              />
            </>
          )}

          <button className="link-back link-back--center" onClick={handleStartOver}>
            Start over
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
