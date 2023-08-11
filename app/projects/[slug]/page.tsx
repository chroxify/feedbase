import { redirect } from 'next/navigation';

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  // Redirect to changelog
  redirect(`/projects/${params.slug}/changelog`);
}
