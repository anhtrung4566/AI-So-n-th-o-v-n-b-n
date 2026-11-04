/**
 * Exports Communist Party document text into a Word-compatible HTML/DOC file
 * with 100% strict adherence to Hướng dẫn số 05-HD/VPTW ngày 27/5/2026:
 * - Real 2-column Header Table (Cơ quan ban hành / Số ký hiệu & Tiêu ngữ / Địa danh ngày tháng)
 * - Exact underlines (kẻ chỉ phân cách)
 * - Exact 2-column Footer Table (Nơi nhận & Thẩm quyền ký / Chức vụ / Chữ ký / Họ tên)
 * - Font: Times New Roman
 * - Line spacing: 1.35
 * - Margins: Top 20mm, Bottom 20mm, Left 30mm, Right 15mm
 */
import { parsePartyDocumentText, generatePartyDocumentHtml } from './partyDocumentFormatter';

export function exportToWordDocument(title: string, content: string) {
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
      margin: 56.7pt 42.5pt 56.7pt 85.05pt; /* Trên 20mm (56.7pt), Dưới 20mm (56.7pt), Trái 30mm (85.05pt), Phải 15mm (42.5pt) */
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
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const fileName = `${title.replace(/[^a-zA-Z0-9_\u00C0-\u024F\u1EA0-\u1EF9-]/g, '_')}_ChuanHD05_TW.doc`;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}
