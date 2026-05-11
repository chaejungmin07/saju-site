'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const HOURS = [
  { value: -1, label: '모름 (시간 미상)' },
  { value: 23, label: '자시 (子時) 23:00 ~ 01:00' },
  { value: 1,  label: '축시 (丑時) 01:00 ~ 03:00' },
  { value: 3,  label: '인시 (寅時) 03:00 ~ 05:00' },
  { value: 5,  label: '묘시 (卯時) 05:00 ~ 07:00' },
  { value: 7,  label: '진시 (辰時) 07:00 ~ 09:00' },
  { value: 9,  label: '사시 (巳時) 09:00 ~ 11:00' },
  { value: 11, label: '오시 (午時) 11:00 ~ 13:00' },
  { value: 13, label: '미시 (未時) 13:00 ~ 15:00' },
  { value: 15, label: '신시 (申時) 15:00 ~ 17:00' },
  { value: 17, label: '유시 (酉時) 17:00 ~ 19:00' },
  { value: 19, label: '술시 (戌時) 19:00 ~ 21:00' },
  { value: 21, label: '해시 (亥時) 21:00 ~ 23:00' },
];

export default function SajuPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    birthYear: '',
    birthMonth: '',
    birthDay: '',
    birthHour: -1,
    gender: '',
  });
  const [error, setError] = useState('');

  const currentYear = new Date().getFullYear();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const y = parseInt(form.birthYear);
    const m = parseInt(form.birthMonth);
    const d = parseInt(form.birthDay);

    if (!y || y < 1900 || y > currentYear) {
      setError('올바른 출생연도를 입력해주세요 (1900~현재)');
      return;
    }
    if (!m || m < 1 || m > 12) {
      setError('올바른 월을 입력해주세요 (1~12)');
      return;
    }
    if (!d || d < 1 || d > 31) {
      setError('올바른 일을 입력해주세요 (1~31)');
      return;
    }
    if (!form.gender) {
      setError('성별을 선택해주세요');
      return;
    }

    const params = new URLSearchParams({
      name: form.name,
      year: String(y),
      month: String(m),
      day: String(d),
      hour: String(form.birthHour),
      gender: form.gender,
    });
    router.push(`/result?${params.toString()}`);
  }

  return (
    <div className="min-h-screen px-4 py-12" style={{ background: 'linear-gradient(180deg, #0f1729 0%, #0a0f1e 100%)' }}>
      {/* 헤더 */}
      <div className="max-w-lg mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 mb-8 text-sm transition-colors hover:opacity-80"
          style={{ color: '#94a3b8' }}>
          ← 홈으로
        </Link>

        <div className="text-center mb-8">
          <div className="text-5xl mb-3">☯</div>
          <h1 className="text-3xl font-black mb-2">
            <span className="gold-gradient">사주 정보 입력</span>
          </h1>
          <p className="text-sm" style={{ color: '#64748b' }}>
            정확한 분석을 위해 태어난 시간까지 입력해주세요
          </p>
        </div>

        <form onSubmit={handleSubmit} className="saju-card p-6 space-y-6">
          {/* 이름 */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#94a3b8' }}>
              이름 또는 닉네임 <span className="text-xs" style={{ color: '#475569' }}>(선택)</span>
            </label>
            <input
              type="text"
              placeholder="예: 홍길동"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
              style={{
                background: 'rgba(15,23,41,0.8)',
                border: '1px solid rgba(212,160,23,0.2)',
                color: '#e2e8f0',
              }}
              onFocus={e => e.target.style.borderColor = 'rgba(212,160,23,0.6)'}
              onBlur={e => e.target.style.borderColor = 'rgba(212,160,23,0.2)'}
            />
          </div>

          {/* 생년월일 */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#94a3b8' }}>
              생년월일 <span style={{ color: '#f0c040' }}>*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <input
                  type="number"
                  placeholder="년 (예: 1990)"
                  value={form.birthYear}
                  onChange={e => setForm({ ...form, birthYear: e.target.value })}
                  min="1900"
                  max={currentYear}
                  className="w-full px-3 py-3 rounded-xl text-sm outline-none"
                  style={{
                    background: 'rgba(15,23,41,0.8)',
                    border: '1px solid rgba(212,160,23,0.2)',
                    color: '#e2e8f0',
                  }}
                  onFocus={e => e.target.style.borderColor = 'rgba(212,160,23,0.6)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(212,160,23,0.2)'}
                />
                <p className="text-xs mt-1 text-center" style={{ color: '#475569' }}>년도</p>
              </div>
              <div>
                <input
                  type="number"
                  placeholder="월"
                  value={form.birthMonth}
                  onChange={e => setForm({ ...form, birthMonth: e.target.value })}
                  min="1"
                  max="12"
                  className="w-full px-3 py-3 rounded-xl text-sm outline-none"
                  style={{
                    background: 'rgba(15,23,41,0.8)',
                    border: '1px solid rgba(212,160,23,0.2)',
                    color: '#e2e8f0',
                  }}
                  onFocus={e => e.target.style.borderColor = 'rgba(212,160,23,0.6)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(212,160,23,0.2)'}
                />
                <p className="text-xs mt-1 text-center" style={{ color: '#475569' }}>월</p>
              </div>
              <div>
                <input
                  type="number"
                  placeholder="일"
                  value={form.birthDay}
                  onChange={e => setForm({ ...form, birthDay: e.target.value })}
                  min="1"
                  max="31"
                  className="w-full px-3 py-3 rounded-xl text-sm outline-none"
                  style={{
                    background: 'rgba(15,23,41,0.8)',
                    border: '1px solid rgba(212,160,23,0.2)',
                    color: '#e2e8f0',
                  }}
                  onFocus={e => e.target.style.borderColor = 'rgba(212,160,23,0.6)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(212,160,23,0.2)'}
                />
                <p className="text-xs mt-1 text-center" style={{ color: '#475569' }}>일</p>
              </div>
            </div>
            <p className="text-xs mt-2" style={{ color: '#475569' }}>
              ※ 양력(陽曆) 기준입니다
            </p>
          </div>

          {/* 태어난 시간 */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#94a3b8' }}>
              태어난 시간 <span style={{ color: '#f0c040' }}>*</span>
            </label>
            <select
              value={form.birthHour}
              onChange={e => setForm({ ...form, birthHour: parseInt(e.target.value) })}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none appearance-none cursor-pointer"
              style={{
                background: 'rgba(15,23,41,0.8)',
                border: '1px solid rgba(212,160,23,0.2)',
                color: form.birthHour === -1 ? '#475569' : '#e2e8f0',
              }}
            >
              {HOURS.map(h => (
                <option key={h.value} value={h.value} style={{ background: '#0f1729' }}>
                  {h.label}
                </option>
              ))}
            </select>
            <p className="text-xs mt-2" style={{ color: '#475569' }}>
              ※ 시간을 알면 더 정확한 분석이 가능합니다. 특히 시주(時柱)와 대운 계산에 영향을 줍니다.
            </p>
          </div>

          {/* 성별 */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#94a3b8' }}>
              성별 <span style={{ color: '#f0c040' }}>*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'male', label: '남성 (男)', icon: '♂' },
                { value: 'female', label: '여성 (女)', icon: '♀' },
              ].map(g => (
                <button
                  key={g.value}
                  type="button"
                  onClick={() => setForm({ ...form, gender: g.value })}
                  className="py-3 rounded-xl text-sm font-medium transition-all"
                  style={{
                    background: form.gender === g.value ? 'rgba(212,160,23,0.2)' : 'rgba(15,23,41,0.8)',
                    border: `2px solid ${form.gender === g.value ? '#f0c040' : 'rgba(212,160,23,0.2)'}`,
                    color: form.gender === g.value ? '#f0c040' : '#94a3b8',
                  }}
                >
                  <span className="text-lg mr-1">{g.icon}</span> {g.label}
                </button>
              ))}
            </div>
            <p className="text-xs mt-2" style={{ color: '#475569' }}>
              ※ 성별은 대운(大運) 방향 계산에 필요합니다
            </p>
          </div>

          {error && (
            <div className="px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}>
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-4 rounded-xl font-bold text-base transition-all hover:scale-[1.02] hover:shadow-xl"
            style={{
              background: 'linear-gradient(135deg, #d4a017, #f0c040)',
              color: '#0f1729',
              boxShadow: '0 0 30px rgba(212,160,23,0.2)',
            }}
          >
            사주 분석 시작 →
          </button>

          <p className="text-xs text-center" style={{ color: '#334155' }}>
            입력하신 정보는 분석 목적으로만 사용되며 저장되지 않습니다
          </p>
        </form>

        {/* 절기 안내 */}
        <div className="mt-4 p-4 rounded-xl text-xs leading-relaxed" style={{ background: 'rgba(26,37,64,0.4)', border: '1px solid rgba(212,160,23,0.1)', color: '#64748b' }}>
          <p className="font-medium mb-1" style={{ color: '#94a3b8' }}>📌 사주 계산 기준</p>
          <p>• 연주(年柱)는 <strong style={{ color: '#fbbf24' }}>입춘(立春, 2월 4일경)</strong>을 기준으로 바뀝니다. 1~2월 초 출생자는 전년도 연주가 적용될 수 있습니다.</p>
          <p className="mt-1">• 월주(月柱)는 양력 달이 아닌 <strong style={{ color: '#fbbf24' }}>24절기</strong>를 기준으로 합니다.</p>
        </div>
      </div>
    </div>
  );
}
