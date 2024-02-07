import fs from 'fs';
import { promisify } from 'util';

const writeFile = promisify(fs.writeFile);

async function getTextFromPDF(pdfPath) {
  const doc = await getDocument(pdfPath).promise;
  const numPages = doc.numPages;
  let text = '';

  for (let i = 1; i <= numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map(item => item.str);
    text += strings.join(' ') + '\n';
  }

  return text;
}

export async function recognizeText(pdfPath) {
  const text = await getTextFromPDF(pdfPath);
  await writeFile('data.txt', text);
}
