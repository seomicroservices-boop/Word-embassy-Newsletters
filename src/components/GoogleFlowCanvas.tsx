import React, { useState } from 'react';
import {
  Workflow,
  Play,
  Pause,
  RefreshCw,
  Sparkles,
  FileText,
  FileSpreadsheet,
  HardDrive,
  CheckSquare,
  HelpCircle,
  Video,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  Settings,
  ChevronRight,
  Terminal,
  Layers,
  ArrowDown,
  ExternalLink,
} from 'lucide-react';
import {
  WorkflowPipeline,
  FlowNode,
  DEFAULT_OMNICHANNEL_WORKFLOW,
  FlowExecutionStepLog,
} from '../services/googleFlow';

export const GoogleFlowCanvas: React.FC = () => {
  const [pipeline, setPipeline] = useState<WorkflowPipeline>(DEFAULT_OMNICHANNEL_WORKFLOW);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedNode, setSelectedNode] = useState<FlowNode | null>(pipeline.nodes[1]);
  const [executionLogs, setExecutionLogs] = useState<FlowExecutionStepLog[]>([
    {
      timestamp: '2026-08-25 06:00:01',
      nodeId: 'node-trigger',
      nodeLabel: 'Trigger: Next Topic Scheduled',
      level: 'info',
      message: 'Pipeline activated by weekly cron trigger (Tuesday 06:00 UTC).',
    },
    {
      timestamp: '2026-08-25 06:00:04',
      nodeId: 'node-gemini',
      nodeLabel: 'Gemini 3.7 Pro: Theological Exegesis',
      level: 'success',
      message: 'Generated 1,240 words of high-fidelity biblical exposition for "Walking in Divine Authority".',
    },
  ]);

  const getNodeIcon = (type: FlowNode['type']) => {
    switch (type) {
      case 'trigger':
        return <Clock className="w-5 h-5 text-amber-400" />;
      case 'gemini_ai':
        return <Sparkles className="w-5 h-5 text-purple-400" />;
      case 'google_docs':
        return <FileText className="w-5 h-5 text-blue-400" />;
      case 'google_sheets':
        return <FileSpreadsheet className="w-5 h-5 text-emerald-400" />;
      case 'google_drive':
        return <HardDrive className="w-5 h-5 text-amber-500" />;
      case 'google_tasks':
        return <CheckSquare className="w-5 h-5 text-indigo-400" />;
      case 'google_forms':
        return <HelpCircle className="w-5 h-5 text-rose-400" />;
      case 'veo_video':
        return <Video className="w-5 h-5 text-pink-400" />;
      case 'gmail':
        return <Send className="w-5 h-5 text-sky-400" />;
      default:
        return <Layers className="w-5 h-5 text-slate-400" />;
    }
  };

  const handleRunPipeline = async () => {
    if (isRunning) return;
    setIsRunning(true);

    const nowStr = () => new Date().toISOString().replace('T', ' ').substring(0, 19);

    // Reset nodes to idle
    setPipeline((prev) => ({
      ...prev,
      nodes: prev.nodes.map((n) => ({ ...n, status: 'idle', durationMs: undefined })),
    }));

    const newLogs: FlowExecutionStepLog[] = [
      {
        timestamp: nowStr(),
        nodeId: 'init',
        nodeLabel: 'Flow Orchestrator',
        level: 'info',
        message: `Starting execution run #${pipeline.executionCount + 1} of "${pipeline.name}"`,
      },
    ];
    setExecutionLogs(newLogs);

    // Sequential simulation of node pipeline execution
    for (let i = 0; i < pipeline.nodes.length; i++) {
      const node = pipeline.nodes[i];

      // Set node to running
      setPipeline((prev) => ({
        ...prev,
        nodes: prev.nodes.map((n, idx) => (idx === i ? { ...n, status: 'running' } : n)),
      }));

      // Add log
      setExecutionLogs((prev) => [
        ...prev,
        {
          timestamp: nowStr(),
          nodeId: node.id,
          nodeLabel: node.label,
          level: 'info',
          message: `Executing node [${node.service}]: ${node.description}`,
        },
      ]);

      const delay = Math.floor(Math.random() * 400) + 600;
      await new Promise((res) => setTimeout(res, delay));

      // Set node to success
      setPipeline((prev) => ({
        ...prev,
        nodes: prev.nodes.map((n, idx) =>
          idx === i ? { ...n, status: 'success', durationMs: delay } : n
        ),
      }));

      setExecutionLogs((prev) => [
        ...prev,
        {
          timestamp: nowStr(),
          nodeId: node.id,
          nodeLabel: node.label,
          level: 'success',
          message: `Completed successfully in ${delay}ms with validated payload.`,
        },
      ]);
    }

    setPipeline((prev) => ({
      ...prev,
      executionCount: prev.executionCount + 1,
      lastRun: new Date().toISOString(),
    }));
    setIsRunning(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">
            <Workflow className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
              <span>Google Flow Visual Automation Canvas</span>
              <span className="text-xs font-sans font-semibold bg-indigo-500/20 text-indigo-300 px-2.5 py-0.5 rounded-full border border-indigo-500/30">
                Active Pipeline Engine
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Visual multi-service pipeline orchestrating Google Workspace APIs, Gemini 3.7 AI exegesis, Veo video, and subscriber distribution.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRunPipeline}
            disabled={isRunning}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg transition-all active:scale-95"
            id="run-google-flow-btn"
          >
            <Play className={`w-4 h-4 fill-white ${isRunning ? 'animate-pulse' : ''}`} />
            <span>{isRunning ? 'Running Pipeline...' : 'Run Automation Pipeline'}</span>
          </button>
        </div>
      </div>

      {/* Main Flow Canvas Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Pipeline Nodes Stream */}
        <div className="lg:col-span-2 bg-slate-800/80 rounded-2xl p-6 border border-slate-700 space-y-4 shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
            <div>
              <h3 className="font-serif text-base font-bold text-white">{pipeline.name}</h3>
              <p className="text-xs text-slate-400">Trigger: {pipeline.triggerType} ({pipeline.scheduleInterval})</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono text-emerald-400 font-bold">{pipeline.executionCount} Total Runs</span>
              <div className="text-[10px] text-slate-500">Status: {pipeline.status.toUpperCase()}</div>
            </div>
          </div>

          {/* Node Cards Stack with Connecting Connectors */}
          <div className="space-y-3 py-2">
            {pipeline.nodes.map((node, index) => {
              const isSelected = selectedNode?.id === node.id;
              const isLast = index === pipeline.nodes.length - 1;

              return (
                <React.Fragment key={node.id}>
                  <div
                    onClick={() => setSelectedNode(node)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
                      isSelected
                        ? 'bg-slate-900 border-indigo-500/70 shadow-lg ring-1 ring-indigo-500/30'
                        : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 shadow-xs">
                          {getNodeIcon(node.type)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono uppercase text-slate-500 font-bold">
                              Step {index + 1} • {node.service}
                            </span>
                            {node.status === 'running' && (
                              <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                                <RefreshCw className="w-2.5 h-2.5 animate-spin" /> Running
                              </span>
                            )}
                            {node.status === 'success' && (
                              <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                <CheckCircle2 className="w-2.5 h-2.5" /> Done {node.durationMs ? `(${node.durationMs}ms)` : ''}
                              </span>
                            )}
                          </div>
                          <h4 className="font-serif text-sm font-bold text-white mt-0.5">{node.label}</h4>
                          <p className="text-xs text-slate-400 font-sans mt-0.5">{node.description}</p>
                        </div>
                      </div>

                      <ChevronRight className={`w-4 h-4 text-slate-600 transition-transform ${isSelected ? 'rotate-90 text-indigo-400' : ''}`} />
                    </div>
                  </div>

                  {/* Flow Connector Arrow */}
                  {!isLast && (
                    <div className="flex justify-center my-0.5">
                      <div className="w-0.5 h-4 bg-indigo-500/30 flex items-center justify-center">
                        <ArrowDown className="w-3 h-3 text-indigo-400" />
                      </div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Right Column: Node Inspector & Live Execution Terminal */}
        <div className="space-y-6">
          {/* Node Inspector */}
          {selectedNode ? (
            <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700 space-y-4 shadow-lg">
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-indigo-400" />
                  <h4 className="font-serif text-sm font-bold text-white">Node Inspector</h4>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-indigo-300 border border-slate-700">
                  {selectedNode.type}
                </span>
              </div>

              <div>
                <h5 className="font-serif text-base font-bold text-white">{selectedNode.label}</h5>
                <p className="text-xs text-slate-400 mt-1">{selectedNode.description}</p>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Active Parameters:</span>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs font-mono space-y-1.5 text-slate-300">
                  {Object.entries(selectedNode.config).map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between">
                      <span className="text-indigo-300">{k}:</span>
                      <span className="text-white font-semibold">{String(v)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {/* Live Execution Logs Terminal */}
          <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800 space-y-3 shadow-xl flex flex-col h-[400px]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <h4 className="font-mono text-xs font-bold text-white uppercase tracking-wider">Flow Execution Stream</h4>
              </div>
              <span className="text-[10px] font-mono text-slate-500">Live Telemetry</span>
            </div>

            <div className="flex-1 overflow-y-auto font-mono text-[11px] space-y-2 pr-1">
              {executionLogs.map((log, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded-lg leading-relaxed ${
                    log.level === 'success'
                      ? 'bg-emerald-950/30 text-emerald-300 border border-emerald-500/20'
                      : log.level === 'error'
                      ? 'bg-rose-950/30 text-rose-300 border border-rose-500/20'
                      : 'bg-slate-900/60 text-slate-300 border border-slate-800/80'
                  }`}
                >
                  <div className="flex items-center justify-between text-[9px] opacity-70 mb-0.5">
                    <span>{log.nodeLabel}</span>
                    <span>{log.timestamp}</span>
                  </div>
                  <div>{log.message}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
