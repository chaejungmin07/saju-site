'use client';

import type { SajuResult } from '@/lib/saju/types';
import { ELEMENT_BG_COLORS } from '@/lib/saju/constants';

interface Props {
  result: SajuResult;
}

const PILLAR_LABELS = ['연주 (年柱)', '월주 (月柱)', '일주 (日柱)', '시주 (時柱)'];
const PILLAR_SUBLABELS = ['출생 연도', '출생 월', '나 자신', '출생 시간'];

function ElementTag({ element, yinYang }: { element: string; yinYang: '양' | '음' }) {
  const colors: Record<string, string> = {
    목: '#4ade80', 화: '#f87171', 토: '#fbbf24', 금: '#94a3b8', 수: '#60a5fa',
  };
  return (
    <span className="text-xs px-1.5 py-0.5 rounded-full"
      style={{ background: `${colors[element]}20`, color: colors[element], border: `1px solid ${colors[element]}40` }}>
      {element}·{yinYang}
    </span>
  );
}

function PillarBox({ pillar, label, subLabel, isDay }: {
  pillar: SajuResult['yearPillar'];
  label: string;
  subLabel: string;
  isDay?: boolean;
}) {
  const stemBg = ELEMENT_BG_COLORS[pillar.stemElement];
  const branchBg = ELEMENT_BG_COLORS[pillar.branchElement];
  const stemColors: Record<string, string> = {
    목: '#4ade80', 화: '#f87171', 토: '#fbbf24', 금: '#c0cfe0', 수: '#60a5fa',
  };
  const stemColor = stemColors[pillar.stemElement];
  const branchColor = stemColors[pillar.branchElement];

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="text-xs font-medium mb-1 text-center" style={{ color: '#64748b' }}>
        <span style={{ color: isDay ? '#f0c040' : 'inherit' }}>{label}</span>
        <br /><span className="text-xs opacity-60">{subLabel}</span>
      </div>

      {/* 천간 */}
      <div className="w-20 h-20 rounded-xl flex flex-col items-center justify-center relative pillar-box"
        style={{
          background: `${stemBg}`,
          borderColor: stemColor,
          boxShadow: isDay ? `0 0 20px ${stemColor}50` : 'none',
        }}>
        {isDay && (
          <div className="absolute -top-2 -right-2 text-xs px-1.5 py-0.5 rounded-full font-bold"
            style={{ background: '#f0c040', color: '#0f1729' }}>일간</div>
        )}
        <div className="text-3xl font-black leading-none" style={{ color: stemColor }}>
          {pillar.stem}
        </div>
        <div className="text-xs mt-1 font-medium" style={{ color: `${stemColor}90` }}>
          천간(天干)
        </div>
        <div className="flex items-center gap-1 mt-1">
          <ElementTag element={pillar.stemElement} yinYang={pillar.stemYinYang} />
        </div>
      </div>

      {/* 연결선 */}
      <div className="w-0.5 h-3" style={{ background: 'rgba(212,160,23,0.3)' }} />

      {/* 지지 */}
      <div className="w-20 h-20 rounded-xl flex flex-col items-center justify-center pillar-box"
        style={{
          background: `${branchBg}`,
          borderColor: branchColor,
        }}>
        <div className="text-3xl font-black leading-none" style={{ color: branchColor }}>
          {pillar.branch}
        </div>
        <div className="text-xs mt-1 font-medium" style={{ color: `${branchColor}90` }}>
          지지(地支)
        </div>
        <div className="flex items-center gap-1 mt-1">
          <ElementTag element={pillar.branchElement} yinYang={pillar.branchYinYang} />
        </div>
      </div>

      {/* 지장간 */}
      <div className="w-20 rounded-lg px-2 py-2"
        style={{ background: 'rgba(26,37,64,0.6)', border: '1px solid rgba(212,160,23,0.15)' }}>
        <p className="text-xs text-center mb-1" style={{ color: '#475569' }}>지장간</p>
        <div className="flex flex-wrap justify-center gap-1">
          {pillar.hiddenStems.map((hs, i) => (
            <span key={i} className="text-xs font-bold" style={{ color: '#94a3b8' }}>{hs}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SajuChart({ result }: Props) {
  const pillars = [result.yearPillar, result.monthPillar, result.dayPillar, result.hourPillar];

  return (
    <div className="saju-card p-6">
      <h2 className="text-lg font-bold mb-1" style={{ color: '#f0c040' }}>
        ☯ 사주팔자 (四柱八字)
      </h2>
      <p className="text-xs mb-6" style={{ color: '#475569' }}>
        {result.input.name ? `${result.input.name}님의 ` : ''}
        {result.input.birthYear}년 {result.input.birthMonth}월 {result.input.birthDay}일
        {result.input.birthHour >= 0 ? ` · ${result.input.birthHour}시` : ''}
        {' · '}{result.input.gender === 'male' ? '남성' : '여성'}
      </p>

      {/* 메인 차트 */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {pillars.map((p, i) => (
          <PillarBox
            key={i}
            pillar={p}
            label={PILLAR_LABELS[i]}
            subLabel={PILLAR_SUBLABELS[i]}
            isDay={i === 2}
          />
        ))}
      </div>

      {/* 일주 */}
      <div className="rounded-xl p-4 mb-4"
        style={{ background: 'rgba(212,160,23,0.08)', border: '1px solid rgba(212,160,23,0.25)' }}>
        <div className="flex items-center gap-3">
          <div>
            <span className="text-xs font-medium" style={{ color: '#f0c040' }}>일주 (日柱)</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-2xl font-black" style={{ color: '#f0c040' }}>
                {result.dayPillar.stem}{result.dayPillar.branch}
              </span>
              <div className="text-sm" style={{ color: '#94a3b8' }}>
                일주 · {result.daymasterElement}({result.daymasterYinYang}) 일간
              </div>
            </div>
          </div>
        </div>
        <p className="text-xs mt-2" style={{ color: '#64748b' }}>
          ※ 일간(日干)은 나 자신을 뜻하며, 사주 분석의 핵심 기준점입니다.
        </p>
      </div>

      {/* 세운 */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl p-3" style={{ background: 'rgba(26,37,64,0.6)', border: '1px solid rgba(212,160,23,0.15)' }}>
          <p className="text-xs font-medium mb-2" style={{ color: '#94a3b8' }}>
            세운 ({new Date().getFullYear()}년)
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xl font-black" style={{ color: '#60a5fa' }}>
              {result.seun.stem}{result.seun.branch}
            </span>
            <div>
              <div className="text-xs" style={{ color: '#64748b' }}>십성: <span style={{ color: '#f0c040' }}>{result.seunTenGod.name}</span></div>
              <div className="text-xs" style={{ color: '#64748b' }}>{result.seun.stemElement}·{result.seun.branchElement}</div>
            </div>
          </div>
        </div>
        <div className="rounded-xl p-3" style={{ background: 'rgba(26,37,64,0.6)', border: '1px solid rgba(212,160,23,0.15)' }}>
          <p className="text-xs font-medium mb-2" style={{ color: '#94a3b8' }}>현재 대운</p>
          {result.currentDaeun ? (
            <div className="flex items-center gap-2">
              <span className="text-xl font-black" style={{ color: '#fbbf24' }}>
                {result.currentDaeun.pillar.stem}{result.currentDaeun.pillar.branch}
              </span>
              <div>
                <div className="text-xs" style={{ color: '#64748b' }}>{result.currentDaeun.startAge}세~{result.currentDaeun.endAge}세</div>
                <div className="text-xs" style={{ color: '#64748b' }}>십성: <span style={{ color: '#f0c040' }}>{result.currentDaeun.tenGodOfStem.name}</span></div>
              </div>
            </div>
          ) : (
            <p className="text-xs" style={{ color: '#64748b' }}>대운 시작 전<br />(만 {result.daeunStartAge}세부터)</p>
          )}
        </div>
      </div>
    </div>
  );
}
