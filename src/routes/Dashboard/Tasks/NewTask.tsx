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
import { useAuth } from '@/hooks/useAuth';
import { Task, priorityColors } from '@/types/task';
import { PlusIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
import { AddTaskProps, taskApi } from './api/task';
import { Label } from '@/components/ui/label';
import Indicator from '@/components/ui/indicator';
export const NewTaskDialog = ({ projectId }: { projectId: string }) => {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const handleAddTask = async (e: React.FormEvent<HTMLFormElement>) => {
    if (!user) return console.log('no user');
    if (!projectId) return console.log('no project id');
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const task: Partial<Task> = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      status: 'todo',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      priority: formData.get('priority') as 'low' | 'medium' | 'high',
      assignee: '',
      dueDate: '',
      projectId,
    };

    const addTaskRequest: AddTaskProps = {
      task,
      projectId,
      user,
      onError,
      onSuccess,
    };

    taskApi.addTask(addTaskRequest);
  };

  const onError = () => {
    console.log('error');
  };
  const onSuccess = () => {
    setOpen(false);
  };
  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <DialogTrigger asChild>
        <Button variant='secondary' className='w-fit h-fit p-2'>
          New Task
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
          <div className='form-footer'>
            <Button type='submit'>Add task</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
