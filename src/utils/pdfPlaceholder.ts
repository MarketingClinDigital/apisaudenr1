export interface PdfSection {
  heading: string;
  items: string[];
}

const escapePdfText = (value: string) => value.replace(/([()\\])/g, '\\$1');

const buildPlaceholderPdfBlob = (title: string, sections: PdfSection[]) => {
  const encoder = new TextEncoder();
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
  const streamLength = encoder.encode(streamContent).length;

  const parts: string[] = ['%PDF-1.4\n'];
  const offsets: number[] = [0];
  let currentLength = encoder.encode(parts[0]).length;

  const addObject = (content: string) => {
    offsets.push(currentLength);
    parts.push(content);
    currentLength += encoder.encode(content).length;
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
    '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n',
  );

  const xrefOffset = currentLength;
  let xrefTable = `xref\n0 ${offsets.length}\n0000000000 65535 f \n`;
  for (let index = 1; index < offsets.length; index++) {
    xrefTable += `${offsets[index].toString().padStart(10, '0')} 00000 n \n`;
  }

  parts.push(xrefTable);
  const trailer = `trailer\n<< /Size ${offsets.length} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  parts.push(trailer);

  const pdfContent = parts.join('');
  return new Blob([pdfContent], { type: 'application/pdf' });
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
