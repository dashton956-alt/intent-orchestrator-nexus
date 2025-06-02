
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

export const IntentCreator = () => {
  const [naturalLanguageInput, setNaturalLanguageInput] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [generatedConfig, setGeneratedConfig] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const templates = [
    { id: "vlan", name: "VLAN Configuration", description: "Create or modify VLANs" },
    { id: "acl", name: "Access Control List", description: "Security access controls" },
    { id: "qos", name: "Quality of Service", description: "Traffic prioritization policies" },
    { id: "routing", name: "Routing Configuration", description: "Static and dynamic routing" },
    { id: "interface", name: "Interface Configuration", description: "Port and interface settings" }
  ];

  const examplePrompts = [
    "Create VLAN 100 for the Marketing department with access to internet and file servers",
    "Configure QoS policy to prioritize VoIP traffic on all access switches",
    "Set up access control list to block traffic from guest network to internal servers",
    "Create trunk interface on port Gi0/1 with VLANs 10, 20, 30",
    "Configure OSPF on core switches with area 0"
  ];

  const handleGenerateIntent = async () => {
    if (!naturalLanguageInput.trim()) {
      toast({
        title: "Input Required",
        description: "Please describe your network intent in natural language.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI processing
    setTimeout(() => {
      const mockConfig = generateMockNSOConfig(naturalLanguageInput, selectedTemplate);
      setGeneratedConfig(mockConfig);
      setIsGenerating(false);
      
      toast({
        title: "Intent Generated",
        description: "AI has successfully converted your request into NSO configuration.",
      });
    }, 2000);
  };

  const generateMockNSOConfig = (input: string, template: string) => {
    // Mock NSO YANG configuration based on input
    const timestamp = new Date().toISOString();
    
    if (input.toLowerCase().includes("vlan")) {
      return `
# Generated NSO Configuration
# Intent: ${input}
# Template: ${template || 'Auto-detected: VLAN'}
# Generated: ${timestamp}

configure
  devices device core-sw-01
    config
      ios:interface Vlan100
        description "Marketing Department VLAN"
        ip address 192.168.100.1 255.255.255.0
        no shutdown
      exit
      ios:vlan 100
        name "Marketing-VLAN"
      exit
      ios:interface range GigabitEthernet0/1-24
        switchport mode access
        switchport access vlan 100
      exit
    commit
  exit
exit`;
    }
    
    return `
# Generated NSO Configuration
# Intent: ${input}
# Template: ${template || 'Auto-detected'}
# Generated: ${timestamp}

configure
  # AI-generated configuration will appear here
  # Based on your natural language input
  
  devices device-group all-switches
    config
      # Configuration details based on intent
    commit
  exit
exit`;
  };

  const handleSaveIntent = () => {
    if (!generatedConfig) {
      toast({
        title: "No Configuration",
        description: "Please generate a configuration first.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Intent Saved",
      description: "Configuration has been saved to intent storage with change number CHG-2024-" + Date.now().toString().slice(-3),
    });
    
    // Reset form
    setNaturalLanguageInput("");
    setGeneratedConfig("");
    setSelectedTemplate("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">AI Intent Creator</h2>
        <p className="text-blue-200/70">Describe your network requirements in natural language and let AI generate the NSO configuration</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card className="bg-black/20 backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Describe Your Intent</CardTitle>
            <CardDescription className="text-blue-200/70">
              Use natural language to describe what you want to configure
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Template Selection */}
            <div>
              <label className="text-sm text-blue-200/80 mb-2 block">Configuration Template (Optional)</label>
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger className="bg-black/20 border-white/20 text-white">
                  <SelectValue placeholder="Auto-detect or select template" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-white/20">
                  {templates.map(template => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name} - {template.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Natural Language Input */}
            <div>
              <label className="text-sm text-blue-200/80 mb-2 block">Network Intent Description</label>
              <Textarea
                placeholder="Example: Create a VLAN for the Marketing department with ID 100 and allow access to the internet..."
                value={naturalLanguageInput}
                onChange={(e) => setNaturalLanguageInput(e.target.value)}
                className="bg-black/20 border-white/20 text-white placeholder:text-blue-200/50 min-h-32"
              />
            </div>

            {/* Example Prompts */}
            <div>
              <label className="text-sm text-blue-200/80 mb-2 block">Example Prompts</label>
              <div className="space-y-2">
                {examplePrompts.map((prompt, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    onClick={() => setNaturalLanguageInput(prompt)}
                    className="text-left justify-start h-auto p-3 text-blue-200/80 hover:text-white hover:bg-blue-600/10 border border-white/10 w-full"
                  >
                    <span className="text-xs leading-relaxed">{prompt}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <Button
              onClick={handleGenerateIntent}
              disabled={isGenerating}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {isGenerating ? "Generating Configuration..." : "Generate NSO Configuration"}
            </Button>
          </CardContent>
        </Card>

        {/* Output Section */}
        <Card className="bg-black/20 backdrop-blur-sm border-white/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">Generated Configuration</CardTitle>
                <CardDescription className="text-blue-200/70">
                  NSO YANG format configuration ready for deployment
                </CardDescription>
              </div>
              {generatedConfig && (
                <Badge className="bg-green-600/20 text-green-300 border-green-400/30">
                  Ready to Deploy
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {generatedConfig ? (
              <>
                <div className="bg-black/40 rounded-lg p-4 border border-white/10">
                  <pre className="text-sm text-green-300 font-mono whitespace-pre-wrap overflow-x-auto">
                    {generatedConfig}
                  </pre>
                </div>
                
                <div className="flex gap-3">
                  <Button
                    onClick={handleSaveIntent}
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                  >
                    Save Intent
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigator.clipboard.writeText(generatedConfig)}
                    className="border-blue-400/30 text-blue-300 hover:bg-blue-600/10"
                  >
                    Copy Config
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-blue-200/60">
                <div className="text-lg mb-2">No configuration generated yet</div>
                <p className="text-sm">Describe your network intent and click generate to see the NSO configuration</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      {generatedConfig && (
        <Card className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 backdrop-blur-sm border-purple-400/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              🤖 AI Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-purple-300 font-medium mb-1">Complexity Analysis</div>
                <div className="text-blue-200/80">Low - Standard VLAN configuration</div>
              </div>
              <div>
                <div className="text-purple-300 font-medium mb-1">Impact Assessment</div>
                <div className="text-blue-200/80">Medium - Affects multiple switches</div>
              </div>
              <div>
                <div className="text-purple-300 font-medium mb-1">Recommendation</div>
                <div className="text-blue-200/80">Deploy during maintenance window</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
