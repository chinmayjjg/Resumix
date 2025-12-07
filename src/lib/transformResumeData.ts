interface Pdf2JsonBlock {
  text: string;
}

interface Pdf2JsonPage {
  Texts: Pdf2JsonBlock[];
}

interface Pdf2JsonData {
  Pages: Pdf2JsonPage[];
}

/**
 * Fixes common PDF parsing issues like merged words (e.g., 'KnowledgeManagementSystem' -> 'Knowledge Management System') 
 * and inconsistent separators.
 */
function cleanRawText(text: string): string {
  if (!text) return '';

  let cleaned = text;

  // 1. Re-introduce spaces where camelCase words were merged.
  cleaned = cleaned.replace(/([a-z])([A-Z])/g, '$1 $2');

  // 2. Fix the fragmented titles by replacing the dash/separator with a single space.
  // This addresses issues like "SecondBrain - K nowledgeManagementSystem"
  cleaned = cleaned.replace(/\s*–\s*|\s*-\s*/g, ' ');

  // 3. Normalize multiple spaces, newlines, and tabs into a single space
  cleaned = cleaned.replace(/\s+/g, ' ');

  // 4. Ensure there is a space *after* punctuation, fixing "Boinda,Angul"
  cleaned = cleaned.replace(/([.,:;])(\S)/g, '$1 $2');

  return cleaned.trim();
}

/**
 * Extracts project titles and summaries from the cleaned text, 
 * using specific resume section markers and structural keywords.
 */
function extractProjects(text: string): { name: string; summary: string }[] {
  const projects = [];

  // Find the section between TECHNICAL PROJECTS and KEY ACHIEVEMENTS
  const sectionMatch = text.match(/TECHNICAL PROJECTS(.*?)(?=KEY ACHIEVEMENTS)/);
  if (!sectionMatch) return [];

  const sectionText = sectionMatch[1].trim();

  // Regex Pattern:
  // Captures a Project Name (capitalized words) followed by a link/URL keyword, 
  // and then the entire description block until the next project name or section end.
  // This is robust against the internal bullet points and multi-line descriptions.
  const projectRegex = /([A-Z][\w\s]+?)\s*(GitHub|Demo|http|Built|Implemented)(.*?)(?=\s*[A-Z][\w\s]+?|\s*$)/g;

  let match;
  while ((match = projectRegex.exec(sectionText)) !== null) {
    let title = match[1].trim();
    const rawSummary = match[3].trim();

    // Clean up the title by removing trailing separators/links.
    title = title.replace(/\s+(GitHub|Demo|http|Built|Implemented)$/i, '').trim();

    // Extract the main description text, prioritizing text after the first bullet point if available.
    const summaryMatch = rawSummary.match(/•\s*(.*?)(?=\s*•\s*[A-Z]|$)/);
    let summary = summaryMatch ? summaryMatch[1].trim() : rawSummary.split(/[.?!]\s*[A-Z]/)[0].trim();

    // Final cleanup on the summary
    summary = summary.replace(/\s*•\s*/g, '. ').replace(/\s+/g, ' ').trim();

    if (title && summary) {
      projects.push({ name: title, summary: summary });
    }
  }

  return projects;
}

// --------------------------------------------------------------------------------------------------

export function transformResumeData(rawData: Pdf2JsonData) {
  // 1. Extract and decode all text blocks
  const textBlocks = rawData.Pages.flatMap((p) =>
    p.Texts.map((t) => decodeURIComponent(t.text))
  );

  // 2. Join with double newline to preserve block separation
  const joinedRaw = textBlocks.join('\n\n');

  // 3. APPLY THE CLEANING FIX
  const cleanedText = cleanRawText(joinedRaw);

  // 4. Core Contact Extraction (using the CLEANED text)
  const nameMatch = cleanedText.match(/^([A-Z][a-z]+)\s+([A-Z][a-z]+)/);
  const name = nameMatch ? `${nameMatch[1]} ${nameMatch[2]}` : textBlocks[0] || 'Unknown User';

  const email = cleanedText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/)?.[0] || '';

  // Robust phone regex
  const phone = cleanedText.match(/(\+?\d{1,3}[\s-]?)?(\(?\d{3}\)?[\s-]?)?\d{3}[\s-]?\d{4}/)?.[0] || '';

  // 5. Skills Extraction (based on known terms in your resume)
  const potentialSkills = ['TypeScript', 'HTML5', 'CSS3', 'Node.js', 'Express', 'MongoDB', 'REST', 'Git', 'VSCode', 'Vercel', 'System Design', 'Cloud Deployment'];
  const extractedSkills = potentialSkills.filter(skill => new RegExp(skill.replace(/\s/g, '\\s*'), 'i').test(cleanedText));

  // 6. Projects Extraction
  const extractedProjects = extractProjects(cleanedText);

  return {
    name,
    email,
    phone,
    headline: '',
    summary: '',
    skills: extractedSkills,
    experience: [],
    education: [],
    projects: extractedProjects,
    rawText: cleanedText, // Returns the cleaned text for verification
  };
}