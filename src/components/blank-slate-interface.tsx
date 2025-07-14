import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere, Box } from '@react-three/drei';
import { BlankSlateEngine, AdaptivePattern, EmergentBehavior, AdaptationEvent, BlankSlateConfig } from '@/lib/blank-slate-engine';
import { Brain, Zap, Network, Eye, Settings, RotateCcw, Play, Pause } from 'lucide-react';

// Neural Substrate Visualization Component
function NeuralSubstrate({ patterns, emergentBehaviors }: { patterns: AdaptivePattern[], emergentBehaviors: EmergentBehavior[] }) {
  return (
    <Canvas camera={{ position: [10, 10, 10] }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <OrbitControls />
      
      {/* Render patterns as spheres */}
      {patterns.map((pattern, index) => (
        <Sphere
          key={pattern.id}
          position={[
            (index % 5) * 2 - 4,
            Math.floor(index / 5) * 2 - 2,
            Math.sin(index) * 2
          ]}
          args={[pattern.confidence / 100]}
        >
          <meshStandardMaterial 
            color={pattern.evolution > 2 ? "#8b5cf6" : "#3b82f6"} 
            opacity={0.7} 
            transparent 
          />
        </Sphere>
      ))}
      
      {/* Render emergent behaviors as boxes */}
      {emergentBehaviors.map((behavior, index) => (
        <Box
          key={`behavior-${index}`}
          position={[
            (index % 3) * 3 - 3,
            3,
            (Math.floor(index / 3) % 3) * 3 - 3
          ]}
          args={[behavior.strength / 50, behavior.stability / 50, behavior.novelty / 50]}
        >
          <meshStandardMaterial 
            color={behavior.type === 'symbolic' ? "#f59e0b" : 
                   behavior.type === 'linguistic' ? "#10b981" :
                   behavior.type === 'behavioral' ? "#ef4444" : "#8b5cf6"} 
            opacity={0.8} 
            transparent 
          />
        </Box>
      ))}
    </Canvas>
  );
}

export function BlankSlateInterface() {
  const [blankSlate, setBlankSlate] = useState<BlankSlateEngine | null>(null);
  const [systemState, setSystemState] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [config, setConfig] = useState<BlankSlateConfig>({
    adaptationThreshold: 50,
    evolutionRate: 0.1,
    constraintLevel: 'minimal',
    emergencePatterns: ['linguistic', 'symbolic', 'behavioral']
  });
  const [inputData, setInputData] = useState('');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const engine = new BlankSlateEngine(config);
    setBlankSlate(engine);
    setSystemState(engine.getSystemState());
  }, [config]);

  useEffect(() => {
    if (isRunning && blankSlate) {
      intervalRef.current = setInterval(async () => {
        // Simulate continuous data input for autonomous evolution
        const mockData = {
          text: `Autonomous evolution cycle ${Date.now()}`,
          context: 'organizational_adaptation',
          timestamp: Date.now()
        };
        
        const result = await blankSlate.processInput(mockData, 'autonomous_learning');
        setSystemState(blankSlate.getSystemState());
      }, 2000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, blankSlate]);

  const handleProcessInput = async () => {
    if (!blankSlate || !inputData) return;

    try {
      const result = await blankSlate.processInput(
        { text: inputData, timestamp: Date.now() },
        'user_input'
      );
      setSystemState(blankSlate.getSystemState());
      setInputData('');
    } catch (error) {
      console.error('Error processing input:', error);
    }
  };

  const handleReset = () => {
    if (blankSlate) {
      blankSlate.resetToBlankSlate();
      setSystemState(blankSlate.getSystemState());
      setIsRunning(false);
    }
  };

  const handleConfigUpdate = (key: keyof BlankSlateConfig, value: any) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    if (blankSlate) {
      blankSlate.updateConfig(newConfig);
    }
  };

  if (!blankSlate || !systemState) {
    return <div className="flex items-center justify-center h-64">Loading Blank Slate Engine...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-purple-500/20 bg-gradient-to-r from-purple-500/5 to-blue-500/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="h-6 w-6 text-purple-500" />
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Blank Slate Technology
              </CardTitle>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => setIsRunning(!isRunning)}
                variant={isRunning ? "destructive" : "default"}
                size="sm"
              >
                {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {isRunning ? 'Pause' : 'Start'} Evolution
              </Button>
              <Button onClick={handleReset} variant="outline" size="sm">
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
            </div>
          </div>
          <CardDescription>
            Foundational, programmable system for adaptive organizational consciousness. 
            Zero-constraint evolution with emergent intelligence scaffolding.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Main Interface */}
      <Tabs defaultValue="substrate" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="substrate">Neural Substrate</TabsTrigger>
          <TabsTrigger value="patterns">Adaptive Patterns</TabsTrigger>
          <TabsTrigger value="emergence">Emergent Behaviors</TabsTrigger>
          <TabsTrigger value="config">Configuration</TabsTrigger>
        </TabsList>

        {/* Neural Substrate Visualization */}
        <TabsContent value="substrate" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Network className="h-5 w-5" />
                <span>Neural Substrate Visualization</span>
              </CardTitle>
              <CardDescription>
                Real-time 3D visualization of adaptive patterns and emergent behaviors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 w-full border rounded-lg overflow-hidden">
                <NeuralSubstrate 
                  patterns={systemState.patterns} 
                  emergentBehaviors={systemState.emergentBehaviors} 
                />
              </div>
              <div className="mt-4 grid grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500">{systemState.patterns.length}</div>
                  <div className="text-sm text-muted-foreground">Active Patterns</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-500">{systemState.emergentBehaviors.length}</div>
                  <div className="text-sm text-muted-foreground">Emergent Behaviors</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">{systemState.adaptationHistory.length}</div>
                  <div className="text-sm text-muted-foreground">Adaptations</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-500">
                    {systemState.patterns.reduce((sum: number, p: AdaptivePattern) => sum + p.evolution, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Evolution Index</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Input Interface */}
          <Card>
            <CardHeader>
              <CardTitle>Data Input Interface</CardTitle>
              <CardDescription>
                Provide input for the blank slate to analyze and adapt to
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <textarea
                  value={inputData}
                  onChange={(e) => setInputData(e.target.value)}
                  placeholder="Enter organizational data, text, or context for analysis..."
                  className="w-full h-24 p-3 border rounded-md resize-none"
                />
                <Button onClick={handleProcessInput} disabled={!inputData || isRunning}>
                  <Zap className="h-4 w-4 mr-2" />
                  Process Input
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Adaptive Patterns */}
        <TabsContent value="patterns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Adaptive Patterns</CardTitle>
              <CardDescription>
                Self-discovered patterns that evolve based on organizational input
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {systemState.patterns.map((pattern: AdaptivePattern) => (
                  <div key={pattern.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant={pattern.evolution > 2 ? "default" : "secondary"}>
                        Pattern {pattern.id.slice(-8)}
                      </Badge>
                      <div className="text-sm text-muted-foreground">
                        {pattern.emergence.toLocaleTimeString()}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Confidence</span>
                        <span className="text-sm font-mono">{pattern.confidence.toFixed(1)}%</span>
                      </div>
                      <Progress value={pattern.confidence} className="h-2" />
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Evolution Level</span>
                        <Badge variant="outline">{pattern.evolution}</Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Adaptations: {pattern.adaptations.length}
                      </div>
                    </div>
                  </div>
                ))}
                {systemState.patterns.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    No patterns discovered yet. The system is in pure blank slate state.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Emergent Behaviors */}
        <TabsContent value="emergence" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Emergent Behaviors</CardTitle>
              <CardDescription>
                Spontaneous behaviors arising from pattern interactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {systemState.emergentBehaviors.map((behavior: EmergentBehavior, index: number) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant={
                        behavior.type === 'symbolic' ? "default" :
                        behavior.type === 'linguistic' ? "secondary" :
                        behavior.type === 'behavioral' ? "destructive" : "outline"
                      }>
                        {behavior.type.charAt(0).toUpperCase() + behavior.type.slice(1)}
                      </Badge>
                      <div className="text-sm text-muted-foreground">
                        Novelty: {behavior.novelty.toFixed(1)}%
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Strength</div>
                        <Progress value={behavior.strength} className="h-2 mt-1" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Stability</div>
                        <Progress value={behavior.stability} className="h-2 mt-1" />
                      </div>
                    </div>
                  </div>
                ))}
                {systemState.emergentBehaviors.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    No emergent behaviors detected yet. System is waiting for complexity threshold.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configuration */}
        <TabsContent value="config" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Blank Slate Configuration</span>
              </CardTitle>
              <CardDescription>
                Configure adaptation parameters and constraint levels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Adaptation Threshold</label>
                  <div className="mt-2">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={config.adaptationThreshold}
                      onChange={(e) => handleConfigUpdate('adaptationThreshold', Number(e.target.value))}
                      className="w-full"
                    />
                    <div className="text-sm text-muted-foreground mt-1">
                      Current: {config.adaptationThreshold}%
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <label className="text-sm font-medium">Evolution Rate</label>
                  <div className="mt-2">
                    <input
                      type="range"
                      min="0.01"
                      max="1"
                      step="0.01"
                      value={config.evolutionRate}
                      onChange={(e) => handleConfigUpdate('evolutionRate', Number(e.target.value))}
                      className="w-full"
                    />
                    <div className="text-sm text-muted-foreground mt-1">
                      Current: {config.evolutionRate}
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <label className="text-sm font-medium">Constraint Level</label>
                  <div className="mt-2 space-y-2">
                    {['none', 'minimal', 'guided'].map((level) => (
                      <label key={level} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="constraintLevel"
                          value={level}
                          checked={config.constraintLevel === level}
                          onChange={(e) => handleConfigUpdate('constraintLevel', e.target.value)}
                        />
                        <span className="text-sm capitalize">{level}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <label className="text-sm font-medium">System Status</label>
                  <div className="mt-2 text-sm text-muted-foreground">
                    <div>Running: {isRunning ? 'Yes' : 'No'}</div>
                    <div>Patterns: {systemState.patterns.length}</div>
                    <div>Emergent Behaviors: {systemState.emergentBehaviors.length}</div>
                    <div>Total Adaptations: {systemState.adaptationHistory.length}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}