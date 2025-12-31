import React, { useState, useEffect, useRef } from 'react';
import './IPFSPinningServiceWorkflow.css';

const IPFSPinningServiceWorkflow = () => {
  const [step, setStep] = useState(0);
  const [pinnedBlocks, setPinnedBlocks] = useState([]);
  const [replicatedNodes, setReplicatedNodes] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const isPlayingRef = useRef(false);
  const isPausedRef = useRef(false);
  const shouldStopRef = useRef(false);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  const sleep = (ms) => {
    return new Promise((resolve) => {
      const startTime = Date.now();
      const checkPause = () => {
        if (shouldStopRef.current) {
          resolve();
          return;
        }
        if (isPausedRef.current) {
          setTimeout(checkPause, 100);
        } else {
          const elapsedTime = Date.now() - startTime;
          const remainingTime = ms - elapsedTime;
          if (remainingTime > 0) {
            setTimeout(resolve, remainingTime);
          } else {
            resolve();
          }
        }
      };
      checkPause();
    });
  };

  const blocks = [
    { id: 'B1', x: 50, y: 45 },
    { id: 'B2', x: 43, y: 50 },
    { id: 'B3', x: 57, y: 50 },
    { id: 'B4', x: 50, y: 55 }
  ];

  const replicationNodes = [
    { id: 'N1', x: 25, y: 65 },
    { id: 'N2', x: 50, y: 70 },
    { id: 'N3', x: 75, y: 65 }
  ];

  const runSequence = async () => {
    shouldStopRef.current = false;
    setStep(0);
    setPinnedBlocks([]);
    setReplicatedNodes([]);

    // Scene 1: User Content
    setStep(1);
    await sleep(2000);
    if (shouldStopRef.current) return;

    // Scene 2: Pinning Request
    setStep(2);
    await sleep(2500);
    if (shouldStopRef.current) return;

    // Scene 3: Pinning Service Storage
    setStep(3);
    await sleep(800);
    if (shouldStopRef.current) return;
    
    for (let i = 0; i < blocks.length; i++) {
      if (shouldStopRef.current) return;
      setPinnedBlocks(prev => [...prev, blocks[i].id]);
      await sleep(400);
    }
    await sleep(1200);
    if (shouldStopRef.current) return;

    // Scene 4: Replication
    setStep(4);
    await sleep(800);
    if (shouldStopRef.current) return;
    
    for (let i = 0; i < replicationNodes.length; i++) {
      if (shouldStopRef.current) return;
      setReplicatedNodes(prev => [...prev, replicationNodes[i].id]);
      await sleep(600);
    }
    await sleep(1500);
    if (shouldStopRef.current) return;

    // Scene 5: Long-Term Availability
    setStep(5);
  };

  const handleStart = async () => {
    if (!isPlayingRef.current) {
      setIsPlaying(true);
      setIsPaused(false);
      await runSequence();
      setIsPlaying(false);
    }
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleSkip = async () => {
    if (isPlayingRef.current) {
      const nextStep = step + 1;
      if (nextStep === 2) {
        setStep(2);
      } else if (nextStep === 3) {
        setStep(3);
        setPinnedBlocks([]);
      } else if (nextStep === 4) {
        setStep(4);
        setPinnedBlocks(blocks.map(b => b.id));
        setReplicatedNodes([]);
      } else if (nextStep === 5) {
        setStep(5);
        setReplicatedNodes(replicationNodes.map(n => n.id));
      }
    }
  };

  const handleStop = () => {
    shouldStopRef.current = true;
    setIsPlaying(false);
    setIsPaused(false);
    setStep(0);
    setPinnedBlocks([]);
    setReplicatedNodes([]);
  };

  return (
    <div className="ipfs-pinning-service">
      <h2>IPFS Pinning Service Workflow</h2>
      
      <div className="controls">
        <button onClick={handleStart} disabled={isPlaying}>
          Start
        </button>
        <button onClick={handlePause} disabled={!isPlaying}>
          {isPaused ? 'Resume' : 'Pause'}
        </button>
        <button onClick={handleSkip} disabled={!isPlaying}>
          Skip
        </button>
        <button onClick={handleStop} disabled={!isPlaying}>
          Stop
        </button>
      </div>

      <svg viewBox="0 0 100 100" className="visualization">
        {/* User/Application Node */}
        {step >= 1 && (
          <g className="node-appear">
            <circle cx="15" cy="25" r="4" fill="#9b59b6" stroke="#8e44ad" strokeWidth="0.4" />
            <text x="15" y="33" fontSize="2.5" fill="#555" textAnchor="middle">
              User
            </text>
          </g>
        )}

        {/* User's CID */}
        {step >= 1 && step < 3 && (
          <g className="cid-appear">
            <rect x="6" y="38" width="18" height="6" rx="3" fill="#e8f4f8" stroke="#3498db" strokeWidth="0.3" />
            <text x="15" y="41.5" fontSize="2.5" fill="#3498db" textAnchor="middle" fontWeight="600">
              CID: Qm...
            </text>
          </g>
        )}

        {/* Pinning Service Node */}
        {step >= 2 && (
          <g className="node-appear">
            <rect x="46" y="21" width="8" height="8" rx="1" fill="#e74c3c" stroke="#c0392b" strokeWidth="0.4" />
            <text x="50" y="33" fontSize="2.5" fill="#555" textAnchor="middle">
              Pinning Service
            </text>
          </g>
        )}

        {/* Pin Request Arrow */}
        {step === 2 && (
          <g className="arrow-animate">
            <defs>
              <marker id="arrowhead-pin" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                <polygon points="0 0, 10 3, 0 6" fill="#e74c3c" />
              </marker>
            </defs>
            <line
              x1="20"
              y1="25"
              x2="46"
              y2="25"
              stroke="#e74c3c"
              strokeWidth="0.5"
              markerEnd="url(#arrowhead-pin)"
            />
            <text x="33" y="22" fontSize="2.5" fill="#e74c3c" textAnchor="middle" fontWeight="600">
              Pin Request
            </text>
          </g>
        )}

        {/* Pinning Service CID */}
        {step >= 3 && (
          <g className="cid-appear">
            <rect x="41" y="36" width="18" height="6" rx="3" fill="#e8f4f8" stroke="#3498db" strokeWidth="0.3" />
            <text x="50" y="39.5" fontSize="2.5" fill="#3498db" textAnchor="middle" fontWeight="600">
              CID: Qm...
            </text>
          </g>
        )}

        {/* Blocks in Pinning Service */}
        {step >= 3 && blocks.map((block, index) => (
          <g key={block.id}>
            <rect
              x={block.x - 2.5}
              y={block.y - 2}
              width="5"
              height="4"
              rx="0.5"
              fill="#3498db"
              stroke="#2980b9"
              strokeWidth="0.3"
              className={pinnedBlocks.includes(block.id) ? 'block-appear' : ''}
              opacity={pinnedBlocks.includes(block.id) ? 1 : 0}
            />
            
            {/* Pin icon on block */}
            {pinnedBlocks.includes(block.id) && (
              <g className="pin-appear">
                <circle cx={block.x + 2} cy={block.y - 1.5} r="1" fill="#e74c3c" />
                <rect x={block.x + 1.7} y={block.y - 0.8} width="0.6" height="1.5" fill="#e74c3c" />
              </g>
            )}

            {/* Connection to CID */}
            {step >= 3 && pinnedBlocks.includes(block.id) && (
              <line
                x1="50"
                y1="42"
                x2={block.x}
                y2={block.y - 2}
                stroke="#3498db"
                strokeWidth="0.2"
                strokeDasharray="0.5,0.5"
                opacity="0.5"
              />
            )}
          </g>
        ))}

        {/* Replication Nodes */}
        {step >= 4 && replicationNodes.map((node) => (
          <g key={node.id} className={replicatedNodes.includes(node.id) ? 'node-appear' : ''} opacity={replicatedNodes.includes(node.id) ? 1 : 0}>
            <circle cx={node.x} cy={node.y} r="3.5" fill="#3498db" stroke="#2980b9" strokeWidth="0.4" />
            
            {/* Small blocks in replicated nodes */}
            <rect x={node.x - 1.5} y={node.y - 1} width="1.5" height="1.2" rx="0.2" fill="#fff" opacity="0.8" />
            <rect x={node.x} y={node.y - 1} width="1.5" height="1.2" rx="0.2" fill="#fff" opacity="0.8" />
            <rect x={node.x - 1.5} y={node.y + 0.3} width="1.5" height="1.2" rx="0.2" fill="#fff" opacity="0.8" />
            <rect x={node.x} y={node.y + 0.3} width="1.5" height="1.2" rx="0.2" fill="#fff" opacity="0.8" />
            
            {/* Pin icon on node */}
            {replicatedNodes.includes(node.id) && (
              <g className="pin-appear">
                <circle cx={node.x + 2.5} cy={node.y - 2.5} r="1" fill="#e74c3c" />
                <rect x={node.x + 2.2} y={node.y - 1.8} width="0.6" height="1.5" fill="#e74c3c" />
              </g>
            )}

            {/* Replication arrows */}
            {replicatedNodes.includes(node.id) && (
              <line
                x1="50"
                y1="55"
                x2={node.x}
                y2={node.y - 3.5}
                stroke="#e74c3c"
                strokeWidth="0.3"
                strokeDasharray="1,1"
                opacity="0.6"
                className="replication-line"
              />
            )}
          </g>
        ))}

        {/* Time indicator (Scene 5) */}
        {step === 5 && (
          <g className="time-indicator">
            <circle cx="85" cy="15" r="4" fill="none" stroke="#95a5a6" strokeWidth="0.4" />
            <line x1="85" y1="15" x2="85" y2="12" stroke="#95a5a6" strokeWidth="0.4" />
            <line x1="85" y1="15" x2="87" y2="16" stroke="#95a5a6" strokeWidth="0.4" />
            <text x="85" y="23" fontSize="2.5" fill="#95a5a6" textAnchor="middle">
              Time Passes
            </text>
          </g>
        )}

        {/* Labels */}
        {step === 1 && (
          <text x="50" y="12" fontSize="4" fill="#555" textAnchor="middle" className="label-fade">
            CID to be Stored
          </text>
        )}

        {step === 3 && (
          <text x="50" y="12" fontSize="4" fill="#555" textAnchor="middle" className="label-fade">
            Pinned Content
          </text>
        )}

        {step === 4 && (
          <text x="50" y="12" fontSize="4" fill="#555" textAnchor="middle" className="label-fade">
            Replicated Storage
          </text>
        )}

        {step === 5 && (
          <text x="50" y="92" fontSize="3.5" fill="#27ae60" textAnchor="middle" className="label-fade" fontWeight="600">
            ✓ Content Always Available
          </text>
        )}
      </svg>
    </div>
  );
};

export default IPFSPinningServiceWorkflow;
