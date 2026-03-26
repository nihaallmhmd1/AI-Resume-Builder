import { NextResponse } from 'next/server';
import { groq } from '@/lib/groq';

export async function POST(request) {
  try {
    const data = await request.json();
    
    const { 
      fullName, 
      email, 
      phone,
      github,
      linkedin,
      summary, 
      skills, 
      education, 
      experience, 
      projects,
      languages,
      template
    } = data;
 
    const hasExperience = Array.isArray(experience) && experience.some(e => (e.company || '').trim() !== '' || (e.department || '').trim() !== '');
    const hasProjects = Array.isArray(projects) && projects.some(p => (p.title || '').trim() !== '' || (p.description || '').trim() !== '');
    const hasEducation = Array.isArray(education) && education.some(e => (e.college || '').trim() !== '' || (e.degree || '').trim() !== '');

    const prompt = `
      You are an expert resume writer and UI developer. Please generate a highly professional, beautifully formatted resume using HTML tags and inline CSS based on the following details.
      
      CRITICAL INSTRUCTIONS FOR ALIGNMENT AND PROFESSIONALISM:
      1. Use strictly inline CSS (\`style="..."\`) for all styling.
      2. For layouts like Work Experience or Education, ALWAYS use Flexbox (\`display: flex; justify-content: space-between; align-items: flex-start;\`) to align the Job Title/Degree perfectly to the left and the Date/Location perfectly to the right on the same line.
      3. Ensure consistent margins and padding. Add padding between sections (e.g., \`padding-bottom: 15px; margin-bottom: 15px;\`).
      4. Use professional fonts (e.g., \`font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;\`).
      5. Make sure bullet points (\`<ul>\`) have proper padding-left (e.g., \`20px\`), margin-top (\`5px\`), and tight line-height (e.g., \`1.5\`).
      6. Do not include HTML boilerplate (like <html>, <head>, <body>), ONLY the interior content (wrap everything in a main \`<div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">\` or similar).
      7. Do NOT wrap in markdown code blocks like \`\`\`html.
      8. ${!hasExperience ? 'CAUTION: No work experience provided. DO NOT include a "Work Experience" section.' : ''}
      9. ${!hasProjects ? 'CAUTION: No projects provided. DO NOT include a "Projects" section.' : ''}

      Details:
      Name: ${fullName}
      Email: ${email}
      Phone: ${phone}
      ${github ? `GitHub: ${github}` : ''}
      ${linkedin ? `LinkedIn: ${linkedin}` : ''}

      Professional Summary:
      ${summary}

      Skills:
      ${Array.isArray(skills) ? skills.join(', ') : skills}

      ${hasEducation ? `Education:
      ${education.map(e => `${e.degree} - ${e.college} (${e.year})`).join('\n      ')}` : 'NO EDUCATION PROVIDED. DO NOT include an Education section.'}

      ${hasExperience ? `Work Experience:
      ${experience.map(e => `${e.department} at ${e.company} (${e.year}): ${e.description}`).join('\n      ')}` : ''}

      ${hasProjects ? `Projects:
      ${projects.map(p => `${p.title}: ${p.description}`).join('\n      ')}` : ''}

      Languages Known:
      ${Array.isArray(languages) ? languages.join(', ') : languages}
    `;

    const templateInstructions = {
      'professional': `
        Style Guidelines (Professional - Experienced):
        - STRICT ATS RULES: Use ONLY standard linear HTML tags (<h1>, <h2>, <p>, <ul>, <li>). NO absolute positioning. NO tables.
        - Font: 'Inter', sans-serif. Color: #111827.
        - Wrapping: \`<div style="max-width: 800px; margin: 0 auto; line-height: 1.5;">\`
        - Header: Center Name (<h1>) boldly. Below it, center Contact Info (email | phone | optional github/linkedin if provided) separated by vertical bars.
        - Section Headings (<h2>): Bold, uppercase, strictly a bottom border (e.g. \`border-bottom: 2px solid #2563eb;\`), color: #1e3a8a, margin-top: 24px, padding-bottom: 5px.
        - Experience Items: Wrap each job header in \`<div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px; font-weight: bold;">\`. Left side Title, Right side Date.
        - Sub-titles: Company name on the next line in italics.
        - Bullet points: Highly metric-driven. Use standard \`<ul style="padding-left: 20px; margin-top: 5px;">\`. No fancy icons.
      `,
      'fresher': `
        Style Guidelines (Fresher - Entry Level):
        - STRICT ATS RULES: Use ONLY standard linear HTML tags. DO NOT include a Work Experience section.
        - Font: 'Helvetica Neue', Arial, sans-serif. Color: #1f2937.
        - Header: Name is massive (40px) and left-aligned. Contact info is grouped below \`<div style="display: flex; gap: 20px; color: #4b5563; font-size: 14px; margin-top: 5px;">\`.
        - Section Headings (<h2>): \`border-left: 4px solid #10b981; padding-left: 10px; background-color: #ecfdf5; color: #065f46; margin-top: 20px; padding-block: 4px;\`
        - Education: Must be the first section after Summary. Emphasize GPA/Relevant Coursework if available.
        - Projects: Detailed bullet points on technical stack used.
        - Simple Bullet Points, strict left-to-right reading flow.
      `,
      'data-scientist': `
        Style Guidelines (Data Scientist / Tech):
        - STRICT ATS RULES: Use ONLY standard linear HTML tags. 
        - Font: 'Inter', sans-serif. Color: #0f172a.
        - Header: Center-aligned.
        - Skills Section: Must be prominent. Format as a neat inline list or comma-separated to ensure applicant tracking systems index every keyword accurately.
        - Section Headings (<h2>): \`border-bottom: 2px solid #8b5cf6; color: #4c1d95; text-transform: uppercase; margin-top: 24px; padding-bottom: 4px;\`
        - Experience Items: \`<div style="display: flex; justify-content: space-between; font-weight: bold;">\`
        - Bullet points MUST emphasize data tools (Python, SQL, PyTorch) and quantifiable metric impacts (e.g., "improved accuracy by 15%").
      `,
      'creative': `
        Style Guidelines (Creative):
        - Use ONLY standard linear HTML tags.
        - Font: 'Outfit', 'Helvetica Neue', sans-serif. Color: #1e293b.
        - Emphasize design and creativity. Use subtle #ec4899 (Pink) for accents.
        - Header: Name in large bold letters, with a bright pink bottom border.
        - Section Headings (<h2>): \`color: #be185d; border-bottom: 2px dashed #fbcfe8; font-weight: bold; margin-top: 24px; padding-bottom: 4px;\`
        - Experience Items: Title on left, date on right.
      `,
      'executive': `
        Style Guidelines (Executive):
        - Use ONLY standard linear HTML tags.
        - Font: 'Georgia', serif. Color: #0f172a.
        - Highly structured, authoritative, and classic.
        - Header: Centered, all caps for name.
        - Section Headings (<h2>): \`border-bottom: 1px solid #94a3b8; text-transform: uppercase; letter-spacing: 2px; color: #334155; margin-top: 24px; padding-bottom: 4px;\`
      `,
      'technical': `
        Style Guidelines (Technical / IT):
        - Use ONLY standard linear HTML tags.
        - Font: 'Roboto Mono', 'Courier New', monospace for skills, 'Inter' for body. Color: #1e293b.
        - Skills block at the top, highly visible. Accent color: #d97706 (Amber).
        - Section Headings (<h2>): \`background-color: #fffbeb; color: #b45309; padding: 4px 8px; border-left: 4px solid #f59e0b; margin-top: 24px;\`
      `,
      'academic': `
        Style Guidelines (Academic CV):
        - Use ONLY standard linear HTML tags.
        - Font: 'Times New Roman', serif. Color: #000000.
        - Focus on Education, Publications, and Research if applicable.
        - Header: Centered, simple.
        - Section Headings (<h2>): \`border-bottom: 1px solid #000; text-transform: uppercase; margin-top: 24px; padding-bottom: 4px;\`
      `,
      'minimalist': `
        Style Guidelines (Minimalist):
        - Use ONLY standard linear HTML tags.
        - Font: 'Helvetica Neue', sans-serif. Color: #171717.
        - Ultra-clean, lots of whitespace. No background colors.
        - Header: Left-aligned, small but bold name.
        - Section Headings (<h2>): \`color: #000; font-weight: normal; text-transform: lowercase; letter-spacing: 1px; margin-top: 32px; padding-bottom: 4px;\`
      `,
      'modern': `
        Style Guidelines (Modern):
        - Use ONLY standard linear HTML tags.
        - Font: 'Inter', sans-serif. Color: #111827.
        - Striking contrast. Accent color: #dc2626 (Red).
        - Header: Name is very large text with red dot at the end.
        - Section Headings (<h2>): \`color: #991b1b; font-weight: 900; text-transform: uppercase; margin-top: 24px; padding-bottom: 4px;\`
      `,
      'startup': `
        Style Guidelines (Startup / Entrepreneur):
        - Use ONLY standard linear HTML tags.
        - Font: 'Inter', sans-serif. Color: #0f172a.
        - Action-oriented, dynamic. Accent color: #ea580c (Orange).
        - Header: Right-aligned contact info, left-aligned name.
        - Section Headings (<h2>): \`color: #c2410c; border-bottom: 3px solid #ffedd5; margin-top: 24px; padding-bottom: 4px;\`
      `,
      'healthcare': `
        Style Guidelines (Healthcare):
        - Use ONLY standard linear HTML tags.
        - Font: 'Arial', sans-serif. Color: #1e3a8a.
        - Traditional, trustworthy. Accent color: #0284c7 (Sky Blue).
        - Focus on certifications and clinical experience.
        - Section Headings (<h2>): \`color: #0369a1; border-bottom: 2px solid #bae6fd; margin-top: 24px; padding-bottom: 4px;\`
      `,
      'finance': `
        Style Guidelines (Finance / Corporate):
        - Use ONLY standard linear HTML tags.
        - Font: 'Garamond', serif. Color: #000000.
        - Strict, conservative. Accent color: #166534 (Dark Green).
        - Highlight quantifiable metrics ($ amounts, percentages).
        - Section Headings (<h2>): \`color: #14532d; border-bottom: 1px solid #86efac; text-transform: uppercase; margin-top: 24px; padding-bottom: 4px;\`
      `
    };

    const stylePrompt = templateInstructions[template] || templateInstructions['modern-professional'];

    if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY.includes('your_groq_api_key_here')) {
      return NextResponse.json(
        { success: false, error: 'Groq API Key is not configured. Please add your real key to the .env.local file.' },
        { status: 400 }
      );
    }

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are an expert resume writer. Respond ONLY with the requested HTML content. Do NOT wrap it in any markdown code blocks. 
          Use the following style guidelines: ${stylePrompt}`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'llama-3.1-8b-instant',
      temperature: 0.7,
      max_tokens: 3000,
      top_p: 1,
    });

    const generatedResume = chatCompletion.choices[0]?.message?.content || '';

    // Some models still add markdown blocks despite instructions, remove them if present
    const cleanedResume = generatedResume.replace(/^```(html)?|```$/gm, '').trim();

    return NextResponse.json({ success: true, resume: cleanedResume });
  } catch (error) {
    console.error('Error generating resume:', error);
    
    // Check if it's an API error from Groq
    if (error.error && error.error.error && error.error.error.message) {
       return NextResponse.json(
         { success: false, error: `Groq API Error: ${error.error.error.message}` },
         { status: 500 }
       );
    }

    return NextResponse.json(
      { success: false, error: error.message || 'Failed to generate resume' },
      { status: 500 }
    );
  }
}
