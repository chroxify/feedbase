import { NextResponse } from 'next/server';
import { getProjectBySlug } from '@/lib/api/projects';
import { getPublicProjectChangelogs } from '@/lib/api/public';

/*
    Generate atom feed for project changelog
*/
export async function GET(req: Request, context: { params: { slug: string } }) {
  // Get project data
  const { data: project, error } = await getProjectBySlug(context.params.slug, 'route', true, false);

  // If any errors thrown, return error
  if (error) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  const { data: changelogs, error: changelogError } = await getPublicProjectChangelogs(
    context.params.slug,
    'route',
    true,
    false
  );

  // If any errors thrown, return error
  if (changelogError) {
    return NextResponse.json({ error: changelogError.message }, { status: changelogError.status });
  }

  // Return atom formatted changelogs
  return new Response(
    `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
    <title>${project.name} Changelog</title>
    <subtitle>${project.name}'s Changelog</subtitle>
    <link href="${req.url}" rel="self"/>
    <link href="${process.env.NEXT_PUBLIC_ROOT_DOMAIN}"/>
    <updated>${changelogs[0].publish_date}</updated>
    <id>${project.id}</id>${changelogs
      .map((post) => {
        return `
    <entry>
        <id>${post.id}</id>
        <title>${post.title}</title>
        <link href="https://${context.params.slug}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/changelog/${post.slug}"/>
        <updated>${post.publish_date}</updated>
        <author><name>${post.author.full_name}</name></author>
    </entry>`;
      })
      .join('')}
</feed>`,
    { status: 200, headers: { 'Content-Type': 'application/atom+xml; charset=utf-8' } }
  );
}
