import type { TooltipProps } from "recharts";

const ChartTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-md border border-border bg-background p-3 shadow-md">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} className="text-xs text-muted-foreground">
            {`${entry.name}: ${entry.value?.toLocaleString()}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default ChartTooltip;
