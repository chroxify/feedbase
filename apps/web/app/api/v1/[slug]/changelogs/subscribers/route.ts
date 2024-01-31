import { NextResponse } from 'next/server';
import { subscribeToProjectChangelogs, unsubscribeFromProjectChangelogs } from '@/lib/api/public';

/*
  Subscribe to project changelogs
  POST /api/v1/:slug/changelogs/subscribers
  {
    email: string,
  }
*/
export async function POST(req: Request, context: { params: { slug: string } }) {
  const { email } = await req.json();

  // Check if email is provided
  if (!email) {
    return NextResponse.json({ error: 'email is required.' }, { status: 400 });
  }

  // Subscribe to project changelogs
  const { data: subscriber, error } = await subscribeToProjectChangelogs(context.params.slug, email);

  // If any errors thrown, return error
  if (error) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  // Return subscriber
  return NextResponse.json(subscriber, { status: 200 });
}

/*
  Unsubscribe from project changelogs
  DELETE /api/v1/:slug/changelogs/subscribers
  {
    subId: string,
  }
*/
export async function DELETE(req: Request, context: { params: { slug: string } }) {
  const { subId } = await req.json();

  // Check if subId is provided
  if (!subId) {
    return NextResponse.json({ error: 'subId is required.' }, { status: 400 });
  }

  // Unsubscribe from project changelogs
  const { error } = await unsubscribeFromProjectChangelogs(context.params.slug, subId);

  // If any errors thrown, return error
  if (error) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  // Return success
  return NextResponse.json({ success: true }, { status: 200 });
}
