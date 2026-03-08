import { ShiShen, SHI_SHEN_MEANING } from '@/lib/bazi';

interface Props {
  distribution: Record<ShiShen, number>;
}

const TenGodsDisplay = ({ distribution }: Props) => {
  const sorted = Object.entries(distribution)
    .sort((a, b) => b[1] - a[1]) as [ShiShen, number][];

  return (
    <div className="card-brutal">
      <h3 className="section-title text-center mb-4">十神分佈</h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        {sorted.map(([ss, count]) => (
          <div
            key={ss}
            className={`brutal-border p-3 text-center transition-all ${count > 0 ? 'box-glow-gold' : 'opacity-40'}`}
            style={{ background: count > 0 ? 'hsl(240, 35%, 10%)' : 'hsl(240, 25%, 7%)' }}
          >
            <div className="font-display text-xl gold-text">{ss}</div>
            <div className="font-display text-2xl mt-1" style={{ color: count > 0 ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))' }}>
              {count}
            </div>
            <div className="text-[10px] text-muted-foreground font-body mt-1 leading-tight">
              {SHI_SHEN_MEANING[ss].split('、').slice(0, 2).join('、')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TenGodsDisplay;
