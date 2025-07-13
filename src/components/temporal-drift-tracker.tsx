import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingDown, TrendingUp, AlertTriangle, Clock, Target } from "lucide-react";
import { nlpEngine, type DriftAlert } from "@/lib/nlp-engine";
import { dataIntegrationManager } from "@/lib/data-integrations";

interface DriftMetric {
  name: string;
  current: number;
  baseline: number;
  deviation: number;
  trend: 'up' | 'down' | 'stable';
  severity: 'low' | 'medium' | 'high' | 'critical';
}

const TemporalDriftTracker = () => {
  const [driftMetrics, setDriftMetrics] = useState<DriftMetric[]>([]);
  const [alerts, setAlerts] = useState<DriftAlert[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  useEffect(() => {
    analyzeTemporalDrift();
    const interval = setInterval(analyzeTemporalDrift, 5 * 60 * 1000); // Every 5 minutes
    return () => clearInterval(interval);
  }, []);

  const analyzeTemporalDrift = async () => {
    setIsAnalyzing(true);
    try {
      // Get recent messages from all integrated platforms
      const mockMessages = dataIntegrationManager.generateMockMessages(20);
      
      // Analyze each message
      const analyses = await Promise.all(
        mockMessages.slice(0, 10).map(msg => nlpEngine.analyzeText(msg.text, msg.teamId))
      );

      // Calculate current averages
      const currentMetrics = {
        symbolAlignment: analyses.reduce((sum, a) => sum + a.symbolAlignment, 0) / analyses.length,
        metaphorDensity: analyses.reduce((sum, a) => sum + a.metaphorDensity, 0) / analyses.length,
        narrativeCoherence: analyses.reduce((sum, a) => sum + a.narrativeCoherence, 0) / analyses.length,
        modalCompression: analyses.reduce((sum, a) => sum + a.modalCompression, 0) / analyses.length,
        emotionalStability: analyses.reduce((sum, a) => sum + a.emotionalTone.stability, 0) / analyses.length
      };

      // Simulate baseline comparison (in real implementation, this would compare to stored baselines)
      const baselines = {
        symbolAlignment: 85,
        metaphorDensity: 45,
        narrativeCoherence: 78,
        modalCompression: 62,
        emotionalStability: 73
      };

      const metrics: DriftMetric[] = [
        {
          name: 'Symbolic Alignment',
          current: currentMetrics.symbolAlignment,
          baseline: baselines.symbolAlignment,
          deviation: Math.abs(currentMetrics.symbolAlignment - baselines.symbolAlignment),
          trend: currentMetrics.symbolAlignment > baselines.symbolAlignment ? 'up' : 'down',
          severity: Math.abs(currentMetrics.symbolAlignment - baselines.symbolAlignment) > 20 ? 'high' : 
                   Math.abs(currentMetrics.symbolAlignment - baselines.symbolAlignment) > 10 ? 'medium' : 'low'
        },
        {
          name: 'Metaphor Density',
          current: currentMetrics.metaphorDensity,
          baseline: baselines.metaphorDensity,
          deviation: Math.abs(currentMetrics.metaphorDensity - baselines.metaphorDensity),
          trend: currentMetrics.metaphorDensity > baselines.metaphorDensity ? 'up' : 'down',
          severity: Math.abs(currentMetrics.metaphorDensity - baselines.metaphorDensity) > 15 ? 'high' : 
                   Math.abs(currentMetrics.metaphorDensity - baselines.metaphorDensity) > 8 ? 'medium' : 'low'
        },
        {
          name: 'Narrative Coherence',
          current: currentMetrics.narrativeCoherence,
          baseline: baselines.narrativeCoherence,
          deviation: Math.abs(currentMetrics.narrativeCoherence - baselines.narrativeCoherence),
          trend: currentMetrics.narrativeCoherence > baselines.narrativeCoherence ? 'up' : 'down',
          severity: Math.abs(currentMetrics.narrativeCoherence - baselines.narrativeCoherence) > 20 ? 'high' : 
                   Math.abs(currentMetrics.narrativeCoherence - baselines.narrativeCoherence) > 12 ? 'medium' : 'low'
        },
        {
          name: 'Modal Compression',
          current: currentMetrics.modalCompression,
          baseline: baselines.modalCompression,
          deviation: Math.abs(currentMetrics.modalCompression - baselines.modalCompression),
          trend: currentMetrics.modalCompression > baselines.modalCompression ? 'up' : 'down',
          severity: Math.abs(currentMetrics.modalCompression - baselines.modalCompression) > 25 ? 'high' : 
                   Math.abs(currentMetrics.modalCompression - baselines.modalCompression) > 15 ? 'medium' : 'low'
        },
        {
          name: 'Emotional Stability',
          current: currentMetrics.emotionalStability,
          baseline: baselines.emotionalStability,
          deviation: Math.abs(currentMetrics.emotionalStability - baselines.emotionalStability),
          trend: currentMetrics.emotionalStability > baselines.emotionalStability ? 'up' : 'down',
          severity: Math.abs(currentMetrics.emotionalStability - baselines.emotionalStability) > 20 ? 'high' : 
                   Math.abs(currentMetrics.emotionalStability - baselines.emotionalStability) > 10 ? 'medium' : 'low'
        }
      ];

      setDriftMetrics(metrics);

      // Generate drift alerts
      const newAlerts: DriftAlert[] = [];
      metrics.forEach(metric => {
        if (metric.severity === 'high' || metric.severity === 'critical') {
          newAlerts.push({
            type: metric.name.toLowerCase().includes('symbol') ? 'symbolic_decay' : 
                  metric.name.toLowerCase().includes('emotional') ? 'tone_collapse' : 'mission_drift',
            severity: metric.severity as any,
            message: `${metric.name} shows ${metric.deviation.toFixed(1)}% deviation from multi-week baseline`,
            deviation: metric.deviation,
            timestamp: new Date().toISOString(),
            cluster: 'Organization'
          });
        }
      });

      setAlerts(newAlerts);
      setLastUpdate(new Date().toLocaleTimeString());

      // Save current analysis as part of temporal baseline
      if (analyses.length > 0) {
        await nlpEngine.saveBaseline('organization', analyses);
      }

    } catch (error) {
      console.error('Error analyzing temporal drift:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      case 'low': return 'secondary';
      default: return 'muted';
    }
  };

  const getTrendIcon = (trend: string, severity: string) => {
    if (severity === 'high' || severity === 'critical') {
      return <AlertTriangle className="h-4 w-4 text-destructive" />;
    }
    return trend === 'up' ? 
      <TrendingUp className="h-4 w-4 text-success" /> : 
      <TrendingDown className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <Card className="p-6 bg-gradient-neural border-muted shadow-neural">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-warning/20">
            <Clock className="h-6 w-6 text-warning" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Temporal Symbolic Drift Tracker</h3>
            <p className="text-sm text-muted-foreground">Multi-week baseline analysis and deviation detection</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            Last: {lastUpdate}
          </Badge>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={analyzeTemporalDrift}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? 'Analyzing...' : 'Refresh'}
          </Button>
        </div>
      </div>

      {/* Drift Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {driftMetrics.map((metric, index) => (
          <div 
            key={metric.name}
            className="p-4 rounded-lg bg-card/40 border border-border/50 hover:bg-card/60 transition-all duration-300"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">{metric.name}</span>
              {getTrendIcon(metric.trend, metric.severity)}
            </div>
            
            <div className="flex items-end gap-2 mb-2">
              <span className="text-2xl font-bold text-foreground">
                {metric.current.toFixed(1)}%
              </span>
              <span className="text-sm text-muted-foreground mb-1">
                (±{metric.deviation.toFixed(1)})
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Baseline</span>
                <span className="text-foreground">{metric.baseline.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-muted/30 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-1000 ${
                    metric.severity === 'high' || metric.severity === 'critical' ? 'bg-destructive' :
                    metric.severity === 'medium' ? 'bg-warning' : 'bg-success'
                  }`}
                  style={{ width: `${Math.min(100, metric.current)}%` }}
                />
              </div>
            </div>

            <Badge 
              variant={getSeverityColor(metric.severity) as any} 
              className="text-xs mt-2"
            >
              {metric.severity} deviation
            </Badge>
          </div>
        ))}
      </div>

      {/* Active Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <h4 className="text-md font-semibold text-foreground">Active Drift Alerts</h4>
          </div>
          
          {alerts.map((alert, index) => (
            <div 
              key={`${alert.type}_${alert.timestamp}`}
              className="p-4 rounded-lg bg-destructive/10 border border-destructive/30 hover:bg-destructive/20 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
                  <Badge variant="destructive" className="text-xs">
                    {alert.severity.toUpperCase()}
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(alert.timestamp).toLocaleTimeString()}
                </span>
              </div>
              
              <p className="text-sm text-foreground mb-2">{alert.message}</p>
              
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">
                  {alert.cluster}
                </Badge>
                <span className="text-xs text-destructive font-medium">
                  Drift: {alert.deviation.toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Baseline Status */}
      <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
        <div className="flex items-center gap-2 mb-2">
          <Target className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-primary">Temporal Baseline Status</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Tracking organizational symbolic patterns across {driftMetrics.length} linguistic dimensions. 
          {alerts.length > 0 ? 
            ` ${alerts.length} significant deviation${alerts.length === 1 ? '' : 's'} detected requiring attention.` :
            ' All metrics within acceptable variance ranges.'
          }
        </p>
      </div>
    </Card>
  );
};

export default TemporalDriftTracker;