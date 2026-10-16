import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Initialize Gemini SDK with User-Agent as instructed by Gemini API skill
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

/**
 * Full-Fledged AI Transformation Pipeline: /api/generate
 * Translates and transforms informal spoken Tanglish into official Tamil Nadu
 * Secretariat & District Collectorate compliant petitions (Tamil & English).
 */
app.post('/api/generate', async (req: Request, res: Response) => {
  const { 
    applicantName = 'K. Murugan', 
    applicantPhone = '9876543210', 
    applicantAddress = '14/2, 4th Cross Street, K.K. Nagar, Madurai - 625020', 
    department = 'TANGEDCO (Electricity & Grid Grievance)', 
    district = 'Madurai',
    tanglishInput = 'Madurai KK Nagar street light eriyala, transformer pakathula wire loose-aa irukku. 3 naala complaint panniyum aalu varala, accident aagidum bayama irukku...' 
  } = req.body || {};

  const randomRefNum = `SEC-TN-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  // If Gemini API is available, generate court-ready petition using gemini-3.8-flash
  if (aiClient) {
    try {
      const systemInstruction = `You are the official Chief Legal Draftsman and Tamil Nadu Secretariat Petition Drafter for the Government of Tamil Nadu (தமிழ்நாடு அரசு தலைமை மனு வரைவாளர்).
Your responsibility is to analyze informal spoken Tanglish (Tamil written in Latin script or colloquial Tamil mixed with English) and convert it into two court-ready, administrative grievance petitions:
1. Formal Tamil Nadu Administrative Petition (தமிழ்நாடு அரசு பொதுக் குறைதீர்ப்பு மனு) written in pure, dignified administrative Tamil following Tamil Nadu Secretariat Manual and District Collectorate standards.
2. Pristine Formal English Petition matching official Indian administrative correspondence standards.

Guidelines:
- Analyze the user's grievance facts, location, safety hazards, previous inaction, and remedy requested.
- Fix any factual ambiguities into formal legal administrative wording.
- Address the competent authority appropriately (e.g., உதவி செயற்பொறியாளர் / வட்டாட்சியர் / ஆணையாளர் / காவல் ஆய்வாளர்).
- Format the subject (பொருள்) with standard administrative keywords.
- Separate the body into background, current ground reality/hazard, and specific prayer/relief sought.`;

      const prompt = `Applicant Details:
- Name: ${applicantName}
- Phone: ${applicantPhone}
- Address: ${applicantAddress}
- District: ${district}
- Target Department: ${department}
- Reference ID: ${randomRefNum}

Citizen Grievance in Informal Tanglish:
"${tanglishInput}"

Generate the complete dual-language petition in the specified JSON structure.`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              department: { type: Type.STRING },
              tamilOutput: {
                type: Type.OBJECT,
                properties: {
                  header: { type: Type.STRING },
                  department: { type: Type.STRING },
                  recipient: { type: Type.STRING },
                  applicant: { type: Type.STRING },
                  subject: { type: Type.STRING },
                  reference: { type: Type.STRING },
                  body: { type: Type.STRING },
                  reliefRequested: { type: Type.STRING },
                  date: { type: Type.STRING },
                  place: { type: Type.STRING },
                  closing: { type: Type.STRING },
                },
                required: ['header', 'department', 'recipient', 'applicant', 'subject', 'body', 'date', 'place', 'closing'],
              },
              englishOutput: {
                type: Type.OBJECT,
                properties: {
                  header: { type: Type.STRING },
                  department: { type: Type.STRING },
                  recipient: { type: Type.STRING },
                  applicant: { type: Type.STRING },
                  subject: { type: Type.STRING },
                  reference: { type: Type.STRING },
                  body: { type: Type.STRING },
                  reliefRequested: { type: Type.STRING },
                  date: { type: Type.STRING },
                  place: { type: Type.STRING },
                  closing: { type: Type.STRING },
                },
                required: ['header', 'department', 'recipient', 'applicant', 'subject', 'body', 'date', 'place', 'closing'],
              },
            },
            required: ['department', 'tamilOutput', 'englishOutput'],
          },
        },
      });

      if (response.text) {
        const parsed = JSON.parse(response.text);
        return res.json({
          status: 'success',
          engine: 'gemini-3.8-flash',
          department: parsed.department || department,
          applicantName,
          tanglishInput,
          tamilOutput: {
            ...parsed.tamilOutput,
            reference: parsed.tamilOutput.reference || `மனு குறிப்பு எண்: ${randomRefNum}`,
          },
          englishOutput: {
            ...parsed.englishOutput,
            reference: parsed.englishOutput.reference || `Petition Ref: ${randomRefNum}`,
          },
        });
      }
    } catch (apiError) {
      console.error('Gemini API execution error, falling back to rule transformer:', apiError);
    }
  }

  // Resilient Domain-Specific Legal Drafting Fallback
  const cleanDistrict = district || 'Madurai';
  const todayTa = new Date().toLocaleDateString('ta-IN');
  const todayEn = new Date().toLocaleDateString('en-IN');

  return res.json({
    status: 'success',
    engine: 'tn-administrative-engine',
    department: department,
    applicantName,
    tanglishInput,
    tamilOutput: {
      header: 'தமிழ்நாடு அரசு பொதுக் குறைதீர்ப்பு மனு',
      department: `${department} • ${cleanDistrict} கோட்டம்`,
      recipient: `உயர்திரு உதவி செயற்பொறியாளர் / துறைத் தலைவர் அவர்கள்,\n${department},\n${cleanDistrict} வட்டம் & மாவட்டம்.`,
      applicant: `திரு/திருமதி ${applicantName},\n${applicantAddress}\nதொலைபேசி எண்: ${applicantPhone}`,
      subject: `பொருள்: ${department} சார்ந்த அவசர குறைதீர்ப்பு மற்றும் பொதுநலன் கருதி உடனடி சீரமைப்பு கோருதல் - தொடர்பாக.`,
      reference: `மனு குறிப்பு எண்: ${randomRefNum}`,
      body: `மதிப்பிற்குரிய ஐயா / அம்மா,\n\nவணக்கம். நான் மேற்கண்ட முகவரியில் பல ஆண்டுகளாக வசித்து வரும் தமிழ்நாடு குடிமகன் ஆவேன்.\n\nஎங்கள் பகுதியில் பொதுமக்களை பெரிதும் பாதிக்கும் கீழ்க்கண்ட குறைபாடு நீண்ட நாட்களாக தீர்க்கப்படாமல் உள்ளது:\n\n"${tanglishInput}"\n\nஇத்தகைய நிலைமையினால் பள்ளி செல்லும் சிறுவர்கள், முதியவர்கள் மற்றும் இப்பகுதி வழியே செல்லும் பாதசாரிகள் பெரும் அச்சத்துடனும் சிரமத்துடனும் வாழ வேண்டிய அவலநிலை ஏற்பட்டுள்ளது. இதுகுறித்து சம்பந்தப்பட்ட களப்பணியாளர்களிடம் பலமுறை வாய்மொழியாக முறையிட்டும் இதுவரை எவ்வித முன்னேற்றமும் ஏற்படவில்லை.\n\nஆகவே, பொதுமக்களின் பாதுகாப்பு, சுகாதாரம் மற்றும் நலனை முன்னிறுத்தி, தாங்கள் இவ்விவகாரத்தில் தனிப்பட்ட முறையில் தலையிட்டு, சம்பவ இடத்தை உடனடியாக ஆய்வு செய்து தகுந்த நிவாரணம் மற்றும் சீரமைப்புப் பணிகளை துரிதமாக மேற்கொள்ளுமாறு மிக பணிவுடன் வேண்டுகிறேன்.`,
      reliefRequested: 'சம்பவ இடத்தை நேரில் ஆய்வு செய்து, உரிய அலுவலர்கள் மூலம் பழுது மற்றும் குறைபாடுகளை 48 மணி நேரத்திற்குள் நீக்குதல்.',
      date: todayTa,
      place: cleanDistrict,
      closing: 'இப்படிக்கு தங்கள் உண்மையுள்ள,\n\n\n(மனுதாரர் கையொப்பம்)'
    },
    englishOutput: {
      header: 'GOVERNMENT OF TAMIL NADU - OFFICIAL GRIEVANCE PETITION',
      department: `${department} • ${cleanDistrict} Division`,
      recipient: `The Competent Officer / Executive Authority,\n${department},\n${cleanDistrict} Circle & District, Tamil Nadu.`,
      applicant: `${applicantName},\n${applicantAddress}\nContact Phone: ${applicantPhone}`,
      subject: `Subject: Urgent grievance redressal and corrective public service intervention regarding ${department} - Reg.`,
      reference: `Petition Ref: ${randomRefNum}`,
      body: `Respected Sir/Madam,\n\nI am a bonafide resident residing at the aforementioned residential address.\n\nI submit this formal administrative petition to draw your prompt attention to an ongoing issue in our locality:\n\n"${tanglishInput}"\n\nThis unresolved condition poses an ongoing hazard, public inconvenience, and potential disruption to daily life for local school children, senior citizens, and commuters. Despite earlier informal representations made to local maintenance personnel, no tangible corrective action has been initiated to date.\n\nIn the interest of public safety and statutory civic governance, I earnestly pray that your esteemed office conduct an immediate site inspection and issue imperative directions to resolve this grievance without further delay.`,
      reliefRequested: 'Urgent site inspection and prompt remediation of the reported defect within 48 hours.',
      date: todayEn,
      place: cleanDistrict,
      closing: 'Yours faithfully,\n\n\n[Applicant Signature]'
    }
  });
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

startServer();
