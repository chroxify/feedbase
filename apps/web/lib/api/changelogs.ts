import { decode } from 'base64-arraybuffer';
import { withProjectAuth } from '@/lib/auth';
import { ChangelogProps, ChangelogWithAuthorProps } from '@/lib/types';
import { isSlugValid } from '../utils';

// Create Changelog
export const createChangelog = (slug: string, data: ChangelogProps['Insert'], cType: 'server' | 'route') =>
  withProjectAuth<ChangelogProps['Row']>(async (user, supabase, project, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error };
    }

    // If theres an image, upload it
    if (data.image) {
      // Create unique image path
      const imagePath = `${project!.slug}/${Math.random().toString(36).substring(7)}`;

      const { error: uploadError } = await supabase.storage
        .from('changelog-images')
        // project.slug/randomstring
        .upload(imagePath, decode(data.image.replace(/^data:image\/\w+;base64,/, '')), {
          contentType: 'image/png',
        });

      // Check for errors
      if (uploadError) {
        return { data: null, error: { message: uploadError.message, status: 500 } };
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage.from('changelog-images').getPublicUrl(imagePath);

      // Check for errors
      if (!publicUrlData) {
        return { data: null, error: { message: 'issue uploading image', status: 500 } };
      }

      // Set image to public URL
      data.image = publicUrlData.publicUrl;
    }

    // Convert title to slug
    if (data.title && !isSlugValid(data.title)) {
      // Remove invalid characters
      data.slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9 ]/g, '')
        .replace(/ /g, '-');
    }

    // Create Changelog
    const { data: changelog, error: changelogError } = await supabase
      .from('changelogs')
      .insert({
        project_id: project!.id,
        slug: data.slug,
        author_id: user!.id,
        title: data.title,
        summary: data.summary,
        content: data.content,
        image: data.image,
        publish_date: data.publish_date,
        published: data.published,
      })
      .select();

    // Check for errors
    if (changelogError) {
      return { data: null, error: { message: changelogError.message, status: 500 } };
    }

    // Return project
    return { data: changelog[0], error: null };
  })(slug, cType);

// Get All Project Changelogs
export const getAllProjectChangelogs = withProjectAuth<ChangelogWithAuthorProps[]>(
  async (user, supabase, project, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error };
    }

    // Get Changelogs
    const { data: changelogs, error: changelogsError } = await supabase
      .from('changelogs')
      .select('*, profiles (*)')
      .eq('project_id', project!.id);

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
          id: changelog.profiles?.id,
          email: changelog.profiles?.email,
          full_name: changelog.profiles?.full_name,
          avatar_url: changelog.profiles?.avatar_url,
        },
      };
    }) as ChangelogWithAuthorProps[];

    // Return changelogs
    return { data: restructuredData, error: null };
  }
);

// Get Changelog by ID
export const getChangelogByID = (id: string, slug: string, cType: 'server' | 'route') =>
  withProjectAuth<ChangelogWithAuthorProps>(async (user, supabase, project, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error };
    }

    // Get Changelog
    const { data: changelog, error: changelogError } = await supabase
      .from('changelogs')
      .select('*, profiles (*)')
      .eq('id', id)
      .single();

    // Check for errors
    if (changelogError) {
      return { data: null, error: { message: changelogError.message, status: 500 } };
    }

    // Destructure profiles from changelog
    const { profiles, ...restOfChangelog } = changelog;

    // Restructure data
    const restructuredData = {
      ...restOfChangelog,
      author: {
        id: changelog.profiles?.id,
        email: changelog.profiles?.email,
        full_name: changelog.profiles?.full_name,
        avatar_url: changelog.profiles?.avatar_url,
      },
    } as ChangelogWithAuthorProps;

    // Return changelog
    return { data: restructuredData, error: null };
  })(slug, cType);

// Update Changelog
export const updateChangelog = (
  id: string,
  slug: string,
  data: ChangelogProps['Update'],
  cType: 'server' | 'route'
) =>
  withProjectAuth<ChangelogProps['Row']>(async (user, supabase, project, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error };
    }

    // If theres an image, which is a base64 string, upload it
    if (data.image && data.image.startsWith('data:image/')) {
      // Create unique image path
      const imagePath = `${project!.slug}/${Math.random().toString(36).substring(7)}`;

      const { error: uploadError } = await supabase.storage
        .from('changelog-images')
        .upload(imagePath, decode(data.image.replace(/^data:image\/\w+;base64,/, '')), {
          contentType: 'image/png',
        });

      // Check for errors
      if (uploadError) {
        return { data: null, error: { message: uploadError.message, status: 500 } };
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage.from('changelog-images').getPublicUrl(imagePath);

      // Check for errors
      if (!publicUrlData) {
        return { data: null, error: { message: 'issue uploading image', status: 500 } };
      }

      // Set image to public URL
      data.image = publicUrlData.publicUrl;
    }

    // Convert title to slug
    if (data.title && !isSlugValid(data.title)) {
      // Remove invalid characters
      data.slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9 ]/g, '')
        .replace(/ /g, '-');
    }

    // Update Changelog
    const { data: changelog, error: changelogError } = await supabase
      .from('changelogs')
      .update({
        title: data.title,
        slug: data.slug,
        summary: data.summary,
        content: data.content,
        image: data.image,
        publish_date: data.publish_date,
        published: data.published,
      })
      .eq('id', id)
      .select();

    // Check for errors
    if (changelogError) {
      return { data: null, error: { message: changelogError.message, status: 500 } };
    } else if (!changelog || changelog.length === 0) {
      return { data: null, error: { message: 'changelog not found', status: 404 } };
    }

    // Return changelog
    return { data: changelog[0], error: null };
  })(slug, cType);

// Delete Changelog by ID
export const deleteChangelog = (id: string, slug: string, cType: 'server' | 'route') =>
  withProjectAuth<ChangelogProps['Row']>(async (user, supabase, project, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error };
    }

    // Delete Changelog
    const { data: deletedChangelog, error: changelogError } = await supabase
      .from('changelogs')
      .delete()
      .eq('id', id)
      .select();

    // Check for errors
    if (changelogError) {
      return { data: null, error: { message: changelogError.message, status: 500 } };
    } else if (!deletedChangelog || deletedChangelog.length === 0) {
      return { data: null, error: { message: 'changelog not found', status: 404 } };
    }

    // Return changelog
    return { data: deletedChangelog[0], error: null };
  })(slug, cType);
