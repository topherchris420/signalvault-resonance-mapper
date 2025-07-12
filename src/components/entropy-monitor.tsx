import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, AlertCircle, TrendingUp, Zap } from "lucide-react";

interface EntropyAlert {
  id: string;
  severity: "low" | "medium" | "high";
  type: string;
  message: string;
  timestamp: string;
  cluster: string;
}

const EntropyMonitor = () => {
  const alerts: EntropyAlert[] = [
    {
      id: "1",
      severity: "high",
      type: "Tone Concealment",
      message: "Passive voice usage increased 340% in leadership communications",
      timestamp: "2 min ago",
      cluster: "Executive"
    },
    {
      id: "2",
      severity: "medium",
      type: "Narrative Disruption",
      message: "Mission-critical terminology fragments detected",
      timestamp: "8 min ago",
      cluster: "Product"
    },
    {
      id: "3",
      severity: "low",
      type: "Pronoun Distribution",
      message: "Individual vs collective pronoun imbalance emerging",
      timestamp: "15 min ago",
      cluster: "Engineering"
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "destructive";
      case "medium": return "warning";
      case "low": return "secondary";
      default: return "muted";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "high": return <AlertCircle className="h-4 w-4" />;
      case "medium": return <TrendingUp className="h-4 w-4" />;
      case "low": return <Activity className="h-4 w-4" />;
      default: return <Zap className="h-4 w-4" />;
    }
  };

  return (
    <Card className="p-6 bg-gradient-neural border-muted shadow-neural">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-destructive/20">
          <Activity className="h-6 w-6 text-destructive" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Entropy Monitor</h3>
          <p className="text-sm text-muted-foreground">Real-time linguistic fragmentation detection</p>
        </div>
      </div>

      <div className="space-y-4">
        {alerts.map((alert, index) => (
          <div 
            key={alert.id}
            className="p-4 rounded-lg bg-card/40 border border-border/50 hover:bg-card/60 transition-all duration-300"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                {getSeverityIcon(alert.severity)}
                <Badge variant={getSeverityColor(alert.severity) as any} className="text-xs">
                  {alert.type}
                </Badge>
              </div>
              <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
            </div>
            
            <p className="text-sm text-foreground mb-2">{alert.message}</p>
            
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-xs">
                {alert.cluster} Cluster
              </Badge>
              <div className="flex items-center gap-1">
                <div className={`h-2 w-2 rounded-full animate-pulse ${
                  alert.severity === "high" ? "bg-destructive" :
                  alert.severity === "medium" ? "bg-warning" : "bg-secondary"
                }`} />
                <span className="text-xs text-muted-foreground">Active</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-foreground">Fragmentation Index</span>
          <span className="text-lg font-bold text-warning">2.34</span>
        </div>
        <div className="relative w-full bg-muted/30 rounded-full h-3">
          <div 
            className="absolute inset-0 bg-gradient-to-r from-success via-warning to-destructive rounded-full"
            style={{ width: '70%' }}
          />
          <div className="absolute right-[30%] top-0 h-3 w-1 bg-foreground rounded-full" />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>Stable</span>
          <span>Critical</span>
        </div>
      </div>
    </Card>
  );
};

export default EntropyMonitor;