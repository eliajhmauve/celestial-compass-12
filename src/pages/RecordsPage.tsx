import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getRecords, deleteRecord } from '@/lib/baziStorage';
import type { BaZiRecord } from '@/lib/bazi';
import { ArrowLeft, Trash2, Eye } from 'lucide-react';

const RecordsPage = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState<BaZiRecord[]>([]);

  useEffect(() => {
    setRecords(getRecords());
  }, []);

  const handleDelete = (id: string) => {
    deleteRecord(id);
    setRecords(getRecords());
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="p-4 flex items-center gap-4 brutal-border border-t-0 border-x-0">
        <button onClick={() => navigate('/')} className="gold-text hover:opacity-70 transition-opacity">
          <ArrowLeft size={24} />
        </button>
        <h1 className="font-display text-2xl md:text-3xl gold-text">📚 復盤紀錄庫</h1>
      </header>

      <main className="max-w-3xl mx-auto p-4 pb-20">
        {records.length === 0 ? (
          <motion.div
            className="card-brutal text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="font-display text-2xl gold-text mb-2">尚無命盤紀錄</p>
            <p className="text-muted-foreground font-body text-sm">開始解析命盤，累積您的命理觀測紀錄</p>
            <button onClick={() => navigate('/')} className="btn-brutal mt-6">
              開始觀測
            </button>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {records.map((record, i) => {
              const p = record.fourPillars;
              const bazi = `${p.year.tianGan}${p.year.diZhi} ${p.month.tianGan}${p.month.diZhi} ${p.day.tianGan}${p.day.diZhi} ${p.hour.tianGan}${p.hour.diZhi}`;
              return (
                <motion.div
                  key={record.id}
                  className="card-brutal flex items-center gap-4 group"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-display text-lg gold-text truncate">{bazi}</div>
                    <div className="flex gap-2 text-xs text-muted-foreground font-body mt-1">
                      <span>{new Date(record.date).toLocaleDateString('zh-TW')}</span>
                      <span>·</span>
                      <span>{record.dayMasterStrength === 'strong' ? '身強' : record.dayMasterStrength === 'weak' ? '身弱' : '未定'}</span>
                      <span>·</span>
                      <span>{record.mode === 'analysis' ? '解析' : '復盤'}</span>
                      {record.daYunList.length > 0 && (
                        <>
                          <span>·</span>
                          <span>{record.daYunList.length}步大運</span>
                        </>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/analysis/${record.id}`)}
                    className="brutal-border p-2 bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(record.id)}
                    className="brutal-border p-2 bg-secondary hover:bg-destructive hover:text-accent-foreground transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default RecordsPage;
