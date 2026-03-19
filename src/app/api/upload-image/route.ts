import { NextResponse } from 'next/server';


export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        // Convert to base64 Data URI to avoid local filesystem storage on Vercel
        const base64String = buffer.toString('base64');
        const fileUrl = `data:${file.type};base64,${base64String}`;
        
        return NextResponse.json({ url: fileUrl });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}
