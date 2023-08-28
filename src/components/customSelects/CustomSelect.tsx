import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Indicator from '../ui/indicator';

type CustomSelectProps<T extends string | number> = {
  options: T[];
  selected: T;
  onChange?: (selected: T) => void;
  indicatorColors?: Record<T, string>;
};

export const CustomSelect = <T extends string | number>({
  options,
  selected,
  onChange,
  indicatorColors,
}: CustomSelectProps<T>) => {
  const handleOptionClick = (option: T) => {
    if (option === selected) return;
    onChange && onChange(option);
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='outline-none '>
        <div
          className={
            indicatorColors?.[selected] +
            ' px-2 py-[.15rem] rounded-full text-[.7rem] border-none whitespace-nowrap'
          }
        >
          <Indicator className={indicatorColors?.[selected]} />
          {selected}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {options.map((option) => (
          <DropdownMenuItem
            key={option}
            onClick={() => handleOptionClick(option)}
            className={`${option === selected && indicatorColors?.[option]}`}
          >
            <Indicator className={indicatorColors?.[option]} />

            <span>{option}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
