import { withProjectAuth } from '@/lib/auth';
import { NextResponse } from 'next/server';

/*
    Get project by slug
    GET /api/v1/projects/[slug]
*/
export const GET = withProjectAuth(
  async (req, user, supabase, project, context: { params: { slug: string } }) => {
    // Return project
    return NextResponse.json(project, { status: 200 });
  }
);

/*
    Delete project by slug
    DELETE /api/v1/projects/[slug]
*/
export const DELETE = withProjectAuth(
  async (req, user, supabase, project, context: { params: { slug: string } }) => {
    console.log(project);
    // Delete project
    const { error } = await supabase.from('projects').delete().eq('id', project.id);

    // Check for errors
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Return no content response
    return new Response(null, { status: 204 });
  }
);
