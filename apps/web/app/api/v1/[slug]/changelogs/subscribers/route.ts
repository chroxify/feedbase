import { subscribeToProjectChangelogs } from '@/lib/api/public';

/*
  Subscribe to project changelogs
  POST /api/v1/:slug/changelogs/subscribers
  {
    email: string,
  }
*/
export async function POST(req: Request, context: { params: { slug: string } }) {
  const { email } = await req.json();

  // Check if email is provided
  if (!email) {
    return new Response(JSON.stringify({ error: 'Email is required.' }), { status: 400 });
  }

  // Subscribe to project changelogs
  const { data: subscriber, error } = await subscribeToProjectChangelogs(context.params.slug, email);

  // If any errors thrown, return error
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: error.status });
  }

  // Return subscriber
  return new Response(JSON.stringify(subscriber), { status: 200 });
}
