import { sendEmail } from '@/emails';
import ProjectInviteEmail from '@/emails/project-invite';
import { withProjectAuth, withUserAuth } from '../auth';
import { ExtendedInviteProps, ProfileProps, ProjectInviteProps } from '../types';
import { formatRootUrl } from '../utils';

// Get all project invites
export const getProjectInvites = withProjectAuth<ExtendedInviteProps[]>(
  async (user, supabase, project, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error };
    }

    // Get all invites for project
    const { data: invites, error: invitesError } = await supabase
      .from('project_invites')
      .select('*, project:project_id (name, slug, icon), creator:creator_id (full_name)')
      .eq('project_id', project!.id);

    // If any errors, return error
    if (invitesError) {
      return { data: null, error: { message: invitesError.message, status: 500 } };
    }

    // Convert invites type
    const invitesData = invites as unknown as ExtendedInviteProps[];

    // Return invites
    return { data: invitesData, error: null };
  }
);

// Get project invite
export const getProjectInvite = (inviteId: string, cType: 'server' | 'route') =>
  withUserAuth<ExtendedInviteProps>(async (user, supabase, error) => {
    // If any errors, return error
    if (error && error.status !== 401) {
      return { data: null, error };
    }

    // Get invite
    const { data: invite, error: inviteError } = await supabase
      .from('project_invites')
      .select('*, project:project_id (name, slug, icon), creator:creator_id (full_name)')
      .eq('id', inviteId)
      .single();

    // If any errors, return error
    if (inviteError) {
      return { data: null, error: { message: inviteError.message, status: 500 } };
    }

    // Convert invite type
    const inviteData = invite as unknown as ExtendedInviteProps;

    // Return invite
    return { data: inviteData, error: null };
  })(cType);

// Create new project invite
export const createProjectInvite = (slug: string, cType: 'server' | 'route', email: string) =>
  withProjectAuth<ProjectInviteProps['Row']>(async (user, supabase, project, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error };
    }

    // Check if user has an account already
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select()
      .eq('email', email)
      .single();

    // If any errors, return error and make sure it's not a PGRST116 error (no rows found)
    if (profileError && profileError.code !== 'PGRST116') {
      return { data: null, error: { message: profileError.message, status: 500 } };
    }

    if (profile) {
      // Check if user is already a member of the project
      const { data: isMember, error: isMemberError } = await supabase
        .from('project_members')
        .select()
        .eq('project_id', project!.id)
        .eq('member_id', profile.id)
        .single();

      // If any errors, return error
      if (isMemberError) {
        return { data: null, error: { message: isMemberError.message, status: 500 } };
      }

      // If user is already a member of the project, return error
      if (isMember) {
        return { data: null, error: { message: 'User is already a member of this project', status: 400 } };
      }
    }

    // Make sure user is not already invited to the project
    const { data: alreadyInvited, error: alreadyInvitedError } = await supabase
      .from('project_invites')
      .select()
      .eq('project_id', project!.id)
      .eq('email', email);

    // If any errors, return error
    if (alreadyInvitedError) {
      return { data: null, error: { message: alreadyInvitedError.message, status: 500 } };
    }

    // If user is already invited to the project, return error
    if (alreadyInvited && alreadyInvited.length > 0) {
      return { data: null, error: { message: 'User is already invited to this project', status: 400 } };
    }

    // Create invite
    const { data: invite, error: inviteError } = await supabase
      .from('project_invites')
      .insert({ project_id: project!.id, email, creator_id: user!.id })
      .select('*, creator:creator_id (full_name, email)')
      .single();

    // If any errors, return error
    if (inviteError) {
      return { data: null, error: { message: inviteError.message, status: 500 } };
    }

    // Convert invite to invite with creator object
    const inviteData = invite as unknown as ProjectInviteProps['Row'] & { creator: ProfileProps['Row'] };

    // Send email to user
    const { error: emailError } = await sendEmail({
      subject: `You've been invited to join ${project!.name} on Feedbase`,
      email,
      react: ProjectInviteEmail({
        email,
        invitedByFullName: inviteData.creator.full_name,
        invitedByEmail: inviteData.creator.email,
        projectName: project!.name,
        inviteLink: formatRootUrl('dash', `/invite/${inviteData.id}`),
      }),
    })
      .then((data) => {
        return { data, error: null };
      })
      .catch((err) => {
        // If any errors, return error
        return { data: null, error: { message: err.message, status: 500 } };
      });

    // If any errors, return error
    if (emailError) {
      // Delete invite
      await supabase.from('project_invites').delete().eq('id', inviteData.id).single();

      return { data: null, error: emailError };
    }

    // Return invite
    return { data: invite, error: null };
  })(slug, cType);

// Accept project invite
export const acceptProjectInvite = (inviteId: string, cType: 'server' | 'route') =>
  withUserAuth<ProjectInviteProps['Row']>(async (user, supabase, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error };
    }

    // Get invite
    const { data: invite, error: inviteError } = await supabase
      .from('project_invites')
      .select()
      .eq('id', inviteId)
      .single();

    // If any errors, return error
    if (inviteError) {
      return { data: null, error: { message: inviteError.message, status: 500 } };
    }

    // Make sure invite exists
    if (!invite) {
      return { data: null, error: { message: 'Invite not found', status: 404 } };
    }

    // Validate invite user
    if (invite.email !== user!.email) {
      return { data: null, error: { message: 'Invalid invite', status: 400 } };
    }

    // Validate invite expiration (invite created_at + 7 days)
    const inviteExpiration = new Date(invite.created_at);
    inviteExpiration.setDate(inviteExpiration.getDate() + 7);

    if (inviteExpiration < new Date()) {
      return { data: null, error: { message: 'Invite has expired', status: 400 } };
    }

    // Validate invite status
    if (invite.accepted) {
      return { data: null, error: { message: 'Invite has already been accepted', status: 400 } };
    }

    // Add user to project
    const { error: memberError } = await supabase
      .from('project_members')
      .insert({ project_id: invite.project_id, member_id: user!.id })
      .single();

    // If any errors, return error
    if (memberError) {
      return { data: null, error: { message: memberError.message, status: 500 } };
    }

    // Set invite to accepted
    const { data: updatedInvite, error: updatedInviteError } = await supabase
      .from('project_invites')
      .update({ accepted: true })
      .eq('id', inviteId)
      .select()
      .single();

    // If any errors, return error
    if (updatedInviteError) {
      return { data: null, error: { message: updatedInviteError.message, status: 500 } };
    }

    // Return member
    return { data: updatedInvite, error: null };
  })(cType);

// Delete project invite
export const deleteProjectInvite = (inviteId: string, cType: 'server' | 'route') =>
  withUserAuth<ProjectInviteProps['Row']>(async (user, supabase, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error };
    }

    // Delete invite
    const { data: invite, error: inviteError } = await supabase
      .from('project_invites')
      .delete()
      .eq('id', inviteId)
      .select()
      .single();

    // If any errors, return error
    if (inviteError) {
      return { data: null, error: { message: inviteError.message, status: 500 } };
    }

    // Return invite
    return { data: invite, error: null };
  })(cType);
