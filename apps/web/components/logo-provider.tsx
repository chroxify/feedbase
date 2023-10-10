import { cn } from '@/lib/utils';
import { Icons } from '@/components/shared/icons/icons-static';

export default function LogoProvider({ className }: { className?: string }) {
  return <Icons.LogoText className={cn('fill-foreground', className)} />;
}
