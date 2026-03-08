import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const CHARS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸',
  '子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

const ELEMENTS = ['金', '木', '水', '火', '土'];

interface Props {
  onComplete: () => void;
}

const OpeningAnimation = ({ onComplete }: Props) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onComplete, 500);
    }, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
          style={{ background: 'hsl(240, 40%, 4%)' }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Floating characters */}
          {CHARS.map((char, i) => (
            <motion.span
              key={char}
              className="absolute font-display gold-text"
              style={{
                fontSize: `${16 + Math.random() * 24}px`,
                left: `${(i / CHARS.length) * 100}%`,
                top: `${20 + Math.random() * 60}%`,
              }}
              initial={{ opacity: 0, y: 50, rotate: -15 }}
              animate={{
                opacity: [0, 0.6, 0.3],
                y: [50, -20, -40],
                rotate: [-15, 5, -5],
              }}
              transition={{
                duration: 2.5,
                delay: i * 0.05,
                ease: 'easeOut',
              }}
            >
              {char}
            </motion.span>
          ))}

          {/* Five elements ring */}
          {ELEMENTS.map((el, i) => {
            const angle = (i / ELEMENTS.length) * Math.PI * 2 - Math.PI / 2;
            const r = 90;
            return (
              <motion.div
                key={el}
                className={`absolute w-12 h-12 flex items-center justify-center font-display text-xl brutal-border ${
                  el === '金' ? 'element-metal' : el === '木' ? 'element-wood' : el === '水' ? 'element-water' : el === '火' ? 'element-fire' : 'element-earth'
                }`}
                style={{ borderRadius: '50%' }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  x: Math.cos(angle) * r,
                  y: Math.sin(angle) * r,
                }}
                transition={{ delay: 0.5 + i * 0.15, duration: 0.6, ease: 'backOut' }}
              >
                {el}
              </motion.div>
            );
          })}

          {/* Center title */}
          <motion.div
            className="text-center z-10"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.8, ease: 'easeOut' }}
          >
            <h1 className="font-display text-5xl md:text-7xl gold-text glow-gold">
              八字觀測台
            </h1>
            <motion.p
              className="font-body text-sm mt-3 text-muted-foreground tracking-widest"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              天地之氣・命運格局
            </motion.p>
          </motion.div>

          {/* Bottom author */}
          <motion.p
            className="absolute bottom-8 font-display text-lg gold-text tracking-[0.3em]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 1.8 }}
          >
            福青施老師
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OpeningAnimation;
