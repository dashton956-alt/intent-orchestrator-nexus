
interface OllamaResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
}

interface OllamaRequest {
  model: string;
  prompt: string;
  stream?: boolean;
  options?: {
    temperature?: number;
    top_p?: number;
  };
}

class OllamaService {
  private baseUrl: string;
  private defaultModel: string;

  constructor(baseUrl = 'http://localhost:11434', defaultModel = 'llama3.1') {
    this.baseUrl = baseUrl;
    this.defaultModel = defaultModel;
  }

  async generateConfiguration(naturalLanguageInput: string, template: string, enabledTools: string[]): Promise<string> {
    const prompt = this.buildConfigurationPrompt(naturalLanguageInput, template, enabledTools);
    
    try {
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.defaultModel,
          prompt,
          stream: false,
          options: {
            temperature: 0.3,
            top_p: 0.9,
          }
        } as OllamaRequest),
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status}`);
      }

      const data: OllamaResponse = await response.json();
      return data.response;
    } catch (error) {
      console.error('Error calling Ollama:', error);
      throw new Error('Failed to generate configuration with AI. Make sure Ollama is running.');
    }
  }

  async analyzeNetworkData(metrics: any[], devices: any[], intents: any[]): Promise<string> {
    const prompt = this.buildAnalyticsPrompt(metrics, devices, intents);
    
    try {
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.defaultModel,
          prompt,
          stream: false,
          options: {
            temperature: 0.4,
            top_p: 0.8,
          }
        } as OllamaRequest),
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status}`);
      }

      const data: OllamaResponse = await response.json();
      return data.response;
    } catch (error) {
      console.error('Error analyzing network data:', error);
      throw new Error('Failed to analyze network data with AI.');
    }
  }

  private buildConfigurationPrompt(input: string, template: string, enabledTools: string[]): string {
    return `You are a network automation expert. Generate configuration code for the following tools: ${enabledTools.join(', ')}.

User Request: ${input}
Template Type: ${template || 'Auto-detect based on request'}

Requirements:
1. Generate working configuration code for each enabled tool
2. Include proper syntax and best practices
3. Add comments explaining each section
4. Ensure configurations are production-ready
5. Include error handling where appropriate

For each tool, provide:
- Clear section headers (## Tool Name Configuration)
- Proper indentation and formatting
- Inline comments explaining key parameters
- Validation checks where needed

Generate the complete configuration below:`;
  }

  private buildAnalyticsPrompt(metrics: any[], devices: any[], intents: any[]): string {
    const metricsCount = metrics.length;
    const devicesCount = devices.length;
    const intentsCount = intents.length;
    
    const recentMetrics = metrics.slice(0, 10);
    const recentIntents = intents.slice(0, 5);

    return `You are a network analytics expert. Analyze the following network data and provide actionable insights and recommendations.

Network Overview:
- Total Devices: ${devicesCount}
- Recent Metrics: ${metricsCount} data points
- Recent Intents: ${intentsCount} configurations

Recent Performance Data:
${JSON.stringify(recentMetrics, null, 2)}

Recent Configuration Intents:
${JSON.stringify(recentIntents, null, 2)}

Please provide:
1. **Performance Analysis**: Key trends and patterns
2. **Security Recommendations**: Potential vulnerabilities or improvements
3. **Optimization Suggestions**: Ways to improve network efficiency
4. **Anomaly Detection**: Any unusual patterns or concerning metrics
5. **Capacity Planning**: Recommendations for future growth
6. **Configuration Quality**: Assessment of recent intent implementations

Format your response in clear sections with specific, actionable recommendations.`;
  }

  async checkConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);
      return response.ok;
    } catch {
      return false;
    }
  }

  async getAvailableModels(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);
      if (!response.ok) return [];
      
      const data = await response.json();
      return data.models?.map((model: any) => model.name) || [];
    } catch {
      return [];
    }
  }
}

export const ollamaService = new OllamaService();
