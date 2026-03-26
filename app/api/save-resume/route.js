import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request) {
  try {
    const data = await request.json();
    const { fullName, email, phone, generatedResume, userId } = data;

    // We can't insert into Supabase if it hasn't been configured properly by the user
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your_supabase_url')) {
        return NextResponse.json(
          { success: false, error: 'Supabase credentials are not configured.' },
          { status: 400 }
        );
    }

    if (!userId) {
       return NextResponse.json(
         { success: false, error: 'User must be authenticated to save a resume.' },
         { status: 401 }
       );
    }

    const { data: insertedData, error } = await supabase
      .from('resumes')
      .insert([
        {
          user_id: userId,
          full_name: fullName,
          email,
          phone,
          generated_html: generatedResume,
        },
      ])
      .select();

    if (error) {
      console.error('Supabase Error:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: insertedData });
  } catch (error) {
    console.error('Error saving resume:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save resume' },
      { status: 500 }
    );
  }
}
