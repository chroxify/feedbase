'use client';

import { ChevronsUpDownIcon, GlobeIcon, Plus } from 'lucide-react';
import { Button } from 'ui/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'ui/components/ui/dropdown-menu';
import { useState } from 'react';
import AddProjectDialog from '@/components/dashboard/modals/add-project-modal';
import { ProjectProps } from '@/lib/types';
import { Skeleton } from 'ui/components/ui/skeleton';
import Link from 'next/link';
import { cn } from '@/lib/utils';

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
        <Button variant='outline' className={cn('h-9 w-full justify-between p-1', className)}>
          <div className='flex flex-row items-center justify-start gap-2'>
            <div className='flex flex-row items-center justify-center rounded-sm bg-accent p-[6px]'>
              <GlobeIcon className='h-4 w-4 text-foreground/70' />
            </div>
            {/* While selected project is null (incase of unexpected error), show skeleton */}
            <span className='text-sm font-normal'>
              {selectedProject ? selectedProject.name : <Skeleton className='h-4 w-20' />}
            </span>
          </div>
          <ChevronsUpDownIcon className='h-4 w-4 text-foreground/70' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className={cn('w-[200px] justify-between', className)}>
        {projects.map((project, index) => (
          <Link href={`/${project.slug}`} key={index}>
            <DropdownMenuItem
              onSelect={() => setSelectedProject(project)}
              className='flex flex-row items-center gap-2'>
              <GlobeIcon className='h-4 w-4 text-foreground/70' />
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
              <div className='flex flex-row items-center gap-2'>
                <Plus className='h-4 w-4 text-foreground/70' />
                New Project
              </div>
            </DropdownMenuItem>
          }
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
