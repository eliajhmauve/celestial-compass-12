import { TIAN_GAN, DI_ZHI, LiuNian, TIAN_GAN_WUXING, WUXING_COLORS } from '@/lib/bazi';

interface Props {
  liuNian: LiuNian | null;
  onChange: (ln: LiuNian | null) => void;
}

const LiuNianInput = ({ liuNian, onChange }: Props) => {
  const handleToggle = () => {
    if (liuNian) {
      onChange(null);
    } else {
      onChange({ year: new Date().getFullYear(), tianGan: '丙', diZhi: '午' });
    }
  };

  return (
    <div className="card-brutal">
      <div className="flex items-center justify-between mb-4">
        <h3 className="section-title">流年</h3>
        <button onClick={handleToggle} className="btn-brutal-outline text-sm !text-base !px-3 !py-1">
          {liuNian ? '取消' : '設定流年'}
        </button>
      </div>

      {liuNian && (
        <div className="flex flex-wrap items-center gap-3 justify-center">
          <input
            type="number"
            value={liuNian.year}
            onChange={(e) => onChange({ ...liuNian, year: parseInt(e.target.value) || 2026 })}
            className="bg-secondary text-foreground font-display text-xl p-2 w-24 text-center brutal-border"
            placeholder="年份"
          />
          <span className="font-display text-lg gold-text">年</span>
          <select
            value={liuNian.tianGan}
            onChange={(e) => onChange({ ...liuNian, tianGan: e.target.value as any })}
            className="bg-secondary text-foreground font-display text-xl p-2 w-16 text-center brutal-border cursor-pointer"
            style={{ color: WUXING_COLORS[TIAN_GAN_WUXING[liuNian.tianGan]] }}
          >
            {TIAN_GAN.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
          <select
            value={liuNian.diZhi}
            onChange={(e) => onChange({ ...liuNian, diZhi: e.target.value as any })}
            className="bg-secondary text-foreground font-display text-xl p-2 w-16 text-center brutal-border cursor-pointer"
          >
            {DI_ZHI.map((z) => <option key={z} value={z}>{z}</option>)}
          </select>
          <span className="font-display text-lg gold-text">年</span>
        </div>
      )}
    </div>
  );
};

export default LiuNianInput;
