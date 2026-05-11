'use client';

import type { SajuResult, DaeunPeriod } from '@/lib/saju/types';
import { ELEMENT_BG_COLORS } from '@/lib/saju/constants';

interface Props {
  result: SajuResult;
}

const TENGOD_COLORS: Record<string, string> = {
  비견: '#4ade80', 겁재: '#22c55e',
  식신: '#f87171', 상관: '#ef4444',
  편재: '#fbbf24', 정재: '#f59e0b',
  편관: '#94a3b8', 정관: '#64748b',
  편인: '#60a5fa', 정인: '#3b82f6',
};

function DaeunCard({ period, isCurrent, birthYear }: { period: DaeunPeriod; isCurrent: boolean; birthYear: number }) {
  const stemBg = ELEMENT_BG_COLORS[period.pillar.stemElement];
  const stemColors: Record<string, string> = {
    목: '#4ade80', 화: '#f87171', 토: '#fbbf24', 금: '#c0cfe0', 수: '#60a5fa',
  };
  const stemColor = stemColors[period.pillar.stemElement];
  const branchColor = stemColors[period.pillar.branchElement];
  const tgColor = TENGOD_COLORS[period.tenGodOfStem.name] || '#94a3b8';
  const startYear = birthYear + period.startAge;
  const endYear = birthYear + period.endAge;

  return (
    <div className={`daeun-item rounded-xl p-3 ${isCurrent ? 'active' : ''}`}
      style={{
        background: isCurrent ? 'rgba(212,160,23,0.08)' : 'rgba(26,37,64,0.5)',
        border: `1px solid ${isCurrent ? '#f0c040' : 'rgba(212,160,23,0.1)'}`,
      }}>
      {isCurrent && (
        <div className="text-xs font-bold mb-2 text-center px-2 py-0.5 rounded-full"
          style={{ background: 'rgba(212,160,23,0.2)', color: '#f0c040', border: '1px solid rgba(212,160,23,0.4)' }}>
          ★ 현재 대운
        </div>
      )}
      <div className="flex gap-2 mb-2">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center font-black text-lg"
          style={{ background: stemBg, color: stemColor }}>
          {period.pillar.stem}
        </div>
        <div className="w-10 h-10 rounded-lg flex items-center justify-center font-black text-lg"
          style={{ background: ELEMENT_BG_COLORS[period.pillar.branchElement], color: branchColor }}>
          {period.pillar.branch}
        </div>
      </div>
      <div className="text-xs space-y-0.5">
        <p style={{ color: '#94a3b8' }}>{period.startAge}~{period.endAge}세</p>
        <p style={{ color: '#64748b' }}>{startYear}~{endYear}년</p>
        <p>
          <span style={{ color: tgColor }}>십성: {period.tenGodOfStem.name}</span>
        </p>
        <p style={{ color: '#475569' }}>{period.pillar.stemElement}·{period.pillar.branchElement}</p>
      </div>
    </div>
  );
}

export default function DaeunTimeline({ result }: Props) {
  const { daeun, daeunStartAge, currentDaeun, currentAge, input } = result;
  const birthYear = input.birthYear;

  return (
    <div className="saju-card p-6">
      <h2 className="text-lg font-bold mb-1" style={{ color: '#f0c040' }}>
        📅 대운 타임라인 (大運)
      </h2>
      <p className="text-xs mb-2" style={{ color: '#475569' }}>
        10년 주기로 바뀌는 대운 — 만 {daeunStartAge}세부터 시작
      </p>

      {/* 대운 시작 정보 */}
      <div className="rounded-xl p-3 mb-5"
        style={{ background: 'rgba(212,160,23,0.08)', border: '1px solid rgba(212,160,23,0.2)' }}>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-xs" style={{ color: '#475569' }}>대운 시작</p>
            <p className="font-bold" style={{ color: '#f0c040' }}>만 {daeunStartAge}세</p>
          </div>
          <div>
            <p className="text-xs" style={{ color: '#475569' }}>현재 나이</p>
            <p className="font-bold" style={{ color: '#f0c040' }}>만 {currentAge}세</p>
          </div>
          <div>
            <p className="text-xs" style={{ color: '#475569' }}>현재 대운</p>
            <p className="font-bold" style={{ color: '#f0c040' }}>
              {currentDaeun ? `${currentDaeun.pillar.stem}${currentDaeun.pillar.branch}` : '시작 전'}
            </p>
          </div>
        </div>
      </div>

      {/* 대운 카드 */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        {daeun.map(period => (
          <DaeunCard
            key={period.index}
            period={period}
            isCurrent={currentDaeun?.index === period.index}
            birthYear={birthYear}
          />
        ))}
      </div>

      {/* 현재 대운 상세 */}
      {currentDaeun && (
        <div className="mt-5 rounded-xl p-4" style={{ background: 'rgba(212,160,23,0.05)', border: '1px solid rgba(212,160,23,0.2)' }}>
          <h3 className="text-sm font-bold mb-3" style={{ color: '#f0c040' }}>
            현재 대운 상세 — {currentDaeun.pillar.stem}{currentDaeun.pillar.branch}운 ({currentDaeun.startAge}~{currentDaeun.endAge}세)
          </h3>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <p style={{ color: '#94a3b8' }}>대운 천간</p>
              <p className="font-medium" style={{ color: '#e2e8f0' }}>{currentDaeun.pillar.stem} ({currentDaeun.pillar.stemElement}·{currentDaeun.pillar.stemYinYang})</p>
              <p style={{ color: '#64748b' }}>십성: {currentDaeun.tenGodOfStem.name} — {currentDaeun.tenGodOfStem.meaning}</p>
            </div>
            <div>
              <p style={{ color: '#94a3b8' }}>대운 지지</p>
              <p className="font-medium" style={{ color: '#e2e8f0' }}>{currentDaeun.pillar.branch} ({currentDaeun.pillar.branchElement}·{currentDaeun.pillar.branchYinYang})</p>
              <p style={{ color: '#64748b' }}>지장간: {currentDaeun.pillar.hiddenStems.join(', ')}</p>
            </div>
          </div>
          <p className="text-xs mt-3" style={{ color: '#475569' }}>
            ※ 대운은 10년간의 큰 흐름을 나타냅니다. 앞 5년은 천간의 영향이, 뒤 5년은 지지의 영향이 강하게 나타납니다.
          </p>
        </div>
      )}

      {/* 세운 (올해) */}
      <div className="mt-4 rounded-xl p-4" style={{ background: 'rgba(26,37,64,0.6)', border: '1px solid rgba(212,160,23,0.15)' }}>
        <h3 className="text-sm font-bold mb-3" style={{ color: '#f0c040' }}>
          세운 (歲運) — {new Date().getFullYear()}년 운세
        </h3>
        <div className="flex items-start gap-4">
          <div className="flex gap-2">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl"
              style={{ background: ELEMENT_BG_COLORS[result.seun.stemElement], color: '#60a5fa' }}>
              {result.seun.stem}
            </div>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl"
              style={{ background: ELEMENT_BG_COLORS[result.seun.branchElement], color: '#60a5fa' }}>
              {result.seun.branch}
            </div>
          </div>
          <div className="text-xs space-y-1">
            <p style={{ color: '#94a3b8' }}>
              {new Date().getFullYear()}년 간지: <strong style={{ color: '#60a5fa' }}>{result.seun.stem}{result.seun.branch}</strong>
            </p>
            <p style={{ color: '#64748b' }}>
              오행: {result.seun.stemElement}·{result.seun.branchElement}
            </p>
            <p style={{ color: '#64748b' }}>
              십성: <strong style={{ color: TENGOD_COLORS[result.seunTenGod.name] }}>
                {result.seunTenGod.name}
              </strong> ({result.seunTenGod.meaning})
            </p>
            <p style={{ color: '#475569' }}>
              {result.seunTenGod.positive}
            </p>
          </div>
        </div>
        <p className="text-xs mt-3" style={{ color: '#475569' }}>
          ※ 세운은 1년 단위의 운세 흐름입니다. 대운과 세운이 일간에 미치는 영향을 종합적으로 해석해야 합니다.
        </p>
      </div>
    </div>
  );
}
