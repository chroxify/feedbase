import { NextResponse } from "next/server";

/*
  API Info
  GET /api/v1
*/
export async function GET(req: Request) {
  return NextResponse.json(
    {
      message: 'hi there!',
      version: 'v1',
      docs: 'https://docs.supabase.io',
    },

    { status: 200 }
  );
}