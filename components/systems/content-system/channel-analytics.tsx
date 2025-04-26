import { useTheme } from "next-themes";
import { useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChartTooltip from "@/components/ui/chart-tooltip";

// Mock data generator for different time periods
const generateTimeSeriesData = (period: string) => {
  // Generate appropriate number of data points based on period
  const dataPoints = period === "week" ? 7 : period === "month" ? 30 : 12;

  // Generate labels based on period
  const getLabel = (index: number) => {
    if (period === "week") {
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      return days[index % 7];
    } else if (period === "month") {
      return `Day ${index + 1}`;
    } else {
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      return months[index % 12];
    }
  };

  // Create the data array
  return Array.from({ length: dataPoints }, (_, i) => {
    // Generate realistic but random-ish data
    const views = Math.floor(1000 + Math.random() * 9000);
    const engagement = Math.floor(views * (0.03 + Math.random() * 0.07));
    const conversion = Math.floor(engagement * (0.05 + Math.random() * 0.1));

    return {
      name: getLabel(i),
      views,
      engagement,
      conversion,
    };
  });
};

// Mock data for content types
const contentTypeData = [
  { name: "Blog Posts", value: 42 },
  { name: "Videos", value: 18 },
  { name: "Infographics", value: 12 },
  { name: "Case Studies", value: 7 },
  { name: "Tutorials", value: 14 },
];

// Mock data for audience demographics
const audienceData = [
  { name: "18-24", value: 15 },
  { name: "25-34", value: 38 },
  { name: "35-44", value: 25 },
  { name: "45-54", value: 14 },
  { name: "55+", value: 8 },
];

const ChannelAnalytics = () => {
  const { theme } = useTheme();
  const [timeRange, setTimeRange] = useState("week");
  const [chartData, setChartData] = useState(() =>
    generateTimeSeriesData("week")
  );

  // Update chart data when time range changes
  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);
    setChartData(generateTimeSeriesData(value));
  };

  return (
    <div className="space-y-6">
      <Tabs
        defaultValue="week"
        value={timeRange}
        onValueChange={handleTimeRangeChange}
      >
        <TabsList className="grid w-full max-w-md grid-cols-3 bg-slate-800/30">
          <TabsTrigger value="week">Last Week</TabsTrigger>
          <TabsTrigger value="month">Last Month</TabsTrigger>
          <TabsTrigger value="year">Last Year</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              stroke={theme === "dark" ? "#9CA3AF" : "#6B7280"}
            />
            <YAxis stroke={theme === "dark" ? "#9CA3AF" : "#6B7280"} />
            <Tooltip content={<ChartTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="views"
              stroke="#3B82F6"
              activeDot={{ r: 8 }}
            />
            <Line type="monotone" dataKey="engagement" stroke="#10B981" />
            <Line type="monotone" dataKey="conversion" stroke="#F59E0B" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-80">
          <h3 className="text-lg font-medium mb-4">
            Content Type Distribution
          </h3>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart
              data={contentTypeData}
              layout="vertical"
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="number"
                stroke={theme === "dark" ? "#9CA3AF" : "#6B7280"}
              />
              <YAxis
                dataKey="name"
                type="category"
                scale="band"
                stroke={theme === "dark" ? "#9CA3AF" : "#6B7280"}
              />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="h-80">
          <h3 className="text-lg font-medium mb-4">Audience Demographics</h3>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart
              data={audienceData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                stroke={theme === "dark" ? "#9CA3AF" : "#6B7280"}
              />
              <YAxis stroke={theme === "dark" ? "#9CA3AF" : "#6B7280"} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="value" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ChannelAnalytics;
