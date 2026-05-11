'use client';

import { useState, useEffect } from 'react';

interface Props {
  sajuData: string;
  name?: string;
}

function parseMarkdown(text: string): string {
  return text
    .replace(/## (.+)/g, '<h2>$1</h2>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br/>');
}

export default function AIAnalysis({ sajuData, name }: Props) {
  const [analysis, setAnalysis] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [error, setError] = useState('');

  async function startAnalysis() {
    setIsLoading(true);
    setHasStarted(true);
    setError('');
    setAnalysis('');

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sajuData, name }),
      });

      if (!res.ok) throw new Error('API 오류');

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setAnalysis(accumulated);
      }
    } catch {
      setError('GEMINI_API_KEY를 Vercel 환경변수에 설정해주세요. (무료 발급: aistudio.google.com)');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="saju-card p-6">
      <h2 className="text-lg font-bold mb-1" style={{ color: '#f0c040' }}>
        🤖 AI 종합 분석
      </h2>
      <p className="text-xs mb-5" style={{ color: '#475569' }}>
        전문 사주명리 AI가 성격·직업·재물·연애·건강·대운을 종합 분석합니다
      </p>

      {!hasStarted ? (
        <div className="text-center py-8">
          <div className="text-5xl mb-4">🔮</div>
          <p className="text-sm mb-6" style={{ color: '#94a3b8' }}>
            AI가 당신의 사주 데이터를 바탕으로<br />
            심층 분석 리포트를 작성합니다.<br />
            <span style={{ color: '#64748b' }}>(약 30초~1분 소요)</span>
          </p>
          <button
            onClick={startAnalysis}
            className="px-8 py-3 rounded-xl font-bold transition-all hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #d4a017, #f0c040)',
              color: '#0f1729',
              boxShadow: '0 0 20px rgba(212,160,23,0.3)',
            }}
          >
            AI 분석 시작하기 →
          </button>
        </div>
      ) : error ? (
        <div className="rounded-xl p-4" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
          <p className="text-sm font-medium mb-2" style={{ color: '#f87171' }}>⚠️ API 키 필요</p>
          <p className="text-xs" style={{ color: '#94a3b8' }}>{error}</p>
          <div className="mt-3 p-3 rounded-lg text-xs font-mono"
            style={{ background: 'rgba(15,23,41,0.8)', color: '#4ade80' }}>
            # Vercel 환경변수에 추가<br />
            GEMINI_API_KEY=AIzaSy...
          </div>
          <button
            onClick={startAnalysis}
            className="mt-3 px-4 py-2 rounded-lg text-sm"
            style={{ background: 'rgba(212,160,23,0.2)', border: '1px solid rgba(212,160,23,0.4)', color: '#f0c040' }}
          >
            다시 시도
          </button>
        </div>
      ) : (
        <div>
          {isLoading && !analysis && (
            <div className="flex items-center gap-3 py-4">
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <div key={i} className="w-2 h-2 rounded-full loading-gold"
                    style={{ background: '#f0c040', animationDelay: `${i * 0.2}s` }} />
                ))}
              </div>
              <p className="text-sm loading-gold" style={{ color: '#f0c040' }}>
                AI가 사주를 분석하고 있습니다...
              </p>
            </div>
          )}
          <div
            className="prose-saju"
            dangerouslySetInnerHTML={{
              __html: `<p>${parseMarkdown(analysis)}</p>`,
            }}
          />
          {isLoading && analysis && (
            <span className="inline-flex gap-1 ml-1">
              {[0, 1, 2].map(i => (
                <span key={i} className="loading-gold" style={{ color: '#f0c040', animationDelay: `${i * 0.2}s` }}>●</span>
              ))}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
