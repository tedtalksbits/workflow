import React from 'react';
import { ProjectsList } from './Projects/ProjectsList';
import { Project } from '@/types/projects';
import { DashboardHeader } from './DashboardHeader';
import { Task } from '@/types/task';
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
export interface Dialogs {
  newProject: boolean;
  command: boolean;
  newTask: boolean;
}

export const Dashboard = () => {
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = React.useState<
    number | null
  >(null);
  const [dialogs, setDialogs] = React.useState<Dialogs>({
    newProject: false,
    command: false,
    newTask: false,
  });
  const [tasks, setTasks] = React.useState<Task[]>([]);
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
            onMutate={setProjects}
            projects={projects}
            dialogs={dialogs}
            setDialogs={setDialogs}
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
        <DashboardHeader />
        <div className='p-4'>
          <TasksList
            tasks={tasks}
            setTasks={setTasks}
            selectedProjectId={selectedProjectId}
            key={selectedProjectId}
          />
        </div>
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
            <CommandItem>Search Emoji</CommandItem>
            <CommandItem>Calculator</CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
};
