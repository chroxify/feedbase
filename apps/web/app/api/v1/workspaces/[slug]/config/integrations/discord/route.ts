import { NextResponse } from 'next/server';
import { updateWorkspaceConfigBySlug } from '@/lib/api/workspace';

/*
    Update Discord integration
    PATCH /api/v1/workspaces/:slug/config/integrations/discord
    {
        status: boolean,
        webhook: string,
        roleId: string,
    }
*/
export async function PATCH(req: Request, context: { params: { slug: string } }) {
  const { status, webhook, roleId } = (await req.json()) as {
    status: boolean;
    webhook: string;
    roleId: string;
  };

  // If status is true, make sure webhook and roleId are not empty
  if (status && !webhook) {
    return NextResponse.json(
      { error: 'webhook is required when enabling Discord integration.' },
      { status: 400 }
    );
  }

  // Update workspace config
  const { data: updatedProjectConfig, error } = await updateWorkspaceConfigBySlug(
    context.params.slug,
    {
      integration_discord_status: status,
      integration_discord_webhook: status ? webhook : null,
      integration_discord_role_id: status ? roleId : null,
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
