import { withProjectAuth } from '@/lib/auth';
import { ChangelogWithAuthorProps, FeedbackTagProps, FeedbackWithUserProps } from '@/lib/types';

// Get Public Project Changelogs
export const getPublicProjectChangelogs = withProjectAuth<ChangelogWithAuthorProps[]>(
  async (user, supabase, project, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error };
    }

    // Get Changelogs
    const { data: changelogs, error: changelogsError } = await supabase
      .from('changelogs')
      .select('profiles (full_name, avatar_url), *')
      .eq('project_id', project!.id)
      .eq('published', true);

    // Check for errors
    if (changelogsError) {
      return { data: null, error: { message: changelogsError.message, status: 500 } };
    }

    // Restructure data
    const restructuredData = changelogs.map((changelog) => {
      // Destructure profiles from changelog
      const { profiles, ...restOfChangelog } = changelog;

      return {
        ...restOfChangelog,
        author: {
          full_name: changelog.profiles?.full_name,
          avatar_url: changelog.profiles?.avatar_url,
        },
      };
    }) as ChangelogWithAuthorProps[];

    // Return changelogs
    return { data: restructuredData, error: null };
  }
);

// Get Public Project Feedback
export const getPublicProjectFeedback = withProjectAuth<FeedbackWithUserProps[]>(
  async (user, supabase, project, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error };
    }

    // Get feedback and also include complete user object
    const { data: feedback, error: feedbackError } = await supabase
      .from('feedback')
      .select('*, user:user_id (*)')
      .eq('project_id', project!.id);

    // Check for errors
    if (feedbackError) {
      return { data: null, error: { message: feedbackError.message, status: 500 } };
    }

    // Convert feedback to unknown type and then to test type
    const feedbackData = feedback as unknown as FeedbackWithUserProps[];

    // Convert raw tags to tags and remove raw tags
    feedbackData.forEach((feedback) => {
      feedback.tags = feedback.raw_tags as unknown as FeedbackTagProps['Row'][];
    });

    // Get team members
    const { data: teamMembers, error: teamMembersError } = await supabase
      .from('project_members')
      .select('profiles (full_name, avatar_url), *')
      .eq('project_id', project!.id);

    // Check for errors
    if (teamMembersError) {
      return { data: null, error: { message: teamMembersError.message, status: 500 } };
    }

    // Set team members
    feedbackData.forEach((feedback) => {
      feedback.user.isTeamMember = teamMembers.some((member) => member.member_id === feedback.user_id);
    });

    // If user logged in, get upvoted feedback
    if (user) {
      // Get upvoters
      const { data: userUpvotes, error: userUpvotesError } = await supabase
        .from('feedback_upvoters')
        .select()
        .eq('profile_id', user.id);

      // Check for errors
      if (userUpvotesError) {
        return { data: null, error: { message: userUpvotesError.message, status: 500 } };
      }

      // Get array of upvoted feedback ids
      const upvotedFeedbackIds = userUpvotes.map((upvoter) => upvoter.feedback_id);

      // Add has upvoted
      if (upvotedFeedbackIds.length > 0) {
        feedbackData.forEach((feedback) => {
          feedback.has_upvoted = upvotedFeedbackIds.includes(feedback.id);
        });
      }
    }

    // Return feedback
    return { data: feedbackData, error: null };
  }
);

// Subscribe to project changelogs
export const subscribeToProjectChangelogs = (projectSlug: string, email: string) =>
  withProjectAuth<ChangelogWithAuthorProps[]>(async (user, supabase, project, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error };
    }

    // Validate email
    if (!/\S+@\S+\.\S+/.test(email)) {
      return { data: null, error: { message: 'Invalid email.', status: 400 } };
    }

    // Check if subscriber already exists for this project
    const { data: existingSubscriber } = await supabase
      .from('changelog_subscribers')
      .select()
      .eq('project_id', project!.id)
      .eq('email', email)
      .single();

    // If subscriber already exists, return error
    if (existingSubscriber) {
      return { data: null, error: { message: 'You are already subscribed to this project.', status: 400 } };
    }

    // Subscribe to project changelogs
    const { data: subscriber, error: subscriberError } = await supabase
      .from('changelog_subscribers')
      .insert({ project_id: project!.id, email })
      .select()
      .single();

    // Check for errors
    if (subscriberError) {
      return { data: null, error: { message: subscriberError.message, status: 500 } };
    }

    // Return subscriber
    return { data: subscriber, error: null };
  })(projectSlug, 'server', true, false);

// Unsubscribe from project changelogs
export const unsubscribeFromProjectChangelogs = (projectSlug: string, subId: string) =>
  withProjectAuth<ChangelogWithAuthorProps[]>(async (user, supabase, project, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error };
    }

    // Check if subscriber exists
    const { data: existingSubscriber } = await supabase
      .from('changelog_subscribers')
      .select()
      .eq('id', subId)
      .single();

    // If subscriber doesn't exist, return error
    if (!existingSubscriber) {
      return { data: null, error: { message: 'Subscriber does not exist.', status: 400 } };
    }

    // Delete subscriber
    const { data, error: deleteError } = await supabase
      .from('changelog_subscribers')
      .delete()
      .eq('id', subId)
      .single();

    // Check for errors
    if (deleteError) {
      return { data: null, error: { message: deleteError.message, status: 500 } };
    }

    // Return success
    return { data, error: null };
  })(projectSlug, 'server', true, false);
