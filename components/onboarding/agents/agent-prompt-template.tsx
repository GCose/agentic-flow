import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AgentPromptTemplateProps {
  formData: {
    prompt: string;
  };
  updateFormData: (data: Partial<{ prompt: string }>) => void;
}

const promptTemplates = [
  {
    id: "customer-support",
    name: "Customer Support",
    template:
      "You are a helpful customer support agent for our company. Your goal is to assist customers with their inquiries in a friendly and professional manner. Use the following information to help answer customer questions:\n\n[Knowledge Base Content]\n\nIf you don't know the answer, politely let the customer know you'll escalate their question to a human agent.",
  },
  {
    id: "data-analysis",
    name: "Data Analysis",
    template:
      "You are a data analysis assistant. Your role is to help analyze data, generate insights, and create reports based on the provided information. When presented with data, you should:\n\n1. Identify key trends and patterns\n2. Highlight important metrics\n3. Suggest potential insights\n4. Recommend follow-up analyses when appropriate",
  },
  {
    id: "content-creation",
    name: "Content Creation",
    template:
      "You are a content creation assistant specializing in marketing materials. Your goal is to help create engaging, on-brand content for various marketing channels. You should maintain a consistent tone that aligns with our brand voice: professional yet approachable, innovative, and customer-focused.",
  },
];

const AgentPromptTemplate = ({
  formData,
  updateFormData,
}: AgentPromptTemplateProps) => {
  const handleTemplateChange = (templateId: string) => {
    const template = promptTemplates.find((t) => t.id === templateId);
    if (template) {
      updateFormData({ prompt: template.template });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Template</Label>
        <Select onValueChange={handleTemplateChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select a template" />
          </SelectTrigger>
          <SelectContent>
            {promptTemplates.map((template) => (
              <SelectItem key={template.id} value={template.id}>
                {template.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground">
          Select a template or create your own custom prompt
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="prompt">System Prompt</Label>
        <Textarea
          id="prompt"
          placeholder="Enter the system prompt for your agent"
          className="min-h-[300px] font-mono text-sm"
          value={formData.prompt}
          onChange={(e) => updateFormData({ prompt: e.target.value })}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            updateFormData({ prompt: formData.prompt + " {{user_input}}" })
          }
        >
          Insert User Input
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            updateFormData({ prompt: formData.prompt + " {{context}}" })
          }
        >
          Insert Context
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            updateFormData({ prompt: formData.prompt + " {{current_date}}" })
          }
        >
          Insert Date
        </Button>
      </div>
    </div>
  );
};

export default AgentPromptTemplate;
