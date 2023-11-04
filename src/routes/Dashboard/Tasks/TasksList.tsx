import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Task, TaskStatus, priorityColors, statusColors } from '@/types/task';
import { TableIcon } from '@radix-ui/react-icons';
import { useEffect, useRef, useState } from 'react';
import { TaskUpdate } from './TaskUpdate';
import { useToast } from '@/components/ui/use-toast';
import { CustomSelect } from '@/components/customSelects/CustomSelect';
import { dayjsUtils } from '@/utils/dayjs';
import { Input } from '@/components/ui/input';
import { dTFns } from '@/lib/utils';
import { useShortcuts } from '@/hooks/useShortcuts';
import { Kdb } from '@/components/ui/kdb';
import { SystemInfo } from 'electron/db/app/appListeners';

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
  const [systemInfo] = useState<SystemInfo>(
    JSON.parse(localStorage.getItem('systemInfo') || '{}')
  );
  const isMac = systemInfo.platform === 'darwin';
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

    return () => {
      setTasks([]);
    };
  }, [setTasks, selectedProjectId, toast]);
  const handleNewTaskSearchShortcut = (e: KeyboardEvent) => {
    if (e.key === 't' && (isMac ? e.metaKey : e.ctrlKey)) {
      e.preventDefault();
      taskSearchInput.current?.focus();
    }
  };

  useShortcuts(handleNewTaskSearchShortcut);
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

  const handleToggleFilter = (key: string, value: string) => {
    console.log(key, value);
    console.log('state');
    console.log(searchTerm.key, searchTerm.value);
    if (searchTerm.key === key && searchTerm.value === value) {
      setSearchTerm({
        key: '',
        value: '',
      });
      return;
    }
    setSearchTerm({
      key,
      value,
    });
  };

  return (
    <div>
      <div className='flex item-center justify-between mb-8'>
        <div className='flex items-center gap-2'>
          <h2 className='text-xl font-bold flex items-center gap-2'>
            <TableIcon className='w-5 h-5' />
            Tasks
          </h2>
        </div>
        <div className='flex items-center gap-2'>
          <div className='flex-1 relative'>
            <Input
              placeholder='Search tasks'
              className='peer'
              disabled={tasks.length === 0}
              onChange={(e) => handleToggleFilter('*', e.target.value)}
              ref={taskSearchInput}
            />
            <Kdb className='peer-active:hidden peer-focus-within:hidden peer-focus:hidden absolute right-1 top-2 flex items-center justify-center bg-foreground/10'>
              {isMac ? '⌘' : 'ctrl'}+t
            </Kdb>
          </div>
        </div>
      </div>
      <div className='flex items-center gap-1'>
        <label htmlFor='all' className='toggle'>
          All
          <input
            type='checkbox'
            value='all'
            id='all'
            name='status'
            checked={searchTerm.value === ''}
            onChange={() => handleToggleFilter('*', '')}
          />
        </label>
        <label htmlFor='todo' className='toggle'>
          Todo
          <input
            type='checkbox'
            value='todo'
            id='todo'
            name='status'
            checked={searchTerm.value === 'todo'}
            onChange={() => handleToggleFilter('status', 'todo')}
          />
        </label>
        <label htmlFor='inProgress' className='toggle'>
          In Progress
          <input
            type='checkbox'
            value='inProgress'
            id='inProgress'
            name='status'
            checked={searchTerm.value === 'inProgress'}
            onChange={() => handleToggleFilter('status', 'inProgress')}
          />
        </label>
        <label htmlFor='done' className='toggle'>
          Done
          <input
            type='checkbox'
            value='done'
            id='done'
            name='status'
            checked={searchTerm.value === 'done'}
            onChange={() => handleToggleFilter('status', 'done')}
          />
        </label>
        <small className='text-foreground/20 uppercase'>
          {isFiltered ? `${searchTerm.key}:${searchTerm.value}` : 'All'}
        </small>
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
                  dTFns.isInThePast(task?.dueDate) && task.status !== 'done'
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
