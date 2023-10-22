import { NextResponse } from 'next/server';
import { getProjectConfigBySlug, updateProjectConfigBySlug } from '@/lib/api/projects';
import { ProjectConfigProps } from '@/lib/types';

/*
    Get Project Config by slug
    GET /api/v1/projects/[slug]/config
*/
export async function GET(req: Request, context: { params: { slug: string } }) {
  const { data: projectConfig, error } = await getProjectConfigBySlug(context.params.slug, 'route');

  // If any errors thrown, return error
  if (error) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  // Return project config
  return NextResponse.json({ projectConfig }, { status: 200 });
}

/*
    Update Project Config by slug
    PATCH /api/v1/projects/[slug]/config
    {
        changelog_preview_style: string;
        changelog_twitter_handle: string;
    }
*/
export async function PATCH(req: Request, context: { params: { slug: string } }) {
  const { changelog_preview_style: changelogPreviewStyle, changelog_twitter_handle: changelogTwitterHandle } =
    (await req.json()) as ProjectConfigProps['Update'];

  // Update project config
  const { data: updatedProjectConfig, error } = await updateProjectConfigBySlug(
    context.params.slug,
    {
      changelog_preview_style: changelogPreviewStyle,
      changelog_twitter_handle: changelogTwitterHandle,
    },
    'route'
  );

  // If any errors thrown, return error
  if (error) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  // Return updated project config
  return NextResponse.json(updatedProjectConfig, { status: 200 });
}
