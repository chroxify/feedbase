'use client';

import { useState } from 'react';
import Link from 'next/link';
import { cn } from '@ui/lib/utils';
import { ChevronsUpDownIcon, GlobeIcon, Plus } from 'lucide-react';
import { Button } from 'ui/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'ui/components/ui/dropdown-menu';
import { Skeleton } from 'ui/components/ui/skeleton';
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
        <Button variant='outline' className={cn('h-9 w-full justify-between p-1', className)}>
          <div className='flex flex-row items-center justify-start gap-2'>
            <div className='bg-accent flex flex-row items-center justify-center rounded-sm p-[6px]'>
              <GlobeIcon className='text-foreground/70 h-4 w-4' />
            </div>
            {/* While selected project is null (incase of unexpected error), show skeleton */}
            <span className='text-sm font-normal'>
              {selectedProject ? selectedProject.name : <Skeleton className='h-4 w-20' />}
            </span>
          </div>
          <ChevronsUpDownIcon className='text-foreground/70 h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className={cn('w-[200px] justify-between', className)}>
        {projects.map((project, index) => (
          <Link href={`/${project.slug}`} key={project.id}>
            <DropdownMenuItem
              onSelect={() => {
                setSelectedProject(project);
              }}
              className='flex flex-row items-center gap-2'>
              <GlobeIcon className='text-foreground/70 h-4 w-4' />
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
