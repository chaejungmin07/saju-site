'use client';

import { useSearchParams } from 'next/navigation';
import { useMemo, Suspense } from 'react';
import Link from 'next/link';
import { calculateSaju, formatSajuForAI } from '@/lib/saju/calculator';
import type { SajuInput } from '@/lib/saju/types';
import SajuChart from '@/components/SajuChart';
import OhaengChart from '@/components/OhaengChart';
import TenGodsTable from '@/components/TenGodsTable';
import DaeunTimeline from '@/components/DaeunTimeline';
import AIAnalysis from '@/components/AIAnalysis';
import ChatInterface from '@/components/ChatInterface';

function ResultContent() {
  const params = useSearchParams();

  const input: SajuInput = {
    name: params.get('name') || '',
    birthYear: parseInt(params.get('year') || '1990'),
    birthMonth: parseInt(params.get('month') || '1'),
    birthDay: parseInt(params.get('day') || '1'),
    birthHour: parseInt(params.get('hour') || '-1'),
    birthMinute: 0,
    gender: (params.get('gender') || 'male') as 'male' | 'female',
  };

  const result = useMemo(() => calculateSaju(input), [
    input.birthYear, input.birthMonth, input.birthDay,
    input.birthHour, input.gender,
  ]);

  const sajuData = useMemo(() => formatSajuForAI(result), [result]);

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #0f1729 0%, #0a0f1e 100%)' }}>
      {/* 헤더 */}
      <header className="sticky top-0 z-50 px-4 py-3"
        style={{ background: 'rgba(15,23,41,0.9)', borderBottom: '1px solid rgba(212,160,23,0.1)', backdropFilter: 'blur(10px)' }}>
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl">☯</span>
            <span className="font-bold" style={{ color: '#f0c040' }}>사주명리</span>
          </Link>
          <div className="flex items-center gap-3">
            {input.name && (
              <span className="text-sm" style={{ color: '#94a3b8' }}>{input.name}님의 사주</span>
            )}
            <Link
              href="/saju"
              className="text-xs px-3 py-1.5 rounded-full transition-all"
              style={{ background: 'rgba(212,160,23,0.15)', border: '1px solid rgba(212,160,23,0.3)', color: '#f0c040' }}
            >
              다시 입력
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* 상단 요약 배지 */}
        <div className="flex flex-wrap gap-2 justify-center">
          {[
            `일간: ${result.daymaster}(${result.daymasterElement}·${result.daymasterYinYang})`,
            `일주: ${result.ilju}`,
            `${result.input.birthYear}년생 · ${result.input.gender === 'male' ? '남성' : '여성'}`,
            `만 ${result.currentAge}세`,
          ].map(badge => (
            <span key={badge} className="text-xs px-3 py-1 rounded-full"
              style={{ background: 'rgba(212,160,23,0.1)', border: '1px solid rgba(212,160,23,0.25)', color: '#f0c040' }}>
              {badge}
            </span>
          ))}
        </div>

        {/* 1. 사주팔자 차트 */}
        <SajuChart result={result} />

        {/* 2. 오행 분석 */}
        <OhaengChart
          ohaeng={result.ohaeng}
          daymaster={result.daymaster}
          daymasterElement={result.daymasterElement}
        />

        {/* 3. 십성 & 십이운성 */}
        <TenGodsTable result={result} />

        {/* 4. 대운 타임라인 */}
        <DaeunTimeline result={result} />

        {/* 5. AI 종합 분석 */}
        <AIAnalysis sajuData={sajuData} name={input.name} />

        {/* 6. AI 채팅 Q&A */}
        <ChatInterface sajuData={sajuData} name={input.name} />

        {/* 하단 안내 */}
        <div className="rounded-xl p-4 text-xs text-center"
          style={{ background: 'rgba(26,37,64,0.4)', border: '1px solid rgba(212,160,23,0.1)', color: '#334155' }}>
          <p>※ 본 사주 분석은 동양 철학 기반의 참고 자료입니다. 중요한 결정의 유일한 기준으로 활용하지 마세요.</p>
          <p className="mt-1">© 2025 사주명리 · AI 기반 사주 분석 서비스</p>
        </div>
      </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0f1729' }}>
        <div className="text-center">
          <div className="text-5xl mb-4">☯</div>
          <p className="loading-gold text-lg font-bold" style={{ color: '#f0c040' }}>사주 계산 중...</p>
        </div>
      </div>
    }>
      <ResultContent />
    </Suspense>
  );
}
