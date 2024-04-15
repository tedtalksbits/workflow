import React, { useState } from 'react';
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
import { Link, useNavigate } from 'react-router-dom';
import { EyeClosedIcon, EyeOpenIcon } from '@radix-ui/react-icons';
import { toast } from 'sonner';
export const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    const newUser = {
      firstName: data.firstName as string,
      lastName: data.lastName as string,
      username: data.username as string,
      email: data.email as string,
      password: data.password as string,
    };
    console.log('data', data);
    console.log('new user', newUser);
    const res = await window.electron.user.signUp(newUser);
    console.log('res', res);

    if (!res.success) {
      return toast.error('Registration failed!', {
        description: res.message as string,
      });
    }

    toast.success('Registration successful!');
    navigate('/login');
  };
  return (
    <form onSubmit={handleRegister}>
      <Card className='max-w-xl mx-auto mt-[200px]'>
        <CardHeader>
          <CardTitle className='text-2xl'>Register</CardTitle>
          <CardDescription>
            Enter your information to create an account.
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex items-center justify-between gap-8'>
            <div className='space-y-2 w-full'>
              <Label htmlFor='firstName'>First Name</Label>
              <Input
                name='firstName'
                id='firstName'
                placeholder='eg. John'
                required
                type='text'
              />
            </div>
            <div className='space-y-2 w-full'>
              <Label htmlFor='lastName'>Last Name</Label>
              <Input
                name='lastName'
                id='lastName'
                placeholder='eg. Gotti'
                required
                type='text'
              />
            </div>
          </div>
          <div className='space-y-2'>
            <Label htmlFor='username'>Username</Label>
            <Input
              name='username'
              id='username'
              placeholder='eg. jgotti'
              required
              type='text'
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='email'>Email</Label>
            <Input
              name='email'
              id='email'
              placeholder='eg. jgotti@mail.com'
              required
              type='text'
            />
          </div>
          <div className='space-y-2 relative'>
            <Label htmlFor='password'>Password</Label>
            <div className='relative'>
              <Input
                name='password'
                id='password'
                required
                type={showPassword ? 'text' : 'password'}
                placeholder='make it a good one'
                onKeyUp={(e) => {
                  const input = e.currentTarget;
                  const value = input.value;
                  const strength = value.length;
                  const strengthIndicator = document.querySelector(
                    '#password-strength'
                  ) as HTMLDivElement;
                  const strengthText = document.querySelector(
                    '#password-strength-text'
                  ) as HTMLParagraphElement;

                  if (strengthIndicator) {
                    strengthIndicator.style.width = `${Math.min(
                      strength * 10,
                      100
                    )}%`;
                  }

                  if (strengthText) {
                    strengthText.textContent = `${Math.min(
                      strength * 10,
                      100
                    )}%`;
                  }
                  if (strength === 0) {
                    strengthIndicator.style.width = `0%`;
                    strengthText.textContent = ``;
                  }

                  if (e.getModifierState('CapsLock')) {
                    console.log('caps lock is on');
                    e.currentTarget.setCustomValidity('Caps lock is on.');
                    e.currentTarget.reportValidity();
                  } else {
                    e.currentTarget.setCustomValidity('');
                  }
                }}
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
              <div className=''>
                <div
                  id='password-strength'
                  className='absolute h-1 w-0 bg-primary rounded-xl top-0'
                ></div>
                <p
                  id='password-strength-text'
                  className='text-xs text-primary '
                ></p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className='flex flex-col'>
          <Button type='submit' className='w-full'>
            Register
          </Button>
          <div className='mt-8 w-full flex gap-2'>
            <p className='text-foreground/70'>Already have an account?</p>
            <Link className='text-primary' to='/login'>
              Login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </form>
  );
};
