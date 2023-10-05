import { createCommentForFeedbackById, getCommentsForFeedbackById } from '@/lib/api/comments';
import { FeedbackCommentProps } from '@/lib/types';
import { NextResponse } from 'next/server';

/* 
    Create feedback comment
    POST /api/v1/projects/[slug]/feedback/[id]/comments
    {
        content: string
    }
*/
export async function POST(req: Request, context: { params: { slug: string; id: string } }) {
  const { content } = (await req.json()) as FeedbackCommentProps['Insert'];

  if (!content) {
    return NextResponse.json({ error: 'Content cannot be empty' }, { status: 400 });
  }

  const { data: comment, error } = await createCommentForFeedbackById(
    {
      feedback_id: context.params.id,
      content: content || '',
      user_id: 'dummy-id',
    },
    context.params.slug,
    'route'
  );

  // If any errors thrown, return error
  if (error) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  // Return comment
  return NextResponse.json(comment, { status: 200 });
}

/*
    Get feedback comments
    GET /api/v1/projects/[slug]/feedback/[id]/comments
*/
export async function GET(req: Request, context: { params: { slug: string; id: string } }) {
  const { data: comments, error } = await getCommentsForFeedbackById(
    context.params.id,
    context.params.slug,
    'route'
  );

  // If any errors thrown, return error
  if (error) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  // Return comments
  return NextResponse.json(comments, { status: 200 });
}
