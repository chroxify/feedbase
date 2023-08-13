export interface ProjectProps {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
}

export interface ProfileProps {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string;
  created_at: string;
}

export interface ErrorProps {
  message: string;
  status: number;
}

export interface ChangelogProps {
  id: string;
  projectId: string;
  title: string;
  content: string;
  image: string | null;
  summary: string;
  publish_date: Date | undefined;
  published: boolean;
}
