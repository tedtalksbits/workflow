import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ITask } from '@/types/task';
import { useCallback, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useShortcuts } from '@/hooks/useShortcuts';
import { PlusIcon } from '@radix-ui/react-icons';
import { SystemInfo } from 'electron/app/appListeners';
import { Dialogs } from '../Dashboard';
import { TaskForm, TaskFormOnSubmit } from './TaskForm';
type NewTaskDialogProps = {
  onMutate: (tasks: ITask[]) => void;
  projectId: string | null;
  dialogs: Dialogs;
  setDialogs: (dialogs: Dialogs) => void;
};
export const NewTaskDialog = ({
  projectId,
  onMutate,
  dialogs,
  setDialogs,
}: NewTaskDialogProps) => {
  const { toast } = useToast();
  const [systemInfo] = useState<SystemInfo>(
    JSON.parse(localStorage.getItem('systemInfo') || '{}')
  );
  const isMac = systemInfo.platform === 'darwin';
  const handleAddTask: TaskFormOnSubmit = async (data) => {
    if (!projectId) return;

    console.log(data);
    try {
      if (data.recurringData.frequency) {
        await window.electron.tasks.addRecurring(
          projectId,
          data.task,
          data.recurringData.startDate,
          data.recurringData.frequency
        );
      } else {
        await window.electron.tasks.add(projectId, data.task);
      }

      const tasks = await window.electron.tasks.getByProjectId(projectId);
      onMutate(tasks.data);
      toast({
        title: 'Task added',
        description: 'Task ' + data.task.title + ' has been added',
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
        <TaskForm onSubmit={handleAddTask} />
      </DialogContent>
    </Dialog>
  );
};
