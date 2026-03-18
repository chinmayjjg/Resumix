interface Pdf2JsonBlock {
  R: { T: string }[];
}

interface Pdf2JsonPage {
  Texts: Pdf2JsonBlock[];
}

export interface Pdf2JsonData {
  Pages: Pdf2JsonPage[];
}

/**
 * Standardizes text by fixing common PDF parsing artifacts.
 */
function cleanRawText(text: string): string {
  if (!text) return '';

  let cleaned = text;

  // Fix merged camelCase words (e.g., "KnowledgeManagement" -> "Knowledge Management")
  cleaned = cleaned.replace(/([a-z])([A-Z])/g, '$1 $2');

  // Normalize specific unicode dashes to standard hyphen
  cleaned = cleaned.replace(/–|—|\u2212/g, '-');

  // We DO NOT remove dashes globally as it breaks date ranges (e.g. "2020 - 2021").

  return cleaned;
}

/**
 * Map of standard resume section headers to normalized keys.
 */
const SECTION_HEADERS: Record<string, string> = {
  'EXPERIENCE': 'experience',
  'WORK EXPERIENCE': 'experience',
  'EMPLOYMENT HISTORY': 'experience',
  'PROFESSIONAL EXPERIENCE': 'experience',
  'EDUCATION': 'education',
  'ACADEMIC BACKGROUND': 'education',
  'SKILLS': 'skills',
  'TECHNICAL SKILLS': 'skills',
  'CORE COMPETENCIES': 'skills',
  'PROJECTS': 'projects',
  'TECHNICAL PROJECTS': 'projects',
  'TECHNICALPROJECTS': 'projects', // pdf2json merged artifact
  'PERSONAL PROJECTS': 'projects',
  'KEY ACHIEVEMENTS': 'achievements',
  'KEYACHIEVEMENTS': 'achievements', // pdf2json merged artifact
  'SUMMARY': 'summary',
  'PROFESSIONAL SUMMARY': 'summary',
  'PROFILE': 'summary',
  'CONTACT': 'contact',
};

/**
 * Splits the raw text into sections based on known headers.
 */
function extractSections(text: string): Record<string, string> {
  // 1. Join clean lines, attempting to merge fragmented headers (e.g. "PRO" + "JECTS")
  // Heuristic: If a line is short, uppercase, and the next line is also uppercase, join them.
  const rawLines = text.split(/\r?\n/);
  const mergedLines: string[] = [];

  for (let i = 0; i < rawLines.length; i++) {
    let line = rawLines[i].trim();

    // Heuristic: If this line is short (< 5 chars), uppercase, and next line is uppercase, merge.
    // e.g. "E" + "XPERIENCE"
    // Only do this if the merge creates a known header
    if (line.length > 0 && line.length < 10 && /^[A-Z\s]+$/.test(line) && i + 1 < rawLines.length) {
      const nextLine = rawLines[i + 1].trim();
      if (/^[A-Z\s]+$/.test(nextLine)) {
        // Fix: Use version WITH space so it matches standard keys
        const combinedSpace = line + ' ' + nextLine;
        const cleanNoSpace = (line + nextLine).replace(/[^A-Z]/g, '');

        // Check if the spaceless version would have matched a known header key (normalized to upper-clean)
        // If so, we use the SPACED version for the line content so SECTION_HEADERS lookup works later.
        if (SECTION_HEADERS[cleanNoSpace]) {
          line = combinedSpace;
          i++; // Skip next
        }
      }
    }

    mergedLines.push(line);
  }

  const sections: Record<string, string> = {
    'summary': '', // Default bucket for top content
  };

  let currentSection = 'summary';

  for (let i = 0; i < mergedLines.length; i++) {
    const line = mergedLines[i];


    // Check if this line is a header
    // Heuristic: Uppercase, relatively short, matches known keywords
    if (line) {
      const upperLine = line.toUpperCase().replace(/[^A-Z\s]/g, '').trim();
      if (SECTION_HEADERS[upperLine] && line.length < 50) {
        currentSection = SECTION_HEADERS[upperLine];
        if (!sections[currentSection]) sections[currentSection] = '';
        continue;
      }
    }

    // Append line to current section
    // If line is empty, we still add a newline to preserve the gap
    sections[currentSection] += line + '\n';
  }

  return sections;
}

/**
 * Extract Experience Items
 * Heuristic: Look for company names or date ranges to split items.
 */
function extractExperience(text: string) {
  if (!text) return [];

  const items: { company: string; role: string; duration: string; description: string }[] = [];

  // Split by double newlines to separate distinct blocks
  const blocks = text.split(/\n\s*\n/);

  for (const block of blocks) {
    const cleanBlock = block.trim();
    if (!cleanBlock) continue;

    // Attempt to extract a date
    // Relaxed regex: Look for year patterns and "Present"
    const dateMatch = cleanBlock.match(/((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s*\d{4}|Present|Current|\d{4})\s*(-|to)\s*((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s*\d{4}|Present|Current|\d{4})/i);
    const duration = dateMatch ? dateMatch[0] : '';

    // Attempt to extract Company and Role
    const lines = cleanBlock.split('\n');
    let company = '', role = '';

    if (lines.length > 0) {
      // If the first line is just the duration, skip it
      let titleLine = lines[0];
      if (duration && titleLine.trim() === duration) {
        titleLine = lines[1] || '';
      } else {
        titleLine = titleLine.replace(duration, '').trim();
      }

      const parts = titleLine.split(/[-|–,]/).map(s => s.trim()).filter(s => s.length > 0);

      if (parts.length >= 2) {
        role = parts[0];
        company = parts[1];
      } else {
        role = titleLine || 'Role';
        company = lines[1]?.replace(duration, '').trim() || '';
      }
    }

    const description = cleanBlock
      .replace(duration, '')
      .replace(lines[0] || '', '') // Remove the title line we processed
      .replace(lines[1] && company === lines[1].trim() ? lines[1] : '', '') // Remove company line if separate
      .replace(/\s+/g, ' ').trim();

    items.push({
      company: company || 'Company',
      role: role || 'Role',
      duration,
      description
    });
  }

  return items;
}

/**
 * Extract Education Items
 */
function extractEducation(text: string) {
  if (!text) return [];
  const items: { school: string; degree: string; year: string }[] = [];

  const blocks = text.split(/\n\s*\n/);

  for (const block of blocks) {
    const cleanBlock = block.trim();
    if (!cleanBlock) continue;

    const yearMatch = cleanBlock.match(/\d{4}\s*[-–]\s*(?:\d{4}|Present)/) || cleanBlock.match(/\d{4}/);
    const year = yearMatch ? yearMatch[0] : '';

    let degree = '', school = '';

    if (cleanBlock.toLowerCase().includes('university') || cleanBlock.toLowerCase().includes('college') || cleanBlock.toLowerCase().includes('institute')) {
      // Heuristic: The part with "University/College" is the school
      const lines = cleanBlock.split('\n');
      for (const line of lines) {
        if (line.match(/(university|college|institute)/i)) {
          school = line.trim();
        } else if (!degree) {
          degree = line.trim();
        }
      }
    }

    if (school || degree) {
      items.push({
        school: school || 'University',
        degree: degree || 'Degree',
        year
      });
    }
  }

  return items;
}

function extractSkills(text: string): string[] {
  if (!text) return [];

  // If text contains bullets or commas, split by them
  const potentialSkills = text.split(/[,•\n]/)
    .map(s => s.trim())
    .filter(s => s.length > 2 && s.length < 30); // simplistic length filter

  return [...new Set(potentialSkills)]; // Unique
}


function extractProjects(text: string): { title: string; summary: string }[] {
  if (!text) return [];

  // 1. Heal specific broken lines in projects (e.g. "Title - K" \n "nowledge")
  let healedText = text.replace(/([A-Z])\s*\n\s*([a-z])/g, '$1$2');

  // 2. Fix camelCase again
  healedText = healedText.replace(/([a-z])([A-Z])/g, '$1 $2');

  const projects: { title: string; summary: string }[] = [];

  // Split blocks by double newlines or bold-ish lines
  const blocks = healedText.split(/\n\s*\n/);

  for (const block of blocks) {
    const cleanBlock = block.trim();
    if (cleanBlock.length < 5) continue;

    // Check if this block contains multiple "Title - Summary" lines
    const lines = cleanBlock.split('\n');
    let currentProject: { title: string; summary: string } | null = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Heuristic: Is this a new project title?
      // 1. It's the first line of the block
      // 2. OR it matches "Name - Description" pattern (Name starts with Capital)
      // 3. AND it's not just a continuation of the previous sentence (lowercase start? No, title matches Capital)

      const isDashTitle = /^[A-Z].*?[-–]/.test(line); // Relaxed: Just check for dash
      const isColonTitle = /^[A-Z].*?:\s+/.test(line); // Added colon support

      if (currentProject === null || isDashTitle || isColonTitle) {
        // Push previous project if exists
        if (currentProject) {
          projects.push(currentProject);
        }

        // Start new project
        if (isDashTitle) {
          // Attempt to split by standard dash spacing first
          let parts = line.split(/\s+[-–]\s+/);
          if (parts.length < 2) {
            // Fallback: split by any dash
            parts = line.split(/[-–]/);
          }

          if (parts.length >= 2) {
            const title = parts[0].trim();
            const summary = parts.slice(1).join(' - ').trim();
            currentProject = { title, summary };
          } else {
            // Failed to split properly, treat as line content or simple title?
            if (currentProject === null && i === 0) {
              currentProject = { title: line, summary: '' };
            } else {
              // Probably just a list item starting with dash
              if (currentProject) {
                currentProject.summary += (currentProject.summary ? ' ' : '') + line;
              }
            }
          }
        } else if (isColonTitle) {
          const parts = line.split(/:\s+/);
          const title = parts[0].trim();
          const summary = parts.slice(1).join(': ').trim();
          currentProject = { title, summary };
        } else {
          // Determine if we should treat this line as a name
          // If it is the first line of the block, yes.
          if (currentProject === null && i === 0) {
            // Maybe the user just has "Project Name" on one line and description below
            // Only if line is short (title-like)
            if (line.length < 60) {
              currentProject = { title: line, summary: '' };
            } else {
              // Probably just text or garbage line at start of block
            }
          }
        }
      } else {
        // Append to current project summary
        if (currentProject) {
          currentProject.summary += (currentProject.summary ? ' ' : '') + line;
        }
      }
    }

    if (currentProject) {
      projects.push(currentProject);
    }
  }

  return projects;
}


export function transformResumeData(rawData: Pdf2JsonData) {
  // 1. Flatten text with basic decoding from the correct JSON structure
  const textBlocks = rawData.Pages.flatMap((p) =>
    p.Texts.map((t) => {
      const rawT = t.R?.[0]?.T;
      if (!rawT) return '';
      try {
        return decodeURIComponent(rawT);
      } catch {
        return rawT;
      }
    })
  );

  // 2. Initial cleanup of individual blocks before joining
  // (Sometimes blocks are just " " or encoded artifacts)

  // 3. Join with newlines to preserve structure for section detection
  const fullText = textBlocks.join('\n');

  // 4. Clean artifacts while preserving newlines
  const cleanedText = cleanRawText(fullText);

  // 5. Section Parsing
  const sections = extractSections(cleanedText);

  // 6. Field Extraction

  // Contact (Name/Email/Phone) - look globally but prioritize top sections
  const contactText = (sections['summary'] + '\n' + sections['contact']).slice(0, 1000); // First 1000 chars

  const nameMatch = contactText.match(/^([A-Z][a-z]+)\s+([A-Z][a-z]+)/);
  const name = nameMatch ? `${nameMatch[1]} ${nameMatch[2]}` : 'Your Name';

  const email = contactText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/)?.[0] || '';
  const phone = contactText.match(/(\+?\d{1,3}[\s-]?)?(\(?\d{3}\)?[\s-]?)?\d{3}[\s-]?\d{4}/)?.[0] || '';

  // Skills
  const skills = extractSkills(sections['skills'] || '');

  // Projects
  const projects = extractProjects(sections['projects'] || '');

  // Experience
  const experience = extractExperience(sections['experience'] || '');

  // Education
  const education = extractEducation(sections['education'] || '');

  // Summary
  const summary = sections['summary'].replace(name, '').replace(email, '').replace(phone, '').replace(/\s+/g, ' ').trim().slice(0, 500);

  return {
    name,
    email,
    phone,
    headline: '', // Could extract first line under name
    summary,
    skills,
    experience,
    education,
    projects,
    rawText: cleanedText,
  };
}
