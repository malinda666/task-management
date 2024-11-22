import { Status } from "@/types";
import { Badge } from "../ui/badge";
import { Record } from "iconsax-react";

const StatusRenderer = ({ value }: { value: Status }) => {
  switch (value?.toLowerCase()) {
    case "todo":
      return (
        <Badge variant="plain" className="items-center">
          <Record size="16" color="#ffad0d" variant="Outline" />
          <span>{value}</span>
        </Badge>
      );
    case "in progress":
      return (
        <Badge variant="plain" className="items-center">
          <Record size="16" color="#0c6fbf" variant="Outline" />
          <span>{value}</span>
        </Badge>
      );
    case "completed":
      return (
        <Badge variant="plain" className="items-center">
          <Record size="16" color="#2a7e2e" variant="Outline" />
          <span>{value}</span>
        </Badge>
      );

    default:
      return (
        <Badge>
          • <span>N/A</span>
        </Badge>
      );
  }
};

export default StatusRenderer;
