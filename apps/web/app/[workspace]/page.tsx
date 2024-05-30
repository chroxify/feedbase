import { Metadata } from 'next';
import { headers } from 'next/headers';
import Link from 'next/link';
import { notFound, useRouter } from 'next/navigation';
import { Button } from '@feedbase/ui/components/button';
import { Separator } from '@feedbase/ui/components/separator';
import { Skeleton } from '@feedbase/ui/components/skeleton';
import { cn } from '@feedbase/ui/lib/utils';
import { getWorkspaceBoards } from '@/lib/api/boards';
import { getPublicWorkspaceFeedback } from '@/lib/api/public';
import { getCurrentUser } from '@/lib/api/user';
import { getWorkspaceBySlug } from '@/lib/api/workspace';
import AnalyticsWrapper from '@/components/analytics/analytics-wrapper';
import FeedbackHeader from '@/components/feedback/hub/button-header';
import FeedbackList from '@/components/feedback/hub/feedback-list-hub';

type Props = {
  params: { workspace: string };
};

// Metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Get workspace
  const { data: workspace, error } = await getWorkspaceBySlug(params.workspace, 'server', true, false);

  // If workspace is undefined redirects to 404
  if (error?.status === 404 || !workspace) {
    notFound();
  }

  return {
    title: `Feedback - ${workspace.name}`,
    description: 'Have a suggestion or found a bug? Let us know!',
  };
}

export default async function Feedback({ params }: Props) {
  const headerList = headers();
  const pathname = headerList.get('x-pathname');

  // Get current user
  const { data: user } = await getCurrentUser('server');

  const { data: feedback, error } = await getPublicWorkspaceFeedback(params.workspace, 'server', true, false);

  if (error) {
    return <div>{error.message}</div>;
  }

  // Fetch feedback boards
  const { data: boards, error: boardError } = await getWorkspaceBoards(
    params.workspace,
    'server',
    true,
    false
  );

  if (boardError) {
    return <div>{boardError.message}</div>;
  }

  // Search for the board mathing the pathname by /board/board-name format
  const currentBoard = boards.find(
    (board) => pathname?.includes(`/board/${board.name.toLowerCase().replace(/\s+/g, '-')}`)
  );

  return (
    <AnalyticsWrapper className='items-center gap-9 py-8' workspaceSlug={params.workspace}>
      {/* Title, Description */}
      <div className='flex w-full px-5 sm:px-8 lg:px-14'>
        <div className='flex w-full flex-col items-start gap-2'>
          <h1 className='font- text-xl sm:text-2xl'>Feedback</h1>
          <p className='text-secondary-foreground text-base font-normal'>
            Have a suggestion or found a bug? Let us know!
          </p>
        </div>
      </div>

      {/* Seperator */}
      <Separator className='bg-border/60' />

      <div className='flex w-full gap-8 px-5 sm:px-8 lg:px-14'>
        {/* Filter Header, Feedback List */}
        <div className='flex h-full w-full flex-col items-center justify-center'>
          <FeedbackHeader isLoggedIn={!!user} workspaceSlug={params.workspace} />

          {/* Main */}
          <div className='flex h-full w-full flex-col justify-between'>
            <FeedbackList feedback={feedback} workspaceSlug={params.workspace} isLoggedIn={!!user} />
          </div>
        </div>

        {/* Boards */}
        <div className='-mt-1 flex h-full w-fit min-w-[250px] flex-col items-start justify-start gap-2'>
          <span className='text-sm'>Boards</span>
          <div className='flex h-full w-full flex-col gap-1.5'>
            <Link href="/" passHref>
              <Button
                key='all'
                variant={currentBoard ? 'ghost' : 'outline'}
                className={cn(
                  'text-secondary-foreground w-full justify-start text-sm font-normal',
                  !currentBoard && 'text-foreground'
                )}>
                View All Boards
              </Button>
            </Link>
            {boards.map((board) => (
              <Link href={`/board/${board.name.toLowerCase().replace(/\s+/g, '-')}`} passHref key={board.id}>
                <Button
                  variant={currentBoard?.id === board.id ? 'outline' : 'ghost'}
                  className={cn(
                    'text-secondary-foreground w-full justify-start text-sm font-normal',
                    currentBoard?.id === board.id && 'text-foreground'
                  )}>
                  {board.name}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AnalyticsWrapper>
  );
}
