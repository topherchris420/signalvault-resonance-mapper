import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lightbulb, MessageSquare, Target, Zap, Copy, CheckCircle } from "lucide-react";
import { nlpEngine } from "@/lib/nlp-engine";

interface ResonanceRepairPrompt {
  id: string;
  type: 'reframing' | 'alignment' | 'ritual' | 'query';
  title: string;
  description: string;
  prompt: string;
  targetMetric: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedImpact: 'low' | 'medium' | 'high';
}

interface StabilizationProtocol {
  name: string;
  description: string;
  steps: string[];
  timeRequired: string;
  participants: string;
  targetIssue: string;
}

const NarrativeStabilizationToolkit = () => {
  const [selectedIssue, setSelectedIssue] = useState<string>('symbolic_decay');
  const [repairPrompts, setRepairPrompts] = useState<ResonanceRepairPrompt[]>([]);
  const [protocols, setProtocols] = useState<StabilizationProtocol[]>([]);
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null);

  useEffect(() => {
    generateRepairPrompts(selectedIssue);
    generateProtocols();
  }, [selectedIssue]);

  const generateRepairPrompts = (issueType: string) => {
    const promptsByType: Record<string, ResonanceRepairPrompt[]> = {
      symbolic_decay: [
        {
          id: 'reframe_metaphors',
          type: 'reframing',
          title: 'Metaphor Regeneration Exercise',
          description: 'Rebuild symbolic coherence through shared metaphorical language',
          prompt: 'In your next team communication, describe our current project using a metaphor from nature (e.g., "We\'re cultivating ideas like a garden" rather than "We\'re executing tasks"). Notice how this shifts the feeling of the work.',
          targetMetric: 'Symbolic Alignment',
          difficulty: 'beginner',
          estimatedImpact: 'medium'
        },
        {
          id: 'story_bridge',
          type: 'reframing',
          title: 'Story Bridge Technique',
          description: 'Connect current work to larger organizational narrative',
          prompt: 'Start your next update by explicitly connecting what you\'re doing to the bigger story: "This [specific task] is part of how we [organizational mission/vision]." Use this bridge in 3 communications this week.',
          targetMetric: 'Narrative Coherence',
          difficulty: 'intermediate',
          estimatedImpact: 'high'
        },
        {
          id: 'symbol_audit',
          type: 'ritual',
          title: 'Symbolic Language Audit',
          description: 'Identify and replace disconnected technical language',
          prompt: 'Review your last 5 messages. Circle any jargon or technical terms. For each one, write an alternative that connects to human experience or shared values. Use these alternatives going forward.',
          targetMetric: 'Symbolic Alignment',
          difficulty: 'advanced',
          estimatedImpact: 'high'
        }
      ],
      pronoun_fragmentation: [
        {
          id: 'collective_reframe',
          type: 'reframing',
          title: 'Collective Voice Activation',
          description: 'Shift from individual to collective perspective',
          prompt: 'For the next week, consciously replace "I think/believe/feel" with "We might consider/explore/discover." Notice how this changes both your thinking and others\' responses.',
          targetMetric: 'Pronoun Distribution',
          difficulty: 'beginner',
          estimatedImpact: 'medium'
        },
        {
          id: 'shared_ownership',
          type: 'alignment',
          title: 'Shared Ownership Language',
          description: 'Build collective responsibility through language',
          prompt: 'When discussing challenges, use "How might we..." instead of "You should..." or "I need to..." This small shift builds shared ownership of both problems and solutions.',
          targetMetric: 'Pronoun Distribution',
          difficulty: 'beginner',
          estimatedImpact: 'high'
        },
        {
          id: 'perspective_ceremony',
          type: 'ritual',
          title: 'Perspective Integration Ceremony',
          description: 'Formal practice to balance individual and collective voice',
          prompt: 'In your next team meeting, spend 3 minutes where each person shares: "I bring..." (individual contribution) followed by "We become..." (collective possibility). Notice the energy shift.',
          targetMetric: 'Pronoun Distribution',
          difficulty: 'intermediate',
          estimatedImpact: 'high'
        }
      ],
      tone_collapse: [
        {
          id: 'emotional_grounding',
          type: 'reframing',
          title: 'Emotional Grounding Practice',
          description: 'Restore emotional stability through authentic expression',
          prompt: 'Before sending messages when stressed, pause and ask: "What am I really feeling?" Then include one authentic feeling word in your communication (e.g., "I\'m excited to explore this" vs "This looks good").',
          targetMetric: 'Emotional Stability',
          difficulty: 'beginner',
          estimatedImpact: 'medium'
        },
        {
          id: 'appreciation_injection',
          type: 'alignment',
          title: 'Appreciation Injection Protocol',
          description: 'Counteract negative spiral with genuine recognition',
          prompt: 'For every concern or problem you communicate, include one specific appreciation or positive observation. This isn\'t false positivity—it\'s emotional balance.',
          targetMetric: 'Emotional Stability',
          difficulty: 'beginner',
          estimatedImpact: 'high'
        },
        {
          id: 'energy_reset',
          type: 'ritual',
          title: 'Team Energy Reset Ritual',
          description: 'Collective practice to restore emotional coherence',
          prompt: 'Begin next meeting with 2 minutes of "energy check-in": each person shares their current energy level (1-10) and one word for what they need to be their best today. No fixing, just witnessing.',
          targetMetric: 'Emotional Stability',
          difficulty: 'intermediate',
          estimatedImpact: 'high'
        }
      ],
      mission_drift: [
        {
          id: 'purpose_anchor',
          type: 'alignment',
          title: 'Purpose Anchoring Practice',
          description: 'Reconnect daily work to organizational purpose',
          prompt: 'Start each day by writing one sentence connecting your planned work to the organization\'s larger purpose. Share this in your first communication of the day.',
          targetMetric: 'Mission Resonance',
          difficulty: 'beginner',
          estimatedImpact: 'medium'
        },
        {
          id: 'value_translation',
          type: 'reframing',
          title: 'Values Translation Exercise',
          description: 'Express organizational values through specific actions',
          prompt: 'Choose one core organizational value. For one week, explicitly mention how your work/decisions embody this value. Use the format: "In [specific action], we\'re living our value of [value] by [specific way]."',
          targetMetric: 'Mission Resonance',
          difficulty: 'intermediate',
          estimatedImpact: 'high'
        },
        {
          id: 'mission_storytelling',
          type: 'ritual',
          title: 'Mission Storytelling Circle',
          description: 'Collective reconnection to organizational mission',
          prompt: 'Host a 15-minute "mission story" session where each person shares a specific moment when they felt most connected to the organization\'s purpose. No analysis, just stories.',
          targetMetric: 'Mission Resonance',
          difficulty: 'advanced',
          estimatedImpact: 'high'
        }
      ]
    };

    setRepairPrompts(promptsByType[issueType] || []);
  };

  const generateProtocols = () => {
    const stabilizationProtocols: StabilizationProtocol[] = [
      {
        name: 'Narrative Reset Protocol',
        description: 'Comprehensive intervention for severe symbolic fragmentation',
        steps: [
          'Pause all non-essential communication for 24 hours',
          'Leadership identifies 3 core symbolic themes that represent organizational identity',
          'Each team member writes a 2-sentence story connecting their work to these themes',
          'Host a "story weaving" session to create shared narrative',
          'Establish new communication guidelines based on chosen symbolic language',
          'Monitor linguistic patterns for 2 weeks with daily check-ins'
        ],
        timeRequired: '3-5 days',
        participants: 'Entire affected unit (5-50 people)',
        targetIssue: 'Severe symbolic decay across multiple teams'
      },
      {
        name: 'Collective Voice Ceremony',
        description: 'Ritual to restore balance between individual and collective expression',
        steps: [
          'Gather all team members in circle formation (virtual or physical)',
          'Each person shares one individual strength they bring',
          'Each person shares one collective aspiration they hold',
          'Group identifies patterns and creates "voice charter"',
          'Practice collective decision-making using new language patterns',
          'Establish daily "voice check" for 2 weeks'
        ],
        timeRequired: '2 hours initial, 2 weeks follow-up',
        participants: 'Single team or department (5-15 people)',
        targetIssue: 'Pronoun fragmentation or voice imbalance'
      },
      {
        name: 'Mission Reconnection Intensive',
        description: 'Deep realignment process for mission drift',
        steps: [
          'Leadership presents original mission/vision without interpretation',
          'Small groups identify personal connections to mission elements',
          'Each group creates "mission translation" for their specific work',
          'Whole group synthesizes translations into unified understanding',
          'Create practical language guide for mission-aligned communication',
          'Implement weekly mission alignment check-ins'
        ],
        timeRequired: '4 hours intensive + ongoing',
        participants: 'Leadership + affected teams',
        targetIssue: 'Mission drift or purpose disconnection'
      },
      {
        name: 'Emotional Coherence Restoration',
        description: 'Intervention for emotional tone fragmentation',
        steps: [
          'Anonymous emotional climate assessment',
          'Small group "emotional archaeology" - identify sources of fragmentation',
          'Practice authentic emotional expression in safe setting',
          'Develop team emotional vocabulary and norms',
          'Create "emotional first aid" protocols for future stress',
          'Establish regular emotional climate monitoring'
        ],
        timeRequired: '3 hours + 30 days integration',
        participants: 'Affected teams with trained facilitator',
        targetIssue: 'Emotional tone collapse or workplace trauma'
      }
    ];

    setProtocols(stabilizationProtocols);
  };

  const copyPrompt = async (prompt: string, id: string) => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopiedPrompt(id);
      setTimeout(() => setCopiedPrompt(null), 2000);
    } catch (error) {
      console.error('Failed to copy prompt:', error);
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-success';
      case 'medium': return 'text-warning';
      case 'low': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'secondary';
      case 'intermediate': return 'warning';
      case 'advanced': return 'destructive';
      default: return 'muted';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'reframing': return <MessageSquare className="h-4 w-4" />;
      case 'alignment': return <Target className="h-4 w-4" />;
      case 'ritual': return <Zap className="h-4 w-4" />;
      case 'query': return <Lightbulb className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  return (
    <Card className="p-6 bg-gradient-heatmap border-muted shadow-neural">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-success/20">
          <Lightbulb className="h-6 w-6 text-success" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Narrative Stabilization Toolkit</h3>
          <p className="text-sm text-muted-foreground">Resonance repair strategies and symbolic realignment protocols</p>
        </div>
      </div>

      <Tabs value={selectedIssue} onValueChange={setSelectedIssue} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="symbolic_decay">Symbolic Decay</TabsTrigger>
          <TabsTrigger value="pronoun_fragmentation">Voice Imbalance</TabsTrigger>
          <TabsTrigger value="tone_collapse">Tone Collapse</TabsTrigger>
          <TabsTrigger value="mission_drift">Mission Drift</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedIssue} className="space-y-6">
          {/* Repair Prompts */}
          <div className="space-y-4">
            <h4 className="text-md font-semibold text-foreground flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Resonance Repair Prompts
            </h4>
            
            {repairPrompts.map((prompt, index) => (
              <div 
                key={prompt.id}
                className="p-4 rounded-lg bg-card/40 border border-border/50 hover:bg-card/60 transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(prompt.type)}
                    <h5 className="text-sm font-semibold text-foreground">{prompt.title}</h5>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getDifficultyBadge(prompt.difficulty) as any} className="text-xs">
                      {prompt.difficulty}
                    </Badge>
                    <Badge variant="outline" className={`text-xs ${getImpactColor(prompt.estimatedImpact)}`}>
                      {prompt.estimatedImpact} impact
                    </Badge>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-3">{prompt.description}</p>
                
                <div className="p-3 rounded-md bg-primary/5 border border-primary/20 mb-3">
                  <p className="text-sm text-foreground">{prompt.prompt}</p>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Targets: {prompt.targetMetric}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => copyPrompt(prompt.prompt, prompt.id)}
                    className="flex items-center gap-2"
                  >
                    {copiedPrompt === prompt.id ? (
                      <>
                        <CheckCircle className="h-3 w-3" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Stabilization Protocols */}
          <div className="space-y-4">
            <h4 className="text-md font-semibold text-foreground flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Stabilization Protocols
            </h4>
            
            {protocols
              .filter(protocol => 
                selectedIssue === 'symbolic_decay' && protocol.targetIssue.includes('symbolic') ||
                selectedIssue === 'pronoun_fragmentation' && protocol.targetIssue.includes('Pronoun') ||
                selectedIssue === 'tone_collapse' && protocol.targetIssue.includes('tone') ||
                selectedIssue === 'mission_drift' && protocol.targetIssue.includes('mission')
              )
              .map((protocol, index) => (
                <div 
                  key={protocol.name}
                  className="p-4 rounded-lg bg-card/40 border border-border/50"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h5 className="text-sm font-semibold text-foreground">{protocol.name}</h5>
                    <Badge variant="outline" className="text-xs">
                      {protocol.timeRequired}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3">{protocol.description}</p>

                  <div className="space-y-2 mb-3">
                    <h6 className="text-xs font-medium text-foreground">Implementation Steps:</h6>
                    <ol className="list-decimal list-inside space-y-1">
                      {protocol.steps.map((step, stepIndex) => (
                        <li key={stepIndex} className="text-xs text-muted-foreground">
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">
                      Participants: {protocol.participants}
                    </span>
                    <span className="text-foreground">
                      For: {protocol.targetIssue}
                    </span>
                  </div>
                </div>
              ))
            }
          </div>
        </TabsContent>
      </Tabs>

      {/* Toolkit Status */}
      <div className="mt-6 p-4 rounded-lg bg-success/5 border border-success/20">
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb className="h-4 w-4 text-success" />
          <span className="text-sm font-medium text-success">Toolkit Status</span>
        </div>
        <p className="text-sm text-muted-foreground">
          {repairPrompts.length} repair prompts available for {selectedIssue.replace('_', ' ')}. 
          Protocols are designed for immediate implementation with measurable impact on linguistic coherence.
        </p>
      </div>
    </Card>
  );
};

export default NarrativeStabilizationToolkit;