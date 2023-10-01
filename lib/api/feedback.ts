import { withFeedbackAuth, withProjectAuth } from '../auth';
import { FeedbackProps, FeedbackWithUserProps, ProfileProps } from '../types';

// Create a feedback post
export const createFeedback = (
  projectSlug: string,
  data: FeedbackProps['Insert'],
  cType: 'server' | 'route'
) =>
  withProjectAuth<FeedbackProps['Row']>(async (user, supabase, project, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error: error };
    }

    // Insert feedback
    const { data: feedback, error: feedbackError } = await supabase
      .from('feedback')
      .insert({
        title: data.title,
        description: data.description,
        status: data.status,
        tags: data.tags,
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
  data: FeedbackProps['Update'],
  cType: 'server' | 'route'
) =>
  withFeedbackAuth<FeedbackProps['Row']>(async (user, supabase, feedback, project, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error: error };
    }

    // Update feedback
    const { data: updatedFeedback, error: updatedFeedbackError } = await supabase
      .from('feedback')
      .update({
        title: data.title,
        description: data.description,
        status: data.status,
        tags: data.tags,
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
export const getFeedbackByID = withFeedbackAuth<FeedbackProps['Row']>(
  async (user, supabase, feedback, project, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error: error };
    }

    // Return feedback
    return { data: feedback!, error: null };
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

    // Return feedback
    return { data: feedbackData, error: null };
  }
);
