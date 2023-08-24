import logo from '@/assets/icon-full.svg';

export const Logo = () => {
  return (
    <div className='flex items-center my-2'>
      <img src={logo} alt='logo' className='w-full object-contain h-9' />
    </div>
  );
};
