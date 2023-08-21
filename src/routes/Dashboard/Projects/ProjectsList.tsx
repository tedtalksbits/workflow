import { FileTextIcon } from '@radix-ui/react-icons';
import { Input } from '@/components/ui/input';
import { Project } from '@/types/projects';
import { NewProjectDialog } from './NewProject';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ProjectUpdate } from './ProjectUpdate';
import { GetProjectsProps, projectApi } from './api/project';
import { dayjsUtils } from '@/utils/dayjs';
type NavbarProps = {
  projects: Project[];
  onSelectProjectId: (projectId: string) => void;
  setProjects: (projects: Project[]) => void;
  selectedProjectId: string | null;
};

export const ProjectsList = ({
  projects,
  setProjects,
  onSelectProjectId,
  selectedProjectId,
}: NavbarProps) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  useEffect(() => {
    if (!user) {
      throw new Error('User not found');
    }
    const getProjectsRequest: GetProjectsProps = {
      user,
      onError: () => console.log('error'),
      onSuccess: (projects) => {
        setProjects(projects);
      },
    };
    projectApi.getProjects(getProjectsRequest);
  }, [user, setProjects]);

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <div className='projects-container'>
      <header className='border-b  h-[5rem] flex flex-col justify-center'>
        <div className='flex item-center justify-between px-4'>
          <h2 className='text-xl font-bold  flex items-center gap-2'>
            <FileTextIcon className='w-5 h-5' />
            Projects
          </h2>
          <NewProjectDialog />
        </div>
      </header>
      <div className='px-2 my-4'>
        <Input
          placeholder='Search projects'
          className='p-6'
          onChange={(e) => setSearchQuery(e.target.value)}
        />
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
                {dayjsUtils.timeFromNow(project.updatedAt)}
              </div>
            </li>
            <div className='pr-4 py-2 opacity-0 group-hover/nav-item:opacity-100 transition-opacity duration-300 ease-in-out'>
              <ProjectUpdate project={project} />
            </div>
          </div>
        ))}
      </ul>
    </div>
  );
};
