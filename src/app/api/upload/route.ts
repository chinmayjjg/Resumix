export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import Resume from '@/models/Resume';
import { connectDB } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Buffer } from 'buffer';
import User from '@/models/User';
import Pdfparser from 'pdf2json';


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


function isFileLike(x: unknown): x is FileLike {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return !!x && typeof (x as any).arrayBuffer === 'function';
}


async function parsePdfWithPdf2Json(buffer: Buffer | Uint8Array): Promise<{ text: string }> {

    const pdfBuffer = Buffer.from(buffer);

    return new Promise((resolve, reject) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const pdfParser = new (Pdfparser as any)(null, 1);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        pdfParser.on("pdfParser_dataError", (errData: any) => {
            console.error("PDF2JSON Error:", errData.parserError);
            reject(new Error(`PDF parsing failed: ${errData.parserError}`));
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
            let fullText = '';

            // Iterate through pages and extract text blocks from pdf2json's internal structure
            if (pdfData.Pages) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                pdfData.Pages.forEach((page: any) => {
                    if (page.Texts) {
                        // Decode and join the text chunks, adding a space separator.
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const pageText = page.Texts.map((textBlock: any) => {

                            const rawText = textBlock.R?.[0]?.T;

                            if (!rawText) return '';


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


        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (pdfParser as any).parseBuffer(pdfBuffer);
    });
}


export async function POST(req: Request): Promise<NextResponse> {
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

        //  Email Extraction 
        const email = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/i)?.[0] ?? '';


        const phoneMatch = text.match(/(\+?\s*\d{1,3}[\s.-]?)?\(?\d{2,4}\)?[\s.-]?\d{3,4}[\s.-]?\d{3,4}/);
        //  phone number
        const phone = phoneMatch ? phoneMatch.find(p => (p.replace(/[\s.-]/g, '').length >= 7 && p.includes('+'))) ?? phoneMatch[0] : '';
        const cleanedPhone = phone.replace(/[^\d+]/g, '').trim();


        //  Skills Extraction 

        // Finds text between a Skills header and the next major section.
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

        //  Project Extraction 
        const projects: { title: string; summary: string }[] = [];

        // Find the block of text between the PROJECTS header and the next major header (e.g., ACHIEVEMENTS)
        const projectsBlockMatch = text.match(/(TECHNICAL\s*PROJECTS?|PROJECTS?|PORTFOLIO)\s*([^]+?)(?=(KEY\s*ACHIEVEMENTS|EDUCATION|EXPERIENCE|\n[A-Z]{3,}[A-Z\s]+))/i);

        if (projectsBlockMatch && projectsBlockMatch[2]) {
            const projectText = projectsBlockMatch[2].trim();

            // Define common descriptive verbs that should NOT start a project title, followed by a potential dash.
            const EXCLUDED_START_WORDS =
                '(?:Developed|Built|Implemented|Added|Features|Created|BuiltasecurebackendwithNode\\.js|Implementedreal)';


            const PROJECT_TITLE_SPLIT_PATTERN =
                new RegExp(`(?!${EXCLUDED_START_WORDS})([A-Z][a-zA-Z]+[–-][^—\n]+?)`, 'g');

            // Split the text, capturing the delimiters (titles)
            const parts = projectText.split(PROJECT_TITLE_SPLIT_PATTERN).filter(p => p.trim() !== '');


            for (let i = 0; i < parts.length; i++) {
                const part = parts[i].trim();

                if (part.match(/[A-Z][a-zA-Z]+[–-][^—\n]+?/)) {
                    const rawTitle = part;
                    const rawContent = (parts[i + 1] || '').trim(); // Content is the next item

                    // Since we are iterating and consuming the next item (rawContent), increment i again
                    i++;

                    // Remove link labels and their content from the raw content
                    let summaryText = rawContent
                        // Remove GitHub and Demo URLs and labels completely
                        .replace(/GitHub:.*?(\s—|\n|$)/ig, ' ')
                        .replace(/Demo:.*?(\s—|\n|$)/ig, ' ')
                        .replace(/URL:.*?(\s—|\n|$)/ig, ' ')
                        .trim();

                    // Clean up the bullet points and excessive spacing in the summary
                    summaryText = summaryText
                        .replace(/[\•\u2022]/g, ' ') // Replace all bullet characters with spaces
                        .replace(/\s+/g, ' ') // Collapse multiple spaces
                        .trim();


                    // Final check and push (require a minimum summary length to filter junk)
                    if (summaryText.length > 20) {
                        projects.push({
                            title: rawTitle.replace(/–|-/g, ' - ').trim(), // Normalize dash in title
                            summary: summaryText.slice(0, 150) + (summaryText.length > 150 ? '...' : '')
                        });
                    }
                }
            }
        }

        const parsedData: ParsedResumeData = {
            email,
            phone: cleanedPhone,
            skills,
            projects,
            rawText: text.slice(0, 2000)
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const sessUser = (session as any).user ?? {};

        const userIdentifier = sessUser.email || sessUser.id || sessUser.sub;

        if (!userIdentifier) {
            return NextResponse.json({ error: 'User session missing required identifier (email/ID).' }, { status: 401 });
        }


        const userDoc = await User.findOne({ email: userIdentifier });

        if (!userDoc) {
            // If the User is not found, we cannot create the Resume document.
            console.error(`User not found for identifier: ${userIdentifier}`);
            return NextResponse.json({ error: 'User record not found in database. Cannot associate resume.' }, { status: 404 });
        }


        const userId = userDoc._id;


        await Resume.create({ userId, parsedData });

        return NextResponse.json({ success: true, parsedData }, { status: 201 });
    } catch (error: unknown) {
        console.error('Resume upload/parse error:', error);

        if (error instanceof Error && error.name === 'ValidationError') {
            return NextResponse.json({
                error: 'Mongoose validation failed. Check required fields or data types.',
                details: String(error.message)
            }, { status: 500 });
        }

        return NextResponse.json({ error: 'Failed to process resume request', details: String(error) }, { status: 500 });
    }
}
