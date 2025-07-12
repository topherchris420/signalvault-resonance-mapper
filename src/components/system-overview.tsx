import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database, Users, Zap, ShieldCheck } from "lucide-react";

const SystemOverview = () => {
  const systemMetrics = [
    {
      label: "Data Sources",
      value: "847",
      unit: "streams",
      icon: Database,
      status: "active",
      description: "Email, Slack, meetings analyzed"
    },
    {
      label: "Processing Rate",
      value: "12.4k",
      unit: "msg/min",
      icon: Zap,
      status: "optimal",
      description: "Real-time linguistic analysis"
    },
    {
      label: "Anonymized Profiles",
      value: "2,341",
      unit: "entities",
      icon: Users,
      status: "secure",
      description: "Individual identity protected"
    },
    {
      label: "Security Level",
      value: "A+",
      unit: "grade",
      icon: ShieldCheck,
      status: "verified",
      description: "Enterprise-grade encryption"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "text-primary";
      case "optimal": return "text-success";
      case "secure": return "text-warning";
      case "verified": return "text-secondary";
      default: return "text-muted-foreground";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active": return "default";
      case "optimal": return "secondary";
      case "secure": return "outline";
      case "verified": return "outline";
      default: return "secondary";
    }
  };

  return (
    <Card className="p-6 bg-gradient-primary border-muted shadow-deep">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">System Overview</h3>
        <p className="text-sm text-muted-foreground">Real-time operational metrics and security status</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {systemMetrics.map((metric, index) => (
          <div 
            key={metric.label}
            className="p-4 rounded-lg bg-card/30 border border-border/30 hover:bg-card/50 transition-all duration-300"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg bg-current/10 ${getStatusColor(metric.status)}`}>
                <metric.icon className={`h-5 w-5 ${getStatusColor(metric.status)}`} />
              </div>
              <Badge variant={getStatusBadge(metric.status) as any} className="text-xs">
                {metric.status}
              </Badge>
            </div>

            <div className="mb-2">
              <div className="flex items-end gap-1">
                <span className="text-2xl font-bold text-foreground">{metric.value}</span>
                <span className="text-sm text-muted-foreground mb-1">{metric.unit}</span>
              </div>
              <h4 className="text-sm font-medium text-foreground">{metric.label}</h4>
            </div>

            <p className="text-xs text-muted-foreground">{metric.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 rounded-lg bg-card/20 border border-border/30">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">System Health</span>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
            <span className="text-xs text-success">Optimal</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">CPU Usage</span>
            <span className="text-foreground">23%</span>
          </div>
          <div className="w-full bg-muted/30 rounded-full h-1">
            <div className="bg-primary h-1 rounded-full transition-all duration-1000" style={{ width: '23%' }} />
          </div>
        </div>

        <div className="space-y-2 mt-3">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Analysis Queue</span>
            <span className="text-foreground">847 items</span>
          </div>
          <div className="w-full bg-muted/30 rounded-full h-1">
            <div className="bg-secondary h-1 rounded-full transition-all duration-1000" style={{ width: '67%' }} />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SystemOverview;