import { AIOrchestrator } from '@/services/ai.service';

export async function POST(req: Request) {
  const { prompt } = await req.json();
  
  try {
    const result = await AIOrchestrator.generateThesisChapter(prompt);
    return result.toDataStreamResponse();
  } catch (error) {
    return new Response(JSON.stringify({ error: "AI Service Down" }), { status: 500 });
  }
}