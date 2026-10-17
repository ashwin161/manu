import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { PetitionDocument } from './storage';

/**
 * Returns the official Tamil Nadu State Crest SVG markup
 */
function getEmblemSvgMarkup(size = 56, strokeColor = '#065f46', fillColor = '#047857'): string {
  return `
    <svg width="${size}" height="${size}" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block; vertical-align:middle;">
      <!-- Outer Emblem Ring -->
      <circle cx="50" cy="50" r="46" stroke="${strokeColor}" stroke-width="2.5" opacity="0.35" />
      <circle cx="50" cy="50" r="43" stroke="${strokeColor}" stroke-width="1.5" stroke-dasharray="2 3" opacity="0.6" />

      <!-- Outer Sun Rays / Radiance Ring -->
      <g opacity="0.45" stroke="${strokeColor}" stroke-width="1.2">
        <line x1="50" y1="5" x2="50" y2="8" />
        <line x1="50" y1="92" x2="50" y2="95" />
        <line x1="5" y1="50" x2="8" y2="50" />
        <line x1="92" y1="50" x2="95" y2="50" />
        <line x1="18" y1="18" x2="20" y2="20" />
        <line x1="80" y1="80" x2="82" y2="82" />
        <line x1="18" y1="82" x2="20" y2="80" />
        <line x1="80" y1="20" x2="82" y2="18" />
      </g>

      <!-- Kalasams (Finials at top) -->
      <g fill="${fillColor}">
        <circle cx="50" cy="15" r="2.2" />
        <circle cx="43" cy="16.5" r="1.6" />
        <circle cx="57" cy="16.5" r="1.6" />
        <circle cx="37" cy="18" r="1.2" />
        <circle cx="63" cy="18" r="1.2" />
      </g>

      <!-- Gopuram Tiers -->
      <path d="M45 19 H55 L57 23 H43 Z" fill="${fillColor}" opacity="0.95" />
      <path d="M41 24 H59 L61 30 H39 Z" fill="${fillColor}" opacity="0.9" />
      <path d="M37 31 H63 L65 38 H35 Z" fill="${fillColor}" opacity="0.85" />
      <path d="M33 39 H67 L70 48 H30 Z" fill="${fillColor}" opacity="0.9" />
      <path d="M28 49 H72 L75 60 H25 Z" fill="${fillColor}" opacity="0.95" />
      <path d="M23 61 H77 L79 78 H21 Z" fill="${fillColor}" opacity="0.95" />

      <!-- Central Sanctum Entrance Arch Cutout -->
      <path d="M42 78 V66 C42 61.5 58 61.5 58 66 V78 Z" fill="#ffffff" />

      <!-- Ashoka Chakra in Center Base -->
      <circle cx="50" cy="71" r="5" stroke="${strokeColor}" stroke-width="1.2" />
      <circle cx="50" cy="71" r="1.2" fill="${strokeColor}" />
      <g stroke="${strokeColor}" stroke-width="0.8" opacity="0.8">
        <line x1="50" y1="66" x2="50" y2="76" />
        <line x1="45" y1="71" x2="55" y2="71" />
        <line x1="46.5" y1="67.5" x2="53.5" y2="74.5" />
        <line x1="46.5" y1="74.5" x2="53.5" y2="67.5" />
      </g>

      <!-- Plinth Base Lines -->
      <rect x="18" y="78" width="64" height="4" rx="1" fill="${fillColor}" />
      <rect x="14" y="82" width="72" height="3" rx="1.5" fill="${fillColor}" opacity="0.8" />
    </svg>
  `;
}

/**
 * Builds an authentic, court-ready Tamil Nadu Government Gazette A4 DOM element
 * Perfectly renders complex Unicode Tamil text (Noto Serif Tamil) with zero garbling.
 */
function createPetitionA4Element(petition: PetitionDocument, isTa: boolean, pageNum = 1, totalPages = 1): HTMLElement {
  const output = isTa ? petition.tamilOutput : petition.englishOutput;

  const container = document.createElement('div');
  container.className = 'a4-render-canvas-container';
  container.style.cssText = `
    width: 794px;
    min-height: 1123px;
    padding: 36px 42px;
    background-color: #ffffff;
    color: #0f172a;
    box-sizing: border-box;
    font-family: 'Noto Serif Tamil', 'Source Serif 4', Georgia, serif;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    line-height: 1.6;
  `;

  const headerTitle = isTa
    ? 'தமிழ்நாடு அரசு • GOVERNMENT OF TAMIL NADU'
    : 'GOVERNMENT OF TAMIL NADU • தமிழ்நாடு அரசு';

  const subHeader = isTa
    ? 'பொதுக் குறைதீர்ப்பு மனு • OFFICIAL GRIEVANCE PETITION'
    : 'OFFICIAL GRIEVANCE PETITION • பொதுக் குறைதீர்ப்பு மனு';

  const deptTitle = output.department || petition.department;
  const districtName = petition.district || 'Madurai';
  const refNumber = output.reference || petition.referenceNumber || `SEC-TN-${Date.now()}`;
  const docDate = output.date || new Date().toLocaleDateString('en-GB');

  const applicantName = petition.applicantName || 'Applicant';
  const applicantPhone = petition.applicantPhone || '';
  const applicantAddress = petition.applicantAddress || '';
  const recipientDesignation = petition.recipientDesignation || (isTa ? 'உயர்திரு துறை தலைமை அதிகாரி' : 'The Competent Authority / Department Head');

  const subjectText = (output.subject || '').replace(/^பொருள்:\s*|^Subject:\s*/i, '');
  const bodyText = (output.body || '').trim();
  const reliefText = (output.reliefRequested || '').trim();
  const placeText = output.place || districtName;

  container.innerHTML = `
    <!-- Outer Double Gazette Border -->
    <div style="border: 2.5px solid #0f172a; outline: 1px solid #475569; outline-offset: -5px; padding: 26px 30px; min-height: 1045px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between;">
      
      <div>
        <!-- Top Official Government Insignia & Header -->
        <div style="text-align: center; margin-bottom: 12px; border-bottom: 2px solid #065f46; padding-bottom: 10px;">
          <div style="margin-bottom: 4px;">
            ${getEmblemSvgMarkup(54, '#065f46', '#047857')}
          </div>
          <h1 style="font-family: 'Cinzel', 'Noto Serif Tamil', serif; font-size: 16px; font-weight: 800; color: #065f46; margin: 0; letter-spacing: 0.5px; text-transform: uppercase;">
            ${headerTitle}
          </h1>
          <h2 style="font-family: 'Plus Jakarta Sans', 'Noto Sans Tamil', sans-serif; font-size: 12px; font-weight: 700; color: #1e3a8a; margin: 3px 0 0 0; letter-spacing: 0.3px;">
            ${subHeader}
          </h2>
          <div style="font-size: 11.5px; font-weight: 600; color: #475569; margin-top: 4px;">
            ${deptTitle} • ${districtName} ${isTa ? 'மாவட்டம்' : 'District'}
          </div>
        </div>

        <!-- Reference & Date Banner -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #cbd5e1; padding-bottom: 6px; margin-bottom: 14px; font-size: 11px; font-family: 'JetBrains Mono', monospace; color: #1e293b;">
          <div><strong>${isTa ? 'மனு எண்' : 'Ref No'}:</strong> <span style="font-weight: 700; color: #047857;">${refNumber}</span></div>
          <div><strong>${isTa ? 'நாள்' : 'Date'}:</strong> ${docDate}</div>
        </div>

        <!-- From and To Blocks (Civic Structured Grid) -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 14px; font-size: 11.5px;">
          <!-- From Block -->
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px 12px;">
            <div style="font-weight: 800; color: #047857; border-bottom: 1px solid #cbd5e1; padding-bottom: 3px; margin-bottom: 5px;">
              ${isTa ? 'அனுப்புநர் (Petitioner):' : 'From:'}
            </div>
            <div style="font-weight: 700; color: #0f172a;">${applicantName}</div>
            <div style="color: #334155; white-space: pre-line; margin-top: 2px;">${applicantAddress}</div>
            ${applicantPhone ? `<div style="color: #475569; margin-top: 3px; font-family: 'JetBrains Mono', monospace;">Phone: ${applicantPhone}</div>` : ''}
            <div style="color: #64748b; font-size: 10.5px;">${districtName} ${isTa ? 'மாவட்டம்' : 'District'}</div>
          </div>

          <!-- To Block -->
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px 12px;">
            <div style="font-weight: 800; color: #1e3a8a; border-bottom: 1px solid #cbd5e1; padding-bottom: 3px; margin-bottom: 5px;">
              ${isTa ? 'பெறுநர் (Competent Authority):' : 'To:'}
            </div>
            <div style="font-weight: 700; color: #0f172a;">${recipientDesignation}</div>
            <div style="color: #334155; margin-top: 2px;">${deptTitle}</div>
            <div style="color: #475569; margin-top: 2px;">${districtName} ${isTa ? 'மாவட்ட ஆட்சியரகம் / கோட்ட அலுவலகம்' : 'District Collectorate / Divisional Office'}</div>
            <div style="color: #64748b; font-size: 10.5px;">${isTa ? 'தமிழ்நாடு அரசு' : 'Government of Tamil Nadu'}</div>
          </div>
        </div>

        <!-- Subject Banner (பொருள்) -->
        <div style="background: #ecfdf5; border-left: 4px solid #047857; border: 1px solid #a7f3d0; border-left-width: 4px; border-radius: 4px; padding: 9px 12px; margin-bottom: 12px;">
          <div style="font-size: 12px; font-weight: 800; color: #065f46;">
            ${isTa ? 'பொருள்:' : 'Subject:'} <span style="font-weight: 700; color: #0f172a;">${subjectText}</span>
          </div>
          <div style="font-size: 10.5px; color: #047857; margin-top: 3px; font-style: italic;">
            ${isTa ? 'பார்வை: முதலமைச்சரின் தனிப்பிரிவு & மாவட்ட ஆட்சியர் மக்கள் குறைதீர்ப்பு விதிமுறைகள்.' : 'Ref: CM Special Cell & District Collectorate Public Grievance Protocol.'}
          </div>
        </div>

        <!-- Salutation -->
        <div style="font-size: 12px; font-weight: 700; color: #0f172a; margin-bottom: 8px;">
          ${isTa ? 'மதிப்பிற்குரிய ஐயா / அம்மா அவர்களுக்கு,' : 'Respected Sir / Madam,'}
        </div>

        <!-- Petition Body (Legal Tamil / English) -->
        <div style="font-size: 12px; line-height: 1.8; text-align: justify; color: #0f172a; margin-bottom: 12px; white-space: pre-line; text-indent: 20px;">
          ${bodyText}
        </div>

        <!-- Relief Prayed For (கோரப்படும் தீர்வு) -->
        ${reliefText ? `
          <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-left: 4px solid #1d4ed8; border-radius: 4px; padding: 8px 12px; margin-bottom: 14px;">
            <div style="font-size: 11.5px; font-weight: 800; color: #1e3a8a; margin-bottom: 2px;">
              ${isTa ? 'கோரப்படும் உடனடி தீர்வு / நிவாரணம்:' : 'Relief & Action Prayed For:'}
            </div>
            <div style="font-size: 11.5px; color: #1e293b; line-height: 1.6;">
              ${reliefText}
            </div>
          </div>
        ` : ''}
      </div>

      <!-- Footer: Place, Date & Signature -->
      <div>
        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 14px; padding-top: 12px; border-top: 1px solid #e2e8f0;">
          <div style="font-size: 11.5px; color: #334155; line-height: 1.7;">
            <div><strong>${isTa ? 'இடம்' : 'Place'}:</strong> ${placeText}</div>
            <div><strong>${isTa ? 'நாள்' : 'Date'}:</strong> ${docDate}</div>
            <div style="font-size: 10px; color: #64748b; margin-top: 6px;">
              ${isTa ? 'மனு நகல் பதிவு எண்:' : 'Digital Dispatch Ref:'} ${refNumber}
            </div>
          </div>

          <div style="text-align: right; font-size: 11.5px; color: #0f172a;">
            <div style="margin-bottom: 30px; font-style: italic;">
              ${isTa ? 'இப்படிக்கு தங்கள் உண்மையுள்ள,' : 'Yours faithfully,'}
            </div>
            <div style="font-weight: 800; font-size: 12.5px;">(${applicantName})</div>
            <div style="font-size: 10.5px; color: #475569;">${isTa ? 'மனுதாரர் கையொப்பம்' : 'Petitioner Signature'}</div>
          </div>
        </div>

        <!-- Bottom Gazette Endorsement Ribbon -->
        <div style="border-top: 1px dashed #cbd5e1; margin-top: 14px; padding-top: 6px; display: flex; justify-content: space-between; font-size: 9.5px; color: #64748b; font-family: 'JetBrains Mono', monospace;">
          <span>TN-PGRS CERTIFIED FORMAT • CM SPECIAL CELL & COLLECTORATE COMPLIANT</span>
          <span>PAGE ${pageNum} OF ${totalPages}</span>
        </div>
      </div>

    </div>
  `;

  return container;
}

/**
 * High-Definition Client-Side Vector/Raster PDF Generator
 * Renders Tamil Unicode text flawlessly via html2canvas with retina 2x subpixel antialiasing.
 */
export const generatePetitionPDF = async (
  petition: PetitionDocument,
  mode: 'ta' | 'en' | 'dual' = 'ta'
): Promise<jsPDF> => {
  // Ensure document web fonts (Noto Serif Tamil, etc.) are fully rendered before canvas rasterization
  if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
    try {
      await document.fonts.ready;
    } catch (e) {
      // ignore
    }
  }

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const renderPageToPdf = async (isTa: boolean, pageNum: number, totalPages: number) => {
    const el = createPetitionA4Element(petition, isTa, pageNum, totalPages);
    
    // Mount temporarily offscreen so layout and fonts calculate with 100% fidelity
    el.style.position = 'fixed';
    el.style.left = '-9999px';
    el.style.top = '0';
    el.style.zIndex = '-9999';
    document.body.appendChild(el);

    try {
      const canvas = await html2canvas(el, {
        scale: 2, // 2x high-DPI retina rendering ensures razor-sharp Tamil script
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 794,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.98);

      if (pageNum > 1) {
        pdf.addPage();
      }

      // Exact A4 dimensions in mm: 210 x 297
      pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
    } finally {
      document.body.removeChild(el);
    }
  };

  if (mode === 'dual') {
    await renderPageToPdf(true, 1, 2);
    await renderPageToPdf(false, 2, 2);
  } else {
    await renderPageToPdf(mode === 'ta', 1, 1);
  }

  return pdf;
};

/**
 * Triggers immediate download of the high-definition petition PDF
 */
export const downloadPetitionPDF = async (
  petition: PetitionDocument,
  mode: 'ta' | 'en' | 'dual' = 'ta'
): Promise<void> => {
  const doc = await generatePetitionPDF(petition, mode);
  const safeRef = (petition.referenceNumber || 'TN-PETITION').replace(/[^a-zA-Z0-9_-]/g, '_');
  doc.save(`${safeRef}-${mode}.pdf`);
};

/**
 * Mobile Web Share API trigger with high-definition PDF attachment
 */
export const sharePetition = async (
  petition: PetitionDocument,
  mode: 'ta' | 'en' = 'ta'
): Promise<boolean> => {
  const doc = await generatePetitionPDF(petition, mode);
  const pdfBlob = doc.output('blob');
  const safeRef = (petition.referenceNumber || 'TN-PETITION').replace(/[^a-zA-Z0-9_-]/g, '_');
  const file = new File([pdfBlob], `${safeRef}.pdf`, { type: 'application/pdf' });

  if (typeof navigator !== 'undefined' && navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        title: `Official Petition - ${petition.department}`,
        text: `Tamil Nadu Official Grievance Petition (Ref: ${petition.referenceNumber})`,
        files: [file],
      });
      return true;
    } catch (e) {
      console.warn('Share cancelled or failed', e);
      return false;
    }
  }

  // Fallback to direct download
  await downloadPetitionPDF(petition, mode);
  return true;
};
