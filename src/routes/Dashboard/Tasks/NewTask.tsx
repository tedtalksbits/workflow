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
import { useRef, useState } from 'react';
import { AddTaskProps, taskApi } from './api/task';
import { Label } from '@/components/ui/label';
import Indicator from '@/components/ui/indicator';
import { Badge } from '@/components/ui/badge';
import { Cross1Icon } from '@radix-ui/react-icons';
export const NewTaskDialog = ({ projectId }: { projectId: string }) => {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const [tags, setTags] = useState<string>('');
  const tagInput = useRef<HTMLInputElement>(null);
  const handleAddTask = async (e: React.FormEvent<HTMLFormElement>) => {
    if (!user) return console.log('no user');
    if (!projectId) return console.log('no project id');
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const dueDate = new Date(formData.get('dueDate') as string).toISOString();

    const task: Partial<Task> = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      status: 'todo',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      priority: formData.get('priority') as 'low' | 'medium' | 'high',
      assignee: formData.get('assignee') as string,
      dueDate,
      tags: formData.get('tags') as string,
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

  const commonBadges = [
    'bug',
    'feature',
    'enhancement',
    'documentation',
    'help wanted',
    'good first issue',
  ];

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTags(e.target.value);
  };
  const handleClickToAddTag = (tag: string) => {
    if (tags === '') {
      setTags(tag);
    } else {
      setTags(tags + `, ${tag}`);
    }
    tagInput.current?.focus();
  };
  const handleRemoveTag = (tag: string) => {
    const tagsArray = tags.split(', ');
    const newTagsArray = tagsArray.filter((t) => t !== tag);
    setTags(newTagsArray.join(', '));
  };
  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <DialogTrigger asChild>
        <Button className='w-fit h-fit p-2'>New Task</Button>
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
            <Input
              id='newTaskDueDate'
              type='datetime-local'
              name='dueDate'
              placeholder='due date'
              defaultValue={new Date().toISOString().slice(0, 16)}
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>
          <div className='form-group'>
            <Label htmlFor='newTaskTags'>Tags</Label>
            <div className='flex flex-wrap gap-2'>
              {commonBadges.map((badge) => (
                <div key={badge} className='relative'>
                  <Badge
                    className='cursor-pointer'
                    onClick={() => handleClickToAddTag(badge)}
                    variant='secondary'
                  >
                    {badge}
                  </Badge>
                  {tags.includes(badge) && (
                    <span
                      onClick={() => handleRemoveTag(badge)}
                      className='p-1 absolute top-[-10px] right-[-10px]  bg-red-500 rounded-full cursor-pointer z-10'
                    >
                      <Cross1Icon className='w-2 h-2' />
                    </span>
                  )}
                </div>
              ))}
            </div>
            <Input
              id='newTaskTags'
              type='text'
              name='tags'
              placeholder='tags'
              value={tags}
              onChange={handleTagsChange}
              ref={tagInput}
            />
          </div>

          <div className='form-footer'>
            <Button type='submit'>Add task</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
