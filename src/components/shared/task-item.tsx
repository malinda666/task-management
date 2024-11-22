import PriorityRenderer from "@/components/shared/priority-renderer";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Priority, Status, Task } from "@/types";
import { format, formatDistanceToNowStrict } from "date-fns";
import { TickCircle, User } from "iconsax-react";
import { Clock } from "lucide-react";
import { Draggable } from "react-beautiful-dnd";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import EditTaskForm from "./edit-task-form";
import { useState } from "react";
import { useAppDispatch } from "@/hooks/use-store";
import { deleteTask, updateTask } from "@/ctx/slices/tasks-slice";

interface TaskItemProps {
  task: Task;
  index: number;
  column: Status;
}

export default function TaskItem({ task, index, column }: TaskItemProps) {
  const dispatch = useAppDispatch();

  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const shoudShowTimeRemaining =
    (task?.priority === "High" || task?.priority === "Medium") &&
    task?.status !== "Completed";

  const handleTaskUpdate = (task: Task) => {
    dispatch(updateTask({ id: task.id, updates: task }));
  };
  const handleTaskDelete = (task: Task) => {
    dispatch(deleteTask(task.id));
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`mb-2 bg-white border rounded-lg ${
            snapshot.isDragging ? "opacity-70" : ""
          }`}
        >
          <Sheet
            open={isDrawerOpen}
            onOpenChange={(open) => setDrawerOpen(open)}
          >
            <SheetTrigger className="w-full">
              <div className="relative border-b py-2 flex">
                <span className="pl-10">{task.title}</span>
                <span className="pointer-events-none absolute left-2 top-1/2 size-6 -translate-y-1/2 select-none opacity-50">
                  {task.status === "Completed" ? (
                    <TickCircle size="24" color="#2A7E2E" variant="Bold" />
                  ) : (
                    <TickCircle size="24" color="#555" />
                  )}
                </span>
              </div>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle />
                <SheetDescription asChild>
                  <EditTaskForm
                    task={task}
                    onUpdateTask={handleTaskUpdate}
                    onDeleteTask={handleTaskDelete}
                    column={column}
                  />
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>

          {task.description ? (
            <div className="border-b p-2">
              <p className="text-xs line-clamp-2">{task.description}</p>
            </div>
          ) : null}
          <div className="flex items-center justify-between space-x-1 my-1 p-2">
            <div className="flex items-center justify-start gap-1">
              {/* assignee */}

              <Avatar className="relative flex items-center justify-center h-8 w-8 rounded-full border border-dashed overflow-hidden">
                {task.assignee ? (
                  <AvatarImage src={task.assignee?.avatar} alt="assignee" />
                ) : (
                  <User size="44" color="#555" />
                )}
                {/* <AvatarFallback>US</AvatarFallback> */}
              </Avatar>

              {/* due date */}

              <Badge variant="secondary">{format(task.dueDate, "MMM d")}</Badge>
            </div>

            <PriorityRenderer value={task.priority as Priority} />
          </div>

          {shoudShowTimeRemaining ? (
            <div className="border-t p-2 flex items-center gap-2">
              <Clock size="16" color="#777" />
              <p className="text-xs text-gray-400 line-clamp-2">
                Should complete within{" "}
                {formatDistanceToNowStrict(new Date(task.dueDate))}.
              </p>
            </div>
          ) : null}
        </div>
      )}
    </Draggable>
  );
}
