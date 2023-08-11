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
