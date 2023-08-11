import { createChangelog, getAllProjectChangelogs } from '@/lib/api/changelogs';
import { NextResponse } from 'next/server';

/* 
    Create Changelog
    POST /api/v1/projects/[slug]/changelogs
    {
        title: string;
        content: string;
        published: boolean;
    }
*/
export async function POST(req: Request, context: { params: { slug: string } }) {
  const { title, content, published } = await req.json();

  // Validate Request Body
  if (!title || !content || published === undefined) {
    return NextResponse.json(
      { error: 'title, content, and published fields are required.' },
      { status: 400 }
    );
  }

  const { data: changelog, error } = await createChangelog(
    context.params.slug,
    { title, content, published },
    'route'
  );

  // If any errors thrown, return error
  if (error) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  // Return changelog
  return NextResponse.json(changelog, { status: 200 });
}

/*
    Get project changelogs
    GET /api/v1/projects/[slug]/changelogs
*/
export async function GET(req: Request, context: { params: { slug: string } }) {
  const { data: changelogs, error } = await getAllProjectChangelogs(context.params.slug, 'route', true);

  // If any errors thrown, return error
  if (error) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  // Return changelogs
  return NextResponse.json(changelogs, { status: 200 });
}
