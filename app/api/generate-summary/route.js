import { NextResponse } from 'next/server';
import { groq } from '@/lib/groq';

export async function POST(request) {
  try {
    const data = await request.json();
    
    const { 
      fullName, 
      skills, 
      experience,
      education,
      projects
    } = data;

    const prompt = `
      You are an expert professional resume writer. Please write a powerful, concise, and ATS-friendly professional summary (3-4 sentences maximum) for a resume based on the following details. 
      Focus on highlighting the most impressive skills, quantifiable achievements from experience, and the candidate's unique value proposition.
      Do not include any introductory text, pleasantries, or formatting. JUST return the raw text paragraph of the summary.

      Name: ${fullName || 'Not provided'}
      Skills: ${skills || 'Not provided'}
      Experience: ${experience || 'Not provided'}
      Education: ${education || 'Not provided'}
      Projects: ${projects || 'Not provided'}
    `;

    if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY.includes('your_groq_api_key_here')) {
      return NextResponse.json(
        { success: false, error: 'Groq API Key is not configured.' },
        { status: 400 }
      );
    }

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert resume writer. Respond ONLY with the requested professional summary paragraph. No intro, no outro, no markdown formatting.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'llama-3.1-8b-instant',
      temperature: 0.7,
      max_tokens: 300,
    });

    const generatedSummary = chatCompletion.choices[0]?.message?.content?.trim() || '';

    return NextResponse.json({ success: true, summary: generatedSummary });
  } catch (error) {
    console.error('Error generating summary:', error);
    
    if (error.error && error.error.error && error.error.error.message) {
       return NextResponse.json(
         { success: false, error: `Groq API Error: ${error.error.error.message}` },
         { status: 500 }
       );
    }

    return NextResponse.json(
      { success: false, error: error.message || 'Failed to generate summary' },
      { status: 500 }
    );
  }
}
