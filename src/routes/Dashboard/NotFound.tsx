import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { HomeIcon } from 'lucide-react';
export const NotFound = () => {
  return (
    <PageLayout>
      <section className='flex flex-col items-center justify-center min-h-screen text-center bg-gradient-to-b from-background  to-primary/10'>
        <div className='flex flex-col items-center justify-center h-full space-y-4'>
          <div className='text-3xl font-bold leading-loose'>404</div>
          <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdly4Nzp_inu5eS1vWaNVUd3h9MBs9RiLmzjDebmkqnQ&s' />
          <div className='text-lg font-medium'>
            Oops! The page you're looking for doesn't exist.
          </div>
          <div className='flex gap-4'>
            <Button
              onClick={() => {
                window.location.assign('/');
              }}
            >
              <HomeIcon className='h-4 w-4 mr-2' /> Go home
            </Button>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};
