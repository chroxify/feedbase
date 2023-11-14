'use client';

import { useState } from 'react';
import { MoreVertical } from 'lucide-react';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from 'ui/components/ui/avatar';
import { Button } from 'ui/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'ui/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'ui/components/ui/dropdown-menu';
import { ProjectConfigProps } from '@/lib/types';
import DiscordIntegrationModal from '@/components/dashboard/modals/add-edit-discord-modal';
import DefaultTooltip from '@/components/shared/tooltip';

export default function IntegrationCards({
  projectConfig,
  projectSlug,
}: {
  projectConfig: ProjectConfigProps['Row'];
  projectSlug: string;
}) {
  const [enabledIntegrations, setEnabledIntegrations] = useState<string[]>(
    projectConfig.integration_discord_status ? ['discord'] : []
  );

  async function disconnectIntegration(integration: string) {
    const promise = new Promise((resolve, reject) => {
      fetch(`/api/v1/projects/${projectSlug}/config/integrations/${integration}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: false,
        }),
      }).then((res) => {
        if (res.status === 200) {
          resolve(res.json());
        } else {
          reject(res.json());
        }
      });
    });

    toast.promise(promise, {
      loading: 'Disconnecting integration...',
      success: () => {
        setEnabledIntegrations(enabledIntegrations.filter((i) => i !== integration));
        return 'Integration disconnected.';
      },
      error: 'Failed to disconnect integration.',
    });
  }

  return (
    <div className='flex h-full w-full flex-col space-y-6 overflow-y-auto'>
      <Card className='flex w-full flex-col'>
        <CardHeader>
          <CardTitle>Integrations</CardTitle>
          <CardDescription>Configure your project&apos;s integrations.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Gird 2x2 */}
          <div className='grid grid-cols-2 gap-4'>
            {/* Discord */}
            <div className='col-span-2 flex h-full w-full flex-col rounded-md border sm:col-span-1'>
              <div className='flex flex-row items-center space-x-2 border-b p-4'>
                {/* Avatar */}
                <Avatar>
                  <AvatarImage
                    src='data:image/jpeg;base64,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'
                    alt='discord'
                  />
                  <AvatarFallback>DC</AvatarFallback>
                </Avatar>

                {/* Name and Description */}
                <div className='flex flex-col'>
                  <span className='text-foreground/70 text-sm'>Discord</span>

                  <span className='text-foreground/50 text-xs font-light'>
                    Receive notification directly in your Discord server.
                  </span>
                </div>
              </div>

              <div className='flex flex-row items-center justify-between px-5 py-4'>
                <div className='flex flex-col'>
                  <span className='text-foreground/50 text-xs'>Status</span>
                  {enabledIntegrations.includes('discord') ? (
                    <span className='text-foreground/70 cursor-default text-sm font-light text-green-500'>
                      Connected
                    </span>
                  ) : (
                    <span className='text-foreground/70 cursor-default text-sm font-light'>Disabled</span>
                  )}
                </div>

                {enabledIntegrations.includes('discord') ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant='secondary'
                        size='icon'
                        className='text-foreground/50 hover:text-foreground h-8 w-5'>
                        <MoreVertical className='h-5 w-5' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      {/* TODO: Implement configure option wihtout having to disconnect */}
                      {/* <DropdownMenuItem>
                                Configure
                            </DropdownMenuItem> */}
                      <DropdownMenuItem
                        className='text-destructive focus:text-destructive/90'
                        onSelect={() => {
                          disconnectIntegration('discord');
                        }}>
                        Disconnect
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <DiscordIntegrationModal
                    projectSlug={projectSlug}
                    enabledIntegrations={enabledIntegrations}
                    setEnabledIntegrations={setEnabledIntegrations}
                  />
                )}
              </div>
            </div>

            {/* Github */}
            <div className='col-span-2 flex h-full w-full flex-col rounded-md border sm:col-span-1'>
              <div className='flex flex-row items-center space-x-2 border-b p-4'>
                {/* Avatar */}
                <Avatar>
                  <AvatarImage src='https://github.com/github.png' alt='github' />
                  <AvatarFallback>GH</AvatarFallback>
                </Avatar>

                {/* Name and Description */}
                <div className='flex flex-col'>
                  <span className='text-foreground/70 text-sm'>Github</span>

                  <span className='text-foreground/50 text-xs font-light'>
                    Automate Changelogs, Roadmaps and more with Github.
                  </span>
                </div>
              </div>

              <div className='flex flex-row items-center justify-between px-5 py-4'>
                <div className='flex flex-col'>
                  <span className='text-foreground/50 text-xs'>Status</span>

                  <DefaultTooltip content='This integration is currently still in active development.'>
                    <span className='text-foreground/70 cursor-pointer text-sm'>Coming Soon</span>
                  </DefaultTooltip>
                </div>

                <Button variant='outline' disabled>
                  Connect
                </Button>
              </div>
            </div>

            {/* Linear */}
            <div className='col-span-2 flex h-full w-full flex-col rounded-md border sm:col-span-1'>
              <div className='flex flex-row items-center space-x-2 border-b p-4'>
                {/* Avatar */}
                <Avatar>
                  <AvatarImage src='https://github.com/linear.png' alt='github' />
                  <AvatarFallback>LN</AvatarFallback>
                </Avatar>

                {/* Name and Description */}
                <div className='flex flex-col'>
                  <span className='text-foreground/70 text-sm'>Linear</span>

                  <span className='text-foreground/50 text-xs font-light'>
                    Connect Roadmap, Changelogs, Issues and more.
                  </span>
                </div>
              </div>

              <div className='flex flex-row items-center justify-between px-5 py-4'>
                <div className='flex flex-col'>
                  <span className='text-foreground/50 text-xs'>Status</span>

                  <DefaultTooltip content='This integration is currently still in active development.'>
                    <span className='text-foreground/70 cursor-pointer text-sm'>Coming Soon</span>
                  </DefaultTooltip>
                </div>
                <Button variant='outline' disabled>
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
