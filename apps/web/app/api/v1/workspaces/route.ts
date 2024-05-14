import { NextResponse } from 'next/server';
import { getUserProjects } from '@/lib/api/user';
import { createProject } from '@/lib/api/workspace';

/*
    Create Workspace
    POST /api/v1/workspaces
    {
        "name": "Workspace Name",
        "slug": "workspace-slug",
    }
*/
export async function POST(req: Request) {
  // Get Request Body
  const { name, slug } = await req.json();

  // Validate Request Body
  if (!name || !slug) {
    return NextResponse.json({ error: 'name and slug are required.' }, { status: 400 });
  }

  // Create Workspace
  const { data: workspace, error } = await createProject({ name, slug }, 'route');

  // Check for errors
  if (error) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  return NextResponse.json(workspace, { status: 201 });
}

/*
    Get User Projects
    GET /api/v1/workspaces
*/
export async function GET(req: Request) {
  // Get User Projects
  const { data: workspaces, error } = await getUserProjects('route');

  // Check for errors
  if (error) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  // Return workspaces
  return NextResponse.json(workspaces, { status: 200 });
}
