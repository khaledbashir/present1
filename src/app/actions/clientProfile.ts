'use server';

import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

const SERPER_API_KEY = process.env.SERPER_API_KEY || 'c6fa01a9e3f82dea3113ac50dcb3fea0e34617c4';
// User provided: 1b8d0a838b9847af97f00489572a7067.w4P5rwLLI1GBbwcb
const ZHIPU_API_KEY = process.env.ZHIPU_API_KEY || '1b8d0a838b9847af97f00489572a7067.w4P5rwLLI1GBbwcb';

const zhipu = createOpenAI({
    baseURL: 'https://open.bigmodel.cn/api/paas/v4/',
    apiKey: ZHIPU_API_KEY,
});

export interface ClientProfileData {
    name: string;
    description: string;
    domain: string;
    logoUrl?: string;
}

export async function generateClientProfile(query: string): Promise<ClientProfileData> {
    let searchData;
    try {
        const searchRes = await fetch('https://google.serper.dev/search', {
            method: 'POST',
            headers: {
                'X-API-KEY': SERPER_API_KEY,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ q: query }),
        });
        searchData = await searchRes.json();
    } catch (err) {
        console.error('Serper search failed:', err);
        throw new Error('Failed to search for client information.');
    }

    const organic = searchData.organic || [];
    const snippets = organic
        .slice(0, 5)
        .map((r: any) => `Title: ${r.title}\nSnippet: ${r.snippet}\nLink: ${r.link}`)
        .join('\n\n');

    const prompt = `
Extract the primary company information from the following search results about "${query}".
Return ONLY a raw JSON object string with no markdown formatting or backticks.
The JSON object must have these exactly 3 keys:
- "name": The exact name of the company.
- "description": A concise, 1-2 sentence professional description of what they do.
- "domain": Their primary website domain (e.g., example.com) without https:// or www.

Search Results:
${snippets}
`;

    let profileText = '';
    try {
        const { text } = await generateText({
            model: zhipu('glm-5'),
            prompt,
        });
        profileText = text;
    } catch (err) {
        console.warn('glm-5 failed, falling back to glm-4', err);
        const { text } = await generateText({
            model: zhipu('glm-4'),
            prompt,
        });
        profileText = text;
    }

    let profileObject: { name: string; description: string; domain: string };
    try {
        // Clean up potential markdown code blocks if the model ignores our instruction
        const cleaned = profileText.replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
        profileObject = JSON.parse(cleaned);
    } catch (err) {
        console.error('Failed to parse Zhipu response:', profileText);
        throw new Error('Failed to parse AI response.');
    }

    let logoUrl = `https://logo.clearbit.com/${profileObject.domain}`;

    // Attempt to find a higher quality or verified logo if Clearbit is missing, using Serper Image search
    try {
        const imgSearchRes = await fetch('https://google.serper.dev/images', {
            method: 'POST',
            headers: {
                'X-API-KEY': SERPER_API_KEY,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ q: `${profileObject.name} official logo transparent background high resolution` }),
        });
        const imgData = await imgSearchRes.json();
        if (imgData.images && imgData.images.length > 0) {
            // Clearbit is usually better for pure icons, but Serper yields actual images. We'll default to Clearbit 
            // but if we want we can use Serper's first result as fallback or primary. Let's use Serper.
            logoUrl = imgData.images[0].imageUrl;
        }
    } catch (e) {
        // ignore image search errors and fallback to clearbit
        console.warn('Image search failed, using clearbit fallback.');
    }

    return {
        ...profileObject,
        logoUrl,
    };
}
