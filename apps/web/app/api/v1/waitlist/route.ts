import { NextResponse } from 'next/server';

/*
    Enroll in Waitlist
    POST /api/v1/waitlist
    {
        "name": "User Name",
        "email": "email@email.com"
    }
*/
export async function POST(req: Request) {
  // Return data
  return NextResponse.json({ error: 'Waitlist is closed.' }, { status: 400 });
}
