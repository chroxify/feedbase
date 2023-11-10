import { withProjectAuth } from '../auth';
import { FeedbackWithUserProps, ProjectConfigProps, ProjectProps } from '../types';
import { formatHtmlToMd } from '../utils';

// Helper function to send a Discord notification
export const sendDiscordNotification = async (
  feedback: FeedbackWithUserProps,
  project: ProjectProps['Row'],
  projectConfig: ProjectConfigProps['Row']
) => {
  // Convert html syntax to markdown
  const markdownString = formatHtmlToMd(feedback.description);

  // Use an HTTP library or a Discord library to send the notification
  const response = await fetch(projectConfig.integration_discord_webhook!, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: `${project.name} | Feedback`,
      avatar_url: project.icon ? project.icon : 'https://luminar.so/icon-512x512.png',
      content: projectConfig.integration_discord_role_id
        ? `<@&${projectConfig.integration_discord_role_id}>`
        : '',
      embeds: [
        {
          title: 'New Feedback Submission!',
          description: "You've received a new feedback submission.",
          url: `https://luminar.app/${project.slug}/feedback/${feedback.id}`,
          color: 0x05060a,
          fields: [
            {
              name: 'Title',
              value: `\`\`\`${feedback.title}\`\`\``,
              inline: true,
            },
            {
              name: 'Description',
              value: `\`\`\`markdown\n${markdownString}\`\`\``,
              inline: false,
            },
          ],
          author: {
            name: feedback.user.full_name,
            icon_url:
              'https://innmcibhgnhxpghxldrr.supabase.co/storage/v1/object/public/avatars/d304fdae-9ed5-4000-afbb-61a646b95e8b',
          },
          footer: {
            text: 'Powered By Luminar',
            icon_url: 'https://luminar.so/icon-512x512.png',
          },
        },
      ],
    }),
  });

  // Return response
  return response;
};

// Connect Discord integration
export const updateDiscordIntegration = (
  integrationData: {
    status: boolean;
    webhook: string | undefined;
    roleId: string | undefined;
  },
  projectSlug: string,
  cType: 'server' | 'route'
) =>
  withProjectAuth<ProjectConfigProps['Row']>(async (user, supabase, project, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error };
    }

    //   If status is true, make sure webhook and roleId are not empty
    if (integrationData.status && !integrationData.webhook) {
      return {
        data: null,
        error: { message: 'webhook is required when enabling Discord integration.', status: 400 },
      };
    }

    // Update project config
    const { data: config, error: configError } = await supabase
      .from('project_configs')
      .update({
        integration_discord_status: integrationData.status,
        integration_discord_webhook: integrationData.webhook ? integrationData.webhook : undefined,
        integration_discord_role_id: integrationData.roleId ? integrationData.roleId : undefined,
      })
      .eq('project_id', project!.id)
      .select()
      .single();

    // If any errors, return error
    if (configError || !config) {
      return { data: null, error: { message: configError.message, status: 500 } };
    }

    // Return config
    return { data: config, error: null };
  })(projectSlug, cType);
