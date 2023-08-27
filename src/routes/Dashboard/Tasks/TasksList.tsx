import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Task, TaskStatus, priorityColors, statusColors } from '@/types/task';
import { MixerHorizontalIcon, TableIcon } from '@radix-ui/react-icons';
import { useEffect, useRef, useState } from 'react';
import { NewTaskDialog } from './NewTask';
import { TaskUpdate } from './TaskUpdate';
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

import { Label } from '@radix-ui/react-label';
import { dTFns } from '@/lib/utils';

type TaskTableProps = {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  selectedProjectId: number | null;
};

export const TasksList = ({
  tasks,
  selectedProjectId,
  setTasks,
}: TaskTableProps) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState({
    key: '',
    value: '',
  });
  const isFiltered = searchTerm.key !== '' && searchTerm.value !== '';

  const taskSearchInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!selectedProjectId) return;
    window.electron.tasks.getByProjectId(selectedProjectId).then(
      (res) => {
        setTasks(res);
      },
      (err) => {
        toast({
          title: 'Something went wrong',
          description: 'Tasks could not be fetched.' + err.message,
          variant: 'destructive',
        });
      }
    );
  }, [setTasks, selectedProjectId, toast]);

  if (!tasks) return <div>No Tasks</div>;

  const filteredTasks = tasks?.filter((task) => {
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

  const handleUpdateTask = async (id: number, update: Partial<Task>) => {
    if (!selectedProjectId) return console.log('no project id');
    if (!id) return console.log('no task id');
    try {
      await window.electron.tasks.update(id, update);
      const res = await window.electron.tasks.getByProjectId(selectedProjectId);
      setTasks(res);
      toast({
        title: 'Success!',
        description: 'Task has been updated',
        variant: 'success',
      });
    } catch (e) {
      console.log(e);
      const err = e as Error;
      toast({
        title: 'Failed to update task',
        description: err.message,
        variant: 'destructive',
      });
    }
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
              <Button variant='secondary' disabled={filteredTasks.length === 0}>
                <MixerHorizontalIcon className='w-5 h-5 mr-2' />
                {isFiltered
                  ? `${searchTerm.key}:${searchTerm.value}`
                  : 'Filter'}
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <header className='flex items-center justify-between mb-4 '>
                <h4 className='font-medium text-lg'>Filter</h4>
                <MixerHorizontalIcon className='w-5 h-5' />
              </header>
              <details open={searchTerm.key === 'priority'}>
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
              <details open={searchTerm.key === 'status'}>
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
              disabled={tasks.length === 0}
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
            onMutate={setTasks}
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
                <label htmlFor={task.id.toString()} title={task.title}>
                  <input
                    id={task.id.toString()}
                    type='checkbox'
                    className='peer checkbox-fancy'
                    checked={task.status === 'done'}
                    onChange={() => {
                      handleUpdateTask(task.id, {
                        status: task.status === 'done' ? 'todo' : 'done',
                      });
                    }}
                  />{' '}
                  <span className='peer-checked:text-foreground/50'>
                    {task.title}
                  </span>
                </label>
              </TableCell>
              <TableCell
                title={task?.dueDate?.toString()}
                className={
                  dTFns.isInThePast(task?.dueDate)
                    ? 'bg-destructive/5 text-destructive'
                    : ''
                }
              >
                {task.dueDate &&
                  dayjsUtils.timeFromNow(task.dueDate.toString())}
              </TableCell>
              <TableCell>
                <CustomSelect
                  options={['todo', 'inProgress', 'done'] as TaskStatus[]}
                  selected={task.status}
                  onChange={(value) => {
                    handleUpdateTask(task.id, { status: value });
                  }}
                  indicatorColors={statusColors}
                />
              </TableCell>
              <TableCell>
                <CustomSelect
                  options={['low', 'medium', 'high']}
                  selected={task.priority}
                  onChange={(value) => {
                    handleUpdateTask(task.id, { priority: value });
                  }}
                  indicatorColors={priorityColors}
                />
              </TableCell>
              <TableCell>{task.tags}</TableCell>
              <TableCell title={task.createdAt.toISOString()}>
                {dayjsUtils.timeFromNow(task.createdAt.toString())}
              </TableCell>
              <TableCell className='cursor-pointer'>
                <TaskUpdate
                  task={task}
                  key={task.id}
                  onMutate={setTasks}
                  projectId={selectedProjectId}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
