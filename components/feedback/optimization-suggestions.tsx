import { Lightbulb, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const suggestions = [
  {
    id: "1",
    agent: "Customer Support Assistant",
    suggestion:
      "Add more product return policy details to the knowledge base to reduce escalations.",
    impact: "high",
    source: "feedback analysis",
  },
  {
    id: "2",
    agent: "Data Analysis Agent",
    suggestion:
      "Implement additional data validation checks to improve report accuracy.",
    impact: "medium",
    source: "error tracking",
  },
  {
    id: "3",
    agent: "Content Generator",
    suggestion:
      "Update content policy filters to reduce policy violation errors.",
    impact: "high",
    source: "feedback analysis",
  },
  {
    id: "4",
    agent: "Meeting Scheduler",
    suggestion: "Enhance calendar conflict detection algorithm.",
    impact: "medium",
    source: "feedback analysis",
  },
  {
    id: "5",
    agent: "Code Assistant",
    suggestion:
      "Add more code examples for database optimization to improve suggestions.",
    impact: "low",
    source: "usage patterns",
  },
];

const OptimizationSuggestions = () => {
  return (
    <Card className="border-none rounded-lg  bg-green-600/20">
      <CardHeader>
        <CardTitle>Optimization Suggestions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className="rounded-lg p-4 bg-transparent border hover:bg-green-800/50"
            >
              <div className="flex items-start gap-4">
                <Lightbulb className="mt-0.5 h-5 w-5 text-yellow-500" />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{suggestion.agent}</h4>
                    <Badge
                      variant={
                        suggestion.impact === "high"
                          ? "default"
                          : suggestion.impact === "medium"
                          ? "secondary"
                          : "outline"
                      }
                      className="ml-2"
                    >
                      {suggestion.impact} impact
                    </Badge>
                  </div>
                  <p className="text-sm">{suggestion.suggestion}</p>
                  <div className="flex items-center justify-between pt-2">
                    <p className="text-xs text-muted-foreground">
                      Source: {suggestion.source}
                    </p>
                    <Button variant="ghost" size="sm" className="h-7 gap-1">
                      <span>Implement</span>
                      <ArrowUpRight className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default OptimizationSuggestions;
