import { redirect } from 'next/navigation';

export default function Deploy() {
  redirect(
    'https://vercel.com/new/clone?repository-url=https://github.com/chroxify/luminar&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY,NEXT_PUBLIC_ROOT_DOMAIN&project-name=Luminar&repo-name=luminar'
  );
}
