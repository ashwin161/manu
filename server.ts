import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

/**
 * Phase 1 Mock API Route: /api/generate
 * Returns a hardcoded JSON mock of formal Tamil and English petitions
 * for testing the frontend split-screen and A4 sheet.
 */
app.post('/api/generate', (req: Request, res: Response) => {
  const { applicantName, applicantPhone, applicantAddress, department, tanglishInput } = req.body || {};

  const name = applicantName || 'K. Murugan';
  const phone = applicantPhone || '9876543210';
  const address = applicantAddress || '14/2, 4th Cross Street, K.K. Nagar, Madurai - 625020';
  const dept = department || 'TANGEDCO (Electricity & Grid Grievance)';
  const inputExcerpt = tanglishInput || 'Madurai KK Nagar street light eriyala, transformer pakathula wire loose-aa irukku.';

  return res.json({
    status: 'success',
    department: dept,
    applicantName: name,
    tanglishInput: inputExcerpt,
    tamilOutput: {
      header: 'தமிழ்நாடு அரசு பொதுக் குறைதீர்ப்பு மனு',
      department: `${dept} • K.K. Nagar Division`,
      recipient: 'உதவி செயற்பொறியாளர் (AEE),\nநகரிய உபகோட்டம்,\nமின் பகிர்மான வட்டம், மதுரை - 625020.',
      applicant: `திரு. ${name},\n${address}\nதொலைபேசி: ${phone}`,
      subject: `பொருள்: ${dept} சார்ந்த உடனடி மின்கம்பி பழுதுநீக்கம் மற்றும் தெருவிளக்கு சீரமைத்தல் கோருதல் - தொடர்பாக.`,
      reference: 'மனு குறிப்பு எண்: SEC-TN-2026-4819',
      body: `மதிப்பிற்குரிய ஐயா / அம்மா,\n\nவணக்கம். நான் மேற்கண்ட முகவரியில் வசித்து வரும் குடிமகன் ஆவேன்.\n\nஎங்கள் பகுதியில்:\n"${inputExcerpt}"\nஎன்ற குறைபாடு நிலவுகிறது. குறிப்பாக கே.கே. நகர் பிரதான சாலையில் தெருவிளக்குகள் எரியாமல் இருள் சூழ்ந்து காணப்படுகிறது. மேலும், மின்மாற்றி அருகே மின்கம்பிகள் தாழ்வாக தொங்கிக் கொண்டிருப்பதால் அவ்வழியே செல்லும் பள்ளி குழந்தைகள் மற்றும் பொதுமக்களுக்கு மிகக் கடுமையான விபத்து அபாயம் நிலவுகிறது.\n\nஇதுகுறித்து களப்பணியாளர்களிடம் பலமுறை தெரிவித்தும் உரிய தீர்வு கிடைக்கவில்லை.\n\nஆகவே, பொதுமக்களின் பாதுகாப்பை கருதி தாங்கள் உடனடியாக சம்பவ இடத்தை நேரில் ஆய்வு செய்து, பழுதடைந்த மின்கம்பிகள் மற்றும் தெருவிளக்குகளை விரைந்து சீரமைக்க ஆவன செய்யுமாறு மிக பணிவுடன் வேண்டுகிறேன்.`,
      date: new Date().toLocaleDateString('ta-IN'),
      place: 'மதுரை',
      closing: 'இப்படிக்கு தங்கள் உண்மையுள்ள,\n\n\n(மனுதாரர் கையொப்பம்)'
    },
    englishOutput: {
      header: 'GOVERNMENT OF TAMIL NADU - OFFICIAL GRIEVANCE PETITION',
      department: `${dept} • K.K. Nagar Division`,
      recipient: 'The Assistant Executive Engineer (AEE),\nUrban Sub-Division,\nTANGEDCO Distribution Circle, Madurai - 625020.',
      applicant: `Mr. ${name},\n${address}\nPhone: ${phone}`,
      subject: `Subject: Urgent grievance redressal and rectification regarding ${dept} - Reg.`,
      reference: 'Petition Ref: SEC-TN-2026-4819',
      body: `Respected Sir/Madam,\n\nI am an Indian citizen residing at the aforementioned address.\n\nI submit this formal grievance regarding the following issue in our locality:\n"${inputExcerpt}"\n\nSpecifically, the public streetlights in our ward have remained dysfunctional for days. In addition, loose and sagging high-voltage power lines adjacent to the local transformer pose a grave risk of electrocution to pedestrians, school students, and daily commuters.\n\nDespite repeated verbal complaints to local maintenance personnel, no action has been taken to rectify the hazard.\n\nTherefore, in the interest of public safety, I earnestly request your good office to inspect the site immediately and carry out the necessary repairs without further delay.`,
      date: new Date().toLocaleDateString('en-IN'),
      place: 'Madurai',
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
