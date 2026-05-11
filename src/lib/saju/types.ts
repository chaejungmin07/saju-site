export interface SajuInput {
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  birthHour: number;
  birthMinute: number;
  gender: 'male' | 'female';
  name?: string;
}

export interface Pillar {
  stem: string;
  branch: string;
  stemIdx: number;
  branchIdx: number;
  stemElement: string;
  branchElement: string;
  stemYinYang: '양' | '음';
  branchYinYang: '양' | '음';
  hiddenStems: string[];
  hiddenStemElements: string[];
  ganjiKor: string;
}

export interface OhaengCount {
  목: number;
  화: number;
  토: number;
  금: number;
  수: number;
}

export interface TenGod {
  name: string;
  meaning: string;
  positive: string;
  negative: string;
}

export interface TwelveStage {
  name: string;
  energy: string;
  meaning: string;
}

export interface DaeunPeriod {
  startAge: number;
  endAge: number;
  pillar: Pillar;
  tenGodOfStem: TenGod;
  index: number;
}

export interface SajuResult {
  yearPillar: Pillar;
  monthPillar: Pillar;
  dayPillar: Pillar;
  hourPillar: Pillar;
  ohaeng: OhaengCount;
  tenGods: {
    year: TenGod;
    month: TenGod;
    hour: TenGod;
  };
  twelveStages: {
    year: TwelveStage;
    month: TwelveStage;
    hour: TwelveStage;
  };
  daeun: DaeunPeriod[];
  daeunStartAge: number;
  currentDaeun: DaeunPeriod | null;
  seun: Pillar;
  seunTenGod: TenGod;
  daymaster: string;
  daymasterElement: string;
  daymasterYinYang: '양' | '음';
  ilju: string;
  input: SajuInput;
  currentAge: number;
}
