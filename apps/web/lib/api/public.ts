import { withProjectAuth } from '@/lib/auth';
import { ChangelogProps } from '@/lib/types';

// Get Public Project Changelogs
export const getPublicProjectChangelogs = withProjectAuth<ChangelogProps['Row'][]>(
  async (user, supabase, project, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error: error };
    }

    // Get Changelogs
    const { data: changelogs, error: changelogsError } = await supabase
      .from('changelogs')
      .select()
      .eq('project_id', project!.id)
      .eq('published', true);

    // Check for errors
    if (changelogsError) {
      return { data: null, error: { message: changelogsError.message, status: 500 } };
    }

    // Return changelogs
    return { data: changelogs, error: null };
  }
);
