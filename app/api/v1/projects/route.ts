import { NextResponse } from 'next/server';
import { createProject, getUserProjects } from '@/lib/api/projects';

/*
    Create Project
    POST /api/v1/projects
    {
        "name": "Project Name",
        "slug": "project-slug",
    }
*/
export async function POST(req: Request) {
  // Get Request Body
  const { name, slug } = await req.json();

  // Validate Request Body
  if (!name || !slug) {
    return NextResponse.json({ error: 'name and slug are required.' }, { status: 400 });
  }

  // Create Project
  const { data: project, error } = await createProject({ name, slug }, 'route');

  // Check for errors
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(project, { status: 201 });
}

/*
    Get User Projects
    GET /api/v1/projects
*/
export async function GET(req: Request) {
  // Get User Projects
  const { data: projects, error } = await getUserProjects('route');

  // Check for errors
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Return projects
  return NextResponse.json(projects, { status: 200 });
}
