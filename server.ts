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

// Tamil Nadu Department & Authority Rule Base for Resilient Fallback
const TN_AUTHORITY_MAP: Array<{
  keywords: string[];
  department: string;
  departmentTa: string;
  designation: string;
  designationTa: string;
  category: string;
  reason: string;
  reasonTa: string;
}> = [
  {
    keywords: ['current', 'power', 'eb', 'transformer', 'wire', 'street light', 'fuse', 'meter', 'tangedco', 'minkambi', 'oli', 'light'],
    department: 'Tamil Nadu Generation and Distribution Corporation Limited (TANGEDCO)',
    departmentTa: 'தமிழ்நாடு மின் உற்பத்தி மற்றும் பகிர்மானக் கழகம் (TANGEDCO)',
    designation: 'The Assistant Executive Engineer / Operation & Maintenance',
    designationTa: 'உயர்திரு உதவி செயற்பொறியாளர் / இயக்கம் & பராமரிப்பு',
    category: 'Electricity & Power Infrastructure',
    reason: 'Power grid lines, street fixtures, and transformer maintenance fall under the statutory jurisdiction of TANGEDCO.',
    reasonTa: 'மின் விநியோகம், தெருவிளக்கு மின் இணைப்புகள் மற்றும் மின்மாற்றி பராமரிப்பு பணிகள் TANGEDCO-ன் நேரடி கட்டுப்பாட்டில் உள்ளன.',
  },
  {
    keywords: ['water', 'kudineer', 'pipe', 'leak', 'drainage', 'sewage', 'twad', 'gutter', 'sanitation', 'kudineer thadai'],
    department: 'Tamil Nadu Water Supply and Drainage Board (TWAD) / Municipal Water Works',
    departmentTa: 'தமிழ்நாடு குடிநீர் வடிகால் வாரியம் (TWAD) / நகராட்சி குடிநீர் வழங்கல் பிரிவு',
    designation: 'The Executive Engineer / Public Health & Water Supply',
    designationTa: 'உயர்திரு செயற்பொறியாளர் / குடிநீர் & வடிகால் பராமரிப்பு',
    category: 'Water Supply & Public Health',
    reason: 'Piped drinking water distribution and sewage trunk maintenance belong to TWAD and local urban body water works.',
    reasonTa: 'குடிநீர் விநியோகம் மற்றும் கழிவுநீர் வடிகால் அடைப்பு பணிகள் நகராட்சி குடிநீர் வழங்கல் பிரிவின் நேரடி பொறுப்பாகும்.',
  },
  {
    keywords: ['garbage', 'kuppai', 'waste', 'smell', 'dustbin', 'dump', 'cleaning', 'mosquito', 'dengue', 'hygiene'],
    department: 'Municipal Corporation / Town Panchayat Health & Sanitation Department',
    departmentTa: 'மாநகராட்சி / நகராட்சி / பேரூராட்சி சுகாதாரத் துறை',
    designation: 'The City Health Officer / Sanitary Inspector',
    designationTa: 'உயர்திரு நகர்நல அலுவலர் / சுகாதார ஆய்வாளர்',
    category: 'Sanitation & Solid Waste Management',
    reason: 'Solid waste clearance, street sweeping, and vector hygiene are handled by municipal sanitary inspectors.',
    reasonTa: 'தெருக்களில் குப்பை அகற்றுதல் மற்றும் சுகாதார பராமரிப்பு நகராட்சி சுகாதார ஆய்வாளரின் கட்டுப்பாட்டில் உள்ளது.',
  },
  {
    keywords: ['road', 'pothole', 'salai', 'tar', 'highway', 'bridge', 'pavement', 'traffic', 'kuzhi', 'speedbreaker'],
    department: 'Highways and Minor Ports Department / Municipal Engineering Wing',
    departmentTa: 'நெடுஞ்சாலைகள் மற்றும் சிறு துறைமுகங்கள் துறை / நகராட்சி பொறியியல் பிரிவு',
    designation: 'The Assistant Divisional Engineer / Municipal Engineer',
    designationTa: 'உயர்திரு உதவி கோட்ட பொறியாளர் / நகராட்சி பொறியாளர்',
    category: 'Roads & Bridges Infrastructure',
    reason: 'Road repair, resurfacing, and pedestrian safety installations are governed by the Highways and Municipal Engineering wings.',
    reasonTa: 'சாலைகள் சீரமைப்பு, தார் சாலை அமைத்தல் மற்றும் பாலங்கள் பராமரிப்பு நெடுஞ்சாலை மற்றும் பொறியியல் பிரிவால் மேற்கொள்ளப்படுகிறது.',
  },
  {
    keywords: ['patta', 'chitta', 'land', 'survey', 'adangal', 'encroachment', 'revenue', 'boundary', 'edam', 'poramboke'],
    department: 'Revenue and Disaster Management Department (வருவாய்த் துறை)',
    departmentTa: 'வருவாய் மற்றும் பேரிடர் மேலாண்மைத் துறை',
    designation: 'The Tahsildar / Revenue Divisional Officer (RDO)',
    designationTa: 'உயர்திரு வட்டாட்சியர் (Tahsildar) / வருவாய் கோட்டாட்சியர்',
    category: 'Land Records & Revenue Administration',
    reason: 'Land survey, Patta name transfers, and government boundary settlements must be addressed directly to the Taluk Tahsildar.',
    reasonTa: 'பட்டா பெயர் மாற்றம், நில அளவை மற்றும் எல்லை தகராறு தீர்வு ஆகியவை வட்ட வட்டாட்சியரின் சட்டப்பூர்வ அதிகார வரம்பிற்குள் உள்ளன.',
  },
  {
    keywords: ['police', 'theft', 'crime', 'harassment', 'noise', 'fight', 'sandai', 'security', 'threat', 'kaval'],
    department: 'Tamil Nadu Police Department (தமிழ்நாடு காவல்துறை)',
    departmentTa: 'தமிழ்நாடு காவல்துறை',
    designation: 'The Inspector of Police / Station House Officer (SHO)',
    designationTa: 'உயர்திரு காவல் ஆய்வாளர் (Inspector of Police)',
    category: 'Law, Order & Public Safety',
    reason: 'Civil offenses, public noise disturbance, and safety protection are the statutory duty of the jurisdictional Police Inspector.',
    reasonTa: 'பொது அமைதி மீறல், திருட்டு மற்றும் பாதுகாப்பு விவகாரங்கள் சம்பந்தப்பட்ட காவல் நிலைய ஆய்வாளரால் விசாரிக்கப்படுகின்றன.',
  },
  {
    keywords: ['ration', 'family card', 'smart card', 'rice', 'sugar', 'civil supplies', 'fair price', 'dharisu'],
    department: 'Food, Civil Supplies and Consumer Protection Department',
    departmentTa: 'உணவு, பொருள் வழங்கல் மற்றும் நுகர்வோர் பாதுகாப்புத் துறை',
    designation: 'The Taluk Supply Officer (TSO)',
    designationTa: 'உயர்திரு வட்ட வழங்கல் அலுவலர் (TSO)',
    category: 'Civil Supplies & Fair Price Shops',
    reason: 'Smart family cards, ration shop commodity distribution, and fair price regulation fall under the Taluk Supply Officer.',
    reasonTa: 'குடும்ப அட்டை திருத்தங்கள் மற்றும் நியாயவிலைக் கடை பொருட்கள் விநியோகம் வட்ட வழங்கல் அலுவலரின் கட்டுப்பாட்டில் உள்ளது.',
  },
];

/**
 * 1. Joint Problem & Recipient Verification API: /api/analyze
 */
app.post('/api/analyze', async (req: Request, res: Response) => {
  const {
    problemText = '',
    selectedDepartment = '',
    district = 'Madurai',
  } = req.body || {};

  const lowerProblem = problemText.toLowerCase();

  // Rule-based candidate matching
  let matchedRule = TN_AUTHORITY_MAP.find(rule =>
    rule.keywords.some(k => lowerProblem.includes(k))
  );

  if (!matchedRule) {
    matchedRule = {
      keywords: [],
      department: 'District Collectorate / Public Grievance Redressal Cell',
      departmentTa: 'மாவட்ட ஆட்சியர் அலுவலகம் / மக்கள் குறைதீர்ப்பு சிறப்பு பிரிவு',
      designation: 'The District Collector & District Magistrate',
      designationTa: 'உயர்திரு மாவட்ட ஆட்சித் தலைவர் அவர்கள்',
      category: 'General Public Grievance & Administration',
      reason: 'General or cross-departmental civic grievances can be submitted directly to the District Collector’s Grievance Day.',
      reasonTa: 'பொதுவான அல்லது பல துறைகள் சார்ந்த பிரச்சனைகளுக்கு மாவட்ட ஆட்சியர் மக்கள் குறைதீர்ப்பு பிரிவே முதன்மையானது.',
    };
  }

  // Determine if user's selected department matches
  const isUserUnknown = !selectedDepartment || selectedDepartment === 'unknown' || selectedDepartment.trim() === '';
  const selectedMatches = !isUserUnknown && (
    selectedDepartment.toLowerCase().includes(matchedRule.category.toLowerCase().split(' ')[0]) ||
    matchedRule.department.toLowerCase().includes(selectedDepartment.toLowerCase())
  );

  // If Gemini API is available, perform enhanced LLM evaluation
  if (aiClient) {
    try {
      const prompt = `Analyze this citizen grievance in Tamil Nadu:
Problem Text: "${problemText}"
User's Selected Department: "${selectedDepartment || 'User selected: I do not know who to address'}"
District: "${district}"

Determine:
1. One-line factual summary of the core issue.
2. The exact Government of Tamil Nadu department responsible.
3. The official designation of the competent receiving officer.
4. Whether the user's selected department is appropriate (true/false).
5. A polite, clear citizen explanation of why this authority is recommended.
6. Urgency level ("Normal", "High", "Immediate Public Hazard").
7. Any missing factual information that would make the petition stronger.`;

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
              missingInformation: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: ['identifiedProblem', 'category', 'isAppropriate', 'recommendedDepartment', 'recommendedDesignation', 'reason'],
          },
        },
      });

      if (response.text) {
        const parsed = JSON.parse(response.text);
        return res.json({
          status: 'success',
          engine: 'gemini-3.8-flash',
          identifiedProblem: parsed.identifiedProblem,
          category: parsed.category,
          locality: parsed.locality || district,
          isAppropriate: isUserUnknown ? false : parsed.isAppropriate,
          recommendedDepartment: parsed.recommendedDepartment,
          recommendedDesignation: parsed.recommendedDesignation,
          reason: parsed.reason,
          reasonTa: parsed.reasonTa || matchedRule.reasonTa,
          urgencyLevel: parsed.urgencyLevel || 'Normal',
          missingInformation: parsed.missingInformation || [],
        });
      }
    } catch (e) {
      console.error('Gemini Analysis failed, using robust rule engine:', e);
    }
  }

  // Resilient rule-based analysis output
  return res.json({
    status: 'success',
    engine: 'tn-administrative-rules',
    identifiedProblem: problemText.slice(0, 120) + (problemText.length > 120 ? '...' : ''),
    category: matchedRule.category,
    locality: district,
    isAppropriate: isUserUnknown ? false : selectedMatches,
    recommendedDepartment: matchedRule.department,
    recommendedDesignation: matchedRule.designation,
    reason: matchedRule.reason,
    reasonTa: matchedRule.reasonTa,
    urgencyLevel: lowerProblem.includes('accident') || lowerProblem.includes('danger') || lowerProblem.includes('wire') ? 'High' : 'Normal',
    missingInformation: ['Specific door number or landmark', 'Duration of unresolved grievance'],
  });
});

/**
 * 2. Full-Fledged Dual-Language Petition Generation: /api/generate
 */
app.post('/api/generate', async (req: Request, res: Response) => {
  const { 
    applicantName = 'K. Murugan', 
    applicantPhone = '9876543210', 
    applicantAddress = '14/2, 4th Cross Street, K.K. Nagar, Madurai - 625020', 
    department = 'TANGEDCO (Electricity & Grid Grievance)', 
    recipientDesignation = 'The Assistant Executive Engineer',
    district = 'Madurai',
    taluk = '',
    tanglishInput = 'Madurai KK Nagar street light eriyala, transformer pakathula wire loose-aa irukku. 3 naala complaint panniyum aalu varala...' 
  } = req.body || {};

  const randomRefNum = `SEC-TN-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  if (aiClient) {
    try {
      const systemInstruction = `You are the official Chief Legal Draftsman and Tamil Nadu Secretariat Petition Drafter for the Government of Tamil Nadu (தமிழ்நாடு அரசு தலைமை மனு வரைவாளர்).
Your responsibility is to convert informal citizen grievances into two court-ready, administrative petitions:
1. Formal Tamil Nadu Administrative Petition (தமிழ்நாடு அரசு பொதுக் குறைதீர்ப்பு மனு) written in pure, dignified administrative Tamil matching Tamil Nadu Secretariat Manual and District Collectorate standards.
2. Formal English Petition matching official Indian administrative correspondence standards.

Guidelines:
- Maintain complete fidelity to user's facts without fabricating unmentioned evidence, legal sections, or false allegations.
- Ensure the subject (பொருள்) follows standard Tamil administrative syntax: "பொருள்: [துறை] - [பிரச்சனை] - சீரமைப்பு கோருதல் - தொடர்பாக."
- Ensure clear From (அனுப்புநர்) and To (பெறுநர்) blocks.
- End with respectful closing, date, place, and applicant signature placeholder.`;

      const prompt = `Applicant Details:
- Name: ${applicantName}
- Phone: ${applicantPhone}
- Address: ${applicantAddress}
- District: ${district}
- Taluk/Zone: ${taluk}
- Department: ${department}
- Recipient Designation: ${recipientDesignation}
- Reference ID: ${randomRefNum}

Citizen Grievance in Informal Spoken Language:
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
          referenceNumber: randomRefNum,
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
      console.error('Gemini API drafting error, falling back to rule transformer:', apiError);
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
    referenceNumber: randomRefNum,
    tanglishInput,
    tamilOutput: {
      header: 'தமிழ்நாடு அரசு பொதுக் குறைதீர்ப்பு மனு',
      department: `${department} • ${cleanDistrict} கோட்டம்`,
      recipient: `உயர்திரு ${recipientDesignation || 'செயற்பொறியாளர் / துறை அலுவலர்'} அவர்கள்,\n${department},\n${cleanDistrict} வட்டம் & மாவட்டம்.`,
      applicant: `திரு/திருமதி ${applicantName},\n${applicantAddress}\nதொலைபேசி எண்: ${applicantPhone}`,
      subject: `பொருள்: ${department} சார்ந்த அவசர குறைதீர்ப்பு மற்றும் பொதுநலன் கருதி உடனடி சீரமைப்பு கோருதல் - தொடர்பாக.`,
      reference: `மனு குறிப்பு எண்: ${randomRefNum}`,
      body: `மதிப்பிற்குரிய ஐயா / அம்மா,\n\nவணக்கம். நான் மேற்கண்ட முகவரியில் வசித்து வரும் தமிழ்நாடு குடிமகன் ஆவேன்.\n\nஎங்கள் பகுதியில் பொதுமக்களை பெரிதும் பாதிக்கும் கீழ்க்கண்ட குறைபாடு தீர்க்கப்படாமல் உள்ளது:\n\n"${tanglishInput}"\n\nஇத்தகைய நிலைமையினால் பொதுமக்கள் மற்றும் இப்பகுதி வழியே செல்லும் பாதசாரிகள் பெரும் சிரமத்திற்கு ஆளாகியுள்ளனர். இதுகுறித்து ஏற்கனவே வாய்மொழியாக தெரிவித்தும் இதுவரை எவ்வித முன்னேற்றமும் ஏற்படவில்லை.\n\nஆகவே, பொதுமக்களின் நலன் கருதி, தாங்கள் இவ்விவகாரத்தில் தனிப்பட்ட முறையில் தலையிட்டு, சம்பவ இடத்தை உடனடியாக ஆய்வு செய்து தகுந்த நிவாரணம் மற்றும் சீரமைப்புப் பணிகளை துரிதமாக மேற்கொள்ளுமாறு மிக பணிவுடன் வேண்டுகிறேன்.`,
      reliefRequested: 'சம்பவ இடத்தை நேரில் ஆய்வு செய்து, உரிய அலுவலர்கள் மூலம் பழுது மற்றும் குறைபாடுகளை துரிதமாக நீக்குதல்.',
      date: todayTa,
      place: cleanDistrict,
      closing: 'இப்படிக்கு தங்கள் உண்மையுள்ள,\n\n\n(மனுதாரர் கையொப்பம்)'
    },
    englishOutput: {
      header: 'GOVERNMENT OF TAMIL NADU - OFFICIAL GRIEVANCE PETITION',
      department: `${department} • ${cleanDistrict} Division`,
      recipient: `${recipientDesignation || 'The Competent Officer / Executive Authority'},\n${department},\n${cleanDistrict} Circle & District, Tamil Nadu.`,
      applicant: `${applicantName},\n${applicantAddress}\nContact Phone: ${applicantPhone}`,
      subject: `Subject: Urgent grievance redressal and corrective public service intervention regarding ${department} - Reg.`,
      reference: `Petition Ref: ${randomRefNum}`,
      body: `Respected Sir/Madam,\n\nI am a bonafide resident residing at the aforementioned residential address.\n\nI submit this formal administrative petition to draw your prompt attention to an ongoing issue in our locality:\n\n"${tanglishInput}"\n\nThis unresolved condition poses an ongoing hazard and disruption to daily life. Despite earlier representations, no tangible corrective action has been initiated to date.\n\nIn the interest of public welfare, I earnestly pray that your esteemed office conduct an immediate site inspection and issue imperative directions to resolve this grievance without further delay.`,
      reliefRequested: 'Urgent site inspection and prompt remediation of the reported defect.',
      date: todayEn,
      place: cleanDistrict,
      closing: 'Yours faithfully,\n\n\n[Applicant Signature]'
    }
  });
});

/**
 * 3. Quick AI Polish & Refinement API: /api/improve
 */
app.post('/api/improve', async (req: Request, res: Response) => {
  const { currentBody = '', action = 'formal', language = 'ta' } = req.body || {};

  if (aiClient) {
    try {
      const instructionMap: Record<string, string> = {
        formal: language === 'ta' ? 'தமிழ்நாடு தலைமைச் செயலக சட்ட நடையை மேலும் கண்ணியமாக உயர்த்தி எழுதுங்கள்.' : 'Elevate the vocabulary into pristine formal administrative correspondence.',
        concise: language === 'ta' ? 'அவசியமான குறைபாடு மற்றும் கோரிக்கையை மட்டும் வைத்து சுருக்கமாகவும் தெளிவாகவும் மாற்றுங்கள்.' : 'Make the petition concise and punchy while retaining all vital facts and requests.',
        urgent: language === 'ta' ? 'பொதுமக்களின் பாதுகாப்பு மற்றும் அவசரத்தை முன்னிலைப்படுத்தி வலுவான கோரிக்கையை அமையுங்கள்.' : 'Emphasize public safety risk, past inaction, and the need for immediate time-bound redressal.',
      };

      const prompt = `Task: Refine this petition letter body.
Instruction: ${instructionMap[action] || 'Improve readability and clarity.'}
Language: ${language === 'ta' ? 'Pure Administrative Tamil' : 'Formal English'}

Original Body:
"""
${currentBody}
"""

Return only the refined body paragraph in the same language.`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      if (response.text) {
        return res.json({ status: 'success', refinedBody: response.text.trim() });
      }
    } catch (e) {
      console.error('Improvement error:', e);
    }
  }

  return res.json({ status: 'success', refinedBody: currentBody });
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
