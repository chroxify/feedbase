import { NextResponse } from 'next/server';
import { createChangelog, getAllProjectChangelogs } from '@/lib/api/changelogs';
import { ChangelogProps } from '@/lib/types';

export const runtime = 'edge';

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
  const {
    title,
    summary,
    content,
    image,
    publish_date: publishDate,
    published,
  } = (await req.json()) as ChangelogProps['Insert'];

  // Validate Request Body
  if (published) {
    if (!title || !summary || !content) {
      return NextResponse.json(
        { error: 'title, summary, and content are required when publishing a changelog.' },
        { status: 400 }
      );
    }
  }

  const { data: changelog, error } = await createChangelog(
    context.params.slug,
    {
      title: title || '',
      summary: summary || '',
      content: content || '',
      image: image || '',
      publish_date: publishDate || null,
      published: published || false,
      project_id: 'dummy-id',
      slug: 'dummy-slug',
      author_id: 'dummy-author',
    },
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
