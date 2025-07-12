import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, Activity, Settings } from "lucide-react";

const DashboardHeader = () => {
  return (
    <div className="flex items-center justify-between p-6 border-b border-border bg-background">
      <div className="flex items-center gap-4">
        <img 
          src="/lovable-uploads/974d6a5c-c6b9-436c-887b-d79c72b2a72a.png" 
          alt="SignalVault" 
          className="h-10 w-10 object-contain"
        />
        <div>
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">
            SignalVault
          </h1>
          <p className="text-sm text-muted-foreground">Organizational Linguistic Intelligence</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
            <span className="text-sm text-accent font-medium">Live Analysis</span>
          </div>
          
          <Badge variant="secondary" className="text-xs">
            <Activity className="h-3 w-3 mr-1" />
            Neural Active
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-sm">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </Button>
          
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;