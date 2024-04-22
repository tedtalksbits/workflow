import React from 'react';
import { ProjectsList } from './Projects/ProjectsList';
import { IProject } from '@/types/projects';
import { ITask } from '@/types/task';
import { TasksList } from './Tasks/TasksList';
import { NewProjectDialog } from './Projects/NewProject';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { useShortcuts } from '@/hooks/useShortcuts';
import { NewTaskDialog } from './Tasks/NewTask';
import { Kdb } from '@/components/ui/kdb';
import { PlusIcon } from '@radix-ui/react-icons';
import { Logo } from '@/components/logo/Logo';
import { Button } from '@/components/ui/button';
import { AuthHeader } from './components/AuthHeader';
export interface Dialogs {
  newProject: boolean;
  command: boolean;
  newTask: boolean;
}

export const Dashboard = () => {
  const [projects, setProjects] = React.useState<IProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = React.useState<
    string | null
  >(null);
  const [dialogs, setDialogs] = React.useState<Dialogs>({
    newProject: false,
    command: false,
    newTask: false,
  });
  const [tasks, setTasks] = React.useState<ITask[]>([]);
  const handleOpenCommand = (e: KeyboardEvent) => {
    if (e.key === 'k' && e.ctrlKey) {
      e.preventDefault();
      setDialogs((prev) => ({ ...prev, command: true }));
    }
  };

  useShortcuts(handleOpenCommand);

  return (
    <div className='flex h-screen'>
      <div className='sidebar h-full border-r w-[25%] max-w-[300px]'>
        <div className='projects-container'>
          <NewProjectDialog
            setProjects={setProjects}
            projects={projects}
            dialogs={dialogs}
            setDialogs={setDialogs}
            onSelectProjectId={setSelectedProjectId}
            selectedProjectId={selectedProjectId}
          />
          <ProjectsList
            setProjects={setProjects}
            projects={projects}
            onSelectProjectId={setSelectedProjectId}
            selectedProjectId={selectedProjectId}
          />
        </div>
      </div>
      <div className='content flex-1'>
        <AuthHeader />
        {projects.length === 0 ? (
          <div className='flex items-center justify-center mt-[120px]'>
            <div className='text-center'>
              <div className='flex items-start justify-center gap-2 mb-8'>
                <span className='text-4xl font-bold mb-4'>Welcome to</span>
                <Logo variant='medium' className='animate-in w-fit' />
              </div>
              <p className='text-xl mb-4 text-foreground/90'>
                To get started, create a new project by clicking the button
                below
              </p>
              <Button
                className='animate-in'
                onClick={() => setDialogs({ ...dialogs, newProject: true })}
              >
                <PlusIcon className='mr-3' />
                New Project
              </Button>
              <small className='text-foreground/60 block mt-8'>
                You can also use the <span className='font-bold'>Command</span>{' '}
                shortcut to open the command palette. <Kdb>ctrl</Kdb> +{' '}
                <Kdb>k</Kdb>
              </small>
            </div>
          </div>
        ) : (
          <div className='p-4'>
            <div className='flex'>
              <div className='ml-auto mb-4'>
                <NewTaskDialog
                  dialogs={dialogs}
                  setDialogs={setDialogs}
                  projectId={selectedProjectId}
                  onMutate={setTasks}
                />
              </div>
            </div>
            <TasksList
              tasks={tasks}
              setTasks={setTasks}
              selectedProjectId={selectedProjectId}
              key={selectedProjectId}
            />
          </div>
        )}
      </div>
      <CommandDialog
        open={dialogs.command}
        onOpenChange={() =>
          setDialogs({ ...dialogs, command: !dialogs.command })
        }
      >
        <CommandInput placeholder='Type a command or search...' autoFocus />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading='Suggestions'>
            <CommandItem
              value='newproject'
              onSelect={(currentValue) => {
                if (currentValue === 'newproject') {
                  setDialogs({ ...dialogs, newProject: true });
                }
              }}
            >
              New Project
            </CommandItem>
            <CommandItem
              value='newtask'
              onSelect={(currentValue) => {
                if (currentValue === 'newtask') {
                  setDialogs({ ...dialogs, newTask: true });
                }
              }}
            >
              New Task
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
};
