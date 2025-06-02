
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { NetworkTopology } from "@/components/NetworkTopology";
import { MergeRequestsView } from "@/components/MergeRequestsView";
import { IntentCreator } from "@/components/IntentCreator";
import { NetworkMetrics } from "@/components/NetworkMetrics";
import { IntentStorage } from "@/components/IntentStorage";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-teal-400 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Network Intent Orchestrator</h1>
                <p className="text-blue-200/80 text-sm">AI-Powered Network Management Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="border-green-400/30 text-green-400">
                NetBox Connected
              </Badge>
              <Badge variant="outline" className="border-blue-400/30 text-blue-400">
                NSO Ready
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-black/20 backdrop-blur-sm border border-white/10">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-blue-600/30">
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="merge-requests" className="data-[state=active]:bg-blue-600/30">
              Merge Requests
            </TabsTrigger>
            <TabsTrigger value="intent-creator" className="data-[state=active]:bg-blue-600/30">
              AI Intent Creator
            </TabsTrigger>
            <TabsTrigger value="intents" className="data-[state=active]:bg-blue-600/30">
              Intent Storage
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="data-[state=active]:bg-blue-600/30">
              Network Monitoring
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Network Health Cards */}
              <Card className="bg-black/20 backdrop-blur-sm border-white/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-lg">Network Health</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-400 mb-2">98.7%</div>
                  <p className="text-blue-200/70 text-sm">Overall Uptime</p>
                  <Progress value={98.7} className="mt-3" />
                </CardContent>
              </Card>

              <Card className="bg-black/20 backdrop-blur-sm border-white/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-lg">Active Intents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-400 mb-2">247</div>
                  <p className="text-blue-200/70 text-sm">Deployed Configurations</p>
                  <div className="flex items-center justify-between mt-3 text-sm">
                    <span className="text-green-400">Active: 234</span>
                    <span className="text-yellow-400">Pending: 13</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/20 backdrop-blur-sm border-white/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-lg">AI Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-400 mb-2">12</div>
                  <p className="text-blue-200/70 text-sm">Optimization Suggestions</p>
                  <Badge className="mt-3 bg-purple-600/20 text-purple-300 border-purple-400/30">
                    3 Critical
                  </Badge>
                </CardContent>
              </Card>
            </div>

            {/* Network Topology */}
            <Card className="bg-black/20 backdrop-blur-sm border-white/10 mb-6">
              <CardHeader>
                <CardTitle className="text-white">Network Topology</CardTitle>
                <CardDescription className="text-blue-200/70">
                  Live network visualization with real-time status updates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <NetworkTopology />
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                onClick={() => setActiveTab("intent-creator")}
                className="h-16 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
              >
                Create New Intent
              </Button>
              <Button 
                onClick={() => setActiveTab("merge-requests")}
                variant="outline" 
                className="h-16 border-white/20 text-white hover:bg-white/10"
              >
                Review Merge Requests
              </Button>
              <Button 
                onClick={() => toast({ title: "Feature Coming Soon", description: "AI optimization will be available in the next release." })}
                variant="outline" 
                className="h-16 border-purple-400/30 text-purple-300 hover:bg-purple-600/10"
              >
                AI Optimization
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="merge-requests" className="mt-6">
            <MergeRequestsView />
          </TabsContent>

          <TabsContent value="intent-creator" className="mt-6">
            <IntentCreator />
          </TabsContent>

          <TabsContent value="intents" className="mt-6">
            <IntentStorage />
          </TabsContent>

          <TabsContent value="monitoring" className="mt-6">
            <NetworkMetrics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
