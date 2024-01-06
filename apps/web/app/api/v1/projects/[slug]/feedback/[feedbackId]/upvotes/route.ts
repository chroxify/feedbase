import { NextRequest, NextResponse } from 'next/server';
import { getFeedbackByID, getFeedbackUpvotersById, upvoteFeedbackByID } from '@/lib/api/feedback';
import { getCurrentUser } from '@/lib/api/user';

/*
  Get feedback upvotes
  GET /api/v1/projects/[slug]/feedback/[id]/upvote
*/
export async function GET(req: Request, context: { params: { slug: string; feedbackId: string } }) {
  const { data: feedback, error } = await getFeedbackByID(
    context.params.feedbackId,
    context.params.slug,
    'route'
  );

  // If any errors thrown, return error
  if (error) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  // Get feedback upvoters
  const { data: upvoters, error: upvotersError } = await getFeedbackUpvotersById(
    context.params.feedbackId,
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
      upvoters,
    },
    { status: 200 }
  );
}

/*
    Upvote a feedback
    POST /api/v1/projects/[slug]/feedback/[id]/upvote
*/
export async function POST(req: NextRequest, context: { params: { slug: string; feedbackId: string } }) {
  const hasUpvoted = req.nextUrl.searchParams.get('has_upvoted');

  // Get current user
  const { data: isLoggedIn } = await getCurrentUser('route');

  // Upvote feedback
  const { data: feedback, error } = await upvoteFeedbackByID(
    context.params.feedbackId,
    context.params.slug,
    'route',
    hasUpvoted ? hasUpvoted === 'true' : undefined,
    !isLoggedIn
  );

  // If any errors thrown, return error
  if (error) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  // Return feedback
  return NextResponse.json(feedback, { status: 200 });
}
