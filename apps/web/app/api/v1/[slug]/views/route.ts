import { NextRequest, NextResponse } from 'next/server';
import { recordClick } from '@/lib/tinybird';

/*
  Record page view
  POST /api/v1/[project]/views
  {
    "feedbackId": "string",
    "changelogId": "string",
  }
*/
export async function POST(req: NextRequest, context: { params: { slug: string } }) {
  const { feedbackId, changelogId } = await req.json();

  const data = await recordClick({
    req,
    projectId: context.params.slug,
    feedbackId,
    changelogId,
  });

  return NextResponse.json({ data }, { status: 200 });
}
