import { NextResponse } from 'next/server';
import { getProjectMembers } from '@/lib/api/workspace';

/*
    Get all members of a workspace
    GET /api/v1/workspaces/[slug]/members
*/
export async function GET(req: Request, context: { params: { slug: string } }) {
  const { data: members, error } = await getProjectMembers(context.params.slug, 'route');

  // If any errors thrown, return error
  if (error) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  // Return members
  return NextResponse.json(members, { status: 200 });
}
