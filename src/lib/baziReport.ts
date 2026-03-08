import {
  FourPillars, DaYun, LiuNian, DayMasterStrength,
  TIAN_GAN_WUXING, DI_ZHI_WUXING, TianGan, DiZhi, WuXing,
  calculateWuXingDistribution, calculateShiShenDistribution,
  getYongShen, SHI_SHEN_MEANING, ShiShen, getShiShen,
  DI_ZHI_CANG_GAN, TIAN_GAN_YINYANG
} from './bazi';

interface ReportInput {
  fourPillars: FourPillars;
  dayMasterStrength: DayMasterStrength;
  daYunList: DaYun[];
  liuNian: LiuNian | null;
}

const WUXING_TRAITS: Record<WuXing, string> = {
  '木': '如春木萌發，心性仁厚，志向高遠，喜向上伸展，具有開創之氣。木之人重情義、講道理，但過盛則固執，不足則猶豫。',
  '火': '如夏火炎上，性情熱烈，光明磊落，具有感染力。火之人重禮節、善表達，但過盛則急躁，不足則消極。',
  '土': '如大地承載，穩重踏實，包容寬厚，具有信用之德。土之人重承諾、善協調，但過盛則頑固，不足則缺乏主見。',
  '金': '如秋金肅殺，果斷堅毅，重義輕利，具有收斂之力。金之人重原則、善決斷，但過盛則冷酷，不足則優柔寡斷。',
  '水': '如冬水潤下，聰慧靈活，善於應變，具有智慧之光。水之人重智謀、善溝通，但過盛則狡詐，不足則膽怯。',
};

const FABLES: string[] = [
  '古有一農夫，春耕夏耘，秋收冬藏，循天時而動，終成富庶之家。此如命盤所示，順應五行節奏，方能成就大業。',
  '傳說中有一位匠人，以金鍛木，以火煉金，以水滅火，以土蓄水，以木破土。五行循環不息，他悟出了天地至理：萬物相生相剋，唯有平衡方為至道。',
  '昔日有一智者登高山而望遠，見河流東去，日月西沉，悟天地運行之道。他對弟子說：「人生如四季，不可逆天而行，唯順勢而為，方得自在。」',
  '有一棵古松，根扎深谷，枝伸蒼穹。暴風雨來時它彎腰順勢，烈日灼人時它撐開綠蔭。歷經百年，它已成林中之王。此乃知柔知剛、進退得宜之智。',
  '古時一位將軍常勝不敗，人問其道，他答：「吾觀天象而行軍，察地利而佈陣，知人心而用兵。天地人三才合一，是以無往不利。」',
];

export function generateReport(input: ReportInput): string {
  const { fourPillars, dayMasterStrength, daYunList, liuNian } = input;

  const dm = fourPillars.day.tianGan as TianGan;
  const dmElement = TIAN_GAN_WUXING[dm];
  const dmYY = TIAN_GAN_YINYANG[dm] === 0 ? '陽' : '陰';
  const wuxingDist = calculateWuXingDistribution(fourPillars);
  const shiShenDist = calculateShiShenDistribution(fourPillars);
  const yongShen = getYongShen(dm, dayMasterStrength);

  // Find strongest and weakest elements
  const sortedWX = Object.entries(wuxingDist).sort((a, b) => b[1] - a[1]);
  const strongest = sortedWX[0];
  const weakest = sortedWX[sortedWX.length - 1];

  // Get prominent shi shen
  const sortedSS = Object.entries(shiShenDist).sort((a, b) => b[1] - a[1]).filter(([, v]) => v > 0);

  const strengthText = dayMasterStrength === 'strong' ? '身強' : dayMasterStrength === 'weak' ? '身弱' : '未定';
  const strengthDesc = dayMasterStrength === 'strong'
    ? '日主得令得勢，氣勢充沛，命主自我意識強烈，行事果斷有力。身強之人需要食傷洩秀、財星耗身或官殺制衡，方能將過盛之氣轉化為成就。'
    : dayMasterStrength === 'weak'
      ? '日主失令失勢，氣息偏弱，命主需借助外力以成事。身弱之人需要印星生扶、比劫助力，方能穩固根基，逐步發展。'
      : '日主強弱尚待進一步分析。';

  const yearGZ = `${fourPillars.year.tianGan}${fourPillars.year.diZhi}`;
  const monthGZ = `${fourPillars.month.tianGan}${fourPillars.month.diZhi}`;
  const dayGZ = `${fourPillars.day.tianGan}${fourPillars.day.diZhi}`;
  const hourGZ = `${fourPillars.hour.tianGan}${fourPillars.hour.diZhi}`;

  // Shi shen for each pillar's tian gan
  const yearSS = fourPillars.year.tianGan ? getShiShen(dm, fourPillars.year.tianGan as TianGan) : '';
  const monthSS = fourPillars.month.tianGan ? getShiShen(dm, fourPillars.month.tianGan as TianGan) : '';
  const hourSS = fourPillars.hour.tianGan ? getShiShen(dm, fourPillars.hour.tianGan as TianGan) : '';

  const fable = FABLES[Math.floor(Math.random() * FABLES.length)];

  let daYunSection = '';
  if (daYunList.length > 0) {
    daYunSection = `

## 🔄 大運發展趨勢

大運如人生的大氣候，每十年一變，深刻影響命主的運勢走向。

${daYunList.map((dy, i) => {
  const dyElement = TIAN_GAN_WUXING[dy.tianGan];
  const dyDiZhiElement = DI_ZHI_WUXING[dy.diZhi];
  const dySS = getShiShen(dm, dy.tianGan);
  const isYong = yongShen.includes(dyElement);
  return `### 第${i + 1}步大運：${dy.tianGan}${dy.diZhi}（約${dy.startAge}歲起）

- **天干**：${dy.tianGan}（${dyElement}），十神為**${dySS}**
- **地支**：${dy.diZhi}（${dyDiZhiElement}）
- **藏干**：${DI_ZHI_CANG_GAN[dy.diZhi].join('、')}
- **與用神關係**：${isYong ? '✅ 此運與用神相合，為有利之運' : '⚠️ 此運與用神不合，需審慎應對'}
- **運勢提示**：${dySS}運臨身，${SHI_SHEN_MEANING[dySS]}。此階段的人生主題與${dySS}所代表的能量密切相關。`;
}).join('\n\n')}`;
  }

  let liuNianSection = '';
  if (liuNian) {
    const lnElement = TIAN_GAN_WUXING[liuNian.tianGan];
    const lnDiZhiElement = DI_ZHI_WUXING[liuNian.diZhi];
    const lnSS = getShiShen(dm, liuNian.tianGan);
    const isYong = yongShen.includes(lnElement);
    liuNianSection = `

## 📅 流年能量變化（${liuNian.year}年 ${liuNian.tianGan}${liuNian.diZhi}年）

流年如人生的小氣候，反映當年的能量主題與事件傾向。

- **天干**：${liuNian.tianGan}（${lnElement}），十神為**${lnSS}**
- **地支**：${liuNian.diZhi}（${lnDiZhiElement}）
- **與用神關係**：${isYong ? '✅ 流年能量與用神相合，整體運勢順遂' : '⚠️ 流年能量與用神相悖，宜謹慎行事'}
- **年度主題**：${lnSS}能量主導，${SHI_SHEN_MEANING[lnSS]}。

此年宜${isYong ? '積極把握機會，順勢而為' : '穩紮穩打，避免冒進'}。關注${lnElement}所對應的生活領域，調整心態與行動策略。`;
  }

  return `# 🏯 八字命盤解析報告

> *天地之氣交感，陰陽之道運行。四柱八字，承載一生之命運密碼。*

---

## 📋 命盤總覽

| 柱位 | 年柱 | 月柱 | 日柱 | 時柱 |
|:---:|:---:|:---:|:---:|:---:|
| **天干** | ${fourPillars.year.tianGan} | ${fourPillars.month.tianGan} | ${fourPillars.day.tianGan} | ${fourPillars.hour.tianGan} |
| **地支** | ${fourPillars.year.diZhi} | ${fourPillars.month.diZhi} | ${fourPillars.day.diZhi} | ${fourPillars.hour.diZhi} |
| **十神** | ${yearSS} | ${monthSS} | 日主 | ${hourSS} |

- **完整八字**：${yearGZ} ${monthGZ} ${dayGZ} ${hourGZ}
- **日主**：${dm}（${dmYY}${dmElement}）
- **日主強弱**：${strengthText}

---

## ⚖️ 八字整體格局分析

此命盤以**${dm}**為日主，五行屬**${dmElement}**，為**${dmYY}${dmElement}**之氣。

${strengthDesc}

年柱${yearGZ}代表祖輩與早年環境，透出**${yearSS}**之氣，顯示命主早年的成長背景與家族影響。月柱${monthGZ}為命盤之提綱，透出**${monthSS}**之氣，是判斷格局的重要依據，也反映了命主的社會環境與事業方向。時柱${hourGZ}透出**${hourSS}**之氣，代表晚年運勢與子女緣分。

四柱之間的五行流通與十神互動，構成了此命盤獨特的能量結構。整體而言，此命盤${strongest[1] > 3 ? `${strongest[0]}氣偏重` : '五行分佈尚稱均衡'}，${weakest[1] < 1 ? `${weakest[0]}氣明顯不足` : '各行皆有所及'}。

---

## 🔥 五行能量結構

命盤五行分佈如下：

| 五行 | 金 | 木 | 水 | 火 | 土 |
|:---:|:---:|:---:|:---:|:---:|:---:|
| **能量值** | ${wuxingDist['金'].toFixed(1)} | ${wuxingDist['木'].toFixed(1)} | ${wuxingDist['水'].toFixed(1)} | ${wuxingDist['火'].toFixed(1)} | ${wuxingDist['土'].toFixed(1)} |

### 五行分析

- **最旺之行**：${strongest[0]}（${strongest[1].toFixed(1)}），${strongest[0]}氣充沛，影響命主的性格與行運方向。
- **最弱之行**：${weakest[0]}（${weakest[1].toFixed(1)}），${weakest[0]}氣不足，此領域需特別留意與補強。

${WUXING_TRAITS[dmElement]}

五行之間的生剋制化，構成了命盤的動態平衡。${dmElement}為日主所屬，其與其他四行的關係，決定了命主在不同領域的表現：

- **生我者**（印星）：為命主之根基與依靠
- **我生者**（食傷）：為命主之才華與表達
- **剋我者**（官殺）：為命主之壓力與規範
- **我剋者**（財星）：為命主之財富與慾望
- **同我者**（比劫）：為命主之助力與競爭

---

## 🎭 十神關係解讀

十神是八字命理的核心框架，揭示命主與環境的互動模式。

${sortedSS.length > 0 ? sortedSS.map(([ss, count]) => {
  return `### ${ss}（出現 ${count} 次）

${SHI_SHEN_MEANING[ss as ShiShen]}

${ss}在命盤中${count >= 3 ? '勢力強大，對命主影響深遠' : count >= 2 ? '有一定力量，影響不容忽視' : '力量尚可，點綴命盤格局'}。`;
}).join('\n\n') : '（十神分佈待分析）'}

---

## 🧭 日主特性說明

日主**${dm}**，${dmYY}${dmElement}之氣。

${WUXING_TRAITS[dmElement]}

${dm}日生人，${TIAN_GAN_YINYANG[dm] === 0
    ? '具有陽剛之氣，主動積極，善於開創。為人大方直爽，不拘小節，但有時過於強勢，需學會柔和。'
    : '具有陰柔之質，溫婉細膩，善於守成。為人含蓄內斂，心思縝密，但有時過於保守，需學會放開。'
  }

配合${strengthText}的命格，${dayMasterStrength === 'strong'
    ? '命主天生具有較強的自我意識與行動力，適合從事需要魄力與決斷的工作。但需注意不可過於剛愎自用，學會傾聽與合作。'
    : dayMasterStrength === 'weak'
      ? '命主天生較為謙和，善於借力使力。適合在團隊中發揮作用，以柔克剛。但需注意培養自信與獨立性，不可過於依賴外力。'
      : '命主的強弱需進一步分析。'
  }

---

## 💎 用神與喜忌分析

${yongShen.length > 0 ? `根據日主${strengthText}的判定，此命盤的用神為：**${yongShen.join('、')}**。

### 喜用之行

${yongShen.map(wx => `- **${wx}**：為命盤所喜之行，得${wx}之助則運勢順遂、事業亨通。生活中宜多親近${wx}所對應的顏色、方位與事物。`).join('\n')}

### 忌諱之行

${Object.keys(WUXING_TRAITS).filter(wx => !yongShen.includes(wx as WuXing)).map(wx => `- **${wx}**：為命盤所忌或閒置之行，${wx}氣過旺可能帶來不利影響。`).join('\n')}

用神是命盤的平衡支點，了解用神有助於在生活中做出更好的選擇。無論是職業方向、居住環境、人際關係，都可以參考用神的指引。` : '（需設定日主強弱以分析用神）'}
${daYunSection}
${liuNianSection}

---

## 🧠 性格特質分析

根據命盤的五行結構與十神分佈，命主具有以下性格特質：

${dmElement === '木' ? '- **仁厚正直**：木之人天性善良，重視情義與道德。\n- **志向遠大**：如木向上伸展，有追求理想的動力。\n- **堅韌不拔**：一旦決定方向，便如扎根之木，穩定前行。' : ''}${dmElement === '火' ? '- **熱情開朗**：火之人天性樂觀，善於感染他人。\n- **直覺敏銳**：對事物有天生的洞察力。\n- **行動迅速**：想到便做，不喜拖延。' : ''}${dmElement === '土' ? '- **穩重踏實**：土之人天性務實，重視信用。\n- **包容寬厚**：能容納不同意見，善於協調。\n- **耐性持久**：做事有始有終，不輕言放棄。' : ''}${dmElement === '金' ? '- **果斷堅毅**：金之人天性剛強，做事講求效率。\n- **重義輕利**：對朋友忠誠，重視原則。\n- **追求完美**：對自己和他人都有較高要求。' : ''}${dmElement === '水' ? '- **聰慧靈活**：水之人天性聰穎，善於變通。\n- **觀察力強**：能洞察人心與局勢。\n- **適應力佳**：如水般順勢而流，能在不同環境中生存。' : ''}

${sortedSS.length > 0 ? `命盤中**${sortedSS[0][0]}**最為突出，這使命主在${sortedSS[0][0] === '食神' || sortedSS[0][0] === '傷官' ? '才藝與表達' : sortedSS[0][0] === '正財' || sortedSS[0][0] === '偏財' ? '理財與事業' : sortedSS[0][0] === '正官' || sortedSS[0][0] === '七殺' ? '管理與領導' : sortedSS[0][0] === '正印' || sortedSS[0][0] === '偏印' ? '學問與思考' : '社交與行動'}方面有獨特的天賦。` : ''}

---

## 🛤️ 人生發展方向

根據命盤格局，以下為命主適合發展的方向：

${yongShen.map(wx => {
    const dirs: Record<WuXing, string> = {
      '木': '教育、文化、環保、農林、設計、公益事業',
      '火': '科技、傳媒、餐飲、能源、表演藝術、市場行銷',
      '土': '房地產、建築、農業、倉儲、顧問、人力資源',
      '金': '金融、法律、機械、珠寶、軍警、醫療手術',
      '水': '貿易、物流、旅遊、傳播、諮詢、水利工程',
    };
    return `- **${wx}相關行業**：${dirs[wx as WuXing]}`;
  }).join('\n')}

選擇與用神相合的行業與方向，能讓命主事半功倍，更容易取得成就。

---

## 📌 行動建議

1. **順應天時**：了解自己的命盤格局，在有利的大運與流年中積極行動，在不利時期則穩守待變。
2. **補強弱行**：${weakest[0]}氣不足，可透過相應的顏色（如穿著、環境佈置）、飲食、方位等方式補強。
3. **發揮所長**：命盤中${sortedSS.length > 0 ? sortedSS[0][0] : ''}的能量突出，善用此特質可在相關領域取得成就。
4. **調和人際**：根據十神結構，注意與不同類型的人的相處之道，取長補短。
5. **持續學習**：命理是一門深奧的學問，持續學習與復盤，能讓您更深入地理解自己的人生軌跡。

---

## ✨ 智慧金句

> *「天行有常，不為堯存，不為桀亡。知天命者，順之而行，逆之而慎。八字非定數，乃知己之鏡。」*

> *「五行流轉如四季更迭，無永遠之春亦無永遠之冬。知進退、明得失，方為智者。」*

> *「命者，天之所賦；運者，時之所遇。命不可改，運可調之。此八字之妙用也。」*

---

## 📖 命盤寓言

${fable}

此寓言呼應命主的八字格局——在天地之間，順應自然之道，找到屬於自己的節奏與位置，便是人生最大的智慧。

---

*本報告由「福星何大師」八字命盤觀測台生成*
*報告僅供命理學習與參考，命運掌握在自己手中*
`;
}
