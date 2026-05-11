import Anthropic from '@anthropic-ai/sdk';
import { NextRequest } from 'next/server';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const { sajuData, name } = await req.json();

  const systemPrompt = `당신은 수십 년 경력의 대한민국 최고 사주명리 전문가입니다.
사주팔자(四柱八字), 천간지지(天干地支), 오행(五行), 십성(十星), 십이운성(十二運星), 대운(大運), 세운(歲運)에 대한 깊은 지식을 보유하고 있습니다.
분석할 때는 전문적이지만 이해하기 쉬운 언어로 설명하세요. 긍정적인 면을 강조하되, 주의해야 할 점도 솔직하게 말씀해 주세요.
각 섹션은 구체적이고 디테일하게 작성해 주세요. 단순한 일반론이 아닌, 이 사람의 사주 데이터에 기반한 맞춤 분석을 해주세요.`;

  const userPrompt = `다음 사주 데이터를 분석해주세요.
${name ? `이름/닉네임: ${name}` : ''}

${sajuData}

아래 항목별로 상세하게 분석해주세요. 각 항목은 3~5문단으로 구체적으로 작성하세요:

## 1. 일간(日干) 분석 — 나는 누구인가
일간의 특성, 성격, 기질, 대인관계 스타일, 사고방식을 분석하세요.

## 2. 사주 전체 흐름 — 명(命)의 구조
8글자의 전체적인 기운, 강약, 오행 균형 상태, 용신(用神)과 기신(忌神)을 분석하세요.

## 3. 성격과 심리
오행과 십성에 기반한 성격의 강점과 약점, 내면의 욕구, 스트레스 패턴을 분석하세요.

## 4. 직업과 진로
적합한 직업군, 사업 vs 직장, 재능을 발휘할 수 있는 분야, 피해야 할 직종을 분석하세요.

## 5. 재물운과 경제
재물을 모으는 방식, 투자 성향, 재물운의 흐름, 돈을 다루는 방식을 분석하세요.

## 6. 연애와 결혼
이성관, 배우자 인연, 결혼 시기, 부부 관계의 특성을 분석하세요.

## 7. 건강과 신체
약한 오행과 연결된 건강 취약점, 주의할 신체 부위, 건강 관리 방법을 분석하세요.

## 8. 현재 대운·세운 분석
현재 흐르는 대운과 세운이 이 사람의 사주와 어떻게 작용하는지, 지금 어떤 시기인지 분석하세요.

## 9. 조언과 개운법
이 사주가 더 빛나기 위한 구체적인 조언, 보완해야 할 오행, 유리한 방향·색·숫자를 알려주세요.`;

  const stream = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4000,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
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
