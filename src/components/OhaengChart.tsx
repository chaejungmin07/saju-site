'use client';

import type { OhaengCount } from '@/lib/saju/types';

interface Props {
  ohaeng: OhaengCount;
  daymaster: string;
  daymasterElement: string;
}

const ELEMENT_INFO = {
  목: { color: '#4ade80', bg: '#166534', label: '목(木)', emoji: '🌳', traits: '성장·생명·인자함' },
  화: { color: '#f87171', bg: '#7f1d1d', label: '화(火)', emoji: '🔥', traits: '열정·예의·밝음' },
  토: { color: '#fbbf24', bg: '#78350f', label: '토(土)', emoji: '🏔', traits: '믿음·안정·포용' },
  금: { color: '#94a3b8', bg: '#334155', label: '금(金)', emoji: '⚔️', traits: '의리·결단·냉철' },
  수: { color: '#60a5fa', bg: '#1e3a5f', label: '수(水)', emoji: '💧', traits: '지혜·유연·잠재력' },
};

const ELEMENT_CYCLE = [
  { from: '목', to: '화', type: 'generate', label: '목생화' },
  { from: '화', to: '토', type: 'generate', label: '화생토' },
  { from: '토', to: '금', type: 'generate', label: '토생금' },
  { from: '금', to: '수', type: 'generate', label: '금생수' },
  { from: '수', to: '목', type: 'generate', label: '수생목' },
];

export default function OhaengChart({ ohaeng, daymaster, daymasterElement }: Props) {
  const elements = ['목', '화', '토', '금', '수'] as const;
  const total = elements.reduce((sum, el) => sum + ohaeng[el], 0);

  const maxVal = Math.max(...elements.map(el => ohaeng[el]));
  const sortedByCount = [...elements].sort((a, b) => ohaeng[b] - ohaeng[a]);
  const dominant = sortedByCount[0];
  const weakest = sortedByCount[sortedByCount.length - 1];

  // 상생상극 분석
  const generates = { 목: '화', 화: '토', 토: '금', 금: '수', 수: '목' } as Record<string, string>;
  const controls = { 목: '토', 화: '금', 토: '수', 금: '목', 수: '화' } as Record<string, string>;

  // 용신/기신 간단 판단 (일간 기준 강약)
  const dayEl = daymasterElement;
  const yongsin = ohaeng[dayEl as keyof OhaengCount] < 1.5 ? dayEl : controls[dayEl]; // 간단한 판단

  return (
    <div className="saju-card p-6">
      <h2 className="text-lg font-bold mb-1" style={{ color: '#f0c040' }}>
        🔥 오행 분석 (五行)
      </h2>
      <p className="text-xs mb-5" style={{ color: '#475569' }}>
        목·화·토·금·수 다섯 기운의 균형 상태
      </p>

      {/* 바 차트 */}
      <div className="space-y-3 mb-6">
        {elements.map(el => {
          const info = ELEMENT_INFO[el];
          const count = ohaeng[el];
          const pct = total > 0 ? (count / total) * 100 : 0;
          const isDaymaster = el === daymasterElement;

          return (
            <div key={el}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span>{info.emoji}</span>
                  <span className="text-sm font-medium" style={{ color: info.color }}>
                    {info.label}
                  </span>
                  {isDaymaster && (
                    <span className="text-xs px-1.5 rounded-full"
                      style={{ background: 'rgba(212,160,23,0.2)', color: '#f0c040', border: '1px solid rgba(212,160,23,0.4)' }}>
                      일간
                    </span>
                  )}
                  <span className="text-xs" style={{ color: '#475569' }}>{info.traits}</span>
                </div>
                <span className="text-sm font-bold" style={{ color: info.color }}>
                  {count.toFixed(1)}
                </span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(26,37,64,0.8)' }}>
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${(count / Math.max(maxVal, 1)) * 100}%`,
                    background: info.color,
                    boxShadow: isDaymaster ? `0 0 8px ${info.color}80` : 'none',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* 오행 요약 */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="rounded-xl p-3" style={{ background: 'rgba(26,37,64,0.6)', border: '1px solid rgba(212,160,23,0.15)' }}>
          <p className="text-xs mb-1" style={{ color: '#64748b' }}>가장 강한 오행</p>
          <div className="flex items-center gap-1">
            <span style={{ color: ELEMENT_INFO[dominant].color }}>●</span>
            <span className="font-bold" style={{ color: ELEMENT_INFO[dominant].color }}>
              {ELEMENT_INFO[dominant].label}
            </span>
            <span className="text-xs" style={{ color: '#64748b' }}>({ohaeng[dominant].toFixed(1)})</span>
          </div>
          <p className="text-xs mt-1" style={{ color: '#475569' }}>{ELEMENT_INFO[dominant].traits}</p>
        </div>
        <div className="rounded-xl p-3" style={{ background: 'rgba(26,37,64,0.6)', border: '1px solid rgba(212,160,23,0.15)' }}>
          <p className="text-xs mb-1" style={{ color: '#64748b' }}>가장 약한 오행</p>
          <div className="flex items-center gap-1">
            <span style={{ color: ELEMENT_INFO[weakest].color }}>●</span>
            <span className="font-bold" style={{ color: ELEMENT_INFO[weakest].color }}>
              {ELEMENT_INFO[weakest].label}
            </span>
            <span className="text-xs" style={{ color: '#64748b' }}>({ohaeng[weakest].toFixed(1)})</span>
          </div>
          <p className="text-xs mt-1" style={{ color: '#475569' }}>보완이 필요한 기운</p>
        </div>
      </div>

      {/* 상생상극 */}
      <div className="rounded-xl p-4" style={{ background: 'rgba(26,37,64,0.4)', border: '1px solid rgba(212,160,23,0.1)' }}>
        <p className="text-xs font-medium mb-3" style={{ color: '#94a3b8' }}>오행 상생 관계</p>
        <div className="flex items-center justify-around">
          {ELEMENT_CYCLE.map((c, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="flex items-center gap-1 text-xs">
                <span style={{ color: ELEMENT_INFO[c.from as keyof typeof ELEMENT_INFO].color }}>
                  {ELEMENT_INFO[c.from as keyof typeof ELEMENT_INFO].label.slice(0, 1)}
                </span>
                <span style={{ color: '#475569' }}>→</span>
                <span style={{ color: ELEMENT_INFO[c.to as keyof typeof ELEMENT_INFO].color }}>
                  {ELEMENT_INFO[c.to as keyof typeof ELEMENT_INFO].label.slice(0, 1)}
                </span>
              </div>
              <span className="text-xs mt-0.5" style={{ color: '#334155' }}>{c.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 오행 균형 조언 */}
      <div className="mt-4 rounded-xl p-4" style={{ background: 'rgba(212,160,23,0.05)', border: '1px solid rgba(212,160,23,0.15)' }}>
        <p className="text-xs font-medium mb-2" style={{ color: '#f0c040' }}>⚡ 오행 균형 분석</p>
        <p className="text-xs leading-relaxed" style={{ color: '#94a3b8' }}>
          일간(<strong style={{ color: '#f0c040' }}>{daymaster}</strong>)은{' '}
          <strong style={{ color: ELEMENT_INFO[dayEl as keyof typeof ELEMENT_INFO]?.color }}>
            {ELEMENT_INFO[dayEl as keyof typeof ELEMENT_INFO]?.label}
          </strong> 기운입니다.
          {ohaeng[dominant] > 3
            ? ` ${ELEMENT_INFO[dominant].label} 기운이 과다하여 균형을 맞추는 것이 중요합니다.`
            : ohaeng[weakest] < 0.5
            ? ` ${ELEMENT_INFO[weakest].label} 기운이 부족하여 이를 보완하면 도움이 됩니다.`
            : ' 오행이 비교적 고르게 분포되어 있어 안정적인 기운을 가지고 있습니다.'}
        </p>
      </div>
    </div>
  );
}
