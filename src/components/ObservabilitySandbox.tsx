import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Activity, Zap, Play, RotateCcw, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface LogMessage {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS';
  text: string;
}

export const ObservabilitySandbox: React.FC = () => {
  // Simulator States
  const [trafficSurge, setTrafficSurge] = useState(false);
  const [dbLatency, setDbLatency] = useState(false);
  
  // Deployment evaluation states
  const [deploying, setDeploying] = useState(false);
  const [deployResult, setDeployResult] = useState<{
    score: number;
    status: 'low' | 'medium' | 'high' | null;
    message: string;
  }>({ score: 0, status: null, message: '' });

  // Logs stream
  const [logs, setLogs] = useState<LogMessage[]>([]);
  const terminalBodyRef = useRef<HTMLDivElement>(null);

  // Initialize with some diagnostic logs
  useEffect(() => {
    const initialLogs: LogMessage[] = [
      { id: '1', timestamp: getTimestamp(), level: 'INFO', text: 'Telemetry engine started.' },
      { id: '2', timestamp: getTimestamp(), level: 'INFO', text: 'Ingress Gateway status: STABLE [120 req/s].' },
      { id: '3', timestamp: getTimestamp(), level: 'INFO', text: 'Microservices cluster reporting 0% CPU throttle.' },
      { id: '4', timestamp: getTimestamp(), level: 'SUCCESS', text: 'All health checks green. System healthy.' }
    ];
    setLogs(initialLogs);
  }, []);

  // Scroll logs to bottom of container only, without triggering parent page scroll
  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [logs]);

  // Periodic normal log generation to make it feel alive
  useEffect(() => {
    const interval = setInterval(() => {
      if (deploying) return; // Don't interrupt deployment logs

      const randomLogs = [
        `Ingress Gateway: processed ${100 + Math.floor(Math.random() * 50)} req/s.`,
        `DB pool connections active: ${5 + Math.floor(Math.random() * 5)}/50.`,
        `Compute nodes heartbeats verified.`,
        `Cache hit-rate: ${(85 + Math.random() * 10).toFixed(1)}%.`
      ];

      // If traffic surge is on, log surge metrics
      if (trafficSurge) {
        randomLogs.push(`WARNING: Gateway ingress queue depth is ${200 + Math.floor(Math.random() * 100)}.`);
        randomLogs.push(`Traffic high: processing ${12000 + Math.floor(Math.random() * 1000)} req/s.`);
      }

      // If DB latency is on, log latency metrics
      if (dbLatency) {
        randomLogs.push(`ERROR: Database thread pool exhausted. Query execution time: ${1200 + Math.floor(Math.random() * 800)}ms.`);
        randomLogs.push(`Service mesh reporting read-timeout on cluster nodes.`);
      }

      const chosenText = randomLogs[Math.floor(Math.random() * randomLogs.length)];
      let level: 'INFO' | 'WARN' | 'ERROR' = 'INFO';
      if (chosenText.includes('WARNING')) level = 'WARN';
      else if (chosenText.includes('ERROR')) level = 'ERROR';

      addLog(level, chosenText);
    }, 4500);

    return () => clearInterval(interval);
  }, [trafficSurge, dbLatency, deploying]);

  function getTimestamp() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }

  const addLog = (level: 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS', text: string) => {
    setLogs((prev) => [
      ...prev.slice(-30), // Limit log history
      { id: Math.random().toString(), timestamp: getTimestamp(), level, text }
    ]);
  };

  // Trigger Traffic Surge
  const toggleTrafficSurge = () => {
    const newState = !trafficSurge;
    setTrafficSurge(newState);
    if (newState) {
      addLog('WARN', 'Traffic Surge injected: scaling to 15,000 requests/second.');
    } else {
      addLog('INFO', 'Traffic Surge halted. Scaling back ingress traffic to baseline.');
    }
  };

  // Trigger DB Latency
  const toggleDbLatency = () => {
    const newState = !dbLatency;
    setDbLatency(newState);
    if (newState) {
      addLog('ERROR', 'Database fault injected: introducing +1200ms read/write latency.');
    } else {
      addLog('SUCCESS', 'Database fault cleared. Query performance returned to <15ms.');
    }
  };

  // Reset Simulator
  const resetSimulator = () => {
    setTrafficSurge(false);
    setDbLatency(false);
    setDeploying(false);
    setDeployResult({ score: 0, status: null, message: '' });
    setLogs([
      { id: Math.random().toString(), timestamp: getTimestamp(), level: 'INFO', text: 'Telemetry engine restarted.' },
      { id: Math.random().toString(), timestamp: getTimestamp(), level: 'SUCCESS', text: 'System reset completed. Observability logs cleared.' }
    ]);
  };

  // Evaluate Code Change Deployment (Predictive Simulation)
  const handleDeployChange = () => {
    if (deploying) return;
    setDeploying(true);
    setDeployResult({ score: 0, status: null, message: '' });

    addLog('INFO', 'Initiating canary code deployment. Checking active environment variables...');
    
    // Simulate steps in deployment pipeline
    setTimeout(() => {
      addLog('INFO', 'Analyzing system telemetry and predicting success scores...');
    }, 800);

    setTimeout(() => {
      // Calculate risk score based on active problems
      let riskScore = 8; // base risk is 8%
      if (trafficSurge) riskScore += 42;
      if (dbLatency) riskScore += 45;

      let status: 'low' | 'medium' | 'high' = 'low';
      let message = 'Deployment safe to execute. Health checks predicting 99.99% system availability.';

      if (riskScore >= 80) {
        status = 'high';
        message = 'Deployment blocked! High incident likelihood. DB latency and severe network overload detected.';
        addLog('ERROR', `Predictive risk analysis: High risk (${riskScore}%). Automated deployment rollback triggered.`);
      } else if (riskScore > 30) {
        status = 'medium';
        message = 'Warning: Elevated risk. Low service availability prediction (99.8%). Traffic surge might cause request queue drops.';
        addLog('WARN', `Predictive risk analysis: Moderate risk (${riskScore}%). Deploying canary with 10% traffic weight.`);
      } else {
        status = 'low';
        addLog('SUCCESS', `Predictive risk analysis: Low risk (${riskScore}%). Canary promotion completed successfully.`);
      }

      setDeployResult({ score: riskScore, status, message });
      setDeploying(false);
    }, 2000);
  };

  return (
    <div className="glass-panel" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '24px', maxHeight: '720px', overflow: 'hidden' }}>
      
      {/* Title & Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid var(--card-border)', paddingBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: 'var(--accent)', color: 'var(--bg-solid)', padding: '8px', borderRadius: '10px', display: 'flex' }}>
            <Activity size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Telemetry & Deployment Simulator</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Test network faults, trigger traffic loads, and run predictive change analysis on distributed clusters.
            </p>
          </div>
        </div>

        <button 
          onClick={resetSimulator} 
          style={{
            background: 'transparent',
            border: '1px solid var(--card-border)',
            borderRadius: '8px',
            padding: '6px 12px',
            color: 'var(--text-primary)',
            fontSize: '0.8rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--card-border)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <RotateCcw size={14} />
          <span>Reset Chaos</span>
        </button>
      </div>

      {/* Main Grid */}
      <div className="sandbox-grid">
        
        {/* Left Side: Interactive Network Visualizer */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div 
            style={{ 
              background: '#0d0d0f', 
              borderRadius: '12px', 
              padding: '20px', 
              height: '300px', 
              position: 'relative', 
              overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {/* SVG Interactive Topology Map */}
            <svg viewBox="0 0 400 240" style={{ width: '100%', height: '100%', zIndex: 5 }}>
              <defs>
                <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#2dd4bf" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Connections (Lines) */}
              <line 
                x1="80" y1="120" x2="200" y2="70" 
                stroke={trafficSurge ? "#f87171" : "#52525b"} 
                strokeWidth={trafficSurge ? "2.5" : "1.5"} 
                strokeDasharray={trafficSurge ? "4 4" : "none"}
                style={{ transition: 'stroke 0.3s, stroke-width 0.3s' }}
              />
              <line 
                x1="80" y1="120" x2="200" y2="170" 
                stroke="#52525b" 
                strokeWidth="1.5" 
              />
              <line 
                x1="200" y1="70" x2="320" y2="120" 
                stroke={dbLatency ? "#ef4444" : "#52525b"} 
                strokeWidth={dbLatency ? "2.5" : "1.5"} 
                strokeDasharray={dbLatency ? "4 4" : "none"}
                style={{ transition: 'stroke 0.3s, stroke-width 0.3s' }}
              />
              <line 
                x1="200" y1="170" x2="200" y2="70" 
                stroke={deploying ? "#818cf8" : "#52525b"} 
                strokeWidth={deploying ? "2" : "1.5"}
                style={{ transition: 'stroke 0.3s' }}
              />

              {/* Glowing animated dots representing data flows */}
              {!dbLatency && (
                <circle r="4" fill="#2dd4bf" filter="url(#glow)">
                  <animateMotion 
                    path="M 80 120 L 200 70" 
                    dur={trafficSurge ? "0.6s" : "1.8s"} 
                    repeatCount="indefinite" 
                  />
                </circle>
              )}
              {trafficSurge && !dbLatency && (
                <circle r="4" fill="#ef4444" filter="url(#glow)">
                  <animateMotion 
                    path="M 80 120 L 200 70" 
                    dur="0.4s" 
                    begin="0.2s"
                    repeatCount="indefinite" 
                  />
                </circle>
              )}
              <circle r="3.5" fill="#a1a1aa">
                <animateMotion 
                  path="M 80 120 L 200 170" 
                  dur="2.5s" 
                  repeatCount="indefinite" 
                />
              </circle>
              <circle r="4" fill={dbLatency ? "#ef4444" : "#2dd4bf"} filter="url(#glow)">
                <animateMotion 
                  path="M 200 70 L 320 120" 
                  dur={dbLatency ? "4s" : "1.5s"} 
                  repeatCount="indefinite" 
                />
              </circle>

              {/* Node 1: Ingress Gateway */}
              <g transform="translate(80, 120)" style={{ cursor: 'pointer' }}>
                <circle r="22" fill="#1e1e24" stroke="#52525b" strokeWidth="2" />
                <circle r="6" fill={trafficSurge ? "#f87171" : "#818cf8"} />
                <text y="36" textAnchor="middle" fill="#a1a1aa" fontSize="10" fontFamily="var(--font-mono)">Gateway</text>
              </g>

              {/* Node 2: API Services */}
              <g transform="translate(200, 70)">
                <circle 
                  r="24" 
                  fill="#1e1e24" 
                  stroke={deploying ? "#818cf8" : (dbLatency || trafficSurge ? "#fbbf24" : "#2dd4bf")} 
                  strokeWidth="2.5" 
                  style={{ transition: 'stroke 0.3s' }}
                />
                <circle r="7" fill={deploying ? "#818cf8" : (dbLatency || trafficSurge ? "#fbbf24" : "#10b981")} />
                <text y="38" textAnchor="middle" fill="#a1a1aa" fontSize="10" fontFamily="var(--font-mono)">API Node</text>
              </g>

              {/* Node 3: Risk Evaluator */}
              <g transform="translate(200, 170)">
                <circle r="22" fill="#1e1e24" stroke="#52525b" strokeWidth="2" />
                <circle r="6" fill="#f43f5e" />
                <text y="36" textAnchor="middle" fill="#a1a1aa" fontSize="10" fontFamily="var(--font-mono)">Risk Engine</text>
              </g>

              {/* Node 4: Distributed DB */}
              <g transform="translate(320, 120)">
                <circle 
                  r="24" 
                  fill="#1e1e24" 
                  stroke={dbLatency ? "#ef4444" : "#52525b"} 
                  strokeWidth="2" 
                  style={{ transition: 'stroke 0.3s' }}
                  className={dbLatency ? "pulse-node" : ""}
                />
                <circle r="6" fill={dbLatency ? "#ef4444" : "#a78bfa"} />
                <text y="36" textAnchor="middle" fill="#a1a1aa" fontSize="10" fontFamily="var(--font-mono)">Database</text>
              </g>
            </svg>

            {/* Subtle floating overlay label */}
            <div style={{ position: 'absolute', top: '12px', left: '12px', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', animation: 'pulse 1.5s infinite' }} />
              <span>LIVE CLUSTER GRAPH</span>
            </div>
          </div>

          {/* Fault Controllers */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={toggleTrafficSurge}
              style={{
                flex: 1,
                minWidth: '140px',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid',
                borderColor: trafficSurge ? '#ef4444' : 'var(--card-border)',
                backgroundColor: trafficSurge ? 'rgba(239, 68, 68, 0.08)' : 'var(--card-bg)',
                color: trafficSurge ? '#ef4444' : 'var(--text-primary)',
                fontFamily: 'var(--font-sans)',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
              }}
            >
              <Zap size={14} />
              <span>{trafficSurge ? 'Halt Traffic Surge' : 'Inject Traffic Surge'}</span>
            </button>

            <button
              onClick={toggleDbLatency}
              style={{
                flex: 1,
                minWidth: '140px',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid',
                borderColor: dbLatency ? '#ef4444' : 'var(--card-border)',
                backgroundColor: dbLatency ? 'rgba(239, 68, 68, 0.08)' : 'var(--card-bg)',
                color: dbLatency ? '#ef4444' : 'var(--text-primary)',
                fontFamily: 'var(--font-sans)',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
              }}
            >
              <AlertTriangle size={14} />
              <span>{dbLatency ? 'Clear DB Latency' : 'Inject DB Latency'}</span>
            </button>
          </div>
        </div>

        {/* Right Side: Deployment Controls & Log Terminal */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%', justifyContent: 'space-between' }}>
          
          {/* Predictive Change Deployment Section */}
          <div className="glass-panel" style={{ padding: '20px', border: '1px solid var(--card-border)', display: 'flex', flexDirection: 'column', gap: '12px', background: 'rgba(255, 255, 255, 0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>
                Deployment Pipeline
              </span>
              {deployResult.status && (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '4px',
                  fontSize: '0.75rem', 
                  fontWeight: 600,
                  color: deployResult.status === 'low' ? '#10b981' : (deployResult.status === 'medium' ? '#fbbf24' : '#ef4444')
                }}>
                  {deployResult.status === 'low' ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
                  <span style={{ textTransform: 'capitalize' }}>Risk: {deployResult.score}%</span>
                </div>
              )}
            </div>

            <button
              onClick={handleDeployChange}
              disabled={deploying}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '8px',
                background: 'var(--text-primary)',
                color: 'var(--bg-solid)',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: deploying ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
                opacity: deploying ? 0.7 : 1
              }}
              onMouseEnter={(e) => {
                if (!deploying) e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                if (!deploying) e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <Play size={14} />
              <span>{deploying ? 'Deploying Canary...' : 'Deploy Canary Change'}</span>
            </button>

            {deployResult.status && (
              <div 
                style={{ 
                  padding: '10px 14px', 
                  borderRadius: '6px', 
                  background: deployResult.status === 'low' ? 'rgba(16, 185, 129, 0.08)' : (deployResult.status === 'medium' ? 'rgba(251, 191, 36, 0.08)' : 'rgba(239, 68, 68, 0.08)'),
                  border: '1px solid',
                  borderColor: deployResult.status === 'low' ? 'rgba(16, 185, 129, 0.2)' : (deployResult.status === 'medium' ? 'rgba(251, 191, 36, 0.2)' : 'rgba(239, 68, 68, 0.2)'),
                  fontSize: '0.8rem',
                  lineHeight: '1.4',
                  color: 'var(--text-primary)'
                }}
              >
                {deployResult.message}
              </div>
            )}
          </div>

          {/* Logs Terminal */}
          <div 
            style={{ 
              background: '#0d0d0f', 
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '12px', 
              padding: '16px', 
              flex: 1, 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '10px',
              height: '240px',
              minHeight: '240px',
              fontFamily: 'var(--font-mono)'
            }}
          >
            {/* Terminal Title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280', fontSize: '0.65rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '6px' }}>
              <Terminal size={12} />
              <span>SYSTEM_TELEMETRY_STREAM</span>
            </div>

            {/* Log Messages list */}
            <div 
              ref={terminalBodyRef}
              style={{ 
                flex: 1, 
                overflowY: 'auto', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '6px',
                fontSize: '0.75rem',
                lineHeight: '1.4',
                color: '#e4e4e7'
              }}
            >
              {logs.map((log) => {
                let color = '#a1a1aa';
                if (log.level === 'WARN') color = '#fbbf24';
                else if (log.level === 'ERROR') color = '#ef4444';
                else if (log.level === 'SUCCESS') color = '#34d399';

                return (
                  <div key={log.id} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                    <span style={{ color: '#4b5563', userSelect: 'none' }}>[{log.timestamp}]</span>
                    <span style={{ color, fontWeight: 'bold' }}>{log.level}:</span>
                    <span style={{ flex: 1, wordBreak: 'break-all' }}>{log.text}</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

      <style>{`
        .pulse-node {
          animation: dbPulse 1.5s infinite ease-in-out;
        }
        @keyframes dbPulse {
          0%, 100% { stroke: #ef4444; stroke-width: 2px; }
          50% { stroke: #ef4444; stroke-width: 4px; box-shadow: 0 0 15px #ef4444; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};
