import { useState } from 'react';
import './App.css';
import AddressingModels from './components/AddressingModels.jsx';
import IPFSFileToCID from './components/IPFSFileToCID.jsx';
import IPFSMerkleDAG from './components/IPFSMerkleDAG.jsx';
import IPFSDHTDiscovery from './components/IPFSDHTDiscovery.jsx';
import IPFSBitswap from './components/IPFSBitswap.jsx';
import IPFSFileReconstruction from './components/IPFSFileReconstruction.jsx';
import IPFSPinningServiceWorkflow from './components/IPFSPinningServiceWorkflow.jsx';
import IPFSGatewayAccess from './components/IPFSGatewayAccess.jsx';
import IPFSArchitecture from './components/IPFSArchitecture.jsx';

function App() {
  const [activeComponent, setActiveComponent] = useState('addressing');

  return (
    <div className="App">
      <nav className="navbar">
        <div className="nav-brand">IPFS Visualizations</div>
        <div className="nav-links">
          <button
            className={activeComponent === 'addressing' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setActiveComponent('addressing')}
          >
            IPFS Overview
          </button>
          <button
            className={activeComponent === 'file-to-cid' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setActiveComponent('file-to-cid')}
          >
            File to CID
          </button>
          <button
            className={activeComponent === 'merkle-dag' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setActiveComponent('merkle-dag')}
          >
            Merkle DAG
          </button>
          <button
            className={activeComponent === 'dht-discovery' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setActiveComponent('dht-discovery')}
          >
            DHT Discovery
          </button>
          <button
            className={activeComponent === 'bitswap' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setActiveComponent('bitswap')}
          >
            Bitswap
          </button>
          <button
            className={activeComponent === 'reconstruction' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setActiveComponent('reconstruction')}
          >
            File Reconstruction
          </button>
          <button
            className={activeComponent === 'pinning' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setActiveComponent('pinning')}
          >
            Pinning Service
          </button>
          <button
            className={activeComponent === 'gateway' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setActiveComponent('gateway')}
          >
            Gateway Access
          </button>
          <button
            className={activeComponent === 'architecture' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setActiveComponent('architecture')}
          >
            Architecture
          </button>
        </div>
      </nav>
      
      <div className="content">
        {activeComponent === 'addressing' && <AddressingModels />}
        {activeComponent === 'file-to-cid' && <IPFSFileToCID />}
        {activeComponent === 'merkle-dag' && <IPFSMerkleDAG />}
        {activeComponent === 'dht-discovery' && <IPFSDHTDiscovery />}
        {activeComponent === 'bitswap' && <IPFSBitswap />}
        {activeComponent === 'reconstruction' && <IPFSFileReconstruction />}
        {activeComponent === 'pinning' && <IPFSPinningServiceWorkflow />}
        {activeComponent === 'gateway' && <IPFSGatewayAccess />}
        {activeComponent === 'architecture' && <IPFSArchitecture />}
      </div>
    </div>
  );
}

export default App;
