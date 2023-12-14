import { redirect } from 'next/navigation';
import { formatRootUrl } from '@/lib/utils';

export default function Docs() {
  redirect(formatRootUrl('docs'));
}
