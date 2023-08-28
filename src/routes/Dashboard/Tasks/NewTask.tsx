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
import { Task, priorityColors } from '@/types/task';
import { useCallback, useState } from 'react';
import { Label } from '@/components/ui/label';
import Indicator from '@/components/ui/indicator';
import { CustomTagSelect } from '@/components/customSelects/CustomTagSelect';
import { useToast } from '@/components/ui/use-toast';
import { useShortcuts } from '@/hooks/useShortcuts';
import { Kdb } from '@/components/ui/kdb';
type NewTaskDialogProps = {
  onMutate: (tasks: Task[]) => void;
  projectId: number | null;
};
export const NewTaskDialog = ({ projectId, onMutate }: NewTaskDialogProps) => {
  const [open, setOpen] = useState(false);
  const [tags, setTags] = useState<string>('');
  const { toast } = useToast();
  const handleAddTask = async (e: React.FormEvent<HTMLFormElement>) => {
    if (!projectId) return;
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries()) as Partial<Task>;
    data.dueDate && new Date(data.dueDate).toISOString();
    try {
      await window.electron.tasks.add(projectId, data);
      const tasks = await window.electron.tasks.getByProjectId(projectId);
      onMutate(tasks);
      toast({
        title: 'Task added',
        description: 'Task ' + data.title + ' has been added',
        variant: 'success',
      });
      setOpen(false);
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

  const handleShortcutOpen = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'n' && e.ctrlKey) {
        e.preventDefault();
        setOpen(true);
      }
    },
    [setOpen]
  );

  useShortcuts(handleShortcutOpen);

  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <DialogTrigger asChild>
        <Button className='w-fit h-fit p-2'>
          <span>+ Task</span>
          <Kdb className='ml-2'>
            <span>⌘</span>n
          </Kdb>
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
            <CustomTagSelect setTags={setTags} tags={tags} />
          </div>
          <div className='form-footer'>
            <Button type='submit'>Add task</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
