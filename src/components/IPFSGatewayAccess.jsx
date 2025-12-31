import React, { useState, useEffect, useRef } from 'react';
import './IPFSGatewayAccess.css';

const IPFSGatewayAccess = () => {
  const [step, setStep] = useState(0);
  const [retrievedBlocks, setRetrievedBlocks] = useState([]);
  const [verifiedBlocks, setVerifiedBlocks] = useState([]);
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

  const ipfsNodes = [
    { id: 'N1', x: 55, y: 70, hasBlocks: [0, 1] },
    { id: 'N2', x: 70, y: 65, hasBlocks: [2] },
    { id: 'N3', x: 85, y: 70, hasBlocks: [3] }
  ];

  const blocks = [
    { id: 'B0', label: 'A' },
    { id: 'B1', label: 'B' },
    { id: 'B2', label: 'C' },
    { id: 'B3', label: 'D' }
  ];

  const runSequence = async () => {
    shouldStopRef.current = false;
    setStep(0);
    setRetrievedBlocks([]);
    setVerifiedBlocks([]);

    // Scene 1: Browser Request
    setStep(1);
    await sleep(2000);
    if (shouldStopRef.current) return;

    // Scene 2: IPFS Gateway
    setStep(2);
    await sleep(2500);
    if (shouldStopRef.current) return;

    // Scene 3: IPFS Network
    setStep(3);
    await sleep(2500);
    if (shouldStopRef.current) return;

    // Scene 4: Block Retrieval
    setStep(4);
    await sleep(800);
    if (shouldStopRef.current) return;
    
    for (let i = 0; i < blocks.length; i++) {
      if (shouldStopRef.current) return;
      setRetrievedBlocks(prev => [...prev, blocks[i].id]);
      await sleep(500);
    }
    
    await sleep(600);
    if (shouldStopRef.current) return;
    
    for (let i = 0; i < blocks.length; i++) {
      if (shouldStopRef.current) return;
      setVerifiedBlocks(prev => [...prev, blocks[i].id]);
      await sleep(400);
    }
    
    await sleep(1000);
    if (shouldStopRef.current) return;

    // Scene 5: Content Delivery
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
      } else if (nextStep === 4) {
        setStep(4);
        setRetrievedBlocks([]);
        setVerifiedBlocks([]);
      } else if (nextStep === 5) {
        setStep(5);
        setRetrievedBlocks(blocks.map(b => b.id));
        setVerifiedBlocks(blocks.map(b => b.id));
      }
    }
  };

  const handleStop = () => {
    shouldStopRef.current = true;
    setIsPlaying(false);
    setIsPaused(false);
    setStep(0);
    setRetrievedBlocks([]);
    setVerifiedBlocks([]);
  };

  return (
    <div className="ipfs-gateway-access">
      <h2>Accessing IPFS Content via Gateway</h2>
      
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
        {/* Browser */}
        {step >= 1 && (
          <g className="browser-appear">
            {/* Browser window */}
            <rect x="5" y="18" width="25" height="18" rx="1.5" fill="#ecf0f1" stroke="#95a5a6" strokeWidth="0.4" />
            
            {/* Browser top bar */}
            <rect x="5" y="18" width="25" height="4" rx="1.5" fill="#34495e" />
            <circle cx="8" cy="20" r="0.6" fill="#e74c3c" />
            <circle cx="10" cy="20" r="0.6" fill="#f39c12" />
            <circle cx="12" cy="20" r="0.6" fill="#27ae60" />
            
            {/* Address bar */}
            <rect x="7" y="24" width="21" height="3" rx="1.5" fill="#fff" stroke="#bdc3c7" strokeWidth="0.2" />
            <text x="17.5" y="26.3" fontSize="1.8" fill="#3498db" textAnchor="middle" fontFamily="monospace">
              gateway.../Qm7x...
            </text>
            
            {/* Browser content area */}
            {step >= 5 && (
              <g className="content-appear">
                <rect x="8" y="29" width="4" height="3" fill="#3498db" opacity="0.3" />
                <line x1="13" y1="30" x2="26" y2="30" stroke="#95a5a6" strokeWidth="0.3" />
                <line x1="13" y1="31.5" x2="24" y2="31.5" stroke="#95a5a6" strokeWidth="0.3" />
                <rect x="8" y="33" width="18" height="2" fill="#27ae60" opacity="0.2" />
              </g>
            )}
            
            <text x="17.5" y="40" fontSize="2.5" fill="#555" textAnchor="middle">
              Browser
            </text>
          </g>
        )}

        {/* Browser to Gateway Request Arrow */}
        {step === 2 && (
          <g className="arrow-animate">
            <defs>
              <marker id="arrowhead-request" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                <polygon points="0 0, 10 3, 0 6" fill="#3498db" />
              </marker>
            </defs>
            <line
              x1="30"
              y1="27"
              x2="42"
              y2="27"
              stroke="#3498db"
              strokeWidth="0.5"
              markerEnd="url(#arrowhead-request)"
            />
          </g>
        )}

        {/* IPFS Gateway */}
        {step >= 2 && (
          <g className="gateway-appear">
            <rect x="43" y="21" width="12" height="12" rx="1" fill="#9b59b6" stroke="#8e44ad" strokeWidth="0.4" />
            <text x="49" y="26" fontSize="3" fill="#fff" textAnchor="middle" fontWeight="600">
              GW
            </text>
            <text x="49" y="29.5" fontSize="1.8" fill="#fff" textAnchor="middle">
              IPFS
            </text>
            
            <text x="49" y="38" fontSize="2.5" fill="#555" textAnchor="middle">
              IPFS Gateway
            </text>
            <text x="49" y="42" fontSize="2" fill="#777" textAnchor="middle" fontStyle="italic">
              HTTP ↔ IPFS Bridge
            </text>
          </g>
        )}

        {/* Gateway to Network Request */}
        {step >= 3 && (
          <g className="network-request">
            <line x1="55" y1="27" x2="65" y2="27" stroke="#9b59b6" strokeWidth="0.3" strokeDasharray="1,1" opacity="0.6" />
            <text x="60" y="25" fontSize="2" fill="#9b59b6" textAnchor="middle" fontWeight="600">
              CID: Qm7x...
            </text>
          </g>
        )}

        {/* IPFS Network Nodes */}
        {step >= 3 && ipfsNodes.map((node) => (
          <g key={node.id} className="node-appear">
            <circle cx={node.x} cy={node.y} r="3.5" fill="#3498db" stroke="#2980b9" strokeWidth="0.4" />
            <text x={node.x} y={node.y + 1} fontSize="2" fill="#fff" textAnchor="middle" fontWeight="600">
              {node.id}
            </text>
            
            {/* Small blocks in nodes */}
            {node.hasBlocks.map((blockIdx, i) => (
              <rect
                key={blockIdx}
                x={node.x - 2 + i * 1.5}
                y={node.y - 5.5}
                width="1.2"
                height="1"
                rx="0.2"
                fill="#fff"
                opacity="0.7"
              />
            ))}
          </g>
        ))}

        {/* Retrieved Blocks at Gateway */}
        {step >= 4 && blocks.map((block, index) => {
          const gatewayX = 49;
          const gatewayY = 48;
          const blockX = gatewayX - 6 + index * 3;
          
          return retrievedBlocks.includes(block.id) && (
            <g key={block.id}>
              <rect
                x={blockX}
                y={gatewayY}
                width="2.5"
                height="2"
                rx="0.3"
                fill="#3498db"
                stroke="#2980b9"
                strokeWidth="0.2"
                className="block-retrieve"
              />
              <text
                x={blockX + 1.25}
                y={gatewayY + 1.3}
                fontSize="1.5"
                fill="#fff"
                textAnchor="middle"
                fontWeight="600"
              >
                {block.label}
              </text>
              
              {/* Verification checkmark */}
              {verifiedBlocks.includes(block.id) && (
                <g className="checkmark-appear">
                  <circle cx={blockX + 2} cy={gatewayY - 0.5} r="0.8" fill="#27ae60" />
                  <path
                    d={`M ${blockX + 1.5} ${gatewayY - 0.5} L ${blockX + 1.9} ${gatewayY - 0.1} L ${blockX + 2.5} ${gatewayY - 0.9}`}
                    stroke="#fff"
                    strokeWidth="0.25"
                    fill="none"
                    strokeLinecap="round"
                  />
                </g>
              )}
            </g>
          );
        })}

        {/* Block flow arrows from nodes to gateway */}
        {step === 4 && retrievedBlocks.length > 0 && ipfsNodes.map((node) => (
          <line
            key={node.id}
            x1={node.x}
            y1={node.y - 3.5}
            x2="49"
            y2="48"
            stroke="#3498db"
            strokeWidth="0.3"
            strokeDasharray="1,1"
            opacity="0.4"
            className="flow-line"
          />
        ))}

        {/* Gateway to Browser Delivery */}
        {step === 5 && (
          <g className="delivery-animate">
            <defs>
              <marker id="arrowhead-delivery" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                <polygon points="0 0, 10 3, 0 6" fill="#27ae60" />
              </marker>
            </defs>
            <line
              x1="43"
              y1="27"
              x2="30"
              y2="27"
              stroke="#27ae60"
              strokeWidth="0.6"
              markerEnd="url(#arrowhead-delivery)"
            />
            <text x="36.5" y="24.5" fontSize="2" fill="#27ae60" textAnchor="middle" fontWeight="600">
              Content
            </text>
          </g>
        )}

        {/* Labels */}
        {step === 1 && (
          <text x="50" y="12" fontSize="4" fill="#555" textAnchor="middle" className="label-fade">
            CID Request via Gateway
          </text>
        )}

        {step === 3 && (
          <text x="50" y="12" fontSize="4" fill="#555" textAnchor="middle" className="label-fade">
            Content Lookup by CID
          </text>
        )}

        {step === 4 && (
          <text x="50" y="12" fontSize="4" fill="#555" textAnchor="middle" className="label-fade">
            Block Retrieval & Verification
          </text>
        )}

        {step === 5 && (
          <text x="50" y="92" fontSize="3.5" fill="#27ae60" textAnchor="middle" className="label-fade" fontWeight="600">
            ✓ Content Successfully Delivered
          </text>
        )}
      </svg>
    </div>
  );
};

export default IPFSGatewayAccess;
