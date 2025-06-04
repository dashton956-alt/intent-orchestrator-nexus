import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { ollamaService } from "@/services/ollamaService";
import { Brain, Sparkles } from "lucide-react";

export const IntentCreator = () => {
  const [naturalLanguageInput, setNaturalLanguageInput] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [generatedConfig, setGeneratedConfig] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isOllamaConnected, setIsOllamaConnected] = useState(false);
  const [useAI, setUseAI] = useState(true);
  
  // Toggle states for automation tools
  const [enableNSO, setEnableNSO] = useState(true);
  const [enableAnsible, setEnableAnsible] = useState(false);
  const [enableTerraform, setEnableTerraform] = useState(false);
  const [enableNornir, setEnableNornir] = useState(false);

  useEffect(() => {
    checkOllamaConnection();
  }, []);

  const checkOllamaConnection = async () => {
    const connected = await ollamaService.checkConnection();
    setIsOllamaConnected(connected);
  };

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

    // Check if at least one automation tool is enabled
    if (!enableNSO && !enableAnsible && !enableTerraform && !enableNornir) {
      toast({
        title: "Automation Tool Required",
        description: "Please enable at least one automation tool (NSO, Ansible, Terraform, or Nornir).",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      let config;
      
      if (useAI && isOllamaConnected) {
        // Use AI to generate configuration
        const enabledTools = [];
        if (enableNSO) enabledTools.push('NSO');
        if (enableAnsible) enabledTools.push('Ansible');
        if (enableTerraform) enabledTools.push('Terraform');
        if (enableNornir) enabledTools.push('Nornir');
        
        config = await ollamaService.generateConfiguration(
          naturalLanguageInput, 
          selectedTemplate, 
          enabledTools
        );
        
        toast({
          title: "AI Configuration Generated",
          description: "Ollama has successfully generated your network configuration.",
        });
      } else {
        // Fallback to mock configuration
        config = generateMockConfiguration(naturalLanguageInput, selectedTemplate, {
          nso: enableNSO,
          ansible: enableAnsible,
          terraform: enableTerraform,
          nornir: enableNornir
        });
        
        toast({
          title: useAI ? "Using Mock Data" : "Intent Generated",
          description: useAI 
            ? "Ollama not available, using template-based configuration." 
            : "Template-based configuration generated successfully.",
        });
      }
      
      setGeneratedConfig(config);
    } catch (error) {
      console.error('Generation failed:', error);
      
      // Fallback to mock if AI fails
      const mockConfig = generateMockConfiguration(naturalLanguageInput, selectedTemplate, {
        nso: enableNSO,
        ansible: enableAnsible,
        terraform: enableTerraform,
        nornir: enableNornir
      });
      setGeneratedConfig(mockConfig);
      
      toast({
        title: "Fallback Configuration",
        description: "AI generation failed, using template-based configuration instead.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateMockConfiguration = (input: string, template: string, tools: { nso: boolean, ansible: boolean, terraform: boolean, nornir: boolean }) => {
    const timestamp = new Date().toISOString();
    const enabledTools = Object.entries(tools).filter(([_, enabled]) => enabled).map(([tool, _]) => tool.toUpperCase());
    
    let config = `# Generated Multi-Tool Configuration
# Intent: ${input}
# Template: ${template || 'Auto-detected'}
# Enabled Tools: ${enabledTools.join(', ')}
# Generated: ${timestamp}

`;

    if (tools.nso) {
      config += `
## NSO Configuration
configure
  devices device core-sw-01
    config
      ios:interface Vlan100
        description "Marketing Department VLAN"
        ip address 192.168.100.1 255.255.255.0
        no shutdown
      exit
    commit
  exit
exit

`;
    }

    if (tools.ansible) {
      config += `
## Ansible Playbook
---
- name: Configure VLAN
  hosts: switches
  tasks:
    - name: Create VLAN 100
      ios_vlan:
        vlan_id: 100
        name: Marketing-VLAN
        state: present

`;
    }

    if (tools.terraform) {
      config += `
## Terraform Configuration
resource "ios_vlan" "marketing_vlan" {
  vlan_id = 100
  name    = "Marketing-VLAN"
}

resource "ios_interface" "vlan_interface" {
  name        = "Vlan100"
  description = "Marketing Department VLAN"
  ip_address  = "192.168.100.1/24"
}

`;
    }

    if (tools.nornir) {
      config += `
## Nornir Script
from nornir import InitNornir
from nornir_napalm.plugins.tasks import napalm_configure

def configure_vlan(task):
    config = '''
    vlan 100
    name Marketing-VLAN
    interface vlan100
    description Marketing Department VLAN
    ip address 192.168.100.1 255.255.255.0
    no shutdown
    '''
    task.run(task=napalm_configure, configuration=config)

nr = InitNornir(config_file="config.yaml")
result = nr.run(task=configure_vlan)

`;
    }

    return config;
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <Brain className="h-7 w-7" />
            AI Intent Creator
          </h2>
          <p className="text-blue-200/70">Describe your network requirements in natural language and let AI generate configurations for multiple automation tools</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge 
            variant={isOllamaConnected ? "default" : "secondary"}
            className={isOllamaConnected ? "bg-green-600/20 text-green-300 border-green-400/30" : ""}
          >
            {isOllamaConnected ? "AI Ready" : "Template Mode"}
          </Badge>
          <Button
            onClick={checkOllamaConnection}
            variant="outline"
            size="sm"
            className="border-blue-400/30 text-blue-300 hover:bg-blue-600/10"
          >
            Check AI
          </Button>
        </div>
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
            {/* AI Toggle */}
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-lg border border-purple-400/20">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4 text-purple-400" />
                <Label htmlFor="ai-toggle" className="text-purple-200">Use AI Generation</Label>
              </div>
              <Switch
                id="ai-toggle"
                checked={useAI}
                onCheckedChange={setUseAI}
                disabled={!isOllamaConnected}
              />
            </div>

            {/* Automation Tools Toggle Section */}
            <div>
              <label className="text-sm text-blue-200/80 mb-3 block">Automation Tools</label>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="nso-toggle"
                    checked={enableNSO}
                    onCheckedChange={setEnableNSO}
                  />
                  <Label htmlFor="nso-toggle" className="text-blue-200/80">NSO</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="ansible-toggle"
                    checked={enableAnsible}
                    onCheckedChange={setEnableAnsible}
                  />
                  <Label htmlFor="ansible-toggle" className="text-blue-200/80">Ansible</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="terraform-toggle"
                    checked={enableTerraform}
                    onCheckedChange={setEnableTerraform}
                  />
                  <Label htmlFor="terraform-toggle" className="text-blue-200/80">Terraform</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="nornir-toggle"
                    checked={enableNornir}
                    onCheckedChange={setEnableNornir}
                  />
                  <Label htmlFor="nornir-toggle" className="text-blue-200/80">Nornir</Label>
                </div>
              </div>
            </div>

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
              className={`w-full ${
                useAI && isOllamaConnected 
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700" 
                  : "bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800"
              }`}
            >
              {isGenerating ? "Generating Configuration..." : 
                useAI && isOllamaConnected ? "Generate AI Configuration" : "Generate Template Configuration"}
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
                  Multi-tool automation configurations ready for deployment
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
                <p className="text-sm">Describe your network intent and click generate to see the multi-tool configuration</p>
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
              🤖 {useAI && isOllamaConnected ? "AI Insights" : "Template Insights"}
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
