import Groq from 'groq-sdk';
import { NextRequest } from 'next/server';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || 'placeholder' });

export async function POST(req: NextRequest) {
  const { messages, sajuData, name } = await req.json();

  const systemPrompt = `당신은 수십 년 경력의 대한민국 최고 사주명리 전문가입니다.
아래는 지금 상담 중인 분의 사주 데이터입니다:
${name ? `이름/닉네임: ${name}` : ''}

${sajuData}

이 사주 데이터를 완전히 숙지하고, 모든 질문에 이 사람의 사주를 기반으로 구체적으로 답변해 주세요.
전문적이지만 친근하게, 반드시 한국어로 답변하세요.`;

  try {
    const stream = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.map((m: { role: string; content: string }) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })),
      ],
      max_tokens: 1500,
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
