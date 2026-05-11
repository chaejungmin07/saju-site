import {
  STEMS, BRANCHES, STEM_ELEMENTS, BRANCH_ELEMENTS,
  STEM_YIN_YANG, BRANCH_YIN_YANG, HIDDEN_STEMS,
  ELEMENT_GENERATES, ELEMENT_CONTROLS, ELEMENT_GENERATED_BY, ELEMENT_CONTROLLED_BY,
  TWELVE_STAGE_START, TWELVE_STAGES, TWELVE_STAGE_MEANINGS,
  TEN_GOD_INFO, JEOLGI,
} from './constants';
import type { SajuInput, SajuResult, Pillar, TenGod, TwelveStage, DaeunPeriod, OhaengCount } from './types';

// Reference: February 1, 1900 = 甲子日 (index 0 in 60-cycle)
const REF_DATE = new Date(1900, 1, 1);

function daysBetween(d1: Date, d2: Date): number {
  const ms = d2.getTime() - d1.getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

function buildPillar(stemIdx: number, branchIdx: number): Pillar {
  const si = ((stemIdx % 10) + 10) % 10;
  const bi = ((branchIdx % 12) + 12) % 12;
  const hiddenStemNames = HIDDEN_STEMS[bi];
  return {
    stem: STEMS[si],
    branch: BRANCHES[bi],
    stemIdx: si,
    branchIdx: bi,
    stemElement: STEM_ELEMENTS[si],
    branchElement: BRANCH_ELEMENTS[bi],
    stemYinYang: STEM_YIN_YANG[si],
    branchYinYang: BRANCH_YIN_YANG[bi],
    hiddenStems: hiddenStemNames,
    hiddenStemElements: hiddenStemNames.map(s => STEM_ELEMENTS[STEMS.indexOf(s)]),
    ganjiKor: STEMS[si] + BRANCHES[bi],
  };
}

function getDayPillarRaw(year: number, month: number, day: number): { stemIdx: number; branchIdx: number } {
  const date = new Date(year, month - 1, day);
  const days = daysBetween(REF_DATE, date);
  return {
    stemIdx: ((days % 10) + 10) % 10,
    branchIdx: ((days % 12) + 12) % 12,
  };
}

function getJeolgiDate(year: number, jeolgiIdx: number): Date {
  const j = JEOLGI[jeolgiIdx];
  return new Date(year, j.month - 1, j.day);
}

// Returns { branchIdx, stemIdx } for month, corrected for 절기
function getMonthPillarRaw(
  year: number, month: number, day: number, yearStemIdx: number
): { stemIdx: number; branchIdx: number; effectiveYearStemIdx: number } {
  // Find which 절기 period we're in
  let branchIdx = -1;
  let effectiveYear = year;
  let effectiveYearStemIdx = yearStemIdx;

  // Check if before 입춘 (year changes at 입춘)
  const ipchun = getJeolgiDate(year, 1); // 입춘 = index 1 in JEOLGI
  const birthDate = new Date(year, month - 1, day);

  if (birthDate < ipchun) {
    effectiveYear = year - 1;
    effectiveYearStemIdx = ((yearStemIdx - 1) + 10) % 10;
  }

  // Find which 절기 we're in
  for (let i = JEOLGI.length - 1; i >= 0; i--) {
    const j = JEOLGI[i];
    const jeolgiYear = j.month === 1 ? year : effectiveYear;
    const jDate = new Date(jeolgiYear, j.month - 1, j.day);
    if (birthDate >= jDate) {
      branchIdx = j.branchIdx;
      break;
    }
  }

  if (branchIdx === -1) {
    // Before 소한 of current year → 해월 of previous year
    branchIdx = 11; // 해
  }

  // Calculate month stem using 五虎遁年起月法
  const yearStemGroup = effectiveYearStemIdx % 5;
  // Month sequence: 인=0, 묘=1, 진=2, 사=3, 오=4, 미=5, 신=6, 유=7, 술=8, 해=9, 자=10, 축=11
  const branchOrder = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1];
  const monthSeq = branchOrder.indexOf(branchIdx);
  const stemIdx = (yearStemGroup * 2 + 2 + monthSeq) % 10;

  return { stemIdx, branchIdx, effectiveYearStemIdx };
}

function getYearPillarRaw(year: number, month: number, day: number): { stemIdx: number; branchIdx: number } {
  const ipchun = getJeolgiDate(year, 1);
  const birthDate = new Date(year, month - 1, day);
  const effectiveYear = birthDate < ipchun ? year - 1 : year;
  return {
    stemIdx: ((effectiveYear - 4) % 10 + 10) % 10,
    branchIdx: ((effectiveYear - 4) % 12 + 12) % 12,
  };
}

function getHourBranchIdx(hour: number): number {
  if (hour === 23) return 0;
  return Math.floor((hour + 1) / 2) % 12;
}

function getHourStemIdx(dayMasterStemIdx: number, hourBranchIdx: number): number {
  const group = dayMasterStemIdx % 5;
  return (group * 2 + hourBranchIdx) % 10;
}

function getTenGod(dayStemIdx: number, targetStemIdx: number): TenGod {
  const dayElement = STEM_ELEMENTS[dayStemIdx];
  const targetElement = STEM_ELEMENTS[targetStemIdx];
  const dayYY = STEM_YIN_YANG[dayStemIdx];
  const targetYY = STEM_YIN_YANG[targetStemIdx];
  const sameYY = dayYY === targetYY;

  let name: string;
  if (targetElement === dayElement) {
    name = sameYY ? '비견' : '겁재';
  } else if (targetElement === ELEMENT_GENERATES[dayElement]) {
    name = sameYY ? '식신' : '상관';
  } else if (targetElement === ELEMENT_CONTROLS[dayElement]) {
    name = sameYY ? '편재' : '정재';
  } else if (targetElement === ELEMENT_CONTROLLED_BY[dayElement]) {
    name = sameYY ? '편관' : '정관';
  } else if (targetElement === ELEMENT_GENERATED_BY[dayElement]) {
    name = sameYY ? '편인' : '정인';
  } else {
    name = '비견';
  }

  return { name, ...TEN_GOD_INFO[name] };
}

function getTwelveStage(stemIdx: number, branchIdx: number): TwelveStage {
  const isYang = STEM_YIN_YANG[stemIdx] === '양';
  const startBranch = TWELVE_STAGE_START[stemIdx];
  let stageIdx: number;
  if (isYang) {
    stageIdx = ((branchIdx - startBranch) % 12 + 12) % 12;
  } else {
    stageIdx = ((startBranch - branchIdx) % 12 + 12) % 12;
  }
  const stageName = TWELVE_STAGES[stageIdx];
  return { name: stageName, ...TWELVE_STAGE_MEANINGS[stageName] };
}

function calculateOhaeng(pillars: Pillar[]): OhaengCount {
  const count = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };
  for (const p of pillars) {
    count[p.stemElement as keyof typeof count]++;
    count[p.branchElement as keyof typeof count]++;
    for (const hs of p.hiddenStems) {
      const idx = STEMS.indexOf(hs);
      if (idx >= 0) {
        const el = STEM_ELEMENTS[idx] as keyof typeof count;
        count[el] += 0.5;
      }
    }
  }
  return count;
}

function findNextJeolgi(year: number, month: number, day: number): Date {
  const birthDate = new Date(year, month - 1, day);
  for (let y = year; y <= year + 1; y++) {
    for (const j of JEOLGI) {
      const jYear = j.month === 1 && y === year ? y + 1 : y;
      const jDate = new Date(jYear, j.month - 1, j.day);
      if (jDate > birthDate) return jDate;
    }
  }
  return new Date(year + 1, 1, 4);
}

function findPrevJeolgi(year: number, month: number, day: number): Date {
  const birthDate = new Date(year, month - 1, day);
  const allJeolgi: Date[] = [];
  for (let y = year - 1; y <= year; y++) {
    for (const j of JEOLGI) {
      const jYear = j.month === 1 && y === year - 1 ? year : y;
      allJeolgi.push(new Date(jYear, j.month - 1, j.day));
    }
  }
  allJeolgi.sort((a, b) => a.getTime() - b.getTime());
  let prev = allJeolgi[0];
  for (const jDate of allJeolgi) {
    if (jDate < birthDate) prev = jDate;
    else break;
  }
  return prev;
}

function calculateDaeun(
  input: SajuInput,
  yearStemIdx: number,
  monthPillar: Pillar,
): { daeun: DaeunPeriod[]; startAge: number } {
  const yearYY = STEM_YIN_YANG[yearStemIdx];
  // 순행: 양년 남자, 음년 여자
  const isForward = (yearYY === '양' && input.gender === 'male') ||
                    (yearYY === '음' && input.gender === 'female');

  let targetDate: Date;
  if (isForward) {
    targetDate = findNextJeolgi(input.birthYear, input.birthMonth, input.birthDay);
  } else {
    targetDate = findPrevJeolgi(input.birthYear, input.birthMonth, input.birthDay);
  }

  const birthDate = new Date(input.birthYear, input.birthMonth - 1, input.birthDay);
  const daysDiff = Math.abs(daysBetween(birthDate, targetDate));
  const startAge = Math.ceil(daysDiff / 3);

  const daeun: DaeunPeriod[] = [];
  for (let i = 0; i < 10; i++) {
    let idx: number;
    if (isForward) {
      idx = monthPillar.stemIdx + (i + 1);
    } else {
      idx = monthPillar.stemIdx - (i + 1);
    }
    const branchBase = isForward
      ? monthPillar.branchIdx + (i + 1)
      : monthPillar.branchIdx - (i + 1);

    const pillar = buildPillar(idx, branchBase);
    const tenGodOfStem = getTenGod(monthPillar.stemIdx, idx);
    daeun.push({
      startAge: startAge + i * 10,
      endAge: startAge + i * 10 + 9,
      pillar,
      tenGodOfStem,
      index: i,
    });
  }

  return { daeun, startAge };
}

export function calculateSaju(input: SajuInput): SajuResult {
  const yearRaw = getYearPillarRaw(input.birthYear, input.birthMonth, input.birthDay);
  const monthRaw = getMonthPillarRaw(input.birthYear, input.birthMonth, input.birthDay, yearRaw.stemIdx);
  const dayRaw = getDayPillarRaw(input.birthYear, input.birthMonth, input.birthDay);
  const hourBranchIdx = getHourBranchIdx(input.birthHour);
  const hourStemIdx = getHourStemIdx(dayRaw.stemIdx, hourBranchIdx);

  const yearPillar = buildPillar(yearRaw.stemIdx, yearRaw.branchIdx);
  const monthPillar = buildPillar(monthRaw.stemIdx, monthRaw.branchIdx);
  const dayPillar = buildPillar(dayRaw.stemIdx, dayRaw.branchIdx);
  const hourPillar = buildPillar(hourStemIdx, hourBranchIdx);

  const ohaeng = calculateOhaeng([yearPillar, monthPillar, dayPillar, hourPillar]);

  const tenGods = {
    year: getTenGod(dayRaw.stemIdx, yearRaw.stemIdx),
    month: getTenGod(dayRaw.stemIdx, monthRaw.stemIdx),
    hour: getTenGod(dayRaw.stemIdx, hourStemIdx),
  };

  const twelveStages = {
    year: getTwelveStage(dayRaw.stemIdx, yearRaw.branchIdx),
    month: getTwelveStage(dayRaw.stemIdx, monthRaw.branchIdx),
    hour: getTwelveStage(dayRaw.stemIdx, hourBranchIdx),
  };

  const { daeun, startAge } = calculateDaeun(input, yearRaw.stemIdx, monthPillar);

  const currentYear = new Date().getFullYear();
  const seunStemIdx = ((currentYear - 4) % 10 + 10) % 10;
  const seunBranchIdx = ((currentYear - 4) % 12 + 12) % 12;
  const seun = buildPillar(seunStemIdx, seunBranchIdx);
  const seunTenGod = getTenGod(dayRaw.stemIdx, seunStemIdx);

  const currentAge = currentYear - input.birthYear;
  const currentDaeun = daeun.find(d => d.startAge <= currentAge && d.endAge >= currentAge) ?? null;

  return {
    yearPillar,
    monthPillar,
    dayPillar,
    hourPillar,
    ohaeng,
    tenGods,
    twelveStages,
    daeun,
    daeunStartAge: startAge,
    currentDaeun,
    seun,
    seunTenGod,
    daymaster: dayPillar.stem,
    daymasterElement: dayPillar.stemElement,
    daymasterYinYang: dayPillar.stemYinYang,
    ilju: dayPillar.ganjiKor,
    input,
    currentAge,
  };
}

export function formatSajuForAI(result: SajuResult): string {
  const { yearPillar: y, monthPillar: m, dayPillar: d, hourPillar: h } = result;
  return `
사주팔자:
- 연주(年柱): ${y.stem}${y.branch} [${y.stemElement}·${y.stemYinYang} / ${y.branchElement}·${y.branchYinYang}]
- 월주(月柱): ${m.stem}${m.branch} [${m.stemElement}·${m.stemYinYang} / ${m.branchElement}·${m.branchYinYang}]
- 일주(日柱): ${d.stem}${d.branch} [${d.stemElement}·${d.stemYinYang} / ${d.branchElement}·${d.branchYinYang}] ← 일간(日干, 나 자신)
- 시주(時柱): ${h.stem}${h.branch} [${h.stemElement}·${h.stemYinYang} / ${h.branchElement}·${h.branchYinYang}]

일간(日干): ${result.daymaster}(${result.daymasterElement}·${result.daymasterYinYang}) — 이 사람의 본질

오행 분포:
- 목(木): ${result.ohaeng.목.toFixed(1)}
- 화(火): ${result.ohaeng.화.toFixed(1)}
- 토(土): ${result.ohaeng.토.toFixed(1)}
- 금(金): ${result.ohaeng.금.toFixed(1)}
- 수(水): ${result.ohaeng.수.toFixed(1)}

십성(十星):
- 연간 십성: ${result.tenGods.year.name} (${result.tenGods.year.meaning})
- 월간 십성: ${result.tenGods.month.name} (${result.tenGods.month.meaning})
- 시간 십성: ${result.tenGods.hour.name} (${result.tenGods.hour.meaning})

십이운성:
- 연지: ${result.twelveStages.year.name} (${result.twelveStages.year.meaning})
- 월지: ${result.twelveStages.month.name} (${result.twelveStages.month.meaning})
- 시지: ${result.twelveStages.hour.name} (${result.twelveStages.hour.meaning})

현재 대운: ${result.currentDaeun ? `${result.currentDaeun.pillar.stem}${result.currentDaeun.pillar.branch} (${result.currentDaeun.startAge}세~${result.currentDaeun.endAge}세)` : '대운 시작 전'}
세운(${new Date().getFullYear()}년): ${result.seun.stem}${result.seun.branch} — 십성: ${result.seunTenGod.name}
현재 나이: 만 ${result.currentAge}세
성별: ${result.input.gender === 'male' ? '남성' : '여성'}
`.trim();
}
