import React, { useState, useEffect, useRef } from 'react';
import './IPFSMerkleDAG.css';

const IPFSMerkleDAG = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [changedBlock, setChangedBlock] = useState(null);
  const [updatedNodes, setUpdatedNodes] = useState([]);
  const [showOldRoot, setShowOldRoot] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  const isPausedRef = useRef(false);
  const isPlayingRef = useRef(false);
  const shouldStopRef = useRef(false);

  // Data blocks (bottom layer)
  const dataBlocks = [
    { id: 'b1', x: 15, y: 75, hash: 'a3f7', newHash: 'x9k2' },
    { id: 'b2', x: 35, y: 75, hash: 'b8d1', newHash: 'b8d1' },
    { id: 'b3', x: 55, y: 75, hash: 'c2e9', newHash: 'c2e9' },
    { id: 'b4', x: 75, y: 75, hash: 'd5a4', newHash: 'd5a4' },
    { id: 'b5', x: 85, y: 75, hash: 'e1f6', newHash: 'e1f6' },
  ];

  // Level 2 nodes
  const level2Nodes = [
    { id: 'l2-1', x: 25, y: 55, hash: '7k3p', newHash: 'm4w8' },
    { id: 'l2-2', x: 55, y: 55, hash: '9m2q', newHash: '9m2q' },
    { id: 'l2-3', x: 85, y: 55, hash: '4n8r', newHash: '4n8r' },
  ];

  // Level 1 nodes
  const level1Nodes = [
    { id: 'l1-1', x: 40, y: 35, hash: 'v5j9', newHash: 'p8t3' },
    { id: 'l1-2', x: 85, y: 35, hash: 'w6k1', newHash: 'w6k1' },
  ];

  // Root node
  const rootNode = { id: 'root', x: 50, y: 15, hash: 'QmX4f8', newHash: 'QmY7n2' };

  const sleep = (ms) => new Promise(resolve => {
    const checkInterval = 50;
    let elapsed = 0;
    
    const check = () => {
      if (shouldStopRef.current) {
        resolve();
        return;
      }
      
      if (!isPausedRef.current) {
        elapsed += checkInterval;
        if (elapsed >= ms) {
          resolve();
        } else {
          setTimeout(check, checkInterval);
        }
      } else {
        setTimeout(check, checkInterval);
      }
    };
    
    setTimeout(check, checkInterval);
  });

  const resetAnimation = () => {
    setCurrentStep(1);
    setChangedBlock(null);
    setUpdatedNodes([]);
    setShowOldRoot(false);
  };

  const runSequence = async () => {
    shouldStopRef.current = false;
    resetAnimation();
    
    if (shouldStopRef.current) return;
    
    // Step 1: Show data blocks (2s)
    await sleep(2500);
    if (shouldStopRef.current) return;
    
    // Step 2: Build DAG
    setCurrentStep(2);
    await sleep(2500);
    if (shouldStopRef.current) return;
    
    // Step 3: Highlight root
    setCurrentStep(3);
    await sleep(2500);
    if (shouldStopRef.current) return;
    
    // Step 4: Change block and propagate
    setCurrentStep(4);
    await sleep(500);
    if (shouldStopRef.current) return;
    
    // Change first block
    setChangedBlock(0);
    await sleep(1000);
    if (shouldStopRef.current) return;
    
    // Update level 2 node
    setUpdatedNodes(['l2-1']);
    await sleep(800);
    if (shouldStopRef.current) return;
    
    // Update level 1 node
    setUpdatedNodes(['l2-1', 'l1-1']);
    await sleep(800);
    if (shouldStopRef.current) return;
    
    // Show old root fading
    setShowOldRoot(true);
    await sleep(400);
    if (shouldStopRef.current) return;
    
    // Update root
    setUpdatedNodes(['l2-1', 'l1-1', 'root']);
    await sleep(2000);
    if (shouldStopRef.current) return;
    
    // Hide old root
    setShowOldRoot(false);
    await sleep(1500);
    if (shouldStopRef.current) return;
    
    // Loop if still playing
    if (isPlayingRef.current && !shouldStopRef.current) {
      runSequence();
    }
  };

  useEffect(() => {
    isPlayingRef.current = isPlaying;
    isPausedRef.current = isPaused;
    
    if (isPlaying && !isPaused) {
      runSequence();
    }
  }, [isPlaying]);

  const handleStart = () => {
    setIsPlaying(true);
    setIsPaused(false);
    isPlayingRef.current = true;
    isPausedRef.current = false;
  };

  const handlePause = () => {
    const newPausedState = !isPaused;
    setIsPaused(newPausedState);
    isPausedRef.current = newPausedState;
  };

  const handleSkip = () => {
    const nextStep = currentStep >= 4 ? 1 : currentStep + 1;
    
    if (nextStep === 1) {
      resetAnimation();
      return;
    }
    
    setCurrentStep(nextStep);
    
    if (nextStep === 4) {
      setChangedBlock(0);
      setUpdatedNodes(['l2-1', 'l1-1', 'root']);
      setShowOldRoot(false);
    }
  };

  const handleStop = () => {
    shouldStopRef.current = true;
    setIsPlaying(false);
    setIsPaused(false);
    isPlayingRef.current = false;
    isPausedRef.current = false;
    resetAnimation();
  };

  // DAG connections
  const getConnections = () => {
    const connections = [];
    
    if (currentStep >= 2) {
      // Data blocks to level 2
      connections.push({ from: dataBlocks[0], to: level2Nodes[0] });
      connections.push({ from: dataBlocks[1], to: level2Nodes[0] });
      connections.push({ from: dataBlocks[2], to: level2Nodes[1] });
      connections.push({ from: dataBlocks[3], to: level2Nodes[1] });
      connections.push({ from: dataBlocks[4], to: level2Nodes[2] });
      
      // Level 2 to level 1
      connections.push({ from: level2Nodes[0], to: level1Nodes[0] });
      connections.push({ from: level2Nodes[1], to: level1Nodes[0] });
      connections.push({ from: level2Nodes[2], to: level1Nodes[1] });
      
      // Level 1 to root
      connections.push({ from: level1Nodes[0], to: rootNode });
      connections.push({ from: level1Nodes[1], to: rootNode });
    }
    
    return connections;
  };

  return (
    <div className="merkle-dag-container">
      <h1 className="merkle-dag-heading">Merkle DAG and Immutability in IPFS</h1>
      
      <div className="dag-control-buttons">
        {!isPlaying ? (
          <button className="dag-control-btn dag-start-btn" onClick={handleStart}>
            ▶ Start
          </button>
        ) : (
          <>
            <button className="dag-control-btn dag-pause-btn" onClick={handlePause}>
              {isPaused ? '▶ Resume' : '⏸ Pause'}
            </button>
            <button className="dag-control-btn dag-skip-btn" onClick={handleSkip}>
              ⏭ Skip
            </button>
            <button className="dag-control-btn dag-stop-btn" onClick={handleStop}>
              ⏹ Stop
            </button>
          </>
        )}
      </div>
      
      <div className="dag-visualization-area">
        <svg className="dag-svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
          {/* Connections */}
          {getConnections().map((conn, idx) => {
            const isAffected = currentStep === 4 && (
              (changedBlock === 0 && (
                conn.from.id === 'b1' || conn.to.id === 'l2-1' ||
                conn.to.id === 'l1-1' || conn.to.id === 'root'
              ))
            );
            
            return (
              <line
                key={`conn-${idx}`}
                x1={conn.from.x}
                y1={conn.from.y}
                x2={conn.to.x}
                y2={conn.to.y}
                className={`dag-connection ${isAffected ? 'affected' : ''}`}
                markerEnd="url(#arrowhead-dag)"
              />
            );
          })}

          <defs>
            <marker
              id="arrowhead-dag"
              markerWidth="10"
              markerHeight="10"
              refX="5"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 6 3, 0 6" fill="#95a5a6" opacity="0.6" />
            </marker>
          </defs>

          {/* Step 1+: Data blocks */}
          {currentStep >= 1 && dataBlocks.map((block, idx) => {
            const isChanged = changedBlock === idx;
            const hash = isChanged && currentStep === 4 ? block.newHash : block.hash;
            
            return (
              <g key={block.id}>
                <rect
                  x={block.x - 4}
                  y={block.y - 3}
                  width="8"
                  height="6"
                  rx="1"
                  className={`dag-data-block ${isChanged ? 'changed' : ''}`}
                />
                <text x={block.x} y={block.y + 8} className="dag-hash-label">
                  {hash}
                </text>
              </g>
            );
          })}

          {currentStep === 1 && (
            <text x="50" y="90" className="dag-step-label">
              Hashed Data Blocks
            </text>
          )}

          {/* Step 2+: Level 2 nodes */}
          {currentStep >= 2 && level2Nodes.map((node) => {
            const isUpdated = updatedNodes.includes(node.id);
            const hash = isUpdated ? node.newHash : node.hash;
            
            return (
              <g key={node.id}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="3.5"
                  className={`dag-node ${isUpdated ? 'updated' : ''}`}
                />
                <text x={node.x} y={node.y + 8} className="dag-hash-label">
                  {hash}
                </text>
              </g>
            );
          })}

          {/* Step 2+: Level 1 nodes */}
          {currentStep >= 2 && level1Nodes.map((node) => {
            const isUpdated = updatedNodes.includes(node.id);
            const hash = isUpdated ? node.newHash : node.hash;
            
            return (
              <g key={node.id}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="3.5"
                  className={`dag-node ${isUpdated ? 'updated' : ''}`}
                />
                <text x={node.x} y={node.y + 8} className="dag-hash-label">
                  {hash}
                </text>
              </g>
            );
          })}

          {/* Step 2+: Root node */}
          {currentStep >= 2 && (
            <g>
              {showOldRoot && (
                <g className="old-root-group">
                  <circle
                    cx={rootNode.x}
                    cy={rootNode.y}
                    r="4.5"
                    className="dag-root-node old-root"
                  />
                  <text x={rootNode.x} y={rootNode.y + 9} className="dag-hash-label old-root-text">
                    {rootNode.hash}
                  </text>
                </g>
              )}
              
              <circle
                cx={rootNode.x}
                cy={rootNode.y}
                r="4.5"
                className={`dag-root-node ${currentStep === 3 ? 'highlighted' : ''} ${updatedNodes.includes('root') ? 'updated' : ''}`}
              />
              <text x={rootNode.x} y={rootNode.y + 9} className="dag-hash-label">
                {updatedNodes.includes('root') ? rootNode.newHash : rootNode.hash}
              </text>
            </g>
          )}

          {currentStep === 2 && (
            <text x="50" y="5" className="dag-step-label">
              Merkle DAG
            </text>
          )}

          {currentStep === 3 && (
            <text x="50" y="5" className="dag-step-label">
              Root Hash (CID)
            </text>
          )}

          {currentStep === 4 && (
            <text x="50" y="5" className="dag-step-label">
              Hash Propagation (Immutability)
            </text>
          )}
        </svg>
      </div>
    </div>
  );
};

export default IPFSMerkleDAG;
