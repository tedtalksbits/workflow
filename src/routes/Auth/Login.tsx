import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EyeClosedIcon, EyeOpenIcon } from '@radix-ui/react-icons';
import React, { useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { LocationState } from '@/types/react-router-dom';
import { toast } from 'sonner';
export const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;
  const from = state?.from;
  const pwRef = useRef<HTMLInputElement>(null);
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    const credentials = {
      username: data.username as string,
      password: data.password as string,
    };

    console.log(credentials);
    login(credentials, (res) => {
      console.log(res);
      if (res.success) {
        toast.success('Login successful!');
        navigate(from ? from.pathname : '/dashboard');
      } else {
        toast.error('Login failed!', {
          description: res.message as string,
        });
        pwRef.current && pwRef.current.focus();
      }
    });
  };
  return (
    <form onSubmit={handleLogin}>
      <Card className='max-w-xl mx-auto mt-[200px] overflow-hidden'>
        {from && (
          <div className='bg-foreground/10 p-2'>
            <p className='text-foreground/70'>
              You must log in to view the page at {from.pathname}
            </p>
          </div>
        )}
        <CardHeader>
          <CardTitle className='text-2xl'>Login</CardTitle>
          <CardDescription>
            Enter your username and password to login to your account.
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='username'>Username</Label>
            <Input
              name='username'
              id='username'
              placeholder='Enter your username'
              required
              type='text'
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='password'>Password</Label>
            <div className='relative'>
              <Input
                name='password'
                id='password'
                required
                type={showPassword ? 'text' : 'password'}
                ref={pwRef}
              />
              <Label
                className='password-toggle absolute right-0 top-0 bottom-0 flex items-center justify-center w-10 h-10 cursor-pointer text-foreground/50'
                htmlFor='password-toggle'
                aria-label='Show password as plain text. Warning: this will display your password on the screen.'
              >
                {showPassword ? (
                  <EyeClosedIcon
                    onClick={() => setShowPassword(!showPassword)}
                  />
                ) : (
                  <EyeOpenIcon onClick={() => setShowPassword(!showPassword)} />
                )}
              </Label>
            </div>
          </div>
        </CardContent>
        <CardFooter className='flex flex-col'>
          <Button type='submit' className='w-full'>
            Login
          </Button>
          <div className='mt-8 w-full flex gap-2'>
            <p className='text-foreground/70'>Don't have an account?</p>
            <Link
              className='text-primary'
              to='/register'
              state={{ request: 'register' }}
            >
              Register
            </Link>
          </div>
        </CardFooter>
      </Card>
    </form>
  );
};
