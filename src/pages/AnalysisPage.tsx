import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getRecord } from '@/lib/baziStorage';
import { ArrowLeft, Home } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const AnalysisPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const record = id ? getRecord(id) : undefined;

  if (!record) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="font-display text-2xl gold-text">找不到此命盤紀錄</p>
          <button onClick={() => navigate('/')} className="btn-brutal mt-4">返回首頁</button>
        </div>
      </div>
    );
  }

  const p = record.fourPillars;

  return (
    <div className="min-h-screen bg-background">
      <header className="p-4 flex items-center gap-4 brutal-border border-t-0 border-x-0">
        <button onClick={() => navigate(-1)} className="gold-text hover:opacity-70 transition-opacity">
          <ArrowLeft size={24} />
        </button>
        <h1 className="font-display text-2xl gold-text flex-1">命盤解析報告</h1>
        <button onClick={() => navigate('/')} className="gold-text hover:opacity-70 transition-opacity">
          <Home size={22} />
        </button>
      </header>

      <main className="max-w-3xl mx-auto p-4 pb-20">
        {/* Mini pillars display */}
        <motion.div
          className="card-brutal mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="grid grid-cols-4 gap-2 text-center font-display">
            {(['year', 'month', 'day', 'hour'] as const).map((key) => (
              <div key={key}>
                <div className="text-xs text-muted-foreground font-body mb-1">
                  {key === 'year' ? '年' : key === 'month' ? '月' : key === 'day' ? '日' : '時'}
                </div>
                <div className="text-xl gold-text">{p[key].tianGan}</div>
                <div className="text-xl text-foreground">{p[key].diZhi}</div>
              </div>
            ))}
          </div>
          <div className="text-center text-xs text-muted-foreground font-body mt-2">
            {new Date(record.date).toLocaleDateString('zh-TW')} · {record.mode === 'analysis' ? '命盤解析' : '復盤學習'}
          </div>
        </motion.div>

        {/* Report */}
        <motion.article
          className="card-brutal prose-invert"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="markdown-report font-body text-sm md:text-base leading-relaxed">
            <ReactMarkdown
              components={{
                h1: ({ children }) => <h1 className="font-display text-3xl gold-text glow-gold mb-4 mt-6">{children}</h1>,
                h2: ({ children }) => <h2 className="font-display text-2xl gold-text mb-3 mt-8 brutal-border border-x-0 border-t-0 pb-2">{children}</h2>,
                h3: ({ children }) => <h3 className="font-display text-xl text-foreground mb-2 mt-4">{children}</h3>,
                p: ({ children }) => <p className="text-foreground mb-3 leading-relaxed">{children}</p>,
                strong: ({ children }) => <strong className="gold-text">{children}</strong>,
                blockquote: ({ children }) => (
                  <blockquote className="brutal-border border-x-0 border-b-0 pl-4 my-4 text-muted-foreground italic">
                    {children}
                  </blockquote>
                ),
                table: ({ children }) => (
                  <div className="overflow-x-auto my-4">
                    <table className="w-full brutal-border text-center">{children}</table>
                  </div>
                ),
                th: ({ children }) => <th className="brutal-border p-2 bg-secondary font-display gold-text">{children}</th>,
                td: ({ children }) => <td className="brutal-border p-2 font-display">{children}</td>,
                ul: ({ children }) => <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>,
                li: ({ children }) => <li className="text-foreground">{children}</li>,
                hr: () => <hr className="border-border my-6" />,
              }}
            >
              {record.report}
            </ReactMarkdown>
          </div>
        </motion.article>
      </main>
    </div>
  );
};

export default AnalysisPage;
