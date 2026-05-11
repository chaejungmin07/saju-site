'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Props {
  sajuData: string;
  name?: string;
}

const QUICK_QUESTIONS = [
  '올해 재물운은 어떤가요?',
  '저에게 맞는 직업은 무엇인가요?',
  '연애운과 결혼 시기는?',
  '건강에서 주의할 점은?',
  '현재 대운이 저에게 좋은 시기인가요?',
  '성격의 장단점을 알려주세요',
];

export default function ChatInterface({ sajuData, name }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `안녕하세요${name ? `, ${name}님` : ''}! 사주 분석이 완료되었습니다. 궁금하신 점이 있으시면 무엇이든 질문해 주세요. 연애, 직업, 재물, 건강, 대운 등 어떤 것이든 상세하게 답변드리겠습니다. 😊`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function sendMessage(content: string) {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    const assistantMessage: Message = { role: 'assistant', content: '' };
    setMessages([...newMessages, assistantMessage]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          sajuData,
          name,
        }),
      });

      if (!res.ok) throw new Error('API 오류');

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: 'assistant', content: accumulated };
          return updated;
        });
      }
    } catch {
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: 'assistant',
          content: 'API 키가 설정되지 않았거나 오류가 발생했습니다. ANTHROPIC_API_KEY를 확인해주세요.',
        };
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  return (
    <div className="saju-card p-6">
      <h2 className="text-lg font-bold mb-1" style={{ color: '#f0c040' }}>
        💬 AI 사주 상담
      </h2>
      <p className="text-xs mb-4" style={{ color: '#475569' }}>
        당신의 사주를 기반으로 무엇이든 질문하세요
      </p>

      {/* 빠른 질문 */}
      <div className="flex flex-wrap gap-2 mb-4">
        {QUICK_QUESTIONS.map(q => (
          <button
            key={q}
            onClick={() => sendMessage(q)}
            disabled={isLoading}
            className="text-xs px-3 py-1.5 rounded-full transition-all hover:scale-105 disabled:opacity-50"
            style={{
              background: 'rgba(26,37,64,0.8)',
              border: '1px solid rgba(212,160,23,0.25)',
              color: '#94a3b8',
            }}
          >
            {q}
          </button>
        ))}
      </div>

      {/* 메시지 목록 */}
      <div className="rounded-xl p-4 mb-4 h-80 overflow-y-auto space-y-4"
        style={{ background: 'rgba(15,23,41,0.6)', border: '1px solid rgba(212,160,23,0.1)' }}>
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm mr-2 flex-shrink-0 mt-0.5"
                style={{ background: 'rgba(212,160,23,0.15)', border: '1px solid rgba(212,160,23,0.3)' }}>
                ☯
              </div>
            )}
            <div
              className={`max-w-[80%] px-4 py-3 text-sm leading-relaxed ${msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}`}
              style={{ color: '#e2e8f0', whiteSpace: 'pre-wrap' }}
            >
              {msg.content}
              {isLoading && i === messages.length - 1 && msg.role === 'assistant' && !msg.content && (
                <span className="inline-flex gap-1">
                  <span className="loading-gold">●</span>
                  <span className="loading-gold" style={{ animationDelay: '0.2s' }}>●</span>
                  <span className="loading-gold" style={{ animationDelay: '0.4s' }}>●</span>
                </span>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* 입력창 */}
      <div className="flex gap-2">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="질문을 입력하세요... (Enter로 전송, Shift+Enter로 줄바꿈)"
          disabled={isLoading}
          rows={2}
          className="flex-1 px-4 py-3 rounded-xl text-sm outline-none resize-none disabled:opacity-50"
          style={{
            background: 'rgba(15,23,41,0.8)',
            border: '1px solid rgba(212,160,23,0.2)',
            color: '#e2e8f0',
          }}
          onFocus={e => e.target.style.borderColor = 'rgba(212,160,23,0.6)'}
          onBlur={e => e.target.style.borderColor = 'rgba(212,160,23,0.2)'}
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || isLoading}
          className="px-4 rounded-xl font-bold text-sm transition-all disabled:opacity-40 hover:scale-105"
          style={{
            background: 'linear-gradient(135deg, #d4a017, #f0c040)',
            color: '#0f1729',
            minWidth: '60px',
          }}
        >
          전송
        </button>
      </div>
      <p className="text-xs mt-2" style={{ color: '#334155' }}>
        ※ Claude AI가 당신의 사주 데이터를 기반으로 답변합니다
      </p>
    </div>
  );
}
