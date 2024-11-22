import { Calendar1, Flag, Record, User } from "iconsax-react";
import React, { ReactNode } from "react";

type Props = {
  label: string;
  children: ReactNode;
};

const TaskInputWrapper = ({ label, children }: Props) => {
  const renderLabel = (label: string) => {
    switch (label?.toLowerCase()) {
      case "status":
        return <Record size="16" color="#999" variant="Outline" />;
      case "due date":
        return <Calendar1 size="16" color="#999" variant="Outline" />;
      case "assignee":
        return <User size="16" color="#999" variant="Outline" />;
      case "priority":
        return <Flag size="16" color="#999" variant="Outline" />;

      default:
        <Record size="16" color="#999" variant="Outline" />;
    }
  };

  return (
    <div className="grid grid-cols-3  items-center mb-3">
      <label className="text-sm col-span-1 text-neutral-400 font-normal flex items-center gap-1.5">
        {renderLabel(label)} {label}
      </label>
      <div className="col-span-2">{children}</div>
    </div>
  );
};

export default TaskInputWrapper;
