import { NextRequest } from 'next/server';

export async function GET(_req: NextRequest) {
  const key = process.env.GROQ_API_KEY;
  return Response.json({
    keyExists: !!key,
    keyLength: key?.length ?? 0,
    keyPrefix: key ? key.substring(0, 10) : 'NOT FOUND',
  });
}
