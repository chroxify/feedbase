'use client';

import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@feedbase/ui/components/avatar';
import { Button } from '@feedbase/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@feedbase/ui/components/dropdown-menu';
import { Input } from '@feedbase/ui/components/input';
import { Label } from '@feedbase/ui/components/label';
import { Skeleton } from '@feedbase/ui/components/skeleton';
import { cn } from '@feedbase/ui/lib/utils';
import { ChevronsUpDownIcon } from 'lucide-react';
import useProjectConfig from '@/lib/swr/use-project-config';
import { ProjectConfigWithoutSecretProps } from '@/lib/types';
import SettingsCard from '@/components/dashboard/settings/settings-card';
import FetchError from '@/components/shared/fetch-error';
import FileDrop from '@/components/shared/file-drop';
import InputGroup from '@/components/shared/input-group';

export default function GeneralSettings({ params }: { params: { slug: string } }) {
  const { projectConfig: projectConfigData, isValidating, error, mutate } = useProjectConfig();
  const [projectConfig, setProjectConfig] = useState<ProjectConfigWithoutSecretProps | undefined>(
    projectConfigData
  );

  useEffect(() => {
    setProjectConfig(projectConfigData);
  }, [projectConfigData]);

  if (error) {
    return <FetchError error={error} mutate={mutate} isValidating={isValidating} />;
  }

  if (isValidating || !projectConfig) {
    return (
      <>
        <SettingsCard title='Branding' description='Customize your project branding.'>
          <Skeleton className='col-span-2 h-96 w-full' />
        </SettingsCard>
        <SettingsCard title='Theme' description='Customize your project theme.' className='grid-cols-3'>
          <Skeleton className='h-44 w-full' />
          <Skeleton className='h-44 w-full' />
          <Skeleton className='h-44 w-full' />
        </SettingsCard>
        <SettingsCard title='Danger Zone' description='Permanently delete your project.'>
          <Skeleton className='col-span-2 h-32 w-full' />
        </SettingsCard>
      </>
    );
  }

  if (projectConfig) {
    return (
      <>
        <SettingsCard title='Branding' description='Customize your project branding.'>
          <div className='-mt-1 w-full space-y-1'>
            <Label className='text-foreground/70 text-sm'>Name</Label>
            <Input
              className='w-full'
              value={projectConfig?.project.name}
              onChange={(e) =>
                { setProjectConfig({
                  ...projectConfig,
                  project: {
                    ...projectConfig.project,
                    name: e.target.value,
                  },
                }); }
              }
            />
            <Label className='text-muted-foreground text-xs'>This is the name of your project.</Label>
          </div>

          <div className='-mt-1 w-full space-y-1'>
            <Label className='text-foreground/70 text-sm '>Slug</Label>

            <InputGroup
              value={projectConfig?.project.slug}
              onChange={(e) => {
                setProjectConfig({
                  ...projectConfig,
                  project: {
                    ...projectConfig.project,
                    slug: e.target.value,
                  },
                });
              }}
              suffix={`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`}
              placeholder='feedbase'
            />

            <Label className='text-muted-foreground text-xs'>This is the subdomain of your project.</Label>
          </div>

          {/* Project Logo */}
          <div className='col-span-1 flex h-full w-full flex-col gap-1'>
            <Label className='text-foreground/70 text-sm '>Logo</Label>

            {/* File Upload */}
            <div className='flex items-center gap-2.5'>
              <Avatar className={cn('h-12 w-12 hover:cursor-pointer', projectConfig?.project_icon_radius)}>
                <AvatarImage src={projectConfig?.project_icon || ''} alt={projectConfig?.project.name} />
                <AvatarFallback className={cn('select-none text-sm', projectConfig?.project_icon_radius)}>
                  {projectConfig?.project.name[0]}
                </AvatarFallback>
              </Avatar>
              <div className='flex flex-col gap-1'>
                <div className='flex gap-1'>
                  <Button variant='secondary' size='sm' className='w-fit'>
                    Upload
                  </Button>
                  {projectConfig?.project_icon ? <Button variant='destructive' size='sm' className='w-fit'>
                      Remove
                    </Button> : null}
                </div>
                <Label className='text-muted-foreground text-xs'>Recommended size is 256x256.</Label>
              </div>
            </div>
          </div>

          <div className='flex h-full w-full flex-col items-start space-y-1'>
            <Label className='text-foreground/70 text-sm '>Radius</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline' className='w-fit font-normal'>
                  {projectConfig?.project_icon_radius === 'rounded-md'
                    ? 'Rounded'
                    : projectConfig?.project_icon_radius === 'rounded-full'
                    ? 'Circle'
                    : 'Square'}
                  <ChevronsUpDownIcon className='text-secondary-foreground ml-2 h-3.5 w-3.5' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='start'>
                <DropdownMenuItem
                  onClick={() =>
                    { setProjectConfig({
                      ...projectConfig,
                      project_icon_radius: 'rounded-md',
                    }); }
                  }>
                  Rounded
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    { setProjectConfig({
                      ...projectConfig,
                      project_icon_radius: 'rounded-full',
                    }); }
                  }>
                  Circle
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    { setProjectConfig({
                      ...projectConfig,
                      project_icon_radius: 'rounded-none',
                    }); }
                  }>
                  Square
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Label className='text-muted-foreground text-xs'>This is the radius of your project.</Label>
          </div>

          <div className='col-span-1 -mt-1 w-full space-y-1'>
            <Label className='text-foreground/70 text-sm '>Redirect URL</Label>
            <Input
              className='w-full'
              value={projectConfig?.logo_redirect_url || ''}
              onChange={(e) => {
                setProjectConfig({
                  ...projectConfig,
                  logo_redirect_url: e.target.value,
                });
              }}
              placeholder='Leave blank to use default'
            />
            <Label className='text-muted-foreground text-xs'>This is the redirect URL of your project.</Label>
          </div>

          {/* OG Image */}
          <div className='col-span-2 space-y-1'>
            <FileDrop
              labelComponent={<Label className='text-foreground/70 text-sm'>OG Image</Label>}
              image={null}
              setImage={(e: string | null) => {
                setProjectConfig({
                  ...projectConfig,
                  project_og_image: e,
                });
              }}
              className='h-40 w-80'
            />

            <Label className='text-foreground/50 text-xs'>The OG Image used when sharing your project.</Label>
          </div>
        </SettingsCard>

        <SettingsCard title='Theme' description='Customize your project theme.' className='grid-cols-3'>
          {/* Thanks to https://github.com/openstatushq for the inspiration of the theme previews */}
          <button
            className='flex h-full w-full flex-col items-center gap-2'
            onClick={() => { setProjectConfig({ ...projectConfig, custom_theme: 'light' }); }}
            type='button'>
            <div
              className={cn(
                'border-border/50 h-full w-full items-center rounded-md border-2 p-1',
                projectConfig.custom_theme === 'light' &&
                  'ring-ring ring-offset-root ring-2 ring-offset-2 transition-shadow'
              )}>
              <div className='space-y-2 rounded-sm bg-[#F4F4F5] p-2'>
                <div className='space-y-2  rounded-md border border-[#E5E7EB] bg-white p-2 shadow-sm'>
                  <div className='h-2 w-[80px] rounded-lg bg-[#F4F4F5]' />
                  <div className='h-2 w-[100px] rounded-lg bg-[#F4F4F5]' />
                </div>
                <div className='flex items-center  space-x-2 rounded-md border border-[#E5E7EB] bg-white p-2 shadow-sm'>
                  <div className='h-4 w-4 rounded-full bg-[#F4F4F5]' />
                  <div className='h-2 w-[100px] rounded-lg bg-[#F4F4F5]' />
                </div>
                <div className='flex items-center  space-x-2 rounded-md border border-[#E5E7EB] bg-white p-2 shadow-sm'>
                  <div className='h-4 w-4 rounded-full bg-[#F4F4F5]' />
                  <div className='h-2 w-[100px] rounded-lg bg-[#F4F4F5]' />
                </div>
              </div>
            </div>
            <span className='text-muted-foreground text-sm '>Light</span>
          </button>

          <button
            className='flex h-full w-full flex-col items-center gap-2'
            onClick={() => { setProjectConfig({ ...projectConfig, custom_theme: 'dark' }); }}
            type='button'>
            <div
              className={cn(
                'border-border/50 bg-root h-full w-full items-center rounded-md border-2 p-1',
                projectConfig.custom_theme === 'dark' &&
                  'ring-ring ring-offset-root ring-2 ring-offset-2 transition-shadow'
              )}>
              <div className='space-y-2 rounded-sm bg-[#0D0D0E] p-2'>
                <div className='space-y-2 rounded-md border border-[#2D2E34] bg-[#26272C] p-2 shadow-sm'>
                  <div className='h-2 w-[80px] rounded-lg bg-[#121416]' />
                  <div className='h-2 w-[100px] rounded-lg bg-[#121416]' />
                </div>
                <div className='flex items-center space-x-2 rounded-md border border-[#2D2E34] bg-[#26272C] p-2 shadow-sm'>
                  <div className='h-4 w-4 rounded-full bg-[#121416]' />
                  <div className='h-2 w-[100px] rounded-lg bg-[#121416]' />
                </div>
                <div className='flex items-center space-x-2 rounded-md border border-[#2D2E34] bg-[#26272C] p-2 shadow-sm'>
                  <div className='h-4 w-4 rounded-full bg-[#121416]' />
                  <div className='h-2 w-[100px] rounded-lg bg-[#121416]' />
                </div>
              </div>
            </div>
            <span className='text-muted-foreground text-sm'>Dark</span>
          </button>

          <button
            type='button'
            className='flex h-full w-full flex-col items-center gap-2'
            onClick={() => { setProjectConfig({ ...projectConfig, custom_theme: 'custom' }); }}>
            <div className='relative h-full w-full'>
              <div
                className={cn(
                  'border-border/50 bg-root items-center rounded-md border-2 p-1',
                  projectConfig.custom_theme === 'custom' &&
                    'ring-ring ring-offset-root ring-2 ring-offset-2 transition-shadow'
                )}>
                <div className='space-y-2 rounded-sm bg-[#F4F4F5] p-2'>
                  <div className='space-y-2  rounded-md border border-[#E5E7EB] bg-white p-2 shadow-sm'>
                    <div className='h-2 w-[80px] rounded-lg bg-[#F4F4F5]' />
                    <div className='h-2 w-[100px] rounded-lg bg-[#F4F4F5]' />
                  </div>
                  <div className='flex items-center  space-x-2 rounded-md border border-[#E5E7EB] bg-white p-2 shadow-sm'>
                    <div className='h-4 w-4 rounded-full bg-[#F4F4F5]' />
                    <div className='h-2 w-[100px] rounded-lg bg-[#F4F4F5]' />
                  </div>
                  <div className='flex items-center  space-x-2 rounded-md border border-[#E5E7EB] bg-white p-2 shadow-sm'>
                    <div className='h-4 w-4 rounded-full bg-[#F4F4F5]' />
                    <div className='h-2 w-[100px] rounded-lg bg-[#F4F4F5]' />
                  </div>
                </div>
              </div>
              <div
                className='absolute bottom-0 left-0 right-0 top-0'
                style={{ clipPath: 'polygon(100% 0px, 0px 0px, 100% 100%)' }}>
                <div className='border-muted bg-root items-center rounded-md border-2 p-1'>
                  <div className='space-y-2 rounded-sm bg-[#0D0D0E] p-2'>
                    <div className='space-y-2 rounded-md border border-[#2D2E34] bg-[#26272C] p-2 shadow-sm'>
                      <div className='h-2 w-[80px] rounded-lg bg-[#121416]' />
                      <div className='h-2 w-[100px] rounded-lg bg-[#121416]' />
                    </div>
                    <div className='flex items-center space-x-2 rounded-md border border-[#2D2E34] bg-[#26272C] p-2 shadow-sm'>
                      <div className='h-4 w-4 rounded-full bg-[#121416]' />
                      <div className='h-2 w-[100px] rounded-lg bg-[#121416]' />
                    </div>
                    <div className='flex items-center space-x-2 rounded-md border border-[#2D2E34] bg-[#26272C] p-2 shadow-sm'>
                      <div className='h-4 w-4 rounded-full bg-[#121416]' />
                      <div className='h-2 w-[100px] rounded-lg bg-[#121416]' />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <span className='text-muted-foreground text-sm '>System</span>
          </button>
        </SettingsCard>

        <SettingsCard title='Danger Zone' description='Permanently delete your project.'>
          <div className='-mt-1 flex w-full flex-col space-y-1'>
            <Button variant='destructive' className='w-fit'>
              Delete this Workspace
            </Button>
          </div>
        </SettingsCard>
      </>
    );
  }

  return null;
}
