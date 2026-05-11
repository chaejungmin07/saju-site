import Groq from 'groq-sdk';
import { NextRequest } from 'next/server';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || 'placeholder' });

export async function POST(req: NextRequest) {
  const { sajuData, name } = await req.json();

  const systemPrompt = `당신은 수십 년 경력의 대한민국 최고 사주명리 전문가입니다.
사주팔자, 천간지지, 오행, 십성, 십이운성, 대운, 세운에 대한 깊은 지식을 보유하고 있습니다.
전문적이지만 이해하기 쉬운 언어로 설명하고, 이 사람의 사주 데이터에 기반한 맞춤 분석을 해주세요.
반드시 한국어로 답변하세요.`;

  const userPrompt = `다음 사주 데이터를 분석해주세요.
${name ? `이름/닉네임: ${name}` : ''}

${sajuData}

아래 항목별로 상세하게 분석해주세요:

## 1. 일간(日干) 분석 — 나는 누구인가
## 2. 사주 전체 흐름 — 명(命)의 구조
## 3. 성격과 심리
## 4. 직업과 진로
## 5. 재물운과 경제
## 6. 연애와 결혼
## 7. 건강과 신체
## 8. 현재 대운·세운 분석
## 9. 조언과 개운법`;

  try {
    const stream = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 4000,
      stream: true,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content || '';
          if (text) controller.enqueue(encoder.encode(text));
        }
        controller.close();
      },
    });

    return new Response(readable, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
