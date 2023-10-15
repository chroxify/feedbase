import { withProjectAuth } from '@/lib/auth';
import { ChangelogWithAuthorProps } from '@/lib/types';

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
