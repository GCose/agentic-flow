import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AgentBasicInfoProps {
  formData: {
    name: string;
    description: string;
    type: string;
  };
  updateFormData: (
    data: Partial<{ name: string; description: string; type: string }>
  ) => void;
}

const AgentBasicInfo = ({ formData, updateFormData }: AgentBasicInfoProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Agent Name</Label>
        <Input
          id="name"
          placeholder="Enter agent name"
          value={formData.name}
          onChange={(e) => updateFormData({ name: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Describe what this agent does"
          className="min-h-[100px]"
          value={formData.description}
          onChange={(e) => updateFormData({ description: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Agent Type</Label>
        <Select
          value={formData.type}
          onValueChange={(value) => updateFormData({ type: value })}
        >
          <SelectTrigger id="type">
            <SelectValue placeholder="Select agent type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gpt-4">GPT-4</SelectItem>
            <SelectItem value="gpt-3.5">GPT-3.5</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default AgentBasicInfo;
  