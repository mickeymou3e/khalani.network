import React from 'react';
import './App.css';
import Web3Provider from 'web3-react'
import { Connectors } from 'web3-react'
import Web3 from 'web3'

import Activator from './web3/connector'

const { NetworkOnlyConnector } = Connectors



function App() {

  const Infura = new NetworkOnlyConnector({
    providerURL: 'https://mainnet.infura.io/v3/581996b3a5b944949630f2535e9bb59b'
  })
   
  const connectors = { Infura }


  return (
    <div>
      <Web3Provider
        connectors={connectors} libraryName={'web3.js'} web3Api={Web3}
      >

      <Activator/>

      </Web3Provider>
    </div>
  );
}

export default App;
