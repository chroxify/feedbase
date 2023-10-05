import { NextResponse } from 'next/server';
import { deleteFeedbackByID, getFeedbackByID, updateFeedbackByID } from '@/lib/api/feedback';
import { FeedbackProps, FeedbackWithUserProps } from '@/lib/types';

/*
    Get Project Feedback by ID
    GET /api/v1/projects/[slug]/feedback/[id]
*/
export async function GET(req: Request, context: { params: { slug: string; id: string } }) {
  const { data: feedback, error } = await getFeedbackByID(context.params.id, context.params.slug, 'route');

  // If any errors thrown, return error
  if (error) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  // Return feedback
  return NextResponse.json(feedback, { status: 200 });
}

/*
    Update Feedback by ID
    PUT /api/v1/projects/[slug]/feedback/[id]
    {
        title: string;
        description: string;
        status: string;
        tags: string[];
    }
*/
export async function PUT(req: Request, context: { params: { slug: string; id: string } }) {
  const { title, description, status, tags } = (await req.json()) as FeedbackWithUserProps;

  const { data: feedback, error } = await updateFeedbackByID(
    context.params.id,
    context.params.slug,
    {
      title: title || '',
      description: description || '',
      status: status || '',
      raw_tags: tags || [],
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
    Delete Feedback by ID
    DELETE /api/v1/projects/[slug]/feedback/[id]
*/
export async function DELETE(req: Request, context: { params: { slug: string; id: string } }) {
  const { data: feedback, error } = await deleteFeedbackByID(context.params.id, context.params.slug, 'route');

  // If any errors thrown, return error
  if (error) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  // Return feedback
  return NextResponse.json(feedback, { status: 200 });
}
