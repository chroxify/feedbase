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
      avatar_url: project.icon ? project.icon : 'https://feedbase.app/icon-512x512.png',
      content: projectConfig.integration_discord_role_id
        ? `<@&${projectConfig.integration_discord_role_id}>`
        : '',
      embeds: [
        {
          title: 'New Feedback Submission!',
          description: "You've received a new feedback submission.",
          url: `https://feedbase.app/${project.slug}/feedback/${feedback.id}`,
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
            text: 'Powered By Feedbase',
            icon_url: 'https://feedbase.app/icon-512x512.png',
          },
        },
      ],
    }),
  });

  // Return response
  return response;
};

// Helper function to send a Discord confirmation
export const sendDiscordConfirmation = async (
  projectSlug: string,
  webhook: string,
  roleId: string | undefined
) => {
  // Use an HTTP library or a Discord library to send the notification
  const response = await fetch(webhook, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: `Feedbase | Feedback`,
      avatar_url: 'https://feedbase.app/icon-512x512.png',
      content: roleId ? `<@&${roleId}>` : '',
      embeds: [
        {
          title: 'Discord Integration Enabled',
          description: "If you're seeing this, it means that your Discord integration is working correctly.",
          url: `https://app.feedbase.app/${projectSlug}`,
          color: 0x05060a,
        },
      ],
    }),
  });

  // Return response
  return response;
};
