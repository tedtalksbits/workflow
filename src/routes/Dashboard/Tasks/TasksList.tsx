import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAuth } from '@/hooks/useAuth';
import { Task, TaskStatus, priorityColors, statusColors } from '@/types/task';
import { TableIcon } from '@radix-ui/react-icons';
import { useEffect } from 'react';
import { NewTaskDialog } from './NewTask';
import { TaskUpdate } from './TaskUpdate';
import { GetTasksProps, taskApi } from './api/task';
import { useToast } from '@/components/ui/use-toast';
import { CustomSelect } from '@/components/customSelects/CustomSelect';
import { dayjsUtils } from '@/utils/dayjs';
import { Checkbox } from '@/components/ui/checkbox';

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
  const { toast } = useToast();

  useEffect(() => {
    if (!user) throw new Error('User is not defined');
    if (!selectedProjectId) return;

    const getTasksObj: GetTasksProps = {
      projectId: selectedProjectId,
      user,
      onError: () => {
        toast({
          title: 'Something went wrong',
          description: 'Tasks were not fetched.',
          variant: 'destructive',
        });
      },
      onSuccess(task) {
        setTasks(task);
      },
    };
    taskApi.getTasks(getTasksObj);
  }, [setTasks, selectedProjectId, user, toast]);

  const handleUpdateTask = async (update: Partial<Task>) => {
    if (!user) return console.log('no user');
    if (update.id === undefined) return console.log('no id');
    const taskUpdate = {
      id: update.id,
      update,
      user,
      onSuccess: () => {
        toast({
          title: 'Task updated',
          description: 'Task was successfully updated.',
          variant: 'success',
        });
      },
      onError: () =>
        toast({
          title: 'Something went wrong',
          description: 'Task was not updated.',
          variant: 'destructive',
        }),
    };
    taskApi.updateTask(taskUpdate);
  };

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
              'Tags',
              'Created',
              '',
            ].map((header) => (
              <TableCell key={header} className='text-foreground/40'>
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow
              key={task.id}
              className={`${
                task.status === 'done' && 'bg-green-600/5 hover:bg-green-600/5'
              }`}
            >
              <TableCell>
                <label htmlFor={task.id} title={task.title}>
                  <input
                    id={task.id}
                    type='checkbox'
                    className='peer checkbox-fancy'
                    checked={task.status === 'done'}
                    onChange={() => {
                      handleUpdateTask({
                        id: task.id,
                        status: task.status === 'done' ? 'todo' : 'done',
                      });
                    }}
                  />{' '}
                  <span className='peer-checked:text-foreground/50'>
                    {task.title}
                  </span>
                </label>
              </TableCell>
              <TableCell>{task.dueDate}</TableCell>
              <TableCell>
                <CustomSelect
                  options={['todo', 'inProgress', 'done'] as TaskStatus[]}
                  selected={task.status}
                  onChange={(value) => {
                    handleUpdateTask({ id: task.id, status: value });
                  }}
                  indicatorColors={statusColors}
                />
              </TableCell>
              <TableCell>
                <CustomSelect
                  options={['low', 'medium', 'high']}
                  selected={task.priority}
                  onChange={(value) => {
                    handleUpdateTask({ id: task.id, priority: value });
                  }}
                  indicatorColors={priorityColors}
                />
              </TableCell>
              <TableCell>{task.tags}</TableCell>
              <TableCell title={task.createdAt}>
                {dayjsUtils.timeFromNow(task.createdAt)}
              </TableCell>
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
