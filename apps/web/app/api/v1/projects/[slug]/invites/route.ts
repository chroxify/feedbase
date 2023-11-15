import { NextResponse } from 'next/server';
import { createProjectInvite, getProjectInvites } from '@/lib/api/invites';

/*
  Get all project invites
  GET /api/v1/projects/[slug]/invites
*/
export async function GET(req: Request, context: { params: { slug: string } }) {
  const { data: invites, error } = await getProjectInvites(context.params.slug, 'route');

  // If any errors thrown, return error
  if (error) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  // Return invites
  return NextResponse.json(invites, { status: 200 });
}

/* 
  Invite a new member to a project
  POST /api/v1/projects/[slug]/members
  {
    email: string
  }
*/
export async function POST(req: Request, context: { params: { slug: string } }) {
  const { email } = await req.json();

  // Check if email is valid
  const emailRegex = new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }

  // Create invite
  const { data: invite, error } = await createProjectInvite(context.params.slug, 'route', email);

  // If any errors thrown, return error
  if (error) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  // Return invite
  return NextResponse.json(invite, { status: 200 });
}
