import { Icons } from '@/components/shared/icons/icons-static';
import { cn } from '@/lib/utils';

export default function LogoProvider({ className }: { className?: string }) {
  return <Icons.LogoText className={cn('fill-foreground', className)} />;
}
