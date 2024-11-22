import { Column, Task } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TasksState {
  tasks: Task[];
  columns: Column[];
}

const initialState: TasksState = {
  tasks: [
    {
      id: "a1b2c3d4",
      title: "Design Landing Page",
      status: "In Progress",
      priority: "High",
      dueDate: "2024-11-25T18:30:00.000Z",
      description:
        "Finalize the landing page design for the new product launch. Include responsive features and ensure adherence to branding guidelines.",
      assignee: {
        id: "1",
        name: "John Doe",
        avatar: "https://i.pravatar.cc/150?img=3",
      },
    },
    {
      id: "e5f6g7h8",
      title: "Database Schema Review",
      status: "Todo",
      priority: "Medium",
      dueDate: "2024-11-30T18:30:00.000Z",
      description:
        "Review the proposed database schema for the analytics module and provide feedback.",
      assignee: {
        id: "2",
        name: "Jane Smith",
        avatar: "https://i.pravatar.cc/150?img=2",
      },
    },
    {
      id: "i9j0k1l2",
      title: "Prepare Quarterly Report",
      status: "Completed",
      priority: "Low",
      dueDate: "2024-11-15T18:30:00.000Z",
      description:
        "Compile all necessary data and prepare the quarterly report for stakeholders.",
      assignee: {
        id: "4",
        name: "Alice Brown",
        avatar: "https://i.pravatar.cc/150?img=1",
      },
    },
    {
      id: "m3n4o5p6",
      title: "Fix Bug in Login Module",
      status: "In Progress",
      priority: "High",
      dueDate: "2024-11-23T18:30:00.000Z",
      description:
        "Resolve the issue with user login not persisting session cookies on mobile devices.",
      assignee: {
        id: "3",
        name: "Bob Johnson",
        avatar: "https://i.pravatar.cc/150?img=67",
      },
    },
    {
      id: "q7r8s9t0",
      title: "Team Meeting Agenda",
      status: "Todo",
      priority: "Low",
      dueDate: "2024-11-26T18:30:00.000Z",
      description:
        "Draft and share the agenda for the upcoming team meeting next week.",
      assignee: {
        id: "4",
        name: "Alice Brown",
        avatar: "https://i.pravatar.cc/150?img=1",
      },
    },
    {
      id: "u1v2w3x4",
      title: "Content Audit",
      status: "Todo",
      priority: "Medium",
      dueDate: "2024-11-28T18:30:00.000Z",
      description:
        "Audit the existing blog content to identify outdated posts and suggest updates.",
      assignee: {
        id: "1",
        name: "John Doe",
        avatar: "https://i.pravatar.cc/150?img=3",
      },
    },
  ],
  columns: [
    {
      id: "todo",
      title: "Todo",
      color: "border-yellow-500",
      taskIds: [],
      status: "Todo",
    },
    {
      id: "inProgress",
      title: "In Progress",
      color: "border-blue-500",
      taskIds: [],
      status: "In Progress",
    },
    {
      id: "completed",
      title: "Completed",
      color: "border-green-500",
      taskIds: [],
      status: "Completed",
    },
  ],
};

export const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addNewTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
    },
    updateStatus: (state, action) => {
      const _updatedTasks = state.tasks.map((task) => {
        return task.id === action.payload.id
          ? (task.status = action.payload.status)
          : task;
      });

      return {
        ...state,
        tasks: [..._updatedTasks],
      };
    },
    updateTask: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<Task> }>
    ) => {
      const { id, updates } = action.payload;
      const _taskId = state.tasks.findIndex((task) => task.id === id);
      if (_taskId !== -1) {
        state.tasks[_taskId] = { ...state.tasks[_taskId], ...updates };
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
    },
    hydrateState: (state, action: PayloadAction<TasksState>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const {
  addNewTask,
  updateStatus,
  updateTask,
  deleteTask,
  hydrateState,
} = tasksSlice.actions;

export default tasksSlice.reducer;
