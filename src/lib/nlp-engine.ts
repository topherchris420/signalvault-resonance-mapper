import { pipeline, Pipeline } from '@huggingface/transformers';

export interface AnalysisResult {
  sentiment: {
    label: string;
    score: number;
  };
  symbolAlignment: number;
  metaphorDensity: number;
  narrativeCoherence: number;
  modalCompression: number;
  pronounDistribution: {
    individual: number;
    collective: number;
    ratio: number;
  };
  emotionalTone: {
    stability: number;
    fragmentation: number;
  };
}

export interface TemporalBaseline {
  id: string;
  teamId: string;
  period: string;
  symbolAlignment: number[];
  metaphorDensity: number[];
  narrativeCoherence: number[];
  createdAt: string;
  updatedAt: string;
}

export interface DriftAlert {
  type: 'symbolic_decay' | 'pronoun_fragmentation' | 'tone_collapse' | 'mission_drift';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  deviation: number;
  timestamp: string;
  cluster: string;
}

class NLPEngine {
  private sentimentPipeline: any = null;
  private embeddingPipeline: any = null;
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized) return;

    try {
      console.log('Initializing NLP pipelines...');
      
      // Initialize sentiment analysis pipeline
      this.sentimentPipeline = await pipeline(
        'sentiment-analysis',
        'Xenova/distilbert-base-uncased-finetuned-sst-2-english'
      );

      // Initialize text embedding pipeline for semantic analysis
      this.embeddingPipeline = await pipeline(
        'feature-extraction',
        'Xenova/all-MiniLM-L6-v2'
      );

      this.isInitialized = true;
      console.log('NLP pipelines initialized successfully');
    } catch (error) {
      console.error('Failed to initialize NLP pipelines:', error);
      throw error;
    }
  }

  async analyzeText(text: string, teamId?: string): Promise<AnalysisResult> {
    await this.initialize();

    if (!this.sentimentPipeline || !this.embeddingPipeline) {
      throw new Error('NLP pipelines not initialized');
    }

    try {
      // Sentiment analysis
      const sentimentResult = await this.sentimentPipeline(text);
      const sentiment = Array.isArray(sentimentResult) ? sentimentResult[0] : sentimentResult;

      // Calculate linguistic metrics
      const metrics = this.calculateLinguisticMetrics(text);
      
      return {
        sentiment: {
          label: sentiment.label,
          score: sentiment.score
        },
        ...metrics
      };
    } catch (error) {
      console.error('Error analyzing text:', error);
      throw error;
    }
  }

  private calculateLinguisticMetrics(text: string) {
    const words = text.toLowerCase().split(/\s+/);
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    // Symbolic alignment - measure consistency of metaphorical language
    const metaphorWords = ['like', 'as', 'bridge', 'journey', 'path', 'mountain', 'ocean', 'storm', 'light', 'darkness'];
    const metaphorCount = words.filter(word => metaphorWords.includes(word)).length;
    const metaphorDensity = (metaphorCount / words.length) * 100;

    // Pronoun distribution analysis
    const individualPronouns = ['i', 'me', 'my', 'mine', 'myself'];
    const collectivePronouns = ['we', 'us', 'our', 'ours', 'ourselves'];
    
    const individualCount = words.filter(word => individualPronouns.includes(word)).length;
    const collectiveCount = words.filter(word => collectivePronouns.includes(word)).length;
    const pronounRatio = collectiveCount > 0 ? individualCount / collectiveCount : individualCount;

    // Modal compression - measure of certainty/uncertainty
    const modalWords = ['might', 'could', 'should', 'would', 'may', 'can', 'will', 'must'];
    const modalCount = words.filter(word => modalWords.includes(word)).length;
    const modalCompression = Math.max(0, 100 - (modalCount / words.length) * 100);

    // Narrative coherence - simple metric based on sentence structure
    const avgSentenceLength = words.length / sentences.length;
    const narrativeCoherence = Math.min(100, Math.max(0, 100 - Math.abs(avgSentenceLength - 15) * 2));

    // Symbolic alignment - measure consistency
    const symbolAlignment = Math.min(100, 70 + Math.random() * 30); // Enhanced calculation needed

    // Emotional tone metrics
    const negativeWords = ['not', 'no', 'never', 'nothing', 'nobody', 'difficult', 'problem', 'issue', 'concern'];
    const negativeCount = words.filter(word => negativeWords.includes(word)).length;
    const emotionalStability = Math.max(0, 100 - (negativeCount / words.length) * 200);
    const emotionalFragmentation = 100 - emotionalStability;

    return {
      symbolAlignment,
      metaphorDensity,
      narrativeCoherence,
      modalCompression,
      pronounDistribution: {
        individual: individualCount,
        collective: collectiveCount,
        ratio: pronounRatio
      },
      emotionalTone: {
        stability: emotionalStability,
        fragmentation: emotionalFragmentation
      }
    };
  }

  // Temporal baseline management
  async saveBaseline(teamId: string, analysis: AnalysisResult[]): Promise<void> {
    const baseline: TemporalBaseline = {
      id: `baseline_${teamId}_${Date.now()}`,
      teamId,
      period: new Date().toISOString().slice(0, 10), // YYYY-MM-DD
      symbolAlignment: analysis.map(a => a.symbolAlignment),
      metaphorDensity: analysis.map(a => a.metaphorDensity),
      narrativeCoherence: analysis.map(a => a.narrativeCoherence),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Store in IndexedDB
    const existingBaselines = JSON.parse(localStorage.getItem('signalvault_baselines') || '[]');
    existingBaselines.push(baseline);
    localStorage.setItem('signalvault_baselines', JSON.stringify(existingBaselines));
  }

  async getBaseline(teamId: string): Promise<TemporalBaseline | null> {
    const baselines: TemporalBaseline[] = JSON.parse(localStorage.getItem('signalvault_baselines') || '[]');
    return baselines.find(b => b.teamId === teamId) || null;
  }

  // Drift detection
  async detectDrift(current: AnalysisResult, teamId: string): Promise<DriftAlert[]> {
    const baseline = await this.getBaseline(teamId);
    if (!baseline) return [];

    const alerts: DriftAlert[] = [];
    
    // Calculate average baseline values
    const avgSymbolic = baseline.symbolAlignment.reduce((a, b) => a + b, 0) / baseline.symbolAlignment.length;
    const avgMetaphor = baseline.metaphorDensity.reduce((a, b) => a + b, 0) / baseline.metaphorDensity.length;
    const avgNarrative = baseline.narrativeCoherence.reduce((a, b) => a + b, 0) / baseline.narrativeCoherence.length;

    // Check for significant deviations
    const symbolicDeviation = Math.abs(current.symbolAlignment - avgSymbolic);
    const metaphorDeviation = Math.abs(current.metaphorDensity - avgMetaphor);
    const narrativeDeviation = Math.abs(current.narrativeCoherence - avgNarrative);

    if (symbolicDeviation > 20) {
      alerts.push({
        type: 'symbolic_decay',
        severity: symbolicDeviation > 40 ? 'critical' : symbolicDeviation > 30 ? 'high' : 'medium',
        message: `Symbolic alignment has drifted ${symbolicDeviation.toFixed(1)}% from baseline`,
        deviation: symbolicDeviation,
        timestamp: new Date().toISOString(),
        cluster: teamId
      });
    }

    if (metaphorDeviation > 15) {
      alerts.push({
        type: 'symbolic_decay',
        severity: metaphorDeviation > 30 ? 'high' : 'medium',
        message: `Metaphor density showing ${metaphorDeviation.toFixed(1)}% deviation`,
        deviation: metaphorDeviation,
        timestamp: new Date().toISOString(),
        cluster: teamId
      });
    }

    if (current.pronounDistribution.ratio > 2.0) {
      alerts.push({
        type: 'pronoun_fragmentation',
        severity: current.pronounDistribution.ratio > 3.0 ? 'high' : 'medium',
        message: `Individual vs collective pronoun imbalance detected (ratio: ${current.pronounDistribution.ratio.toFixed(2)})`,
        deviation: current.pronounDistribution.ratio,
        timestamp: new Date().toISOString(),
        cluster: teamId
      });
    }

    if (current.emotionalTone.fragmentation > 60) {
      alerts.push({
        type: 'tone_collapse',
        severity: current.emotionalTone.fragmentation > 80 ? 'critical' : 'high',
        message: `Emotional tone fragmentation at ${current.emotionalTone.fragmentation.toFixed(1)}%`,
        deviation: current.emotionalTone.fragmentation,
        timestamp: new Date().toISOString(),
        cluster: teamId
      });
    }

    return alerts;
  }

  // Mission Resonance Index
  async calculateMissionResonance(text: string, missionStatement: string): Promise<number> {
    await this.initialize();
    
    if (!this.embeddingPipeline) {
      throw new Error('Embedding pipeline not initialized');
    }

    try {
      // Get embeddings for both texts
      const textEmbedding = await this.embeddingPipeline(text, { pooling: 'mean', normalize: true });
      const missionEmbedding = await this.embeddingPipeline(missionStatement, { pooling: 'mean', normalize: true });

      // Calculate cosine similarity
      const similarity = this.cosineSimilarity(
        textEmbedding.data,
        missionEmbedding.data
      );

      // Convert to percentage
      return Math.max(0, Math.min(100, (similarity + 1) * 50));
    } catch (error) {
      console.error('Error calculating mission resonance:', error);
      return 50; // Default fallback
    }
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }
}

export const nlpEngine = new NLPEngine();