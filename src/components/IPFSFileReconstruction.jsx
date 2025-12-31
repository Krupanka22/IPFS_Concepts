import React, { useState, useEffect, useRef } from 'react';
import './IPFSFileReconstruction.css';

const IPFSFileReconstruction = () => {
  const [step, setStep] = useState(0);
  const [verifiedBlocks, setVerifiedBlocks] = useState([]);
  const [orderedBlocks, setOrderedBlocks] = useState([]);
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
    { id: 'B1', hash: 'Qm7a...', order: 0, x: 20, y: 40 },
    { id: 'B2', hash: 'Qm9c...', order: 1, x: 35, y: 35 },
    { id: 'B3', hash: 'Qm4f...', order: 2, x: 50, y: 42 },
    { id: 'B4', hash: 'Qm2d...', order: 3, x: 65, y: 38 },
    { id: 'B5', hash: 'Qm8e...', order: 4, x: 80, y: 41 }
  ];

  const runSequence = async () => {
    shouldStopRef.current = false;
    setStep(0);
    setVerifiedBlocks([]);
    setOrderedBlocks([]);

    // Scene 1: Retrieved Blocks
    setStep(1);
    await sleep(2000);
    if (shouldStopRef.current) return;

    // Scene 2: Verification
    setStep(2);
    for (let i = 0; i < blocks.length; i++) {
      if (shouldStopRef.current) return;
      setVerifiedBlocks(prev => [...prev, blocks[i].id]);
      await sleep(600);
    }
    await sleep(1000);
    if (shouldStopRef.current) return;

    // Scene 3: Assembly Order
    setStep(3);
    await sleep(800);
    if (shouldStopRef.current) return;
    
    for (let i = 0; i < blocks.length; i++) {
      if (shouldStopRef.current) return;
      setOrderedBlocks(prev => [...prev, blocks[i].id]);
      await sleep(400);
    }
    await sleep(1200);
    if (shouldStopRef.current) return;

    // Scene 4: File Reconstruction
    setStep(4);
    await sleep(2500);
    if (shouldStopRef.current) return;

    // Scene 5: Final State
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
        setVerifiedBlocks(blocks.map(b => b.id));
      } else if (nextStep === 3) {
        setStep(3);
        setOrderedBlocks([]);
      } else if (nextStep === 4) {
        setStep(4);
        setOrderedBlocks(blocks.map(b => b.id));
      } else if (nextStep === 5) {
        setStep(5);
      }
    }
  };

  const handleStop = () => {
    shouldStopRef.current = true;
    setIsPlaying(false);
    setIsPaused(false);
    setStep(0);
    setVerifiedBlocks([]);
    setOrderedBlocks([]);
  };

  const getBlockPosition = (block) => {
    if (step >= 3 && orderedBlocks.includes(block.id)) {
      // Ordered position
      const orderIndex = orderedBlocks.indexOf(block.id);
      const totalOrdered = orderedBlocks.length;
      const spacing = 12;
      const totalWidth = (totalOrdered - 1) * spacing;
      const startX = 50 - totalWidth / 2;
      return { x: startX + orderIndex * spacing, y: 65 };
    }
    // Original scattered position
    return { x: block.x, y: block.y };
  };

  const getBlockOpacity = (block) => {
    if (step >= 4) return 0; // Hide individual blocks during merge
    return 1;
  };

  return (
    <div className="ipfs-file-reconstruction">
      <h2>File Reconstruction in IPFS</h2>
      
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
        {/* Network node (bottom left) */}
        {step >= 1 && (
          <g>
            <circle
              cx="15"
              cy="50"
              r="3"
              fill="#3498db"
              className="node-appear"
              opacity={step >= 5 ? 0.2 : 1}
            />
            <text
              x="15"
              y="56"
              fontSize="2.5"
              fill="#555"
              textAnchor="middle"
              opacity={step >= 5 ? 0.2 : 1}
            >
              Node
            </text>
          </g>
        )}

        {/* Retrieved Blocks */}
        {step >= 1 && blocks.map((block) => {
          const pos = getBlockPosition(block);
          const opacity = getBlockOpacity(block);
          
          return (
            <g key={block.id}>
              <rect
                x={pos.x - 4}
                y={pos.y - 3}
                width="8"
                height="6"
                rx="1"
                fill="#3498db"
                stroke="#2980b9"
                strokeWidth="0.3"
                opacity={opacity}
                className={step >= 3 && orderedBlocks.includes(block.id) ? 'block-move' : 'block-appear'}
              />
              {step >= 1 && step < 4 && (
                <text
                  x={pos.x}
                  y={pos.y + 8}
                  fontSize="2.5"
                  fill="#555"
                  textAnchor="middle"
                  opacity={opacity}
                >
                  {block.hash}
                </text>
              )}
              
              {/* Verification checkmark */}
              {step >= 2 && verifiedBlocks.includes(block.id) && step < 4 && (
                <g className="checkmark-appear">
                  <circle
                    cx={pos.x + 3.5}
                    cy={pos.y - 2}
                    r="1.5"
                    fill="#27ae60"
                    opacity={opacity}
                  />
                  <path
                    d={`M ${pos.x + 2.5} ${pos.y - 2} L ${pos.x + 3.2} ${pos.y - 1.2} L ${pos.x + 4.5} ${pos.y - 2.8}`}
                    stroke="#fff"
                    strokeWidth="0.4"
                    fill="none"
                    strokeLinecap="round"
                    opacity={opacity}
                  />
                </g>
              )}

              {/* Verification glow */}
              {step === 2 && verifiedBlocks.includes(block.id) && (
                <rect
                  x={pos.x - 4}
                  y={pos.y - 3}
                  width="8"
                  height="6"
                  rx="1"
                  fill="none"
                  stroke="#27ae60"
                  strokeWidth="0.5"
                  className="verify-glow"
                  opacity={opacity}
                />
              )}
            </g>
          );
        })}

        {/* Reconstructed File */}
        {step >= 4 && (
          <g className="file-appear">
            <rect
              x="35"
              y="60"
              width="30"
              height="20"
              rx="2"
              fill="#3498db"
              stroke="#2980b9"
              strokeWidth="0.4"
              className={step >= 4 ? 'file-merge' : ''}
            />
            <line x1="40" y1="66" x2="55" y2="66" stroke="#fff" strokeWidth="0.8" />
            <line x1="40" y1="70" x2="60" y2="70" stroke="#fff" strokeWidth="0.8" />
            <line x1="40" y1="74" x2="52" y2="74" stroke="#fff" strokeWidth="0.8" />
            
            {/* File corner fold */}
            <path
              d="M 62 60 L 62 65 L 65 65 Z"
              fill="#2980b9"
            />
          </g>
        )}

        {/* CID (final state) */}
        {step >= 5 && (
          <g className="cid-appear">
            <rect
              x="32"
              y="20"
              width="36"
              height="8"
              rx="4"
              fill="#e8f4f8"
              stroke="#3498db"
              strokeWidth="0.4"
            />
            <text
              x="50"
              y="24.5"
              fontSize="3"
              fill="#3498db"
              textAnchor="middle"
              fontWeight="600"
            >
              CID: QmX7b...
            </text>

            {/* Connection line from CID to File */}
            <line
              x1="50"
              y1="28"
              x2="50"
              y2="60"
              stroke="#3498db"
              strokeWidth="0.3"
              strokeDasharray="1,1"
              className="connection-appear"
            />
          </g>
        )}

        {/* Labels */}
        {step === 1 && (
          <text x="50" y="15" fontSize="4" fill="#555" textAnchor="middle" className="label-fade">
            Retrieved Blocks
          </text>
        )}

        {step === 2 && (
          <text x="50" y="15" fontSize="4" fill="#555" textAnchor="middle" className="label-fade">
            Hash Verification
          </text>
        )}

        {step === 3 && (
          <text x="50" y="15" fontSize="4" fill="#555" textAnchor="middle" className="label-fade">
            Block Ordering
          </text>
        )}

        {step === 4 && (
          <text x="50" y="15" fontSize="4" fill="#555" textAnchor="middle" className="label-fade">
            File Reconstructed
          </text>
        )}

        {step === 5 && (
          <text x="50" y="92" fontSize="3.5" fill="#27ae60" textAnchor="middle" className="label-fade" fontWeight="600">
            ✓ Original File Restored
          </text>
        )}
      </svg>
    </div>
  );
};

export default IPFSFileReconstruction;
