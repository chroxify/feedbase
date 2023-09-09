import { redirect } from 'next/navigation';

export default async function Hub({ params }: { params: { slug: string } }) {
  // Redirect to changelog
  redirect(`/changelog`);
}
