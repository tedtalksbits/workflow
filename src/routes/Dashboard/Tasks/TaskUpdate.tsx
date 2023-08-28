import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRightIcon, CalendarIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
import { Task, priorityColors, statusColors } from '@/types/task';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Zone } from '@/components/zone/Zone';
import { useToast } from '@/components/ui/use-toast';
import Indicator from '@/components/ui/indicator';
import { Label } from '@/components/ui/label';
import { CustomTagSelect } from '@/components/customSelects/CustomTagSelect';
import { dTFns } from '@/lib/utils';
type TaskUpdateProps = {
  task: Task;
  onMutate: (tasks: Task[]) => void;
  projectId: number | null;
};
export const TaskUpdate = ({ task, onMutate, projectId }: TaskUpdateProps) => {
  const [tags, setTags] = useState<string>(task.tags);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const handleUpdateTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries()) as Partial<Task>;
    if (!data.dueDate) data.dueDate = null;
    console.log(data.dueDate);

    try {
      if (!projectId)
        return toast({
          title: 'Failed to update task',
          description: 'No project id',
          variant: 'destructive',
        });
      await window.electron.tasks.update(task.id, data);
      const updatedTasks = await window.electron.tasks.getByProjectId(
        projectId
      );
      console.log(updatedTasks);
      onMutate(updatedTasks);
      toast({
        title: 'Task updated',
        description: 'Task ' + task.title + ' has been updated',
        variant: 'success',
      });
      setOpen(false);
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
  const handleDeleteTask = async () => {
    try {
      if (!projectId)
        return toast({ title: 'No project id', variant: 'destructive' });
      await window.electron.tasks.delete(task.id);
      const res = await window.electron.tasks.getByProjectId(projectId);
      onMutate(res);
      toast({
        title: 'Task deleted',
        description: 'Task ' + task.title + ' has been deleted',
        variant: 'success',
      });
    } catch (e) {
      const err = e as Error;
      toast({
        title: 'Failed to delete task',
        description: err.message,
        variant: 'destructive',
      });
    }
  };
  return (
    <div>
      <Sheet open={open} onOpenChange={() => setOpen(!open)}>
        <SheetTrigger asChild>
          <div
            role='button'
            className='p-2 hover:bg-foreground/10 transition-colors duration-300 ease-in-out rounded-full'
          >
            <ArrowRightIcon />
          </div>
        </SheetTrigger>
        <SheetContent className='min-w-[100%] md:min-w-[800px]'>
          <SheetHeader>
            <SheetTitle className='py-4'>
              <span className='text-xl font-extrabold'>{task.title}</span>
            </SheetTitle>
          </SheetHeader>
          <Tabs defaultValue='view' className='my-4'>
            <TabsContent value='update' className='my-4'>
              <form onSubmit={handleUpdateTask} className='flex flex-col gap-3'>
                <div className='form-group'>
                  <Label htmlFor={task.id + 'title'}>Title</Label>
                  <Input
                    type='text'
                    name='title'
                    placeholder='title'
                    id={task.id + 'title'}
                    autoFocus
                    required
                    defaultValue={task.title}
                  />
                </div>
                <div className='form-group'>
                  <Label htmlFor={`${task.id}description`}>Description</Label>
                  <Textarea
                    name='description'
                    placeholder='description'
                    rows={5}
                    id={`${task.id}description`}
                    defaultValue={task.description}
                  />
                </div>
                <div className='form-group'>
                  <Label htmlFor={task.id + 'status'}>Status</Label>
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
                <div className='form-group'>
                  <Label htmlFor={task.id + 'priority'}>Priority</Label>
                  <Select name='priority' defaultValue={task.priority}>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          <>
                            {' '}
                            <Indicator
                              className={`${
                                task.priority === 'low'
                                  ? priorityColors.low
                                  : task.priority === 'medium'
                                  ? priorityColors.medium
                                  : priorityColors.high
                              }`}
                            />
                            {task.priority}
                          </>
                        }
                      />
                    </SelectTrigger>
                    <SelectContent id={task.id + 'priority'}>
                      <SelectItem value='low' defaultValue={task.priority}>
                        <Indicator className={priorityColors.low} />
                        Low
                      </SelectItem>
                      <SelectItem defaultValue={task.priority} value='medium'>
                        <Indicator className={priorityColors.medium} />
                        Medium
                      </SelectItem>
                      <SelectItem defaultValue={task.priority} value='high'>
                        <Indicator className={priorityColors.high} />
                        High
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className='form-group'>
                  <Label htmlFor='newTaskDueDate'>Due Date</Label>
                  <Input
                    id='newTaskDueDate'
                    type='datetime-local'
                    name='dueDate'
                    placeholder='due date'
                    defaultValue={dTFns.toLocalDateTime(task?.dueDate) || ''}
                  />
                </div>
                <div className='form-group'>
                  <CustomTagSelect setTags={setTags} tags={tags} />
                </div>
                <div className='form-footer'>
                  <Button type='submit'>Update</Button>
                </div>
              </form>
              <Separator className='my-20' />
              <h2 className='font-bold my-2'>Danger Zone</h2>
              <Zone variant='destructive'>
                <div className='flex item-center justify-between'>
                  <div>
                    <h3>Delete task</h3>
                    <p className='text-foreground/80 text-xs'>
                      This action is irreversible.
                    </p>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant='destructive'>Delete</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete your account and remove your data from our
                          servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          asChild
                          className='bg-destructive text-destructive-foreground hover:bg-destructive/80'
                        >
                          <Button variant='outline' onClick={handleDeleteTask}>
                            Delete
                          </Button>
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </Zone>
            </TabsContent>
            <TabsContent value='view'>
              <div className='flex flex-col gap-4'>
                <div className='row flex justify-between'>
                  <span className='text-foreground/50 font-light w-[120px] min-w-fit'>
                    Status
                  </span>
                  <span className='text-foreground flex-1'>
                    <Indicator className={statusColors[task.status]} />
                    {task.status}
                  </span>
                </div>
                <div className='row flex justify-between'>
                  <span className='text-foreground/50 font-light w-[120px] min-w-fit'>
                    Priority
                  </span>
                  <span className='text-foreground flex-1'>
                    <Indicator className={priorityColors[task.priority]} />
                    {task.priority}
                  </span>
                </div>
                <div className='row flex justify-between'>
                  <span className='text-foreground/50 font-light w-[120px] min-w-fit'>
                    Due Date
                  </span>
                  <span className='text-foreground flex-1'>
                    <CalendarIcon className='inline-block w-4 h-4 mr-2 text-green-500' />
                    {task.dueDate?.toLocaleDateString('en', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <div className='row flex justify-between'>
                  <span className='text-foreground/50 font-light w-[120px] min-w-fit'>
                    Tags
                  </span>
                  <span className='text-foreground flex-1'>{task.tags}</span>
                </div>
                <div className='row flex justify-between'>
                  <span className='text-foreground/50 font-light w-[120px] min-w-fit'>
                    Created
                  </span>
                  <span className='text-foreground flex-1'>
                    {task.createdAt.toLocaleDateString('en', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      minute: 'numeric',
                      hour: 'numeric',
                      second: 'numeric',
                    })}
                  </span>
                </div>
              </div>
              <div className='flex flex-col gap-3 my-8'>
                <span className='text-foreground/50'>Description</span>
                {task.description}
              </div>
            </TabsContent>
            <TabsList className='mt-16'>
              <TabsTrigger value='update'>Update</TabsTrigger>
              <TabsTrigger value='view'>View</TabsTrigger>
            </TabsList>
          </Tabs>
        </SheetContent>
      </Sheet>
    </div>
  );
};
