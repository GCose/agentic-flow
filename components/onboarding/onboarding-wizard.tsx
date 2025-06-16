import { useState } from "react";
import { Brain, MessageSquare, Settings, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AgentBasicInfo from "./agents/agent-basic-info";
import AgentPromptTemplate from "./agents/agent-prompt-template";
import AgentSettings from "./agents/agent-settings";
import AgentSummary from "./agents/agent-summary";

const steps = [
  {
    id: "basic-info",
    title: "Basic Information",
    icon: Brain,
  },
  {
    id: "prompt-template",
    title: "Prompt Template",
    icon: MessageSquare,
  },
  {
    id: "settings",
    title: "Settings",
    icon: Settings,
  },
  {
    id: "summary",
    title: "Summary",
    icon: CheckCircle2,
  },
];

const OnboardingWizard = () => {
  const [currentStep, setCurrentStep] = useState("basic-info");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "gpt-4",
    prompt: "",
    temperature: 0.7,
    maxTokens: 1000,
  });

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleNext = () => {
    const currentIndex = steps.findIndex((step) => step.id === currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id);
    }
  };

  const handlePrevious = () => {
    const currentIndex = steps.findIndex((step) => step.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <Tabs
        value={currentStep}
        className="w-full"
        onValueChange={setCurrentStep}
      >
        <TabsList className="grid w-full grid-cols-4 bg-slate-800/30">
          {steps.map((step) => (
            <TabsTrigger
              key={step.id}
              value={step.id}
              className="flex items-center gap-2"
              disabled={currentStep !== step.id}
            >
              <step.icon className="h-4 w-4" />
              <span className="hidden sm:inline-block">{step.title}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="basic-info" className="mt-6">
          <Card className="border-blue-900/30 bg-transparent ">
            <CardContent className="pt-6">
              <AgentBasicInfo
                formData={formData}
                updateFormData={updateFormData}
              />
              <div className="mt-6 flex justify-end">
                <Button onClick={handleNext}>Next Step</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prompt-template" className="mt-6">
          <Card className="border-blue-900/30 bg-transparent ">
            <CardContent className="pt-6">
              <AgentPromptTemplate
                formData={formData}
                updateFormData={updateFormData}
              />
              <div className="mt-6 flex justify-between">
                <Button variant="outline" onClick={handlePrevious}>
                  Previous
                </Button>
                <Button onClick={handleNext}>Next Step</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <Card className="border-blue-900/30 bg-transparent ">
            <CardContent className="pt-6">
              <AgentSettings
                formData={formData}
                updateFormData={updateFormData}
              />
              <div className="mt-6 flex justify-between">
                <Button variant="outline" onClick={handlePrevious}>
                  Previous
                </Button>
                <Button onClick={handleNext}>Next Step</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary" className="mt-6">
          <Card className="border-blue-900/30 bg-transparent ">
            <CardContent className="pt-6">
              <AgentSummary formData={formData} />
              <div className="mt-6 flex justify-between">
                <Button variant="outline" onClick={handlePrevious}>
                  Previous
                </Button>
                <Button>Create Agent</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OnboardingWizard;
