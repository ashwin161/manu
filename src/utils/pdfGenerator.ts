import jsPDF from 'jspdf';
import { PetitionDocument } from './storage';

/**
 * Client-Side Vector PDF Generator
 * Formats official Tamil Nadu Secretariat and Collectorate A4 petition documents.
 */
export const generatePetitionPDF = async (
  petition: PetitionDocument,
  mode: 'ta' | 'en' | 'dual' = 'ta'
): Promise<jsPDF> => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;

  const renderSinglePage = (isTa: boolean, pageNum: number, totalPages: number) => {
    if (pageNum > 1) {
      doc.addPage();
    }

    const output = isTa ? petition.tamilOutput : petition.englishOutput;
    let y = margin;

    // Outer double border for official gazette look
    doc.setDrawColor(30, 41, 59);
    doc.setLineWidth(0.6);
    doc.rect(margin - 5, margin - 5, contentWidth + 10, pageHeight - margin * 2 + 10);
    doc.setLineWidth(0.2);
    doc.rect(margin - 3.5, margin - 3.5, contentWidth + 7, pageHeight - margin * 2 + 7);

    // Official State Header
    doc.setFont('times', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    const headerTitle = isTa
      ? 'தமிழ்நாடு அரசு - பொதுக் குறைதீர்ப்பு மனு'
      : 'GOVERNMENT OF TAMIL NADU - OFFICIAL GRIEVANCE PETITION';
    doc.text(headerTitle, pageWidth / 2, y + 2, { align: 'center' });

    y += 8;
    doc.setFont('times', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    const deptTitle = isTa
      ? `${output.department || petition.department} • ${petition.district} மாவட்டம்`
      : `${output.department || petition.department} • ${petition.district} District`;
    doc.text(deptTitle, pageWidth / 2, y, { align: 'center' });

    // Hairline divider
    y += 5;
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.3);
    doc.line(margin, y, pageWidth - margin, y);

    // Reference & Date row
    y += 6;
    doc.setFont('courier', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);
    doc.text(output.reference || `Ref: ${petition.referenceNumber}`, margin, y);
    doc.setFont('times', 'normal');
    doc.text(`${isTa ? 'நாள்: ' : 'Date: '} ${output.date || new Date().toLocaleDateString()}`, pageWidth - margin, y, { align: 'right' });

    // From (அனுப்புநர்) Block
    y += 9;
    doc.setFont('times', 'bold');
    doc.setFontSize(10);
    doc.text(isTa ? 'அனுப்புநர்:' : 'From:', margin, y);

    y += 5;
    doc.setFont('times', 'normal');
    doc.setFontSize(9.5);
    doc.text(output.applicant || `${petition.applicantName}\n${petition.applicantAddress}\nPhone: ${petition.applicantPhone}`, margin + 5, y);

    // To (பெறுநர்) Block
    y += 20;
    doc.setFont('times', 'bold');
    doc.setFontSize(10);
    doc.text(isTa ? 'பெறுநர்:' : 'To:', margin, y);

    y += 5;
    doc.setFont('times', 'normal');
    doc.setFontSize(9.5);
    doc.text(output.recipient || `The Competent Officer / Department Head\n${petition.department}\n${petition.district}`, margin + 5, y);

    // Subject (பொருள்) Block
    y += 20;
    doc.setFont('times', 'bold');
    doc.setFontSize(10);
    const subjectPrefix = isTa ? 'பொருள்: ' : 'Subject: ';
    const subjectClean = (output.subject || '').replace(/^பொருள்:\s*|^Subject:\s*/i, '');
    const subjectLines = doc.splitTextToSize(`${subjectPrefix}${subjectClean}`, contentWidth);
    doc.text(subjectLines, margin, y);
    y += subjectLines.length * 5 + 3;

    // Body Block
    doc.setFont('times', 'normal');
    doc.setFontSize(9.5);
    const bodyLines = doc.splitTextToSize(output.body || '', contentWidth);
    doc.text(bodyLines, margin, y);
    y += bodyLines.length * 4.6 + 6;

    // Relief / Prayer requested
    if (output.reliefRequested && y < pageHeight - 60) {
      doc.setFont('times', 'bold');
      doc.setFontSize(9.5);
      doc.text(isTa ? 'கோரப்படும் உடனடி நிவாரணம்:' : 'Relief & Action Prayed For:', margin, y);
      y += 5;
      doc.setFont('times', 'normal');
      const reliefLines = doc.splitTextToSize(output.reliefRequested, contentWidth);
      doc.text(reliefLines, margin + 4, y);
      y += reliefLines.length * 4.5 + 8;
    }

    // Place & Date / Signature Footer
    const footerY = Math.max(y, pageHeight - 45);
    doc.setFont('times', 'normal');
    doc.setFontSize(9.5);
    doc.text(`${isTa ? 'இடம்: ' : 'Place: '} ${output.place || petition.district}`, margin, footerY);
    doc.text(`${isTa ? 'நாள்: ' : 'Date: '} ${output.date || new Date().toLocaleDateString()}`, margin, footerY + 5);

    // Signature Block
    doc.text(isTa ? 'இப்படிக்கு தங்கள் உண்மையுள்ள,' : 'Yours faithfully,', pageWidth - margin, footerY, { align: 'right' });
    doc.setFont('times', 'bold');
    doc.text(`(${petition.applicantName})`, pageWidth - margin, footerY + 16, { align: 'right' });

    // Page number
    doc.setFont('times', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth / 2, pageHeight - margin + 8, { align: 'center' });
  };

  if (mode === 'dual') {
    renderSinglePage(true, 1, 2);
    renderSinglePage(false, 2, 2);
  } else {
    renderSinglePage(mode === 'ta', 1, 1);
  }

  return doc;
};

/**
 * Trigger immediate download of the vector PDF
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
 * Mobile Web Share API trigger
 */
export const sharePetition = async (
  petition: PetitionDocument,
  mode: 'ta' | 'en' = 'ta'
): Promise<boolean> => {
  const doc = await generatePetitionPDF(petition, mode);
  const pdfBlob = doc.output('blob');
  const safeRef = (petition.referenceNumber || 'TN-PETITION').replace(/[^a-zA-Z0-9_-]/g, '_');
  const file = new File([pdfBlob], `${safeRef}.pdf`, { type: 'application/pdf' });

  if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
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
