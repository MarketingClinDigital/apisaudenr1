export interface PdfSection {
  heading: string;
  items: string[];
}

const escapePdfText = (value: string) => value.replace(/([()\\])/g, '\\$1');

const winAnsiMap: Record<string, number> = {
  '€': 128,
  '‚': 130,
  'ƒ': 131,
  '„': 132,
  '…': 133,
  '†': 134,
  '‡': 135,
  'ˆ': 136,
  '‰': 137,
  'Š': 138,
  '‹': 139,
  'Œ': 140,
  'Ž': 142,
  '‘': 145,
  '’': 146,
  '“': 147,
  '”': 148,
  '•': 149,
  '–': 150,
  '—': 151,
  '˜': 152,
  '™': 153,
  'š': 154,
  '›': 155,
  'œ': 156,
  'ž': 158,
  'Ÿ': 159,
  '¡': 161,
  '¢': 162,
  '£': 163,
  '¤': 164,
  '¥': 165,
  '¦': 166,
  '§': 167,
  '¨': 168,
  '©': 169,
  'ª': 170,
  '«': 171,
  '¬': 172,
  '®': 174,
  '¯': 175,
  '°': 176,
  '±': 177,
  '²': 178,
  '³': 179,
  '´': 180,
  'µ': 181,
  '¶': 182,
  '·': 183,
  '¸': 184,
  '¹': 185,
  'º': 186,
  '»': 187,
  '¼': 188,
  '½': 189,
  '¾': 190,
  '¿': 191,
  'À': 192,
  'Á': 193,
  'Â': 194,
  'Ã': 195,
  'Ä': 196,
  'Å': 197,
  'Æ': 198,
  'Ç': 199,
  'È': 200,
  'É': 201,
  'Ê': 202,
  'Ë': 203,
  'Ì': 204,
  'Í': 205,
  'Î': 206,
  'Ï': 207,
  'Ð': 208,
  'Ñ': 209,
  'Ò': 210,
  'Ó': 211,
  'Ô': 212,
  'Õ': 213,
  'Ö': 214,
  '×': 215,
  'Ø': 216,
  'Ù': 217,
  'Ú': 218,
  'Û': 219,
  'Ü': 220,
  'Ý': 221,
  'Þ': 222,
  'ß': 223,
  'à': 224,
  'á': 225,
  'â': 226,
  'ã': 227,
  'ä': 228,
  'å': 229,
  'æ': 230,
  'ç': 231,
  'è': 232,
  'é': 233,
  'ê': 234,
  'ë': 235,
  'ì': 236,
  'í': 237,
  'î': 238,
  'ï': 239,
  'ð': 240,
  'ñ': 241,
  'ò': 242,
  'ó': 243,
  'ô': 244,
  'õ': 245,
  'ö': 246,
  '÷': 247,
  'ø': 248,
  'ù': 249,
  'ú': 250,
  'û': 251,
  'ü': 252,
  'ý': 253,
  'þ': 254,
  'ÿ': 255,
};

const encodeWinAnsiBuffer = (text: string): Uint8Array => {
  const bytes: number[] = [];
  for (const char of text) {
    const code = char.charCodeAt(0);
    if (code <= 0x7f) {
      bytes.push(code);
    } else if (winAnsiMap[char] !== undefined) {
      bytes.push(winAnsiMap[char]);
    } else {
      bytes.push(63); // '?'
    }
  }
  return new Uint8Array(bytes);
};

const getByteLength = (text: string) => encodeWinAnsiBuffer(text).length;

const buildPlaceholderPdfBlob = (title: string, sections: PdfSection[]) => {
  const lines: string[] = [
    title,
    'Documento demonstrativo gerado para apresentação.',
    '',
  ];

  sections.forEach((section) => {
    lines.push(section.heading);
    section.items.forEach((item) => lines.push(`- ${item}`));
    lines.push('');
  });

  const textLines = lines.filter((line, index, array) => {
    if (!line && index === array.length - 1) {
      return false;
    }
    return true;
  });

  const buildContentStream = () => {
    const header = 'BT\n/F1 16 Tf\n72 770 Td\n';
    const body = textLines
      .map((line, index) => {
        const escaped = escapePdfText(line);
        if (index === 0) {
          return `(${escaped}) Tj\n`;
        }
        return `0 -24 Td\n(${escaped}) Tj\n`;
      })
      .join('');
    return `${header}${body}ET`;
  };

  const streamContent = buildContentStream();
  const streamLength = getByteLength(streamContent);

  const parts: string[] = ['%PDF-1.4\n'];
  const offsets: number[] = [0];
  let currentLength = getByteLength(parts[0]);

  const addObject = (content: string) => {
    offsets.push(currentLength);
    parts.push(content);
    currentLength += getByteLength(content);
  };

  addObject('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n');
  addObject('2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n');
  addObject(
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n',
  );
  addObject(
    `4 0 obj\n<< /Length ${streamLength} >>\nstream\n${streamContent}\nendstream\nendobj\n`,
  );
  addObject(
    '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>\nendobj\n',
  );

  const xrefOffset = currentLength;
  let xrefTable = `xref\n0 ${offsets.length}\n0000000000 65535 f \n`;
  for (let index = 1; index < offsets.length; index++) {
    xrefTable += `${offsets[index].toString().padStart(10, '0')} 00000 n \n`;
  }

  parts.push(xrefTable);
  const trailer = `trailer\n<< /Size ${offsets.length} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  parts.push(trailer);

  const buffers = parts.map(encodeWinAnsiBuffer);
  const totalLength = buffers.reduce((sum, buf) => sum + buf.length, 0);
  const pdfBytes = new Uint8Array(totalLength);

  let offset = 0;
  buffers.forEach((buffer) => {
    pdfBytes.set(buffer, offset);
    offset += buffer.length;
  });

  return new Blob([pdfBytes], { type: 'application/pdf' });
};

export const downloadPlaceholderPdf = (
  filename: string,
  title: string,
  sections: PdfSection[],
) => {
  const blob = buildPlaceholderPdfBlob(title, sections);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
