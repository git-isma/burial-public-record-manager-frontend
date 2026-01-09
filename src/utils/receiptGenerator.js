import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateReceiptPDF = (record, formatDate) => {
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

        // Helper to draw section header
        const drawSectionHeader = (title, y) => {
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
        // Header Background
        pdf.setFillColor(...COLORS.primary);
        pdf.rect(0, 0, pageWidth, 40, 'F');

        // Logo/Brand Name
        pdf.setTextColor(...COLORS.white);
        pdf.setFontSize(22);
        pdf.setFont(undefined, 'bold');
        pdf.text('BURIAL RECORD', 15, 20);
        
        pdf.setFontSize(10);
        pdf.setFont(undefined, 'normal');
        pdf.setTextColor(200, 200, 255);
        pdf.text('OFFICIAL ACKNOWLEDGEMENT RECEIPT', 15, 28);

        // Date on Right
        pdf.setFontSize(9);
        pdf.setTextColor(255, 255, 255);
        pdf.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth - 15, 20, { align: 'right' });
        pdf.text(`Time: ${new Date().toLocaleTimeString()}`, pageWidth - 15, 28, { align: 'right' });

        yPosition = 55;

        // --- STATUS BADGE ---
        const statusColors = {
            'Pending': [245, 158, 11],
            'Completed': [59, 130, 246],
            'Verified': [16, 185, 129],
            'Rejected': [220, 38, 38]
        };
        const statusColor = statusColors[record.status] || [107, 114, 128];
        
        // Draw Status Box
        let statusText = (record.status || 'Pending').toUpperCase();
        if (statusText === 'PENDING') statusText = 'PENDING VERIFICATION';

        pdf.setFontSize(10);
        pdf.setFont(undefined, 'bold');
        
        const textWidth = pdf.getTextWidth(statusText);
        const boxWidth = textWidth + 16; // Add generous padding
        const boxX = pageWidth - boxWidth - 15; // Align from right edge
        
        pdf.setDrawColor(...statusColor);
        pdf.setFillColor(statusColor[0], statusColor[1], statusColor[2], 0.1); // Light tint
        pdf.roundedRect(boxX, 45, boxWidth, 10, 2, 2, 'FD');
        
        pdf.setTextColor(...statusColor);
        pdf.text(statusText, boxX + (boxWidth / 2), 51.5, { align: 'center' });

        // Rejection Reason special handling
        if (record.status === 'Rejected' && record.rejectionReason) {
            yPosition += 5;
            pdf.setFillColor(254, 242, 242);
            pdf.setDrawColor(254, 202, 202);
            pdf.rect(15, yPosition, pageWidth - 30, 0, 'F'); // Just setting pos
            
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
            yPosition = 65;
        }

        // --- DECEASED INFO ---
        yPosition = drawSectionHeader('Deceased Information', yPosition);
        yPosition += 5;
        
        const deceasedData = [
            { l: 'Full Name', v: `${record.firstName || ''} ${record.middleName || ''} ${record.lastName || ''}`.trim() },
            { l: 'ID/Passport', v: record.idPassportNo || '-' },
            { l: 'Gender', v: record.gender || '-' },
            { l: 'Age', v: record.age ? `${record.age} years (${record.ageCategory})` : '-' },
            { l: 'Date of Death', v: record.dateOfDeath ? formatDate(record.dateOfDeath) : '-' },
            { l: 'Date of Burial', v: record.dateOfBurial ? formatDate(record.dateOfBurial) : '-' }
        ];

        // 2-Column Layout for Deceased
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

        // Table-like structure for services
        const startY = yPosition;
        
        drawRow('Location', record.burialLocation || '-', yPosition, 16, 35);
        yPosition += 6;

        const services = [
            { type: 'Primary', name: record.primaryService, cost: record.amountPaidBurial },
            { type: 'Secondary', name: record.secondaryService, cost: record.amountPaidSecondary },
            { type: 'Other', name: record.tertiaryService, cost: record.amountPaidTertiary },
        ].filter(s => s.name); 

        // Simple table header
        pdf.setFillColor(245, 245, 245);
        pdf.rect(16, yPosition, pageWidth - 32, 6, 'F');
        pdf.setTextColor(...COLORS.subtext);
        pdf.setFontSize(8);
        pdf.setFont(undefined, 'bold');
        pdf.text('SERVICE TYPE', 20, yPosition + 4);
        pdf.text('DETAILS', 70, yPosition + 4);
        pdf.text('AMOUNT', pageWidth - 40, yPosition + 4);
        yPosition += 10;

        let totalAmount = 0;

        services.forEach(svc => {
            pdf.setTextColor(...COLORS.text);
            pdf.setFontSize(9);
            pdf.setFont(undefined, 'normal');
            
            pdf.text(svc.type, 20, yPosition);
            pdf.text(svc.name || '-', 70, yPosition);
            
            const cost = parseInt(svc.cost || 0);
            totalAmount += cost;
            pdf.text(`KES ${cost.toLocaleString()}`, pageWidth - 40, yPosition);
            
            yPosition += 7;
        });

        // Total Line
        pdf.setDrawColor(...COLORS.border);
        pdf.line(16, yPosition - 2, pageWidth - 16, yPosition - 2);
        yPosition += 2;
        pdf.setFont(undefined, 'bold');
        pdf.text('TOTAL PAID', 70, yPosition + 4);
        pdf.text(`KES ${totalAmount.toLocaleString()}`, pageWidth - 40, yPosition + 4);
        yPosition += 15;


        // --- PAYMENT INFO ---
        if (record.receiptNo || record.mpesaRefNo) {
            yPosition = drawSectionHeader('Payment Verification', yPosition);
            yPosition += 5;
            
            let leftY_pay = yPosition; 
            let rightY_pay = yPosition;

            if (record.receiptNo) leftY_pay = drawRow('Receipt No', record.receiptNo, leftY_pay, 16, 35);
            if (record.mpesaRefNo) rightY_pay = drawRow('M-Pesa Ref', record.mpesaRefNo, rightY_pay, pageWidth / 2 + 5, 35);
            
            yPosition = Math.max(leftY_pay, rightY_pay) + 8;
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

        // --- SUBMITTER ---
        const applicantName = record.applicantName || record.submitterName;
        const applicantEmail = record.applicantEmail || record.submitterEmail;
        const applicantPhone = record.applicantPhone || record.submitterPhone;

        if (applicantName || applicantEmail) {
            yPosition = drawSectionHeader('Applicant Details', yPosition);
            yPosition += 5;
            
            yPosition = drawRow('Name', applicantName || '-', yPosition, 16, 35);
            yPosition = drawRow('Email', applicantEmail || '-', yPosition, 16, 35);
            yPosition = drawRow('Phone', applicantPhone || '-', yPosition, 16, 35);
            yPosition += 5;
        }


        // --- ATTACHMENTS ---
        if (record.attachments && record.attachments.length > 0) {
            if (yPosition > pageHeight - 60) {
                pdf.addPage();
                yPosition = 20;
            }

            yPosition = drawSectionHeader('Attachments', yPosition);
            yPosition += 8;

            const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

            record.attachments.forEach((att, index) => {
                const filename = att.filename || `Document ${index + 1}`;
                const fullUrl = `${API_BASE_URL}/${att.path.replace(/^\//, '')}`;
                
                pdf.setTextColor(37, 99, 235); // Link Color
                pdf.setFontSize(9);
                pdf.setFont(undefined, 'normal');
                pdf.textWithLink(`• ${filename}`, 16, yPosition, { url: fullUrl }); // Just filename
                
                // Add an explicit 'View' text next to it for clarity
                pdf.setFontSize(8);
                pdf.setTextColor(...COLORS.subtext);
                pdf.text('(Click to view)', 16 + pdf.getTextWidth(`• ${filename}`) + 2, yPosition);

                yPosition += 6;
            });
            yPosition += 10;
        }


        // --- FOOTER ---
        const footerY = pageHeight - 25;
        pdf.setFillColor(248, 250, 252); // Very light footer bg
        pdf.rect(0, footerY, pageWidth, 25, 'F');
        
        pdf.setDrawColor(...COLORS.primary);
        pdf.setLineWidth(0.5);
        pdf.line(0, footerY, pageWidth, footerY);

        pdf.setFontSize(8);
        pdf.setTextColor(...COLORS.subtext);
        pdf.text('This document is a computer-generated official receipt.', pageWidth / 2, footerY + 8, { align: 'center' });
        pdf.text('Burial Record Management System', pageWidth / 2, footerY + 13, { align: 'center' });
        
        const filename = `Receipt-${new Date().getTime()}.pdf`;
        pdf.save(filename);

        return { success: true, filename };
    } catch (err) {
        console.error('Error generating receipt PDF:', err);
        throw err;
    }
};
