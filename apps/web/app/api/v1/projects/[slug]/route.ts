import { NextResponse } from 'next/server';
import { deleteProjectBySlug, getProjectBySlug, updateProjectBySlug } from '@/lib/api/projects';
import { ProjectProps } from '@/lib/types';

/*
    Get project by slug
    GET /api/v1/projects/[slug]
*/
export async function GET(req: Request, context: { params: { slug: string } }) {
  const { data: project, error } = await getProjectBySlug(context.params.slug, 'route');
  // If any errors thrown, return error
  if (error) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  // Return project
  return NextResponse.json({ project }, { status: 200 });
}

/*
    Update project by slug
    PUT /api/v1/projects/[slug]
*/
export async function PATCH(req: Request, context: { params: { slug: string } }) {
  const { name, slug, icon, icon_radius: iconRadius } = (await req.json()) as ProjectProps['Update'];

  const { data: updatedProject, error } = await updateProjectBySlug(
    context.params.slug,
    { name, slug, icon, icon_radius: iconRadius },
    'route'
  );

  // If any errors thrown, return error
  if (error) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  // Return updated project
  return NextResponse.json(updatedProject, { status: 200 });
}

/*
    Delete project by slug
    DELETE /api/v1/projects/[slug]
*/
export async function DELETE(req: Request, context: { params: { slug: string } }) {
  const { data, error } = await deleteProjectBySlug(context.params.slug, 'route');

  // If any errors thrown, return error
  if (error) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  // Return success
  return NextResponse.json({ data }, { status: 200 });
}
