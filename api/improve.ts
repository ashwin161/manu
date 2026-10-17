import { GoogleGenAI } from '@google/genai';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
  const { currentBody = '', action = 'formal', language = 'ta' } = body;

  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    try {
      const aiClient = new GoogleGenAI({
        apiKey,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
      });

      const instruction = action === 'formal'
        ? 'Elevate legal and administrative dignity.'
        : action === 'concise'
        ? 'Make concise while retaining all facts.'
        : 'Highlight urgency and risk to safety.';

      const prompt = `Refine this petition letter body.
Instruction: ${instruction}
Language: ${language === 'ta' ? 'Administrative Tamil' : 'Formal English'}

Original Body:
${currentBody}

Return only the improved body paragraph.`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      if (response.text) {
        return res.status(200).json({ status: 'success', refinedBody: response.text.trim() });
      }
    } catch (e) {
      console.error('Vercel improve error:', e);
    }
  }

  return res.status(200).json({ status: 'success', refinedBody: currentBody });
}
