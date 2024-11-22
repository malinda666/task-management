import { configureStore, Reducer } from "@reduxjs/toolkit";
import tasksSlice from "./slices/tasks-slice";
import { loadState, saveState } from "@/lib/utils";

const preloadedState: Reducer =
  typeof window !== "undefined" ? loadState() : undefined;

export const store = configureStore({
  reducer: {
    tasks: tasksSlice,
  },
  preloadedState: preloadedState,
});

if (typeof window !== "undefined") {
  store.subscribe(() => {
    saveState(store.getState());
  });
}

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
