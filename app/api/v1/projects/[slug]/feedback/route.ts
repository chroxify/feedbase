import { createFeedback, getAllProjectFeedback } from '@/lib/api/feedback';
import { FeedbackProps, FeedbackWithUserProps } from '@/lib/types';
import { NextResponse } from 'next/server';

/*
    Create Feedback
    POST /api/v1/projects/[slug]/feedback
    {
        title: string;
        description: string;
        status: string;
        tags: {
            name: string;
            color: string;
        }[];
    }
*/
export async function POST(req: Request, context: { params: { slug: string } }) {
  const { title, description, status, tags } = (await req.json()) as FeedbackWithUserProps;

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
      raw_tags: tags || [],
      project_id: 'dummy-id',
      user_id: 'dummy-id',
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
