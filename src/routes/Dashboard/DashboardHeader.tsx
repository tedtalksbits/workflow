import { Logo } from '@/components/logo/Logo';
import { ThemeSelect } from '@/components/themeToggle/ThemeSelect';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { signOutWithGoogle } from '@/firebase';
import { useAuth } from '@/hooks/useAuth';
import { ExitIcon } from '@radix-ui/react-icons';

export const DashboardHeader = () => {
  const { user } = useAuth();
  return (
    <header className='border-b  h-[5rem] flex flex-col justify-center'>
      <div className='flex justify-between items-center px-4'>
        <Logo />
        <Popover>
          <PopoverTrigger>
            <Avatar>
              <AvatarImage src={user?.photoURL} />
              <AvatarFallback>{user?.displayName?.charAt(0)}</AvatarFallback>
            </Avatar>
          </PopoverTrigger>
          <PopoverContent className='shadow-lg'>
            <div className='flex flex-col gap-8'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-foreground'>{user?.displayName}</p>
                  <p className='text-sm text-foreground/30'>{user?.email}</p>
                </div>
                <ThemeSelect />
              </div>
              <Button onClick={async () => signOutWithGoogle()}>
                <ExitIcon className='w-4 h-4 mr-2' />
                Logout
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
};
