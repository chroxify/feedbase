import { Database } from '@/lib/supabase';

// DB Types
export type ProjectProps = Database['public']['Tables']['projects'];

export type TeamMemberProps = Database['public']['Tables']['profiles']['Row'] & {
  joined_at: string;
};

export type ChangelogProps = Database['public']['Tables']['changelogs'];

export type ProfileProps = Database['public']['Tables']['profiles'];

// Helper Types
export interface ErrorProps {
  message: string;
  status: number;
}

// Incase error is null, data won't be and vice versa
export type ApiResponse<T, E extends ErrorProps | null = ErrorProps | null> = Promise<
  E extends null ? { data: T; error: null } : { data: null; error: E }
>;

export interface NavbarTabProps {
  name: string;
  icon: {
    dark: Record<string, unknown> | string;
    light: Record<string, unknown> | string;
  };
  slug: string;
}

export interface CategoryTabProps {
  name: string;
  slug: string;
}
