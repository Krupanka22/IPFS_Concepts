import React, { useState, useEffect, useRef } from 'react';
import './IPFSBitswap.css';

const IPFSBitswap = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [blockRequests, setBlockRequests] = useState([]);
  const [blockTransfers, setBlockTransfers] = useState([]);
  const [receivedBlocks, setReceivedBlocks] = useState([]);
  const [missingPeer, setMissingPeer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  const isPausedRef = useRef(false);
  const isPlayingRef = useRef(false);
  const shouldStopRef = useRef(false);

  // Requesting node
  const requestingNode = { id: 'requester', x: 50, y: 50 };
  const cid = "QmXoypiz...";

  // Provider nodes with their blocks
  const providerNodes = [
    { id: 'p1', x: 30, y: 20, blocks: ['A', 'B'] },
    { id: 'p2', x: 70, y: 20, blocks: ['C', 'D'] },
    { id: 'p3', x: 85, y: 50, blocks: ['E'] },
    { id: 'p4', x: 70, y: 80, blocks: ['F', 'G'] },
    { id: 'p5', x: 30, y: 80, blocks: ['H'] },
    { id: 'p6', x: 15, y: 50, blocks: ['I', 'J'] },
  ];

  const allBlocks = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

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
    setBlockRequests([]);
    setBlockTransfers([]);
    setReceivedBlocks([]);
    setMissingPeer(null);
  };

  const runSequence = async () => {
    shouldStopRef.current = false;
    resetAnimation();
    
    if (shouldStopRef.current) return;
    
    // Step 1: Show requesting node (2s)
    await sleep(2000);
    if (shouldStopRef.current) return;
    
    // Step 2: Show provider nodes (2s)
    setCurrentStep(2);
    await sleep(2500);
    if (shouldStopRef.current) return;
    
    // Step 3: Send Bitswap requests
    setCurrentStep(3);
    await sleep(500);
    if (shouldStopRef.current) return;
    
    // Send requests to all providers simultaneously
    const requests = providerNodes.map((node, idx) => ({
      id: `req-${idx}`,
      to: node,
      blocks: node.blocks,
    }));
    
    for (let i = 0; i < requests.length; i++) {
      if (shouldStopRef.current) return;
      setBlockRequests(prev => [...prev, requests[i]]);
      await sleep(150);
    }
    
    await sleep(1500);
    if (shouldStopRef.current) return;
    
    // Step 4: Block transfers - parallel
    setCurrentStep(4);
    setBlockRequests([]); // Clear requests
    await sleep(500);
    if (shouldStopRef.current) return;
    
    // Start transfers from all peers in parallel
    const transferPromises = [];
    
    providerNodes.forEach((node, nodeIdx) => {
      node.blocks.forEach((block, blockIdx) => {
        const delay = (nodeIdx * 100) + (blockIdx * 50);
        
        transferPromises.push(
          (async () => {
            await sleep(delay);
            if (shouldStopRef.current) return;
            
            const transfer = {
              id: `transfer-${node.id}-${block}`,
              from: node,
              block: block,
            };
            
            setBlockTransfers(prev => [...prev, transfer]);
            
            await sleep(1200);
            if (shouldStopRef.current) return;
            
            setBlockTransfers(prev => prev.filter(t => t.id !== transfer.id));
            setReceivedBlocks(prev => [...prev, block]);
          })()
        );
      });
    });
    
    await Promise.all(transferPromises);
    await sleep(1500);
    if (shouldStopRef.current) return;
    
    // Step 5: Missing peer scenario
    setCurrentStep(5);
    await sleep(500);
    if (shouldStopRef.current) return;
    
    // Remove one peer
    setMissingPeer(1); // Remove p2
    setReceivedBlocks(prev => prev.filter(b => !['C', 'D'].includes(b)));
    await sleep(800);
    if (shouldStopRef.current) return;
    
    // Continue receiving from other peers
    const remainingTransfers = [];
    
    providerNodes.forEach((node, nodeIdx) => {
      if (nodeIdx === 1) return; // Skip the missing peer
      
      node.blocks.forEach((block, blockIdx) => {
        const delay = (nodeIdx * 100) + (blockIdx * 50);
        
        remainingTransfers.push(
          (async () => {
            await sleep(delay);
            if (shouldStopRef.current) return;
            
            const transfer = {
              id: `transfer2-${node.id}-${block}`,
              from: node,
              block: block,
            };
            
            setBlockTransfers(prev => [...prev, transfer]);
            
            await sleep(1200);
            if (shouldStopRef.current) return;
            
            setBlockTransfers(prev => prev.filter(t => t.id !== transfer.id));
            setReceivedBlocks(prev => [...prev, block]);
          })()
        );
      });
    });
    
    await Promise.all(remainingTransfers);
    await sleep(2000);
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
    const nextStep = currentStep >= 5 ? 1 : currentStep + 1;
    
    if (nextStep === 1) {
      resetAnimation();
      return;
    }
    
    setCurrentStep(nextStep);
    
    if (nextStep === 4) {
      setBlockRequests([]);
      setReceivedBlocks(allBlocks);
      setMissingPeer(null);
    } else if (nextStep === 5) {
      setBlockRequests([]);
      setReceivedBlocks(allBlocks.filter(b => !['C', 'D'].includes(b)));
      setMissingPeer(1);
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

  return (
    <div className="bitswap-container">
      <h1 className="bitswap-heading">IPFS Bitswap Block Exchange</h1>
      
      <div className="bitswap-control-buttons">
        {!isPlaying ? (
          <button className="bitswap-control-btn bitswap-start-btn" onClick={handleStart}>
            ▶ Start
          </button>
        ) : (
          <>
            <button className="bitswap-control-btn bitswap-pause-btn" onClick={handlePause}>
              {isPaused ? '▶ Resume' : '⏸ Pause'}
            </button>
            <button className="bitswap-control-btn bitswap-skip-btn" onClick={handleSkip}>
              ⏭ Skip
            </button>
            <button className="bitswap-control-btn bitswap-stop-btn" onClick={handleStop}>
              ⏹ Stop
            </button>
          </>
        )}
      </div>
      
      <div className="bitswap-visualization-area">
        <svg className="bitswap-svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
          {/* Step 1+: Requesting node */}
          {currentStep >= 1 && (
            <g>
              <circle
                cx={requestingNode.x}
                cy={requestingNode.y}
                r="4"
                className="bitswap-requester-node"
              />
              <text x={requestingNode.x} y={requestingNode.y - 8} className="bitswap-node-label">
                Requesting IPFS Node
              </text>
              {currentStep === 1 && (
                <text x={requestingNode.x} y={requestingNode.y + 10} className="bitswap-cid-text">
                  {cid}
                </text>
              )}
            </g>
          )}

          {/* Step 2+: Provider nodes */}
          {currentStep >= 2 && providerNodes.map((node, idx) => {
            const isMissing = missingPeer === idx;
            
            return (
              <g key={node.id}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="3"
                  className={`bitswap-provider-node ${isMissing ? 'missing' : ''}`}
                />
                {!isMissing && (
                  <>
                    <text x={node.x} y={node.y - 6} className="bitswap-small-label">
                      IPFS Node
                    </text>
                    <text x={node.x} y={node.y + 8} className="bitswap-block-label">
                      {node.blocks.join(',')}
                    </text>
                  </>
                )}
              </g>
            );
          })}

          {/* Step 3: Bitswap requests */}
          {currentStep === 3 && blockRequests.map((req) => (
            <line
              key={req.id}
              x1={requestingNode.x}
              y1={requestingNode.y}
              x2={req.to.x}
              y2={req.to.y}
              className="bitswap-request-line"
              markerEnd="url(#arrowhead-request)"
            />
          ))}

          {/* Step 4+: Block transfers */}
          {currentStep >= 4 && blockTransfers.map((transfer) => {
            const progress = 0.5; // Mid-flight position
            const x = transfer.from.x + (requestingNode.x - transfer.from.x) * progress;
            const y = transfer.from.y + (requestingNode.y - transfer.from.y) * progress;
            
            return (
              <g key={transfer.id}>
                <line
                  x1={transfer.from.x}
                  y1={transfer.from.y}
                  x2={requestingNode.x}
                  y2={requestingNode.y}
                  className="bitswap-transfer-line"
                />
                <rect
                  x={x - 2}
                  y={y - 1.5}
                  width="4"
                  height="3"
                  rx="0.5"
                  className="bitswap-block-in-flight"
                >
                  <animateMotion
                    dur="1.2s"
                    repeatCount="1"
                    path={`M ${transfer.from.x} ${transfer.from.y} L ${requestingNode.x} ${requestingNode.y}`}
                  />
                </rect>
                <text
                  x={x}
                  y={y - 2.5}
                  className="bitswap-block-text"
                >
                  <animateMotion
                    dur="1.2s"
                    repeatCount="1"
                    path={`M ${transfer.from.x} ${transfer.from.y} L ${requestingNode.x} ${requestingNode.y}`}
                  />
                  {transfer.block}
                </text>
              </g>
            );
          })}

          {/* Received blocks visualization */}
          {currentStep >= 4 && receivedBlocks.length > 0 && (
            <g className="received-blocks-group">
              {receivedBlocks.map((block, idx) => (
                <rect
                  key={`received-${block}`}
                  x={requestingNode.x - 15 + (idx * 3)}
                  y={requestingNode.y + 12}
                  width="2.5"
                  height="3"
                  rx="0.3"
                  className="bitswap-received-block"
                />
              ))}
            </g>
          )}

          <defs>
            <marker
              id="arrowhead-request"
              markerWidth="10"
              markerHeight="10"
              refX="5"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 6 3, 0 6" fill="#3498db" opacity="0.7" />
            </marker>
          </defs>

          {/* Labels */}
          {currentStep === 3 && (
            <text x="50" y="7" className="bitswap-step-label">
              Bitswap Requests
            </text>
          )}

          {currentStep === 4 && (
            <text x="50" y="7" className="bitswap-step-label">
              Parallel Block Transfer
            </text>
          )}

          {currentStep === 5 && (
            <text x="50" y="7" className="bitswap-step-label">
              Resilient Retrieval (Peer Offline)
            </text>
          )}
        </svg>
      </div>
    </div>
  );
};

export default IPFSBitswap;
