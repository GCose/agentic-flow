import { useRouter } from "next/router";
import SubSystemCard from "./cards/sub-system-card";
import { SubSystemComponentProps } from "@/types";

const SubSystemComponent = ({ systems, title }: SubSystemComponentProps) => {
  const router = useRouter();

  const handleClick = (leadType: string) => {
    router.push(`/${leadType}`);
  };

  return (
    <div className="pt-6">
      <h2 className="text-xl font-bold tracking-tight mb-4">{title}</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {systems.map((item, i) => (
          <SubSystemCard
            key={i}
            title={item.title}
            bgColor={item.bgColor}
            description={item.description}
            onClick={() => handleClick(item.leadType)}
            icon={<item.icon className={`h-8 w-8 ${item.iconColor}`} />}
          />
        ))}
      </div>
    </div>
  );
};

export default SubSystemComponent;
