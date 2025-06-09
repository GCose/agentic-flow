import {
  Thermometer,
  Snowflake,
  CalendarClock,
  ShieldCheck,
} from "lucide-react";
import StatCard from "@/components/ui/stat-card";

const LeadGenOverview = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        value="28"
        icon={Thermometer}
        color="orange"
        title="Warm Leads"
        change="+5 from last month"
      />
      <StatCard
        value="63"
        icon={Snowflake}
        color="blue"
        title="Cold Leads"
        change="+14 from last month"
      />
      <StatCard
        value="19"
        icon={CalendarClock}
        color="green"
        title="Appointments Set"
        change="+3 from last month"
      />
      <StatCard
        value="11"
        icon={ShieldCheck}
        color="purple"
        title="Audits Done"
        change="+2 from last month"
      />
    </div>
  );
};

export default LeadGenOverview;
