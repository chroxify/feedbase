import { NextResponse } from 'next/server';
import { updateWorkspaceConfigBySlug } from '@/lib/api/workspace';

/*
    Update Slack integration
    PATCH /api/v1/workspaces/:slug/config/integrations/slack
    {
        status: boolean,
        webhook: string,
    }
*/
export async function PATCH(req: Request, context: { params: { slug: string } }) {
  const { status, webhook } = (await req.json()) as {
    status: boolean;
    webhook: string;
  };

  // If status is true, make sure webhook and roleId are not empty
  if (status && !webhook) {
    return NextResponse.json(
      { error: 'webhook is required when enabling Slack integration.' },
      { status: 400 }
    );
  }

  // Update workspace config
  const { data: updatedProjectConfig, error } = await updateWorkspaceConfigBySlug(
    context.params.slug,
    {
      integration_slack_status: status,
      integration_slack_webhook: status ? webhook : null,
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
