import { NextResponse } from 'next/server';
import { updateWorkspaceConfigBySlug } from '@/lib/api/workspace';

/*
  Update SSO configuration
  PATCH /api/v1/workspaces/:slug/config/integrations/sso
  {
    status: boolean,
    url: string,
    secret: string,
  }
*/
export async function PATCH(req: Request, context: { params: { slug: string } }) {
  const { status, url, secret } = await req.json();

  if (status && (!url || !secret)) {
    return NextResponse.json(
      { error: 'url and secret are required when enabling SSO integration.' },
      { status: 400 }
    );
  }

  // Update workspace config
  const { data: updatedProjectConfig, error } = await updateWorkspaceConfigBySlug(
    context.params.slug,
    {
      integration_sso_status: status,
      integration_sso_url: status ? url : null,
      integration_sso_secret: status ? secret : null,
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
