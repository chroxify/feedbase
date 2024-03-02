'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Label } from '@radix-ui/react-label';
import { cn } from '@ui/lib/utils';
import { Check, Download, Pen } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from 'ui/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from 'ui/components/ui/card';
import { Input } from 'ui/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'ui/components/ui/select';
import { Switch } from 'ui/components/ui/switch';
import { ProjectConfigWithoutSecretProps, ProjectProps } from '@/lib/types';
import FileDrop from '@/components/shared/file-drop';
import CustomizeThemeModal from '../modals/add-custom-theme-modal';

export default function HubConfigCards({
  projectData,
  projectConfigData,
}: {
  projectData: ProjectProps['Row'];
  projectConfigData: ProjectConfigWithoutSecretProps;
}) {
  const [project, setProject] = useState<ProjectProps['Row']>(projectData);
  const [projectConfig, setProjectConfig] = useState<ProjectConfigWithoutSecretProps>(projectConfigData);
  const [OGImage, setOGImage] = useState<string | null>(projectData.og_image || null);
  const router = useRouter();

  async function handleSaveProject(noToast?: boolean) {
    const promise = new Promise((resolve, reject) => {
      fetch(`/api/v1/projects/${projectData.slug}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        // Pass only the changed values
        body: JSON.stringify({
          icon: project.icon !== projectData.icon ? project.icon : undefined,
          icon_radius: project.icon_radius !== projectData.icon_radius ? project.icon_radius : undefined,
          og_image: OGImage !== projectData.og_image ? OGImage : undefined,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            reject(data.error);
          } else {
            resolve(data);
          }
        })
        .catch((err) => {
          reject(err.message);
        });
    });

    if (!noToast) {
      toast.promise(promise, {
        loading: 'Updating project...',
        success: 'Project updated successfully.',
        error: (err) => {
          return err;
        },
      });
    }

    promise.then(() => {
      router.refresh();
    });
  }

  // handle save project config
  async function handleSaveProjectConfig() {
    const promise = new Promise((resolve, reject) => {
      fetch(`/api/v1/projects/${projectData.slug}/config`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        // Pass only the changed values
        body: JSON.stringify({
          changelog_twitter_handle:
            projectConfig.changelog_twitter_handle !== projectConfigData.changelog_twitter_handle
              ? projectConfig.changelog_twitter_handle
              : undefined,
          changelog_preview_style:
            projectConfig.changelog_preview_style !== projectConfigData.changelog_preview_style
              ? projectConfig.changelog_preview_style
              : undefined,
          feedback_allow_anon_upvoting:
            projectConfig.feedback_allow_anon_upvoting !== projectConfigData.feedback_allow_anon_upvoting
              ? projectConfig.feedback_allow_anon_upvoting
              : undefined,
          custom_theme:
            projectConfig.custom_theme !== projectConfigData.custom_theme
              ? projectConfig.custom_theme
              : undefined,
          custom_theme_root:
            projectConfig.custom_theme_root !== projectConfigData.custom_theme_root
              ? projectConfig.custom_theme_root
              : undefined,
          custom_theme_primary_foreground:
            projectConfig.custom_theme_primary_foreground !==
            projectConfigData.custom_theme_primary_foreground
              ? projectConfig.custom_theme_primary_foreground
              : undefined,
          custom_theme_background:
            projectConfig.custom_theme_background !== projectConfigData.custom_theme_background
              ? projectConfig.custom_theme_background
              : undefined,
          custom_theme_secondary_background:
            projectConfig.custom_theme_secondary_background !==
            projectConfigData.custom_theme_secondary_background
              ? projectConfig.custom_theme_secondary_background
              : undefined,
          custom_theme_accent:
            projectConfig.custom_theme_accent !== projectConfigData.custom_theme_accent
              ? projectConfig.custom_theme_accent
              : undefined,
          custom_theme_border:
            projectConfig.custom_theme_border !== projectConfigData.custom_theme_border
              ? projectConfig.custom_theme_border
              : undefined,
          logo_redirect_url:
            projectConfig.logo_redirect_url !== projectConfigData.logo_redirect_url
              ? projectConfig.logo_redirect_url
              : undefined,
          changelog_enabled:
            projectConfig.changelog_enabled !== projectConfigData.changelog_enabled
              ? projectConfig.changelog_enabled
              : undefined,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            reject(data.error);
          } else {
            resolve(data);
          }
        })
        .catch((err) => {
          reject(err.message);
        });
    });

    toast.promise(promise, {
      loading: 'Updating project...',
      success: 'Project updated successfully.',
      error: (err) => {
        return err;
      },
    });

    promise.then(() => {
      router.refresh();
    });
  }

  // Handle download subscribers
  async function handleDownloadSubscribers() {
    const promise = new Promise((resolve, reject) => {
      fetch(`/api/v1/projects/${projectData.slug}/changelogs/subscribers`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => res.blob())
        .then((blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `subscribers-${projectData.slug}.csv`;
          a.click();
          resolve(true);
        })
        .catch((err) => {
          reject(err.message);
        });
    });

    toast.promise(promise, {
      loading: 'Fetching subscribers...',
      success: 'Download is ready.',
      error: (err) => {
        return err;
      },
    });
  }

  const onChangePicture = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (e: any) => {
      // setFileError(null);
      const file = e.target.files[0];
      if (file) {
        if (file.size / 1024 / 1024 > 5) {
          // setFileError('File size too big (max 5MB)');
        } else if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
          // setFileError('File type not supported.');
        } else {
          const reader = new FileReader();
          reader.onload = (e) => {
            setProject((prev) => ({ ...prev, icon: e.target?.result as string }));
          };
          reader.readAsDataURL(file);
        }
      }
    },
    [setProject]
  );

  // Set the project data to the new one (Due to data://urls)
  useEffect(() => {
    setProject((prev) => ({ ...prev, icon: projectData.icon }));
    setOGImage(projectData.og_image || null);
  }, [projectData.icon, projectData.og_image]);

  return (
    <>
      {/* Theme Card */}
      <Card className='flex w-full flex-col '>
        <CardHeader>
          <CardTitle>Branding</CardTitle>
          <CardDescription>Configure your project&apos;s branding.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Name & Slug Config */}
          <div className='flex h-full w-full flex-col space-y-3'>
            {/* Project Logo */}
            <div className='flex h-full w-full flex-col space-y-4'>
              <div className='space-y-1'>
                <Label className='text-foreground/70 text-sm font-light'>Logo</Label>

                {/* File Upload */}
                <div className='group flex h-16 w-16 items-center justify-center transition-all'>
                  <label
                    htmlFor='dropzone-file'
                    className={cn(
                      'bg-background hover:bg-background/90 group-hover:bg-background/90 flex h-full w-full cursor-pointer flex-col items-center justify-center border',
                      project.icon_radius
                    )}>
                    <p className='text-foreground/70 absolute hidden text-xs group-hover:block group-hover:transition-all group-hover:duration-300 '>
                      Upload
                    </p>
                    {/* <Image src='/favicon.ico' alt='Logo' width={40} height={40} className='h-full w-full rounded-md object-cover group-hover:opacity-0' /> */}
                    {/* TODO: Find a way to disable caching for next/image and use that */}
                    {project.icon ? (
                      <img
                        src={project.icon}
                        alt='Preview'
                        width={40}
                        height={40}
                        className={cn(
                          'h-full w-full object-cover group-hover:opacity-0',
                          project.icon_radius
                        )}
                      />
                    ) : (
                      <p className='text-foreground/70 absolute text-xs group-hover:hidden'>Upload</p>
                    )}
                    <input id='dropzone-file' type='file' className='hidden' onChange={onChangePicture} />
                  </label>
                </div>

                <Label className='text-foreground/50 text-xs font-extralight'>
                  Recommended size is 256x256.
                </Label>
              </div>
            </div>

            <div className='space-y-1'>
              <Label className='text-foreground/70 text-sm font-light'>Logo Radius</Label>
              <div className='flex h-10 w-full flex-row space-x-2'>
                <Select
                  defaultValue={project.icon_radius || 'rounded-md'}
                  onValueChange={(value) => {
                    setProject((prev) => ({ ...prev, icon_radius: value }));
                  }}>
                  <SelectTrigger className='w-[160px] text-sm font-extralight'>
                    <SelectValue placeholder='Select a radius' />
                  </SelectTrigger>
                  <SelectContent className='font-light'>
                    <SelectItem value='rounded-md'>Rounded</SelectItem>
                    <SelectItem value='rounded-none'>Square</SelectItem>
                    <SelectItem value='rounded-full'>Circle</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Label className='text-foreground/50 text-xs font-extralight'>
                This is the radius of your logo.
              </Label>
            </div>

            {/* OG Image */}
            <div className='max-w-xs space-y-1'>
              <FileDrop
                labelComponent={<Label className='text-foreground/70 text-sm font-light'>OG Image</Label>}
                image={OGImage}
                setImage={setOGImage}
              />

              <Label className='text-foreground/50 text-xs font-extralight'>
                The OG Image used when sharing your project.
              </Label>
            </div>

            {/* Theme */}
            <div className='space-y-2'>
              <Label className='text-foreground/70 text-sm font-light'>Theme</Label>
              <div className='flex h-10 w-full flex-row gap-3'>
                <Button
                  size='icon'
                  className={cn(
                    'bg-root hover:bg-root h-7 w-7 rounded-full border',
                    projectConfig.custom_theme === 'default' && 'ring-border ring-2 ring-offset-2'
                  )}
                  onClick={() => {
                    setProjectConfig((prev) => ({ ...prev, custom_theme: 'default' }));
                  }}>
                  {projectConfig.custom_theme === 'default' && (
                    <Check className='text-foreground h-3.5 w-3.5' />
                  )}
                  <span className='sr-only'>Light</span>
                </Button>

                <Button
                  size='icon'
                  className={cn(
                    'h-7 w-7 rounded-full',
                    projectConfig.custom_theme === 'light' && 'ring-foreground ring-2 ring-offset-2'
                  )}
                  onClick={() => {
                    setProjectConfig((prev) => ({ ...prev, custom_theme: 'light' }));
                  }}>
                  {projectConfig.custom_theme === 'light' && <Check className='h-3.5 w-3.5 text-black' />}
                  <span className='sr-only'>Light</span>
                </Button>

                <CustomizeThemeModal projectConfig={projectConfig} setProjectConfig={setProjectConfig}>
                  <Button
                    size='icon'
                    variant='outline'
                    className={cn(
                      'h-7 w-7 rounded-full',
                      projectConfig.custom_theme === 'custom' && 'ring-input ring-2 ring-offset-2'
                    )}>
                    <Pen className='text-foreground h-3 w-3' />
                  </Button>
                </CustomizeThemeModal>
              </div>

              <Label className='text-foreground/50 text-xs font-extralight'>
                This will only be applied to your public hub.
              </Label>

              <div className='space-y-1'>
                <Label className='text-foreground/70 text-sm font-light'>Logo Redirect Url</Label>
                <Input
                  className='w-full max-w-xs'
                  placeholder='https://example.com'
                  value={projectConfig.logo_redirect_url || ''}
                  onChange={(e) => {
                    setProjectConfig((prev) => ({ ...prev, logo_redirect_url: e.target.value }));
                  }}
                />
                <Label className='text-foreground/50 text-xs font-extralight'>
                  The url to redirect to when clicking on the logo. (Blank to disable)
                </Label>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className='w-32'
            disabled={
              (project.icon === projectData.icon || (!project.icon && !projectData.icon)) &&
              project.icon_radius === projectData.icon_radius &&
              (OGImage === projectData.og_image || (!OGImage && !projectData.og_image)) &&
              projectConfig.custom_theme === projectConfigData.custom_theme &&
              projectConfig.custom_theme_root === projectConfigData.custom_theme_root &&
              projectConfig.custom_theme_primary_foreground ===
                projectConfigData.custom_theme_primary_foreground &&
              projectConfig.custom_theme_background === projectConfigData.custom_theme_background &&
              projectConfig.custom_theme_secondary_background ===
                projectConfigData.custom_theme_secondary_background &&
              projectConfig.custom_theme_accent === projectConfigData.custom_theme_accent &&
              projectConfig.custom_theme_border === projectConfigData.custom_theme_border &&
              projectConfig.logo_redirect_url === projectConfigData.logo_redirect_url
            }
            onClick={() => {
              // If both changed, save both
              if (
                !(
                  (project.icon === projectData.icon || (!project.icon && !projectData.icon)) &&
                  project.icon_radius === projectData.icon_radius &&
                  (OGImage === projectData.og_image || (!OGImage && !projectData.og_image))
                ) &&
                !(
                  projectConfig.custom_theme === projectConfigData.custom_theme &&
                  projectConfig.custom_theme_root === projectConfigData.custom_theme_root &&
                  projectConfig.custom_theme_primary_foreground ===
                    projectConfigData.custom_theme_primary_foreground &&
                  projectConfig.custom_theme_background === projectConfigData.custom_theme_background &&
                  projectConfig.custom_theme_secondary_background ===
                    projectConfigData.custom_theme_secondary_background &&
                  projectConfig.custom_theme_accent === projectConfigData.custom_theme_accent &&
                  projectConfig.custom_theme_border === projectConfigData.custom_theme_border &&
                  projectConfig.logo_redirect_url === projectConfigData.logo_redirect_url
                )
              ) {
                handleSaveProjectConfig();
                handleSaveProject(true);
                return;
              }

              // If only theme changed, save only the theme
              if (
                (project.icon === projectData.icon || (!project.icon && !projectData.icon)) &&
                project.icon_radius === projectData.icon_radius &&
                (OGImage === projectData.og_image || (!OGImage && !projectData.og_image))
              ) {
                handleSaveProjectConfig();
              } else {
                // If only project changed, save only the project
                handleSaveProject();
              }
            }}>
            Save changes
          </Button>
        </CardFooter>
      </Card>

      {/* Changelog */}
      <Card className='flex w-full flex-col '>
        <CardHeader className='flex flex-row items-center justify-between space-y-0'>
          <div className='flex flex-col gap-1.5'>
            <CardTitle>Changelog</CardTitle>
            <CardDescription>Configure your project&apos;s changelog.</CardDescription>
          </div>

          <div className='flex flex-row items-center gap-2'>
            <Label
              className={cn(
                'text-sm font-light',
                projectConfig.changelog_enabled ? 'text-text-foreground' : 'text-muted-foreground'
              )}>
              {projectConfig.changelog_enabled ? 'Enabled' : 'Disabled'}
            </Label>
            <Switch
              checked={projectConfig.changelog_enabled}
              onCheckedChange={() => {
                setProjectConfig((prev) => ({ ...prev, changelog_enabled: !prev.changelog_enabled }));
              }}
            />
          </div>
        </CardHeader>
        <CardContent className='flex flex-col space-y-4'>
          {/* Name & Slug Config */}
          <div className='flex h-full w-full flex-col space-y-3'>
            <div className='space-y-1'>
              <Label className='text-foreground/70 text-sm font-light'>Twitter</Label>
              <div
                className={cn(
                  'bg-background focus-within:ring-ring ring-offset-root flex h-9 w-full max-w-xs rounded-md border text-sm font-extralight transition-shadow duration-200 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-1',
                  !projectConfig.changelog_enabled && 'opacity-50'
                )}>
                <div className='text-foreground/50 bg-accent flex select-none items-center justify-center rounded-l-md border-r px-3'>
                  @
                </div>
                <Input
                  className='h-full w-full border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0'
                  placeholder='username'
                  disabled={!projectConfig.changelog_enabled}
                  value={projectConfig.changelog_twitter_handle || ''}
                  onChange={(e) => {
                    setProjectConfig((prev) => ({ ...prev, changelog_twitter_handle: e.target.value }));
                  }}
                />
              </div>
              <Label className='text-foreground/50 text-xs font-extralight'>
                Twitter handle linked in your changelog. (Blank to disable)
              </Label>
            </div>
          </div>

          {/* Preview Style */}
          <div className='space-y-1'>
            <Label className='text-foreground/70 text-sm font-light'>Preview Style</Label>
            <div className='flex h-10 w-full flex-row space-x-2'>
              <Select
                disabled={!projectConfig.changelog_enabled}
                defaultValue={projectConfig.changelog_preview_style || 'rounded-md'}
                onValueChange={(value) => {
                  // Set the value
                  setProjectConfig((prev) => ({ ...prev, changelog_preview_style: value }));
                }}>
                <SelectTrigger className='max-w-xs text-sm font-extralight'>
                  <SelectValue placeholder='Select a style' />
                </SelectTrigger>
                <SelectContent className='font-light'>
                  <SelectItem value='summary'>Summary</SelectItem>
                  <SelectItem value='content'>Content</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Label className='text-foreground/50 text-xs font-extralight'>
              Whether to show summary or content as preview.
            </Label>
          </div>

          {/* Download Email Audience */}
          <div className='flex flex-col space-y-1'>
            <Label className='text-foreground/70 text-sm font-light'>Email Subscribers</Label>
            <Button
              variant='outline'
              className='text-foreground/70 w-[160px] font-light'
              onClick={handleDownloadSubscribers}>
              <Download className='mr-2 h-4 w-4' />
              Download List
            </Button>
            <Label className='text-foreground/50 text-xs font-extralight'>
              Download a list of your changelog audience.
            </Label>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className='w-32'
            disabled={
              // If the values are the same as the ones in the database or if they are empty
              projectConfig.changelog_preview_style === projectConfigData.changelog_preview_style &&
              projectConfig.changelog_twitter_handle === projectConfigData.changelog_twitter_handle &&
              projectConfig.changelog_enabled === projectConfigData.changelog_enabled
            }
            onClick={handleSaveProjectConfig}>
            Save changes
          </Button>
        </CardFooter>
      </Card>

      {/* Feedback */}
      <Card className='flex w-full flex-col '>
        <CardHeader>
          <CardTitle>Feedback</CardTitle>
          <CardDescription>Configure your project&apos;s feedback.</CardDescription>
        </CardHeader>
        <CardContent className='flex flex-col space-y-4'>
          {/* Anonymous Feedback */}
          <div className='space-y-1'>
            <Label className='text-foreground/70 text-sm font-light'>Anonymous Feedback Upvoting</Label>
            <div className='flex h-10 w-full flex-row space-x-2'>
              <Select
                defaultValue={projectConfig.feedback_allow_anon_upvoting ? 'true' : 'false'}
                onValueChange={(value) => {
                  // Set the value
                  setProjectConfig((prev) => ({ ...prev, feedback_allow_anon_upvoting: value === 'true' }));
                }}>
                <SelectTrigger className='max-w-xs text-sm font-extralight'>
                  <SelectValue placeholder='Select a style' />
                </SelectTrigger>
                <SelectContent className='font-light'>
                  <SelectItem value='true'>Enabled</SelectItem>
                  <SelectItem value='false'>Disabled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Label className='text-foreground/50 text-xs font-extralight'>
              Whether to allow anonymous feedback upvoting.
            </Label>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className='w-32'
            disabled={
              // If the values are the same as the ones in the database or if they are empty
              projectConfig.feedback_allow_anon_upvoting === projectConfigData.feedback_allow_anon_upvoting
            }
            onClick={handleSaveProjectConfig}>
            Save changes
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
