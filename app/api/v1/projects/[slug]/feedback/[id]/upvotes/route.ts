import { upvoteFeedbackByID } from '@/lib/api/feedback';
import { NextResponse } from 'next/server';

/*
    Upvote a feedback
    POST /api/v1/projects/[slug]/feedback/[id]/upvote
*/
export async function POST(req: Request, context: { params: { slug: string; id: string } }) {
  const { data: feedback, error } = await upvoteFeedbackByID(
    context.params.id,
    context.params.slug,
    'route',
    false
  );

  // If any errors thrown, return error
  if (error) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  // Return feedback
  return NextResponse.json(feedback, { status: 200 });
}
