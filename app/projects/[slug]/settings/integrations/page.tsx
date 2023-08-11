import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function IntegrationsSettings() {
  return (
    <div className='flex h-full w-full flex-col space-y-6 overflow-y-auto'>
      <Card className='flex w-full flex-col border-none'>
        <CardHeader>
          <CardTitle>Integrations</CardTitle>
          <CardDescription>Configure your project&apos;s integrations.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Gird 2x2 */}
          <div className='grid grid-cols-2 gap-4'>
            <div className='flex h-full w-full flex-col rounded-md border '>
              <div className='flex flex-row items-center space-x-2 border-b p-4'>
                {/* Avatar */}
                <Avatar>
                  <AvatarImage src='https://github.com/github.png' alt='github' />
                  <AvatarFallback>GH</AvatarFallback>
                </Avatar>

                {/* Name and Description */}
                <div className='flex flex-col'>
                  <span className='text-sm font-semibold text-foreground/70'>Github</span>

                  <span className='text-xs font-semibold text-foreground/50'>
                    Automate Changelogs, Roadmaps and more with Github.
                  </span>
                </div>
              </div>

              <div className='flex flex-row items-center justify-between px-5 py-4'>
                <div className='flex flex-col'>
                  <span className='text-xs font-semibold text-foreground/50'>Status</span>

                  <TooltipProvider delayDuration={300}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className='cursor-pointer text-sm font-semibold text-foreground/70'>
                          Coming Soon
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <span className='text-xs font-semibold text-foreground/50'>
                          This integration is currently still in active development.
                        </span>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <Button variant='outline' size='sm' disabled>
                  Connect
                </Button>
              </div>
            </div>

            <div className='flex h-full w-full flex-col rounded-md border '>
              <div className='flex flex-row items-center space-x-2 border-b p-4'>
                {/* Avatar */}
                <Avatar>
                  <AvatarImage src='https://github.com/linear.png' alt='github' />
                  <AvatarFallback>LN</AvatarFallback>
                </Avatar>

                {/* Name and Description */}
                <div className='flex flex-col'>
                  <span className='text-sm font-semibold text-foreground/70'>Linear</span>

                  <span className='text-xs font-semibold text-foreground/50'>
                    Connect Roadmap, Changelogs, Issues and more.
                  </span>
                </div>
              </div>

              <div className='flex flex-row items-center justify-between px-5 py-4'>
                <div className='flex flex-col'>
                  <span className='text-xs font-semibold text-foreground/50'>Status</span>

                  <TooltipProvider delayDuration={300}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className='cursor-pointer text-sm font-semibold text-foreground/70'>
                          Coming Soon
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <span className='text-xs font-semibold text-foreground/50'>
                          This integration is currently still in active development.
                        </span>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Button variant='outline' size='sm' disabled>
                  Connect
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
