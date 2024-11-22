import { Button } from "@/components/ui/button";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { people, priorities } from "@/constants";
import { Priority, Status, Task } from "@/types";
import Image from "next/image";
import {
  TickCircle,
  User,
  Calendar as CalendarIcon,
  ArrowRight,
  Trash,
  DocumentText1,
  Check,
} from "iconsax-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useEffect } from "react";
import PriorityRenderer from "@/components/shared/priority-renderer";
import { Textarea } from "@/components/ui/textarea";
import StatusRenderer from "@/components/shared/status-renderer";
import TaskInputWrapper from "./task-input-wrapper";
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
} from "@/components/ui/alert-dialog";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  priority: z.string().min(2, {
    message: "Priority must be selected",
  }),
  dueDate: z.date({
    required_error: "A due date is required.",
  }),
  description: z.string().optional(),
  assignee: z.string().min(1, {
    message: "Please select an assignee.",
  }),
});

interface UpdateTaskProps {
  task: Task;
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
  column: Status;
}

const EditTaskForm = ({
  task,
  onUpdateTask,
  onDeleteTask,
  column,
}: UpdateTaskProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      priority: "",
      description: "",
      assignee: "",
    },
  });

  const [title, assignee, dueDate, priority, description] = form.watch([
    "title",
    "assignee",
    "dueDate",
    "priority",
    "description",
  ]);

  useEffect(() => {
    const _task: Task = {
      id: task.id,
      title: title,
      status: column,
      priority: priority as Priority,
      dueDate: dueDate?.toISOString() || new Date().toISOString(),
      description: description || "",
      assignee: people.find((p) => p.id === assignee)!,
      //   assignee: values.assignee.map((id) => people.find((p) => p.id === id)!),
    };
    // console.log(_task);
    onUpdateTask(_task);
  }, [title, assignee, dueDate, priority, description]);

  useEffect(() => {
    if (!task) return;
    form.reset({
      ...task,
      dueDate: new Date(task.dueDate),
      assignee: task.assignee?.id,
    });
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between py-2 border-b">
        <Button variant="outline" size="sm">
          <TickCircle color="#666" />
          Mark Complete
        </Button>
        <div className="flex items-center gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Trash color="#666" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you sure you want to delete selected task?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the selected task. These items
                  will no longer be accessible to you. This action is
                  irreversible.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction asChild>
                  <Button
                    variant="destructive"
                    onClick={() => onDeleteTask(task)}
                  >
                    Yes, Delete
                  </Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button variant="ghost" size="icon">
            <ArrowRight color="#666666" />
          </Button>
        </div>
      </div>
      <div>
        <Form {...form}>
          <form className="w-full bg-background p-2 rounded-md relative">
            {/* title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative mb-6">
                      <Textarea
                        placeholder="Write a task name"
                        className="!text-2xl font-semibold px-0 text-wrap border p-1 rounded-md"
                        {...field}
                      />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex flex-col mb-4">
              <TaskInputWrapper label="Status">
                <StatusRenderer value={task.status as Status} />
              </TaskInputWrapper>

              {/* due date */}
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <TaskInputWrapper label="Due Date">
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="ghost"
                              size="icon"
                              className={cn(
                                field.value
                                  ? "w-max"
                                  : "h-8 w-8 flex items-center justify-center border border-dashed rounded-full",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                <Badge
                                  variant="plain"
                                  className="text-primary font-semibold"
                                >
                                  {format(field.value, "Y MMM d")}
                                </Badge>
                              ) : (
                                <CalendarIcon size="44" color="#555" />
                              )}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </TaskInputWrapper>
                  </FormItem>
                )}
              />
              {/* assignee */}
              <FormField
                control={form.control}
                name="assignee"
                render={({ field }) => (
                  <FormItem>
                    <TaskInputWrapper label="Assignee">
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="ghost"
                              role="combobox"
                              className={cn(
                                "justify-start overflow-hidden px-2",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                <div className="flex items-center space-x-2">
                                  <Avatar className="relative w-8 h-8 flex items-center justify-center">
                                    <AvatarImage
                                      src={
                                        people.find(
                                          (person) => person.id === field.value
                                        )?.avatar
                                      }
                                      alt="assignee"
                                    />
                                  </Avatar>
                                  <span>
                                    {
                                      people.find(
                                        (person) => person.id === field.value
                                      )?.name
                                    }
                                  </span>
                                </div>
                              ) : (
                                <User size="44" color="#555" />
                              )}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                          <Command>
                            <CommandInput placeholder="Search assignees..." />
                            <CommandList>
                              <CommandEmpty>No assignee found.</CommandEmpty>
                              <CommandGroup>
                                {people.map((person) => (
                                  <CommandItem
                                    value={person.id}
                                    key={person.id}
                                    onSelect={() => {
                                      form.setValue("assignee", person.id);
                                    }}
                                  >
                                    <div className="relative mr-2 h-6 w-6 rounded-full overflow-hidden">
                                      <Image
                                        src={person.avatar}
                                        alt={person.name}
                                        fill
                                      />
                                    </div>
                                    {person.name}
                                    <Check
                                      className={cn(
                                        "ml-auto",
                                        person.id === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </TaskInputWrapper>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <TaskInputWrapper label="Priority">
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="ghost"
                                size="xs"
                                role="combobox"
                                className={cn(
                                  "justify-start pl-2",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  <PriorityRenderer
                                    value={field.value as Priority}
                                  />
                                ) : (
                                  <Badge
                                    variant="outline"
                                    className="border-dashed"
                                  >
                                    Set priority
                                  </Badge>
                                )}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-[200px] p-0">
                            <Command>
                              {/* <CommandInput placeholder="Search assignees..." /> */}
                              <CommandList>
                                <CommandEmpty>No assignee found.</CommandEmpty>
                                <CommandGroup>
                                  {priorities.map((priority) => (
                                    <CommandItem
                                      value={priority.value}
                                      key={priority.value}
                                      onSelect={() => {
                                        form.setValue(
                                          "priority",
                                          priority.value
                                        );
                                      }}
                                    >
                                      {priority.label}
                                      <Check
                                        className={cn(
                                          "ml-auto",
                                          priority.value === field.value
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </TaskInputWrapper>
                    </FormItem>
                  );
                }}
              />
            </div>
            {/* desc */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="col-span-1 text-neutral-400 font-normal flex items-center gap-1.5">
                    <DocumentText1 size="16" color="#999" variant="Outline" />{" "}
                    Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write a task name"
                      className=" px-0 text-wrap border p-1 rounded-md"
                      rows={10}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
    </div>
  );
};

export default EditTaskForm;
