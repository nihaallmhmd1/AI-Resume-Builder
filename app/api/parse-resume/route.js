import { NextResponse } from 'next/server';
import PDFParser from 'pdf2json';
import mammoth from 'mammoth';
import { groq } from '@/lib/groq';

export async function POST(request) {
  try {
    const formData = await request.json();
    const { fileBase64, fileName, fileType } = formData;
    
    if (!fileBase64) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(fileBase64, 'base64');
    let resumeText = '';

    // Extract text based on file type
    if (fileType === 'application/pdf') {
      resumeText = await new Promise((resolve, reject) => {
        const pdfParser = new PDFParser(null, 1);
        pdfParser.on("pdfParser_dataError", (errData) => reject(errData.parserError));
        pdfParser.on("pdfParser_dataReady", () => {
          const rawText = pdfParser.getRawTextContent();
          resolve(rawText);
        });
        pdfParser.parseBuffer(buffer);
      });
    } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || fileName.endsWith('.docx')) {
      const result = await mammoth.extractRawText({ buffer: buffer });
      resumeText = result.value;
    } else {
      resumeText = buffer.toString('utf8');
    }

    if (!resumeText || resumeText.length < 50) {
      return NextResponse.json({ success: false, error: 'Could not extract enough text from the file.' }, { status: 400 });
    }

    // Use AI to structure the extracted text
    const prompt = `
      You are an expert ATS (Applicant Tracking System) parser. Extract the following information from the resume text into a CLEAN JSON object.
      
      JSON keys required:
      - fullName: string
      - email: string
      - phone: string
      - github: string (optional)
      - linkedin: string (optional)
      - summary: string (concise 2-sentence professional summary)
      - skills: array of strings
      - education: array of objects { degree, college, year }
      - experience: array of objects { company, department, year, description }
      - projects: array of objects { title, description }
      - languages: array of strings
      
      RESUME TEXT:
      """
      ${resumeText}
      """
      
      Respond ONLY with the raw JSON object. Do not include any explanation or markdown blocks.
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a robotic ATS parser. You output ONLY valid JSON.' },
        { role: 'user', content: prompt }
      ],
      model: 'llama-3.1-8b-instant',
      temperature: 0.1,
      response_format: { type: "json_object" }
    });

    const analysis = JSON.parse(chatCompletion.choices[0]?.message?.content || '{}');

    return NextResponse.json({ success: true, data: analysis });
  } catch (error) {
    console.error('Error parsing resume:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to parse resume' }, { status: 500 });
  }
}
