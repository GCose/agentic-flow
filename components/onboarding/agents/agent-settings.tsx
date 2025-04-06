import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

interface AgentSettingsProps {
  formData: {
    temperature: number;
    maxTokens: number;
  };
  updateFormData: (data: Partial<AgentSettingsProps["formData"]>) => void;
}

const AgentSettings = ({ formData, updateFormData }: AgentSettingsProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="temperature">
            Temperature: {formData.temperature}
          </Label>
          <div className="flex items-center gap-4 pt-2">
            <span className="text-sm text-muted-foreground">0.0</span>
            <Slider
              id="temperature"
              min={0}
              max={2}
              step={0.1}
              value={[formData.temperature]}
              onValueChange={(value) =>
                updateFormData({ temperature: value[0] })
              }
            />
            <span className="text-sm text-muted-foreground">2.0</span>
          </div>
          <p className="text-xs text-muted-foreground pt-1">
            Controls randomness: Lower values are more deterministic, higher
            values are more creative.
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="max-tokens">Max Tokens</Label>
        <Input
          id="max-tokens"
          type="number"
          min={1}
          max={4000}
          value={formData.maxTokens}
          onChange={(e) =>
            updateFormData({ maxTokens: Number.parseInt(e.target.value) })
          }
        />
        <p className="text-xs text-muted-foreground">
          Maximum number of tokens to generate. One token is roughly 4
          characters.
        </p>
      </div>

      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="memory">Conversation Memory</Label>
            <p className="text-xs text-muted-foreground">
              Allow agent to remember previous conversations
            </p>
          </div>
          <Switch id="memory" defaultChecked />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="web-search">Web Search</Label>
            <p className="text-xs text-muted-foreground">
              Allow agent to search the web for information
            </p>
          </div>
          <Switch id="web-search" />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="knowledge-base">Knowledge Base Access</Label>
            <p className="text-xs text-muted-foreground">
              Allow agent to access your organization{"'"}s knowledge base
            </p>
          </div>
          <Switch id="knowledge-base" defaultChecked />
        </div>
      </div>
    </div>
  );
};

export default AgentSettings;
