import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAuth } from '@/hooks/useAuth';
import { Task } from '@/types/task';
import { TableIcon } from '@radix-ui/react-icons';
import { useEffect } from 'react';
import { NewTaskDialog } from './NewTask';
import { TaskUpdate } from './TaskUpdate';
import { GetTasksProps, taskApi } from './api/task';

type TaskTableProps = {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  selectedProjectId: string;
};

export const TasksList = ({
  tasks,
  selectedProjectId,
  setTasks,
}: TaskTableProps) => {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) throw new Error('User is not defined');
    if (!selectedProjectId) return;
    console.log(selectedProjectId);
    const getTasksObj: GetTasksProps = {
      projectId: selectedProjectId,
      user,
      onError: () => console.log('error'),
      onSuccess(task) {
        setTasks(task);
      },
    };
    taskApi.getTasks(getTasksObj);
  }, [setTasks, selectedProjectId, user]);
  return (
    <div>
      <div className='flex item-center justify-between mb-8'>
        <h2 className='text-xl font-bold flex items-center gap-2'>
          <TableIcon className='w-5 h-5' />
          Tasks
        </h2>
        <NewTaskDialog projectId={selectedProjectId} key={selectedProjectId} />
      </div>
      <Table>
        <TableCaption>A list of your tasks</TableCaption>
        <TableHeader>
          <TableRow>
            {[
              'Task',
              'Due Date',
              'Status',
              'Priority',
              'Assignee',
              'Created',
              '',
            ].map((header) => (
              <TableCell key={header} className='font-medium'>
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell>
                <label htmlFor={task.id}>
                  <input
                    type='checkbox'
                    name=''
                    id={task.id}
                    className='checkbox-fancy'
                  />{' '}
                  {task.title}
                </label>
              </TableCell>
              <TableCell>{task.dueDate}</TableCell>
              <TableCell>{task.status}</TableCell>
              <TableCell>{task.priority}</TableCell>
              <TableCell>{task.assignee}</TableCell>
              <TableCell>{task.createdAt}</TableCell>
              <TableCell className='cursor-pointer'>
                <TaskUpdate task={task} key={task.id} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
