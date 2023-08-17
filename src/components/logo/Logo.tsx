import { CheckCircledIcon } from '@radix-ui/react-icons';

export const Logo = ({ size = 30 }) => {
  return (
    <div className='flex items-center gap-2'>
      <span className='bg-primary w-fit p-2 rounded-md'>
        <CheckCircledIcon height={size} width={size} />
      </span>
      <span className='font-bold text-lg'>Taskify</span>
    </div>
  );
};
