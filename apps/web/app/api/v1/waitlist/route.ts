import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/lib/supabase';

/*
    Enroll in Waitlist
    POST /api/v1/waitlist
    {
        "name": "User Name",
        "email": "email@email.com"
    }
*/
export async function POST(req: Request) {
  // Get Request Body
  const { name, email } = await req.json();

  // Validate Request Body
  if (!name || !email) {
    return NextResponse.json({ error: 'name and email are required.' }, { status: 400 });
  }

  // Supabase Client
  const cookieStore = cookies();
  const supabase = await createRouteHandlerClient<Database>({ cookies: () => cookieStore });

  // Insert into Waitlist
  const { error } = await supabase.from('waitlist').insert({ name, email });

  // Check for errors
  if (error) {
    // If error contains "duplicate key value violates unique constraint", return 409
    if (error.message.includes('duplicate key value violates unique constraint')) {
      return NextResponse.json({ error: 'You are already on the waitlist.' }, { status: 409 });
    }

    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Return data
  return NextResponse.json({ success: true });
}
