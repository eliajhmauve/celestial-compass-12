import { TIAN_GAN, DI_ZHI, TianGan, DiZhi, DaYun, TIAN_GAN_WUXING, WUXING_COLORS } from '@/lib/bazi';
import { Plus, X } from 'lucide-react';

interface Props {
  daYunList: DaYun[];
  onChange: (list: DaYun[]) => void;
}

const DaYunTimeline = ({ daYunList, onChange }: Props) => {
  const addDaYun = () => {
    const lastAge = daYunList.length > 0 ? daYunList[daYunList.length - 1].startAge + 10 : 1;
    onChange([...daYunList, { tianGan: '甲', diZhi: '子', startAge: lastAge }]);
  };

  const removeDaYun = (index: number) => {
    onChange(daYunList.filter((_, i) => i !== index));
  };

  const updateDaYun = (index: number, field: keyof DaYun, value: string | number) => {
    const updated = [...daYunList];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  return (
    <div className="card-brutal">
      <h3 className="section-title text-center mb-4">十年大運</h3>

      {daYunList.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4 justify-center">
          {daYunList.map((dy, i) => {
            const el = TIAN_GAN_WUXING[dy.tianGan];
            return (
              <div key={i} className="brutal-border p-3 relative group" style={{ minWidth: '100px' }}>
                <button
                  onClick={() => removeDaYun(i)}
                  className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center bg-accent text-accent-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={12} />
                </button>

                <div className="text-xs text-muted-foreground font-body text-center mb-1">
                  {dy.startAge}歲起
                </div>

                <div className="flex gap-1">
                  <select
                    value={dy.tianGan}
                    onChange={(e) => updateDaYun(i, 'tianGan', e.target.value)}
                    className="bg-secondary text-foreground font-display text-lg p-1 w-12 text-center cursor-pointer"
                    style={{ color: WUXING_COLORS[el] }}
                  >
                    {TIAN_GAN.map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                  <select
                    value={dy.diZhi}
                    onChange={(e) => updateDaYun(i, 'diZhi', e.target.value)}
                    className="bg-secondary text-foreground font-display text-lg p-1 w-12 text-center cursor-pointer"
                  >
                    {DI_ZHI.map((z) => <option key={z} value={z}>{z}</option>)}
                  </select>
                </div>

                <input
                  type="number"
                  value={dy.startAge}
                  onChange={(e) => updateDaYun(i, 'startAge', parseInt(e.target.value) || 0)}
                  className="w-full mt-1 bg-muted text-foreground text-xs p-1 text-center font-body"
                  placeholder="起始年齡"
                />
              </div>
            );
          })}
        </div>
      )}

      <button onClick={addDaYun} className="btn-brutal-outline w-full flex items-center justify-center gap-2">
        <Plus size={18} /> 添加大運
      </button>
    </div>
  );
};

export default DaYunTimeline;
