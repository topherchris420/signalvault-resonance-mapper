import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, Activity, Settings } from "lucide-react";

const DashboardHeader = () => {
  return (
    <div className="flex items-center justify-between p-4 md:p-6 border-b border-border bg-background">
      <div className="flex items-center gap-3 md:gap-4">
        <img 
          src="/lovable-uploads/974d6a5c-c6b9-436c-887b-d79c72b2a72a.png" 
          alt="SignalVault" 
          className="h-8 w-8 md:h-10 md:w-10 object-contain"
        />
        <div className="min-w-0">
          <h1 className="text-lg md:text-2xl font-semibold text-foreground tracking-tight truncate">
            SignalVault
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">Organizational Linguistic Intelligence</p>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <div className="hidden sm:flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
            <span className="text-xs md:text-sm text-accent font-medium">Live</span>
          </div>
          
          <Badge variant="secondary" className="text-xs hidden md:flex">
            <Activity className="h-3 w-3 mr-1" />
            Neural Active
          </Badge>
        </div>

        <div className="flex items-center gap-1 md:gap-2">
          <Button variant="ghost" size="sm" className="text-xs md:text-sm hidden sm:flex">
            <Shield className="h-4 w-4 mr-0 md:mr-2" />
            <span className="hidden md:inline">Security</span>
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