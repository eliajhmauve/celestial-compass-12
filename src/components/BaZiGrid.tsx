import { TIAN_GAN, DI_ZHI, TianGan, DiZhi, FourPillars, TIAN_GAN_WUXING, DI_ZHI_WUXING, WUXING_CLASS, getShiShen } from '@/lib/bazi';

interface Props {
  pillars: FourPillars;
  onChange: (pillars: FourPillars) => void;
}

const PILLAR_NAMES = ['年柱', '月柱', '日柱', '時柱'] as const;
const PILLAR_KEYS = ['year', 'month', 'day', 'hour'] as const;

const BaZiGrid = ({ pillars, onChange }: Props) => {
  const dayMaster = pillars.day.tianGan as TianGan;

  const updatePillar = (key: typeof PILLAR_KEYS[number], field: 'tianGan' | 'diZhi', value: string) => {
    onChange({
      ...pillars,
      [key]: { ...pillars[key], [field]: value },
    });
  };

  return (
    <div className="w-full">
      <h3 className="section-title text-center mb-4">四柱八字</h3>
      <div className="grid grid-cols-4 gap-2 md:gap-3 max-w-2xl mx-auto">
        {/* Headers */}
        {PILLAR_NAMES.map((name) => (
          <div key={name} className="text-center font-display text-lg gold-text tracking-widest">
            {name}
          </div>
        ))}

        {/* Tian Gan row */}
        {PILLAR_KEYS.map((key) => {
          const val = pillars[key].tianGan;
          const element = val ? TIAN_GAN_WUXING[val as TianGan] : null;
          const shiShen = val && dayMaster && key !== 'day' ? getShiShen(dayMaster, val as TianGan) : key === 'day' ? '日主' : '';
          return (
            <div key={`tg-${key}`} className="flex flex-col items-center gap-1">
              <select
                value={val}
                onChange={(e) => updatePillar(key, 'tianGan', e.target.value)}
                className={`pillar-cell w-full cursor-pointer ${element ? WUXING_CLASS[element] : ''}`}
              >
                <option value="">天干</option>
                {TIAN_GAN.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
              {shiShen && (
                <span className="text-xs text-muted-foreground font-body">{shiShen}</span>
              )}
            </div>
          );
        })}

        {/* Di Zhi row */}
        {PILLAR_KEYS.map((key) => {
          const val = pillars[key].diZhi;
          const element = val ? DI_ZHI_WUXING[val as DiZhi] : null;
          return (
            <div key={`dz-${key}`}>
              <select
                value={val}
                onChange={(e) => updatePillar(key, 'diZhi', e.target.value)}
                className={`pillar-cell w-full cursor-pointer ${element ? WUXING_CLASS[element] : ''}`}
              >
                <option value="">地支</option>
                {DI_ZHI.map((z) => (
                  <option key={z} value={z}>{z}</option>
                ))}
              </select>
            </div>
          );
        })}

        {/* Labels */}
        {PILLAR_KEYS.map((key) => (
          <div key={`label-${key}`} className="text-center text-xs text-muted-foreground font-body">
            {key === 'day' && <span className="gold-text font-bold">★ 日主</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BaZiGrid;
