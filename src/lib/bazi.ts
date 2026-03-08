// 八字命理核心計算庫

export const TIAN_GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'] as const;
export const DI_ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'] as const;

export type TianGan = typeof TIAN_GAN[number];
export type DiZhi = typeof DI_ZHI[number];
export type WuXing = '金' | '木' | '水' | '火' | '土';
export type ShiShen = '比肩' | '劫財' | '食神' | '傷官' | '偏印' | '正印' | '偏財' | '正財' | '七殺' | '正官';
export type DayMasterStrength = 'strong' | 'weak' | null;

export interface Pillar {
  tianGan: TianGan | '';
  diZhi: DiZhi | '';
}

export interface FourPillars {
  year: Pillar;
  month: Pillar;
  day: Pillar;
  hour: Pillar;
}

export interface DaYun {
  tianGan: TianGan;
  diZhi: DiZhi;
  startAge: number;
}

export interface LiuNian {
  year: number;
  tianGan: TianGan;
  diZhi: DiZhi;
}

export interface BaZiRecord {
  id: string;
  fourPillars: FourPillars;
  dayMasterStrength: DayMasterStrength;
  daYunList: DaYun[];
  liuNian: LiuNian | null;
  report: string;
  date: string;
  mode: 'analysis' | 'review';
}

// 天干五行
export const TIAN_GAN_WUXING: Record<TianGan, WuXing> = {
  '甲': '木', '乙': '木', '丙': '火', '丁': '火', '戊': '土',
  '己': '土', '庚': '金', '辛': '金', '壬': '水', '癸': '水'
};

// 地支五行
export const DI_ZHI_WUXING: Record<DiZhi, WuXing> = {
  '子': '水', '丑': '土', '寅': '木', '卯': '木', '辰': '土',
  '巳': '火', '午': '火', '未': '土', '申': '金', '酉': '金', '戌': '土', '亥': '水'
};

// 天干陰陽 (0=陽, 1=陰)
export const TIAN_GAN_YINYANG: Record<TianGan, number> = {
  '甲': 0, '乙': 1, '丙': 0, '丁': 1, '戊': 0,
  '己': 1, '庚': 0, '辛': 1, '壬': 0, '癸': 1
};

// 五行生剋
const PRODUCE: Record<WuXing, WuXing> = { '木': '火', '火': '土', '土': '金', '金': '水', '水': '木' };
const OVERCOME: Record<WuXing, WuXing> = { '木': '土', '土': '水', '水': '火', '火': '金', '金': '木' };

// 地支藏干
export const DI_ZHI_CANG_GAN: Record<DiZhi, TianGan[]> = {
  '子': ['癸'],
  '丑': ['己', '癸', '辛'],
  '寅': ['甲', '丙', '戊'],
  '卯': ['乙'],
  '辰': ['戊', '乙', '癸'],
  '巳': ['丙', '庚', '戊'],
  '午': ['丁', '己'],
  '未': ['己', '丁', '乙'],
  '申': ['庚', '壬', '戊'],
  '酉': ['辛'],
  '戌': ['戊', '辛', '丁'],
  '亥': ['壬', '甲'],
};

// 計算十神
export function getShiShen(dayMaster: TianGan, target: TianGan): ShiShen {
  const dmElement = TIAN_GAN_WUXING[dayMaster];
  const tgElement = TIAN_GAN_WUXING[target];
  const sameParity = TIAN_GAN_YINYANG[dayMaster] === TIAN_GAN_YINYANG[target];

  if (dmElement === tgElement) {
    return sameParity ? '比肩' : '劫財';
  }
  if (PRODUCE[dmElement] === tgElement) {
    return sameParity ? '食神' : '傷官';
  }
  if (PRODUCE[tgElement] === dmElement) {
    return sameParity ? '偏印' : '正印';
  }
  if (OVERCOME[dmElement] === tgElement) {
    return sameParity ? '偏財' : '正財';
  }
  // tgElement overcomes dmElement
  return sameParity ? '七殺' : '正官';
}

// 計算五行能量分佈
export function calculateWuXingDistribution(pillars: FourPillars): Record<WuXing, number> {
  const dist: Record<WuXing, number> = { '金': 0, '木': 0, '水': 0, '火': 0, '土': 0 };

  const allPillars = [pillars.year, pillars.month, pillars.day, pillars.hour];
  for (const p of allPillars) {
    if (p.tianGan) dist[TIAN_GAN_WUXING[p.tianGan as TianGan]] += 1;
    if (p.diZhi) {
      dist[DI_ZHI_WUXING[p.diZhi as DiZhi]] += 0.5;
      const hidden = DI_ZHI_CANG_GAN[p.diZhi as DiZhi];
      if (hidden) {
        hidden.forEach((g, i) => {
          dist[TIAN_GAN_WUXING[g]] += i === 0 ? 0.5 : 0.25;
        });
      }
    }
  }
  return dist;
}

// 計算十神分佈
export function calculateShiShenDistribution(pillars: FourPillars): Record<ShiShen, number> {
  const dayMaster = pillars.day.tianGan as TianGan;
  if (!dayMaster) return {} as Record<ShiShen, number>;

  const dist: Record<string, number> = {
    '比肩': 0, '劫財': 0, '食神': 0, '傷官': 0,
    '偏印': 0, '正印': 0, '偏財': 0, '正財': 0, '七殺': 0, '正官': 0
  };

  const stems: TianGan[] = [];
  const allPillars = [pillars.year, pillars.month, pillars.hour]; // exclude day master itself
  for (const p of allPillars) {
    if (p.tianGan) stems.push(p.tianGan as TianGan);
    if (p.diZhi) {
      const hidden = DI_ZHI_CANG_GAN[p.diZhi as DiZhi];
      if (hidden) stems.push(...hidden);
    }
  }
  // Also include day branch hidden stems
  if (pillars.day.diZhi) {
    const hidden = DI_ZHI_CANG_GAN[pillars.day.diZhi as DiZhi];
    if (hidden) stems.push(...hidden);
  }

  for (const s of stems) {
    const ss = getShiShen(dayMaster, s);
    dist[ss] += 1;
  }

  return dist as Record<ShiShen, number>;
}

// 五行顏色映射
export const WUXING_COLORS: Record<WuXing, string> = {
  '金': 'hsl(0, 0%, 78%)',
  '木': 'hsl(140, 55%, 42%)',
  '水': 'hsl(210, 65%, 48%)',
  '火': 'hsl(0, 72%, 52%)',
  '土': 'hsl(35, 80%, 52%)',
};

export const WUXING_CLASS: Record<WuXing, string> = {
  '金': 'element-metal',
  '木': 'element-wood',
  '水': 'element-water',
  '火': 'element-fire',
  '土': 'element-earth',
};

// 五行生剋關係文字
export function getWuXingRelation(a: WuXing, b: WuXing): string {
  if (PRODUCE[a] === b) return `${a}生${b}`;
  if (PRODUCE[b] === a) return `${b}生${a}`;
  if (OVERCOME[a] === b) return `${a}剋${b}`;
  if (OVERCOME[b] === a) return `${b}剋${a}`;
  if (a === b) return `${a}同氣`;
  return '';
}

// 判斷用神
export function getYongShen(dayMaster: TianGan, strength: DayMasterStrength): WuXing[] {
  const dmElement = TIAN_GAN_WUXING[dayMaster];
  if (strength === 'weak') {
    // 身弱需要生扶：印星(生我的)、比劫(同我的)
    const produces_me = Object.entries(PRODUCE).find(([, v]) => v === dmElement)?.[0] as WuXing;
    return [produces_me, dmElement].filter(Boolean);
  } else if (strength === 'strong') {
    // 身強需要洩耗：食傷(我生的)、財星(我剋的)、官殺(剋我的)
    const i_produce = PRODUCE[dmElement];
    const i_overcome = OVERCOME[dmElement];
    const overcomes_me = Object.entries(OVERCOME).find(([, v]) => v === dmElement)?.[0] as WuXing;
    return [i_produce, i_overcome, overcomes_me].filter(Boolean);
  }
  return [];
}

// 十神含義
export const SHI_SHEN_MEANING: Record<ShiShen, string> = {
  '比肩': '自我意識、獨立、競爭、同輩',
  '劫財': '衝動、爭奪、社交能力、冒險',
  '食神': '才華、表達、享受、溫和',
  '傷官': '叛逆、創意、敏銳、追求完美',
  '偏印': '偏門學問、靈感、孤獨、另類思維',
  '正印': '學問、教養、慈悲、庇護',
  '偏財': '投機、交際、靈活理財、機遇',
  '正財': '穩定收入、節儉、務實、責任',
  '七殺': '權威、壓力、魄力、變革',
  '正官': '紀律、名聲、正統、管理',
};

export function isComplete(pillars: FourPillars): boolean {
  return [pillars.year, pillars.month, pillars.day, pillars.hour].every(
    p => p.tianGan !== '' && p.diZhi !== ''
  );
}
