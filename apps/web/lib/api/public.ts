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
