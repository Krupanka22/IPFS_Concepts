import React, { useState, useEffect, useRef } from 'react';
import './IPFSFileToCID.css';

const IPFSFileToCID = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [blocks, setBlocks] = useState([]);
  const [hashedBlocks, setHashedBlocks] = useState([]);
  const [merkleNodes, setMerkleNodes] = useState([]);
  const [cidReady, setCidReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  const isPausedRef = useRef(false);
  const isPlayingRef = useRef(false);
  const shouldStopRef = useRef(false);

  // File blocks positions (bottom layer)
  const blockPositions = [
    { x: 20, y: 70 },
    { x: 35, y: 70 },
    { x: 50, y: 70 },
    { x: 65, y: 70 },
    { x: 80, y: 70 },
  ];

  // Merkle tree structure
  const merkleLevel2 = [
    { x: 27.5, y: 50 }, // combines blocks 0,1
    { x: 57.5, y: 50 }, // combines blocks 2,3
    { x: 80, y: 50 },   // block 4 alone
  ];

  const merkleLevel1 = [
    { x: 42.5, y: 30 }, // combines first two level2 nodes
    { x: 80, y: 30 },   // level2 node 2
  ];

  const rootNode = { x: 50, y: 15 }; // CID root

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
    setBlocks([]);
    setHashedBlocks([]);
    setMerkleNodes([]);
    setCidReady(false);
  };

  const runSequence = async () => {
    shouldStopRef.current = false;
    resetAnimation();
    
    if (shouldStopRef.current) return;
    
    // Step 1: Show file (3s)
    await sleep(3000);
    if (shouldStopRef.current) return;
    
    // Step 2: Chunk file into blocks (transition)
    setCurrentStep(2);
    await sleep(800);
    if (shouldStopRef.current) return;
    
    // Show blocks one by one
    for (let i = 0; i < blockPositions.length; i++) {
      if (shouldStopRef.current) return;
      setBlocks(prev => [...prev, i]);
      await sleep(300);
    }
    await sleep(2000);
    if (shouldStopRef.current) return;
    
    // Step 3: Hash blocks
    setCurrentStep(3);
    await sleep(800);
    if (shouldStopRef.current) return;
    
    for (let i = 0; i < blockPositions.length; i++) {
      if (shouldStopRef.current) return;
      setHashedBlocks(prev => [...prev, i]);
      await sleep(400);
    }
    await sleep(2000);
    if (shouldStopRef.current) return;
    
    // Step 4: Build Merkle DAG
    setCurrentStep(4);
    await sleep(800);
    if (shouldStopRef.current) return;
    
    // Add level 2 nodes
    for (let i = 0; i < merkleLevel2.length; i++) {
      if (shouldStopRef.current) return;
      setMerkleNodes(prev => [...prev, { level: 2, index: i }]);
      await sleep(600);
    }
    await sleep(800);
    if (shouldStopRef.current) return;
    
    // Add level 1 nodes
    for (let i = 0; i < merkleLevel1.length; i++) {
      if (shouldStopRef.current) return;
      setMerkleNodes(prev => [...prev, { level: 1, index: i }]);
      await sleep(600);
    }
    await sleep(800);
    if (shouldStopRef.current) return;
    
    // Add root node
    setMerkleNodes(prev => [...prev, { level: 0, index: 0 }]);
    await sleep(1200);
    if (shouldStopRef.current) return;
    
    // Step 5: Show CID
    setCurrentStep(5);
    setCidReady(true);
    await sleep(4000);
    if (shouldStopRef.current) return;
    
    // Loop if still playing
    if (isPlayingRef.current && !shouldStopRef.current) {
      runSequence();
    }
  };

  // Animation sequence
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
    // Determine next step based on current step
    const nextStep = currentStep >= 5 ? 1 : currentStep + 1;
    
    // Reset if going back to step 1
    if (nextStep === 1) {
      resetAnimation();
      return;
    }
    
    // Jump to the appropriate state for each step
    setCurrentStep(nextStep);
    
    if (nextStep === 2) {
      setBlocks([0, 1, 2, 3, 4]);
    } else if (nextStep === 3) {
      setBlocks([0, 1, 2, 3, 4]);
      setHashedBlocks([0, 1, 2, 3, 4]);
    } else if (nextStep === 4) {
      setBlocks([0, 1, 2, 3, 4]);
      setHashedBlocks([0, 1, 2, 3, 4]);
      setMerkleNodes([
        { level: 2, index: 0 },
        { level: 2, index: 1 },
        { level: 2, index: 2 },
      ]);
    } else if (nextStep === 5) {
      setBlocks([0, 1, 2, 3, 4]);
      setHashedBlocks([0, 1, 2, 3, 4]);
      setMerkleNodes([
        { level: 2, index: 0 },
        { level: 2, index: 1 },
        { level: 2, index: 2 },
        { level: 1, index: 0 },
        { level: 1, index: 1 },
        { level: 0, index: 0 },
      ]);
      setCidReady(true);
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

  // Merkle tree connections
  const getConnections = () => {
    const connections = [];
    
    if (merkleNodes.some(n => n.level === 2)) {
      // Level 2 connections
      if (merkleNodes.some(n => n.level === 2 && n.index === 0)) {
        connections.push({ from: blockPositions[0], to: merkleLevel2[0] });
        connections.push({ from: blockPositions[1], to: merkleLevel2[0] });
      }
      if (merkleNodes.some(n => n.level === 2 && n.index === 1)) {
        connections.push({ from: blockPositions[2], to: merkleLevel2[1] });
        connections.push({ from: blockPositions[3], to: merkleLevel2[1] });
      }
      if (merkleNodes.some(n => n.level === 2 && n.index === 2)) {
        connections.push({ from: blockPositions[4], to: merkleLevel2[2] });
      }
    }
    
    if (merkleNodes.some(n => n.level === 1)) {
      if (merkleNodes.some(n => n.level === 1 && n.index === 0)) {
        connections.push({ from: merkleLevel2[0], to: merkleLevel1[0] });
        connections.push({ from: merkleLevel2[1], to: merkleLevel1[0] });
      }
      if (merkleNodes.some(n => n.level === 1 && n.index === 1)) {
        connections.push({ from: merkleLevel2[2], to: merkleLevel1[1] });
      }
    }
    
    if (merkleNodes.some(n => n.level === 0)) {
      connections.push({ from: merkleLevel1[0], to: rootNode });
      connections.push({ from: merkleLevel1[1], to: rootNode });
    }
    
    return connections;
  };

  return (
    <div className="file-to-cid-container">
      <h1 className="file-to-cid-heading">File to CID in IPFS</h1>
      
      <div className="control-buttons">
        {!isPlaying ? (
          <button className="control-btn start-btn" onClick={handleStart}>
            ▶ Start
          </button>
        ) : (
          <>
            <button className="control-btn pause-btn" onClick={handlePause}>
              {isPaused ? '▶ Resume' : '⏸ Pause'}
            </button>
            <button className="control-btn skip-btn" onClick={handleSkip}>
              ⏭ Skip
            </button>
            <button className="control-btn stop-btn" onClick={handleStop}>
              ⏹ Stop
            </button>
          </>
        )}
      </div>
      
      <div className="visualization-area">
        <svg className="cid-svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
          {/* Step 1: Original File */}
          {currentStep === 1 && (
            <g className="original-file">
              <rect
                x="40"
                y="45"
                width="20"
                height="25"
                rx="2"
                className="file-icon"
              />
              <line x1="45" y1="52" x2="55" y2="52" className="file-line" />
              <line x1="45" y1="57" x2="55" y2="57" className="file-line" />
              <line x1="45" y1="62" x2="52" y2="62" className="file-line" />
              <text x="50" y="78" className="step-label">
                Original File
              </text>
            </g>
          )}

          {/* Step 2 & onwards: File Blocks */}
          {currentStep >= 2 && (
            <g>
              {blocks.map((blockIdx) => (
                <rect
                  key={`block-${blockIdx}`}
                  x={blockPositions[blockIdx].x - 4}
                  y={blockPositions[blockIdx].y - 3}
                  width="8"
                  height="6"
                  rx="1"
                  className={`file-block ${hashedBlocks.includes(blockIdx) ? 'hashed' : ''}`}
                />
              ))}
              {currentStep === 2 && blocks.length > 0 && (
                <text x="50" y="85" className="step-label">
                  File Blocks
                </text>
              )}
            </g>
          )}

          {/* Step 3: Hashing labels */}
          {currentStep === 3 && hashedBlocks.length > 0 && (
            <g>
              {hashedBlocks.map((blockIdx) => (
                <text
                  key={`hash-${blockIdx}`}
                  x={blockPositions[blockIdx].x}
                  y={blockPositions[blockIdx].y + 8}
                  className="hash-text"
                >
                  {`${blockIdx}a7f`}
                </text>
              ))}
              <text x="50" y="92" className="step-label">
                Cryptographic Hashing
              </text>
            </g>
          )}

          {/* Step 4 & 5: Merkle DAG */}
          {currentStep >= 4 && (
            <g>
              {/* Draw connections */}
              {getConnections().map((conn, idx) => (
                <line
                  key={`conn-${idx}`}
                  x1={conn.from.x}
                  y1={conn.from.y}
                  x2={conn.to.x}
                  y2={conn.to.y}
                  className="merkle-connection"
                />
              ))}

              {/* Level 2 nodes */}
              {merkleNodes
                .filter(n => n.level === 2)
                .map(node => (
                  <circle
                    key={`l2-${node.index}`}
                    cx={merkleLevel2[node.index].x}
                    cy={merkleLevel2[node.index].y}
                    r="3"
                    className="merkle-node level2"
                  />
                ))}

              {/* Level 1 nodes */}
              {merkleNodes
                .filter(n => n.level === 1)
                .map(node => (
                  <circle
                    key={`l1-${node.index}`}
                    cx={merkleLevel1[node.index].x}
                    cy={merkleLevel1[node.index].y}
                    r="3"
                    className="merkle-node level1"
                  />
                ))}

              {/* Root node */}
              {merkleNodes.some(n => n.level === 0) && (
                <g>
                  <circle
                    cx={rootNode.x}
                    cy={rootNode.y}
                    r="4"
                    className={`merkle-node root ${cidReady ? 'cid-highlight' : ''}`}
                  />
                  {cidReady && (
                    <g>
                      <text x={50} y={4} className="cid-label">
                        CID (Content Identifier)
                      </text>
                      <text x={50} y={8} className="cid-value">
                        QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco
                      </text>
                    </g>
                  )}
                </g>
              )}

              {currentStep === 4 && !cidReady && (
                <text x="50" y="92" className="step-label">
                  Merkle DAG Formation
                </text>
              )}
            </g>
          )}
        </svg>
      </div>
    </div>
  );
};

export default IPFSFileToCID;
