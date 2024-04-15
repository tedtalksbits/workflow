import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
export const AuthMenu = () => {
  const { user, logout } = useAuth();
  const [, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  async function handleToggleDarkTheme() {
    console.log('toggle dark theme');
    const isDarkMode = await window.electron.theme.toggle();
    console.log('isDarkMode', isDarkMode);
    setTheme(isDarkMode ? 'dark' : 'light');
  }
  const handleLogout = () => {
    logout(() => {
      console.log('Sign out');
    });
  };
  return (
    <div>
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar className='border'>
              <AvatarImage src={user.avatar} alt='@shadcn' />
              <AvatarFallback>
                {user.firstName[0] + user.lastName[0]}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Hello, {user.firstName}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuItem>Team</DropdownMenuItem>
            <DropdownMenuItem onClick={handleToggleDarkTheme}>
              Change theme
            </DropdownMenuItem>
            <DropdownMenuItem className='cursor-pointer' onClick={handleLogout}>
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Link to='/login'>
          <Button variant='outline'>Log In</Button>
        </Link>
      )}
    </div>
  );
};
