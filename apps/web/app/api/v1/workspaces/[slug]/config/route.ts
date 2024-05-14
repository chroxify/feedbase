import { NextResponse } from 'next/server';
import { getWorkspaceConfigBySlug, updateWorkspaceConfigBySlug } from '@/lib/api/workspace';
import { WorkspaceConfigProps } from '@/lib/types';

/*
    Get Workspace Config by slug
    GET /api/v1/workspaces/[slug]/config
*/
export async function GET(req: Request, context: { params: { slug: string } }) {
  const { data: workspaceConfig, error } = await getWorkspaceConfigBySlug(context.params.slug, 'route');

  // If any errors thrown, return error
  if (error) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  // Return workspace config
  return NextResponse.json(workspaceConfig, { status: 200 });
}

/*
    Update Workspace Config by slug
    PATCH /api/v1/workspaces/[slug]/config
    {
        changelog_preview_style: string;
        changelog_twitter_handle: string;
    }
*/
export async function PATCH(req: Request, context: { params: { slug: string } }) {
  const {
    changelog_enabled: changelogEnabled,
    changelog_preview_style: changelogPreviewStyle,
    changelog_twitter_handle: changelogTwitterHandle,
    feedback_allow_anon_upvoting: feedbackAllowAnonUpvoting,
    workspace_theme: customTheme,
    custom_theme_root: customThemeRoot,
    custom_theme_primary_foreground: customThemePrimaryForeground,
    custom_theme_background: customThemeBackground,
    custom_theme_secondary_background: customThemeSecondaryBackground,
    custom_theme_accent: customThemeAccent,
    custom_theme_border: customThemeBorder,
    logo_redirect_url: logoRedirectUrl,
  } = (await req.json()) as WorkspaceConfigProps['Update'];

  // Update workspace config
  const { data: updatedProjectConfig, error } = await updateWorkspaceConfigBySlug(
    context.params.slug,
    {
      changelog_enabled: changelogEnabled,
      changelog_preview_style: changelogPreviewStyle,
      changelog_twitter_handle: changelogTwitterHandle,
      feedback_allow_anon_upvoting: feedbackAllowAnonUpvoting,
      workspace_theme: customTheme,
      custom_theme_root: customThemeRoot,
      custom_theme_primary_foreground: customThemePrimaryForeground,
      custom_theme_background: customThemeBackground,
      custom_theme_secondary_background: customThemeSecondaryBackground,
      custom_theme_accent: customThemeAccent,
      custom_theme_border: customThemeBorder,
      logo_redirect_url: logoRedirectUrl,
    },
    'route'
  );

  // If any errors thrown, return error
  if (error) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  // Return updated workspace config
  return NextResponse.json(updatedProjectConfig, { status: 200 });
}
