import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import BaZiGrid from '@/components/BaZiGrid';
import DayMasterStrengthSelector from '@/components/DayMasterStrengthSelector';
import DaYunTimeline from '@/components/DaYunTimeline';
import LiuNianInput from '@/components/LiuNianInput';
import FiveElementsChart from '@/components/FiveElementsChart';
import TenGodsDisplay from '@/components/TenGodsDisplay';
import {
  FourPillars, DaYun, LiuNian, DayMasterStrength,
  isComplete, calculateWuXingDistribution, calculateShiShenDistribution,
  BaZiRecord
} from '@/lib/bazi';
import { generateReport } from '@/lib/baziReport';
import { saveRecord } from '@/lib/baziStorage';
import { ArrowLeft } from 'lucide-react';

const emptyPillars: FourPillars = {
  year: { tianGan: '', diZhi: '' },
  month: { tianGan: '', diZhi: '' },
  day: { tianGan: '', diZhi: '' },
  hour: { tianGan: '', diZhi: '' },
};

const BaZiInputPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = (searchParams.get('mode') || 'analysis') as 'analysis' | 'review';

  const [pillars, setPillars] = useState<FourPillars>(emptyPillars);
  const [strength, setStrength] = useState<DayMasterStrength>(null);
  const [daYunList, setDaYunList] = useState<DaYun[]>([]);
  const [liuNian, setLiuNian] = useState<LiuNian | null>(null);

  const complete = isComplete(pillars);
  const wuxingDist = complete ? calculateWuXingDistribution(pillars) : null;
  const shiShenDist = complete ? calculateShiShenDistribution(pillars) : null;

  const handleAnalyze = () => {
    if (!complete) return;

    const report = generateReport({
      fourPillars: pillars,
      dayMasterStrength: strength,
      daYunList,
      liuNian,
    });

    const record: BaZiRecord = {
      id: Date.now().toString(),
      fourPillars: pillars,
      dayMasterStrength: strength,
      daYunList,
      liuNian,
      report,
      date: new Date().toISOString(),
      mode,
    };

    saveRecord(record);
    navigate(`/analysis/${record.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="p-4 flex items-center gap-4 brutal-border border-t-0 border-x-0">
        <button onClick={() => navigate('/')} className="gold-text hover:opacity-70 transition-opacity">
          <ArrowLeft size={24} />
        </button>
        <h1 className="font-display text-2xl md:text-3xl gold-text">
          {mode === 'analysis' ? '🏯 八字命盤解析' : '📖 八字復盤學習'}
        </h1>
      </header>

      <main className="max-w-4xl mx-auto p-4 space-y-6 pb-20">
        {mode === 'review' && (
          <motion.div
            className="card-brutal text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="font-body text-sm text-muted-foreground">
              復盤學習模式：您可以自由輸入或調整命盤資訊，測試不同組合，觀察命理變化。
            </p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <BaZiGrid pillars={pillars} onChange={setPillars} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <DayMasterStrengthSelector value={strength} onChange={setStrength} />
        </motion.div>

        {/* Live analysis preview */}
        {complete && wuxingDist && shiShenDist && (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <FiveElementsChart distribution={wuxingDist} />
            <TenGodsDisplay distribution={shiShenDist} />
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <DaYunTimeline daYunList={daYunList} onChange={setDaYunList} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <LiuNianInput liuNian={liuNian} onChange={setLiuNian} />
        </motion.div>

        {/* Analyze button */}
        <motion.div
          className="pt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <button
            onClick={handleAnalyze}
            disabled={!complete || !strength}
            className={`btn-brutal w-full text-2xl !py-5 ${
              !complete || !strength ? 'opacity-40 cursor-not-allowed' : ''
            }`}
          >
            ⚡ 生成命盤解析報告
          </button>
          {(!complete || !strength) && (
            <p className="text-center text-xs text-muted-foreground font-body mt-2">
              {!complete ? '請完整填寫四柱八字' : '請選擇日主強弱'}
            </p>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default BaZiInputPage;
