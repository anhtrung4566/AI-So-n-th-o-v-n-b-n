/**
 * Communist Party Document Word Exporter (.docx & .doc)
 * Implements 100% strict adherence to:
 * - Hướng dẫn số 05-HD/VPTW ngày 27/5/2026 của Văn phòng Trung ương Đảng
 * - Quy định số 399-QĐ/TW ngày 09/01/2026 của Ban Bí thư
 *
 * Generates genuine native Office Open XML (.docx) files using 'docx' library
 * with native 2-column borderless tables, exact 20mm/15mm/20mm/30mm A4 margins,
 * Times New Roman font, proper paragraph indentation, and clean metadata.
 */

import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
} from 'docx';
import { saveAs } from 'file-saver';
import { parsePartyDocumentText, ParsedPartyDocument, generatePartyDocumentHtml } from './partyDocumentFormatter';

const noBorder = { style: BorderStyle.NONE, size: 0, color: 'auto' };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };

/**
 * Builds a native OpenXML Word Document (.docx) strictly following Hướng dẫn 05-HD/VPTW
 */
export async function buildPartyDocxDocument(parsed: ParsedPartyDocument, title: string): Promise<Blob> {
  const children: (Paragraph | Table)[] = [];

  // 1. Header Table (2 columns: Org & Doc Number on Left 45%, Motto & Place/Date on Right 55%)
  const leftCellParagraphs: Paragraph[] = [];

  if (parsed.parentOrg) {
    leftCellParagraphs.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 20 },
        children: [
          new TextRun({
            text: parsed.parentOrg,
            font: 'Times New Roman',
            size: 24, // 12pt
          }),
        ],
      })
    );
  }

  leftCellParagraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 20 },
      children: [
        new TextRun({
          text: parsed.issuingOrg,
          bold: true,
          font: 'Times New Roman',
          size: 24, // 12pt
        }),
      ],
    })
  );

  // Short divider line under issuing org
  leftCellParagraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 40 },
      children: [
        new TextRun({
          text: '----------',
          bold: true,
          font: 'Times New Roman',
          size: 18,
        }),
      ],
    })
  );

  leftCellParagraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 20 },
      children: [
        new TextRun({
          text: parsed.docNumber,
          font: 'Times New Roman',
          size: 24, // 12pt
        }),
      ],
    })
  );

  // If Công văn, render subject under docNumber in left column
  if (parsed.isCongVan && parsed.subject) {
    const cvSubject = parsed.subject.startsWith('V/v') || parsed.subject.startsWith('Về việc')
      ? parsed.subject
      : `V/v ${parsed.subject}`;
    leftCellParagraphs.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 40, after: 20 },
        children: [
          new TextRun({
            text: cvSubject,
            italics: true,
            font: 'Times New Roman',
            size: 22, // 11pt
          }),
        ],
      })
    );
  }

  // Right column paragraphs
  const rightCellParagraphs: Paragraph[] = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 20 },
      children: [
        new TextRun({
          text: 'ĐẢNG CỘNG SẢN VIỆT NAM',
          bold: true,
          font: 'Times New Roman',
          size: 25, // 12.5pt
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 40 },
      children: [
        new TextRun({
          text: '-----------------------',
          bold: true,
          font: 'Times New Roman',
          size: 18,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 20 },
      children: [
        new TextRun({
          text: parsed.placeDate,
          italics: true,
          font: 'Times New Roman',
          size: 26, // 13pt
        }),
      ],
    }),
  ];

  const headerTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: noBorders,
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 45, type: WidthType.PERCENTAGE },
            borders: noBorders,
            children: leftCellParagraphs,
          }),
          new TableCell({
            width: { size: 55, type: WidthType.PERCENTAGE },
            borders: noBorders,
            children: rightCellParagraphs,
          }),
        ],
      }),
    ],
  });

  children.push(headerTable);

  // 2. Title & Subject Section
  if (parsed.isCongVan) {
    if (parsed.congVanRecipient) {
      children.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 240, after: 200 },
          children: [
            new TextRun({
              text: `Kính gửi: ${parsed.congVanRecipient}`,
              bold: true,
              font: 'Times New Roman',
              size: 26, // 13pt
            }),
          ],
        })
      );
    } else {
      children.push(new Paragraph({ spacing: { before: 160 } }));
    }
  } else {
    // Non-Công văn document (Nghị quyết, Quyết định, Hướng dẫn, Kế hoạch, Tờ trình...)
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 300, after: 80 },
        children: [
          new TextRun({
            text: parsed.docType,
            bold: true,
            font: 'Times New Roman',
            size: 28, // 14pt
          }),
        ],
      })
    );

    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 40, after: 60 },
        children: [
          new TextRun({
            text: parsed.subject,
            bold: true,
            font: 'Times New Roman',
            size: 26, // 13pt
          }),
        ],
      })
    );

    // Divider under subject
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 200 },
        children: [
          new TextRun({
            text: '-----',
            bold: true,
            font: 'Times New Roman',
            size: 22,
          }),
        ],
      })
    );

    if (parsed.congVanRecipient) {
      children.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 80, after: 180 },
          children: [
            new TextRun({
              text: `Kính gửi: ${parsed.congVanRecipient}`,
              bold: true,
              font: 'Times New Roman',
              size: 26,
            }),
          ],
        })
      );
    }
  }

  // 3. Legal Bases (Căn cứ...)
  if (parsed.bases && parsed.bases.length > 0) {
    for (const basis of parsed.bases) {
      children.push(
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          indent: { firstLine: 567 }, // 1.0 cm indent
          spacing: { line: 324, before: 40, after: 40 }, // 1.35x line spacing
          children: [
            new TextRun({
              text: basis,
              italics: true,
              font: 'Times New Roman',
              size: 26, // 13pt
            }),
          ],
        })
      );
    }
  }

  // 4. Body Paragraphs
  for (const para of parsed.bodyParagraphs) {
    const trimmed = para.trim();
    if (!trimmed) {
      children.push(new Paragraph({ spacing: { before: 60, after: 60 } }));
      continue;
    }

    // Heading: BAN CHẤP HÀNH QUYẾT NGHỊ:, BAN THƯỜNG VỤ QUYẾT ĐỊNH:
    if (/^(BAN CHẤP HÀNH|BAN THƯỜNG VỤ|ĐẢNG ỦY)[\s\w]+(QUYẾT NGHỊ|QUYẾT ĐỊNH):/i.test(trimmed)) {
      children.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 200, after: 120 },
          children: [
            new TextRun({
              text: trimmed,
              bold: true,
              font: 'Times New Roman',
              size: 26,
            }),
          ],
        })
      );
      continue;
    }

    // Heading Roman: I. QUAN ĐIỂM..., II. MỤC TIÊU...
    if (/^[I|V|X]+\.\s+/i.test(trimmed)) {
      children.push(
        new Paragraph({
          alignment: AlignmentType.LEFT,
          indent: { firstLine: 567 },
          spacing: { before: 180, after: 80 },
          children: [
            new TextRun({
              text: trimmed,
              bold: true,
              font: 'Times New Roman',
              size: 26,
            }),
          ],
        })
      );
      continue;
    }

    // Article: Điều 1. ...
    if (/^Điều \d+\./.test(trimmed)) {
      const dotIndex = trimmed.indexOf('.');
      const articleLabel = trimmed.slice(0, dotIndex + 1);
      const articleContent = trimmed.slice(dotIndex + 1);

      children.push(
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          indent: { firstLine: 567 },
          spacing: { line: 324, before: 80, after: 60 },
          children: [
            new TextRun({
              text: articleLabel,
              bold: true,
              font: 'Times New Roman',
              size: 26,
            }),
            new TextRun({
              text: articleContent,
              font: 'Times New Roman',
              size: 26,
            }),
          ],
        })
      );
      continue;
    }

    // Standard body paragraph
    children.push(
      new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        indent: { firstLine: 567 },
        spacing: { line: 324, before: 60, after: 60 },
        children: [
          new TextRun({
            text: trimmed,
            font: 'Times New Roman',
            size: 26, // 13pt
          }),
        ],
      })
    );
  }

  // 5. Footer Table (Nơi nhận on Left 48%, Signer on Right 52%)
  const recipientParagraphs: Paragraph[] = [
    new Paragraph({
      spacing: { before: 0, after: 40 },
      children: [
        new TextRun({
          text: 'Nơi nhận:',
          bold: true,
          italics: true,
          font: 'Times New Roman',
          size: 22, // 11pt
        }),
      ],
    }),
  ];

  for (const r of parsed.recipients) {
    recipientParagraphs.push(
      new Paragraph({
        spacing: { line: 240, before: 15, after: 15 },
        children: [
          new TextRun({
            text: r,
            font: 'Times New Roman',
            size: 21, // 10.5pt
          }),
        ],
      })
    );
  }

  const signerParagraphs: Paragraph[] = [];
  if (parsed.signerAuthority) {
    signerParagraphs.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 30 },
        children: [
          new TextRun({
            text: parsed.signerAuthority,
            bold: true,
            font: 'Times New Roman',
            size: 26, // 13pt
          }),
        ],
      })
    );
  }

  if (parsed.signerRole) {
    signerParagraphs.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 30 },
        children: [
          new TextRun({
            text: parsed.signerRole,
            bold: true,
            font: 'Times New Roman',
            size: 26, // 13pt
          }),
        ],
      })
    );
  }

  // Blank signature space (approx 45-50pt)
  signerParagraphs.push(
    new Paragraph({
      spacing: { before: 900 },
    })
  );

  signerParagraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 0 },
      children: [
        new TextRun({
          text: parsed.signerName,
          bold: true,
          font: 'Times New Roman',
          size: 26, // 13pt
        }),
      ],
    })
  );

  const footerTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: noBorders,
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 48, type: WidthType.PERCENTAGE },
            borders: noBorders,
            children: recipientParagraphs,
          }),
          new TableCell({
            width: { size: 52, type: WidthType.PERCENTAGE },
            borders: noBorders,
            children: signerParagraphs,
          }),
        ],
      }),
    ],
  });

  children.push(new Paragraph({ spacing: { before: 240 } }));
  children.push(footerTable);

  const doc = new Document({
    title: title || 'Văn bản của Đảng Chuẩn Hướng dẫn 05-HD/VPTW',
    description: 'Văn bản được tạo chuẩn thể thức Hướng dẫn số 05-HD/VPTW ngày 27/5/2026 và Quy định số 399-QĐ/TW',
    sections: [
      {
        properties: {
          page: {
            size: {
              width: 11906, // A4 width: 210mm
              height: 16838, // A4 height: 297mm
            },
            margin: {
              top: 1134, // 20mm
              bottom: 1134, // 20mm
              left: 1701, // 30mm (chuẩn đóng bìa theo HD 05)
              right: 850, // 15mm
            },
          },
        },
        children,
      },
    ],
  });

  return Packer.toBlob(doc);
}

/**
 * Primary export: Generates true native OpenXML .docx file
 * Works without corruption in Word 2013-2024, Office 365, LibreOffice, WPS, Google Docs.
 */
export async function exportToWordDocument(title: string, content: string): Promise<void> {
  const cleanTitle = (title || 'Van_ban_Dang')
    .replace(/[^a-zA-Z0-9_\u00C0-\u024F\u1EA0-\u1EF9-]/g, '_')
    .slice(0, 60);

  const parsed = parsePartyDocumentText(content);

  try {
    const docxBlob = await buildPartyDocxDocument(parsed, title);
    const fileName = `${cleanTitle}_ChuanHD05_TW.docx`;
    saveAs(docxBlob, fileName);
  } catch (err) {
    console.warn('Native DOCX build error, falling back to clean HTML-DOC export:', err);
    exportToHtmlDoc(title, content);
  }
}

/**
 * Fallback / Alternative: Exports as Word-compatible HTML .doc
 */
export function exportToHtmlDoc(title: string, content: string): void {
  const parsed = parsePartyDocumentText(content);
  const documentBodyHtml = generatePartyDocumentHtml(parsed);

  const html = `
<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset='utf-8'>
  <title>${title}</title>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    @page Section1 {
      size: 595.3pt 841.9pt; /* A4: 210mm x 297mm */
      margin: 56.7pt 42.5pt 56.7pt 85.05pt; /* Trên 20mm, Dưới 20mm, Trái 30mm, Phải 15mm */
      mso-header-margin: 35.4pt;
      mso-footer-margin: 35.4pt;
      mso-paper-source: 0;
    }
    div.Section1 {
      page: Section1;
    }
    body {
      font-family: 'Times New Roman', Times, serif;
      font-size: 13pt;
      color: #000000;
      line-height: 1.35;
      margin: 0;
      padding: 0;
    }
    table {
      border-collapse: collapse;
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    p {
      margin: 4pt 0;
      line-height: 1.35;
    }
  </style>
</head>
<body>
  <div class="Section1">
    ${documentBodyHtml}
  </div>
</body>
</html>
`;

  const blob = new Blob(['\ufeff', html], {
    type: 'application/msword;charset=utf-8',
  });
  const cleanTitle = (title || 'Van_ban_Dang')
    .replace(/[^a-zA-Z0-9_\u00C0-\u024F\u1EA0-\u1EF9-]/g, '_')
    .slice(0, 60);
  const fileName = `${cleanTitle}_ChuanHD05_TW.doc`;
  saveAs(blob, fileName);
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}
