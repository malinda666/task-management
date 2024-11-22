import { PriorityType, StatusType } from "./types";

export const people = [
  {
    id: "1",
    name: "John Doe",
    avatar: "https://i.pravatar.cc/150?img=3",
  },
  {
    id: "2",
    name: "Jane Smith",
    avatar: "https://i.pravatar.cc/150?img=2",
  },
  {
    id: "3",
    name: "Bob Johnson",
    avatar: "https://i.pravatar.cc/150?img=67",
  },
  {
    id: "4",
    name: "Alice Brown",
    avatar: "https://i.pravatar.cc/150?img=1",
  },
] as const;

export const priorities: PriorityType[] = [
  {
    value: "Low",
    label: "Low",
  },
  {
    value: "Medium",
    label: "Medium",
  },
  {
    value: "High",
    label: "High",
  },
];
export const statuses: StatusType[] = [
  {
    value: "Todo",
    label: "Todo",
  },
  {
    value: "In Progress",
    label: "In Progress",
  },
  {
    value: "Completed",
    label: "Completed",
  },
];
