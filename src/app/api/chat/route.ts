import Anthropic from '@anthropic-ai/sdk';
import { NextRequest } from 'next/server';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const { messages, sajuData, name } = await req.json();

  const systemPrompt = `당신은 수십 년 경력의 대한민국 최고 사주명리 전문가입니다.
아래는 지금 상담 중인 분의 사주 데이터입니다:
${name ? `이름/닉네임: ${name}` : ''}

${sajuData}

이 사주 데이터를 완전히 숙지하고, 모든 질문에 이 사람의 사주를 기반으로 구체적으로 답변해 주세요.
- 전문적이지만 친근하고 이해하기 쉽게 설명하세요
- 사주 데이터에 근거한 맞춤 답변을 해주세요
- 긍정적이면서도 현실적인 조언을 드리세요
- 필요하면 오행, 십성, 대운의 개념을 쉽게 설명해 주세요
- 한국어로 답변하세요`;

  const stream = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1500,
    system: systemPrompt,
    messages: messages.map((m: { role: string; content: string }) => ({
      role: m.role,
      content: m.content,
    })),
    stream: true,
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const event of stream) {
        if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
          controller.enqueue(encoder.encode(event.delta.text));
        }
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
