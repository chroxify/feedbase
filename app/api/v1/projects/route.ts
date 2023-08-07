import { isSlugValid } from '@/lib/utils';
import { withUserAuth } from '@/lib/auth';
import { NextResponse } from 'next/server';

/*
    Create Project
    POST /api/v1/projects
    {
        "name": "Project Name",
        "slug": "project-name",
    }
*/
export const POST = withUserAuth(async (req, user, supabase) => {
  // Get Request Body
  const { name, slug } = await req.json();

  // Validate Request Body
  if (!name || !slug) {
    return NextResponse.json({ error: 'name and slug are required.' }, { status: 400 });
  }

  // Check if slug is valid
  if (!isSlugValid(slug)) {
    return NextResponse.json({ error: 'slug is invalid.' }, { status: 400 });
  }

  // TODO: Check if slug is reserved/taken

  // Create Project
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .insert({ name, slug })
    .select();

  // Check for errors
  if (projectError) {
    return NextResponse.json({ error: projectError.message }, { status: 500 });
  }

  // Create Project Member for Project
  const { error: projectMemberError } = await supabase
    .from('project_members')
    .insert({ member_id: user.id, project_id: project![0].id })
    .select();

  // Check for errors
  if (projectMemberError) {
    return NextResponse.json({ error: projectMemberError.message }, { status: 500 });
  }

  // Return project
  return NextResponse.json(project[0], { status: 201 });
});

/*
    Get User Projects
    GET /api/v1/projects
*/
export const GET = withUserAuth(async (req, user, supabase) => {
  // Get User Projects
  const { data: projects, error } = await supabase
    .from('project_members')
    .select('projects (id, name, slug)')
    .eq('member_id', user.id);

  // Check for errors
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Restructure projects
  const restructuredData = projects.map((item) => ('projects' in item ? item.projects : item));

  // Return projects
  return NextResponse.json(restructuredData);
});
