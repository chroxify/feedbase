import { NextResponse } from 'next/server';
import { updateDiscordIntegration } from '@/lib/api/integrations';

/*
    Update Discord integration
    PATCH /api/v1/projects/:slug/config/integrations/discord
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

  // Update project config
  const { data: updatedProjectConfig, error } = await updateDiscordIntegration(
    {
      status,
      webhook,
      roleId,
    },
    context.params.slug,
    'route'
  );

  // If any errors thrown, return error
  if (error) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  // Return updated project config
  return NextResponse.json(updatedProjectConfig, { status: 200 });
}
