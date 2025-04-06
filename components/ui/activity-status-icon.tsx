import { CheckCircle2, AlertCircle, Clock, RefreshCw } from "lucide-react";

interface ActivityStatusIconProps {
  status: string;
}

const ActivityStatusIcon = ({ status }: ActivityStatusIconProps) => {
  switch (status) {
    case "success":
      return <CheckCircle2 className="h-5 w-5 text-success" />;
    case "error":
      return <AlertCircle className="h-5 w-5 text-destructive" />;
    case "pending":
      return <RefreshCw className="h-5 w-5 text-warning" />;
    case "waiting":
      return <Clock className="h-5 w-5 text-info" />;
    default:
      return null;
  }
}

export default ActivityStatusIcon;