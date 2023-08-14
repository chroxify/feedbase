'use client';

import { ChevronsUpDownIcon, GlobeIcon, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';
import AddProjectDialog from '@/components/modals/add-project-modal';
import { ProjectProps } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';
import Link from 'next/link';

export default function ProjectDropdown({
  projects,
  activeProject,
}: {
  projects: ProjectProps[];
  activeProject: ProjectProps;
}) {
  const [selectedProject, setSelectedProject] = useState<ProjectProps | null>(activeProject);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' className='h-fit w-full justify-between p-1'>
          <div className='flex flex-row items-center justify-start gap-2'>
            <div className='flex flex-row items-center justify-center rounded-sm bg-accent p-[6px]'>
              <GlobeIcon className='h-4 w-4 text-foreground/60' />
            </div>
            {/* While selected project is null (incase of unexpected error), show skeleton */}
            {selectedProject ? selectedProject.name : <Skeleton className='h-4 w-20' />}
          </div>
          <ChevronsUpDownIcon className='h-4 w-4 text-foreground/60' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-[200px] justify-between'>
        {projects.map((project, index) => (
          <Link href={`/projects/${project.slug}/changelog`} key={index}>
            <DropdownMenuItem onSelect={() => setSelectedProject(project)}>{project.name}</DropdownMenuItem>
          </Link>
        ))}
        <AddProjectDialog
          trigger={
            <DropdownMenuItem
              onSelect={(event) => {
                event.preventDefault();
              }}>
              <div className='flex flex-row items-center gap-2'>
                <Plus className='h-4 w-4 text-foreground/60' />
                New Project
              </div>
            </DropdownMenuItem>
          }
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
