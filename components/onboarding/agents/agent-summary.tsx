import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface AgentSummaryProps {
  formData: {
    name: string;
    description: string;
    type: string;
    prompt: string;
    temperature: number;
    maxTokens: number;
  };
}

const AgentSummary = ({ formData }: AgentSummaryProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-medium">Agent Summary</h3>
        <p className="text-sm text-muted-foreground">
          Review your agent configuration before creating
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-transparent">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <Label className="text-muted-foreground">Agent Name</Label>
                <p className="font-medium">
                  {formData.name || "Untitled Agent"}
                </p>
              </div>

              <div>
                <Label className="text-muted-foreground">Description</Label>
                <p>{formData.description || "No description provided"}</p>
              </div>

              <div>
                <Label className="text-muted-foreground">Agent Type</Label>
                <p>{formData.type}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-transparent">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <Label className="text-muted-foreground">Temperature</Label>
                <p>{formData.temperature}</p>
              </div>

              <div>
                <Label className="text-muted-foreground">Max Tokens</Label>
                <p>{formData.maxTokens}</p>
              </div>

              <div>
                <Label className="text-muted-foreground">Features</Label>
                <ul className="list-disc pl-5 text-sm">
                  <li>Conversation Memory: Enabled</li>
                  <li>Web Search: Disabled</li>
                  <li>Knowledge Base Access: Enabled</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-transparent">
        <CardContent className="pt-6">
          <Label className="text-muted-foreground">System Prompt</Label>
          <div className="mt-2 rounded-md p-4 bg-white/5">
            <pre className="text-xs whitespace-pre-wrap font-mono">
              {formData.prompt || "No prompt provided"}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentSummary;
