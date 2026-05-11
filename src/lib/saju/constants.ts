export const STEMS = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];
export const STEMS_HANJA = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
export const BRANCHES = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];
export const BRANCHES_HANJA = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
export const BRANCH_ANIMALS = ['쥐', '소', '호랑이', '토끼', '용', '뱀', '말', '양', '원숭이', '닭', '개', '돼지'];

export const STEM_ELEMENTS = ['목', '목', '화', '화', '토', '토', '금', '금', '수', '수'];
export const BRANCH_ELEMENTS = ['수', '토', '목', '목', '토', '화', '화', '토', '금', '금', '토', '수'];
export const STEM_YIN_YANG: ('양' | '음')[] = ['양', '음', '양', '음', '양', '음', '양', '음', '양', '음'];
export const BRANCH_YIN_YANG: ('양' | '음')[] = ['양', '음', '양', '음', '양', '음', '양', '음', '양', '음', '양', '음'];

// 지장간 (Hidden stems in each branch)
export const HIDDEN_STEMS: string[][] = [
  ['임', '계'],           // 자(0)
  ['기', '신', '계'],     // 축(1)
  ['무', '병', '갑'],     // 인(2)
  ['갑', '을'],           // 묘(3)
  ['을', '계', '무'],     // 진(4)
  ['무', '경', '병'],     // 사(5)
  ['병', '기', '정'],     // 오(6)
  ['정', '을', '기'],     // 미(7)
  ['무', '임', '경'],     // 신(8)
  ['경', '신'],           // 유(9)
  ['신', '정', '무'],     // 술(10)
  ['무', '갑', '임'],     // 해(11)
];

export const ELEMENT_GENERATES: Record<string, string> = {
  목: '화', 화: '토', 토: '금', 금: '수', 수: '목',
};
export const ELEMENT_CONTROLS: Record<string, string> = {
  목: '토', 화: '금', 토: '수', 금: '목', 수: '화',
};
export const ELEMENT_GENERATED_BY: Record<string, string> = {
  화: '목', 토: '화', 금: '토', 수: '금', 목: '수',
};
export const ELEMENT_CONTROLLED_BY: Record<string, string> = {
  토: '목', 금: '화', 수: '토', 목: '금', 화: '수',
};

export const ELEMENT_COLORS: Record<string, string> = {
  목: 'element-wood',
  화: 'element-fire',
  토: 'element-earth',
  금: 'element-metal',
  수: 'element-water',
};

export const ELEMENT_BG_COLORS: Record<string, string> = {
  목: '#22c55e',
  화: '#ef4444',
  토: '#d97706',
  금: '#9ca3af',
  수: '#3b82f6',
};

// 십이운성: starting branch index for 장생 for each stem
// Arrangement: 장생, 목욕, 관대, 건록, 제왕, 쇠, 병, 사, 묘, 절, 태, 양
// 양간: 순행(+1), 음간: 역행(-1)
export const TWELVE_STAGE_START: Record<number, number> = {
  0: 11,  // 갑(양목): 장생 = 해(11)
  1: 6,   // 을(음목): 장생 = 오(6) — 역행
  2: 2,   // 병(양화): 장생 = 인(2)
  3: 9,   // 정(음화): 장생 = 유(9) — 역행
  4: 2,   // 무(양토): 장생 = 인(2) — 같은 화
  5: 9,   // 기(음토): 장생 = 유(9) — 역행
  6: 5,   // 경(양금): 장생 = 사(5)
  7: 0,   // 신(음금): 장생 = 자(0) — 역행
  8: 8,   // 임(양수): 장생 = 신(8)
  9: 3,   // 계(음수): 장생 = 묘(3) — 역행
};

export const TWELVE_STAGES = ['장생', '목욕', '관대', '건록', '제왕', '쇠', '병', '사', '묘', '절', '태', '양'];
export const TWELVE_STAGE_MEANINGS: Record<string, { energy: string; meaning: string }> = {
  장생: { energy: '강(强)', meaning: '탄생과 시작의 기운, 새로운 출발과 성장 잠재력이 높음' },
  목욕: { energy: '불안정', meaning: '재능이 넘치지만 감정적, 예술적 기질, 변화가 많음' },
  관대: { energy: '성장', meaning: '점차 성숙해지는 시기, 활발하고 진취적인 기상' },
  건록: { energy: '강(强)', meaning: '자력으로 독립하는 힘, 왕성한 활동력과 자신감' },
  제왕: { energy: '최강', meaning: '최고의 권위와 힘, 지도력이 뛰어나지만 독선 주의' },
  쇠: { energy: '하락 시작', meaning: '경험이 풍부하고 원숙함, 서서히 내려가는 기운' },
  병: { energy: '약(弱)', meaning: '감수성이 예민하고 섬세함, 건강에 신경 써야 함' },
  사: { energy: '종결', meaning: '한 사이클의 마무리, 새로운 시작을 위한 준비' },
  묘: { energy: '저장', meaning: '내면이 충실하고 절제력이 강함, 숨겨진 재능' },
  절: { energy: '단절', meaning: '큰 변화와 재생의 시기, 새로운 환경으로의 전환' },
  태: { energy: '잠재', meaning: '새로운 생명이 잉태되는 기운, 가능성과 잠재력' },
  양: { energy: '준비', meaning: '성장을 준비하는 시기, 보호받고 키워지는 기운' },
};

// 십성 의미
export const TEN_GOD_INFO: Record<string, { meaning: string; positive: string; negative: string }> = {
  비견: { meaning: '형제·동료·경쟁자', positive: '독립심, 자존심, 끈기, 협동력', negative: '고집, 경쟁심 과다, 분재 위험' },
  겁재: { meaning: '형제·동료(이면)', positive: '추진력, 결단력, 사교성', negative: '충동적, 재물 손실, 형제 갈등' },
  식신: { meaning: '재능·표현·식복', positive: '표현력, 예술성, 식복, 낙천주의', negative: '게으름, 의존심, 식탐' },
  상관: { meaning: '재능·표현(강렬)', positive: '뛰어난 재능, 언변, 창의성', negative: '반항심, 관재구설, 고집' },
  편재: { meaning: '활동적 재물·이성', positive: '사업적 수완, 다재다능, 승부욕', negative: '투기 위험, 이성 문제' },
  정재: { meaning: '안정적 재물·배우자', positive: '재물복, 성실함, 안정적 삶', negative: '보수적, 변화 거부, 인색' },
  편관: { meaning: '권위·극복·압박', positive: '지도력, 결단력, 극복의지', negative: '관재구설, 압박감, 강압적' },
  정관: { meaning: '명예·직업·배우자', positive: '명예, 도덕심, 규칙준수, 승진', negative: '보수적, 유연성 부족' },
  편인: { meaning: '지혜·학문(특수)', positive: '직관력, 예술성, 종교적 기질', negative: '식신 제어, 자기세계 강함' },
  정인: { meaning: '학문·명예·어머니', positive: '학문적 재능, 인덕, 명예', negative: '의존성, 우유부단' },
};

// 절기 (Solar Terms) approximate dates
export const JEOLGI: { name: string; month: number; day: number; branchIdx: number }[] = [
  { name: '소한', month: 1,  day: 6,  branchIdx: 1  }, // 축월 시작
  { name: '입춘', month: 2,  day: 4,  branchIdx: 2  }, // 인월 시작
  { name: '경칩', month: 3,  day: 6,  branchIdx: 3  }, // 묘월 시작
  { name: '청명', month: 4,  day: 5,  branchIdx: 4  }, // 진월 시작
  { name: '입하', month: 5,  day: 6,  branchIdx: 5  }, // 사월 시작
  { name: '망종', month: 6,  day: 6,  branchIdx: 6  }, // 오월 시작
  { name: '소서', month: 7,  day: 7,  branchIdx: 7  }, // 미월 시작
  { name: '입추', month: 8,  day: 8,  branchIdx: 8  }, // 신월 시작
  { name: '백로', month: 9,  day: 8,  branchIdx: 9  }, // 유월 시작
  { name: '한로', month: 10, day: 8,  branchIdx: 10 }, // 술월 시작
  { name: '입동', month: 11, day: 7,  branchIdx: 11 }, // 해월 시작
  { name: '대설', month: 12, day: 7,  branchIdx: 0  }, // 자월 시작
];

// 일주론 (Day Pillar Characteristics)
export const ILJU_INFO: Record<string, { title: string; desc: string; keywords: string[] }> = {
  '갑자': { title: '갑자일주 (甲子)', desc: '지혜롭고 창의적이며 선비 기질이 강합니다. 인격이 고결하고 학문을 좋아합니다.', keywords: ['지혜', '창의', '선비기질', '고결함'] },
  '갑인': { title: '갑인일주 (甲寅)', desc: '강직하고 정의감이 넘칩니다. 리더십이 뛰어나고 스스로 개척하는 힘이 있습니다.', keywords: ['강직', '정의감', '리더십', '개척정신'] },
  '갑진': { title: '갑진일주 (甲辰)', desc: '야망이 크고 추진력이 강합니다. 기획력이 뛰어나며 큰 사업을 이끕니다.', keywords: ['야망', '추진력', '기획력', '사업'] },
  '갑오': { title: '갑인일주 (甲午)', desc: '이상이 높고 명예를 중시합니다. 활동적이고 활달하며 인기가 많습니다.', keywords: ['이상', '명예', '활동적', '인기'] },
  '갑신': { title: '갑신일주 (甲申)', desc: '총명하고 판단력이 뛰어납니다. 현실감각과 이상을 조화시키는 능력이 있습니다.', keywords: ['총명', '판단력', '현실감각', '이상'] },
  '갑술': { title: '갑술일주 (甲戌)', desc: '의리가 강하고 리더십이 있습니다. 학문과 종교에 관심이 깊습니다.', keywords: ['의리', '리더십', '학문', '종교'] },
  '을축': { title: '을축일주 (乙丑)', desc: '성실하고 꾸준한 노력파입니다. 재물운이 좋고 안정적인 삶을 추구합니다.', keywords: ['성실', '꾸준함', '재물운', '안정'] },
  '을묘': { title: '을묘일주 (乙卯)', desc: '예민하고 감수성이 풍부합니다. 예술적 재능이 뛰어나고 인간관계가 넓습니다.', keywords: ['감수성', '예술성', '인간관계', '섬세함'] },
  '을사': { title: '을사일주 (乙巳)', desc: '끈기와 인내심이 강합니다. 어떤 상황에서도 살아남는 생명력이 있습니다.', keywords: ['끈기', '인내', '생명력', '적응력'] },
  '을미': { title: '을미일주 (乙未)', desc: '온순하고 친화력이 좋습니다. 예술과 문학에 소질이 있습니다.', keywords: ['온순', '친화력', '예술', '문학'] },
  '을유': { title: '을유일주 (乙酉)', desc: '완벽주의적이고 섬세합니다. 미적 감각이 뛰어나고 정확성을 추구합니다.', keywords: ['완벽주의', '섬세함', '미적감각', '정확성'] },
  '을해': { title: '을해일주 (乙亥)', desc: '지혜롭고 학문적 능력이 탁월합니다. 인정이 많고 봉사정신이 강합니다.', keywords: ['지혜', '학문', '인정', '봉사'] },
  '병자': { title: '병자일주 (丙子)', desc: '열정적이고 활동적입니다. 물과 불의 기운이 교차하여 극적인 삶을 삽니다.', keywords: ['열정', '활동적', '극적인삶', '강한에너지'] },
  '병인': { title: '병인일주 (丙寅)', desc: '의협심이 강하고 정의롭습니다. 리더십이 뛰어나고 카리스마가 있습니다.', keywords: ['의협심', '정의', '리더십', '카리스마'] },
  '병진': { title: '병진일주 (丙辰)', desc: '창의력이 풍부하고 표현력이 강합니다. 사회적 활동이 활발합니다.', keywords: ['창의력', '표현력', '사교성', '활발함'] },
  '병오': { title: '병오일주 (丙午)', desc: '불같은 열정과 추진력을 지닙니다. 자존심이 강하고 빛나는 존재입니다.', keywords: ['열정', '추진력', '자존심', '카리스마'] },
  '병신': { title: '병신일주 (丙申)', desc: '행동력이 빠르고 결단력이 강합니다. 새로운 것을 개척하는 능력이 있습니다.', keywords: ['행동력', '결단력', '개척정신', '추진력'] },
  '병술': { title: '병술일주 (丙戌)', desc: '학문적이고 사색을 좋아합니다. 종교나 철학에 관심이 깊습니다.', keywords: ['학문', '사색', '철학', '종교'] },
};
