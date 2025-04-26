import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

// Mock data for content calendar
const generateCalendarData = () => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  // Content types with colors for visual differentiation
  const contentTypes = [
    { type: "Blog Post", color: "bg-blue-500/10 text-blue-500" },
    { type: "Social Post", color: "bg-purple-500/10 text-purple-500" },
    { type: "Video", color: "bg-red-500/10 text-red-500" },
    { type: "Newsletter", color: "bg-amber-500/10 text-amber-500" },
    { type: "Case Study", color: "bg-green-500/10 text-green-500" },
    { type: "Infographic", color: "bg-indigo-500/10 text-indigo-500" },
  ];

  // Channels
  const channels = [
    "Website Blog",
    "Twitter",
    "LinkedIn",
    "Instagram",
    "YouTube",
    "Newsletter",
  ];

  // Generate some random content events for the calendar
  const events = [];

  // Add events for the current month (+/- 1 month)
  for (let i = 0; i < 25; i++) {
    const randomDay = Math.floor(Math.random() * 28) + 1;
    const randomMonth = currentMonth + Math.floor(Math.random() * 3) - 1;

    const eventDate = new Date(currentYear, randomMonth, randomDay);

    // Don't add events in the past
    if (eventDate < today) continue;

    const randomContentType =
      contentTypes[Math.floor(Math.random() * contentTypes.length)];
    const randomChannel = channels[Math.floor(Math.random() * channels.length)];

    events.push({
      id: `event-${i}`,
      title: `${randomContentType.type} for ${randomChannel}`,
      date: eventDate,
      contentType: randomContentType.type,
      channel: randomChannel,
      colorClass: randomContentType.color,
    });
  }

  return events;
};

const ContentCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events] = useState(generateCalendarData());

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  // Move to previous month
  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  // Move to next month
  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  // Get events for a specific day
  const getEventsForDay = (day: number) => {
    return events.filter(
      (event) =>
        event.date.getDate() === day &&
        event.date.getMonth() === currentDate.getMonth() &&
        event.date.getFullYear() === currentDate.getFullYear()
    );
  };

  // Format date as Month Year
  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  // Generate calendar grid
  const generateCalendarGrid = () => {
    const today = new Date();
    const calendar = [];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // Add day names row
    calendar.push(
      <div key="day-names" className="grid grid-cols-7 gap-1 mb-1">
        {dayNames.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-muted-foreground py-1"
          >
            {day}
          </div>
        ))}
      </div>
    );

    // Calculate total cells needed (days in month + empty cells for first day offset)
    const totalCells = daysInMonth + firstDayOfMonth;
    const rows = Math.ceil(totalCells / 7);

    let dayCounter = 1;

    // Generate calendar rows
    for (let row = 0; row < rows; row++) {
      const weekCells = [];

      // Generate 7 cells for each row
      for (let col = 0; col < 7; col++) {
        const cellIndex = row * 7 + col;

        // Empty cell before the first day of month
        if (row === 0 && col < firstDayOfMonth) {
          weekCells.push(
            <div
              key={`empty-${col}`}
              className="border border-border/30 bg-muted/10 rounded-md min-h-28"
            />
          );
        }
        // Day cells
        else if (dayCounter <= daysInMonth) {
          const isToday =
            today.getDate() === dayCounter &&
            today.getMonth() === currentDate.getMonth() &&
            today.getFullYear() === currentDate.getFullYear();

          const dayEvents = getEventsForDay(dayCounter);

          weekCells.push(
            <div
              key={`day-${dayCounter}`}
              className={`border p-1 rounded-md min-h-28 transition-colors ${
                isToday
                  ? "border-primary/50 bg-primary/5"
                  : "border-border/30 hover:bg-muted/10"
              }`}
            >
              <div className="text-right mb-1">
                <span
                  className={`text-sm inline-block rounded-full w-6 h-6 text-center leading-6 ${
                    isToday ? "bg-primary text-primary-foreground" : ""
                  }`}
                >
                  {dayCounter}
                </span>
              </div>
              <div className="space-y-1">
                {dayEvents.map((event) => (
                  <Badge
                    key={event.id}
                    variant="outline"
                    className={`text-xs truncate w-full justify-start ${event.colorClass}`}
                  >
                    {event.title}
                  </Badge>
                ))}
              </div>
            </div>
          );

          dayCounter++;
        }
        // Empty cells after last day of month
        else {
          weekCells.push(
            <div
              key={`empty-end-${cellIndex}`}
              className="border border-border/30 bg-muted/10 rounded-md min-h-28"
            />
          );
        }
      }

      // Add the week row to the calendar
      calendar.push(
        <div key={`week-${row}`} className="grid grid-cols-7 gap-1">
          {weekCells}
        </div>
      );
    }

    return calendar;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">{formatMonthYear(currentDate)}</h3>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentDate(new Date())}
          >
            <CalendarIcon className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card className="border bg-transparent">
        <CardContent className="p-4">{generateCalendarGrid()}</CardContent>
      </Card>

      <div className="flex flex-wrap gap-2">
        <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
          Blog Post
        </Badge>
        <Badge variant="outline" className="bg-purple-500/10 text-purple-500">
          Social Post
        </Badge>
        <Badge variant="outline" className="bg-red-500/10 text-red-500">
          Video
        </Badge>
        <Badge variant="outline" className="bg-amber-500/10 text-amber-500">
          Newsletter
        </Badge>
        <Badge variant="outline" className="bg-green-500/10 text-green-500">
          Case Study
        </Badge>
        <Badge variant="outline" className="bg-indigo-500/10 text-indigo-500">
          Infographic
        </Badge>
      </div>
    </div>
  );
};

export default ContentCalendar;
