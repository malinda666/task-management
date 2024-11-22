import { Priority } from "@/types";
import { Badge } from "../ui/badge";

const PriorityRenderer = ({ value }: { value: Priority }) => {
  switch (value.toLowerCase()) {
    case "low":
      return <Badge variant="secondary">• {value}</Badge>;
    case "medium":
      return <Badge variant="processing">• {value}</Badge>;
    case "high":
      return <Badge variant="destructive">• {value}</Badge>;

    default:
      return <Badge>• {value}</Badge>;
  }
};

export default PriorityRenderer;
