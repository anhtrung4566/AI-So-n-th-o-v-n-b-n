/**
 * Party Document Structure Parser & HTML / Word Formatter
 * Implements strict compliance with:
 * - Hướng dẫn số 05-HD/VPTW ngày 27/5/2026 của Văn phòng Trung ương Đảng về thể thức và kỹ thuật trình bày văn bản của Đảng
 * - Quy định số 399-QĐ/TW ngày 09/01/2026 của Ban Bí thư Trung ương Đảng về thể loại, thẩm quyền ban hành và thể thức văn bản của Đảng
 */

export interface ParsedPartyDocument {
  parentOrg: string;
  issuingOrg: string;
  docNumber: string;
  motto: string;
  placeDate: string;
  docType: string;
  subject: string;
  isCongVan: boolean;
  congVanRecipient: string;
  bases: string[];
  bodyParagraphs: string[];
  recipients: string[];
  signerAuthority: string;
  signerRole: string;
  signerName: string;
}

/**
 * Strips markdown markup (bold, italic, code markers) while preserving text
 */
function cleanMarkdown(str: string): string {
  return str
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/^#+\s+/g, '')
    .trim();
}

/**
 * Parses any Party document plain text into structured elements according to Hướng dẫn 05-HD/VPTW
 */
export function parsePartyDocumentText(content: string): ParsedPartyDocument {
  const rawLines = (content || '')
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  let parentOrg = '';
  let issuingOrg = '';
  let docNumber = '';
  const motto = 'ĐẢNG CỘNG SẢN VIỆT NAM';
  let placeDate = '';
  let docType = '';
  let subject = '';
  let isCongVan = false;
  let congVanRecipient = '';
  const bases: string[] = [];
  const bodyParagraphs: string[] = [];
  const recipients: string[] = [];
  let signerAuthority = '';
  let signerRole = '';
  let signerName = '';

  const docTypeKeywords = [
    'NGHỊ QUYẾT',
    'QUYẾT ĐỊNH',
    'HƯỚNG DẪN',
    'QUY ĐỊNH',
    'KẾ HOẠCH',
    'KẾT LUẬN',
    'THÔNG BÁO',
    'TỜ TRÌNH',
    'BÁO CÁO',
    'BIÊN BẢN',
    'CHỈ THỊ',
    'CÔNG VĂN',
  ];

  // 1. Locate Footer Boundary from bottom
  let bodyEndIndex = rawLines.length;
  for (let i = rawLines.length - 1; i >= 0; i--) {
    const l = cleanMarkdown(rawLines[i]);
    if (/^Nơi nhận\s*:/i.test(l)) {
      bodyEndIndex = i;
      break;
    }
  }

  // 2. Parse Footer Section (Nơi nhận & Signer)
  const footerLines = rawLines.slice(bodyEndIndex);
  let inRecipients = false;
  let inSigner = false;
  const signerLines: string[] = [];

  for (let i = 0; i < footerLines.length; i++) {
    const rawLine = footerLines[i];
    const cleaned = cleanMarkdown(rawLine);

    // Check if line contains 2 columns (Nơi nhận left, Signer right)
    const parts = rawLine.split(/ {3,}|\t+/);
    if (parts.length >= 2) {
      const left = cleanMarkdown(parts[0]);
      const right = cleanMarkdown(parts.slice(1).join(' '));

      if (left && !/^Nơi nhận\s*:/i.test(left)) {
        recipients.push(left);
      }
      if (right) {
        signerLines.push(right);
      }
      continue;
    }

    if (/^Nơi nhận\s*:/i.test(cleaned)) {
      inRecipients = true;
      inSigner = false;
      continue;
    }

    if (
      /^(T\/M|TM\.|K\/T|KT\.|BÍ THƯ|PHÓ BÍ THƯ|CHÁNH VĂN PHÒNG|PHÓ CHÁNH VĂN PHÒNG|TRƯỞNG BAN|PHÓ TRƯỞNG BAN|CHỦ NHIỆM)/i.test(
        cleaned
      )
    ) {
      inRecipients = false;
      inSigner = true;
      signerLines.push(cleaned);
      continue;
    }

    if (inRecipients) {
      if (cleaned.startsWith('-') || cleaned.startsWith('*') || cleaned.startsWith('+')) {
        recipients.push(cleaned);
      } else {
        recipients.push(cleaned);
      }
    } else if (inSigner) {
      signerLines.push(cleaned);
    }
  }

  // Extract Signer Details
  const cleanSignerLines = signerLines.filter(
    (l) => !l.includes('(Chữ ký') && !l.includes('(Đã ký') && !l.includes('chữ ký')
  );

  if (cleanSignerLines.length >= 3) {
    signerAuthority = cleanSignerLines[0];
    signerRole = cleanSignerLines[1];
    signerName = cleanSignerLines[cleanSignerLines.length - 1];
  } else if (cleanSignerLines.length === 2) {
    if (/^(T\/M|K\/T|TM\.|KT\.)/i.test(cleanSignerLines[0])) {
      signerAuthority = cleanSignerLines[0];
      signerRole = '';
      signerName = cleanSignerLines[1];
    } else {
      signerRole = cleanSignerLines[0];
      signerName = cleanSignerLines[1];
    }
  } else if (cleanSignerLines.length === 1) {
    signerName = cleanSignerLines[0];
  }

  // 3. Locate Header Boundary from top
  let headerEndIndex = 0;
  for (let i = 0; i < Math.min(bodyEndIndex, 12); i++) {
    const l = cleanMarkdown(rawLines[i]);
    const isDocType = docTypeKeywords.some(
      (dt) => l.toUpperCase() === dt || l.toUpperCase().startsWith(dt + ' ')
    );
    const isSubjectCv = /^V\/v\s+/i.test(l) || /^Về việc\s+/i.test(l) || /^Kính gửi\s*:/i.test(l);
    if (isDocType || isSubjectCv) {
      headerEndIndex = i;
      break;
    }
  }
  if (headerEndIndex === 0) {
    headerEndIndex = Math.min(bodyEndIndex, 5);
  }

  const headerLines = rawLines.slice(0, headerEndIndex);
  const middleLines = rawLines.slice(headerEndIndex, bodyEndIndex);

  // 4. Split Header into Left (Orgs, DocNumber) and Right (Motto, PlaceDate)
  const leftHeaderLines: string[] = [];
  const rightHeaderLines: string[] = [];

  for (const hLine of headerLines) {
    const parts = hLine.split(/ {3,}|\t+/);
    if (parts.length >= 2) {
      leftHeaderLines.push(cleanMarkdown(parts[0]));
      rightHeaderLines.push(cleanMarkdown(parts.slice(1).join(' ')));
    } else {
      const t = cleanMarkdown(hLine);
      if (t === '*' || t === '***' || t === '-----') continue;
      if (t.includes('ĐẢNG CỘNG SẢN VIỆT NAM') || /ngày\s+\d+\s+tháng\s+\d+\s+năm\s+\d+/i.test(t)) {
        rightHeaderLines.push(t);
      } else {
        leftHeaderLines.push(t);
      }
    }
  }

  for (const item of leftHeaderLines) {
    if (/^Số\s*:?\s*/i.test(item)) {
      docNumber = item;
    } else if (/^(V\/v|Về việc)\s*:?\s*/i.test(item)) {
      subject = item;
      isCongVan = true;
    } else if (item !== '*' && item !== '***' && item !== '-----') {
      if (!parentOrg && !issuingOrg) {
        issuingOrg = item;
      } else if (issuingOrg && !parentOrg) {
        parentOrg = issuingOrg;
        issuingOrg = item;
      }
    }
  }

  for (const item of rightHeaderLines) {
    if (/ngày\s+\d+\s+tháng\s+\d+\s+năm\s+\d+/i.test(item)) {
      // Extract clean place date: "Hà Nội, ngày 27 tháng 5 năm 2026"
      const dateMatch = item.match(/([A-ZÀ-Ỹa-zà-ỹ\s]+),\s*ngày\s+\d+\s+tháng\s+\d+\s+năm\s+\d+/i);
      if (dateMatch) {
        placeDate = dateMatch[0].trim();
      } else {
        placeDate = item;
      }
    }
  }

  // 5. Parse Middle Lines (Doc Type, Subject, Legal Bases, Body Paragraphs)
  let inCongVanRecipients = false;
  const congVanRecipientLines: string[] = [];

  for (let i = 0; i < middleLines.length; i++) {
    const l = cleanMarkdown(middleLines[i]);
    if (l === '*' || l === '***' || l === '-----') continue;

    // Detect Công văn subject
    if (/^V\/v\s+/i.test(l) || /^Về việc\s+/i.test(l)) {
      isCongVan = true;
      const subLines = [l.replace(/^(V\/v|Về việc)\s*:?\s*/i, 'Về việc ')];
      while (
        i + 1 < middleLines.length &&
        !/^Kính gửi/i.test(cleanMarkdown(middleLines[i + 1])) &&
        !/^-\s*Căn cứ/i.test(cleanMarkdown(middleLines[i + 1])) &&
        !/^Thực hiện/i.test(cleanMarkdown(middleLines[i + 1]))
      ) {
        i++;
        subLines.push(cleanMarkdown(middleLines[i]));
      }
      subject = subLines.join(' ');
      continue;
    }

    // Detect Kính gửi (Công văn / Tờ trình)
    if (/^Kính gửi\s*:/i.test(l)) {
      const rest = l.replace(/^Kính gửi\s*:\s*/i, '').trim();
      if (rest) congVanRecipientLines.push(rest);
      inCongVanRecipients = true;
      continue;
    }

    if (inCongVanRecipients) {
      if (l.startsWith('-') || l.startsWith('+')) {
        congVanRecipientLines.push(l);
        continue;
      } else {
        inCongVanRecipients = false;
      }
    }

    // Detect Document Type (NGHỊ QUYẾT, QUYẾT ĐỊNH, HƯỚNG DẪN...)
    const matchedType = docTypeKeywords.find((dt) => l.toUpperCase() === dt);
    if (matchedType && !docType) {
      docType = matchedType;
      // Subsequent lines before bases or body is subject
      const subLines: string[] = [];
      let nextIdx = i + 1;
      while (nextIdx < middleLines.length) {
        const nextL = cleanMarkdown(middleLines[nextIdx]);
        if (nextL === '-----' || nextL === '***' || nextL === '*') {
          nextIdx++;
          continue;
        }
        if (
          /^-\s*Căn cứ/i.test(nextL) ||
          /^Căn cứ/i.test(nextL) ||
          /^(BAN CHẤP HÀNH|BAN THƯỜNG VỤ|ĐẢNG ỦY)/i.test(nextL) ||
          /^[I|V|X]+\.\s+/i.test(nextL) ||
          /^Thực hiện /i.test(nextL) ||
          /^Điều \d+/i.test(nextL) ||
          /^Kính gửi/i.test(nextL)
        ) {
          break;
        }
        subLines.push(nextL);
        nextIdx++;
        if (subLines.length >= 3) break;
      }
      subject = subLines.join(' ');
      i = nextIdx - 1;
      continue;
    }

    // Legal Bases (Căn cứ...)
    if (/^-\s*Căn cứ/i.test(l) || /^Căn cứ/i.test(l)) {
      bases.push(l.startsWith('-') ? l : `- ${l}`);
      continue;
    }

    // General Body Paragraph
    bodyParagraphs.push(l);
  }

  if (congVanRecipientLines.length > 0) {
    congVanRecipient = congVanRecipientLines.join('\n');
  }

  // Fallbacks if not detected
  if (!issuingOrg) issuingOrg = 'BAN THƯỜNG VỤ HUYỆN ỦY';
  if (!docNumber) docNumber = 'Số: 26-NQ/HU';
  if (!placeDate) {
    const today = new Date();
    placeDate = `Ngày ${today.getDate()} tháng ${today.getMonth() + 1} năm ${today.getFullYear()}`;
  }
  if (!docType && !isCongVan) docType = 'NGHỊ QUYẾT';
  if (!subject) subject = 'Về tăng cường công tác xây dựng Đảng và hệ thống chính trị';
  if (recipients.length === 0) {
    recipients.push('- Như trên;');
    recipients.push('- Thường trực Cấp ủy (để b/c);');
    recipients.push('- Lưu: Văn thư.');
  }
  if (!signerAuthority && !signerRole && !signerName) {
    signerAuthority = 'T/M BAN THƯỜNG VỤ';
    signerRole = 'BÍ THƯ';
    signerName = 'Trần Đình Sơn';
  }

  return {
    parentOrg,
    issuingOrg,
    docNumber,
    motto,
    placeDate,
    docType,
    subject,
    isCongVan,
    congVanRecipient,
    bases,
    bodyParagraphs,
    recipients,
    signerAuthority,
    signerRole,
    signerName,
  };
}

/**
 * Generates pristine, 100% compliant HTML according to Hướng dẫn 05-HD/VPTW
 * Used for both Word (.doc) export and Print/PDF modal!
 */
export function generatePartyDocumentHtml(parsed: ParsedPartyDocument): string {
  // 1. Header Left HTML
  const parentOrgHtml = parsed.parentOrg
    ? `<div style="font-size: 12pt; font-weight: normal; text-transform: uppercase; margin-bottom: 1pt; font-family: 'Times New Roman', Times, serif;">${parsed.parentOrg}</div>`
    : '';

  const issuingOrgHtml = `<div style="font-size: 12pt; font-weight: bold; text-transform: uppercase; margin-bottom: 2pt; font-family: 'Times New Roman', Times, serif;">${parsed.issuingOrg}</div>`;

  // Mini-table underline for Issuing Org (ensures bulletproof rendering in MS Word and browsers)
  const headerDividerLeft = `
    <table align="center" style="margin: 2pt auto 4pt auto; border-collapse: collapse; border: none; width: 38%; mso-table-lspace: 0pt; mso-table-rspace: 0pt;" cellpadding="0" cellspacing="0">
      <tr>
        <td style="border-bottom: 1.5pt solid #000000; height: 1pt; line-height: 1pt; font-size: 1pt; padding: 0;">&nbsp;</td>
      </tr>
    </table>
  `;

  const docNumberHtml = `<div style="font-size: 12pt; font-family: 'Times New Roman', Times, serif; margin-top: 2pt;">${parsed.docNumber}</div>`;

  const congVanSubjectUnderDocNum =
    parsed.isCongVan && parsed.subject
      ? `<div style="font-size: 11pt; font-style: italic; margin-top: 3pt; font-family: 'Times New Roman', Times, serif; line-height: 1.25;">${
          parsed.subject.startsWith('V/v') || parsed.subject.startsWith('Về việc')
            ? parsed.subject
            : `V/v ${parsed.subject}`
        }</div>`
      : '';

  // 2. Header Right HTML
  const mottoHtml = `<div style="font-size: 12.5pt; font-weight: bold; text-transform: uppercase; letter-spacing: 0.2pt; font-family: 'Times New Roman', Times, serif;">ĐẢNG CỘNG SẢN VIỆT NAM</div>`;

  // Mini-table underline for Motto (about 85% width)
  const headerDividerRight = `
    <table align="center" style="margin: 2pt auto 4pt auto; border-collapse: collapse; border: none; width: 85%; mso-table-lspace: 0pt; mso-table-rspace: 0pt;" cellpadding="0" cellspacing="0">
      <tr>
        <td style="border-bottom: 1.5pt solid #000000; height: 1pt; line-height: 1pt; font-size: 1pt; padding: 0;">&nbsp;</td>
      </tr>
    </table>
  `;

  const placeDateHtml = `<div style="font-size: 13pt; font-style: italic; margin-top: 3pt; font-family: 'Times New Roman', Times, serif;">${parsed.placeDate}</div>`;

  // 3. Title / Subject Section
  let titleSectionHtml = '';
  if (parsed.isCongVan) {
    titleSectionHtml = `
      <div style="margin: 14pt 0 16pt 0; text-align: center;">
        ${
          parsed.congVanRecipient
            ? `<div style="font-size: 13pt; font-weight: bold; margin: 12pt 0; font-family: 'Times New Roman', Times, serif;">Kính gửi: ${parsed.congVanRecipient.replace(
                /\n/g,
                '<br/>'
              )}</div>`
            : ''
        }
      </div>
    `;
  } else {
    titleSectionHtml = `
      <div style="text-align: center; margin: 18pt 0 14pt 0;">
        <div style="font-size: 14pt; font-weight: bold; text-transform: uppercase; margin-bottom: 4pt; font-family: 'Times New Roman', Times, serif;">${parsed.docType}</div>
        <div style="font-size: 13pt; font-weight: bold; margin-bottom: 4pt; max-width: 88%; margin-left: auto; margin-right: auto; font-family: 'Times New Roman', Times, serif;">${parsed.subject}</div>
        <table align="center" style="margin: 3pt auto 4pt auto; border-collapse: collapse; border: none; width: 32%; mso-table-lspace: 0pt; mso-table-rspace: 0pt;" cellpadding="0" cellspacing="0">
          <tr>
            <td style="border-bottom: 1.5pt solid #000000; height: 1pt; line-height: 1pt; font-size: 1pt; padding: 0;">&nbsp;</td>
          </tr>
        </table>
        ${
          parsed.congVanRecipient
            ? `<div style="font-size: 13pt; font-weight: bold; margin-top: 10pt; font-family: 'Times New Roman', Times, serif;">Kính gửi: ${parsed.congVanRecipient.replace(
                /\n/g,
                '<br/>'
              )}</div>`
            : ''
        }
      </div>
    `;
  }

  // 4. Bases (Căn cứ)
  const basesHtml =
    parsed.bases.length > 0
      ? parsed.bases
          .map(
            (b) =>
              `<p style="font-size: 13pt; font-style: italic; margin: 3pt 0; text-align: justify; text-indent: 1cm; line-height: 1.35; font-family: 'Times New Roman', Times, serif;">${b}</p>`
          )
          .join('')
      : '';

  // 5. Body Paragraphs
  const bodyHtml = parsed.bodyParagraphs
    .map((p) => {
      const trimmed = p.trim();
      if (!trimmed) return '<p style="margin: 3pt 0;">&nbsp;</p>';

      // Major headings (e.g. BAN CHẤP HÀNH QUYẾT NGHỊ:, I. QUAN ĐIỂM..., Điều 1....)
      if (
        /^(BAN CHẤP HÀNH|BAN THƯỜNG VỤ|ĐẢNG ỦY)[\s\w]+(QUYẾT NGHỊ|QUYẾT ĐỊNH):/i.test(trimmed)
      ) {
        return `<p style="font-size: 13pt; font-weight: bold; text-align: center; margin: 12pt 0 6pt 0; text-transform: uppercase; font-family: 'Times New Roman', Times, serif;">${trimmed}</p>`;
      }
      if (/^[I|V|X]+\.\s+/i.test(trimmed)) {
        return `<p style="font-size: 13pt; font-weight: bold; margin: 10pt 0 4pt 0; text-indent: 1cm; font-family: 'Times New Roman', Times, serif;">${trimmed}</p>`;
      }
      if (/^Điều \d+\./.test(trimmed)) {
        const dotIndex = trimmed.indexOf('.');
        return `<p style="font-size: 13pt; margin: 6pt 0 3pt 0; text-align: justify; text-indent: 1cm; line-height: 1.35; font-family: 'Times New Roman', Times, serif;"><strong style="font-weight: bold;">${trimmed.slice(
          0,
          dotIndex + 1
        )}</strong>${trimmed.slice(dotIndex + 1)}</p>`;
      }

      return `<p style="font-size: 13pt; margin: 4pt 0; text-align: justify; text-indent: 1cm; line-height: 1.35; font-family: 'Times New Roman', Times, serif;">${trimmed}</p>`;
    })
    .join('');

  // 6. Footer (Nơi nhận & Signer)
  const recipientsItemsHtml = parsed.recipients
    .map(
      (r) =>
        `<div style="font-size: 10.5pt; line-height: 1.25; font-family: 'Times New Roman', Times, serif;">${r}</div>`
    )
    .join('');

  const signerAuthorityHtml = parsed.signerAuthority
    ? `<div style="font-size: 13pt; font-weight: bold; text-transform: uppercase; margin-bottom: 2pt; font-family: 'Times New Roman', Times, serif;">${parsed.signerAuthority}</div>`
    : '';
  const signerRoleHtml = parsed.signerRole
    ? `<div style="font-size: 13pt; font-weight: bold; text-transform: uppercase; margin-bottom: 2pt; font-family: 'Times New Roman', Times, serif;">${parsed.signerRole}</div>`
    : '';
  const signerNameHtml = `<div style="font-size: 13pt; font-weight: bold; font-family: 'Times New Roman', Times, serif;">${parsed.signerName}</div>`;

  return `
    <!-- BẢNG ĐẦU TRANG 2 CỘT CHUẨN THỂ THỨC HƯỚNG DẪN 05-HD/VPTW -->
    <table style="width: 100%; border-collapse: collapse; border: none; margin-bottom: 12pt; mso-table-lspace: 0pt; mso-table-rspace: 0pt;" cellpadding="0" cellspacing="0">
      <tr>
        <td style="width: 45%; vertical-align: top; text-align: center; font-family: 'Times New Roman', Times, serif; padding: 0 8pt 0 0; mso-padding-alt: 0pt 8pt 0pt 0pt;">
          ${parentOrgHtml}
          ${issuingOrgHtml}
          ${headerDividerLeft}
          ${docNumberHtml}
          ${congVanSubjectUnderDocNum}
        </td>
        <td style="width: 55%; vertical-align: top; text-align: center; font-family: 'Times New Roman', Times, serif; padding: 0 0 0 8pt; mso-padding-alt: 0pt 0pt 0pt 8pt;">
          ${mottoHtml}
          ${headerDividerRight}
          ${placeDateHtml}
        </td>
      </tr>
    </table>

    <!-- TIÊU ĐỀ & TRÍCH YẾU -->
    ${titleSectionHtml}

    <!-- NỘI DUNG VĂN BẢN -->
    <div style="font-family: 'Times New Roman', Times, serif; font-size: 13pt; color: #000; line-height: 1.35;">
      ${basesHtml}
      ${bodyHtml}
    </div>

    <!-- BẢNG CHÂN TRANG 2 CỘT (NƠI NHẬN & CHỮ KÝ) CHUẨN THỂ THỨC ĐẢNG -->
    <table style="width: 100%; border-collapse: collapse; border: none; margin-top: 24pt; page-break-inside: avoid; mso-table-lspace: 0pt; mso-table-rspace: 0pt;" cellpadding="0" cellspacing="0">
      <tr>
        <td style="width: 48%; vertical-align: top; text-align: left; font-family: 'Times New Roman', Times, serif; padding: 0 10pt 0 0; mso-padding-alt: 0pt 10pt 0pt 0pt;">
          <div style="font-size: 11pt; font-weight: bold; font-style: italic; margin-bottom: 3pt; font-family: 'Times New Roman', Times, serif;">Nơi nhận:</div>
          ${recipientsItemsHtml}
        </td>
        <td style="width: 52%; vertical-align: top; text-align: center; font-family: 'Times New Roman', Times, serif; padding: 0 0 0 10pt; mso-padding-alt: 0pt 0pt 0pt 10pt;">
          ${signerAuthorityHtml}
          ${signerRoleHtml}
          <div style="height: 50pt; line-height: 50pt; font-size: 1pt;">&nbsp;</div>
          ${signerNameHtml}
        </td>
      </tr>
    </table>
  `;
}
