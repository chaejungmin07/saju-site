import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  const { messages, sajuData, name } = await req.json();

  const systemInstruction = `당신은 수십 년 경력의 대한민국 최고 사주명리 전문가입니다.
아래는 지금 상담 중인 분의 사주 데이터입니다:
${name ? `이름/닉네임: ${name}` : ''}

${sajuData}

이 사주 데이터를 완전히 숙지하고, 모든 질문에 이 사람의 사주를 기반으로 구체적으로 답변해 주세요.
- 전문적이지만 친근하고 이해하기 쉽게 설명하세요
- 사주 데이터에 근거한 맞춤 답변을 해주세요
- 긍정적이면서도 현실적인 조언을 드리세요
- 필요하면 오행, 십성, 대운의 개념을 쉽게 설명해 주세요
- 반드시 한국어로 답변하세요`;

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction,
  });

  // Gemini 형식으로 대화 이력 변환
  const history = messages.slice(0, -1).map((m: { role: string; content: string }) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));
  const lastMessage = messages[messages.length - 1];

  const chat = model.startChat({ history });
  const result = await chat.sendMessageStream(lastMessage.content);

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of result.stream) {
        const text = chunk.text();
        if (text) controller.enqueue(encoder.encode(text));
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
