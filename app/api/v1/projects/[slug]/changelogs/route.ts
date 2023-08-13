import { createChangelog, getAllProjectChangelogs } from '@/lib/api/changelogs';
import { NextResponse } from 'next/server';

/* 
    Create Changelog
    POST /api/v1/projects/[slug]/changelogs
    {
        title: string;
        summary: string;
        content: string;
        image?: string;
        publish_date?: Date;
        published: boolean;
    }
*/
export async function POST(req: Request, context: { params: { slug: string } }) {
  const { title, summary, content, image, publish_date, published } = await req.json();

  // Validate Request Body
  if (published) {
    if (!title || !summary || !content || !published) {
      return NextResponse.json(
        { error: 'missing required fields. (title, summary, content, published)' },
        { status: 400 }
      );
    }
  }

  const { data: changelog, error } = await createChangelog(
    context.params.slug,
    { title, summary, content, image, publish_date, published },
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
