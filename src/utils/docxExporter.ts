/**
 * Exports Communist Party document text into a Word-compatible HTML/DOC file
 * with standard Hướng dẫn số 05-HD/VPTW ngày 27/5/2026 formatting:
 * - Font: Tinos / Times New Roman
 * - Line spacing: 1.15 to 1.3
 * - Margins: Top 20-25mm, Bottom 20-25mm, Left 30-35mm, Right 15-20mm
 */
export function exportToWordDocument(title: string, content: string) {
  // Convert line breaks and paragraph spacing
  const paragraphs = content
    .split('\n')
    .map((line) => {
      const trimmed = line.trim();
      if (!trimmed) {
        return '<p style="margin: 0; line-height: 1.2;">&nbsp;</p>';
      }

      // Detect Party Motto
      if (trimmed.includes('ĐẢNG CỘNG SẢN VIỆT NAM')) {
        return `<p style="text-align: right; font-weight: bold; font-size: 13pt; margin: 0 0 2pt 0; text-transform: uppercase;">${trimmed}</p>`;
      }
      if (/^.+,\s*ngày\s+\d+\s+tháng\s+\d+\s+năm\s+\d+/i.test(trimmed)) {
        return `<p style="text-align: right; font-style: italic; font-size: 13pt; margin: 0 0 12pt 0;">${trimmed}</p>`;
      }

      // Detect Party Document title (NGHỊ QUYẾT, QUYẾT ĐỊNH, HƯỚNG DẪN, QUY ĐỊNH...)
      if (/^(NGHỊ QUYẾT|QUYẾT ĐỊNH|HƯỚNG DẪN|QUY ĐỊNH|KẾ HOẠCH|KẾT LUẬN|THÔNG BÁO|TỜ TRÌNH|BÁO CÁO|BIÊN BẢN|CHỈ THỊ)/.test(trimmed)) {
        return `<p style="text-align: center; font-weight: bold; font-size: 14pt; margin: 16pt 0 4pt 0; text-transform: uppercase;">${trimmed}</p>`;
      }

      // Detect Subject / Trích yếu
      if (/^(Về việc|về việc|V\/v|về|Về)/.test(trimmed) && trimmed.length < 150) {
        return `<p style="text-align: center; font-weight: bold; font-size: 13pt; margin: 0 0 12pt 0;">${trimmed}<br/><span style="display:inline-block; border-bottom: 1pt solid black; width: 60pt; height: 1pt;"></span></p>`;
      }

      // Legal basis (Căn cứ...)
      if (/^Căn cứ/i.test(trimmed)) {
        return `<p style="font-style: italic; font-size: 13pt; margin: 3pt 0; text-align: justify; text-indent: 1cm;">${trimmed}</p>`;
      }

      // Articles or Sections (Điều 1, I., II...)
      if (/^Điều \d+\./.test(trimmed)) {
        return `<p style="font-size: 13pt; margin: 6pt 0 3pt 0; text-align: justify; text-indent: 1cm;"><strong style="font-weight: bold;">${trimmed.slice(0, trimmed.indexOf('.') + 1)}</strong>${trimmed.slice(trimmed.indexOf('.') + 1)}</p>`;
      }

      // Signer authority
      if (/^(T\/M|TM\.|K\/T|KT\.|BÍ THƯ|PHÓ BÍ THƯ|CHÁNH VĂN PHÒNG)/.test(trimmed)) {
        return `<p style="text-align: right; font-weight: bold; font-size: 13pt; margin: 8pt 0 2pt 0;">${trimmed}</p>`;
      }

      // Recipient
      if (/^Nơi nhận:/i.test(trimmed)) {
        return `<p style="font-weight: bold; font-style: italic; font-size: 12pt; margin: 12pt 0 2pt 0;">${trimmed}</p>`;
      }

      // Normal paragraph
      return `<p style="font-size: 13pt; margin: 4pt 0; text-align: justify; text-indent: 1cm; line-height: 1.35;">${trimmed}</p>`;
    })
    .join('');

  const html = `
<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset='utf-8'>
  <title>${title}</title>
  <style>
    @page Section1 {
      size: 595.3pt 841.9pt; /* A4 */
      margin: 56.7pt 42.5pt 56.7pt 85.05pt; /* Top 20mm, Right 15mm, Bottom 20mm, Left 30mm */
      mso-header-margin: 35.4pt;
      mso-footer-margin: 35.4pt;
      mso-paper-source: 0;
    }
    div.Section1 { page: Section1; }
    body {
      font-family: 'Times New Roman', Times, serif;
      font-size: 13pt;
      color: #000;
      line-height: 1.35;
    }
  </style>
</head>
<body>
  <div class="Section1">
    ${paragraphs}
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
