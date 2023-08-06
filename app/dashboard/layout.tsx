import LogoProvider from '@/components/logo-provider';
import Sidebar from '@/components/sidebar';

export default function DashLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className='flex min-h-screen min-w-full justify-center bg-muted'>
      <div className='flex h-screen w-full flex-col items-center p-5 lg:max-w-screen-xl'>
        {/* Header with logo */}
        <LogoProvider />
        <div className='flex h-full w-full flex-row justify-start gap-10'>
          {/* Sidebar */}
          <Sidebar />

          {/* Main content */}
          <div className='flex h-full w-full flex-col items-start justify-start'>{children}</div>
        </div>
      </div>
    </main>
  );
}
