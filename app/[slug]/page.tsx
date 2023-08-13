import { redirect } from 'next/navigation';

export default async function Hub({ params }: { params: { slug: string } }) {
  // Redirect to /app/[slug]/changelog
  redirect(`/${params.slug}/changelog`);
}
