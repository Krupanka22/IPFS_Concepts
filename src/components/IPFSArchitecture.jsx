import React from 'react';
import './IPFSArchitecture.css';

const IPFSArchitecture = () => {
  return (
    <div className="ipfs-architecture">
      <h2>IPFS Architecture</h2>

      <svg viewBox="0 0 100 165" className="architecture-diagram">
        <defs>
          <marker id="arrow-down" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <polygon points="0 0, 8 4, 0 8" fill="#7f8c8d" />
          </marker>
        </defs>

        {/* Layer 1: Application / User Layer */}
        <g className="layer">
          <text x="50" y="3.5" fontSize="3" fill="#2c3e50" textAnchor="middle">User / Application</text>
          
          <rect x="10" y="6" width="80" height="14" rx="2" fill="#ecf0f1" stroke="#95a5a6" strokeWidth="0.4" />
          
          {/* User icon */}
          <circle cx="20" cy="13" r="2" fill="#3498db" />
          <path d="M 20 15 L 20 19 M 18 17 L 22 17" stroke="#3498db" strokeWidth="0.6" fill="none" />
          <text x="20" y="22.5" fontSize="2.5" fill="#2c3e50" textAnchor="middle" fontWeight="500">User</text>
          
          {/* Application icon */}
          <rect x="38" y="10" width="6" height="6" rx="0.8" fill="#9b59b6" stroke="#8e44ad" strokeWidth="0.3" />
          <circle cx="41" cy="12.5" r="0.5" fill="#fff" />
          <rect x="39.5" y="14" width="3" height="0.8" fill="#fff" />
          <text x="41" y="22.5" fontSize="2.5" fill="#2c3e50" textAnchor="middle" fontWeight="500">App</text>
          
          {/* Browser icon */}
          <rect x="58" y="10" width="8" height="6" rx="0.5" fill="#34495e" stroke="#2c3e50" strokeWidth="0.3" />
          <rect x="58" y="10" width="8" height="1.5" rx="0.5" fill="#1abc9c" />
          <circle cx="59.5" cy="10.75" r="0.3" fill="#e74c3c" />
          <circle cx="60.5" cy="10.75" r="0.3" fill="#f39c12" />
          <text x="62" y="22.5" fontSize="2.5" fill="#2c3e50" textAnchor="middle" fontWeight="500">Browser</text>
        </g>

        {/* Arrow down */}
        <line x1="50" y1="20" x2="50" y2="25" stroke="#7f8c8d" strokeWidth="0.5" markerEnd="url(#arrow-down)" />

        {/* Layer 2: Access Layer */}
        <g className="layer">
          <text x="50" y="28" fontSize="3" fill="#2c3e50" textAnchor="middle">Access Layer (API / Gateway)</text>
          
          <rect x="10" y="30" width="80" height="12" rx="2" fill="#e8f4f8" stroke="#3498db" strokeWidth="0.4" />
          
          {/* IPFS API */}
          <rect x="25" y="33" width="15" height="6" rx="1" fill="#3498db" stroke="#2980b9" strokeWidth="0.4" />
          <text x="32.5" y="36.8" fontSize="3" fill="#fff" textAnchor="middle" fontWeight="600">API</text>
          
          {/* IPFS Gateway */}
          <rect x="60" y="33" width="15" height="6" rx="1" fill="#9b59b6" stroke="#8e44ad" strokeWidth="0.4" />
          <text x="67.5" y="35.5" fontSize="2.5" fill="#fff" textAnchor="middle" fontWeight="600">Gateway</text>
          <text x="67.5" y="38" fontSize="2" fill="#fff" textAnchor="middle">HTTP</text>
        </g>

        {/* Arrow down */}
        <line x1="50" y1="42" x2="50" y2="47" stroke="#7f8c8d" strokeWidth="0.5" markerEnd="url(#arrow-down)" />

        {/* Layer 3: Persistence Layer */}
        <g className="layer">
          <text x="50" y="50" fontSize="3" fill="#2c3e50" textAnchor="middle">Pinning & Garbage Collection</text>
          
          <rect x="10" y="52" width="80" height="12" rx="2" fill="#fef5e7" stroke="#f39c12" strokeWidth="0.4" />
          
          {/* Pin icon */}
          <circle cx="32" cy="57" r="1.5" fill="#e74c3c" />
          <rect x="31.4" y="58" width="1.2" height="3" fill="#e74c3c" />
          <text x="32" y="62.5" fontSize="2.5" fill="#2c3e50" textAnchor="middle" fontWeight="500">Pin</text>
          
          {/* Garbage Collection */}
          <circle cx="68" cy="57" r="2" fill="none" stroke="#95a5a6" strokeWidth="0.5" />
          <path d="M 66.5 56 L 69.5 58.5 M 66.5 58.5 L 69.5 56" stroke="#95a5a6" strokeWidth="0.6" />
          <text x="68" y="62.5" fontSize="2.5" fill="#2c3e50" textAnchor="middle" fontWeight="500">GC</text>
        </g>

        {/* Arrow down */}
        <line x1="50" y1="64" x2="50" y2="69" stroke="#7f8c8d" strokeWidth="0.5" markerEnd="url(#arrow-down)" />

        {/* Layer 4: Exchange Layer (Bitswap) */}
        <g className="layer">
          <text x="50" y="72" fontSize="3" fill="#2c3e50" textAnchor="middle">Bitswap (Block Exchange)</text>
          
          <rect x="10" y="74" width="80" height="12" rx="2" fill="#e8f8f5" stroke="#1abc9c" strokeWidth="0.4" />
          
          {/* Peer nodes exchanging blocks */}
          <circle cx="25" cy="80" r="2" fill="#1abc9c" />
          <circle cx="45" cy="80" r="2" fill="#1abc9c" />
          <circle cx="65" cy="80" r="2" fill="#1abc9c" />
          <circle cx="75" cy="80" r="2" fill="#1abc9c" />
          
          {/* Blocks */}
          <rect x="33" y="79" width="1.5" height="1.2" rx="0.2" fill="#3498db" opacity="0.9" />
          <rect x="35" y="79" width="1.5" height="1.2" rx="0.2" fill="#3498db" opacity="0.9" />
          <rect x="53" y="79" width="1.5" height="1.2" rx="0.2" fill="#3498db" opacity="0.9" />
          <rect x="55" y="79" width="1.5" height="1.2" rx="0.2" fill="#3498db" opacity="0.9" />
          
          {/* Exchange arrows */}
          <line x1="27" y1="80" x2="43" y2="80" stroke="#e74c3c" strokeWidth="0.4" opacity="0.7" />
          <line x1="47" y1="80" x2="63" y2="80" stroke="#e74c3c" strokeWidth="0.4" opacity="0.7" />
        </g>

        {/* Arrow down */}
        <line x1="50" y1="86" x2="50" y2="91" stroke="#7f8c8d" strokeWidth="0.5" markerEnd="url(#arrow-down)" />

        {/* Layer 5: Routing Layer (DHT) */}
        <g className="layer">
          <text x="50" y="94" fontSize="3" fill="#2c3e50" textAnchor="middle">DHT (Peer Discovery)</text>
          
          <rect x="10" y="96" width="80" height="12" rx="2" fill="#fdeef4" stroke="#e91e63" strokeWidth="0.4" />
          
          {/* DHT ring */}
          <circle cx="50" cy="102" r="5" fill="none" stroke="#e91e63" strokeWidth="0.4" strokeDasharray="1,0.5" />
          
          {/* Nodes on ring */}
          <circle cx="50" cy="97" r="0.9" fill="#e91e63" />
          <circle cx="55" cy="102" r="0.9" fill="#e91e63" />
          <circle cx="50" cy="107" r="0.9" fill="#e91e63" />
          <circle cx="45" cy="102" r="0.9" fill="#e91e63" />
          <circle cx="52.5" cy="99" r="0.9" fill="#e91e63" />
          <circle cx="52.5" cy="105" r="0.9" fill="#e91e63" />
          
          {/* CID lookup arrows */}
          <path d="M 50 97 L 52.5 99" stroke="#f39c12" strokeWidth="0.4" fill="none" opacity="0.8" />
          <path d="M 52.5 99 L 55 102" stroke="#f39c12" strokeWidth="0.4" fill="none" opacity="0.8" />
        </g>

        {/* Arrow down */}
        <line x1="50" y1="108" x2="50" y2="113" stroke="#7f8c8d" strokeWidth="0.5" markerEnd="url(#arrow-down)" />

        {/* Layer 6: Networking Layer (libp2p) */}
        <g className="layer">
          <text x="50" y="116" fontSize="3" fill="#2c3e50" textAnchor="middle">libp2p Networking</text>
          
          <rect x="10" y="118" width="80" height="12" rx="2" fill="#e8eaf6" stroke="#673ab7" strokeWidth="0.4" />
          
          {/* Peer nodes */}
          <circle cx="30" cy="124" r="2" fill="#673ab7" />
          <circle cx="50" cy="124" r="2" fill="#673ab7" />
          <circle cx="70" cy="124" r="2" fill="#673ab7" />
          
          {/* Secure connections */}
          <line x1="32" y1="124" x2="48" y2="124" stroke="#27ae60" strokeWidth="0.6" />
          <line x1="52" y1="124" x2="68" y2="124" stroke="#27ae60" strokeWidth="0.6" />
          
          {/* Lock icons */}
          <rect x="39.5" y="123.2" width="1" height="1.2" rx="0.2" fill="#27ae60" />
          <path d="M 39.7 123.2 L 39.7 122.7 Q 39.7 122.2 40 122.2 Q 40.3 122.2 40.3 122.7 L 40.3 123.2" stroke="#27ae60" strokeWidth="0.2" fill="none" />
        </g>

        {/* Arrow down */}
        <line x1="50" y1="130" x2="50" y2="135" stroke="#7f8c8d" strokeWidth="0.5" markerEnd="url(#arrow-down)" />

        {/* Layer 7: Data Model Layer (Merkle DAG) */}
        <g className="layer">
          <text x="50" y="138" fontSize="3" fill="#2c3e50" textAnchor="middle">Merkle DAG & Content Addressing (CID)</text>
          
          <rect x="10" y="140" width="80" height="20" rx="2" fill="#fef9e7" stroke="#f1c40f" strokeWidth="0.4" />
          
          {/* File blocks */}
          <rect x="18" y="153" width="3" height="2.5" rx="0.3" fill="#3498db" stroke="#2980b9" strokeWidth="0.3" />
          <rect x="22" y="153" width="3" height="2.5" rx="0.3" fill="#3498db" stroke="#2980b9" strokeWidth="0.3" />
          <rect x="26" y="153" width="3" height="2.5" rx="0.3" fill="#3498db" stroke="#2980b9" strokeWidth="0.3" />
          <rect x="30" y="153" width="3" height="2.5" rx="0.3" fill="#3498db" stroke="#2980b9" strokeWidth="0.3" />
          
          {/* Hash symbols */}
          <text x="19.5" y="152" fontSize="2.5" fill="#f39c12" textAnchor="middle" fontWeight="600">#</text>
          <text x="23.5" y="152" fontSize="2.5" fill="#f39c12" textAnchor="middle" fontWeight="600">#</text>
          <text x="27.5" y="152" fontSize="2.5" fill="#f39c12" textAnchor="middle" fontWeight="600">#</text>
          <text x="31.5" y="152" fontSize="2.5" fill="#f39c12" textAnchor="middle" fontWeight="600">#</text>
          
          {/* Merkle DAG tree */}
          {/* Level 2 nodes */}
          <circle cx="22" cy="148" r="1.3" fill="#e74c3c" stroke="#c0392b" strokeWidth="0.3" />
          <circle cx="29" cy="148" r="1.3" fill="#e74c3c" stroke="#c0392b" strokeWidth="0.3" />
          
          {/* Lines from blocks to level 2 */}
          <line x1="19.5" y1="153" x2="22" y2="149.3" stroke="#95a5a6" strokeWidth="0.3" />
          <line x1="23.5" y1="153" x2="22" y2="149.3" stroke="#95a5a6" strokeWidth="0.3" />
          <line x1="27.5" y1="153" x2="29" y2="149.3" stroke="#95a5a6" strokeWidth="0.3" />
          <line x1="31.5" y1="153" x2="29" y2="149.3" stroke="#95a5a6" strokeWidth="0.3" />
          
          {/* Root node (CID) */}
          <circle cx="25.5" cy="143.5" r="1.8" fill="#27ae60" stroke="#229954" strokeWidth="0.4" />
          <text x="25.5" y="144.3" fontSize="1.8" fill="#fff" textAnchor="middle" fontWeight="600">CID</text>
          
          {/* Lines from level 2 to root */}
          <line x1="22" y1="146.7" x2="25.5" y2="145.3" stroke="#95a5a6" strokeWidth="0.3" />
          <line x1="29" y1="146.7" x2="25.5" y2="145.3" stroke="#95a5a6" strokeWidth="0.3" />
          
          {/* Right side - simplified representation */}
          <text x="60" y="148" fontSize="3.5" fill="#3498db" textAnchor="middle" fontWeight="600">File → Blocks</text>
          <text x="60" y="152.5" fontSize="3" fill="#f39c12" textAnchor="middle" fontWeight="600">Hash → CID</text>
          <text x="60" y="156.5" fontSize="2.5" fill="#e74c3c" textAnchor="middle" fontWeight="600">Merkle DAG</text>
        </g>
      </svg>
    </div>
  );
};

export default IPFSArchitecture;
