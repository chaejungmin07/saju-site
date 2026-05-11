'use client';

import type { SajuResult } from '@/lib/saju/types';

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

function TenGodCard({
  name, meaning, positive, negative, pillarLabel, pillarGanji
}: {
  name: string; meaning: string; positive: string; negative: string;
  pillarLabel: string; pillarGanji: string;
}) {
  const color = TENGOD_COLORS[name] || '#94a3b8';
  return (
    <div className="rounded-xl p-4" style={{ background: 'rgba(26,37,64,0.6)', border: `1px solid ${color}30` }}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-xs" style={{ color: '#475569' }}>{pillarLabel}</span>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-sm font-black" style={{ color }}>{pillarGanji}</span>
            <span className="text-lg font-bold" style={{ color }}>→ {name}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs px-2 py-1 rounded-full"
            style={{ background: `${color}20`, color, border: `1px solid ${color}40` }}>
            {meaning}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 mt-2">
        <div className="rounded-lg p-2" style={{ background: 'rgba(74,222,128,0.05)' }}>
          <p className="text-xs font-medium mb-1" style={{ color: '#4ade80' }}>✓ 긍정</p>
          <p className="text-xs leading-relaxed" style={{ color: '#64748b' }}>{positive}</p>
        </div>
        <div className="rounded-lg p-2" style={{ background: 'rgba(248,113,113,0.05)' }}>
          <p className="text-xs font-medium mb-1" style={{ color: '#f87171' }}>△ 주의</p>
          <p className="text-xs leading-relaxed" style={{ color: '#64748b' }}>{negative}</p>
        </div>
      </div>
    </div>
  );
}

export default function TenGodsTable({ result }: Props) {
  const { tenGods, yearPillar, monthPillar, hourPillar, twelveStages, dayPillar } = result;

  const items = [
    { tg: tenGods.year, pillarLabel: '연간 (年干)', ganji: yearPillar.stem, stage: twelveStages.year },
    { tg: tenGods.month, pillarLabel: '월간 (月干)', ganji: monthPillar.stem, stage: twelveStages.month },
    { tg: tenGods.hour, pillarLabel: '시간 (時干)', ganji: hourPillar.stem, stage: twelveStages.hour },
  ];

  const STAGE_COLORS: Record<string, string> = {
    장생: '#4ade80', 목욕: '#60a5fa', 관대: '#a78bfa', 건록: '#f0c040',
    제왕: '#f87171', 쇠: '#94a3b8', 병: '#64748b', 사: '#475569',
    묘: '#334155', 절: '#1e3a5f', 태: '#a78bfa', 양: '#4ade80',
  };

  return (
    <div className="saju-card p-6">
      <h2 className="text-lg font-bold mb-1" style={{ color: '#f0c040' }}>
        ⭐ 십성 분석 (十星)
      </h2>
      <p className="text-xs mb-5" style={{ color: '#475569' }}>
        일간(<strong style={{ color: '#f0c040' }}>{result.daymaster}</strong>)을 기준으로 다른 천간과의 관계
      </p>

      <div className="space-y-4 mb-6">
        {items.map((item, i) => (
          <TenGodCard
            key={i}
            name={item.tg.name}
            meaning={item.tg.meaning}
            positive={item.tg.positive}
            negative={item.tg.negative}
            pillarLabel={item.pillarLabel}
            pillarGanji={item.ganji}
          />
        ))}
      </div>

      {/* 십이운성 */}
      <div>
        <h3 className="text-base font-bold mb-3" style={{ color: '#f0c040' }}>
          🌙 십이운성 (十二運星)
        </h3>
        <p className="text-xs mb-4" style={{ color: '#475569' }}>
          일간의 기운이 각 지지에서 어느 생애주기에 해당하는지
        </p>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: '연지 (年支)', stage: twelveStages.year, branch: yearPillar.branch },
            { label: '월지 (月支)', stage: twelveStages.month, branch: monthPillar.branch },
            { label: '시지 (時支)', stage: twelveStages.hour, branch: hourPillar.branch },
          ].map((item, i) => {
            const color = STAGE_COLORS[item.stage.name] || '#94a3b8';
            return (
              <div key={i} className="rounded-xl p-3 text-center"
                style={{ background: 'rgba(26,37,64,0.6)', border: `1px solid ${color}30` }}>
                <p className="text-xs mb-1" style={{ color: '#475569' }}>{item.label}</p>
                <p className="text-sm font-black mb-1" style={{ color }}>{item.branch} → {item.stage.name}</p>
                <p className="text-xs" style={{ color: '#64748b' }}>{item.stage.energy}</p>
                <p className="text-xs mt-1 leading-relaxed" style={{ color: '#475569' }}>
                  {item.stage.meaning.slice(0, 30)}...
                </p>
              </div>
            );
          })}
        </div>

        {/* 일지 십이운성 */}
        <div className="mt-3 rounded-xl p-4"
          style={{ background: 'rgba(212,160,23,0.05)', border: '1px solid rgba(212,160,23,0.2)' }}>
          <p className="text-xs font-medium mb-1" style={{ color: '#f0c040' }}>일지 (日支) — 나의 생명력</p>
          {(() => {
            const dayBranch = dayPillar.branch;
            // 일지는 일간 자신의 지지이므로 특별히 설명
            return (
              <p className="text-xs leading-relaxed" style={{ color: '#94a3b8' }}>
                일지 <strong style={{ color: '#f0c040' }}>{dayBranch}</strong>는 나의 내면과 배우자 자리를 상징합니다.
                일주 <strong style={{ color: '#f0c040' }}>{result.dayPillar.ganjiKor}</strong>의 지장간에는{' '}
                {result.dayPillar.hiddenStems.join(', ')} 기운이 숨어 있습니다.
              </p>
            );
          })()}
        </div>
      </div>

      {/* 십성 전체 안내 */}
      <div className="mt-4 rounded-xl p-4" style={{ background: 'rgba(26,37,64,0.4)', border: '1px solid rgba(212,160,23,0.1)' }}>
        <p className="text-xs font-medium mb-3" style={{ color: '#94a3b8' }}>십성 의미 간단 정리</p>
        <div className="grid grid-cols-2 gap-1">
          {Object.entries(TENGOD_COLORS).map(([name, color]) => (
            <div key={name} className="flex items-center gap-1 text-xs">
              <span style={{ color }}>●</span>
              <span style={{ color }}>{name}</span>
            </div>
          ))}
        </div>
        <p className="text-xs mt-3" style={{ color: '#475569' }}>
          비견·겁재(동류) → 식신·상관(내가 낳음) → 편재·정재(내가 극함) → 편관·정관(나를 극함) → 편인·정인(나를 낳음)
        </p>
      </div>
    </div>
  );
}
