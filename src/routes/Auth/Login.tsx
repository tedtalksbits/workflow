import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Logo } from '@/components/logo/Logo';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { EyeClosedIcon, EyeOpenIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
import { Connection } from 'electron/db/connection';

export const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<Connection>({
    port: 3306,
    database: 'test',
    host: 'localhost',
    password: '',
    user: 'root',
  });
  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await window.electron.ipcRenderer.invoke('connect', formData);
      if (res) {
        console.log(res);
      }
    } catch (error) {
      console.log(error);
      alert('uh oh! Not able to login');
    }
  };
  function handleGetUsersTest(): void {
    window.electron.ipcRenderer.invoke('get:users').then((result) => {
      console.log(result);
    });
  }

  return (
    <div className='h-[80vh] flex justify-center items-center flex-col'>
      <form
        className='p-10 border rounded-xl flex flex-col gap-4 max-w-xl mx-auto bg-foreground/5 w-full'
        onSubmit={handleSignIn}
      >
        <div className='form-info flex flex-col gap-2 text-center'>
          <Logo />
          <div className='mb-4'>
            <h1 className='text-2xl font-bold mb-2'>
              Connect Your MySQL Database
            </h1>
            <p className='text-foreground/40 text-xs'>
              Your database credentials are stored locally on your machine and
              never sent to our servers.
            </p>
          </div>
        </div>
        <Separator />

        <div className='flex flex-row items-center justify-between gap-2'>
          <div className='form-group flex-1'>
            <Label htmlFor='hostname'>Hostname</Label>
            <Input
              required
              type='hostname'
              id='hostname'
              value={formData.host}
              onChange={(e) =>
                setFormData({ ...formData, host: e.target.value })
              }
            />
          </div>
          <div className='form-group'>
            <Label htmlFor='port'>Port</Label>
            <Input
              required
              type='port'
              id='port'
              value={formData.port}
              onChange={(e) => {
                setFormData({ ...formData, port: parseInt(e.target.value) });
              }}
            />
          </div>
        </div>
        <div className='form-group'>
          <Label htmlFor='user'>User</Label>
          <Input
            required
            type='user'
            id='user'
            value={formData.user}
            onChange={(e) => {
              setFormData({ ...formData, user: e.target.value });
            }}
          />
        </div>
        <div className='form-group'>
          <Label htmlFor='password'>Password</Label>
          <div className='password relative'>
            <Input
              required
              type={showPassword ? 'text' : 'password'}
              id='password'
              placeholder='your password'
              value={formData.password}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
              }}
            />
            <label
              className='password-toggle absolute right-0 top-0 bottom-0 flex items-center justify-center w-10 h-10 text-foreground/50'
              htmlFor='password-toggle'
              aria-label='Show password as plain text. Warning: this will display your password on the screen.'
            >
              {showPassword ? (
                <EyeClosedIcon onClick={() => setShowPassword(!showPassword)} />
              ) : (
                <EyeOpenIcon onClick={() => setShowPassword(!showPassword)} />
              )}
            </label>
          </div>
        </div>
        <div className='form-group'>
          <Label htmlFor='database'>Database</Label>
          <Input
            required
            type='text'
            id='database'
            placeholder='your schema'
            value={formData.database}
            onChange={(e) => {
              setFormData({ ...formData, database: e.target.value });
            }}
          />
        </div>
        <Button type='submit' className='w-fit mx-auto'>
          Connect
        </Button>
      </form>
      <Button onClick={handleGetUsersTest}>get users test</Button>
    </div>
  );
};
