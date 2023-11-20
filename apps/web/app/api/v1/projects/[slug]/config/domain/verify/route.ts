import { NextResponse } from 'next/server';
import { getProjectConfigBySlug } from '@/lib/api/projects';

/*
  POST /api/v1/projects/:slug/config/domain/verify
*/
export async function POST(req: Request, context: { params: { slug: string } }) {
  const { data: projectConfig, error } = await getProjectConfigBySlug(context.params.slug, 'route');

  // If any errors thrown, return error
  if (error) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  // Verify domain
  const response = await fetch(
    `https://api.vercel.com/v9/projects/${process.env.VERCEL_PROJECT_ID}/domains/${
      projectConfig.custom_domain
    }/verify${process.env.VERCEL_TEAM_ID ? `?teamId=${process.env.VERCEL_TEAM_ID}` : ''}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.VERCEL_AUTH_TOKEN}`,
        'Content-Type': 'application/json',
      },
    }
  );

  // Parse response
  const data = await response.json();

  // If error, return error
  if (response.status !== 200) {
    return NextResponse.json(
      { error: data.error.message },
      { status: data.error.code === 'forbidden' ? 403 : data.error.code === 'domain_taken' ? 409 : 400 }
    );
  }

  // Return data
  return NextResponse.json(data, { status: 200 });
}
