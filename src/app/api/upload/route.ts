export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import Resume from '@/models/Resume';
import { connectDB } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Buffer } from 'buffer';

// Import the User model to look up the correct MongoDB ObjectId
import User from '@/models/User'; 

// Using the pure-JS parser to avoid native dependencies like 'canvas'
import Pdfparser from 'pdf2json'; 

// --- Types ---
interface FileLike {
  arrayBuffer: () => Promise<ArrayBuffer>;
  size?: number;
  type?: string;
  name?: string;
}

interface ParsedResumeData {
  email: string;
  phone: string;
  skills: string[];
  projects: { title: string; summary: string }[]; // New field for project extraction
  rawText: string;
}

// --- Helpers ---
function isFileLike(x: unknown): x is FileLike {
  return !!x && typeof (x as any).arrayBuffer === 'function';
}

// --- PDF Parse Helper (Uses pdf2json) ---
async function parsePdfWithPdf2Json(buffer: Buffer | Uint8Array): Promise<{ text: string }> {
  // pdf2json requires the data as a Buffer
  const pdfBuffer = Buffer.from(buffer);

  return new Promise((resolve, reject) => {
    // pdf2json is initialised with null/dummy path when parsing a buffer
    const pdfParser = new (Pdfparser as any)(null, 1); 

    pdfParser.on("pdfParser_dataError", (errData: any) => {
      console.error("PDF2JSON Error:", errData.parserError);
      reject(new Error(`PDF parsing failed: ${errData.parserError}`));
    });

    pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
      let fullText = '';
      
      // Iterate through pages and extract text blocks from pdf2json's internal structure
      if (pdfData.Pages) {
        pdfData.Pages.forEach((page: any) => {
          if (page.Texts) {
            // Decode and join the text chunks, adding a space separator.
            const pageText = page.Texts.map((textBlock: any) => {
              // The raw text is usually found in R[0].T and is URI encoded
              const rawText = textBlock.R?.[0]?.T;
              
              if (!rawText) return '';

              // Safely attempt to decode the URI component, catching malformed URIs.
              try {
                return decodeURIComponent(rawText);
              } catch (e) {
                // If decoding fails (URI malformed), return the raw text after basic cleanup.
                console.warn('URI malformed, returning raw text or empty string:', rawText, e);
                // Basic cleanup attempt to remove remaining encoding signs
                return rawText.replace(/%[0-9a-fA-F]{2}/g, ''); 
              }
            }).join(' ');
            fullText += pageText + '\n';
          }
        });
      }

      resolve({ text: fullText });
    });

    // Start parsing the buffer
    (pdfParser as any).parseBuffer(pdfBuffer);
  });
}

// --- Route ---
export async function POST(req: Request): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions as any);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();

    const formData = await req.formData();
    const fileEntry = formData.get('file');

    if (!isFileLike(fileEntry)) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });

    const file = fileEntry;
    if (!file.size || file.size === 0) return NextResponse.json({ error: 'Empty file' }, { status: 400 });
    if (file.type && !/pdf/i.test(file.type)) return NextResponse.json({ error: 'Only PDF files are allowed' }, { status: 400 });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let data;
    try {
      data = await parsePdfWithPdf2Json(buffer); 
    } catch (err) {
      console.error('PDF parsing failed:', err);
      return NextResponse.json({ error: 'Failed to process PDF file. The parser encountered an internal error.' }, { status: 500 });
    }

    const text: string = data?.text ?? '';

    // --- 1. Email Extraction ---
    const email = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/i)?.[0] ?? '';

    // --- 2. Phone Extraction (Confirmed Working) ---
    // This regex looks for common global phone formats: 
    // optional country code (+XX), optional parentheses, minimum 7 digits
    const phoneMatch = text.match(/(\+?\s*\d{1,3}[\s.-]?)?\(?\d{2,4}\)?[\s.-]?\d{3,4}[\s.-]?\d{3,4}/);
    // Find the longest match and clean it up, prioritizing the explicit phone number
    const phone = phoneMatch ? phoneMatch.find(p => (p.replace(/[\s.-]/g, '').length >= 7 && p.includes('+'))) ?? phoneMatch[0] : '';
    const cleanedPhone = phone.replace(/[^\d+]/g, '').trim();


    // --- 3. Skills Extraction (Major Revision for better isolation and filtering) ---
    // 1. Attempt to isolate the skills block using major headers as delimiters.
    // Finds text between a Skills header and the next major section (like Education or Projects).
    const skillBlockMatch = text.match(/(TECHNICAL\s*SKILLS?|KEY\s*SKILLS?|TECHNOLOGIES?|FRAMEWORKS?|LANGUAGES?)\s*([^]+?)(?=(EDUCATION|PROJECTS|EXPERIENCE|OBJECTIVE))/i);
    let skillSectionText = '';

    if (skillBlockMatch && skillBlockMatch[2]) {
        // Use the content captured between the header and the next section.
        skillSectionText = skillBlockMatch[2].trim();
    } else {
        // Fallback to the previous line-by-line approach if the regex fails to find clear delimiters.
        const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
        let foundSkillsHeader = false;
        
        for (const line of lines) {
             if (/(TECHNICAL\s*SKILLS?|KEY\s*SKILLS?|TECHNOLOGIES?|FRAMEWORKS?|LANGUAGES?)/i.test(line)) {
                foundSkillsHeader = true;
                // Capture content after the header keyword on the same line
                skillSectionText += line.replace(/(.*?(TECHNICAL\s*SKILLS?|KEY\s*SKILLS?|TECHNOLOGIES?|FRAMEWORKS?|LANGUAGES?)\s*)/i, '').trim();
                continue;
            }

            if (foundSkillsHeader && skillSectionText.length < 500) { 
                if (!/(OBJECTIVE|EDUCATION|EXPERIENCE|PROJECTS|WORK)/i.test(line)) {
                    skillSectionText += ' ' + line;
                } else {
                    break;
                }
            }
        }
    }
    
    // 2. Pre-clean the extracted block to normalize formatting and replace categories with commas
    const cleanedBlock = skillSectionText
        .replace(/\s+/g, ' ') // Collapse multiple spaces
        .replace(/:\s*/g, ', ') // Replace colons with commas
        .replace(/(Frontend|Backend|APIs|Tools|Core)\s*/ig, ', '); // Replace internal category headers with delimiters

    // 3. Split by common delimiters
    const rawSkillsList = cleanedBlock.split(/[,;•|\/]/).map(s => s.trim()).filter(Boolean);
    
    // 4. Aggressively filter out junk (URLs, locations, short words, filler)
    const skills = rawSkillsList
        .filter(s => {
            const lowerS = s.toLowerCase();
            // Exclusion criteria:
            return s.length > 2 && 
                   !/(\s|and|or|etc|etc\.|a|the|with|of|in|to|is|for|from)/i.test(s) && // Exclude short words and common conjunctions
                   !/(http|www|\.com|\.org|\.net|\@|github|linkedin|student|mca|odisha|india|pradhan|chinmay|developer)/i.test(lowerS); // Exclude URLs, location, and name components
        })
        .slice(0, 15); // Keep up to 15 best candidates
        
    // --- 4. Project Extraction ---
    let projects: { title: string; summary: string }[] = [];

    // Find the block of text between the PROJECTS header and the next major header (e.g., ACHIEVEMENTS)
    const projectsBlockMatch = text.match(/(TECHNICAL\s*PROJECTS?|PROJECTS?|PORTFOLIO)\s*([^]+?)(?=(KEY\s*ACHIEVEMENTS|EDUCATION|EXPERIENCE|\n[A-Z]{3,}[A-Z\s]+))/i);
    
    if (projectsBlockMatch && projectsBlockMatch[2]) {
        const projectText = projectsBlockMatch[2].trim();
        
        // Regex to find each project: Captures (Title-Like Pattern) followed by (everything until next Title-Like Pattern or end of block)
        // This relies on the pattern: [CapitalizedWord]–[Title]
        const projectRegex = /([A-Z][a-zA-Z]+[–-][^—\n]+?)([^A-Z][^]*?)(?=[A-Z][a-zA-Z]+[–-][^—\n]+?|KEY\s*ACHIEVEMENTS|EDUCATION|EXPERIENCE|$)/g;
        
        let match;
        while ((match = projectRegex.exec(projectText)) !== null) {
            const rawTitle = match[1].trim();
            let rawSummary = match[2].trim();

            // Clean the summary: remove URLs, excessive bullet points, collapse spaces
            rawSummary = rawSummary
                .replace(/(GitHub:|Demo:).*?(\s•|\n|—)/ig, ' ') // Remove link labels/URIs and separators
                .replace(/[\•\u2022]/g, ' ') // Remove bullet points
                .replace(/\s+/g, ' ') // Collapse multiple spaces
                .trim();
                
            // Filter out junk/empty summaries
            if (rawSummary.length > 10 && rawSummary.length < 250) {
                 projects.push({ 
                    title: rawTitle.replace(/–|-/g, ' - '), // Normalize dash
                    summary: rawSummary.slice(0, 150) + (rawSummary.length > 150 ? '...' : '') 
                });
            }
        }
    }
        
    const parsedData: ParsedResumeData = {
      email,
      phone: cleanedPhone, // Use the cleaned phone number
      skills,
      projects, // Add the new projects array
      rawText: text.slice(0, 2000)
    };

    const sessUser = (session as any).user ?? {};
    // Extract the primary user identifier (email is guaranteed by your User schema)
    const userIdentifier = sessUser.email || sessUser.id || sessUser.sub;

    if (!userIdentifier) {
        return NextResponse.json({ error: 'User session missing required identifier (email/ID).' }, { status: 401 });
    }

    // STEP 1: Find the User document using the session email to get the correct MongoDB ObjectId
    const userDoc = await User.findOne({ email: userIdentifier });

    if (!userDoc) {
        // If the User is not found, we cannot create the Resume document.
        console.error(`User not found for identifier: ${userIdentifier}`);
        return NextResponse.json({ error: 'User record not found in database. Cannot associate resume.' }, { status: 404 });
    }

    // STEP 2: Use the Mongoose ObjectId (_id) from the found user document
    const userId = userDoc._id;

    // STEP 3: Create the Resume document with the valid ObjectId
    await Resume.create({ userId, parsedData });

    return NextResponse.json({ success: true, parsedData }, { status: 201 });
  } catch (error: any) {
    console.error('Resume upload/parse error:', error);
    
    if (error.name === 'ValidationError') {
        return NextResponse.json({ 
            error: 'Mongoose validation failed. Check required fields or data types.', 
            details: String(error.message) 
        }, { status: 500 });
    }
    
    return NextResponse.json({ error: 'Failed to process resume request', details: String(error) }, { status: 500 });
  }
}
