import Link from "next/link";

const features = [
  {
    icon: "☯",
    title: "사주팔자 정밀 계산",
    desc: "천간(天干)·지지(地支) 기반의 연·월·일·시주를 정확하게 계산합니다.",
  },
  {
    icon: "🔥",
    title: "오행 균형 분석",
    desc: "목·화·토·금·수의 균형 상태와 용신·기신을 분석합니다.",
  },
  {
    icon: "⭐",
    title: "십성·십이운성",
    desc: "비견, 겁재, 식신 등 십성과 장생~양 열두 단계의 기운을 파악합니다.",
  },
  {
    icon: "📅",
    title: "대운·세운 분석",
    desc: "10년 주기 대운과 올해의 세운이 당신의 사주에 어떤 영향을 주는지 봅니다.",
  },
  {
    icon: "🤖",
    title: "AI 종합 해석",
    desc: "사주 데이터를 바탕으로 AI가 성격·직업·재물·연애·건강을 상세히 분석합니다.",
  },
  {
    icon: "💬",
    title: "실시간 Q&A",
    desc: "궁금한 점은 채팅으로 바로 질문하세요. AI가 당신의 사주로 답변합니다.",
  },
];

const steps = [
  { num: "01", title: "정보 입력", desc: "생년월일, 태어난 시간, 성별을 입력합니다." },
  { num: "02", title: "사주 계산", desc: "만세력 기반으로 사주팔자를 정확히 계산합니다." },
  { num: "03", title: "AI 해석", desc: "전문 AI가 성격부터 운세까지 종합 분석합니다." },
  { num: "04", title: "Q&A 상담", desc: "채팅으로 궁금한 점을 자유롭게 물어봅니다." },
];

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #0f1729 0%, #0a0f1e 100%)' }}>
      {/* 별 배경 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white star"
            style={{
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* 헤더 */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-2xl">☯</span>
          <span className="font-bold text-lg" style={{ color: '#f0c040' }}>사주명리</span>
        </div>
        <Link
          href="/saju"
          className="px-4 py-2 rounded-full text-sm font-medium transition-all"
          style={{ background: 'rgba(212,160,23,0.15)', border: '1px solid rgba(212,160,23,0.4)', color: '#f0c040' }}
        >
          사주 보기
        </Link>
      </header>

      {/* 히어로 */}
      <section className="relative z-10 text-center px-6 pt-16 pb-20">
        <div className="inline-block px-4 py-1 rounded-full text-xs font-medium mb-6"
          style={{ background: 'rgba(212,160,23,0.15)', border: '1px solid rgba(212,160,23,0.3)', color: '#f0c040' }}>
          ✦ AI 기반 전문 사주 분석 ✦
        </div>
        <h1 className="text-5xl md:text-7xl font-black mb-4 leading-tight">
          <span className="gold-gradient">사주명리</span>
        </h1>
        <p className="text-xl md:text-2xl font-light mb-2" style={{ color: '#94a3b8' }}>
          四柱命理
        </p>
        <p className="text-base md:text-lg mt-6 mb-10 max-w-xl mx-auto leading-relaxed" style={{ color: '#94a3b8' }}>
          생년월일시로 읽는 당신의 사주팔자<br />
          천간·지지·오행·십성·대운·세운까지<br />
          <strong style={{ color: '#f0c040' }}>AI가 전문가 수준으로 분석</strong>해드립니다
        </p>
        <Link
          href="/saju"
          className="inline-block px-10 py-4 rounded-full text-lg font-bold transition-all hover:scale-105 hover:shadow-2xl"
          style={{
            background: 'linear-gradient(135deg, #d4a017, #f0c040)',
            color: '#0f1729',
            boxShadow: '0 0 40px rgba(212,160,23,0.3)',
          }}
        >
          지금 내 사주 보기 →
        </Link>
        <p className="text-xs mt-4" style={{ color: '#475569' }}>무료 · 회원가입 불필요</p>
      </section>

      {/* 기능 소개 */}
      <section className="relative z-10 px-6 py-16 max-w-6xl mx-auto">
        <h2 className="text-center text-2xl font-bold mb-3" style={{ color: '#f0c040' }}>주요 기능</h2>
        <p className="text-center text-sm mb-10" style={{ color: '#64748b' }}>전문 사주 분석의 모든 것</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => (
            <div key={f.title} className="saju-card p-5 hover:border-yellow-500/40 transition-all">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-bold text-base mb-2" style={{ color: '#e2e8f0' }}>{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#64748b' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 분석 항목 미리보기 */}
      <section className="relative z-10 px-6 py-16 max-w-4xl mx-auto">
        <h2 className="text-center text-2xl font-bold mb-3" style={{ color: '#f0c040' }}>분석 항목</h2>
        <p className="text-center text-sm mb-10" style={{ color: '#64748b' }}>이런 내용을 상세하게 알 수 있어요</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            '사주팔자 차트', '일주론 (나의 본질)', '오행 균형 분석',
            '십성 분석표', '십이운성', '지장간 분석',
            '대운 타임라인', '세운 (올해 운세)', 'AI 종합 해석',
            '성격·심리 분석', '직업·진로 분석', '재물·연애 분석',
          ].map((item) => (
            <div key={item} className="flex items-center gap-2 px-3 py-2 rounded-lg"
              style={{ background: 'rgba(26,37,64,0.6)', border: '1px solid rgba(212,160,23,0.15)' }}>
              <span style={{ color: '#f0c040' }}>✦</span>
              <span className="text-sm" style={{ color: '#cbd5e1' }}>{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 이용 방법 */}
      <section className="relative z-10 px-6 py-16 max-w-4xl mx-auto">
        <h2 className="text-center text-2xl font-bold mb-10" style={{ color: '#f0c040' }}>이용 방법</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <div key={s.num} className="text-center">
              <div className="text-3xl font-black mb-3" style={{ color: 'rgba(212,160,23,0.4)' }}>{s.num}</div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3"
                style={{ background: 'rgba(212,160,23,0.15)', border: '1px solid rgba(212,160,23,0.4)' }}>
                <span className="text-lg">
                  {['✍', '☯', '🤖', '💬'][i]}
                </span>
              </div>
              <h3 className="font-bold mb-1" style={{ color: '#e2e8f0' }}>{s.title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: '#64748b' }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 text-center px-6 py-20">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl font-bold mb-3" style={{ color: '#e2e8f0' }}>
            지금 바로 사주를 확인하세요
          </h2>
          <p className="text-sm mb-8" style={{ color: '#64748b' }}>
            생년월일과 태어난 시간만 있으면 됩니다
          </p>
          <Link
            href="/saju"
            className="inline-block px-10 py-4 rounded-full text-lg font-bold transition-all hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #d4a017, #f0c040)',
              color: '#0f1729',
              boxShadow: '0 0 40px rgba(212,160,23,0.3)',
            }}
          >
            무료로 사주 보기 →
          </Link>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="relative z-10 text-center px-6 py-8 border-t" style={{ borderColor: 'rgba(212,160,23,0.1)', color: '#334155' }}>
        <p className="text-sm">© 2025 사주명리 · AI 기반 사주 분석 서비스</p>
        <p className="text-xs mt-1">※ 사주 분석은 참고 자료로 활용하시기 바랍니다</p>
      </footer>
    </div>
  );
}
