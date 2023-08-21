import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAuth } from '@/hooks/useAuth';
import {
  Task,
  TaskPriority,
  TaskStatus,
  priorityColors,
  statusColors,
} from '@/types/task';
import { TableIcon } from '@radix-ui/react-icons';
import { useEffect, useRef, useState } from 'react';
import { NewTaskDialog } from './NewTask';
import { TaskUpdate } from './TaskUpdate';
import { GetTasksProps, taskApi } from './api/task';
import { useToast } from '@/components/ui/use-toast';
import { CustomSelect } from '@/components/customSelects/CustomSelect';
import { dayjsUtils } from '@/utils/dayjs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Label } from '@radix-ui/react-label';

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
  const [searchTerm, setSearchTerm] = useState({
    key: '',
    value: '',
  });
  const isFiltered = searchTerm.key !== '' && searchTerm.value !== '';

  const taskSearchInput = useRef<HTMLInputElement>(null);

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

  const filteredTasks = tasks.filter((task) => {
    const priorityMatch =
      searchTerm.key === 'priority' &&
      task.priority.toLowerCase() === searchTerm.value.toLowerCase();
    const titleMatch =
      searchTerm.key === 'title' &&
      task.title.toLowerCase().includes(searchTerm.value.toLowerCase());
    const statusMatch =
      searchTerm.key === 'status' &&
      task.status.toLowerCase() === searchTerm.value.toLowerCase();
    const anyMatch =
      (searchTerm.key === '*' &&
        task.title.toLowerCase().includes(searchTerm.value.toLowerCase())) ||
      task.status.toLowerCase() === searchTerm.value.toLowerCase() ||
      task.priority.toLowerCase() === searchTerm.value.toLowerCase() ||
      task.description.toLowerCase().includes(searchTerm.value.toLowerCase());

    const noMatch = searchTerm.value === '';

    return priorityMatch || titleMatch || statusMatch || anyMatch || noMatch;
  });

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
        <div className='flex items-center gap-2'>
          <h2 className='text-xl font-bold flex items-center gap-2'>
            <TableIcon className='w-5 h-5' />
            Tasks
          </h2>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant='secondary'>
                {isFiltered
                  ? `${searchTerm.key}:${searchTerm.value}`
                  : 'Filter'}
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <details open>
                <summary className='text-sm font-bold'>Priority</summary>
                <div className='flex gap-4'>
                  <input
                    type='radio'
                    id='lowRadio'
                    name='priority'
                    value='todo'
                    checked={searchTerm.value === 'low'}
                    onChange={() =>
                      setSearchTerm({
                        key: 'priority',
                        value: 'low',
                      })
                    }
                  />
                  <Label htmlFor='lowRadio'>low</Label>
                </div>
                <div className='flex gap-4'>
                  <input
                    type='radio'
                    id='mediumRadio'
                    name='priority'
                    value='medium'
                    checked={searchTerm.value === 'medium'}
                    onChange={() =>
                      setSearchTerm({
                        key: 'priority',
                        value: 'medium',
                      })
                    }
                  />
                  <Label htmlFor='mediumRadio'>medium</Label>
                </div>
                <div className='flex gap-4'>
                  <input
                    type='radio'
                    id='highRadio'
                    name='priority'
                    value='high'
                    checked={searchTerm.value === 'high'}
                    onChange={() =>
                      setSearchTerm({
                        key: 'priority',
                        value: 'high',
                      })
                    }
                  />
                  <Label htmlFor='highRadio'>high</Label>
                </div>
              </details>
              <details>
                <summary className='text-sm font-bold'>Status</summary>
                <div className='flex gap-4'>
                  <input
                    type='radio'
                    id='todoRadio'
                    name='status'
                    value='todo'
                    checked={searchTerm.value === 'todo'}
                    onChange={() =>
                      setSearchTerm({
                        key: 'status',
                        value: 'todo',
                      })
                    }
                  />
                  <Label htmlFor='todoRadio'>todo</Label>
                </div>
                <div className='flex gap-4'>
                  <input
                    type='radio'
                    id='inProgressRadio'
                    name='status'
                    value='inProgress'
                    checked={searchTerm.value === 'inProgress'}
                    onChange={() =>
                      setSearchTerm({
                        key: 'status',
                        value: 'inProgress',
                      })
                    }
                  />
                  <Label htmlFor='inProgressRadio'>in progress</Label>
                </div>
                <div className='flex gap-4'>
                  <input
                    type='radio'
                    id='doneRadio'
                    name='status'
                    value='done'
                    checked={searchTerm.value === 'done'}
                    onChange={() =>
                      setSearchTerm({
                        key: 'status',
                        value: 'done',
                      })
                    }
                  />
                  <Label htmlFor='doneRadio'>done</Label>
                </div>
              </details>
            </PopoverContent>
          </Popover>
          {isFiltered && (
            <Button
              onClick={() =>
                setSearchTerm({
                  key: '',
                  value: '',
                })
              }
            >
              Clear
            </Button>
          )}
        </div>

        <div className='flex items-center gap-2'>
          <div className='flex-1'>
            <Input
              placeholder='Search tasks'
              onChange={(e) =>
                setSearchTerm({
                  key: '*',
                  value: e.target.value,
                })
              }
              ref={taskSearchInput}
            />
          </div>
          <NewTaskDialog
            projectId={selectedProjectId}
            key={selectedProjectId}
          />
        </div>
      </div>

      <Table>
        <TableCaption>A list of your tasks</TableCaption>
        <TableHeader>
          <TableRow>
            <TableCell>Task</TableCell>
            <TableCell>Due Date</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Priority</TableCell>
            <TableCell>Tags</TableCell>
            <TableCell>Created</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTasks.map((task) => (
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
