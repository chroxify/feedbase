import { redirect } from 'next/navigation';
import { formatRootUrl } from '@/lib/utils';

export default function Demo() {
  redirect(formatRootUrl('hub'));
}
