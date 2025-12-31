import React, { useState, useEffect, useRef } from 'react';
import './IPFSDHTDiscovery.css';

const IPFSDHTDiscovery = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [queryNodes, setQueryNodes] = useState([]);
  const [discoveredPeers, setDiscoveredPeers] = useState([]);
  const [showConnections, setShowConnections] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  const isPausedRef = useRef(false);
  const isPlayingRef = useRef(false);
  const shouldStopRef = useRef(false);

  // CID
  const cid = "QmXoypiz...";

  // Requesting node (initiator)
  const requesterNode = { id: 'requester', x: 50, y: 50 };

  // DHT nodes arranged in a distributed pattern
  const dhtNodes = [
    { id: 'n1', x: 50, y: 20, hasCID: false },
    { id: 'n2', x: 72, y: 25, hasCID: true },
    { id: 'n3', x: 85, y: 40, hasCID: false },
    { id: 'n4', x: 88, y: 60, hasCID: false },
    { id: 'n5', x: 75, y: 78, hasCID: true },
    { id: 'n6', x: 50, y: 85, hasCID: false },
    { id: 'n7', x: 25, y: 78, hasCID: false },
    { id: 'n8', x: 12, y: 60, hasCID: true },
    { id: 'n9', x: 15, y: 40, hasCID: false },
    { id: 'n10', x: 28, y: 25, hasCID: false },
    { id: 'n11', x: 65, y: 35, hasCID: false },
    { id: 'n12', x: 70, y: 55, hasCID: false },
    { id: 'n13', x: 60, y: 70, hasCID: false },
    { id: 'n14', x: 35, y: 65, hasCID: false },
    { id: 'n15', x: 30, y: 45, hasCID: false },
  ];

  // Query propagation path
  const queryPath = [
    'n1',   // First hop
    'n10',  // Second hop
    'n15',  // Third hop
    'n8',   // Discovers peer 1
    'n14',  
    'n13',  
    'n5',   // Discovers peer 2
    'n12',  
    'n11',  
    'n2',   // Discovers peer 3
  ];

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
    setQueryNodes([]);
    setDiscoveredPeers([]);
    setShowConnections(false);
  };

  const runSequence = async () => {
    shouldStopRef.current = false;
    resetAnimation();
    
    if (shouldStopRef.current) return;
    
    // Step 1: Show CID (2s)
    await sleep(2000);
    if (shouldStopRef.current) return;
    
    // Step 2: Show DHT network (2s)
    setCurrentStep(2);
    await sleep(2500);
    if (shouldStopRef.current) return;
    
    // Step 3: Query propagation
    setCurrentStep(3);
    await sleep(500);
    if (shouldStopRef.current) return;
    
    // Propagate query through nodes
    for (let i = 0; i < queryPath.length; i++) {
      if (shouldStopRef.current) return;
      setQueryNodes(prev => [...prev, queryPath[i]]);
      
      // Check if this node has the CID
      const node = dhtNodes.find(n => n.id === queryPath[i]);
      if (node && node.hasCID) {
        await sleep(300);
        setDiscoveredPeers(prev => [...prev, queryPath[i]]);
        await sleep(400);
      } else {
        await sleep(400);
      }
    }
    
    await sleep(1500);
    if (shouldStopRef.current) return;
    
    // Step 4: Highlight discovered peers
    setCurrentStep(4);
    await sleep(2000);
    if (shouldStopRef.current) return;
    
    // Step 5: Show connections to requester
    setCurrentStep(5);
    setShowConnections(true);
    await sleep(3000);
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
    
    if (nextStep === 3) {
      setQueryNodes(queryPath);
      setDiscoveredPeers(['n2', 'n5', 'n8']);
    } else if (nextStep === 4) {
      setQueryNodes(queryPath);
      setDiscoveredPeers(['n2', 'n5', 'n8']);
    } else if (nextStep === 5) {
      setQueryNodes(queryPath);
      setDiscoveredPeers(['n2', 'n5', 'n8']);
      setShowConnections(true);
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
    <div className="dht-discovery-container">
      <h1 className="dht-discovery-heading">IPFS Peer Discovery Using DHT</h1>
      
      <div className="dht-control-buttons">
        {!isPlaying ? (
          <button className="dht-control-btn dht-start-btn" onClick={handleStart}>
            ▶ Start
          </button>
        ) : (
          <>
            <button className="dht-control-btn dht-pause-btn" onClick={handlePause}>
              {isPaused ? '▶ Resume' : '⏸ Pause'}
            </button>
            <button className="dht-control-btn dht-skip-btn" onClick={handleSkip}>
              ⏭ Skip
            </button>
            <button className="dht-control-btn dht-stop-btn" onClick={handleStop}>
              ⏹ Stop
            </button>
          </>
        )}
      </div>
      
      <div className="dht-visualization-area">
        <svg className="dht-svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
          {/* Step 1: CID Query */}
          {currentStep === 1 && (
            <g>
              <text x="50" y="48" className="dht-cid-text">
                {cid}
              </text>
              <text x="50" y="55" className="dht-step-label">
                Requested CID
              </text>
            </g>
          )}

          {/* Step 2+: DHT Network */}
          {currentStep >= 2 && (
            <g>
              {/* Mesh connections between nearby nodes */}
              {dhtNodes.map((node, i) => 
                dhtNodes.slice(i + 1).map((otherNode, j) => {
                  const distance = Math.hypot(node.x - otherNode.x, node.y - otherNode.y);
                  if (distance < 30) {
                    return (
                      <line
                        key={`conn-${i}-${j}`}
                        x1={node.x}
                        y1={node.y}
                        x2={otherNode.x}
                        y2={otherNode.y}
                        className="dht-mesh-connection"
                      />
                    );
                  }
                  return null;
                })
              )}

              {/* DHT Nodes */}
              {dhtNodes.map((node) => {
                const isQueried = queryNodes.includes(node.id);
                const isDiscovered = discoveredPeers.includes(node.id);
                
                return (
                  <circle
                    key={node.id}
                    cx={node.x}
                    cy={node.y}
                    r="2.5"
                    className={`dht-node ${isQueried ? 'queried' : ''} ${isDiscovered ? 'discovered' : ''}`}
                  />
                );
              })}

              {/* Requester node */}
              <circle
                cx={requesterNode.x}
                cy={requesterNode.y}
                r="3"
                className="dht-requester-node"
              />
              <text x={requesterNode.x} y={requesterNode.y + 7} className="dht-node-label">
                Requester
              </text>
            </g>
          )}

          {/* Connections from discovered peers to requester */}
          {currentStep === 5 && showConnections && (
            <g>
              {discoveredPeers.map((peerId) => {
                const peer = dhtNodes.find(n => n.id === peerId);
                return (
                  <line
                    key={`conn-${peerId}`}
                    x1={peer.x}
                    y1={peer.y}
                    x2={requesterNode.x}
                    y2={requesterNode.y}
                    className="dht-discovery-connection"
                    markerEnd="url(#arrowhead-dht)"
                  />
                );
              })}
            </g>
          )}

          <defs>
            <marker
              id="arrowhead-dht"
              markerWidth="10"
              markerHeight="10"
              refX="5"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 6 3, 0 6" fill="#27ae60" opacity="0.8" />
            </marker>
          </defs>

          {/* Labels */}
          {currentStep === 2 && (
            <text x="50" y="7" className="dht-step-label">
              Distributed Hash Table (DHT)
            </text>
          )}

          {currentStep === 3 && (
            <text x="50" y="7" className="dht-step-label">
              Query Propagation
            </text>
          )}

          {currentStep === 4 && (
            <text x="50" y="7" className="dht-step-label">
              Peers Storing the Content
            </text>
          )}

          {currentStep === 5 && (
            <text x="50" y="7" className="dht-step-label">
              Discovery Complete
            </text>
          )}
        </svg>
      </div>
    </div>
  );
};

export default IPFSDHTDiscovery;
