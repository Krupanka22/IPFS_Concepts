import React, { useState, useEffect } from 'react';
import './AddressingModels.css';

const AddressingModels = () => {
  const [locationRequest, setLocationRequest] = useState(null);
  const [locationDataPackets, setLocationDataPackets] = useState([]);
  
  const [contentRequest, setContentRequest] = useState(null);
  const [contentDataBlocks, setContentDataBlocks] = useState([]);
  const [assembledBlocks, setAssembledBlocks] = useState([]);

  // Location-addressed nodes
  const locationServer = { id: 'server', x: 50, y: 20 };
  const locationClient = { id: 'client', x: 50, y: 80 };

  // Content-addressed IPFS nodes
  const ipfsNodes = [
    { id: 'node1', x: 30, y: 20 },
    { id: 'node2', x: 70, y: 20 },
    { id: 'node3', x: 20, y: 40 },
    { id: 'node4', x: 50, y: 35 },
    { id: 'node5', x: 80, y: 40 },
    { id: 'node6', x: 35, y: 55 },
    { id: 'node7', x: 65, y: 55 },
  ];
  const contentClient = { id: 'content-client', x: 50, y: 80 };

  // Generate mesh connections for IPFS
  const getIPFSConnections = () => {
    const connections = [];
    for (let i = 0; i < ipfsNodes.length; i++) {
      for (let j = i + 1; j < ipfsNodes.length; j++) {
        const distance = Math.hypot(
          ipfsNodes[i].x - ipfsNodes[j].x,
          ipfsNodes[i].y - ipfsNodes[j].y
        );
        if (distance < 40) {
          connections.push({ from: ipfsNodes[i], to: ipfsNodes[j] });
        }
      }
    }
    return connections;
  };

  const ipfsConnections = getIPFSConnections();

  // Animate location-addressed requests
  useEffect(() => {
    const interval = setInterval(() => {
      // Send URL request
      setLocationRequest({
        id: Date.now(),
        label: 'server/path/file.pdf',
        from: locationClient,
        to: locationServer,
      });

      setTimeout(() => setLocationRequest(null), 1200);

      // Send data packets back
      setTimeout(() => {
        for (let i = 0; i < 4; i++) {
          setTimeout(() => {
            const packet = {
              id: Date.now() + i,
              from: locationServer,
              to: locationClient,
            };
            setLocationDataPackets(prev => [...prev, packet]);
            setTimeout(() => {
              setLocationDataPackets(prev => prev.filter(p => p.id !== packet.id));
            }, 1500);
          }, i * 250);
        }
      }, 1300);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Animate content-addressed requests
  useEffect(() => {
    const interval = setInterval(() => {
      // Send CID request
      setContentRequest({
        id: Date.now(),
        cid: 'QmX4f8k...',
      });

      setTimeout(() => setContentRequest(null), 1200);

      // Send blocks from multiple nodes
      setTimeout(() => {
        const selectedNodes = ipfsNodes.slice(0, 5);

        selectedNodes.forEach((node, i) => {
          setTimeout(() => {
            const block = {
              id: Date.now() + i,
              from: node,
              to: contentClient,
              blockNum: i + 1,
            };
            setContentDataBlocks(prev => [...prev, block]);
            
            setTimeout(() => {
              setContentDataBlocks(prev => prev.filter(b => b.id !== block.id));
              setAssembledBlocks(prev => [...prev, block.blockNum]);
            }, 1500);
          }, i * 180);
        });

        // Clear assembled blocks
        setTimeout(() => {
          setAssembledBlocks([]);
        }, 3500);
      }, 1300);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="addressing-container">
      <h1 className="addressing-heading">File Access Models</h1>
      
      <div className="addressing-split-layout">
        {/* Location-Addressed Section */}
        <div className="addressing-section location-section">
          <svg className="addressing-svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
            {/* Connection line */}
            <line
              x1={locationClient.x}
              y1={locationClient.y}
              x2={locationServer.x}
              y2={locationServer.y}
              className="location-connection"
              markerEnd="url(#arrowhead-location)"
            />

            <defs>
              <marker
                id="arrowhead-location"
                markerWidth="10"
                markerHeight="10"
                refX="5"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 6 3, 0 6" fill="#3498db" opacity="0.6" />
              </marker>
            </defs>
            
            {/* Server */}
            <rect
              x={locationServer.x - 8}
              y={locationServer.y - 5}
              width="16"
              height="10"
              rx="2"
              className="location-server"
            />
            <text x={locationServer.x} y={locationServer.y - 10} className="diagram-label">
              Location-Addressed Storage
            </text>

            {/* Client */}
            <circle
              cx={locationClient.x}
              cy={locationClient.y}
              r="4"
              className="location-client"
            />
            <text x={locationClient.x} y={locationClient.y + 8} className="node-label-small">
              Browser
            </text>

            {/* Architecture label */}
            <text x={locationClient.x} y={95} className="architecture-label">
              Client–Server Architecture
            </text>

            {/* URL Request animation */}
            {locationRequest && (
              <text
                x={locationRequest.from.x}
                y={locationRequest.from.y}
                className="request-label location-request"
              >
                <animate
                  attributeName="y"
                  from={locationRequest.from.y}
                  to={locationRequest.to.y}
                  dur="1.2s"
                  fill="freeze"
                />
                URL → {locationRequest.label}
              </text>
            )}

            {/* Data packets */}
            {locationDataPackets.map(packet => (
              <rect
                key={packet.id}
                x={packet.from.x - 2}
                y={packet.from.y}
                width="4"
                height="3"
                rx="0.5"
                className="data-block location-data"
              >
                <animate
                  attributeName="y"
                  from={packet.from.y}
                  to={packet.to.y}
                  dur="1.5s"
                  fill="freeze"
                />
              </rect>
            ))}
          </svg>
        </div>

        {/* Content-Addressed Section */}
        <div className="addressing-section content-section">
          <svg className="addressing-svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
            {/* IPFS mesh connections */}
            {ipfsConnections.map((conn, idx) => (
              <line
                key={idx}
                x1={conn.from.x}
                y1={conn.from.y}
                x2={conn.to.x}
                y2={conn.to.y}
                className="ipfs-mesh-connection"
              />
            ))}

            {/* Connections from nodes to client */}
            {ipfsNodes.map(node => (
              <line
                key={`client-${node.id}`}
                x1={node.x}
                y1={node.y}
                x2={contentClient.x}
                y2={contentClient.y}
                className="ipfs-client-connection"
              />
            ))}

            {/* IPFS Nodes */}
            {ipfsNodes.map(node => (
              <g key={node.id}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="3"
                  className="ipfs-peer-node"
                />
              </g>
            ))}

            {/* Diagram label */}
            <text x={50} y={8} className="diagram-label">
              Content-Addressed Storage (IPFS)
            </text>

            {/* Client */}
            <circle
              cx={contentClient.x}
              cy={contentClient.y}
              r="4"
              className="content-client-node"
            />
            <text x={contentClient.x} y={contentClient.y + 8} className="node-label-small">
              Browser
            </text>

            {/* Architecture label */}
            <text x={50} y={95} className="architecture-label">
              Peer-to-Peer Architecture
            </text>

            {/* CID Request */}
            {contentRequest && (
              <text
                x={contentClient.x}
                y={contentClient.y - 5}
                className="request-label content-request"
              >
                <animate
                  attributeName="opacity"
                  values="0;1;1;0"
                  dur="1.2s"
                  fill="freeze"
                />
                CID → {contentRequest.cid}
              </text>
            )}

            {/* Data blocks from nodes */}
            {contentDataBlocks.map(block => (
              <rect
                key={block.id}
                x={block.from.x - 1.5}
                y={block.from.y}
                width="3"
                height="2"
                rx="0.3"
                className="data-block content-data"
              >
                <animate
                  attributeName="x"
                  from={block.from.x - 1.5}
                  to={block.to.x - 1.5}
                  dur="1.5s"
                  fill="freeze"
                />
                <animate
                  attributeName="y"
                  from={block.from.y}
                  to={block.to.y - 10}
                  dur="1.5s"
                  fill="freeze"
                />
              </rect>
            ))}

            {/* Assembled blocks */}
            {assembledBlocks.length > 0 && (
              <g className="assembled-file-group">
                {assembledBlocks.map((blockNum, idx) => (
                  <rect
                    key={blockNum}
                    x={contentClient.x - 7 + (idx * 2.5)}
                    y={contentClient.y - 15}
                    width="2"
                    height="4"
                    rx="0.3"
                    className="assembled-block-item"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  />
                ))}
              </g>
            )}
          </svg>
        </div>
      </div>
    </div>
  );
};

export default AddressingModels;
