import { getFeedbackByID, getFeedbackUpvotersById, upvoteFeedbackByID } from '@/lib/api/feedback';
import { NextResponse } from 'next/server';

/*
  Get feedback upvotes
  GET /api/v1/projects/[slug]/feedback/[id]/upvote
*/
export async function GET(req: Request, context: { params: { slug: string; id: string } }) {
  const { data: feedback, error } = await getFeedbackByID(context.params.id, context.params.slug, 'route');

  // If any errors thrown, return error
  if (error) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  // Get feedback upvoters
  const { data: upvoters, error: upvotersError } = await getFeedbackUpvotersById(
    context.params.id,
    context.params.slug,
    'route'
  );

  // If any errors thrown, return error
  if (upvotersError) {
    return NextResponse.json({ error: upvotersError.message }, { status: upvotersError.status });
  }

  // Return feedback
  return NextResponse.json(
    {
      upvotes: feedback.upvotes,
      upvoters: upvoters,
    },
    { status: 200 }
  );
}

/*
    Upvote a feedback
    POST /api/v1/projects/[slug]/feedback/[id]/upvote
*/
export async function POST(req: Request, context: { params: { slug: string; id: string } }) {
  const { data: feedback, error } = await upvoteFeedbackByID(context.params.id, context.params.slug, 'route');

  // If any errors thrown, return error
  if (error) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  // Return feedback
  return NextResponse.json(feedback, { status: 200 });
}
