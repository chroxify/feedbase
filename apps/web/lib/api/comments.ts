import { withFeedbackAuth } from '../auth';
import { FeedbackCommentProps } from '../types';

// Create comment for feedback by id
export const createCommentForFeedbackById = (
  data: FeedbackCommentProps['Insert'],
  projectSlug: string,
  cType: 'server' | 'route'
) =>
  withFeedbackAuth<FeedbackCommentProps['Row']>(async (user, supabase, feedback, project, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error };
    }

    // Create comment
    const { data: comment, error: commentError } = await supabase
      .from('feedback_comments')
      .insert({
        feedback_id: data.feedback_id,
        user_id: user!.id,
        content: data.content,
      })
      .select()
      .single();

    // Check for errors
    if (commentError) {
      return { data: null, error: { message: commentError.message, status: 500 } };
    }

    // Return comment
    return { data: comment, error: null };
  })(data.feedback_id, projectSlug, cType);

// Get comments for feedback by id
export const getCommentsForFeedbackById = (id: string, projectSlug: string, cType: 'server' | 'route') =>
  withFeedbackAuth<FeedbackCommentProps['Row'][]>(async (user, supabase, feedback, project, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error };
    }

    // Get comments
    const { data: comments, error: commentsError } = await supabase
      .from('feedback_comments')
      .select('*, user:user_id (*)')
      .eq('feedback_id', feedback!.id);

    // Check for errors
    if (commentsError) {
      return { data: null, error: { message: commentsError.message, status: 500 } };
    }

    // Return comments
    return { data: comments, error: null };
  })(id, projectSlug, cType);
