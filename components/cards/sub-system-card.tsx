import { Card, CardContent } from "@/components/ui/card";
import { SubSystemCardProps } from "@/types";

const SubSystemCard = ({
  title,
  description,
  icon,
  bgColor,
  onClick,
}: SubSystemCardProps) => (
  <Card
    onClick={onClick}
    className="border-slate-800 bg-transparent cursor-pointer transition-all duration-300 hover:bg-blue-800/10 hover:-translate-y-1"
  >
    <CardContent className="p-6 flex flex-col items-center text-center">
      <div className={`rounded-full p-4 mb-4 ${bgColor}`}>{icon}</div>
      <h3 className="font-medium text-lg mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
    </CardContent>
  </Card>
);

export default SubSystemCard;
