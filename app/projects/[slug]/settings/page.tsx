import { redirect } from 'next/navigation';

export default async function Dashboard({ params }: { params: { slug: string } }) {
  // Redirect to settings/general
  redirect(`/projects/${params.slug}/settings/general`);
}
