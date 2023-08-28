import { Logo } from '@/components/logo/Logo';
import { ThemeSelect } from '@/components/themeToggle/ThemeSelect';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { GearIcon } from '@radix-ui/react-icons';
import { SystemInfo } from 'electron/db/app/appListeners';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const DashboardHeader = () => {
  const navigate = useNavigate();
  const [systemInfo, setSystemInfo] = useState<SystemInfo>(
    JSON.parse(localStorage.getItem('systemInfo') || '{}')
  );

  useEffect(() => {
    console.log('systemInfo effect ran');
    if (!systemInfo.hostname) {
      window.electron.systemInfo.get().then((res) => {
        localStorage.setItem('systemInfo', JSON.stringify(res));
        setSystemInfo(res);
      });
    }
  }, [systemInfo]);

  return (
    <header className='border-b  h-[5rem] flex flex-col justify-center'>
      <div className='flex justify-between items-center px-4'>
        <Logo />
        <Popover>
          <PopoverTrigger>
            <Avatar>
              <AvatarFallback>{systemInfo?.user?.charAt(0)}</AvatarFallback>
            </Avatar>
          </PopoverTrigger>
          <PopoverContent className='shadow-lg'>
            <div className='flex flex-col'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-foreground'>{systemInfo?.user}</p>
                </div>
                <ThemeSelect />
              </div>
              <Separator />
              <div className='flex items-baseline justify-between'>
                <p className='text-xs text-foreground/30'>Platform:</p>
                <p className='text-xs text-foreground/50'>
                  {systemInfo?.platform}
                </p>
              </div>
              <div className='flex items-baseline justify-between'>
                <p className='text-xs text-foreground/30'>OS:</p>
                <p className='text-xs text-foreground/50'>{systemInfo?.type}</p>
              </div>
              <Button onClick={() => navigate('/login')}>
                <GearIcon className='w-4 h-4 mr-2' />
                Change config
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
};
