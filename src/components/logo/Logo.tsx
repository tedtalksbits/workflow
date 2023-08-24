import { CheckCircledIcon } from '@radix-ui/react-icons';
import logo from '@/assets/logo-full.svg';

export const Logo = ({ size = 30 }) => {
  return (
    <div className='flex items-center my-2'>
      <img src={logo} alt='logo' className='w-full object-contain h-9' />
    </div>
  );
};
