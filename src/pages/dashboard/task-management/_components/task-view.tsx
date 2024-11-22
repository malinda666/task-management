"use client";

import React, { useEffect, useState } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { Column, Task } from "@/types";
import TaskColumn from "./task-column";
import { useAppDispatch, useAppSelector } from "@/hooks/use-store";
import { addNewTask } from "@/ctx/slices/tasks-slice";

// tasks in UI are in a different shape. {[taskId]: task}
// tasks on the state are in array shape. Task[]

export default function TaskView() {
  const { tasks: initialTasks, columns: initialColumns } = useAppSelector(
    (state) => state.tasks
  );
  const dispatch = useAppDispatch();

  const [columns, setColumns] = useState<{ [key: string]: Column }>({});

  const [tasks, setTasks] = useState<{ [key: string]: Task }>({});

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const startColumn = columns[source.droppableId];
    const endColumn = columns[destination.droppableId];

    const newTasks = { ...tasks };
    newTasks[draggableId] = {
      ...newTasks[draggableId],
      status: endColumn.status,
    };

    if (startColumn === endColumn) {
      const newTaskIds = Array.from(startColumn.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...startColumn,
        taskIds: newTaskIds,
      };

      setColumns({
        ...columns,
        [newColumn.id]: newColumn,
      });
    } else {
      const startTaskIds = Array.from(startColumn.taskIds);
      startTaskIds.splice(source.index, 1);
      const newStartColumn = {
        ...startColumn,
        taskIds: startTaskIds,
      };

      const endTaskIds = Array.from(endColumn.taskIds);
      endTaskIds.splice(destination.index, 0, draggableId);
      const newEndColumn = {
        ...endColumn,
        taskIds: endTaskIds,
      };

      setColumns({
        ...columns,
        [newStartColumn.id]: newStartColumn,
        [newEndColumn.id]: newEndColumn,
      });
    }

    setTasks(newTasks);
  };

  const addTask = (columnId: string, task: Task) => {
    const newTasks = { ...tasks, [task.id]: task };
    // convert all back to an array and update state
    // const tasksArray = Object.values(newTasks);
    dispatch(addNewTask(task));

    setTasks(newTasks);
    const column = columns[columnId];
    setColumns({
      ...columns,
      [columnId]: {
        ...column,
        taskIds: [...column.taskIds, task.id],
      },
    });
  };

  // initial setup
  const initData = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const modTasks = [...initialTasks].reduce((acc: any, task) => {
      acc[task.id] = { ...task };
      return acc;
    }, {});
    setTasks(modTasks);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const modColumns = [...initialColumns].reduce((acc: any, col) => {
      const _tasks = [...initialTasks].filter(
        (t) => t.status.toLowerCase() === col.status.toLowerCase()
      );
      acc[col.id] = { ...col, taskIds: _tasks.map((t) => t.id) || [] };
      return acc;
    }, {});
    setColumns(modColumns);
  };

  useEffect(() => {
    initData();
  }, [initialTasks, initialColumns]);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4">
        {Object.values(columns).map((column) => (
          <TaskColumn
            key={column.id}
            column={column}
            tasks={tasks}
            addTask={addTask}
          />
        ))}
      </div>
    </DragDropContext>
  );
}
