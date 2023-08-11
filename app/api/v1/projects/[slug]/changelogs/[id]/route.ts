import { deleteChangelog, updateChangelog } from '@/lib/api/changelogs';
import { NextResponse } from 'next/server';

/*
    Update project changelog
    PUT /api/v1/projects/[slug]/changelogs/[id]
    {
        title: string;
        content: string;
        published: boolean;
    }
*/
export async function PUT(req: Request, context: { params: { slug: string; id: string } }) {
  const { title, content, published } = await req.json();

  // Validate Request Body
  if (!title || !content || published === undefined) {
    return NextResponse.json(
      { error: 'title, content, and published fields are required.' },
      { status: 400 }
    );
  }

  const { data: changelog, error } = await updateChangelog(
    context.params.id,
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
    Delete project changelog
    DELETE /api/v1/projects/[slug]/changelogs/[id]
*/
export async function DELETE(req: Request, context: { params: { slug: string; id: string } }) {
  const { data, error } = await deleteChangelog(context.params.id, context.params.slug, 'route');

  // If any errors thrown, return error
  if (error) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  // Return success
  return NextResponse.json(data, { status: 200 });
}
