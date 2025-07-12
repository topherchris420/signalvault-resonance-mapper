import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, AlertTriangle, Clock, ArrowRight } from "lucide-react";

interface Warning {
  id: string;
  title: string;
  description: string;
  severity: "critical" | "high" | "medium";
  cluster: string;
  predictedImpact: string;
  timeToSurface: string;
  confidence: number;
}

const WarningSystem = () => {
  const warnings: Warning[] = [
    {
      id: "1",
      title: "Cultural Drift Detection",
      description: "Mission alignment degradation detected in cross-functional communications. Linguistic markers suggest emerging value misalignment.",
      severity: "critical",
      cluster: "Product-Engineering Interface",
      predictedImpact: "Sprint velocity decrease, decision paralysis",
      timeToSurface: "5-7 days",
      confidence: 94
    },
    {
      id: "2", 
      title: "Leadership Resonance Gap",
      description: "Metaphorical language patterns diverging between executive and mid-management communications.",
      severity: "high",
      cluster: "Leadership Cascade",
      predictedImpact: "Strategic message dilution",
      timeToSurface: "2-3 weeks",
      confidence: 87
    },
    {
      id: "3",
      title: "Emotional Entropy Spike",
      description: "Sentiment variance increasing across customer-facing team communications.",
      severity: "medium",
      cluster: "Customer Success",
      predictedImpact: "Customer experience inconsistency",
      timeToSurface: "1-2 weeks",
      confidence: 76
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "destructive";
      case "high": return "warning";
      case "medium": return "secondary";
      default: return "muted";
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "text-success";
    if (confidence >= 75) return "text-warning";
    return "text-muted-foreground";
  };

  return (
    <Card className="p-6 bg-gradient-neural border-muted shadow-neural">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-warning/20">
          <Shield className="h-6 w-6 text-warning" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Semantic Warning System</h3>
          <p className="text-sm text-muted-foreground">Early detection of organizational misalignment</p>
        </div>
      </div>

      <div className="space-y-4">
        {warnings.map((warning, index) => (
          <div 
            key={warning.id}
            className="p-5 rounded-lg bg-card/40 border border-border/50 hover:bg-card/60 transition-all duration-500"
            style={{ animationDelay: `${index * 0.15}s` }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                <h4 className="font-semibold text-foreground">{warning.title}</h4>
              </div>
              <Badge variant={getSeverityColor(warning.severity) as any} className="text-xs">
                {warning.severity.toUpperCase()}
              </Badge>
            </div>

            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              {warning.description}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="text-xs text-muted-foreground">Time to Surface</span>
                </div>
                <p className="text-sm font-medium text-foreground">{warning.timeToSurface}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-secondary" />
                  <span className="text-xs text-muted-foreground">Predicted Impact</span>
                </div>
                <p className="text-sm font-medium text-foreground">{warning.predictedImpact}</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {warning.cluster}
                </Badge>
                <span className={`text-xs font-medium ${getConfidenceColor(warning.confidence)}`}>
                  {warning.confidence}% confidence
                </span>
              </div>
              
              <Button variant="outline" size="sm" className="text-xs">
                Investigate
              </Button>
            </div>

            <div className="mt-3 w-full bg-muted/30 rounded-full h-1">
              <div 
                className={`h-1 rounded-full ${
                  warning.severity === "critical" ? "bg-destructive" :
                  warning.severity === "high" ? "bg-warning" : "bg-secondary"
                }`}
                style={{ width: `${warning.confidence}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-primary">System Status</p>
            <p className="text-xs text-muted-foreground">3 active warnings • Next scan in 47 seconds</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-warning animate-pulse" />
            <span className="text-xs text-warning font-medium">Monitoring</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default WarningSystem;