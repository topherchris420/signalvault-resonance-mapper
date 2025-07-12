import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Thermometer, Users, Clock, Target } from "lucide-react";

interface HeatmapCell {
  cluster: string;
  period: string;
  coherence: number;
  intensity: number;
}

const ResonanceHeatmap = () => {
  const clusters = ["Executive", "Product", "Engineering", "Marketing", "Sales", "Operations"];
  const timePeriods = ["Week 1", "Week 2", "Week 3", "Week 4"];
  
  // Generate sample heatmap data
  const heatmapData: HeatmapCell[] = [];
  clusters.forEach(cluster => {
    timePeriods.forEach(period => {
      heatmapData.push({
        cluster,
        period,
        coherence: Math.floor(Math.random() * 40) + 60, // 60-100 range
        intensity: Math.random()
      });
    });
  });

  const getCoherenceColor = (coherence: number) => {
    if (coherence >= 85) return "bg-success opacity-80";
    if (coherence >= 70) return "bg-warning opacity-60";
    return "bg-destructive opacity-70";
  };

  const getIntensityOpacity = (intensity: number) => {
    return Math.max(0.3, intensity);
  };

  return (
    <Card className="p-6 bg-gradient-coherence border-muted shadow-deep">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-secondary/20">
          <Thermometer className="h-6 w-6 text-secondary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Resonance Heatmap</h3>
          <p className="text-sm text-muted-foreground">Symbolic coherence across organizational clusters</p>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-1 mb-4">
        <div></div>
        {timePeriods.map(period => (
          <div key={period} className="text-center text-xs font-medium text-muted-foreground p-2">
            {period}
          </div>
        ))}
        
        {clusters.map(cluster => (
          <>
            <div key={cluster} className="text-xs font-medium text-foreground flex items-center p-2">
              {cluster}
            </div>
            {timePeriods.map(period => {
              const cell = heatmapData.find(d => d.cluster === cluster && d.period === period);
              return (
                <div 
                  key={`${cluster}-${period}`}
                  className={`aspect-square rounded-lg border border-border/30 flex items-center justify-center text-xs font-bold text-foreground hover:scale-105 transition-all duration-300 cursor-pointer ${getCoherenceColor(cell?.coherence || 0)}`}
                  style={{ opacity: getIntensityOpacity(cell?.intensity || 0) }}
                  title={`${cluster} - ${period}: ${cell?.coherence}% coherence`}
                >
                  {cell?.coherence}%
                </div>
              );
            })}
          </>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          <div>
            <p className="text-sm font-medium text-foreground">Active Clusters</p>
            <p className="text-xs text-muted-foreground">6 of 8 monitored</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-secondary" />
          <div>
            <p className="text-sm font-medium text-foreground">Scan Frequency</p>
            <p className="text-xs text-muted-foreground">Real-time analysis</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-warning" />
          <div>
            <p className="text-sm font-medium text-foreground">Resolution</p>
            <p className="text-xs text-muted-foreground">Team-level mapping</p>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 rounded-lg bg-card/30 border border-border/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">Coherence Legend</span>
          <Badge variant="outline" className="text-xs">Live Data</Badge>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-success opacity-80" />
            <span className="text-muted-foreground">85%+ High Coherence</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-warning opacity-60" />
            <span className="text-muted-foreground">70-84% Moderate</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-destructive opacity-70" />
            <span className="text-muted-foreground">Below 70% Critical</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ResonanceHeatmap;