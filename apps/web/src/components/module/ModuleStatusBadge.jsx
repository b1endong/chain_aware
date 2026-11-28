import { Blocks, CircleCheck, CircleDashed, Hourglass } from "lucide-react";
import Badge from "../ui/Badge";
import { MODULE_STATUS } from "../../constants/app";

const ICONS = { not_started: CircleDashed, in_progress: Hourglass, passed: CircleCheck, onchain: Blocks };

export default function ModuleStatusBadge({ status }) {
  const meta = MODULE_STATUS[status];
  return (
    <Badge tone={meta.tone} icon={ICONS[status]}>
      {meta.label}
    </Badge>
  );
}
