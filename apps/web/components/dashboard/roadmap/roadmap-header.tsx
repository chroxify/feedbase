import { Button } from '@feedbase/ui/components/button';
import { SortAsc } from 'lucide-react';
import { FilterCombobox } from '../feedback/filter-combobox';

export default function RoadmapHeader() {
  return (
    <div className='flex h-[52px] w-full flex-row items-center justify-between px-5 pt-5'>
      <h2 className='text-2xl font-medium'>Roadmap</h2>

      <div className='flex items-center gap-2'>
        {/* Sort Button */}
        <Button
          variant='outline'
          className='text-secondary-foreground hover:text-foreground flex items-center gap-1'>
          <SortAsc className='h-4 w-4' />
          Sort
        </Button>

        {/* Filter Combobox */}
        <FilterCombobox />
      </div>
    </div>
  );
}
