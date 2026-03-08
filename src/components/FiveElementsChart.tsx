import { WuXing, WUXING_COLORS } from '@/lib/bazi';

interface Props {
  distribution: Record<WuXing, number>;
}

const FiveElementsChart = ({ distribution }: Props) => {
  const max = Math.max(...Object.values(distribution), 1);
  const elements: WuXing[] = ['木', '火', '土', '金', '水'];

  return (
    <div className="card-brutal">
      <h3 className="section-title text-center mb-4">五行能量</h3>
      <div className="flex items-end justify-center gap-3 md:gap-5 h-48">
        {elements.map((el) => {
          const val = distribution[el];
          const pct = (val / max) * 100;
          return (
            <div key={el} className="flex flex-col items-center gap-2 flex-1 max-w-16">
              <span className="text-xs font-body text-muted-foreground">{val.toFixed(1)}</span>
              <div className="w-full relative" style={{ height: '120px' }}>
                <div
                  className="absolute bottom-0 w-full brutal-border transition-all duration-500"
                  style={{
                    height: `${Math.max(pct, 5)}%`,
                    backgroundColor: WUXING_COLORS[el],
                  }}
                />
              </div>
              <span
                className="font-display text-xl"
                style={{ color: WUXING_COLORS[el] }}
              >
                {el}
              </span>
            </div>
          );
        })}
      </div>

      {/* Cycle indicators */}
      <div className="mt-4 flex justify-center gap-2 text-xs font-body text-muted-foreground flex-wrap">
        <span>木→火→土→金→水（相生）</span>
        <span className="gold-text">|</span>
        <span>木→土→水→火→金（相剋）</span>
      </div>
    </div>
  );
};

export default FiveElementsChart;
