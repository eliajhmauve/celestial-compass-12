import { DayMasterStrength } from '@/lib/bazi';

interface Props {
  value: DayMasterStrength;
  onChange: (v: DayMasterStrength) => void;
}

const DayMasterStrengthSelector = ({ value, onChange }: Props) => {
  return (
    <div className="card-brutal">
      <h3 className="section-title text-center mb-4">日主強弱</h3>
      <div className="flex gap-3 justify-center">
        <button
          onClick={() => onChange('strong')}
          className={`brutal-border px-6 py-3 font-display text-xl transition-all ${
            value === 'strong'
              ? 'bg-primary text-primary-foreground box-glow-gold'
              : 'bg-secondary text-secondary-foreground hover:bg-muted'
          }`}
        >
          身強
        </button>
        <button
          onClick={() => onChange('weak')}
          className={`brutal-border px-6 py-3 font-display text-xl transition-all ${
            value === 'weak'
              ? 'bg-accent text-accent-foreground'
              : 'bg-secondary text-secondary-foreground hover:bg-muted'
          }`}
        >
          身弱
        </button>
      </div>
      <p className="text-center text-xs text-muted-foreground font-body mt-3">
        請根據命盤五行結構判斷日主強弱
      </p>
    </div>
  );
};

export default DayMasterStrengthSelector;
