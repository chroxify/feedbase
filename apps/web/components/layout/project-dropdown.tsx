'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@feedbase/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@feedbase/ui/components/dropdown-menu';
import { Skeleton } from '@feedbase/ui/components/skeleton';
import { cn } from '@feedbase/ui/lib/utils';
import { ChevronsUpDownIcon, GlobeIcon, Plus } from 'lucide-react';
import { ProjectProps } from '@/lib/types';
import AddProjectDialog from '@/components/dashboard/modals/add-project-modal';

export default function ProjectDropdown({
  projects,
  activeProject,
  className,
}: {
  projects: ProjectProps['Row'][];
  activeProject: ProjectProps['Row'] | null;
  className?: string;
}) {
  const [selectedProject, setSelectedProject] = useState<ProjectProps['Row'] | null>(activeProject);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className={cn('group w-full justify-between rounded-lg p-1', className)}>
          <div className='flex flex-row items-center justify-start gap-2'>
            {activeProject?.icon ? (
              <div className='ml-[2px] flex items-center justify-center'>
                <Image
                  src={activeProject.icon}
                  width={22}
                  height={22}
                  className='rounded-sm'
                  alt='Project Icon'
                />
              </div>
            ) : (
              <div className='flex flex-row items-center justify-center p-[6px]'>
                <GlobeIcon className='text-foreground/70 h-4 w-4' />
              </div>
            )}
            {/* While selected project is null (incase of unexpected error), show skeleton */}
            <span className='text-sm'>
              {selectedProject ? selectedProject.name : <Skeleton className='h-4 w-20' />}
            </span>
          </div>
          <ChevronsUpDownIcon className='text-muted-foreground group-hover:text-foreground h-3.5 w-3.5 transition-colors' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className={cn('w-[200px] justify-between', className)} align='start'>
        {projects.map((project) => (
          <Link href={`/${project.slug}`} key={project.id}>
            <DropdownMenuItem
              onSelect={() => {
                setSelectedProject(project);
              }}
              className='flex flex-row items-center gap-2'>
              {project.icon ? (
                <Image src={project.icon} width={22} height={22} className='rounded-sm' alt='Project Icon' />
              ) : (
                <div className='flex items-center justify-center rounded-sm px-[3.5px]'>
                  <GlobeIcon className='text-foreground/70 h-4 w-4' />
                </div>
              )}
              {project.name}
            </DropdownMenuItem>
          </Link>
        ))}
        <AddProjectDialog
          trigger={
            <DropdownMenuItem
              onSelect={(event) => {
                event.preventDefault();
              }}>
              <div className='flex flex-row items-center gap-3 pl-[3.5px]'>
                <Plus className='text-foreground/70 h-4 w-4' />
                New Project
              </div>
            </DropdownMenuItem>
          }
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
