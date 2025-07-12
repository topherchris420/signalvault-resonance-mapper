import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Scan, Shield, Activity, Settings } from "lucide-react";

const DashboardHeader = () => {
  return (
    <div className="flex items-center justify-between p-6 border-b border-border/50 bg-card/30">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-lg bg-primary/20 shadow-glow">
          <Scan className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            Signal<span className="text-primary">Vault</span>
          </h1>
          <p className="text-muted-foreground">Organizational Linguistic Intelligence System</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
            <span className="text-sm text-success font-medium">Systems Operational</span>
          </div>
          
          <Badge variant="outline" className="bg-card/50">
            <Activity className="h-3 w-3 mr-1" />
            Live Analysis
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </Button>
          
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;