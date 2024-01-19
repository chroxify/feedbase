import { FeedbackWithUserProps, ProjectConfigWithoutSecretProps, ProjectProps } from '../types';
import { formatHtmlToMd, formatRootUrl } from '../utils';

// Helper function to send a Discord notification
export const sendDiscordNotification = async (
  feedback: FeedbackWithUserProps,
  project: ProjectProps['Row'],
  projectConfig: ProjectConfigWithoutSecretProps
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
          url: formatRootUrl(project.slug, `/feedback/${feedback.id}`),
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
            icon_url: feedback.user.avatar_url,
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
          url: formatRootUrl('dash', `/${projectSlug}`),
          color: 0x05060a,
        },
      ],
    }),
  });

  // Return response
  return response;
};

// Helper function to send a Slack notification
export const sendSlackNotification = async (
  feedback: FeedbackWithUserProps,
  project: ProjectProps['Row'],
  projectConfig: ProjectConfigWithoutSecretProps
) => {
  // Convert html syntax to markdown
  const markdownString = formatHtmlToMd(feedback.description);

  // Use an HTTP library or a Slack library to send the notification
  const response = await fetch(projectConfig.integration_slack_webhook!, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      attachments: [
        {
          title: 'New Feedback Submission!',
          text: "You've received a new feedback submission.",
          color: '#05060a',
          title_link: formatRootUrl(project.slug, `/feedback/${feedback.id}`),
          fields: [
            {
              title: 'Title',
              value: `\`\`\`${feedback.title}\`\`\``,
              short: true,
            },
            {
              title: 'Description',
              value: `\`\`\`${markdownString}\`\`\``,
              short: false,
            },
          ],
          author_name: feedback.user.full_name,
          author_icon: feedback.user.avatar_url,
          footer: 'Powered By Feedbase',
          footer_icon: 'https://feedbase.app/icon-512x512.png',
          ts: Math.floor(Date.now() / 1000),
        },
      ],
    }),
  });

  // Return response
  return response;
};

// Helper function to send a Slack confirmation
export const sendSlackConfirmation = async (projectSlug: string, webhook: string) => {
  // Use an HTTP library or a Slack library to send the notification
  const response = await fetch(webhook, {
    method: 'POST',
    body: JSON.stringify({
      attachments: [
        {
          title: 'Slack Integration Enabled',
          text: "If you're seeing this, it means that your Slack integration is working correctly.",
          color: '#05060a',
          title_link: formatRootUrl('dash', `/${projectSlug}`),
          footer: 'Powered By Feedbase',
          footer_icon: 'https://feedbase.app/icon-512x512.png',
          ts: Math.floor(Date.now() / 1000),
        },
      ],
    }),
  });

  // Return response
  return response;
};
