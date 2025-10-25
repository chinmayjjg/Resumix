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
 * Cleans up raw text extracted from a PDF to fix common issues like merged words 
 * (e.g., 'KnowledgeManagementSystem' becomes 'Knowledge Management System').
 */
function cleanRawText(text: string): string {
  if (!text) return '';

  let cleaned = text;

  // 1. Re-introduce spaces where camelCase words were merged 
  // e.g., 'KnowledgeManagementSystem' -> 'Knowledge Management System'
  cleaned = cleaned.replace(/([a-z])([A-Z])/g, '$1 $2');
  
  // 2. Fix spaces around punctuation (e.g., '.Hello' -> '. Hello')
  cleaned = cleaned.replace(/([.,:;])(\S)/g, '$1 $2');

  // 3. Fix the specific issue seen with projects where titles merge with summaries via a dash
  // e.g., 'SecondBrain - K nowledgeManagementSystem' -> 'SecondBrain KnowledgeManagementSystem' 
  // We'll replace the dash with a space, then the first step will clean the rest.
  cleaned = cleaned.replace(/\s*–\s*|\s*-\s*/g, ' '); 
  
  // 4. Normalize multiple spaces, newlines, and tabs into a single space
  cleaned = cleaned.replace(/\s+/g, ' ');
  
  return cleaned.trim();
}

/**
 * Simple, temporary function to mock the project extraction.
 * In a real scenario, this would use regex or NLP on the cleaned text.
 */
function extractProjects(text: string): { name: string; summary: string }[] {
    // This is a placeholder. You need to implement proper regex or NLP 
    // to find the projects section and parse the entries.
    // For now, we return a simple mock structure.
    return [
        { name: 'Second Brain - Knowledge Management System', summary: 'Developed a full-stack personal knowledge app with React, Node.js, and MongoDB.' },
        { name: 'SuperOps - AI-Powered Ticket Management System', summary: 'Built a modern full-stack ticketing system with React, Express, and MongoDB.' },
    ];
}

// --------------------------------------------------------------------------------------------------

export function transformResumeData(rawData: Pdf2JsonData) {
  // 1. Extract and decode all text blocks
  const textBlocks = rawData.Pages.flatMap((p) =>
    p.Texts.map((t) => decodeURIComponent(t.text))
  );

  // 2. Join with a large space to ensure blocks don't merge (often better than ' ')
  // Using \n\n as a separator is often more robust than a single space for PDF text blocks.
  const joinedRaw = textBlocks.join('\n\n'); 
  
  // 3. APPLY THE CLEANING FIX to the raw text
  const cleanedText = cleanRawText(joinedRaw);

  // 4. Crude extraction using the CLEANED text
  const nameMatch = cleanedText.match(/([A-Z][a-z]+)\s+([A-Z][a-z]+)/);
  const name = nameMatch ? `${nameMatch[1]} ${nameMatch[2]}` : textBlocks[0] || 'Unknown User';
  
  const email = cleanedText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/)?.[0] || '';
  const phone = cleanedText.match(/(\+?\d{10,13})/)?.[0] || '';

  // The final structure now includes the raw text for debugging and better project extraction
  const finalData = {
    name,
    email,
    phone,
    headline: '',
    summary: '',
    // This will require more complex logic on your end, but here's how you'd call it
    // passing the now-cleaned text:
    skills: ['TypeScript', 'Node.js', 'Express', 'MongoDB'], // Mocked for now
    experience: [],
    education: [],
    projects: extractProjects(cleanedText), // Using the placeholder
    rawText: cleanedText, // Provide the cleaned text for debugging
  };

  return finalData;
}