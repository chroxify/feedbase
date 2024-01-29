import { NextResponse } from 'next/server';
import { createFeedback, getAllProjectFeedback } from '@/lib/api/feedback';
import { FeedbackWithUserInputProps } from '@/lib/types';

export const runtime = 'edge';

/*
    Create Feedback
    POST /api/v1/projects/[slug]/feedback
    {
        title: string;
        description: string;
        status: string;
        tags: [id, id, id]
    }
*/
export async function POST(req: Request, context: { params: { slug: string } }) {
  const { title, description, status, tags, user } = (await req.json()) as FeedbackWithUserInputProps;

  // Validate Request Body
  if (!title) {
    return NextResponse.json({ error: 'title is required when creating feedback.' }, { status: 400 });
  }

  const { data: feedback, error } = await createFeedback(
    context.params.slug,
    {
      title: title || '',
      description: description || '',
      status: status || '',
      project_id: 'dummy-id',
      user_id: 'dummy-id',
      tags: tags || [],
      user: user !== null ? user : undefined,
    },
    'route'
  );

  // If any errors thrown, return error
  if (error) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  // Return feedback
  return NextResponse.json(feedback, { status: 200 });
}

/*
    Get Project Feedback
    GET /api/v1/projects/[slug]/feedback
*/
export async function GET(req: Request, context: { params: { slug: string } }) {
  const { data: feedback, error } = await getAllProjectFeedback(context.params.slug, 'route', false);

  // If any errors thrown, return error
  if (error) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  // Return feedback
  return NextResponse.json(feedback, { status: 200 });
}
