import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req) {
  try {
    const body = await req.json();
    const { originalFormData, generatedHtml } = body;

    if (!originalFormData || !generatedHtml) {
      return NextResponse.json(
        { success: false, error: 'Missing required data for ATS scoring.' },
        { status: 400 }
      );
    }

    if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY.includes('your_groq_api_key_here')) {
      return NextResponse.json(
        { success: false, error: 'Groq API Key is not configured.' },
        { status: 400 }
      );
    }

    const prompt = `
      You are an expert Applicant Tracking System (ATS) software parser and Technical Recruiter.
      I will provide you with a candidate's original raw input data, and the HTML resume that was generated from it.

      Your task is to analyze the HTML resume for:
      1. Keyword Match & Density (Is it missing crucial keywords based on their skills/experience?)
      2. Impact Formatting (Does it use strong action verbs and quantifiable metrics?)
      3. Parsability (Are there any complex tables or nested elements that would break an older ATS? Ensure it uses standard semantic flow.)

      Original Input Data:
      ${JSON.stringify(originalFormData)}

      Generated HTML Resume:
      ${generatedHtml}

      Respond ONLY with a valid JSON object matching exactly this structure. DO NOT wrap it in markdown block quotes like \`\`\`json.
      {
        "score": <integer from 0 to 100 based strictly on how ATS-friendly and metric-driven it is>,
        "suggestions": [
          "<string: a highly specific, actionable tip to improve the resume content or layout>",
          "<string: another actionable tip>",
          "<string: another actionable tip>"
        ]
      }
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You output strict, raw JSON only. You are a robotic ATS parser.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'llama-3.1-8b-instant',
      temperature: 0.2, // Low temperature for consistent JSON
      response_format: { type: "json_object" },
    });

    const responseContent = chatCompletion.choices[0]?.message?.content || '{}';
    const parsedScoring = JSON.parse(responseContent);

    return NextResponse.json({
      success: true,
      atsData: {
        score: parsedScoring.score || 70,
        suggestions: parsedScoring.suggestions || ["Add more quantifiable metrics.", "Ensure all keywords from your target job are present."]
      }
    });

  } catch (error) {
    console.error('ATS Scoring Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to calculate ATS score.' },
      { status: 500 }
    );
  }
}
