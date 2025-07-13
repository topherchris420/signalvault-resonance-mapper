import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Target, TrendingDown, TrendingUp, AlertCircle, Edit3 } from "lucide-react";
import { nlpEngine } from "@/lib/nlp-engine";
import { dataIntegrationManager } from "@/lib/data-integrations";

interface ResonanceScore {
  teamId: string;
  teamName: string;
  score: number;
  trend: 'up' | 'down' | 'stable';
  lastUpdate: string;
  deviation: number;
  status: 'aligned' | 'drifting' | 'critical';
}

interface MissionAlert {
  teamId: string;
  teamName: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  score: number;
  threshold: number;
  timestamp: string;
}

const MissionResonanceIndex = () => {
  const [missionStatement, setMissionStatement] = useState('');
  const [resonanceScores, setResonanceScores] = useState<ResonanceScore[]>([]);
  const [missionAlerts, setMissionAlerts] = useState<MissionAlert[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isEditingMission, setIsEditingMission] = useState(false);
  const [overallMRI, setOverallMRI] = useState(0);

  useEffect(() => {
    // Load saved mission statement
    const savedMission = localStorage.getItem('signalvault_mission');
    if (savedMission) {
      setMissionStatement(savedMission);
      analyzeMissionResonance(savedMission);
    } else {
      // Default mission statement
      const defaultMission = "To empower organizations with breakthrough technology that transforms how people work, collaborate, and achieve their potential while maintaining human connection and purpose.";
      setMissionStatement(defaultMission);
      setIsEditingMission(true);
    }

    // Set up periodic analysis
    const interval = setInterval(() => {
      if (missionStatement) {
        analyzeMissionResonance(missionStatement);
      }
    }, 10 * 60 * 1000); // Every 10 minutes

    return () => clearInterval(interval);
  }, []);

  const saveMissionStatement = () => {
    localStorage.setItem('signalvault_mission', missionStatement);
    setIsEditingMission(false);
    analyzeMissionResonance(missionStatement);
  };

  const analyzeMissionResonance = async (mission: string) => {
    if (!mission.trim()) return;
    
    setIsAnalyzing(true);
    try {
      // Get recent messages from all teams
      const mockMessages = dataIntegrationManager.generateMockMessages(30);
      
      // Group messages by team
      const messagesByTeam = mockMessages.reduce((acc, msg) => {
        if (!acc[msg.teamId]) {
          acc[msg.teamId] = [];
        }
        acc[msg.teamId].push(msg);
        return acc;
      }, {} as Record<string, typeof mockMessages>);

      const scores: ResonanceScore[] = [];
      const alerts: MissionAlert[] = [];

      // Analyze each team's resonance with mission
      for (const [teamId, messages] of Object.entries(messagesByTeam)) {
        if (messages.length === 0) continue;

        // Combine recent messages for team analysis
        const teamText = messages
          .slice(0, 10) // Analyze last 10 messages
          .map(m => m.text)
          .join(' ');

        // Calculate mission resonance
        const resonanceScore = await nlpEngine.calculateMissionResonance(teamText, mission);
        
        // Simulate historical data for trend analysis
        const historicalScore = resonanceScore + (Math.random() - 0.5) * 10;
        const deviation = Math.abs(resonanceScore - 75); // 75% is ideal baseline
        
        const trend: 'up' | 'down' | 'stable' = 
          resonanceScore > historicalScore ? 'up' : 
          resonanceScore < historicalScore ? 'down' : 'stable';

        const status: 'aligned' | 'drifting' | 'critical' = 
          resonanceScore >= 70 ? 'aligned' :
          resonanceScore >= 50 ? 'drifting' : 'critical';

        const teamName = teamId.charAt(0).toUpperCase() + teamId.slice(1);

        scores.push({
          teamId,
          teamName,
          score: resonanceScore,
          trend,
          lastUpdate: new Date().toISOString(),
          deviation,
          status
        });

        // Generate alerts for low resonance
        if (resonanceScore < 60) {
          const severity: 'low' | 'medium' | 'high' | 'critical' = 
            resonanceScore < 30 ? 'critical' :
            resonanceScore < 45 ? 'high' :
            resonanceScore < 55 ? 'medium' : 'low';

          alerts.push({
            teamId,
            teamName,
            severity,
            message: generateMissionAlert(teamName, resonanceScore, severity),
            score: resonanceScore,
            threshold: 60,
            timestamp: new Date().toISOString()
          });
        }
      }

      // Calculate overall MRI
      const avgScore = scores.length > 0 ? 
        scores.reduce((sum, s) => sum + s.score, 0) / scores.length : 0;

      setResonanceScores(scores.sort((a, b) => b.score - a.score));
      setMissionAlerts(alerts.sort((a, b) => {
        const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        return severityOrder[b.severity] - severityOrder[a.severity];
      }));
      setOverallMRI(avgScore);

    } catch (error) {
      console.error('Error analyzing mission resonance:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateMissionAlert = (teamName: string, score: number, severity: string): string => {
    const severityDescriptions = {
      critical: "fundamental disconnection from core mission",
      high: "significant linguistic drift from organizational purpose", 
      medium: "emerging misalignment with mission principles",
      low: "minor deviation from mission-aligned language"
    };

    return `${teamName} team showing ${severityDescriptions[severity]} (${score.toFixed(1)}% resonance)`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aligned': return 'text-success';
      case 'drifting': return 'text-warning';
      case 'critical': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'aligned': return 'secondary';
      case 'drifting': return 'warning';
      case 'critical': return 'destructive';
      default: return 'muted';
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

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-success" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-destructive" />;
      default: return <AlertCircle className="h-4 w-4 text-warning" />;
    }
  };

  return (
    <Card className="p-6 bg-gradient-coherence border-muted shadow-neural">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/20">
            <Target className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Mission Resonance Index</h3>
            <p className="text-sm text-muted-foreground">Organizational alignment with core mission</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-lg font-bold px-3 py-1">
            MRI: {overallMRI.toFixed(1)}%
          </Badge>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setIsEditingMission(!isEditingMission)}
          >
            <Edit3 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Mission Statement Editor */}
      {isEditingMission && (
        <div className="mb-6 p-4 rounded-lg bg-card/40 border border-border/50">
          <Label htmlFor="mission" className="text-sm font-medium text-foreground mb-2 block">
            Core Mission Statement
          </Label>
          <Textarea
            id="mission"
            value={missionStatement}
            onChange={(e) => setMissionStatement(e.target.value)}
            placeholder="Enter your organization's core mission statement..."
            className="mb-3 min-h-[100px]"
          />
          <div className="flex gap-2">
            <Button onClick={saveMissionStatement} size="sm">
              Save Mission
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsEditingMission(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Current Mission Display */}
      {!isEditingMission && missionStatement && (
        <div className="mb-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
          <p className="text-sm text-muted-foreground italic">
            "{missionStatement}"
          </p>
        </div>
      )}

      {/* Team Resonance Scores */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {resonanceScores.map((score, index) => (
          <div 
            key={score.teamId}
            className="p-4 rounded-lg bg-card/40 border border-border/50 hover:bg-card/60 transition-all duration-300"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">{score.teamName}</span>
              <div className="flex items-center gap-2">
                {getTrendIcon(score.trend)}
                <Badge variant={getStatusBadge(score.status) as any} className="text-xs">
                  {score.status}
                </Badge>
              </div>
            </div>
            
            <div className="flex items-end gap-2 mb-2">
              <span className={`text-2xl font-bold ${getStatusColor(score.status)}`}>
                {score.score.toFixed(1)}%
              </span>
              <span className="text-sm text-muted-foreground mb-1">resonance</span>
            </div>

            <div className="w-full bg-muted/30 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-1000 ${
                  score.status === 'aligned' ? 'bg-success' :
                  score.status === 'drifting' ? 'bg-warning' : 'bg-destructive'
                }`}
                style={{ width: `${Math.min(100, score.score)}%` }}
              />
            </div>

            <div className="flex justify-between text-xs mt-2">
              <span className="text-muted-foreground">
                {new Date(score.lastUpdate).toLocaleTimeString()}
              </span>
              <span className={getStatusColor(score.status)}>
                ±{score.deviation.toFixed(1)}%
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Mission Alerts */}
      {missionAlerts.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <h4 className="text-md font-semibold text-foreground">Mission Drift Alerts</h4>
          </div>
          
          {missionAlerts.map((alert, index) => (
            <div 
              key={`${alert.teamId}_${alert.timestamp}`}
              className={`p-4 rounded-lg border transition-all duration-300 ${
                alert.severity === 'critical' ? 'bg-destructive/10 border-destructive/30' :
                alert.severity === 'high' ? 'bg-destructive/10 border-destructive/30' :
                alert.severity === 'medium' ? 'bg-warning/10 border-warning/30' :
                'bg-secondary/10 border-secondary/30'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full animate-pulse ${
                    alert.severity === 'critical' || alert.severity === 'high' ? 'bg-destructive' :
                    alert.severity === 'medium' ? 'bg-warning' : 'bg-secondary'
                  }`} />
                  <Badge variant={getSeverityColor(alert.severity) as any} className="text-xs">
                    {alert.severity.toUpperCase()}
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(alert.timestamp).toLocaleTimeString()}
                </span>
              </div>
              
              <p className="text-sm text-foreground mb-2">{alert.message}</p>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Threshold: {alert.threshold}%
                </span>
                <span className={`text-xs font-medium ${
                  alert.severity === 'critical' || alert.severity === 'high' ? 'text-destructive' :
                  alert.severity === 'medium' ? 'text-warning' : 'text-secondary'
                }`}>
                  Current: {alert.score.toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Analysis Status */}
      <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-primary">Analysis Status</span>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => analyzeMissionResonance(missionStatement)}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? 'Analyzing...' : 'Refresh'}
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          {isAnalyzing ? 
            'Processing organizational language patterns against mission statement...' :
            `Monitoring ${resonanceScores.length} team${resonanceScores.length === 1 ? '' : 's'} for mission alignment. 
            ${missionAlerts.length > 0 ? `${missionAlerts.length} drift alert${missionAlerts.length === 1 ? '' : 's'} active.` : 'All teams within acceptable resonance thresholds.'}`
          }
        </p>
      </div>
    </Card>
  );
};

export default MissionResonanceIndex;