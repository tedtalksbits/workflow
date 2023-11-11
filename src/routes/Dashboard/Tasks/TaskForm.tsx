import { CustomTagSelect } from '@/components/customSelects/CustomTagSelect';
import { Button } from '@/components/ui/button';
import Indicator from '@/components/ui/indicator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Task,
  TaskFrequency,
  priorityColors,
  statusColors,
} from '@/types/task';
import { getLocalDateTime } from '@/utils/dayjs';
import { LoopIcon } from '@radix-ui/react-icons';
import React from 'react';

interface TaskFormProps {
  onSubmit: TaskFormOnSubmit;
  task?: Task;
}
export type TaskFormOnSubmit = (data: Data) => void;
type Data = {
  task: Partial<Task>;
  recurringData: {
    frequency: TaskFrequency;
    startDate: string;
  };
};

export const TaskForm = ({ onSubmit, task }: TaskFormProps) => {
  const [recurringData, setRecurringData] = React.useState<{
    frequency: TaskFrequency;
    startDate: string;
  }>({
    frequency: '',
    startDate: getLocalDateTime(new Date()),
  });
  const [tags, setTags] = React.useState<string>('');

  const handleAddTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newTask = Object.fromEntries(formData.entries()) as Partial<Task>;
    if (!newTask.dueDate) newTask.dueDate = null;
    const data = {
      task: newTask,
      recurringData: recurringData,
    } as Data;
    console.log(data);
    onSubmit(data);
  };

  return (
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
          defaultValue={task?.title || ''}
        />
      </div>
      <div className='form-group'>
        <Label htmlFor='newTaskDescription'>Description</Label>
        <Textarea
          id='newTaskDescription'
          name='description'
          placeholder='description'
          rows={5}
          defaultValue={task?.description || ''}
        />
      </div>
      {task && (
        <div className='form-group'>
          <Label htmlFor='newTaskStatus'>Status</Label>
          <Select name='status' defaultValue={task.status}>
            <SelectTrigger>
              <SelectValue
                placeholder={
                  <>
                    <Indicator
                      className={`${
                        task.status === 'todo'
                          ? statusColors.todo
                          : task.status === 'inProgress'
                          ? statusColors.inProgress
                          : `${statusColors.done}`
                      }`}
                    />
                    {task.status}
                  </>
                }
              />
            </SelectTrigger>
            <SelectContent id={task.id + 'status'}>
              <SelectItem value='todo'>
                <Indicator className={statusColors.todo} />
                Todo
              </SelectItem>
              <SelectItem value='inProgress'>
                <Indicator className={statusColors.inProgress} />
                In Progress
              </SelectItem>
              <SelectItem value='done'>
                <Indicator className={statusColors.done} />
                Done
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      <div className='form-group'>
        <Label>Priority</Label>
        <Select name='priority' defaultValue={task?.priority || 'high'}>
          <SelectTrigger>
            <SelectValue
              placeholder={
                <>
                  {' '}
                  <Indicator
                    className={`${
                      task?.priority === 'low'
                        ? priorityColors.low
                        : task?.priority === 'medium'
                        ? priorityColors.medium
                        : priorityColors.high
                    }`}
                  />
                  {task?.priority || 'high'}
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
          defaultValue={task?.assignee || ''}
        />
      </div>
      <div className='form-group'>
        <Label htmlFor='newTaskDueDate'>Due Date</Label>
        <input
          id='newTaskDueDate'
          type='datetime-local'
          name='dueDate'
          placeholder='due date'
          defaultValue={
            getLocalDateTime(task?.dueDate) || getLocalDateTime(new Date())
          }
          className='w-full inline-block'
        />
      </div>
      <div className='form-group'>
        <CustomTagSelect setTags={setTags} tags={task?.tags || tags} />
      </div>
      {!task && (
        <div className='flex gap-4'>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={`${recurringData.frequency ? 'secondary' : 'outline'}`}
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
      )}
      <div className='form-footer'>
        <Button type='submit'>Submit</Button>
      </div>
    </form>
  );
};
