import React, { useState, useEffect } from 'react';
import { Loader2, Database, Brain, FileSearch, CheckCircle2 } from 'lucide-react';

interface SimulationLoadingScreenProps {
  companyName: string;
}

const SimulationLoadingScreen: React.FC<SimulationLoadingScreenProps> = ({ companyName }) => {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const steps = [
    { label: 'Analyzing your consultation...', icon: FileSearch, min: 0, max: 15 },
    { label: `Building digital twin of ${companyName}...`, icon: Database, min: 15, max: 35 },
    { label: 'Running optimal strategy comparison...', icon: Brain, min: 35, max: 60 },
    { label: 'Generating your final walkthrough...', icon: CheckCircle2, min: 60, max: 80 },
  ];

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = (Date.now() - start) / 1000;
      setProgress(Math.min(95, (elapsed / 70) * 100)); // cap at 95% until redirected

      if (elapsed < 15) setStep(0);
      else if (elapsed < 35) setStep(1);
      else if (elapsed < 60) setStep(2);
      else setStep(3);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-near-black flex flex-col items-center justify-center p-10 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-red/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-lg space-y-12">
        {/* Animated Icon */}
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full border-4 border-white/5 flex items-center justify-center relative">
            <Loader2 className="animate-spin text-brand-red w-full h-full absolute" strokeWidth={1} />
            {React.createElement(steps[step].icon, { className: "text-white w-10 h-10", strokeWidth: 1.5 })}
          </div>
        </div>

        {/* Text */}
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold tracking-tight text-white/90">
            Digital Twin Simulation in Progress
          </h2>
          <div className="h-6 flex items-center justify-center">
            <p className="text-brand-red font-mono text-sm uppercase tracking-widest animate-pulse">
              {steps[step].label}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-6">
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-brand-red transition-all duration-300 ease-linear shadow-[0_0_20px_rgba(255,51,51,0.4)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Stepper */}
          <div className="flex justify-between items-center px-2">
            {steps.map((_, idx) => (
              <div 
                key={idx}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${
                  idx <= step ? 'bg-brand-red' : 'bg-white/10'
                } ${idx === step ? 'scale-125 shadow-[0_0_10px_rgba(255,51,51,0.5)]' : ''}`}
              />
            ))}
          </div>
        </div>

        <p className="text-center text-white/40 text-xs mt-10 max-w-xs mx-auto">
          Please do not refresh this page. Our RL engine is running a comparative business logic simulation on your responses.
        </p>
      </div>
    </div>
  );
};

export default SimulationLoadingScreen;
