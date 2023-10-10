'use client';

import { Button } from 'ui/components/ui/button';
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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from 'ui/components/ui/card';
import { Input } from 'ui/components/ui/input';
import { Label } from '@radix-ui/react-label';
import { toast } from 'sonner';
import { useState } from 'react';
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
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(project),
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
              <Label className='text-sm font-light text-foreground/70'>Name</Label>
              <div className='flex h-10 w-full flex-row space-x-2'>
                <Input className='w-full max-w-xs' value={project.name} onChange={handleNameChange} />
              </div>
            </div>

            <div className='space-y-1'>
              <Label className='text-sm font-light text-foreground/70'>Slug</Label>

              <div className='flex h-10 w-full flex-row space-x-2'>
                <Input className='w-full max-w-xs' value={project.slug} onChange={handleSlugChange} />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          {/* <Separator className='w-full' /> */}
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
              <Label className='text-sm font-light text-foreground/70'>API Key</Label>
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
      <Card className='flex w-full flex-col transition-colors duration-300 hover:border-destructive'>
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
