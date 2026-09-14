import { useState } from 'react';
import './App.css';
import Landing from './components/Landing';
import MaterialSelect from './components/MaterialSelect';
import BudgetSlider from './components/BudgetSlider';
import ResultPanel from './components/ResultPanel';
import { FLOORING_LABELS, calculateSingleResult } from './calc';

// Temporary placeholder — swap for the real booking page once it's built.
const BOOKING_URL = 'https://mydreamflooring.co.uk/';

function App() {
  const [step, setStep] = useState('landing');
  const [frequency, setFrequency] = useState('weekly');
  const [amount, setAmount] = useState(30);
  const [material, setMaterial] = useState(null);

  const handleBudgetChange = (partial) => {
    if ('frequency' in partial) setFrequency(partial.frequency);
    if ('amount' in partial) setAmount(partial.amount);
  };

  const result = calculateSingleResult({ amount, frequency, material });

  const handleBookMeasureUp = () => {
    window.location.href = BOOKING_URL;
  };

  const handleStartOver = () => {
    setStep('landing');
    setFrequency('weekly');
    setAmount(30);
    setMaterial(null);
  };

  return (
    <div className="app-shell">
      {step === 'landing' && <Landing onStart={() => setStep('main')} />}

      {step === 'main' && (
        <div className="screen">
          <button className="link-back" onClick={() => setStep('landing')} aria-label="Back">
            ← Back
          </button>

          <MaterialSelect selected={material} onSelect={setMaterial} />

          <p className="caption mix-note">
            We know you might want a mix of materials room to room, this is just a quick guide.
          </p>

          {material && (
            <>
              <BudgetSlider frequency={frequency} amount={amount} onChange={handleBudgetChange} />
              <ResultPanel
                result={result}
                materialLabel={FLOORING_LABELS[material]}
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
