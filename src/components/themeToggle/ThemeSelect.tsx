import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/providers/themeProvider';
import { MoonIcon, SunIcon } from '@radix-ui/react-icons';

export const ThemeSelect = () => {
  const themes = [
    { name: 'Light', value: 'light' } as const,
    { name: 'Dark', value: 'dark' } as const,
    { name: 'System', value: 'system' } as const,
  ];

  const { theme, setTheme } = useTheme();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className='ml-auto bg-foreground/10 w-10 h-10 p-2 text-foreground'>
          {theme === 'light' ? (
            <MoonIcon />
          ) : theme === 'dark' ? (
            <SunIcon />
          ) : (
            <SunIcon />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Theme</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {themes.map((themeItem) => (
          <DropdownMenuItem
            key={themeItem.value}
            onSelect={() => setTheme(themeItem.value)}
            defaultChecked={theme === themeItem.value}
          >
            {themeItem.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
