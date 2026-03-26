import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import PDFParser from 'pdf2json';
import mammoth from 'mammoth';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req) {
  try {
    const formData = await req.formData();
    const resumeFile = formData.get('resume');
    const jobDescription = formData.get('jobDescription');

    if (!resumeFile) {
      return NextResponse.json(
        { success: false, error: 'Resume file is required.' },
        { status: 400 }
      );
    }

    if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY.includes('your_groq_api_key_here')) {
      return NextResponse.json(
        { success: false, error: 'Groq API Key is not configured.' },
        { status: 400 }
      );
    }

    let resumeText = '';
    const arrayBuffer = await resumeFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Extract text based on file type
    if (resumeFile.type === 'application/pdf') {
       try {
         const pdfBuffer = Buffer.from(await resumeFile.arrayBuffer());
         
         resumeText = await new Promise((resolve, reject) => {
           const pdfParser = new PDFParser(null, 1); // 1 = text only extraction
           
           pdfParser.on("pdfParser_dataError", errData => reject(errData.parserError));
           pdfParser.on("pdfParser_dataReady", pdfData => {
              const rawText = pdfParser.getRawTextContent();
              resolve(rawText);
           });
           
           pdfParser.parseBuffer(pdfBuffer);
         });
         
         console.log("PDF parsed successfully, length:", resumeText.length);
       } catch (err) {
         console.error("PDF Parsing error:", err);
         return NextResponse.json({ success: false, error: 'Failed to parse PDF document.' }, { status: 400 });
       }
    } else if (
      resumeFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      resumeFile.name.endsWith('.docx')
    ) {
      try {
        const result = await mammoth.extractRawText({ buffer: buffer });
        resumeText = result.value;
      } catch (err) {
        console.error("DOCX Parsing error:", err);
        return NextResponse.json({ success: false, error: 'Failed to parse DOCX.' }, { status: 400 });
      }
    } else {
      // Fallback for raw text files just in case
      try {
        resumeText = buffer.toString('utf-8');
      } catch (err) {
        return NextResponse.json({ success: false, error: 'Unsupported file format.' }, { status: 400 });
      }
    }

    if (!resumeText || resumeText.trim().length < 50) {
      return NextResponse.json(
        { success: false, error: 'Could not extract enough text from the file.' },
        { status: 400 }
      );
    }

    const jobContext = jobDescription 
      ? `The candidate is targeting this specific job description:\n"${jobDescription}"\n\nAnalyze how well the resume matches this JD.` 
      : 'No specific job description provided. Perform a general ATS best-practices analysis.';

    const prompt = `
      You are an expert ATS (Applicant Tracking System) resume analyzer used by recruiters.
      Your task is to analyze a candidate's resume against a job description and provide a detailed ATS compatibility report.

      ${jobContext}

      Raw Resume Text:
      """
      ${resumeText}
      """

      Analyze the following:
      1. ATS Score (0–100): Be brutally honest. Penalize lack of exact keywords, missing metrics, and bad formatting. First pass: baseline. Second pass: penalize missing skills.
      2. Keyword Match Analysis: Extract important keywords from the job description and check if they appear in the resume. 
      3. Skills Match: Compare required skills vs candidate skills.
      4. Resume Structure Check: Contact information, Summary / Objective, Skills section, Experience, Education, Projects / Certifications.
      5. Formatting Issues: Detect ATS-unfriendly elements (tables, images, complex formatting) based on the raw text structure (e.g., weird spacing, missing line breaks).
      6. Improvement Suggestions: Specific tips to improve ATS score, add missing keywords, and improve sections.
      7. Final Recommendation: Output exactly one of: "Strong Match", "Moderate Match", "Weak Match".

      Respond ONLY with a valid JSON object matching exactly this structure. DO NOT wrap it in markdown block quotes.
      {
        "ats_score": 65,
        "keyword_match": {
          "matched": ["string", "string"],
          "missing": ["string"]
        },
        "skills_match": {
          "matched_skills": ["string"],
          "missing_skills": ["string"]
        },
        "resume_sections": {
          "present": ["string"],
          "missing": ["string"]
        },
        "formatting_issues": ["string"],
        "improvement_suggestions": ["string", "string"],
        "final_recommendation": "Moderate Match"
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
      temperature: 0.2,
      response_format: { type: "json_object" },
    });

    const responseContent = chatCompletion.choices[0]?.message?.content || '{}';
    let parsedScoring = { 
      ats_score: 50, 
      keyword_match: { matched: [], missing: [] },
      skills_match: { matched_skills: [], missing_skills: [] },
      resume_sections: { present: [], missing: [] },
      formatting_issues: ["Could not parse response formatting."],
      improvement_suggestions: ["An error occurred during analysis."],
      final_recommendation: "Weak Match"
    };
    
    try {
      parsedScoring = JSON.parse(responseContent);
    } catch (e) {
      console.error("Failed to parse Groq response:", responseContent);
    }

    return NextResponse.json({
      success: true,
      atsData: parsedScoring
    });

  } catch (error) {
    console.error('External ATS Scoring Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to calculate external ATS score.' },
      { status: 500 }
    );
  }
}
