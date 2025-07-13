import { Card } from "@/components/ui/card";
import { Brain, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";

interface CoherenceMetric {
  label: string;
  value: number;
  trend: "up" | "down" | "stable";
  status: "healthy" | "warning" | "critical";
}

const CoherenceEngine = () => {
  const metrics: CoherenceMetric[] = [
    { label: "Symbolic Alignment", value: 87, trend: "up", status: "healthy" },
    { label: "Metaphor Density", value: 62, trend: "down", status: "warning" },
    { label: "Narrative Coherence", value: 94, trend: "stable", status: "healthy" },
    { label: "Modal Compression", value: 45, trend: "down", status: "critical" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy": return "text-success";
      case "warning": return "text-warning";
      case "critical": return "text-destructive";
      default: return "text-muted-foreground";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return <TrendingUp className="h-4 w-4 text-success" />;
      case "down": return <TrendingDown className="h-4 w-4 text-destructive" />;
      default: return <AlertTriangle className="h-4 w-4 text-warning" />;
    }
  };

  return (
    <Card className="p-6 bg-gradient-coherence border-muted shadow-neural">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-primary/20">
          <Brain className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Linguistic Coherence Engine</h3>
          <p className="text-sm text-muted-foreground">Symbolic alignment analysis</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
        {metrics.map((metric, index) => (
          <div 
            key={metric.label}
            className="p-4 rounded-lg bg-card/50 border border-border/50 animate-pulse-glow"
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">{metric.label}</span>
              {getTrendIcon(metric.trend)}
            </div>
            <div className="flex items-end gap-2">
              <span className={`text-2xl font-bold ${getStatusColor(metric.status)}`}>
                {metric.value}%
              </span>
            </div>
            <div className="mt-2 w-full bg-muted/30 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-1000 ${
                  metric.status === "healthy" ? "bg-success" :
                  metric.status === "warning" ? "bg-warning" : "bg-destructive"
                }`}
                style={{ width: `${metric.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span className="text-sm font-medium text-primary">System Status</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Coherence engine operating within normal parameters. Metaphor density showing minor degradation in Engineering cluster.
        </p>
      </div>
    </Card>
  );
};

export default CoherenceEngine;