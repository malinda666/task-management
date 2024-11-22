import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const saveState = (state: unknown) => {
  if (typeof window !== "undefined") {
    try {
      const _state = JSON.stringify(state);
      localStorage.setItem("state", _state);
    } catch (error) {
      console.error("Couldn't save the state", error);
    }
  }
};

export const loadState = () => {
  if (typeof window !== "undefined") {
    try {
      const _state = localStorage?.getItem("state");
      return _state ? JSON.parse(_state) : undefined;
    } catch (error) {
      console.error("Couldn't get state", error);
      return undefined;
    }
  }
};
