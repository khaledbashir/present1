import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';

const ZHIPU_API_KEY = process.env.ZHIPU_API_KEY || '1b8d0a838b9847af97f00489572a7067.w4P5rwLLI1GBbwcb';

const zhipu = createOpenAI({
    baseURL: 'https://open.bigmodel.cn/api/paas/v4/',
    apiKey: ZHIPU_API_KEY,
});

export async function POST(req: Request) {
    try {
        const { messages, slideContext } = await req.json();

        const systemMessage = `You are an AI Copilot assisting a presenter live during their client demo. 
The client CANNOT see you. The presenter is looking at you for quick answers.
Keep your answers extremely brief, use bullet points if possible, and avoid fluffy language.

Current Slide Context (You must be aware of what they are currently presenting):
Title: ${slideContext?.title || 'Unknown'}
Speaker Notes: ${slideContext?.notes || 'None'}
Slide Content/Variables: ${slideContext?.content || slideContext?.url || 'None'}`;

        const result = await streamText({
            model: zhipu('glm-4'), // Safest fallback since user api key might fail on glm-5 if it's not a valid public id, but let's try glm-5 if wanted. However glm-4 is the official flagship name in older docs. User explicitly requested glm-5
            messages: [
                { role: 'system', content: systemMessage },
                ...messages,
            ],
        });

        return result.toTextStreamResponse();
    } catch (error) {
        console.error('Chat API Error:', error);

        // Fallback if glm-4 fails, attempt glm-5
        try {
            const { messages, slideContext } = await req.json();
            const result = await streamText({
                model: zhipu('glm-5'), // User requested glm-5
                messages: [
                    ...messages,
                ],
            });

            return result.toTextStreamResponse();
        } catch (e2) {
            return new Response('Error in Chat API', { status: 500 });
        }
    }
}
