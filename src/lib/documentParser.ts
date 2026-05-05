export async function extractTextFromFile(file: File): Promise<string> {
  const extension = file.name.split('.').pop()?.toLowerCase();
  
  if (extension === 'txt') {
    return await file.text();
  }
  
  if (extension === 'pdf') {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ')
          .replace(/\s+/g, ' '); // Normalitza espais
        fullText += pageText + '\n';
    }
    
    if (fullText.trim().length === 0) {
      throw new Error('El PDF sembla estar buit o ser una imatge (no OCR).');
    }
    return fullText;
  }
  
  throw new Error('Tipus de fitxer no suportat. Puja un .txt o .pdf.');
}
