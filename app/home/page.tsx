import { Background } from '@/components/ui/background/background';
import HomeContent from '@/components/home/home-content';

export default function Landing() {
  return (
    <Background>
      <div
        className={
          'flex h-full w-full flex-col items-center selection:bg-teal-700/20 selection:text-teal-400'
        }>
        <div className='flex h-full w-full flex-col items-center p-5 sm:p-10 lg:max-w-screen-xl'>
          <HomeContent />
        </div>
      </div>
    </Background>
  );
}
