import { Input } from '@/components/ui/input';
import { Project } from '@/types/projects';
import { useEffect, useRef, useState } from 'react';
import { ProjectUpdate } from './ProjectUpdate';
import { dayjsUtils } from '@/utils/dayjs';
import { Kdb } from '@/components/ui/kdb';
import { useShortcuts } from '@/hooks/useShortcuts';
import { SystemInfo } from 'electron/db/app/appListeners';
import { Dialogs } from '../Dashboard';
type NavbarProps = {
  projects: Project[];
  onSelectProjectId: (projectId: number) => void;
  setProjects: (projects: Project[]) => void;
  selectedProjectId: number | null;
};

export const ProjectsList = ({
  projects,
  setProjects,
  onSelectProjectId,
  selectedProjectId,
}: NavbarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [systemInfo] = useState<SystemInfo>(
    JSON.parse(localStorage.getItem('systemInfo') || '{}')
  );
  useEffect(() => {
    window.electron.projects.get().then((res) => {
      setProjects(res);
    });
  }, [setProjects]);

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const isMac = systemInfo.platform === 'darwin';
  const handleNewSearchShortcut = (e: KeyboardEvent) => {
    if (e.key === 'j' && (isMac ? e.metaKey : e.ctrlKey)) {
      e.preventDefault();
      searchInputRef.current?.focus();
    }
  };

  useShortcuts(handleNewSearchShortcut);

  return (
    <>
      <div className='px-2 my-4 relative'>
        <Input
          placeholder='Search projects'
          className='peer'
          onChange={(e) => setSearchQuery(e.target.value)}
          disabled={projects.length === 0}
          ref={searchInputRef}
        />

        <Kdb className='peer-active:hidden peer-focus-within:hidden peer-focus:hidden absolute right-3 top-2 flex items-center justify-center bg-foreground/10'>
          {isMac ? '⌘' : 'ctrl'}+j
        </Kdb>
      </div>
      <ul className='mt-4'>
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className={`${
              selectedProjectId === project.id
                ? 'bg-primary/20 hover:bg-primary border-primary/100 '
                : ''
            } cursor-pointer hover:bg-primary/10 flex items-center justify-between border-l-4 border-primary/0 transition-all group/nav-item`}
          >
            <li
              onClick={() => onSelectProjectId(project.id)}
              className='py-2 px-4 flex-1'
            >
              <div>{project.name}</div>
              <div className='text-xs text-foreground/40'>
                {dayjsUtils.timeFromNow(project.updatedAt.toString())}
              </div>
            </li>
            <div className='pr-4 py-2 opacity-0 group-hover/nav-item:opacity-100 transition-opacity duration-300 ease-in-out'>
              <ProjectUpdate project={project} onMutate={setProjects} />
            </div>
          </div>
        ))}
      </ul>
    </>
  );
};
