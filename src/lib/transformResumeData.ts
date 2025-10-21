interface Pdf2JsonBlock {
  text: string;
}

interface Pdf2JsonPage {
  Texts: Pdf2JsonBlock[];
}

interface Pdf2JsonData {
  Pages: Pdf2JsonPage[];
}

export function transformResumeData(rawData: Pdf2JsonData) {
  const textBlocks = rawData.Pages.flatMap((p) =>
    p.Texts.map((t) => decodeURIComponent(t.text))
  );

  // crude extraction — refine later
  const joined = textBlocks.join(' ');
  const name = textBlocks[0] || 'Unknown User';
  const email = joined.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/)?.[0] || '';
  const phone = joined.match(/(\+?\d{10,13})/)?.[0] || '';

  return {
    name,
    email,
    phone,
    headline: '',
    summary: '',
    skills: [],
    experience: [],
    education: [],
    projects: [],
  };
}
