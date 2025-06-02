
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

interface MergeRequest {
  id: string;
  title: string;
  description: string;
  status: "draft" | "review" | "approved" | "rejected";
  changeNumber: string;
  author: string;
  reviewers: string[];
  createdAt: string;
  netboxUrl: string;
}

export const MergeRequestsView = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [mergeRequests] = useState<MergeRequest[]>([
    {
      id: "mr-001",
      title: "Add VLAN 200 for Marketing Department",
      description: "Configure VLAN 200 across distribution switches for marketing team network segmentation",
      status: "approved",
      changeNumber: "CHG-2024-001",
      author: "john.doe@company.com",
      reviewers: ["jane.smith@company.com", "mike.wilson@company.com"],
      createdAt: "2024-01-15T10:30:00Z",
      netboxUrl: "https://netbox.company.com/mr/001"
    },
    {
      id: "mr-002",
      title: "Update QoS Policies for Voice Traffic",
      description: "Implement enhanced QoS policies for VoIP traffic across core infrastructure",
      status: "review",
      changeNumber: "CHG-2024-002",
      author: "sarah.johnson@company.com",
      reviewers: ["admin@company.com"],
      createdAt: "2024-01-14T14:15:00Z",
      netboxUrl: "https://netbox.company.com/mr/002"
    },
    {
      id: "mr-003",
      title: "Security ACL Updates for Guest Network",
      description: "Enhance security access control lists for guest wireless network isolation",
      status: "draft",
      changeNumber: "CHG-2024-003",
      author: "alex.chen@company.com",
      reviewers: [],
      createdAt: "2024-01-13T09:45:00Z",
      netboxUrl: "https://netbox.company.com/mr/003"
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "bg-green-600/20 text-green-300 border-green-400/30";
      case "review": return "bg-yellow-600/20 text-yellow-300 border-yellow-400/30";
      case "draft": return "bg-gray-600/20 text-gray-300 border-gray-400/30";
      case "rejected": return "bg-red-600/20 text-red-300 border-red-400/30";
      default: return "bg-gray-600/20 text-gray-300 border-gray-400/30";
    }
  };

  const handleDeploy = (mr: MergeRequest) => {
    toast({
      title: "Deployment Initiated",
      description: `Starting deployment of ${mr.changeNumber} via Cisco NSO...`,
    });
  };

  const handleDryRun = (mr: MergeRequest) => {
    toast({
      title: "Dry Run Started",
      description: `Validating configuration for ${mr.changeNumber}...`,
    });
  };

  const filteredRequests = mergeRequests.filter(mr => {
    const matchesSearch = mr.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mr.changeNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || mr.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Merge Requests</h2>
          <p className="text-blue-200/70">NetBox integration for network configuration changes</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Input
            placeholder="Search merge requests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-black/20 border-white/20 text-white placeholder:text-blue-200/50 w-full sm:w-64"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="bg-black/20 border-white/20 text-white w-full sm:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-white/20">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="review">Review</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Merge Requests List */}
      <div className="grid gap-4">
        {filteredRequests.map((mr) => (
          <Card key={mr.id} className="bg-black/20 backdrop-blur-sm border-white/10 hover:border-white/20 transition-all duration-200">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <CardTitle className="text-white text-lg">{mr.title}</CardTitle>
                    <Badge className={getStatusColor(mr.status)} variant="outline">
                      {mr.status.charAt(0).toUpperCase() + mr.status.slice(1)}
                    </Badge>
                  </div>
                  <CardDescription className="text-blue-200/70">
                    {mr.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <div className="text-xs text-blue-200/60 uppercase tracking-wide mb-1">Change Number</div>
                  <div className="text-white font-mono text-sm">{mr.changeNumber}</div>
                </div>
                <div>
                  <div className="text-xs text-blue-200/60 uppercase tracking-wide mb-1">Author</div>
                  <div className="text-white text-sm">{mr.author}</div>
                </div>
                <div>
                  <div className="text-xs text-blue-200/60 uppercase tracking-wide mb-1">Reviewers</div>
                  <div className="text-white text-sm">
                    {mr.reviewers.length > 0 ? mr.reviewers.join(", ") : "None assigned"}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-blue-200/60 uppercase tracking-wide mb-1">Created</div>
                  <div className="text-white text-sm">
                    {new Date(mr.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(mr.netboxUrl, '_blank')}
                  className="border-blue-400/30 text-blue-300 hover:bg-blue-600/10"
                >
                  View in NetBox
                </Button>
                
                {mr.status === "approved" && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDryRun(mr)}
                      className="border-yellow-400/30 text-yellow-300 hover:bg-yellow-600/10"
                    >
                      Dry Run
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleDeploy(mr)}
                      className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                    >
                      Deploy Intent
                    </Button>
                  </>
                )}
                
                {mr.status === "review" && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-orange-400/30 text-orange-300 hover:bg-orange-600/10"
                  >
                    Pending Review
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRequests.length === 0 && (
        <Card className="bg-black/20 backdrop-blur-sm border-white/10">
          <CardContent className="text-center py-12">
            <div className="text-blue-200/60 text-lg mb-2">No merge requests found</div>
            <p className="text-blue-200/40">Try adjusting your search criteria or status filter.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
