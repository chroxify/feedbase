import { withFeedbackAuth, withProjectAuth } from '../auth';
import { FeedbackProps, FeedbackTagProps, FeedbackWithUserInputProps, FeedbackWithUserProps } from '../types';

// Create a feedback post
export const createFeedback = (
  projectSlug: string,
  data: FeedbackWithUserInputProps,
  cType: 'server' | 'route'
) =>
  withProjectAuth<FeedbackProps['Row']>(async (user, supabase, project, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error: error };
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

    // Insert feedback
    const { data: feedback, error: feedbackError } = await supabase
      .from('feedback')
      .insert({
        title: data.title,
        description: data.description,
        status: data.status,
        raw_tags: data.raw_tags,
        project_id: project!.id,
        user_id: user!.id,
      })
      .select()
      .single();

    // Check for errors
    if (feedbackError) {
      return { data: null, error: { message: feedbackError.message, status: 500 } };
    }

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
      return { data: null, error: error };
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

    // Update feedback
    const { data: updatedFeedback, error: updatedFeedbackError } = await supabase
      .from('feedback')
      .update({
        title: data.title ? data.title : feedback!.title,
        description: data.description ? data.description : feedback!.description,
        status: data.status ? data.status : feedback!.status,
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
      return { data: null, error: error };
    }

    // Convert feedback to unknown type and then to test type
    const feedbackData = feedback as unknown as FeedbackWithUserProps;

    // Convert raw tags to tags
    feedbackData.tags = feedbackData.raw_tags as unknown as FeedbackTagProps['Row'][];

    // Return feedback
    return { data: feedbackData, error: null };
  }
);

// Delete a feedback post
export const deleteFeedbackByID = withFeedbackAuth<FeedbackProps['Row']>(
  async (user, supabase, feedback, project, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error: error };
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

// Upvote feedback by ID
export const upvoteFeedbackByID = withFeedbackAuth<FeedbackProps['Row']>(
  async (user, supabase, feedback, project, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error: error };
    }

    // Update feedback
    const { data: updatedFeedback, error: updatedFeedbackError } = await supabase
      .from('feedback')
      .update({
        upvotes: feedback!.upvotes + 1,
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
  }
);

// Get all feedback posts
export const getAllProjectFeedback = withProjectAuth<FeedbackWithUserProps[]>(
  async (user, supabase, project, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error: error };
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

    // Convert raw tags to tags
    feedbackData.forEach((feedback) => {
      feedback.tags = feedback.raw_tags as unknown as FeedbackTagProps['Row'][];
    });

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
      return { data: null, error: error };
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
      return { data: null, error: error };
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
      .eq('id', tag!.id)
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
      return { data: null, error: error };
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
