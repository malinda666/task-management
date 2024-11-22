import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Check } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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
  CloseCircle,
} from "iconsax-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useEffect } from "react";
import PriorityRenderer from "@/components/shared/priority-renderer";

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

interface AddTaskProps {
  onAddTask: (task: Task) => void;
  column: Status;
  isOpen: boolean;
  closeForm: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function AddTask({
  onAddTask,
  column,
  isOpen,
  closeForm,
}: AddTaskProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      priority: "",
      description: "",
      assignee: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const task: Task = {
      id: uuidv4(),
      title: values.title,
      status: column,
      priority: values.priority as Priority,
      dueDate: values.dueDate.toISOString(),
      description: values.description || "",
      assignee: people.find((p) => p.id === values.assignee)!,
      //   assignee: values.assignee.map((id) => people.find((p) => p.id === id)!),
    };
    console.log(JSON.stringify(task));
    onAddTask(task);
    form.reset();
    closeForm();
  }

  const [title, assignee, dueDate, priority] = form.watch([
    "title",
    "assignee",
    "dueDate",
    "priority",
  ]);

  useEffect(() => {
    const checkIfFieldsEmpty = [title, assignee, dueDate, priority].some(
      (item) => !item
    );
    // console.log(checkIfFieldsEmpty);

    if (!checkIfFieldsEmpty) {
      onSubmit(form.getValues());
    }
  }, [title, assignee, dueDate, priority]);

  return isOpen ? (
    <Form {...form}>
      <form className="w-full bg-background p-2 rounded-md relative">
        <span className="absolute right-2 z-20" onClick={closeForm}>
          <CloseCircle size="16" color="#666" />
        </span>
        {/* title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Write a task name"
                    className="pl-8"
                    {...field}
                  />
                  <span className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50">
                    <TickCircle size="16" color="#555" />
                  </span>
                </div>
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex items-center justify-between space-x-1 my-1">
          <div className="flex items-center justify-start gap-1">
            {/* assignee */}
            <FormField
              control={form.control}
              name="assignee"
              render={({ field }) => {
                return (
                  <FormItem>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="ghost"
                            size="icon"
                            role="combobox"
                            className={cn(
                              "h-8 w-8 justify-center rounded-full border border-dashed overflow-hidden",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <Avatar className="relative w-full h-full flex items-center justify-center">
                              {field.value ? (
                                <AvatarImage
                                  src={
                                    people.find(
                                      (person) => person.id === field.value
                                    )?.avatar
                                  }
                                  alt="assignee"
                                />
                              ) : (
                                <User size="44" color="#555" />
                              )}
                              {/* <AvatarFallback>US</AvatarFallback> */}
                            </Avatar>
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
                  </FormItem>
                );
              }}
            />

            {/* due date */}
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
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
                            <Badge variant="secondary">
                              {format(field.value, "MMM d")}
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
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => {
              return (
                <FormItem>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="ghost"
                          size="xs"
                          role="combobox"
                          className={cn(
                            "justify-center",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            <PriorityRenderer value={field.value as Priority} />
                          ) : (
                            <Badge variant="outline" className="border-dashed">
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
                                  form.setValue("priority", priority.value);
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
                </FormItem>
              );
            }}
          />
        </div>
      </form>
    </Form>
  ) : null;
}
