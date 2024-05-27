import { NextResponse } from 'next/server';
import { updateWorkspaceBySlug } from '@/lib/api/workspace';

/*
  Update SSO configuration
  PATCH /api/v1/workspaces/:slug/config/integrations/sso
  {
    enabled: boolean,
    url: string,
    secret: string,
  }
*/
export async function PATCH(req: Request, context: { params: { slug: string } }) {
  const { enabled, url, secret } = await req.json();

  if (enabled && (!url || !secret)) {
    return NextResponse.json(
      { error: 'url and secret are required when enabling SSO integration.' },
      { status: 400 }
    );
  }

  // Update workspace config
  const { data: updatedWorkspaceConfig, error } = await updateWorkspaceBySlug(
    context.params.slug,
    {
      sso_auth_enabled: enabled,
      sso_auth_url: enabled ? url : null,
    },
    'route'
  );

  // If any errors thrown, return error
  if (error) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  // Return updated workspace config
  return NextResponse.json(updatedWorkspaceConfig, { status: 200 });
}
