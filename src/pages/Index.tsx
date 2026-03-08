import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen mystic-gradient flex flex-col">
      {/* Header */}
      <header className="p-4 flex justify-between items-center">
        <span className="font-display text-lg gold-text tracking-widest">福星何大師</span>
        <button
          onClick={() => navigate('/records')}
          className="btn-brutal-outline !text-sm !px-3 !py-1"
        >
          復盤紀錄庫
        </button>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-20">
        <motion.div
          className="text-center max-w-2xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl gold-text glow-gold leading-tight">
            八字命盤觀測台
          </h1>

          <p className="font-body text-base md:text-lg text-muted-foreground mt-6 leading-relaxed max-w-lg mx-auto">
            天地之氣的流轉，命盤中的五行格局。<br />
            洞察歲運的能量變化，解讀人生節奏的天時密碼。
          </p>

          {/* Five Elements decorative */}
          <div className="flex justify-center gap-4 my-8">
            {['金', '木', '水', '火', '土'].map((el, i) => (
              <motion.div
                key={el}
                className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center font-display text-lg brutal-border ${
                  el === '金' ? 'element-metal' : el === '木' ? 'element-wood' : el === '水' ? 'element-water' : el === '火' ? 'element-fire' : 'element-earth'
                }`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.1, type: 'spring' }}
              >
                {el}
              </motion.div>
            ))}
          </div>

          {/* Entry buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
            <motion.button
              onClick={() => navigate('/input?mode=analysis')}
              className="btn-brutal text-xl md:text-2xl !px-8 !py-4"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              🏯 八字命盤解析
            </motion.button>
            <motion.button
              onClick={() => navigate('/input?mode=review')}
              className="btn-brutal-outline text-xl md:text-2xl !px-8 !py-4"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              📖 八字復盤學習
            </motion.button>
          </div>

          <p className="text-xs text-muted-foreground font-body mt-8 tracking-wide">
            命運格局的洞察 · 人生節奏的天時密碼
          </p>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center">
        <p className="text-xs text-muted-foreground font-body">
          © 福星何大師 · 八字命盤觀測台
        </p>
      </footer>
    </div>
  );
};

export default HomePage;
