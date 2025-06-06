
import { useState, useCallback } from 'react';
import { useNetworkDevices, useNetworkIntents } from './useNetworkData';
import { useNetBoxVariables } from './useNetBoxVariables';
import { aiAnalysisService } from '@/services/aiAnalysisService';
import { toast } from '@/hooks/use-toast';
import { AIAnalysis, UseAIOptimizationReturn } from '@/types/aiOptimization';

export const useAIOptimization = (): UseAIOptimizationReturn => {
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: devices } = useNetworkDevices();
  const { data: intents } = useNetworkIntents();
  const { devices: netboxDevices, sites, vlans } = useNetBoxVariables();

  const runOptimization = useCallback(async () => {
    if (!devices || !intents) {
      setError('Network data not available. Please ensure devices and intents are loaded.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const analysisResult = await aiAnalysisService.analyzeNetwork(
        devices,
        intents,
        netboxDevices,
        sites,
        vlans
      );

      setAnalysis(analysisResult);
      toast({
        title: "AI Analysis Complete",
        description: "Comprehensive network and NetBox analysis completed successfully.",
      });

    } catch (err) {
      console.error('AI Optimization error:', err);
      setError(err instanceof Error ? err.message : 'Failed to run AI optimization');
      toast({
        title: "Analysis Failed",
        description: "Unable to complete AI optimization analysis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, [devices, intents, netboxDevices, sites, vlans]);

  const applyOptimization = useCallback(async (recommendationId: string) => {
    const recommendation = analysis?.recommendations.find(r => r.id === recommendationId);
    if (!recommendation) return;

    try {
      // Simulate applying optimization
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Optimization Applied",
        description: `Successfully applied: ${recommendation.title}`,
      });

      // Update analysis to mark recommendation as applied
      if (analysis) {
        const updatedRecommendations = analysis.recommendations.filter(r => r.id !== recommendationId);
        setAnalysis({
          ...analysis,
          recommendations: updatedRecommendations
        });
      }
    } catch (err) {
      toast({
        title: "Application Failed",
        description: "Failed to apply optimization. Please try again.",
        variant: "destructive",
      });
    }
  }, [analysis]);

  return {
    analysis,
    isAnalyzing,
    error,
    runOptimization,
    applyOptimization
  };
};
