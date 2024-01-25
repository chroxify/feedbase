import { internal_runWithWaitUntil as waitUntil } from 'next/dist/server/web/internal-edge-wait-until';
import { withFeedbackAuth, withProjectAuth } from '../auth';
import {
  FeedbackProps,
  FeedbackTagProps,
  FeedbackWithUserInputProps,
  FeedbackWithUserProps,
  ProfileProps,
} from '../types';
import { isValidEmail } from '../utils';
import { sendDiscordNotification, sendSlackNotification } from './integrations';

// Create a feedback post
export const createFeedback = (
  projectSlug: string,
  data: FeedbackWithUserInputProps,
  cType: 'server' | 'route'
) =>
  withProjectAuth<FeedbackProps['Row']>(async (user, supabase, project, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error };
    }

    // Check if tags exist
    if (data.tags && data.tags.length > 0) {
      // Get all feedback tags for project
      const { data: projectTags, error: tagsError } = await supabase
        .from('feedback_tags')
        .select()
        .eq('project_id', project!.id);

      // Check for errors
      if (tagsError) {
        return { data: null, error: { message: tagsError.message, status: 500 } };
      }

      // If no tags, return error
      if (!projectTags || projectTags.length === 0) {
        return { data: null, error: { message: 'no tags found for project.', status: 404 } };
      }

      // Check if all tags are valid
      const invalidTags: string[] = [];

      // Loop through tags
      data.tags.forEach((tag) => {
        // Check if tag exists
        const tagExists = projectTags.find((t) => t.id === tag);

        // If tag doesn't exist, add to invalid tags
        if (!tagExists) {
          invalidTags.push(tag);
        }
      });

      // If invalid tags, return error
      if (invalidTags.length > 0) {
        return {
          data: null,
          error: {
            message: `invalid tag(s): ${invalidTags.join(', ')}`,
            status: 400,
          },
        };
      }

      // Convert tags into raw tags json array objects: [{name: name, color: color}]
      data.raw_tags = projectTags
        .filter((tag) => data.tags!.includes(tag.id))
        .map((tag) => {
          return { name: tag.name, color: tag.color };
        });
    }

    // Check if user is not undefined
    if (data.user !== undefined) {
      // Make sure user has email and its an email
      if (!data.user.email || !isValidEmail(data.user.email)) {
        return {
          data: null,
          error: { message: 'user.email is required and must be a valid email.', status: 400 },
        };
      }

      // Check if user exists
      const { data: userProfile, error: profileError } = await supabase
        .from('profiles')
        .select()
        .eq('email', data.user.email);

      // Check for errors
      if (profileError) {
        return { data: null, error: { message: profileError.message, status: 500 } };
      }

      // Check if widget user email exists
      const { data: widgetUser, error: widgetUserError } = await supabase
        .from('profiles')
        .select()
        .eq('email', data.user.email.replace('@', '+widget@'));

      // Check for errors
      if (widgetUserError) {
        return { data: null, error: { message: widgetUserError.message, status: 500 } };
      }

      /**
       * Theres 3 cases:
       * 1. No real user profile
       *  1.1. No widget user profile → create new widget user profile
       *  1.2. Already widget user profile → use widget user profile
       * 2. Real user profile & widget user profile → use widget user profile but update if name has changed
       * 3. Real user profile & no widget user profile → create new widget user profile
       */
      if (!userProfile || userProfile.length === 0) {
        /**
         * If there is no real user profile check if there is a widget user profile
         * Already widget user profile → use widget user profile
         * No widget user profile → create new widget user profile
         */
        if (widgetUser && widgetUser.length > 0) {
          // Update name if it has changed
          if (data.user.full_name !== undefined && widgetUser[0].full_name !== data.user.full_name) {
            const { error: updateError } = await supabase
              .from('profiles')
              .update({ full_name: data.user.full_name })
              .eq('id', widgetUser[0].id)
              .select()
              .single();

            // Check for errors
            if (updateError) {
              return { data: null, error: { message: updateError.message, status: 500 } };
            }
          }

          data.user_id = widgetUser[0].id;
        } else {
          // Create user
          const { data: createdProfile, error: createError } = await supabase
            .from('profiles')
            .insert({
              email: data.user.email.replace('@', '+widget@'),
              full_name:
                data.user.full_name !== undefined ? data.user.full_name : data.user.email.split('@')[0],
            })
            .select()
            .single();

          // Check for errors
          if (createError) {
            return { data: null, error: { message: createError.message, status: 500 } };
          }

          // Set user id
          data.user_id = createdProfile.id;
        }
      } else if (widgetUser && widgetUser.length > 0) {
        /**
         * As there is a real user profile check if there is a widget user profile
         * Already widget user profile → possibly update name and use widget user profile
         */

        // Update name if it has changed
        if (data.user.full_name !== undefined && userProfile[0].full_name !== data.user.full_name) {
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ full_name: data.user.full_name })
            .eq('id', widgetUser[0].id)
            .select()
            .single();

          // Check for errors
          if (updateError) {
            return { data: null, error: { message: updateError.message, status: 500 } };
          }
        }

        data.user_id = widgetUser[0].id;
      } else {
        /**
         * As there is a real user profile but no widget user profile
         * Create new widget user profile
         */
        const { data: createdProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            email: userProfile[0].email.replace('@', '+widget@'),
            full_name: userProfile[0].full_name,
          })
          .select()
          .single();

        // Check for errors
        if (createError) {
          return { data: null, error: { message: createError.message, status: 500 } };
        }

        // Set user id
        data.user_id = createdProfile.id;
      }
    }

    // Make sure content is not empty or just html tags
    if (data.description.replace(/<[^>]*>?/gm, '').length === 0) {
      return { data: null, error: { message: 'feedback description cannot be empty.', status: 400 } };
    }

    // Insert feedback
    const { data: feedback, error: feedbackError } = await supabase
      .from('feedback')
      .insert({
        title: data.title,
        description: data.description,
        status: data.status,
        raw_tags: data.raw_tags,
        project_id: project!.id,
        user_id: data.user !== undefined ? data.user_id : user!.id,
      })
      .select('*, user:user_id (*)')
      .single();

    // Check for errors
    if (feedbackError) {
      return { data: null, error: { message: feedbackError.message, status: 500 } };
    }

    // Convert feedback to unknown type and then to test type
    const feedbackData = feedback as unknown as FeedbackWithUserProps;

    // Fetch Project Config for integrations
    const { data: projectConfig, error: projectConfigError } = await supabase
      .from('project_configs')
      .select()
      .eq('project_id', project!.id)
      .single();

    // Check for errors
    if (projectConfigError) {
      return { data: null, error: { message: projectConfigError.message, status: 500 } };
    }

    //! Note: The waitUntil function is currently a highly experimental api and might break in the future
    // Once there is a better way to do this, it should be replaced
    // https://github.com/vercel/next.js/issues/50522#issuecomment-1838593482

    // Check if Discord integration is enabled
    if (projectConfig.integration_discord_status) {
      // Send Discord notification asynchronously without waiting for it to complete
      waitUntil(async () => {
        sendDiscordNotification(feedbackData, project!, projectConfig);
      });
    }

    // Check if Slack integration is enabled
    if (projectConfig.integration_slack_status) {
      // Send Slack notification asynchronously without waiting for it to complete
      waitUntil(async () => {
        sendSlackNotification(feedbackData, project!, projectConfig);
      });
    }

    // Create project notification
    waitUntil(async () => {
      await supabase
        .from('notifications')
        .insert({
          type: 'post',
          project_id: project!.id,
          initiator_id: user!.id,
          feedback_id: feedbackData.id,
        })
        .select()
        .single();
    });

    // Return feedback
    return { data: feedback, error: null };
  })(projectSlug, cType, true, true);

// Update a feedback post
export const updateFeedbackByID = (
  id: string,
  projectSlug: string,
  data: FeedbackWithUserInputProps,
  cType: 'server' | 'route'
) =>
  withFeedbackAuth<FeedbackProps['Row']>(async (user, supabase, feedback, project, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error };
    }

    // Check if tags exist
    if (data.tags !== undefined) {
      // Get all feedback tags for project
      const { data: projectTags, error: tagsError } = await supabase
        .from('feedback_tags')
        .select()
        .eq('project_id', project!.id);

      // Check for errors
      if (tagsError) {
        return { data: null, error: { message: tagsError.message, status: 500 } };
      }

      // If no tags, return error
      if (!projectTags || projectTags.length === 0) {
        return { data: null, error: { message: 'no tags found for project.', status: 404 } };
      }

      // Check if all tags are valid
      const invalidTags: string[] = [];

      // Loop through tags
      data.tags.forEach((tag) => {
        // Check if tag exists
        const tagExists = projectTags.find((t) => t.id === tag);

        // If tag doesn't exist, add to invalid tags
        if (!tagExists) {
          invalidTags.push(tag);
        }
      });

      // If invalid tags, return error
      if (invalidTags.length > 0) {
        return {
          data: null,
          error: {
            message: `invalid tag(s): ${invalidTags.join(', ')}`,
            status: 400,
          },
        };
      }

      // Convert tags into raw tags json array objects: [{name: name, color: color}]
      data.raw_tags = projectTags
        .filter((tag) => data.tags!.includes(tag.id))
        .map((tag) => {
          return { name: tag.name, color: tag.color };
        });
    }

    // Update feedback
    const { data: updatedFeedback, error: updatedFeedbackError } = await supabase
      .from('feedback')
      .update({
        title: data.title ? data.title : feedback!.title,
        description: data.description ? data.description : feedback!.description,
        status: data.status !== undefined ? data.status : feedback!.status,
        raw_tags: data.raw_tags ? data.raw_tags : feedback!.raw_tags,
      })
      .eq('id', feedback!.id)
      .select()
      .single();

    // Check for errors
    if (updatedFeedbackError) {
      return { data: null, error: { message: updatedFeedbackError.message, status: 500 } };
    }

    // Return feedback
    return { data: updatedFeedback, error: null };
  })(id, projectSlug, cType);

// Get a feedback post
export const getFeedbackByID = withFeedbackAuth<FeedbackWithUserProps>(
  async (user, supabase, feedback, project, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error };
    }

    // Get upvoters
    const { data: upvoters, error: upvotersError } = await supabase
      .from('feedback_upvoters')
      .select()
      .eq('feedback_id', feedback!.id);

    // Check for errors
    if (upvotersError) {
      return { data: null, error: { message: upvotersError.message, status: 500 } };
    }

    // Check if user has upvoted
    const hasUpvoted = upvoters.find((upvoter) => upvoter.profile_id === user!.id);

    // Convert feedback to unknown type and then to test type
    const feedbackData = feedback as unknown as FeedbackWithUserProps;

    // Convert raw tags to tags
    feedbackData.tags = feedbackData.raw_tags as unknown as FeedbackTagProps['Row'][];

    // Add has upvoted
    feedbackData.has_upvoted = !!hasUpvoted;

    // Return feedback
    return { data: feedbackData, error: null };
  }
);

// Delete a feedback post
export const deleteFeedbackByID = withFeedbackAuth<FeedbackProps['Row']>(
  async (user, supabase, feedback, project, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error };
    }

    // Delete feedback
    const { data: deletedFeedback, error: deleteError } = await supabase
      .from('feedback')
      .delete()
      .eq('id', feedback!.id)
      .select()
      .single();

    // Check for errors
    if (deleteError) {
      return { data: null, error: { message: deleteError.message, status: 500 } };
    }

    // Return success
    return { data: deletedFeedback, error: null };
  }
);

// Get feedback upvoters
export const getFeedbackUpvotersById = withFeedbackAuth<ProfileProps['Row'][]>(
  async (user, supabase, feedback, project, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error };
    }

    // Get feedback upvoters
    const { data: upvoters, error: upvotersError } = await supabase
      .from('feedback_upvoters')
      .select('profiles (*), created_at')
      .eq('feedback_id', feedback!.id)
      .order('created_at', { ascending: false });

    // Check for errors
    if (upvotersError) {
      return { data: null, error: { message: upvotersError.message, status: 500 } };
    }

    // Restructure upvoters
    const restructuredData = upvoters.map((item) => {
      return item.profiles;
    }) as ProfileProps['Row'][];

    // Return upvoters
    return { data: restructuredData, error: null };
  }
);

// Upvote feedback by ID
export const upvoteFeedbackByID = (
  id: string,
  projectSlug: string,
  cType: 'server' | 'route',
  hasUserUpvoted = false,
  isAnonymous = false
) =>
  withFeedbackAuth<FeedbackProps['Row']>(async (user, supabase, feedback, project, error) => {
    // Set has upvoted
    let hasUpvoted = hasUserUpvoted;

    // If any errors, return error
    if (error) {
      return { data: null, error };
    }

    // Get project config
    const { data: projectConfig, error: projectConfigError } = await supabase
      .from('project_configs')
      .select()
      .eq('project_id', project!.id)
      .single();

    // Check for errors
    if (projectConfigError) {
      return { data: null, error: { message: projectConfigError.message, status: 500 } };
    }

    // Check if anonymous upvoting is enabled
    if (!projectConfig.feedback_allow_anon_upvoting && isAnonymous) {
      return { data: null, error: { message: 'anonymous upvoting is not allowed.', status: 403 } };
    }

    // Upvote for logged in users
    if (!isAnonymous) {
      // Get user profile
      const { data: userProfile, error: profileError } = await supabase
        .from('profiles')
        .select()
        .eq('id', user!.id)
        .single();

      // Check for errors
      if (profileError) {
        return { data: null, error: { message: profileError.message, status: 500 } };
      }

      // Check if user has already upvoted
      const { data: upvoter, error: upvoterErrorCheck } = await supabase
        .from('feedback_upvoters')
        .select()
        .eq('profile_id', userProfile.id)
        .eq('feedback_id', feedback!.id);

      // Check for errors
      if (upvoterErrorCheck) {
        return { data: null, error: { message: upvoterErrorCheck.message, status: 500 } };
      }

      // Check if upvoter exists
      if (upvoter && upvoter.length > 0) {
        // Delete upvoter
        const { error: deleteError } = await supabase
          .from('feedback_upvoters')
          .delete()
          .eq('id', upvoter[0].id)
          .select()
          .single();

        // Check for errors
        if (deleteError) {
          return { data: null, error: { message: deleteError.message, status: 500 } };
        }
      } else {
        // Create upvoter
        const { error: upvoterError } = await supabase
          .from('feedback_upvoters')
          .insert({ profile_id: userProfile.id, feedback_id: feedback!.id })
          .select()
          .single();

        // Check for errors
        if (upvoterError) {
          return { data: null, error: { message: upvoterError.message, status: 500 } };
        }
      }

      // Set has upvoted
      hasUpvoted = upvoter && upvoter.length > 0;
    }

    // Update feedback upvotes
    const { data: updatedFeedback, error: updateError } = await supabase
      .from('feedback')
      .update({ upvotes: feedback!.upvotes + (hasUpvoted ? -1 : 1) })
      .eq('id', feedback!.id)
      .select()
      .single();

    // Check for errors
    if (updateError) {
      return { data: null, error: { message: updateError.message, status: 500 } };
    }

    // Return feedback
    return { data: updatedFeedback, error: null };
  })(id, projectSlug, cType, !isAnonymous);

// Get all feedback posts
export const getAllProjectFeedback = withProjectAuth<FeedbackWithUserProps[]>(
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

    // Get upvoters
    const { data: userUpvotes, error: userUpvotesError } = await supabase
      .from('feedback_upvoters')
      .select()
      .eq('profile_id', user!.id);

    // Check for errors
    if (userUpvotesError) {
      return { data: null, error: { message: userUpvotesError.message, status: 500 } };
    }

    // Convert feedback to unknown type and then to test type
    const feedbackData = feedback as unknown as FeedbackWithUserProps[];

    // Convert raw tags to tags and remove raw tags
    feedbackData.forEach((feedback) => {
      feedback.tags = feedback.raw_tags as unknown as FeedbackTagProps['Row'][];
    });

    // Get array of upvoted feedback ids
    const upvotedFeedbackIds = userUpvotes.map((upvoter) => upvoter.feedback_id);

    // Add has upvoted
    if (upvotedFeedbackIds.length > 0) {
      feedbackData.forEach((feedback) => {
        feedback.has_upvoted = upvotedFeedbackIds.includes(feedback.id);
      });
    }

    // Return feedback
    return { data: feedbackData, error: null };
  }
);

// Create feedback tag
export const createFeedbackTag = (
  projectSlug: string,
  data: { name: string; color: string },
  cType: 'server' | 'route'
) =>
  withProjectAuth<FeedbackTagProps['Row']>(async (user, supabase, project, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error };
    }

    // Make sure tag doesn't already exist
    const { data: tagExists, error: tagExistsError } = await supabase
      .from('feedback_tags')
      .select()
      .eq('project_id', project!.id)
      .eq('name', data.name);

    // Check for errors
    if (tagExistsError) {
      return { data: null, error: { message: tagExistsError.message, status: 500 } };
    }

    // Check if tag exists
    if (tagExists && tagExists.length > 0) {
      return { data: null, error: { message: 'tag with same name already exists.', status: 400 } };
    }

    // Create tag
    const { data: tag, error: tagError } = await supabase
      .from('feedback_tags')
      .insert({
        name: data.name,
        color: data.color,
        project_id: project!.id,
      })
      .select()
      .single();

    // Check for errors
    if (tagError) {
      return { data: null, error: { message: tagError.message, status: 500 } };
    }

    // Return feedback
    return { data: tag, error: null };
  })(projectSlug, cType);

// Delete feedback tag by name
export const deleteFeedbackTagByName = (projectSlug: string, tagName: string, cType: 'server' | 'route') =>
  withProjectAuth<FeedbackTagProps['Row']>(async (user, supabase, project, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error };
    }

    // Check if tag exists
    const { data: tag, error: tagError } = await supabase
      .from('feedback_tags')
      .select()
      .eq('project_id', project!.id)
      .eq('name', tagName)
      .single();

    // Check for errors
    if (tagError) {
      return { data: null, error: { message: 'tag not found.', status: 404 } };
    }

    // Delete tag
    const { data: deletedTag, error: deleteError } = await supabase
      .from('feedback_tags')
      .delete()
      .eq('id', tag.id)
      .select()
      .single();

    // Check for errors
    if (deleteError) {
      return { data: null, error: { message: deleteError.message, status: 500 } };
    }

    // Return success
    return { data: deletedTag, error: null };
  })(projectSlug, cType);

// Get all project feedback tags
export const getAllFeedbackTags = withProjectAuth<FeedbackTagProps['Row'][]>(
  async (user, supabase, project, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error };
    }

    // Get all feedback tags for project
    const { data: tags, error: tagsError } = await supabase
      .from('feedback_tags')
      .select()
      .eq('project_id', project!.id);

    // Check for errors
    if (tagsError) {
      return { data: null, error: { message: tagsError.message, status: 500 } };
    }

    // Return tags
    return { data: tags, error: null };
  }
);
