import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Task, TaskFrequency, priorityColors } from '@/types/task';
import { useCallback, useState } from 'react';
import { Label } from '@/components/ui/label';
import Indicator from '@/components/ui/indicator';
import { CustomTagSelect } from '@/components/customSelects/CustomTagSelect';
import { useToast } from '@/components/ui/use-toast';
import { useShortcuts } from '@/hooks/useShortcuts';
import { LoopIcon, PlusIcon } from '@radix-ui/react-icons';
import { SystemInfo } from 'electron/db/app/appListeners';
import { Dialogs } from '../Dashboard';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
type NewTaskDialogProps = {
  onMutate: (tasks: Task[]) => void;
  projectId: number | null;
  dialogs: Dialogs;
  setDialogs: (dialogs: Dialogs) => void;
};
export const NewTaskDialog = ({
  projectId,
  onMutate,
  dialogs,
  setDialogs,
}: NewTaskDialogProps) => {
  const [tags, setTags] = useState<string>('');
  const [recurringData, setRecurringData] = useState<{
    startDate: string;
    frequency: TaskFrequency;
  }>({
    startDate: getLocalDateTime(new Date()),
    frequency: '',
  });
  const { toast } = useToast();
  const [systemInfo] = useState<SystemInfo>(
    JSON.parse(localStorage.getItem('systemInfo') || '{}')
  );
  const isMac = systemInfo.platform === 'darwin';
  const handleAddTask = async (e: React.FormEvent<HTMLFormElement>) => {
    if (!projectId) return;
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries()) as Partial<Task>;
    if (!data.dueDate) data.dueDate = null;
    console.log(recurringData);

    console.log(data);
    try {
      if (recurringData.frequency) {
        await window.electron.tasks.addRecurring(
          projectId,
          data,
          recurringData.startDate,
          recurringData.frequency
        );
      } else {
        await window.electron.tasks.add(projectId, data);
      }

      const tasks = await window.electron.tasks.getByProjectId(projectId);
      onMutate(tasks);
      toast({
        title: 'Task added',
        description: 'Task ' + data.title + ' has been added',
        variant: 'success',
      });
      setDialogs({ ...dialogs, newTask: false });
    } catch (e) {
      console.log(e);
      const err = e as Error;
      toast({
        title: 'Failed to add task',
        description: err.message,
        variant: 'destructive',
      });
    }
  };

  const handleShortcutOpenNewTaskDialog = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'n' && (isMac ? e.metaKey : e.ctrlKey)) {
        e.preventDefault();
        setDialogs({ ...dialogs, newTask: true });
      }
    },
    [isMac, dialogs, setDialogs]
  );

  useShortcuts(handleShortcutOpenNewTaskDialog);

  return (
    <Dialog
      open={dialogs.newTask}
      onOpenChange={() => setDialogs({ ...dialogs, newTask: !dialogs.newTask })}
    >
      <DialogTrigger asChild>
        <Button className='w-fit h-fit p-2'>
          <span>Task</span>
          <PlusIcon className='w-5 h-5 ml-2' />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Task</DialogTitle>
          <DialogDescription>
            Add a new task to your project. You can assign it to a team member
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleAddTask} className='flex flex-col gap-3'>
          <div className='form-group'>
            <Label htmlFor='newTaskTitle'>Title</Label>
            <Input
              id='newTaskTitle'
              type='text'
              name='title'
              placeholder='title'
              autoFocus
              required
            />
          </div>
          <div className='form-group'>
            <Label htmlFor='newTaskDescription'>Description</Label>
            <Textarea
              id='newTaskDescription'
              name='description'
              placeholder='description'
              rows={5}
            />
          </div>
          <div className='form-group'>
            <Label>Priority</Label>
            <Select name='priority' defaultValue='low'>
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    <>
                      <Indicator className={`${priorityColors.low}`} />
                      Low
                    </>
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='low'>
                  <Indicator className={priorityColors.low} />
                  Low
                </SelectItem>
                <SelectItem value='medium'>
                  <Indicator className={priorityColors.medium} />
                  Medium
                </SelectItem>
                <SelectItem value='high'>
                  <Indicator className={priorityColors.high} />
                  High
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className='form-group'>
            <Label htmlFor='newTaskAssignee'>Assignee</Label>
            <Input
              id='newTaskAssignee'
              type='text'
              name='assignee'
              placeholder='assignee'
            />
          </div>
          <div className='form-group'>
            <Label htmlFor='newTaskDueDate'>Due Date</Label>
            <input
              id='newTaskDueDate'
              type='datetime-local'
              name='dueDate'
              placeholder='due date'
              defaultValue={getLocalDateTime(new Date())}
              className='w-full inline-block'
            />
          </div>
          <div className='form-group'>
            <CustomTagSelect setTags={setTags} tags={tags} />
          </div>
          <div className='flex gap-4'>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={`${
                    recurringData.frequency ? 'secondary' : 'outline'
                  }`}
                >
                  <LoopIcon className='h-4 w-4 mr-2' />
                  {recurringData.frequency === ''
                    ? 'Repeat'
                    : recurringData.frequency + '✅'}
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <div className='flex flex-col gap-2'>
                  <div className='repeat'>
                    <div className='flex items-center gap-2'>
                      <input
                        type='radio'
                        name='repeat'
                        id='none'
                        className='w-4 h-4'
                        onChange={() =>
                          setRecurringData({ ...recurringData, frequency: '' })
                        }
                        checked={recurringData.frequency === ''}
                      />
                      <Label htmlFor='none'>Do not repeat</Label>
                    </div>
                    <div className='flex items-center gap-2'>
                      <input
                        type='radio'
                        name='repeat'
                        id='daily'
                        className='w-4 h-4'
                        checked={recurringData.frequency === '1 DAY'}
                        onChange={() =>
                          setRecurringData({
                            ...recurringData,
                            frequency: '1 DAY',
                          })
                        }
                      />
                      <Label htmlFor='daily'>Daily</Label>
                    </div>
                    <div className='flex items-center gap-2'>
                      <input
                        type='radio'
                        name='repeat'
                        id='weekly'
                        className='w-4 h-4'
                        checked={recurringData.frequency === '1 WEEK'}
                        onChange={() =>
                          setRecurringData({
                            ...recurringData,
                            frequency: '1 WEEK',
                          })
                        }
                      />
                      <Label htmlFor='weekly'>Weekly</Label>
                    </div>
                    <div className='flex items-center gap-2'>
                      <input
                        type='radio'
                        name='repeat'
                        id='monthly'
                        className='w-4 h-4'
                        checked={recurringData.frequency === '1 MONTH'}
                        onChange={() =>
                          setRecurringData({
                            ...recurringData,
                            frequency: '1 MONTH',
                          })
                        }
                      />
                      <Label htmlFor='monthly'>Monthly</Label>
                    </div>
                    <div className='flex items-center gap-2'>
                      <input
                        type='radio'
                        name='repeat'
                        id='yearly'
                        className='w-4 h-4'
                        checked={recurringData.frequency === '1 YEAR'}
                        onChange={() =>
                          setRecurringData({
                            ...recurringData,
                            frequency: '1 YEAR',
                          })
                        }
                      />
                      <Label htmlFor='yearly'>Yearly</Label>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            {recurringData.frequency !== '' && (
              <div className='start-date flex gap-2'>
                <Label htmlFor='startDate'>Starting: </Label>
                <Input
                  required
                  id='startDate'
                  type='datetime-local'
                  placeholder='start date'
                  value={recurringData.startDate}
                  onChange={(e) =>
                    setRecurringData({
                      ...recurringData,
                      startDate: e.target.value,
                    })
                  }
                />
              </div>
            )}
          </div>
          <div className='form-footer'>
            <Button type='submit'>Add task</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

function getLocalDateTime(date: Date) {
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}
