export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import Resume from '@/models/Resume';
import { connectDB } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Buffer } from 'buffer';
import User from '@/models/User';
import Pdfparser from 'pdf2json';
import { transformResumeData, Pdf2JsonData } from '@/lib/transformResumeData';
import { extractPortfolioWithGroq, isGroqConfigured } from '@/lib/groq';


interface FileLike {
    arrayBuffer: () => Promise<ArrayBuffer>;
    size?: number;
    type?: string;
    name?: string;
}

interface ParsedResumeData {
    name: string;
    email: string;
    phone: string;
    headline: string;
    summary: string;
    skills: string[];
    experience: {
        company: string;
        position: string;
        startDate: string;
        endDate: string;
        description: string;
    }[];
    education: {
        institution: string;
        degree: string;
        startYear: string;
        endYear: string;
    }[];
    projects: { title: string; summary: string; link: string }[];
    rawText: string;
}

const SUPPRESSED_PDF_WARNINGS = [
    "Setting up fake worker",
    "Unsupported: field.type of Link",
    "NOT valid form element",
];

interface PdfParserErrorEvent {
    parserError: unknown;
}

interface PdfParserInstance {
    on(event: "pdfParser_dataError", handler: (errData: PdfParserErrorEvent) => void): void;
    on(event: "pdfParser_dataReady", handler: (pdfData: Pdf2JsonData) => void): void;
    parseBuffer(buffer: Buffer): void;
}

function isFileLike(x: unknown): x is FileLike {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return !!x && typeof (x as any).arrayBuffer === 'function';
}


async function parsePdfWithPdf2Json(buffer: Buffer | Uint8Array): Promise<Pdf2JsonData> {

    const pdfBuffer = Buffer.from(buffer);
    const originalWarn = console.warn;
    const originalLog = console.log;
    const shouldSuppressPdfWarning = (value: unknown) => {
        const text = typeof value === 'string' ? value : String(value);
        return SUPPRESSED_PDF_WARNINGS.some((warning) => text.includes(warning));
    };

    console.warn = (...args: unknown[]) => {
        if (args.some((arg) => shouldSuppressPdfWarning(arg))) {
            return;
        }

        originalWarn(...args);
    };

    console.log = (...args: unknown[]) => {
        if (args.some((arg) => shouldSuppressPdfWarning(arg))) {
            return;
        }

        originalLog(...args);
    };

    return new Promise((resolve, reject) => {
        const PdfParserCtor = Pdfparser as unknown as new (context?: unknown, scale?: number) => PdfParserInstance;
        const pdfParser = new PdfParserCtor(null, 1);

        pdfParser.on("pdfParser_dataError", (errData: PdfParserErrorEvent) => {
            console.warn = originalWarn;
            console.log = originalLog;
            console.error("PDF2JSON Error:", errData.parserError);
            reject(new Error(`PDF parsing failed: ${errData.parserError}`));
        });

        pdfParser.on("pdfParser_dataReady", (pdfData: Pdf2JsonData) => {
            console.warn = originalWarn;
            console.log = originalLog;
            resolve(pdfData);
        });


        try {
            pdfParser.parseBuffer(pdfBuffer);
        } catch (error) {
            console.warn = originalWarn;
            console.log = originalLog;
            reject(error);
        }
    });
}

function extractRawTextFromPdfData(rawData: Pdf2JsonData): string {
    return rawData.Pages.flatMap((page) =>
        page.Texts.map((text) => {
            const rawToken = text.R?.[0]?.T;
            if (!rawToken) return '';

            try {
                return decodeURIComponent(rawToken);
            } catch {
                return rawToken;
            }
        })
    ).join('\n');
}

function mapLegacyExtraction(data: ReturnType<typeof transformResumeData>): ParsedResumeData {
    return {
        name: data.name || '',
        email: data.email,
        phone: data.phone,
        headline: data.headline || '',
        summary: data.summary || '',
        skills: data.skills,
        experience: data.experience.map((item) => ({
            company: item.company,
            position: item.role,
            startDate: item.duration,
            endDate: '',
            description: item.description,
        })),
        education: data.education.map((item) => ({
            institution: item.school,
            degree: item.degree,
            startYear: item.year,
            endYear: '',
        })),
        projects: data.projects.map((project) => ({
            title: project.title,
            summary: project.summary,
            link: '',
        })),
        rawText: data.rawText.slice(0, 4000),
    };
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

        let data: Pdf2JsonData;
        try {
            data = await parsePdfWithPdf2Json(buffer);
        } catch (err) {
            console.error('PDF parsing failed:', err);
            return NextResponse.json({ error: 'Failed to process PDF file. The parser encountered an internal error.' }, { status: 500 });
        }

        const rawText = extractRawTextFromPdfData(data);
        const legacyExtraction = transformResumeData(data);

        let parsedData: ParsedResumeData;

        if (isGroqConfigured()) {
            try {
                const groqExtraction = await extractPortfolioWithGroq(rawText);
                parsedData = {
                    name: groqExtraction.name,
                    email: groqExtraction.email,
                    phone: groqExtraction.phone,
                    headline: groqExtraction.headline,
                    summary: groqExtraction.summary,
                    skills: groqExtraction.skills,
                    experience: groqExtraction.experience,
                    education: groqExtraction.education,
                    projects: groqExtraction.projects.map((project) => ({
                        title: project.name,
                        summary: project.description,
                        link: project.link || '',
                    })),
                    rawText: rawText.slice(0, 4000),
                };
            } catch (err) {
                console.error('Groq extraction failed, falling back to local parser:', err);
                parsedData = mapLegacyExtraction(legacyExtraction);
            }
        } else {
            parsedData = mapLegacyExtraction(legacyExtraction);
        }

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
