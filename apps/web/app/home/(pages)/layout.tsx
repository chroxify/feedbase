import HomeNav from '@/components/home/header';

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className='bg-root z-10 flex min-h-screen w-full flex-col items-center justify-center selection:bg-[#8F9EFF]/20 selection:text-[#8F9EFF]'>
      <HomeNav />

      {children}
    </main>
  );
}
