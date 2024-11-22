import { ReactNode } from "react";

export type Status = "Todo" | "In Progress" | "Completed";
export type Priority = "Low" | "Medium" | "High";

interface Assignee {
  id: string;
  name: string;
  avatar: string;
}

interface Task {
  id: string;
  title: string;
  status: Status;
  priority: Priority;
  dueDate: string;
  description: string;
  assignee: Assignee;
}

export interface Column {
  id: string;
  title: string;
  color: string;
  taskIds: string[];
  status: Status;
}

interface LayoutProps {
  children: ReactNode;
}
type PriorityType = {
  value: Priority;
  label: Priority;
};
type StatusType = {
  value: Status;
  label: Status;
};
