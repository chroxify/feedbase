import { decode } from 'base64-arraybuffer';
import { withUserAuth } from '../auth';
import { NotificationProps, ProfileProps, ProjectProps } from '../types';

// Get current user
export const getCurrentUser = withUserAuth<ProfileProps['Row']>(async (user, supabase, error) => {
  // If any errors, return error
  if (error) {
    return { data: null, error };
  }

  if (!user) {
    return { data: null, error: { message: 'user not found.', status: 404 } };
  }

  // Get user profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select()
    .eq('id', user.id)
    .single();

  // Check for errors
  if (profileError) {
    return { data: null, error: { message: profileError.message, status: 500 } };
  }

  // Return projects
  return { data: profile, error: null };
});

// Get all projects for an user
export const getUserProjects = withUserAuth<ProjectProps['Row'][]>(async (user, supabase, error) => {
  // If any errors, return error
  if (error) {
    return { data: null, error };
  }

  // Get all projects for user
  const { data: projects, error: projectsError } = await supabase
    .from('project_members')
    .select('projects (*)')
    .eq('member_id', user!.id);

  // Check for errors
  if (projectsError) {
    return { data: null, error: { message: projectsError.message, status: 500 } };
  }

  // Restructure projects data
  const restructuredData = projects.map((item) =>
    'projects' in item ? item.projects : item
  ) as ProjectProps['Row'][];

  // Return projects
  return { data: restructuredData, error: null };
});

// Update user profile
export const updateUserProfile = (
  cType: 'route' | 'server',
  data: { full_name: string | undefined; avatar_url: string | undefined }
) =>
  withUserAuth<ProfileProps['Row']>(async (user, supabase, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error };
    }

    if (!user) {
      return { data: null, error: { message: 'user not found.', status: 404 } };
    }

    // If avatar url provided, upload to supabase storage
    if (data.avatar_url) {
      // Check if avatar already exists
      const { data: avatarData } = await supabase.storage.from('avatars').getPublicUrl(`${user.id}`);

      // Check for errors
      if (avatarData) {
        // Delete avatar
        await supabase.storage.from('avatars').remove([`${user.id}`]);
      }

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(`${user.id}`, decode(data.avatar_url.replace(/^data:image\/\w+;base64,/, '')), {
          contentType: 'image/png',
        });

      // Check for errors
      if (uploadError) {
        return { data: null, error: { message: uploadError.message, status: 500 } };
      }

      // Get public url for avatar
      const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(`${user.id}`);

      // Check for errors
      if (!publicUrlData) {
        return { data: null, error: { message: 'issue uploading avatar.', status: 500 } };
      }

      // Set avatar url to public url
      data.avatar_url = publicUrlData.publicUrl;
    }

    // Update user profile
    const { data: updatedUser, error: updatedUserError } = await supabase
      .from('profiles')
      .update({
        full_name: data.full_name,
        avatar_url: data.avatar_url,
      })
      .eq('id', user.id)
      .select()
      .single();

    // Check for errors
    if (updatedUserError) {
      return { data: null, error: { message: updatedUserError.message, status: 500 } };
    }

    // Return updated user
    return { data: updatedUser, error: null };
  })(cType);

// Get user's notifications
export const getUserNotifications = withUserAuth<NotificationProps[]>(async (user, supabase, error) => {
  // If any errors, return error
  if (error) {
    return { data: null, error };
  }

  if (!user) {
    return { data: null, error: { message: 'user not found.', status: 404 } };
  }

  // Get all projects user is a member of
  const { data: projects, error: projectsError } = await supabase
    .from('project_members')
    .select('projects (*)')
    .eq('member_id', user.id);

  // Check for errors
  if (projectsError) {
    return { data: null, error: { message: projectsError.message, status: 500 } };
  }

  // Restructure projects data
  const restructuredData = projects.map((item) =>
    'projects' in item ? item.projects : item
  ) as ProjectProps['Row'][];

  // Get all notifications for user
  const { data: notifications, error: notificationsError } = await supabase
    .from('notifications')
    .select('*, project:project_id (name, slug, icon), initiator:initiator_id (full_name)')
    .in(
      'project_id',
      restructuredData.map((item) => item.id)
    )
    .neq('initiator_id', user.id);

  // Check for errors
  if (notificationsError) {
    return { data: null, error: { message: notificationsError.message, status: 500 } };
  }

  // Convert notifications type
  const restructuredNotifications = notifications as unknown as NotificationProps[];

  // Return notifications
  return { data: restructuredNotifications, error: null };
});

// Archive notification
export const archiveUserNotification = (
  cType: 'route' | 'server',
  notificationId: string,
  archived: boolean
) =>
  withUserAuth<NotificationProps>(async (user, supabase, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error };
    }

    if (!user) {
      return { data: null, error: { message: 'user not found.', status: 404 } };
    }

    // Get notification
    const { data: notification, error: notificationError } = await supabase
      .from('notifications')
      .select()
      .eq('id', notificationId)
      .single();

    // Check for errors
    if (notificationError) {
      return { data: null, error: { message: notificationError.message, status: 500 } };
    }

    // Check if notification exists
    if (!notification) {
      return { data: null, error: { message: 'notification not found.', status: 404 } };
    }

    // Check if user has access to notification
    const { data: projectMember, error: projectMemberError } = await supabase
      .from('project_members')
      .select()
      .eq('project_id', notification.project_id)
      .eq('member_id', user.id)
      .single();

    // Check for errors
    if (projectMemberError) {
      return { data: null, error: { message: projectMemberError.message, status: 500 } };
    }

    // Check if user is a member of the project
    if (!projectMember) {
      return { data: null, error: { message: 'user is not a member of the project.', status: 403 } };
    }

    // Append user to has_archived array
    const updatedNotification = archived
      ? [...(notification.has_archived || []), user.id]
      : (notification.has_archived || []).filter((item) => item !== user.id);

    // Update notification
    const { data: updatedNotificationData, error: updatedNotificationError } = await supabase
      .from('notifications')
      .update({
        has_archived: updatedNotification,
      })
      .eq('id', notificationId)
      .select('*, project:project_id (name, slug, icon), initiator:initiator_id (full_name)')
      .single();

    // Check for errors
    if (updatedNotificationError) {
      return { data: null, error: { message: updatedNotificationError.message, status: 500 } };
    }

    // Convert notifications type
    const restructuredNotification = updatedNotificationData as unknown as NotificationProps;

    // Return updated notification
    return { data: restructuredNotification, error: null };
  })(cType);
