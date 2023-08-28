import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Logo } from '@/components/logo/Logo';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  EyeClosedIcon,
  EyeOpenIcon,
  LockClosedIcon,
} from '@radix-ui/react-icons';
import { useCallback, useState } from 'react';
import { Connection } from 'electron/db/types/connection';
import { useToast } from '@/components/ui/use-toast';
import useConfig from '@/hooks/useConfig';

export const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [config, setConfig] = useState<Connection | null>(null);
  const [formData, setFormData] = useState<Connection>({
    port: 3306,
    database: '',
    host: '',
    password: '',
    user: '',
  });

  const handleConfigChange = useCallback((config: Connection) => {
    console.log('config change effect ran');
    setConfig(config);
    setFormData(config);
  }, []);

  useConfig(handleConfigChange);
  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const res = await window.electron.ipcRenderer.invoke('connect', formData);
    if (res.success) {
      console.log(res);
      localStorage.setItem('config', JSON.stringify(formData));
      navigate('/');
      toast({
        title: 'Connected to database',
        description:
          'You are now connected to your database ' + formData.database,
      });

      const connection = await window.electron.ipcRenderer.invoke(
        'get:connection'
      );
      setConfig(connection);
    } else {
      console.log(res);
      toast({
        title: 'Failed to connect to database',
        description: res.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className='h-[80vh] flex justify-center items-center flex-col'>
      <form
        className='p-10 border rounded-xl flex flex-col gap-4 max-w-xl mx-auto bg-foreground/5 w-full'
        onSubmit={handleSignIn}
      >
        <div className='form-info flex flex-col gap-2 text-center'>
          <Logo />
          <div className='my-8'>
            <div className='flex gap-1 items-start justify-center'>
              <span>
                <LockClosedIcon className='inline-block h-6 w-6' />
              </span>
              <h1 className='text-2xl font-bold mb-2'>
                Connect Your MySQL Database
              </h1>
            </div>
            <p className='text-foreground/40 text-xs'>
              Your database credentials are stored locally on your machine.
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
              value={formData.password || ''}
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
        <div className='form-footer'>
          <div className='flex justify-between items-center'>
            {config && (
              <Button variant='outline' onClick={() => navigate('/')}>
                Keep Current Config
              </Button>
            )}
            <Button
              type='submit'
              disabled={config?.database === formData.database}
            >
              Connect
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
