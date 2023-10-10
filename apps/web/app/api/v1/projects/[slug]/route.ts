import { NextResponse } from 'next/server';
import { deleteProjectBySlug, getProjectBySlug, updateProjectBySlug } from '@/lib/api/projects';

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
export async function PUT(req: Request, context: { params: { slug: string } }) {
  const { name, slug } = await req.json();

  // Validate Request Body
  if (!name || !slug) {
    return NextResponse.json({ error: 'name and slug are required.' }, { status: 400 });
  }

  const { data: updatedProject, error } = await updateProjectBySlug(
    context.params.slug,
    { name, slug },
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
