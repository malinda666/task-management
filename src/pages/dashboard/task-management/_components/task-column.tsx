import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Column, Status, Task } from "@/types";
import { Droppable } from "react-beautiful-dnd";
import TaskItem from "./task-item";
import AddTask from "./add-task-form";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Add } from "iconsax-react";
import { useState } from "react";

interface TaskColumnProps {
  column: Column;
  tasks: { [key: string]: Task };
  addTask: (columnId: string, task: Task) => void;
}

export default function TaskColumn({
  column,
  tasks,
  addTask,
}: TaskColumnProps) {
  const backgroundClass = `${column.color}`;

  const [isAddTaskFormOpen, setAddTaskFormOpen] = useState(false);

  // console.log(tasks, column);

  return (
    <Card className="flex-1 bg-transparent shadow-none border-dashed border-2">
      <CardHeader className="flex justify-between items-center">
        <CardTitle
          className={`flex items-center gap-2 bg-background w-full justify-between py-2 px-3 rounded-md ${column.color}`}
        >
          <div className="flex gap-2 items-center">
            <div
              className={cn("rounded-full h-6 w-6 border-2", backgroundClass)}
            />
            <span>{column.title}</span>
            <span className="text-sm text-primary bg-primary/10 rounded-full w-6 h-6 flex items-center justify-center">
              {column.taskIds.length}
            </span>
          </div>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setAddTaskFormOpen(true)}
          >
            <Add size="32" color="#000" />
          </Button>
        </CardTitle>
        <AddTask
          onAddTask={(task) => addTask(column.id, task)}
          column={column.title as Status}
          isOpen={isAddTaskFormOpen}
          closeForm={() => setAddTaskFormOpen(false)}
        />
      </CardHeader>
      <CardContent className="h-full">
        <Droppable
          droppableId={column.id}
          isDropDisabled={false}
          isCombineEnabled={true}
          ignoreContainerClipping={true}
        >
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="min-h-[100px] pb-8 h-full"
            >
              {column.taskIds.map((taskId, index) => (
                <TaskItem
                  key={taskId}
                  task={tasks[taskId]}
                  index={index}
                  column={column.title as Status}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        {/* <div className="w-full flex justify-center">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setAddTaskFormOpen(true)}
          >
            <Add size="32" color="#000" /> Add Task
          </Button>
        </div> */}
      </CardContent>
    </Card>
  );
}
