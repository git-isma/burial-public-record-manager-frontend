import jsPDF from 'jspdf';
import ismaLogo from '../assets/ISMA-logo.png';

export const generateAcknowledgementPDF = async (record, formatDate) => {
    try {
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        // Colors
        const COLORS = {
            primary: [30, 64, 175], // Dark blue
            secondary: [243, 244, 246], // Light gray background
            text: [31, 41, 55], // Dark gray
            subtext: [107, 114, 128], // Lighter gray
            white: [255, 255, 255],
            accent: [234, 179, 8], // Gold/Yellow for highlights
            border: [209, 213, 219]
        };

        // Helper to load image as base64
        const loadImageBase64 = async (url) => {
            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error('Network response was not ok');
                const blob = await response.blob();
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
                });
            } catch (err) {
                console.error('Error fetching image for PDF:', err);
                throw err;
            }
        };

        const checkPageBreak = (y, needed) => {
            if (y + needed > pageHeight - 25) {
                pdf.addPage();
                return 20;
            }
            return y;
        };

        // Helper to draw section header
        const drawSectionHeader = (title, y) => {
            y = checkPageBreak(y, 15);
            pdf.setFillColor(...COLORS.secondary);
            pdf.rect(14, y - 5, pageWidth - 28, 8, 'F');
            pdf.setTextColor(...COLORS.primary);
            pdf.setFontSize(10);
            pdf.setFont(undefined, 'bold');
            pdf.text(title.toUpperCase(), 16, y);
            return y + 8;
        };

        // Helper to draw key-value row
        const drawRow = (label, value, y, xStart = 16, labelWidth = 60) => {
            y = checkPageBreak(y, 8);
            pdf.setTextColor(...COLORS.subtext);
            pdf.setFontSize(9);
            pdf.setFont(undefined, 'normal');
            pdf.text(label, xStart, y);

            pdf.setTextColor(...COLORS.text);
            pdf.setFont(undefined, 'bold');

            // Handle long text wrapping for value
            const maxValWidth = pageWidth - xStart - labelWidth - 16;
            const splitVal = pdf.splitTextToSize(String(value), maxValWidth);

            pdf.text(splitVal, xStart + labelWidth, y);
            return y + (splitVal.length * 5) + 3; // Dynamic height
        };

        let yPosition = 0;

        // --- HEADER ---
        pdf.setFillColor(...COLORS.primary);
        pdf.rect(0, 0, pageWidth, 48, 'F'); // Increased height slightly for more breathing room

        try {
            // Center logo vertically in the 48mm header
            pdf.addImage(ismaLogo, 'PNG', 12, 6, 28, 28);
        } catch (logoErr) {
            console.warn('Could not add logo to PDF:', logoErr);
        }

        const centerX = (pageWidth + 40) / 2;

        pdf.setTextColor(...COLORS.white);
        pdf.setFontSize(18);
        pdf.setFont(undefined, 'bold');
        pdf.text('Islamia School & Mosque Association', centerX, 15, { align: 'center' });

        pdf.setFontSize(9);
        pdf.setFont(undefined, 'bold');
        pdf.setTextColor(240, 240, 255);
        pdf.text('CUSTODIANS OF THE SUNNI MUSLIM CEMETERIES - KARIOKOR & LANGATA', centerX, 21, { align: 'center' });

        pdf.setFontSize(8);
        pdf.setFont(undefined, 'normal');
        pdf.setTextColor(220, 220, 255);
        pdf.text('P.O. Box 21015 - 00500 NAIROBI | Cell / Whatsapp: +254 113217749 | Email: office@isma.co.ke', centerX, 26, { align: 'center' });

        // Separator line - Centered in remaining space
        pdf.setDrawColor(255, 255, 255);
        pdf.setLineWidth(0.2);
        pdf.line(42, 29, pageWidth - 15, 29);

        // Main Document Title - Centered in remaining space
        pdf.setFontSize(14);
        pdf.setFont(undefined, 'bold');
        pdf.setTextColor(...COLORS.white);
        pdf.text('BURIAL RECORD ACKNOWLEDGEMENT', centerX, 37, { align: 'center' });

        // Metadata line - Centered in remaining space
        pdf.setFontSize(8);
        pdf.setTextColor(220, 220, 255);
        pdf.setFont(undefined, 'normal');
        pdf.text(`PDF Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, centerX, 42, { align: 'center' });

        // Badge in the top right
        pdf.setFontSize(8);
        pdf.setFont(undefined, 'bold');
        pdf.setTextColor(255, 255, 255);
        // pdf.text('OFFICIAL DOCUMENT', pageWidth - 15, 15, { align: 'right' });

        yPosition = 72; // Set initial body position below the header area

        // --- STATUS BADGE ---
        const statusColors = {
            'Pending': [245, 158, 11],
            'Completed': [59, 130, 246],
            'Verified': [16, 185, 129],
            'Rejected': [220, 38, 38]
        };
        const statusColor = statusColors[record.status] || [107, 114, 128];

        let statusText = (record.status || 'Pending').toUpperCase();
        if (statusText === 'PENDING') statusText = 'PENDING VERIFICATION';

        pdf.setFontSize(10);
        pdf.setFont(undefined, 'bold');

        const textWidth = pdf.getTextWidth(statusText);
        const boxWidth = textWidth + 16;
        const boxX = pageWidth - boxWidth - 15; // Align to the right
        const boxY = 53; // Position below blue header (ends at 48)

        pdf.setDrawColor(...statusColor);
        pdf.setFillColor(statusColor[0], statusColor[1], statusColor[2], 0.1);
        pdf.roundedRect(boxX, boxY, boxWidth, 10, 2, 2, 'FD');

        pdf.setTextColor(...statusColor);
        pdf.text(statusText, boxX + (boxWidth / 2), boxY + 6.5, { align: 'center' });

        yPosition = 72; // Starting position for the rest of the content

        if (record.status === 'Rejected' && record.rejectionReason) {
            yPosition += 5;
            pdf.setTextColor(220, 38, 38);
            pdf.setFontSize(9);
            pdf.setFont(undefined, 'bold');
            pdf.text('REJECTION REASON:', 15, yPosition);

            pdf.setFont(undefined, 'normal');
            pdf.setTextColor(60, 10, 10);
            const splitReason = pdf.splitTextToSize(record.rejectionReason, pageWidth - 35);
            pdf.text(splitReason, 15, yPosition + 5);

            yPosition += (splitReason.length * 5) + 15;
        } else {
            yPosition = 72;
        }

        // --- DECEASED INFO ---
        yPosition = drawSectionHeader('Deceased Information', yPosition);
        yPosition += 5;

        const deceasedData = [
            { l: 'Full Name', v: `${record.firstName || ''} ${record.middleName || ''} ${record.lastName || ''}`.trim() },
            { l: 'ID/Passport', v: record.idPassportNo || '-' },
            { l: 'Nationality', v: record.nationality || '-' },
            { l: 'Gender', v: record.gender || '-' },
            { l: 'Age', v: record.age ? `${record.age} years (${record.ageCategory})` : '-' },
            { l: 'Date of Death', v: record.dateOfDeath ? formatDate(record.dateOfDeath) : '-' },
            { l: 'Date of Burial', v: record.dateOfBurial ? formatDate(record.dateOfBurial) : '-' }
        ];

        let leftY = yPosition;
        let rightY = yPosition;

        deceasedData.forEach((item, i) => {
            if (i % 2 === 0) {
                leftY = drawRow(item.l, item.v, leftY, 16, 35);
            } else {
                rightY = drawRow(item.l, item.v, rightY, pageWidth / 2 + 5, 35);
            }
        });

        yPosition = Math.max(leftY, rightY) + 8;

        // --- NEXT OF KIN ---
        yPosition = drawSectionHeader('Next of Kin', yPosition);
        yPosition += 5;
        yPosition = drawRow('Name', record.nextOfKinName || '-', yPosition, 16, 35);
        yPosition = drawRow('Relationship', record.nextOfKinRelationship || '-', yPosition, 16, 35);
        yPosition = drawRow('Contact', record.nextOfKinContact || '-', yPosition, 16, 35);
        if (record.nextOfKinIdPassport) {
            yPosition = drawRow('ID/Passport', record.nextOfKinIdPassport, yPosition, 16, 35);
        }
        yPosition += 5;

        // --- BURIAL & SERVICE DETAILS ---
        yPosition = drawSectionHeader('Burial & Services', yPosition);
        yPosition += 5;
        yPosition = drawRow('Location', record.burialLocation || '-', yPosition, 16, 35);
        yPosition = drawRow('Primary Service', record.primaryService || '-', yPosition, 16, 35);
        yPosition = drawRow('Amount Payable', `KES ${parseInt(record.amountPayableBurial || 0).toLocaleString()}`, yPosition, 16, 35);
        yPosition += 5;

        // --- PAYMENT INFO ---
        if (record.receiptNo || record.tempReceiptNo || record.mpesaRefNo) {
            yPosition = drawSectionHeader('Payment Verification', yPosition);
            yPosition += 5;
            if (record.status === 'Verified' && record.receiptNo) {
                yPosition = drawRow('Official Receipt No', record.receiptNo, yPosition, 16, 45);
                if (record.tempReceiptNo) {
                    yPosition = drawRow('Temp Receipt Ref', record.tempReceiptNo, yPosition, 16, 45);
                }
            } else {
                yPosition = drawRow('Temp Receipt No', record.tempReceiptNo || record.receiptNo, yPosition, 16, 45);
            }
            if (record.mpesaRefNo) yPosition = drawRow('M-Pesa Reference', record.mpesaRefNo, yPosition, 16, 45);
            yPosition += 8;
        }

        // --- BURIAL PERMIT DETAILS ---
        if (record.burialPermitNumber) {
            yPosition = drawSectionHeader('Burial Permit Details', yPosition);
            yPosition += 5;
            yPosition = drawRow('Permit No', record.burialPermitNumber || '-', yPosition, 16, 45);
            yPosition = drawRow('Date of Issue', record.burialPermitDate ? formatDate(record.burialPermitDate) : '-', yPosition, 16, 45);
            yPosition = drawRow('Issued By', record.burialPermitIssuedBy || '-', yPosition, 16, 45);
            yPosition = drawRow('Issued By Contact', record.burialPermitIssuedByContact || '-', yPosition, 16, 45);
            yPosition = drawRow('Issued To', record.burialPermitIssuedTo || '-', yPosition, 16, 45);
            yPosition = drawRow('Recipient Contact', record.burialPermitIssuedToContact || '-', yPosition, 16, 45);
            yPosition += 5;
        }

        // --- APPLICANT DETAILS ---
        const applicantName = record.applicantName || record.submitterName;
        const applicantEmail = record.applicantEmail || record.submitterEmail;
        const applicantPhone = record.applicantPhone || record.submitterPhone;
        const applicantId = record.applicantId;
        const applicantIdPassport = record.applicantIdPassport || record.applicantIdPassportNo;

        if (applicantName || applicantEmail || applicantId) {
            yPosition = drawSectionHeader('Applicant Details', yPosition);
            yPosition += 5;
            if (applicantId) yPosition = drawRow('Applicant ID', applicantId, yPosition, 16, 35);
            yPosition = drawRow('Name', applicantName || '-', yPosition, 16, 35);
            yPosition = drawRow('ID/Passport', applicantIdPassport || '-', yPosition, 16, 35);
            yPosition = drawRow('Email', applicantEmail || '-', yPosition, 16, 35);
            yPosition = drawRow('Phone', applicantPhone || '-', yPosition, 16, 35);
            yPosition += 5;
        }

        // --- ADDITIONAL RECORD DETAILS ---
        const fieldsToExclude = [
            'firstName', 'middleName', 'lastName', 'idPassportNo', 'nationality', 'gender', 'age', 'ageCategory',
            'dateOfDeath', 'dateOfBurial', 'nextOfKinName', 'nextOfKinRelationship', 'nextOfKinContact', 'nextOfKinIdPassport',
            'burialLocation', 'primaryService', 'amountPayableBurial', 'receiptNo', 'tempReceiptNo', 'mpesaRefNo',
            'burialPermitNumber', 'burialPermitDate', 'burialPermitIssuedBy', 'burialPermitIssuedByContact',
            'burialPermitIssuedTo', 'burialPermitIssuedToContact', 'applicantName', 'applicantEmail', 'applicantPhone',
            'applicantId', 'applicantIdPassport', 'applicantIdPassportNo', 'submitterName', 'submitterEmail', 'submitterPhone',
            'attachments', 'status', 'termsAccepted', '_id', 'id', 'createdAt', 'updatedAt', '__v'
        ];

        const additionalFields = [];
        Object.keys(record).forEach(key => {
            const value = record[key];
            if (!fieldsToExclude.includes(key) && value && typeof value !== 'object') {
                additionalFields.push({ key, value });
            }
        });

        if (additionalFields.length > 0) {
            yPosition = drawSectionHeader('Additional Details', yPosition);
            yPosition += 5;

            additionalFields.forEach(field => {
                const label = field.key
                    .replace(/([A-Z])/g, ' $1')
                    .replace(/^./, str => str.toUpperCase())
                    .trim();

                let displayValue = field.value;
                if (typeof field.value === 'string' && field.value.match(/^\d{4}-\d{2}-\d{2}/)) {
                    displayValue = formatDate(field.value);
                }

                yPosition = drawRow(label, displayValue, yPosition, 16, 45);
            });
            yPosition += 5;
        }

        // --- ATTACHMENTS PREVIEW ---
        if (record.attachments && record.attachments.length > 0) {
            yPosition = drawSectionHeader('Documents & Attachments', yPosition);
            yPosition += 8;

            const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

            for (const att of record.attachments) {
                const filename = att.filename || 'Attachment';
                const originalUrl = att.path.startsWith('http') ? att.path : `${API_BASE_URL}/${att.path.replace(/^\//, '')}`;
                const fullUrl = `${API_BASE_URL}/upload/image-proxy?url=${encodeURIComponent(originalUrl)}`;

                const cleanPath = att.path.split('?')[0];
                const extension = cleanPath.split('.').pop().toLowerCase();
                const isImageFile = ['jpg', 'jpeg', 'png', 'webp'].includes(extension);

                yPosition = checkPageBreak(yPosition, 20);

                if (isImageFile) {
                    try {
                        const base64Data = await loadImageBase64(fullUrl);
                        const img = new Image();
                        await new Promise((resolve, reject) => {
                            img.onload = resolve;
                            img.onerror = reject;
                            img.src = base64Data;
                        });

                        const maxWidth = pageWidth - 32;
                        const scale = maxWidth / img.width;
                        const displayWidth = maxWidth;
                        const displayHeight = img.height * scale;

                        yPosition = checkPageBreak(yPosition, displayHeight + 15);

                        pdf.setTextColor(...COLORS.text);
                        pdf.setFontSize(9);
                        pdf.setFont(undefined, 'bold');
                        pdf.text(`${filename} (Image Preview):`, 16, yPosition);
                        yPosition += 6;

                        pdf.addImage(base64Data, extension.toUpperCase() === 'JPG' ? 'JPEG' : 'PNG', 16, yPosition, displayWidth, displayHeight);
                        yPosition += displayHeight + 12;
                    } catch (imgErr) {
                        pdf.setTextColor(220, 38, 38);
                        pdf.setFontSize(9);
                        pdf.text(`• ${filename} [Failed to load image preview]`, 16, yPosition);
                        pdf.setTextColor(37, 99, 235);
                        pdf.textWithLink('  (View Online)', 16 + pdf.getTextWidth(`• ${filename} [Failed to load image preview]`), yPosition, { url: fullUrl });
                        yPosition += 10;
                    }
                } else if (extension === 'pdf') {
                    // Visual Box for PDF since we can't embed it directly
                    yPosition = checkPageBreak(yPosition, 25);

                    pdf.setDrawColor(...COLORS.border);
                    pdf.setFillColor(...COLORS.secondary);
                    pdf.roundedRect(16, yPosition, pageWidth - 32, 20, 2, 2, 'FD');

                    pdf.setTextColor(...COLORS.primary);
                    pdf.setFontSize(10);
                    pdf.setFont(undefined, 'bold');
                    pdf.text('PDF DOCUMENT', 24, yPosition + 8);

                    pdf.setTextColor(...COLORS.text);
                    pdf.setFontSize(9);
                    pdf.setFont(undefined, 'normal');
                    pdf.text(filename, 24, yPosition + 14);

                    pdf.setTextColor(37, 99, 235);
                    pdf.setFont(undefined, 'bold');
                    const linkText = 'VIEW ATTACHED PDF';
                    pdf.textWithLink(linkText, pageWidth - 24 - pdf.getTextWidth(linkText), yPosition + 12, { url: fullUrl });

                    yPosition += 28;
                } else {
                    pdf.setTextColor(...COLORS.text);
                    pdf.setFontSize(9);
                    pdf.text(`• ${filename}`, 16, yPosition);
                    pdf.setTextColor(37, 99, 235);
                    pdf.textWithLink('  (View Document)', 16 + pdf.getTextWidth(`• ${filename}`), yPosition, { url: fullUrl });
                    yPosition += 10;
                }
            }
            yPosition += 5;
            yPosition += 5;
        }

        // --- FOOTER ---
        const footerY = pageHeight - 25;
        pdf.setFillColor(248, 250, 252);
        pdf.rect(0, footerY, pageWidth, 25, 'F');
        pdf.setDrawColor(...COLORS.primary);
        pdf.setLineWidth(0.5);
        pdf.line(0, footerY, pageWidth, footerY);

        pdf.setFontSize(8);
        pdf.setTextColor(...COLORS.subtext);
        pdf.text('This document is a computer-generated official acknowledgement.', pageWidth / 2, footerY + 8, { align: 'center' });
        pdf.text('Islamia School & Mosque Association Burial Application', pageWidth / 2, footerY + 13, { align: 'center' });

        const filename = `Acknowledgement-${new Date().getTime()}.pdf`;
        pdf.save(filename);

        return { success: true, filename };
    } catch (err) {
        console.error('Error generating acknowledgement PDF:', err);
        throw err;
    }
};
