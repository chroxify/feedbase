import { withFeedbackAuth } from '../auth';
import { FeedbackCommentProps, FeedbackCommentWithUserProps } from '../types';

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

    // If reply_to_id is provided, make sure comment exists
    if (data.reply_to_id) {
      const { data: replyToComment, error: replyToCommentError } = await supabase
        .from('feedback_comments')
        .select()
        .eq('id', data.reply_to_id)
        .single();

      // Check for errors
      if (replyToCommentError) {
        return { data: null, error: { message: replyToCommentError.message, status: 500 } };
      }

      // Check if comment exists
      if (!replyToComment) {
        return { data: null, error: { message: 'comment not found.', status: 404 } };
      }
    }

    // Make sure comment is not empty or just html tags
    if (data.content.replace(/<[^>]*>?/gm, '').length === 0) {
      return { data: null, error: { message: 'comment cannot be empty.', status: 400 } };
    }

    // Create comment
    const { data: comment, error: commentError } = await supabase
      .from('feedback_comments')
      .insert({
        feedback_id: data.feedback_id,
        user_id: user!.id,
        content: data.content,
        reply_to_id: data.reply_to_id,
      })
      .select()
      .single();

    // Check for errors
    if (commentError) {
      return { data: null, error: { message: commentError.message, status: 500 } };
    }

    // Increment comment count
    const { error: feedbackError } = await supabase
      .from('feedback')
      .update({ comment_count: feedback!.comment_count + 1 })
      .eq('id', feedback!.id);

    if (feedbackError) {
      return { data: null, error: { message: feedbackError.message, status: 500 } };
    }

    // Create project notification
    await supabase
      .from('notifications')
      .insert({
        type: 'comment',
        project_id: project!.id,
        initiator_id: user!.id,
        feedback_id: data.feedback_id,
        comment_id: comment.id,
      })
      .select()
      .single();

    // Return comment
    return { data: comment, error: null };
  })(data.feedback_id, projectSlug, cType);

// Get comments for feedback by id
export const getCommentsForFeedbackById = withFeedbackAuth<FeedbackCommentWithUserProps[]>(
  async (user, supabase, feedback, project, error) => {
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

    // Convert comments to FeedbackCommentWithUserProps[]
    const feedbackData = comments as unknown as FeedbackCommentWithUserProps[];

    // Get team members
    const { data: teamMembers, error: teamMembersError } = await supabase
      .from('project_members')
      .select('profiles (full_name, avatar_url), *')
      .eq('project_id', project!.id);

    if (teamMembersError) {
      return { data: null, error: { message: teamMembersError.message, status: 500 } };
    }

    // Set team members
    feedbackData.forEach((comment) => {
      comment.user.isTeamMember = teamMembers.some((member) => member.member_id === comment.user_id);
    });

    // Check if user has upvoted any comments
    if (user) {
      feedbackData.forEach((comment) => {
        if (comment.upvoters) {
          comment.has_upvoted = comment.upvoters.includes(user.id);
        }
      });
    }

    // Restructure comments to have replies as a property
    const commentsWithReplies = feedbackData.map((comment) => {
      // If comment has a reply_to_id, add it to the replies array of the comment it's replying to
      if (comment.reply_to_id) {
        const replyToComment = feedbackData.find((c) => c.id === comment.reply_to_id);

        if (replyToComment) {
          if (!replyToComment.replies) {
            replyToComment.replies = [];
          }

          // Push comment to replies array
          replyToComment.replies.push(comment);
        }

        // Return null to remove comment from commentsWithReplies array
        return null;
      }

      return comment;
    });

    // Remove null values from commentsWithReplies array
    const nonNullCommentsWithReplies: FeedbackCommentWithUserProps[] = commentsWithReplies.filter(
      (comment): comment is FeedbackCommentWithUserProps => comment !== null
    );

    // Return comments
    return { data: nonNullCommentsWithReplies, error: null };
  }
);

// Delete comment for feedback by id
export const deleteCommentForFeedbackById = (
  commentId: string,
  feedbackId: string,
  projectSlug: string,
  cType: 'server' | 'route'
) =>
  withFeedbackAuth<FeedbackCommentProps['Row']>(async (user, supabase, feedback, project, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error };
    }

    // Make sure comment exists
    const { data: comment, error: commentError } = await supabase
      .from('feedback_comments')
      .select()
      .eq('id', commentId)
      .single();

    // Check for errors
    if (commentError) {
      return { data: null, error: { message: commentError.message, status: 500 } };
    }

    // Check if comment exists
    if (!comment) {
      return { data: null, error: { message: 'comment not found.', status: 404 } };
    }

    // Make sure user is the author of the comment
    if (comment.user_id !== user!.id) {
      return { data: null, error: { message: 'only the author of the comment can delete it.', status: 403 } };
    }

    // Delete comment
    const { data: deletedComment, error: deletedCommentError } = await supabase
      .from('feedback_comments')
      .delete()
      .eq('id', commentId)
      .select()
      .single();

    // Check for errors
    if (deletedCommentError) {
      return { data: null, error: { message: deletedCommentError.message, status: 500 } };
    }

    // Decrement comment count
    const { error: feedbackError } = await supabase
      .from('feedback')
      .update({ comment_count: feedback!.comment_count - 1 })
      .eq('id', feedback!.id);

    if (feedbackError) {
      return { data: null, error: { message: feedbackError.message, status: 500 } };
    }

    // Return deletedComment
    return { data: deletedComment, error: null };
  })(feedbackId, projectSlug, cType);

// Upvote comment for feedback by id
export const upvoteCommentForFeedbackById = (
  commentId: string,
  feedbackId: string,
  projectSlug: string,
  cType: 'server' | 'route'
) =>
  withFeedbackAuth<FeedbackCommentWithUserProps>(async (user, supabase, feedback, project, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error };
    }

    // Make sure comment exists
    const { data: comment, error: commentError } = await supabase
      .from('feedback_comments')
      .select()
      .eq('id', commentId)
      .single();

    // Check for errors
    if (commentError) {
      return { data: null, error: { message: commentError.message, status: 500 } };
    }

    // Check if comment exists
    if (!comment) {
      return { data: null, error: { message: 'comment not found.', status: 404 } };
    }

    if (!comment.upvoters) {
      comment.upvoters = []; // Initialize upvoters array if it doesn't exist
    }

    const isUserUpvoted = comment.upvoters.includes(user!.id);

    const { data: updatedComment, error: updatedCommentError } = await supabase
      .from('feedback_comments')
      .update({
        upvoters: isUserUpvoted
          ? comment.upvoters.filter((upvoter) => upvoter !== user!.id)
          : comment.upvoters.concat(user!.id),
        upvotes: isUserUpvoted ? comment.upvotes - 1 : comment.upvotes + 1,
      })
      .eq('id', commentId)
      .select()
      .single();

    if (updatedCommentError) {
      return { data: null, error: { message: updatedCommentError.message, status: 500 } };
    }

    // Convert comments to FeedbackCommentWithUserProps[]
    const feedbackData = updatedComment as unknown as FeedbackCommentWithUserProps;

    // Check if user has upvoted any comments
    if (feedbackData.upvoters) {
      feedbackData.has_upvoted = feedbackData.upvoters.includes(user!.id);
    }

    // Return updatedComment
    return { data: feedbackData, error: null };
  })(feedbackId, projectSlug, cType);
