import React from 'react';

interface ConsultationInputProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const ConsultationInput: React.FC<ConsultationInputProps> = ({ 
  value, 
  onChange, 
  onSubmit, 
  isSubmitting 
}) => {
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;

  const hint = `Describe: (1) Your diagnosis of the primary problem  
   (2) Root cause analysis  
   (3) Strategic recommendations with rationale  
   (4) Implementation roadmap  
   (5) Expected KPI impact`;

  return (
    <div className="bg-[#1f1f1f] border border-white/10 rounded-lg p-6 space-y-4 shadow-xl">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-bold uppercase tracking-wider text-white/60">Your consultation</h3>
        <span className="text-xs text-white/40 font-mono">{wordCount} words</span>
      </div>
      
      <div className="relative">
        {!value && (
          <div className="absolute top-6 left-6 right-6 text-white/20 pointer-events-none text-sm leading-relaxed whitespace-pre-line">
            {hint}
          </div>
        )}
        <textarea
          className="w-full min-h-[300px] bg-white/5 border border-white/10 rounded-lg p-6 outline-none focus:border-brand-red/50 focus:bg-white/10 transition-all text-white/80 resize-y font-serif text-lg leading-relaxed selection:bg-brand-red/30"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder=""
        />
      </div>

      <div className="flex justify-end">
        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="bg-brand-red hover:bg-[#ff4d4d] text-white font-bold px-10 py-4 rounded-xl transition-all shadow-xl shadow-brand-red/20 disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              RUNNING DIGITAL TWIN SIMULATION...
            </>
          ) : (
            'FINISH & RUN DIGITAL TWIN SIMULATION'
          )}
        </button>
      </div>
    </div>
  );
};

export default ConsultationInput;
