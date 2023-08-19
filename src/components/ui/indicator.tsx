import { cn } from '@/lib/utils';

const Indicator = ({ className }: { className?: string }) => {
  const baseClass = 'w-2 h-2 rounded-full inline-block mr-2';
  return <span className={cn(baseClass, className)}></span>;
};

export default Indicator;
