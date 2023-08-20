import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ProjectsList } from './Projects/ProjectsList';
import { Project } from '@/types/projects';
import { DashboardHeader } from './DashboardHeader';
import { Task } from '@/types/task';
import { TasksList } from './Tasks/TasksList';

export const Dashboard = () => {
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = React.useState<string>('');
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const { user } = useAuth();

  if (!user) return null;
  return (
    <div className='flex h-screen'>
      <div className='sidebar h-full border-r w-[25%] max-w-[300px]'>
        <ProjectsList
          setProjects={setProjects}
          projects={projects}
          onSelectProjectId={setSelectedProjectId}
          selectedProjectId={selectedProjectId}
        />
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
    </div>
  );
};
