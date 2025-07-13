import DashboardHeader from "@/components/dashboard-header";
import SystemOverview from "@/components/system-overview";
import CoherenceEngine from "@/components/coherence-engine";
import EntropyMonitor from "@/components/entropy-monitor";
import ResonanceHeatmap from "@/components/resonance-heatmap";
import WarningSystem from "@/components/warning-system";
import TemporalDriftTracker from "@/components/temporal-drift-tracker";
import MissionResonanceIndex from "@/components/mission-resonance-index";
import NarrativeStabilizationToolkit from "@/components/narrative-stabilization-toolkit";
import IntegrationManager from "@/components/integration-manager";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <div className="p-4 md:p-6 lg:p-8 space-y-4 md:space-y-6 lg:space-y-8 max-w-7xl mx-auto">
        {/* Top Row - System Overview and Quick Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="lg:col-span-1">
            <SystemOverview />
          </div>
          <div className="lg:col-span-2">
            <ResonanceHeatmap />
          </div>
        </div>

        {/* Middle Row - Core Analysis Engines */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <CoherenceEngine />
          <EntropyMonitor />
        </div>

        {/* Advanced Analysis Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <TemporalDriftTracker />
          <MissionResonanceIndex />
        </div>

        {/* Management Tools Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <NarrativeStabilizationToolkit />
          <IntegrationManager />
        </div>

        {/* Bottom Row - Warning System */}
        <div className="grid grid-cols-1 gap-4 md:gap-6">
          <WarningSystem />
        </div>
      </div>

      {/* Subtle Animation Overlay */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-scan animate-neural-scan opacity-5" />
      </div>
    </div>
  );
};

export default Index;
