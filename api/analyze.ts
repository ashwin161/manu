import { GoogleGenAI, Type } from '@google/genai';

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
  const { problemText = '', selectedDepartment = '', district = 'Madurai' } = body;

  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    try {
      const aiClient = new GoogleGenAI({
        apiKey,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
      });

      const prompt = `Analyze this citizen grievance in Tamil Nadu:
Problem Text: "${problemText}"
User's Selected Department: "${selectedDepartment || 'Unknown / Not Selected'}"
District: "${district}"

Determine:
1. One-line factual summary of the core issue.
2. The exact Government of Tamil Nadu department responsible.
3. The official designation of the competent receiving officer.
4. Whether the user's selected department is appropriate (true/false).
5. A polite, clear citizen explanation of why this authority is recommended.
6. Urgency level ("Normal", "High", "Immediate Public Hazard").
7. Any missing factual information.`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              identifiedProblem: { type: Type.STRING },
              category: { type: Type.STRING },
              locality: { type: Type.STRING },
              isAppropriate: { type: Type.BOOLEAN },
              recommendedDepartment: { type: Type.STRING },
              recommendedDesignation: { type: Type.STRING },
              reason: { type: Type.STRING },
              reasonTa: { type: Type.STRING },
              urgencyLevel: { type: Type.STRING },
              missingInformation: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ['identifiedProblem', 'category', 'isAppropriate', 'recommendedDepartment', 'recommendedDesignation', 'reason'],
          },
        },
      });

      if (response.text) {
        return res.status(200).json({ status: 'success', ...JSON.parse(response.text) });
      }
    } catch (e) {
      console.error('Vercel analyze error:', e);
    }
  }

  return res.status(200).json({
    status: 'success',
    identifiedProblem: problemText.slice(0, 100),
    category: 'Civic Grievance',
    locality: district,
    isAppropriate: false,
    recommendedDepartment: 'District Collectorate / Public Grievance Redressal Cell',
    recommendedDesignation: 'The District Collector',
    reason: 'Grievance will be directed to the District Collector Grievance Cell.',
    reasonTa: 'மனு மாவட்ட ஆட்சியர் மக்கள் குறைதீர்ப்பு பிரிவுக்கு பரிந்துரைக்கப்படுகிறது.',
    urgencyLevel: 'Normal',
    missingInformation: [],
  });
}
