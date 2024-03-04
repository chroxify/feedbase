import { decode } from 'base64-arraybuffer';
import { withProjectAuth, withUserAuth } from '@/lib/auth';
import {
  AnalyticsProps,
  ProjectApiKeyProps,
  ProjectApiKeyWithoutTokenProps,
  ProjectConfigProps,
  ProjectConfigWithoutSecretProps,
  ProjectProps,
  TeamMemberProps,
} from '@/lib/types';
import { generateApiToken, isSlugValid, isValidUrl } from '@/lib/utils';

// Get Project
export const getProjectBySlug = withProjectAuth<ProjectProps['Row']>(
  async (user, supabase, project, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error };
    }

    // Check if project exists
    if (!project) {
      return { data: null, error: { message: 'project not found.', status: 404 } };
    }

    // Return project
    return { data: project, error: null };
  }
);

// Create Project
export const createProject = (data: ProjectProps['Insert'], cType: 'server' | 'route') =>
  withUserAuth<ProjectProps['Row']>(async (user, supabase, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error };
    }

    // Check if slug is valid
    if (!isSlugValid(data.slug)) {
      return { data: null, error: { message: 'slug is invalid.', status: 400 } };
    }

    // Create Project
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert({ name: data.name, slug: data.slug })
      .select();

    // Check for errors
    if (projectError) {
      return { data: null, error: { message: projectError.message, status: 500 } };
    }

    // Create Project Member for Project
    const { error: projectMemberError } = await supabase
      .from('project_members')
      .insert({ member_id: user!.id, project_id: project[0].id })
      .select();

    // Check for errors
    if (projectMemberError) {
      return { data: null, error: { message: projectMemberError.message, status: 500 } };
    }

    // Create Project Config for Project
    const { error: projectConfigError } = await supabase
      .from('project_configs')
      .insert({ project_id: project[0].id })
      .select();

    // Check for errors
    if (projectConfigError) {
      return { data: null, error: { message: projectConfigError.message, status: 500 } };
    }

    // Return project
    return { data: project[0], error: null };
  })(cType);

// Update Project by slug
export const updateProjectBySlug = (slug: string, data: ProjectProps['Update'], cType: 'server' | 'route') =>
  withProjectAuth<ProjectProps['Row']>(async (user, supabase, project, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error };
    }

    // Check if slug is valid
    if (data.slug && !isSlugValid(data.slug)) {
      return { data: null, error: { message: 'slug is invalid.', status: 400 } };
    }

    const uploadImage = async (image: string, type: 'icon' | 'og_image') => {
      // Create unique image path
      const imagePath = `${project!.slug}/${type}/${Date.now()}.png`;

      // Get current image path
      if (project![type]) {
        const { data: currentImage } = supabase.storage.from('projects').getPublicUrl(project![type]!);

        // Get current image path (get last 3 segments of url)
        const currentImagePath = currentImage.publicUrl.split('/').slice(-3).join('/');

        // Delete current image
        const { error: deleteError } = await supabase.storage.from('projects').remove([currentImagePath]);

        // Check for errors
        if (deleteError) {
          return { data: null, error: { message: deleteError.message, status: 500 } };
        }
      }

      // Upload image to storage
      const { error: uploadError } = await supabase.storage
        .from('projects')
        .upload(imagePath, decode(image.replace(/^data:image\/\w+;base64,/, '')), {
          contentType: 'image/png',
        });

      // Check for errors
      if (uploadError) {
        return { data: null, error: { message: uploadError.message, status: 500 } };
      }

      // Get public url for image
      const { data: publicUrlData } = supabase.storage.from('projects').getPublicUrl(imagePath);

      // Check for errors
      if (!publicUrlData) {
        return { data: null, error: { message: 'issue uploading image', status: 500 } };
      }

      // Return public url
      return { data: publicUrlData.publicUrl, error: null };
    };

    // If icon is provided, upload to storage
    if (data.icon) {
      // Upload image
      const { data: publicUrlData, error: uploadError } = await uploadImage(data.icon, 'icon');

      // Check for errors
      if (uploadError) {
        return { data: null, error: { message: uploadError.message, status: 500 } };
      }

      // Set icon to public URL
      data.icon = publicUrlData;
    }

    // If og image is provided, upload to storage
    if (data.og_image) {
      // Upload image
      const { data: publicUrlData, error: uploadError } = await uploadImage(data.og_image, 'og_image');

      // Check for errors
      if (uploadError) {
        return { data: null, error: { message: uploadError.message, status: 500 } };
      }

      // Set og image to public URL
      data.og_image = publicUrlData;
    }

    // Update project
    const { data: updatedProject, error: updateError } = await supabase
      .from('projects')
      .update({
        name: data.name || project!.name,
        slug: data.slug || project!.slug,
        icon: data.icon || project!.icon,
        icon_radius: data.icon_radius || project!.icon_radius,
        og_image: data.og_image || project!.og_image,
      })
      .eq('id', project!.id)
      .select();

    // Check for errors
    if (updateError) {
      return { data: null, error: { message: updateError.message, status: 500 } };
    }

    // Return updated project
    return { data: updatedProject[0], error: null };
  })(slug, cType);

// Delete Project by slug
export const deleteProjectBySlug = withProjectAuth<ProjectProps['Row']>(
  async (user, supabase, project, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error };
    }

    // Delete project
    const { data: deletedProject, error: deleteError } = await supabase
      .from('projects')
      .delete()
      .eq('id', project!.id)
      .select();

    // Check for errors
    if (deleteError) {
      return { data: null, error: { message: deleteError.message, status: 500 } };
    }

    // Return success
    return { data: deletedProject[0], error: null };
  }
);

// Get all project members by slug
export const getProjectMembers = withProjectAuth<TeamMemberProps[]>(
  async (user, supabase, project, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error };
    }

    // Get all members for project
    const { data: members, error: membersError } = await supabase
      .from('project_members')
      .select('profiles (*), created_at')
      .eq('project_id', project!.id);

    // Check for errors
    if (membersError) {
      return { data: null, error: { message: membersError.message, status: 500 } };
    }

    // Map members data and add joined_at field to each member
    const restructuredData = members.map((item) => {
      const profileData = item.profiles;
      return {
        ...profileData,
        joined_at: item.created_at,
      };
    }) as TeamMemberProps[];

    // Return members
    return { data: restructuredData, error: null };
  }
);

// Get project config by slug
export const getProjectConfigBySlug = withProjectAuth<ProjectConfigWithoutSecretProps>(
  async (user, supabase, project, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error };
    }

    // Get project config
    const { data: config, error: configError } = await supabase
      .from('project_configs')
      .select(
        'id, created_at, project_id, changelog_preview_style, changelog_twitter_handle, integration_discord_status, integration_discord_webhook, integration_discord_role_id, custom_domain, custom_domain_verified, integration_sso_status, integration_sso_url, feedback_allow_anon_upvoting, custom_theme, custom_theme_background, custom_theme_border, custom_theme_primary_foreground, custom_theme_root, custom_theme_secondary_background, custom_theme_accent, integration_slack_status, integration_slack_webhook, logo_redirect_url, changelog_enabled'
      )
      .eq('project_id', project!.id);

    // Check for errors
    if (configError) {
      return { data: null, error: { message: configError.message, status: 500 } };
    }

    // Return config
    return { data: config[0], error: null };
  }
);

// Update project config by slug
export const updateProjectConfigBySlug = (
  slug: string,
  data: ProjectConfigProps['Update'],
  cType: 'server' | 'route'
) =>
  withProjectAuth<ProjectConfigWithoutSecretProps>(async (user, supabase, project, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error };
    }

    // Get project config
    const { data: config, error: configError } = await supabase
      .from('project_configs')
      .select()
      .eq('project_id', project!.id)
      .single();

    // Check for errors
    if (configError) {
      return { data: null, error: { message: configError.message, status: 500 } };
    }

    // Validate changelog_preview_style
    if (data.changelog_preview_style && !['summary', 'content'].includes(data.changelog_preview_style)) {
      return {
        data: null,
        error: { message: 'changelog_preview_style must be one of: summary, content', status: 400 },
      };
    }

    // Validate logo_redirect_url
    if (data.logo_redirect_url && !isValidUrl(data.logo_redirect_url)) {
      return {
        data: null,
        error: { message: 'logo_redirect_url must be a valid URL', status: 400 },
      };
    }

    // Validate sso_url
    if (data.integration_sso_url && !isValidUrl(data.integration_sso_url)) {
      return {
        data: null,
        error: { message: 'integration_sso_url must be a valid URL', status: 400 },
      };
    }

    // Update project config
    const { data: updatedConfig, error: updateError } = await supabase
      .from('project_configs')
      .update({
        changelog_preview_style: data.changelog_preview_style || config.changelog_preview_style,
        changelog_twitter_handle:
          data.changelog_twitter_handle !== undefined
            ? data.changelog_twitter_handle
            : config.changelog_twitter_handle,
        integration_discord_status:
          data.integration_discord_status !== undefined
            ? data.integration_discord_status
            : config.integration_discord_status,
        integration_discord_webhook:
          data.integration_discord_webhook !== undefined
            ? data.integration_discord_webhook
            : config.integration_discord_webhook,
        integration_discord_role_id:
          data.integration_discord_role_id !== undefined
            ? data.integration_discord_role_id
            : config.integration_discord_role_id,
        custom_domain: data.custom_domain !== undefined ? data.custom_domain : config.custom_domain,
        custom_domain_verified:
          data.custom_domain_verified !== undefined
            ? data.custom_domain_verified
            : config.custom_domain_verified,
        integration_sso_status:
          data.integration_sso_status !== undefined
            ? data.integration_sso_status
            : config.integration_sso_status,
        integration_sso_url:
          data.integration_sso_url !== undefined ? data.integration_sso_url : config.integration_sso_url,
        integration_sso_secret:
          data.integration_sso_secret !== undefined
            ? data.integration_sso_secret
            : config.integration_sso_secret,
        feedback_allow_anon_upvoting:
          data.feedback_allow_anon_upvoting !== undefined
            ? data.feedback_allow_anon_upvoting
            : config.feedback_allow_anon_upvoting,
        custom_theme: data.custom_theme !== undefined ? data.custom_theme : config.custom_theme,
        custom_theme_root:
          data.custom_theme_root !== undefined ? data.custom_theme_root : config.custom_theme_root,
        custom_theme_primary_foreground:
          data.custom_theme_primary_foreground !== undefined
            ? data.custom_theme_primary_foreground
            : config.custom_theme_primary_foreground,
        custom_theme_background:
          data.custom_theme_background !== undefined
            ? data.custom_theme_background
            : config.custom_theme_background,
        custom_theme_secondary_background:
          data.custom_theme_secondary_background !== undefined
            ? data.custom_theme_secondary_background
            : config.custom_theme_secondary_background,
        custom_theme_accent:
          data.custom_theme_accent !== undefined ? data.custom_theme_accent : config.custom_theme_accent,
        custom_theme_border:
          data.custom_theme_border !== undefined ? data.custom_theme_border : config.custom_theme_border,
        integration_slack_status:
          data.integration_slack_status !== undefined
            ? data.integration_slack_status
            : config.integration_slack_status,
        integration_slack_webhook:
          data.integration_slack_webhook !== undefined
            ? data.integration_slack_webhook
            : config.integration_slack_webhook,
        logo_redirect_url:
          data.logo_redirect_url !== undefined ? data.logo_redirect_url : config.logo_redirect_url,
        changelog_enabled:
          data.changelog_enabled !== undefined ? data.changelog_enabled : config.changelog_enabled,
      })
      .eq('id', config.id)
      .select(
        'id, created_at, project_id, changelog_preview_style, changelog_twitter_handle, integration_discord_status, integration_discord_webhook, integration_discord_role_id, custom_domain, custom_domain_verified, integration_sso_status, integration_sso_url, feedback_allow_anon_upvoting, custom_theme, custom_theme_background, custom_theme_border, custom_theme_primary_foreground, custom_theme_root, custom_theme_secondary_background, custom_theme_accent, integration_slack_status, integration_slack_webhook, logo_redirect_url, changelog_enabled'
      );

    // Check for errors
    if (updateError) {
      return { data: null, error: { message: updateError.message, status: 500 } };
    }

    // Return updated config
    return { data: updatedConfig[0], error: null };
  })(slug, cType);

// Create new API key
export const createProjectApiKey = (
  slug: string,
  data: { name: string; permission: string },
  cType: 'server' | 'route'
) =>
  withProjectAuth<ProjectApiKeyProps['Row']>(async (user, supabase, project, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error };
    }

    // Validate permission
    if (!['full_access', 'public_access'].includes(data.permission)) {
      return {
        data: null,
        error: { message: 'permission must be one of: full_access, public_access', status: 400 },
      };
    }

    // Get all API keys for project
    const { data: apiKeys, error: apiKeysError } = await supabase
      .from('project_api_keys')
      .select()
      .eq('project_id', project!.id);

    // Check for errors
    if (apiKeysError) {
      return { data: null, error: { message: apiKeysError.message, status: 500 } };
    }

    // Check if API key name already exists
    if (apiKeys.some((item) => item.name === data.name)) {
      return { data: null, error: { message: 'api key name already exists', status: 400 } };
    }

    // Check if it's more than 3 API keys
    if (apiKeys.length >= 3) {
      return { data: null, error: { message: 'maximum of 3 api keys reached', status: 400 } };
    }

    // Generate API key token
    const apiKeyToken = generateApiToken('fb', 20);
    const shortToken = apiKeyToken.slice(0, 12);

    // Create API key
    const { data: apiKey, error: apiKeyError } = await supabase
      .from('project_api_keys')
      .insert({
        project_id: project!.id,
        name: data.name,
        token: apiKeyToken,
        permission: data.permission as 'full_access' | 'public_access',
        short_token: shortToken,
        creator_id: user!.id,
      })
      .select()
      .single();

    // Check for errors
    if (apiKeyError) {
      return { data: null, error: { message: apiKeyError.message, status: 500 } };
    }

    // Return API key
    return { data: apiKey, error: null };
  })(slug, cType);

// Get all API keys for project
export const getProjectApiKeys = withProjectAuth<ProjectApiKeyWithoutTokenProps[]>(
  async (user, supabase, project, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error };
    }

    // Get all API keys for project
    const { data: apiKeys, error: apiKeysError } = await supabase
      .from('project_api_keys')
      .select('id, name, permission, short_token, project_id, creator_id, created_at')
      .eq('project_id', project!.id);

    // Check for errors
    if (apiKeysError) {
      return { data: null, error: { message: apiKeysError.message, status: 500 } };
    }

    // Return API keys
    return { data: apiKeys, error: null };
  }
);

// Delete API key for project
export const deleteProjectApiKey = (slug: string, keyId: string, cType: 'server' | 'route') =>
  withProjectAuth<ProjectApiKeyProps['Row']>(async (user, supabase, project, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error };
    }

    // Get API key
    const { data: apiKey, error: apiKeyError } = await supabase
      .from('project_api_keys')
      .select()
      .eq('project_id', project!.id)
      .eq('id', keyId)
      .single();

    // Check for errors
    if (apiKeyError || !apiKey) {
      return { data: null, error: { message: 'invalid api key', status: 400 } };
    }

    // Delete API key
    const { data: deletedApiKey, error: deleteError } = await supabase
      .from('project_api_keys')
      .delete()
      .eq('id', apiKey.id)
      .select()
      .single();

    // Check for errors
    if (deleteError) {
      return { data: null, error: { message: deleteError.message, status: 500 } };
    }

    // Return deleted API key
    return { data: deletedApiKey, error: null };
  })(slug, cType);

// Get project analytics
export const getProjectAnalytics = (
  slug: string,
  cType: 'server' | 'route',
  data?: { start: string; end: string }
) =>
  withProjectAuth(async (user, supabase, project, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error };
    }

    // Check if tinybird variables are set
    if (!process.env.TINYBIRD_API_URL || !process.env.TINYBIRD_API_KEY) {
      return { data: null, error: { message: 'Tinybird variables not set.', status: 500 } };
    }

    // If no start or end, set default to 7 days ago and url encode (without Z at end)
    const startDate = data?.start
      ? data.start
      : encodeURIComponent(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()).slice(0, -1);
    const endDate = data?.end
      ? data.end
      : encodeURIComponent(new Date(Date.now()).toISOString()).slice(0, -1);

    // Fetch timeseries from Tinybird
    const timeseries = await fetch(
      `${process.env.TINYBIRD_API_URL}/v0/pipes/timeseries.json?end=${endDate}&start=${startDate}&project=${project?.slug}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TINYBIRD_API_KEY}`,
        },
      }
    ).then((res) => res.json());

    // Check for errors
    if (timeseries.error) {
      return { data: null, error: { message: timeseries.error, status: 500 } };
    }

    // Fetch top feedback from Tinybird
    const topFeedback = (await fetch(
      `${process.env.TINYBIRD_API_URL}/v0/pipes/top_feedback.json?project=${project?.slug}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TINYBIRD_API_KEY}`,
        },
      }
    ).then((res) => res.json())) as { data: AnalyticsProps; error: string };

    // Check for errors
    if (topFeedback.error) {
      return { data: null, error: { message: topFeedback.error, status: 500 } };
    }

    // Fetch top changelogs from Tinybird
    const topChangelogs = (await fetch(
      `${process.env.TINYBIRD_API_URL}/v0/pipes/top_changelogs.json?project=${project?.slug}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TINYBIRD_API_KEY}`,
        },
      }
    ).then((res) => res.json())) as { data: AnalyticsProps; error: string };

    // Check for errors
    if (topChangelogs.error) {
      return { data: null, error: { message: topChangelogs.error, status: 500 } };
    }

    // Get all feedback for project
    const { data: feedback, error: feedbackError } = await supabase
      .from('feedback')
      .select()
      .eq('project_id', project!.id);

    // Check for errors
    if (feedbackError) {
      return { data: null, error: { message: feedbackError.message, status: 500 } };
    }

    // Get all changelogs for project
    const { data: changelogs, error: changelogsError } = await supabase
      .from('changelogs')
      .select()
      .eq('project_id', project!.id);

    // Check for errors
    if (changelogsError) {
      return { data: null, error: { message: changelogsError.message, status: 500 } };
    }

    // Restructure topFeedback data to show feedback title instead of id
    const restructuredTopFeedback = topFeedback.data
      .map((item) => {
        const feedbackData = feedback.find((feedback) => feedback.id === item.key);

        // Skip if no matching feedback id found
        if (!feedbackData) {
          return null;
        }

        return {
          ...item,
          key: feedbackData.title || item.key,
        };
      })
      .filter(Boolean); // Remove null values

    // Restructure topChangelogs data to show changelog title instead of id
    const restructuredTopChangelogs = topChangelogs.data.map((item) => {
      const changelogData = changelogs.find((changelog) => changelog.id === item.key);

      // Skip if no matching changelog id found
      if (!changelogData) {
        return null;
      }

      return {
        ...item,
        key: changelogData?.title || item.key,
      };
    });

    // Return analytics
    return {
      data: {
        timeseries: timeseries.data as AnalyticsProps,
        topFeedback: restructuredTopFeedback.filter(
          (feedback) => feedback && feedback.key !== '_root'
        ) as AnalyticsProps,
        topChangelogs: restructuredTopChangelogs.filter(
          (changelog) => changelog && changelog.key !== '_root'
        ) as AnalyticsProps,
      },
      error: null,
    };
  })(slug, cType);
