import RoadmapBoard from '@/components/dashboard/roadmap/roadmap-board';
import RoadmapHeader from '@/components/dashboard/roadmap/roadmap-header';

export default async function Roadmap() {
  return (
    <div className='flex h-full w-full flex-col'>
      {/* Header */}
      <RoadmapHeader />

      {/* Board */}
      <RoadmapBoard />
    </div>
  );
}
