'use client';

import { useCallback, useState } from 'react';
import { Label } from '@radix-ui/react-label';
import { cn } from '@ui/lib/utils';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from 'ui/components/ui/alert-dialog';
import { Button } from 'ui/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from 'ui/components/ui/card';
import { Input } from 'ui/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'ui/components/ui/select';
import { ProjectProps } from '@/lib/types';
import DefaultTooltip from '@/components/shared/tooltip';

export default function GeneralConfigCards({ projectData }: { projectData: ProjectProps['Row'] }) {
  const [project, setProject] = useState<ProjectProps['Row']>(projectData);

  function handleSlugChange(event: React.ChangeEvent<HTMLInputElement>) {
    // Replace spaces with dashes
    event.target.value = event.target.value.replace(/\s+/g, '-').toLowerCase();

    setProject((prevProject) => {
      if (prevProject) {
        return {
          ...prevProject,
          slug: event.target.value,
        };
      }
      return prevProject; // Return null or the initial value if prevProject is null
    });
  }

  function handleNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    // Prevent default
    event.preventDefault();

    setProject((prevProject) => {
      if (prevProject) {
        return {
          ...prevProject,
          name: event.target.value,
        };
      }
      return prevProject; // Return null or the initial value if prevProject is null
    });
  }

  async function handleDeleteProject() {
    const promise = new Promise((resolve, reject) => {
      fetch(`/api/v1/projects/${project.slug}`, {
        method: 'DELETE',
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
      loading: 'Deleting project...',
      success: 'Project deleted successfully.',
      error: (err) => {
        return err;
      },
    });

    promise.then(() => {
      window.location.href = '/';
    });
  }

  async function handleSaveProject() {
    const promise = new Promise((resolve, reject) => {
      fetch(`/api/v1/projects/${projectData.slug}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        // Pass only the changed values
        body: JSON.stringify({
          name: project.name !== projectData.name ? project.name : undefined,
          slug: project.slug !== projectData.slug ? project.slug : undefined,
          icon: project.icon !== projectData.icon ? project.icon : undefined,
          icon_radius: project.icon_radius !== projectData.icon_radius ? project.icon_radius : undefined,
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
      // If the slug has changed, redirect to the new slug
      if (project.slug !== projectData.slug) {
        window.location.href = `/${project.slug}/settings/general`;
      } else {
        window.location.reload();
      }
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

  return (
    <>
      <Card className='flex w-full flex-col '>
        <CardHeader>
          <CardTitle>General</CardTitle>
          <CardDescription>Configure your project&apos;s general settings.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Name & Slug Config */}
          <div className='flex h-full w-full flex-col space-y-3'>
            <div className='space-y-1'>
              <Label className='text-foreground/70 text-sm font-light'>Name</Label>
              <Input className='w-full max-w-xs' value={project.name} onChange={handleNameChange} />
              <Label className='text-foreground/50 text-xs font-extralight'>
                This is the name of your project.
              </Label>
            </div>

            <div className='space-y-1'>
              <Label className='text-foreground/70 text-sm font-light'>Slug</Label>

              <div className='bg-background focus-within:ring-ring ring-offset-root flex h-9 w-full max-w-xs rounded-md border text-sm font-extralight transition-shadow duration-200 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-1'>
                <Input
                  className='h-full w-full border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0'
                  placeholder='slug'
                  value={project.slug}
                  onChange={handleSlugChange}
                />
                <div className='text-foreground/50 bg-accent select-none rounded-r-md border-l px-3 py-2'>
                  .luminar.so
                </div>
              </div>

              <Label className='text-foreground/50 text-xs font-extralight'>
                This is the subdomain of your project.
              </Label>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className='w-32'
            disabled={
              (project.name === projectData.name && project.slug === projectData.slug) ||
              !project.name ||
              !project.slug
            }
            onClick={handleSaveProject}>
            Save changes
          </Button>
        </CardFooter>
      </Card>

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
                    <p className='absolute hidden text-xs text-gray-500 group-hover:block group-hover:transition-all group-hover:duration-300 dark:text-gray-400'>
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
                      <p className='absolute text-xs text-gray-500 group-hover:hidden dark:text-gray-400'>
                        Upload
                      </p>
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
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className='w-32'
            disabled={
              (project.icon === projectData.icon && project.icon_radius === projectData.icon_radius) ||
              !project.icon ||
              !project.icon_radius
            }
            onClick={handleSaveProject}>
            Save changes
          </Button>
        </CardFooter>
      </Card>

      {/* API Access Card */}
      <Card className='flex w-full flex-col'>
        <CardHeader>
          <CardTitle>API Access</CardTitle>
          <CardDescription>Configure your project&apos;s API access.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* API Key */}
          <div className='flex h-full w-full flex-col space-y-4'>
            <div className='space-y-1'>
              <Label className='text-foreground/70 text-sm font-light'>API Key</Label>
              <div className='flex h-10 w-full flex-row space-x-2'>
                <DefaultTooltip content='API Keys are currently in early testing and will be available soon.'>
                  <Input className='w-full max-w-xs' placeholder='Coming Soon' disabled />
                </DefaultTooltip>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <Button variant='default' className='w-32' disabled>
            Generate key
          </Button>
        </CardFooter>
      </Card>

      {/* Delete Project Card */}
      <Card className='hover:border-destructive flex w-full flex-col transition-colors duration-300'>
        <CardHeader>
          <CardTitle>Danger Zone</CardTitle>
          <CardDescription>Delete your project and all of its data.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Delete Project */}
          <div className='flex h-full w-full flex-col space-y-4'>
            <div className='space-y-1'>
              <div className='flex h-10 w-full flex-row space-x-2'>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant='destructive' className='w-32'>
                      Delete project
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your project and remove all
                        your data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className='bg-destructive hover:bg-destructive/90 dark:text-foreground'
                        onClick={handleDeleteProject}>
                        Yes, delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
