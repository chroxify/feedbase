import { NextResponse } from 'next/server';
import { deleteProjectBySlug, getWorkspaceBySlug, updateProjectBySlug } from '@/lib/api/workspace';
import { WorkspaceProps } from '@/lib/types';

/*
    Get workspace by slug
    GET /api/v1/workspaces/[slug]
*/
export async function GET(req: Request, context: { params: { slug: string } }) {
  const { data: workspace, error } = await getWorkspaceBySlug(context.params.slug, 'route');
  // If any errors thrown, return error
  if (error) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  // Return workspace
  return NextResponse.json({ workspace }, { status: 200 });
}

/*
    Update workspace by slug
    PATCH /api/v1/workspaces/[slug]
    {
      name: string,
      slug: string,
      icon: string,
      icon_radius: string,
      og_image: string
    }
*/
export async function PATCH(req: Request, context: { params: { slug: string } }) {
  const {
    name,
    slug,
    icon,
    icon_radius: iconRadius,
    og_image: OGImage,
  } = (await req.json()) as WorkspaceProps['Update'];

  const { data: updatedProject, error } = await updateProjectBySlug(
    context.params.slug,
    { name, slug, icon, icon_radius: iconRadius, og_image: OGImage },
    'route'
  );

  // If any errors thrown, return error
  if (error) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  // Return updated workspace
  return NextResponse.json(updatedProject, { status: 200 });
}

/*
    Delete workspace by slug
    DELETE /api/v1/workspaces/[slug]
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
